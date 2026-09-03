/**
 * Règlement de combat sur grille (Sprint 2, ticket #1, `vibe/design/plan_grille_combat.md` §3-5bis).
 * Fonctions pures : aucun accès DB, aucun HTTP, le jet de dé (`d20`) est toujours fourni en
 * paramètre plutôt que généré ici — ce qui les rend testables de façon exhaustive sans mocker
 * l'aléatoire (voir `combat-resolution.service.test.ts`).
 *
 * Reprend le règlement précédemment codé côté client dans `combat-test.ts` (tickets #2-#4) : ce
 * module en devient la seule source de vérité côté serveur (US #27/#28/#30 du ticket #1). Les
 * routes de `carte.routes.ts` (`/franchir`, `/detruire`) tirent le d20 et appellent ces fonctions.
 *
 * `determinerModeAttaque`/`determinerPorteeAttaquePersonnage`/`determinerPorteeAttaqueCreature`
 * n'ont volontairement pas de route dédiée : l'attaque (§5bis) n'utilise aucun dé (dégâts fixes),
 * et les ennemis du banc d'essai ne sont pas encore des entités persistées (pas de table
 * `Creature`, Sprint 3). Elles sont donc dupliquées côté client (`combat-test.ts`) pour l'affichage
 * réactif à chaque rendu — même schéma de duplication assumée que `CATEGORIES_DEUX_MAINS` dans
 * `personnage.routes.ts` (ce module-ci reste la version canonique et testée), MAIS sans l'exécution
 * serveur qui accompagne `CATEGORIES_DEUX_MAINS` (la route `acheter` l'applique réellement) : la
 * règle CLAUDE.md "toute règle de jeu validée côté serveur" n'est donc satisfaite qu'à moitié pour
 * l'attaque — seuls Franchir/Détruire (routes `carte.routes.ts`) le sont pleinement ce ticket-ci.
 */

export type AxeInteractionObstacle = "ETROIT" | "HAUTEUR";
export type PresetObstacle = "LEGER" | "MOYEN" | "LOURD";
export type ModeAttaque = "MELEE" | "DISTANCE";
export type PorteeAttaqueCreature = "MELEE" | "DISTANCE";

/** Seuils et bonus/malus (§5) : DC modérée façon d20, pas une magnitude sourcée dans le Codex — voir CLAUDE.md. */
export const SEUIL_FRANCHISSEMENT = 12;
export const SEUIL_RESISTANCE = 12;
const BONUS_RACIAL = 2;
const MALUS_RACIAL = -2;
const LEGER_MALUS_RACIAL = -1;

/** Dégâts fixes par tentative de destruction réussie — même valeur que l'attaque (§5bis). */
export const DEGATS_FIXES = 5;

/** Table race × axe d'interaction (§4) — bonus/malus au jet de Franchir. */
const TABLE_RACE_INTERACTION: Record<string, Record<AxeInteractionObstacle, number>> = {
  nain: { ETROIT: BONUS_RACIAL, HAUTEUR: MALUS_RACIAL },
  elfe: { ETROIT: MALUS_RACIAL, HAUTEUR: BONUS_RACIAL },
  humain: { ETROIT: 0, HAUTEUR: 0 },
  "demi-orc": { ETROIT: MALUS_RACIAL, HAUTEUR: 0 },
  mage: { ETROIT: 0, HAUTEUR: LEGER_MALUS_RACIAL },
};

/** Catégories équipées en MAIN_DROITE qui attaquent à distance sans se déplacer (§5bis). */
const CATEGORIES_ARME_DISTANCE = ["ARME_DISTANCE", "ARME_JET", "OBJET_MAGIQUE"];

/** Portée d'attaque des créatures du Bestiaire (MELEE/DISTANCE → cases) — cf. `PORTEE_CASES` dans `client/src/data/bestiaire.ts`. */
const PORTEE_ATTAQUE_CREATURE: Record<PorteeAttaqueCreature, number> = {
  MELEE: 1,
  DISTANCE: 5,
};

export interface InteractionRaciale {
  bonusMalus: number;
  /** Esquive Elfe (§4) : immunité totale au malus de tout obstacle "Léger", cumulable avec `bonusMalus`. */
  ignoreMalusObstacle: boolean;
}

/**
 * Bonus/malus racial au jet de Franchir selon l'axe d'interaction de l'obstacle (étroit/hauteur),
 * plus le cas spécial Elfe/obstacle-léger — indépendant de l'axe, cumulable.
 */
export function determinerInteractionRaciale(
  raceId: string,
  axeInteraction: AxeInteractionObstacle,
  presetObstacle: PresetObstacle
): InteractionRaciale {
  return {
    bonusMalus: TABLE_RACE_INTERACTION[raceId]?.[axeInteraction] ?? 0,
    ignoreMalusObstacle: raceId === "elfe" && presetObstacle === "LEGER",
  };
}

export interface ParamsFranchissement {
  d20: number;
  dexterite: number;
  raceId: string;
  axeInteraction: AxeInteractionObstacle;
  presetObstacle: PresetObstacle;
  malusDexterite: number;
}

export interface ResultatFranchissement {
  succes: boolean;
  d20: number;
  jet: number;
  bonusMalusRacial: number;
  ignoreMalusObstacle: boolean;
  malusObstacleApplique: number;
}

/**
 * Franchir = d20 + Dextérité + bonus/malus racial (§4) − malus de l'obstacle ≥ Seuil de
 * franchissement. Suppose que l'obstacle est franchissable et le personnage adjacent — ces
 * préconditions (state-dépendantes : position, flag franchissable) sont vérifiées par l'appelant
 * (route), pas ici.
 */
export function resoudreFranchissement(params: ParamsFranchissement): ResultatFranchissement {
  const { bonusMalus, ignoreMalusObstacle } = determinerInteractionRaciale(
    params.raceId,
    params.axeInteraction,
    params.presetObstacle
  );
  const malusObstacleApplique = ignoreMalusObstacle ? 0 : params.malusDexterite;
  const jet = params.d20 + params.dexterite + bonusMalus - malusObstacleApplique;
  return {
    succes: jet >= SEUIL_FRANCHISSEMENT,
    d20: params.d20,
    jet,
    bonusMalusRacial: bonusMalus,
    ignoreMalusObstacle,
    malusObstacleApplique,
  };
}

export interface ParamsDestruction {
  d20: number;
  force: number;
  pvActuels: number;
}

export interface ResultatDestruction {
  succes: boolean;
  d20: number;
  jet: number;
  pvRestants: number;
  detruit: boolean;
}

/**
 * Détruire = d20 + Force ≥ Seuil de résistance. Succès = -5 PV fixes ; à 0 PV l'obstacle est
 * détruit. Aucun plancher de rattrapage (asymétrie de Force assumée, §5) : un échec ne change rien
 * aux PV.
 */
export function resoudreDestruction(params: ParamsDestruction): ResultatDestruction {
  const jet = params.d20 + params.force;
  const succes = jet >= SEUIL_RESISTANCE;
  const pvRestants = succes ? Math.max(0, params.pvActuels - DEGATS_FIXES) : params.pvActuels;
  return { succes, d20: params.d20, jet, pvRestants, detruit: succes && pvRestants <= 0 };
}

/**
 * Mêlée/distance selon la catégorie de l'arme en MAIN_DROITE, jamais selon la race (§5bis) :
 * ARME_DISTANCE/ARME_JET/OBJET_MAGIQUE (Bâton/Grimoire du Mage) → distance ; ARME_LEGERE/ARME_LOURDE
 * ou aucune arme équipée (mains nues) → mêlée.
 */
export function determinerModeAttaque(categorieArmeMainDroite: string | null): ModeAttaque {
  return categorieArmeMainDroite !== null && CATEGORIES_ARME_DISTANCE.includes(categorieArmeMainDroite)
    ? "DISTANCE"
    : "MELEE";
}

/**
 * Portée d'attaque d'un joueur (placeholder temporaire, pas de donnée Bestiaire dédiée, §5bis) : un
 * attaquant à distance porte jusqu'à sa portée de déplacement (Dextérité) sans bouger ; un
 * attaquant de mêlée doit être adjacent (1 case). Chemin distinct de `determinerPorteeAttaqueCreature`
 * — ne jamais les confondre (US #26).
 */
export function determinerPorteeAttaquePersonnage(mode: ModeAttaque, dexterite: number): number {
  return mode === "DISTANCE" ? dexterite : 1;
}

/**
 * Portée d'attaque d'une créature du Bestiaire : donnée propre (`MELEE`/`DISTANCE`), indépendante
 * de son déplacement — comportement `agirEnnemi` existant, inchangé. Chemin distinct de
 * `determinerPorteeAttaquePersonnage` — ne jamais les confondre (US #26).
 */
export function determinerPorteeAttaqueCreature(porteeAttaqueBestiaire: PorteeAttaqueCreature): number {
  return PORTEE_ATTAQUE_CREATURE[porteeAttaqueBestiaire];
}
