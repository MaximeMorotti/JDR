import { prisma } from "../db";

/** Ordre croissant des paliers d'armure, pour comparer une armure au maximum autorisé par une classe. */
const ORDRE_POIDS_ARMURE: Record<string, number> = {
  AUCUNE: 0,
  LEGERE: 1,
  MOYENNE: 2,
  LOURDE: 3,
};

export class ErreurValidation extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ErreurValidation";
  }
}

/**
 * Vérifie qu'une classe est accessible à une race donnée.
 * Case absente de la matrice ("—" dans le Codex) = bloquant.
 * "Déconseillé" = accepté, jamais bloquant (règle CLAUDE.md).
 */
export async function validerRaceClasse(raceId: string, classeId: string) {
  const lien = await prisma.classeAutoriseeParRace.findUnique({
    where: { raceId_classeId: { raceId, classeId } },
  });
  if (!lien) {
    throw new ErreurValidation(
      `La classe "${classeId}" n'est pas accessible à la race "${raceId}".`
    );
  }
  return { deconseille: lien.deconseille };
}

/** Vérifie que la taille actuelle de l'équipe permet d'ajouter un personnage (max 4). */
export async function validerTailleEquipe(equipeId: string) {
  const nb = await prisma.personnage.count({ where: { equipeId } });
  if (nb >= 4) {
    throw new ErreurValidation("Une équipe ne peut pas dépasser 4 personnages.");
  }
}

/** Vérifie que le budget de l'équipe couvre le prix demandé. */
export async function validerBudget(equipeId: string, prix: number) {
  const equipe = await prisma.equipe.findUniqueOrThrow({ where: { id: equipeId } });
  if (equipe.orRestant < prix) {
    throw new ErreurValidation(
      `Budget insuffisant : ${equipe.orRestant} po restantes, ${prix} po requises.`
    );
  }
}

/**
 * Vérifie qu'un objet peut être acheté et équipé par un personnage :
 * - l'objet doit être vendu en boutique (origine ACHAT_VILLAGE) — le stuff SPAWN_GRATUIT/LOOT/CRAFT
 *   n'est jamais accessible via cette route ;
 * - la catégorie de l'objet doit être autorisée pour la classe du personnage ;
 * - pour une armure/bouclier, le poids ne doit pas dépasser le maximum autorisé par la classe.
 */
export async function validerEquipement(personnageId: string, objetId: string) {
  const personnage = await prisma.personnage.findUniqueOrThrow({
    where: { id: personnageId },
    include: { classe: { include: { categoriesArmesAutorisees: true } } },
  });
  const objet = await prisma.objetRef.findUniqueOrThrow({ where: { id: objetId } });

  if (objet.origine !== "ACHAT_VILLAGE") {
    throw new ErreurValidation(
      `"${objet.nom}" n'est pas disponible à l'achat (origine : ${objet.origine}).`
    );
  }

  const categorieAutorisee = personnage.classe.categoriesArmesAutorisees.some(
    (c) => c.categorie === objet.categorie
  );
  // Les accessoires (collier/anneau/bracelet/ceinture/cape/carquois) et l'armure de corps
  // ne sont pas soumis aux catégories d'armes : seule la restriction de poids d'armure s'applique.
  const estAccessoireOuArmure = objet.type === "ACCESSOIRE" || objet.type === "ARMURE";
  if (!estAccessoireOuArmure && !categorieAutorisee) {
    throw new ErreurValidation(
      `La classe "${personnage.classeId}" ne peut pas équiper la catégorie "${objet.categorie}".`
    );
  }

  if ((objet.type === "ARMURE" || objet.type === "BOUCLIER") && objet.poidsArmure) {
    const poidsObjet = ORDRE_POIDS_ARMURE[objet.poidsArmure] ?? 0;
    const poidsMaxClasse = ORDRE_POIDS_ARMURE[personnage.classe.armureMax] ?? 0;
    if (poidsObjet > poidsMaxClasse) {
      throw new ErreurValidation(
        `La classe "${personnage.classeId}" ne peut pas porter d'armure ${objet.poidsArmure} (max autorisé : ${personnage.classe.armureMax}).`
      );
    }
  }

  return { personnage, objet };
}

/**
 * Vérifie qu'un compagnon est accessible à une équipe :
 * - prérequis de race (cas particulier de la Fée) ;
 * - prérequis de classe (au moins une classe liée présente dans l'équipe).
 * Un compagnon sans aucun prérequis (aucune ligne dans classesLiees, raceRequiseId nul) est
 * toujours accessible (aucun cas dans le catalogue actuel, mais couvert par cohérence).
 */
export async function validerCompagnon(equipeId: string, compagnonId: string) {
  const compagnon = await prisma.compagnonRef.findUniqueOrThrow({
    where: { id: compagnonId },
    include: { classesLiees: true },
  });
  const personnages = await prisma.personnage.findMany({ where: { equipeId } });

  if (compagnon.raceRequiseId) {
    const raceOk = personnages.some((p) => p.raceId === compagnon.raceRequiseId);
    if (!raceOk) {
      throw new ErreurValidation(
        `"${compagnon.nom}" nécessite un personnage de race "${compagnon.raceRequiseId}" dans l'équipe.`
      );
    }
  }

  if (compagnon.classesLiees.length > 0) {
    const classesRequises = compagnon.classesLiees.map((c) => c.classeId);
    const classeOk = personnages.some((p) => classesRequises.includes(p.classeId));
    if (!classeOk) {
      throw new ErreurValidation(
        `"${compagnon.nom}" nécessite l'une de ces classes dans l'équipe : ${classesRequises.join(", ")}.`
      );
    }
  }

  const dejaChoisi = await prisma.compagnonEquipe.findUnique({ where: { equipeId } });
  if (dejaChoisi) {
    throw new ErreurValidation("Cette équipe a déjà choisi un compagnon (un seul autorisé).");
  }
}
