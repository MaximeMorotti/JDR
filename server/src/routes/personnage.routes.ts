import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import {
  ErreurValidation,
  validerBudget,
  validerEquipement,
  validerRaceClasse,
  validerTailleEquipe,
} from "../services/validation.service";

export const personnageRouter = Router({ mergeParams: true });

/** Emplacements d'équipement valides (cf. fiche_technique_joueur_personnage.md §5). */
const EMPLACEMENTS = [
  "TETE",
  "TORSE",
  "BRAS_GAUCHE",
  "BRAS_DROIT",
  "BAS",
  "PIED",
  "MAIN_DROITE",
  "MAIN_GAUCHE",
  "ANNEAU_1",
  "ANNEAU_2",
  "BRACELET_1",
  "BRACELET_2",
  "COLLIER",
  "CEINTURE",
  "CAPE",
  "CARQUOIS",
] as const;

/** Objets ObjetRef.emplacement dont l'emplacement réel se choisit parmi 2 slots identiques. */
const FAMILLES_MULTI_SLOTS: Record<string, readonly string[]> = {
  ANNEAU: ["ANNEAU_1", "ANNEAU_2"],
  BRACELET: ["BRACELET_1", "BRACELET_2"],
};

/** Les 3 classes de Mage (cf. écart documenté dans CLAUDE.md : le Codex modélise "le Mage" comme
 * 1 classe à 3 écoles choisies à la création, implémenté ici comme 3 classes indépendantes). */
const CLASSES_MAGE = ["mage-elementaire", "mage-noir", "mage-blanc"];

/** Stuff verrouillé et gratuit du Mage, assigné automatiquement à la création (cf. Codex de l'Équipement). */
const STUFF_SPAWN_MAGE = [
  { objetId: "baton-apprenti", emplacement: "MAIN_DROITE" },
  { objetId: "grimoire-apprenti", emplacement: "MAIN_GAUCHE" },
  { objetId: "robe-apprenti", emplacement: "TORSE" },
] as const;

const creerPersonnageSchema = z.object({
  pseudo: z.string().trim().min(1, "Le pseudo est requis."),
  raceId: z.string().min(1),
  classeId: z.string().min(1),
});

/**
 * POST /api/equipes/:equipeId/personnages
 * Crée un personnage : valide race/classe/taille d'équipe, copie les stats de base raciales,
 * puis assigne automatiquement le stuff gratuit du Mage le cas échéant.
 *
 * La spécialisation n'est PAS choisie ici : elle décrit un arbre de compétences (skill tree)
 * à débloquer/améliorer en progressant, pas un choix exclusif fait une fois pour toutes à la
 * création. Cet arbre reste à concevoir (écart identifié après coup, voir CLAUDE.md) — en
 * attendant, Personnage.specialisationId reste toujours null au Sprint 1 ; le catalogue des
 * spécialisations de la classe est seulement affiché à titre informatif côté client.
 */
personnageRouter.post("/", async (req, res) => {
  // `equipeId` provient du segment dynamique du routeur parent (mergeParams) — cast explicite.
  const { equipeId } = req.params as { equipeId: string };
  const parsed = creerPersonnageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ erreur: parsed.error.issues[0]?.message });
  }
  const { pseudo, raceId, classeId } = parsed.data;

  try {
    await validerTailleEquipe(equipeId);
    const { deconseille } = await validerRaceClasse(raceId, classeId);

    const race = await prisma.raceRef.findUniqueOrThrow({ where: { id: raceId } });

    const personnage = await prisma.$transaction(async (tx) => {
      const cree = await tx.personnage.create({
        data: {
          pseudo,
          equipeId,
          raceId,
          classeId,
          force: race.force,
          dexterite: race.dexterite,
          vitalite: race.vitalite,
          charisme: race.charisme,
          intelligence: race.intelligence,
          sagesse: race.sagesse,
          chance: race.chance,
          perception: race.perception,
        },
      });

      // Stuff verrouillé et gratuit du Mage — assigné directement, jamais via la route boutique.
      if (CLASSES_MAGE.includes(classeId)) {
        for (const item of STUFF_SPAWN_MAGE) {
          await tx.inventairePersonnage.create({
            data: {
              personnageId: cree.id,
              objetId: item.objetId,
              emplacement: item.emplacement,
              prixPaye: 0,
            },
          });
        }
      }

      return cree;
    });

    const personnageComplet = await prisma.personnage.findUnique({
      where: { id: personnage.id },
      include: { race: true, classe: { include: { categoriesArmesAutorisees: true } }, specialisation: true, inventaire: { include: { objet: true } } },
    });

    res.status(201).json({ personnage: personnageComplet, deconseille });
  } catch (e) {
    if (e instanceof ErreurValidation) {
      return res.status(400).json({ erreur: e.message });
    }
    if (e instanceof Error && "code" in e && (e as { code?: string }).code === "P2002") {
      return res.status(409).json({ erreur: "Ce pseudo est déjà utilisé dans cette équipe." });
    }
    throw e;
  }
});

/** GET /api/equipes/:equipeId/personnages/:id — fiche complète d'un personnage. */
personnageRouter.get("/:id", async (req, res) => {
  const { equipeId } = req.params as { id: string; equipeId: string };
  const personnage = await prisma.personnage.findFirst({
    where: { id: req.params.id, equipeId },
    include: { race: true, classe: { include: { categoriesArmesAutorisees: true } }, specialisation: true, inventaire: { include: { objet: true } } },
  });
  if (!personnage) {
    return res.status(404).json({ erreur: "Personnage introuvable." });
  }
  res.json(personnage);
});

const modifierPersonnageSchema = z.object({
  pseudo: z.string().trim().min(1).optional(),
  specialisationId: z.string().min(1).nullable().optional(),
});

/** PATCH /api/equipes/:equipeId/personnages/:id — modifier le pseudo ou la spécialisation. */
personnageRouter.patch("/:id", async (req, res) => {
  const parsed = modifierPersonnageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ erreur: parsed.error.issues[0]?.message });
  }
  try {
    const personnage = await prisma.personnage.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json(personnage);
  } catch (e) {
    if (e instanceof Error && "code" in e && (e as { code?: string }).code === "P2002") {
      return res.status(409).json({ erreur: "Ce pseudo est déjà utilisé dans cette équipe." });
    }
    throw e;
  }
});

/** DELETE /api/equipes/:equipeId/personnages/:id — supprime un personnage (cascade sur l'inventaire). */
personnageRouter.delete("/:id", async (req, res) => {
  await prisma.personnage.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

const acheterSchema = z.object({
  objetId: z.string().min(1),
  emplacement: z.enum(EMPLACEMENTS),
});

/**
 * POST /api/equipes/:equipeId/personnages/:id/acheter
 * Achète un objet en boutique et l'équipe sur le personnage : déduit le prix du budget d'équipe.
 */
personnageRouter.post("/:id/acheter", async (req, res) => {
  const { equipeId, id: personnageId } = req.params as { equipeId: string; id: string };
  const parsed = acheterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ erreur: parsed.error.issues[0]?.message });
  }
  const { objetId, emplacement } = parsed.data;

  try {
    const { objet } = await validerEquipement(personnageId, objetId);

    const famille = FAMILLES_MULTI_SLOTS[objet.emplacement ?? ""];
    const slotValide = famille ? famille.includes(emplacement) : emplacement === objet.emplacement;
    if (!slotValide) {
      throw new ErreurValidation(
        `"${objet.nom}" ne peut pas être équipé à l'emplacement "${emplacement}".`
      );
    }

    const dejaOccupe = await prisma.inventairePersonnage.findUnique({
      where: { personnageId_emplacement: { personnageId, emplacement } },
    });
    if (dejaOccupe) {
      throw new ErreurValidation(`L'emplacement "${emplacement}" est déjà occupé.`);
    }

    const prix = objet.prix ?? 0;
    await validerBudget(equipeId, prix);

    const inventaire = await prisma.$transaction(async (tx) => {
      const item = await tx.inventairePersonnage.create({
        data: { personnageId, objetId, emplacement, prixPaye: prix },
        include: { objet: true },
      });
      await tx.equipe.update({
        where: { id: equipeId },
        data: { orRestant: { decrement: prix } },
      });
      return item;
    });

    res.status(201).json(inventaire);
  } catch (e) {
    if (e instanceof ErreurValidation) {
      return res.status(400).json({ erreur: e.message });
    }
    throw e;
  }
});

/**
 * DELETE /api/equipes/:equipeId/personnages/:id/inventaire/:inventaireId
 * Retire un objet et rembourse son prix au budget de l'équipe.
 */
personnageRouter.delete("/:id/inventaire/:inventaireId", async (req, res) => {
  const { equipeId, inventaireId } = req.params as { id: string; equipeId: string; inventaireId: string };
  const item = await prisma.inventairePersonnage.findUnique({ where: { id: inventaireId } });
  if (!item) {
    return res.status(404).json({ erreur: "Objet d'inventaire introuvable." });
  }

  await prisma.$transaction(async (tx) => {
    await tx.inventairePersonnage.delete({ where: { id: inventaireId } });
    if (item.prixPaye > 0) {
      await tx.equipe.update({
        where: { id: equipeId },
        data: { orRestant: { increment: item.prixPaye } },
      });
    }
  });

  res.status(204).send();
});
