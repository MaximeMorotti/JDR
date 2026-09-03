import { api, type ObstacleCarte, type Personnage } from "../api";
import { naviguer } from "../router";
import { state } from "../state";
import { CREATURES, PORTEE_CASES, type CreatureBestiaire, type ZoneBestiaire } from "../data/bestiaire";

/**
 * Banc d'essai purement client pour le Sprint 2 (déplacement sur grille) — pas de table `Carte` ni
 * `Creature` en base, pas de persistance : juste de quoi valider la mécanique de base avant de
 * construire le vrai système. Le modèle d'obstacle générique (PV/franchissable/malus/axe
 * d'interaction, presets Léger/Moyen/Lourd + case infranchissable de zone) suit
 * vibe/design/plan_grille_combat.md §3 et ADR-0001. Les modes dédiés "Franchir"/"Détruire" (§4-5)
 * lancent le jet de dé correspondant sur un obstacle adjacent au personnage sélectionné ; en dehors
 * de ces modes, un obstacle reste totalement bloquant pour le déplacement normal (`casesAtteignables`
 * — vraie table Creature au Sprint 3).
 * Grille "octogonale" = grille carrée avec les 8 directions autorisées (distance de Chebyshev), pas
 * un pavage hexagonal — reconfirmé explicitement avec l'utilisateur.
 * Dimensions, obstacles et tranchées viennent désormais de la carte persistée en base (ticket #5,
 * `GET /api/cartes/:id`) — plus aucune donnée de carte codée en dur ici. Pas de sélection de carte
 * en UI à ce stade (§9 du plan) : on charge toujours la même carte de test connue par son id fixe.
 */
const ID_CARTE_TEST = "carte-test";
const TAILLE_CASE = 42;

const ZONES: ZoneBestiaire[] = ["Forêt", "Ruines", "Grotte", "Village", "Boss"];

type Ennemi = { instanceId: string; creature: CreatureBestiaire; x: number; y: number; pv: number };
type Position = { x: number; y: number };
type PresetObstacle = "LEGER" | "MOYEN" | "LOURD";
/**
 * Passage étroit (crevasse) vs franchissement en hauteur — axe consommé par la table race ×
 * interaction (§4, voir `TABLE_RACE_INTERACTION`).
 */
type AxeInteractionObstacle = "ETROIT" | "HAUTEUR";

/**
 * Obstacle générique (vibe/design/plan_grille_combat.md §3, ADR-0001) : PV, franchissabilité,
 * malus de Dextérité et axe d'interaction sont des champs libres par instance, pas une catégorie
 * figée en base — les presets ci-dessous ne sont que des raccourcis pratiques à la pose. Reste
 * totalement bloquant pour le déplacement normal (voir `casesAtteignables`) : seuls les modes dédiés
 * "Franchir"/"Détruire" (§5) permettent de le contourner, via un jet explicite.
 * L'infranchissable de zone (gouffre, ravin) est un cas à part hors de cette échelle : jamais de
 * PV, jamais destructible, jamais franchissable.
 */
type Obstacle =
  | {
      categorie: "GENERIQUE";
      preset: PresetObstacle;
      pv: number;
      franchissable: boolean;
      malusDexterite: number;
      axeInteraction: AxeInteractionObstacle;
    }
  | { categorie: "INFRANCHISSABLE_ZONE" };

/** Presets de PV/franchissabilité suggérés à la pose (§3) — raccourcis pratiques, ajustables ensuite. */
const PRESETS_OBSTACLE: Record<
  PresetObstacle,
  {
    label: string;
    exemple: string;
    pv: number;
    franchissable: boolean;
    malusDexterite: number;
    axeInteraction: AxeInteractionObstacle;
  }
> = {
  LEGER: { label: "Léger", exemple: "Caisse, muret fragile, tonneau", pv: 5, franchissable: true, malusDexterite: 1, axeInteraction: "ETROIT" },
  MOYEN: { label: "Moyen", exemple: "Rocher, tronc couché", pv: 25, franchissable: true, malusDexterite: 2, axeInteraction: "ETROIT" },
  LOURD: { label: "Lourd", exemple: "Mur en pierre, porte renforcée", pv: 50, franchissable: false, malusDexterite: 3, axeInteraction: "HAUTEUR" },
};

/** Configuration en cours d'édition dans le panneau de pose (mode "Poser un obstacle"). */
type ConfigPoseObstacle = {
  preset: PresetObstacle | "INFRANCHISSABLE_ZONE";
  pv: number;
  franchissable: boolean;
  malusDexterite: number;
  axeInteraction: AxeInteractionObstacle;
};

function configDepuisPreset(preset: PresetObstacle): ConfigPoseObstacle {
  const p = PRESETS_OBSTACLE[preset];
  return { preset, pv: p.pv, franchissable: p.franchissable, malusDexterite: p.malusDexterite, axeInteraction: p.axeInteraction };
}

/**
 * Case "Souterrain / Tranchée" (vibe/design/plan_grille_combat.md §2) — matérialisation probable du
 * nœud Vitalité "Creuser une tranchée" du Nain (codex_arbre_competences.md). Ne bloque jamais la
 * case (contrairement à un obstacle) : n'importe qui peut s'y tenir. Seul le coût de déplacement
 * change selon la race — le Nain y passe normalement, les autres payent un pas supplémentaire.
 * La visibilité réduite et la protection aux dégâts pour le Nain dépendent du moteur de combat
 * (Sprint 3), pas codées ici.
 */
const COUT_TRANCHEE_NON_NAIN = 2;

/**
 * Règles de combat simplifiées du banc d'essai (§5bis) : le MJ IA n'arrive qu'au Sprint 5, donc
 * mêlée/distance et portée d'attaque sont des placeholders déterministes, explicitement temporaires
 * — à remplacer par le vrai moteur de combat par arme/classe (Sprint 3).
 */
type ModeAttaque = "MELEE" | "DISTANCE";

/** Catégories équipées en MAIN_DROITE qui attaquent à distance sans se déplacer (§5bis). */
const CATEGORIES_ARME_DISTANCE = ["ARME_DISTANCE", "ARME_JET", "OBJET_MAGIQUE"];

/** Dégâts fixes par attaque réussie — même valeur temporaire que la destruction d'obstacle (§5). */
const DEGATS_ATTAQUE_FIXES = 5;

/**
 * Mêlée/distance selon la catégorie de l'arme en MAIN_DROITE, jamais selon la race (§5bis) :
 * ARME_DISTANCE/ARME_JET/OBJET_MAGIQUE (Bâton/Grimoire du Mage) → distance ; ARME_LEGERE/ARME_LOURDE
 * ou aucune arme équipée (mains nues) → mêlée.
 * Dupliqué côté client pour l'affichage réactif à chaque rendu (exactement comme
 * `CATEGORIES_DEUX_MAINS` dans `personnage.routes.ts`) — la version canonique et testée est
 * `determinerModeAttaque` dans `server/src/services/combat-resolution.service.ts`. Contrairement à
 * Franchir/Détruire, l'attaque n'utilise aucun dé (dégâts fixes) et cible un ennemi qui n'est pas
 * encore une entité persistée (pas de table `Creature`, Sprint 3) : ticket #1 ne l'a donc PAS fait
 * passer par une route serveur — la règle "toute règle de jeu validée côté serveur" (CLAUDE.md)
 * reste seulement partiellement satisfaite ici, en attendant le vrai moteur de combat.
 */
function determinerModeAttaque(personnage: Personnage): ModeAttaque {
  const armeMainDroite = personnage.inventaire.find((item) => item.emplacement === "MAIN_DROITE");
  if (armeMainDroite && CATEGORIES_ARME_DISTANCE.includes(armeMainDroite.objet.categorie)) {
    return "DISTANCE";
  }
  return "MELEE";
}

/**
 * Portée d'attaque d'un joueur (pas de donnée Bestiaire dédiée, placeholder) : un attaquant à
 * distance porte jusqu'à sa portée de déplacement (Dextérité) sans bouger ; un attaquant de mêlée
 * doit être adjacent (Chebyshev 1) à sa cible. Dupliqué côté client comme `determinerModeAttaque`
 * ci-dessus — version canonique et testée : `determinerPorteeAttaquePersonnage` dans
 * `combat-resolution.service.ts`.
 */
function porteeAttaquePersonnage(personnage: Personnage, mode: ModeAttaque): number {
  return mode === "DISTANCE" ? porteeDeplacement(personnage.dexterite) : 1;
}

function cleCase(x: number, y: number): string {
  return `${x},${y}`;
}

/** Portée de déplacement pour un repositionnement simple (pas d'obstacle) : la Dextérité, sans dé. */
function porteeDeplacement(dexterite: number): number {
  return dexterite;
}

function distanceChebyshev(a: Position, b: Position): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

/** Les 8 directions d'un pas (lignes droites + diagonales). */
const DIRECTIONS_8: [number, number][] = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

/**
 * Jets de franchissement/destruction (vibe/design/plan_grille_combat.md §5) :
 *   Franchir  = d20 + Dextérité + bonus/malus racial (§4) − malus de l'obstacle ≥ Seuil de franchissement
 *   Détruire  = d20 + Force ≥ Seuil de résistance
 * Le d20 et le règlement (table race × interaction, esquive Elfe, seuils) sont désormais résolus
 * côté serveur (`server/src/services/combat-resolution.service.ts`, ticket #1) via
 * `api.tenterFranchir`/`api.tenterDetruire` — ce fichier ne fait plus que les préconditions
 * d'affichage instantané (adjacence, franchissable) et l'appel réseau ; il n'y a plus qu'une seule
 * source de vérité pour le règlement.
 */

function formatSigne(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

export async function renderCombatTest(app: HTMLElement) {
  const equipeId = state.equipeId;
  if (!equipeId) return naviguer("/accueil");

  const [equipe, carte] = await Promise.all([api.obtenirEquipe(equipeId), api.obtenirCarte(ID_CARTE_TEST)]);
  if (equipe.personnages.length === 0) return naviguer("/equipe");

  const COLONNES = carte.largeur;
  const LIGNES = carte.hauteur;

  // Positions de départ des personnages : en ligne, centrées en bas de la grille.
  const positions = new Map<string, Position>();
  const depart = Math.floor((COLONNES - equipe.personnages.length * 2 + 1) / 2);
  equipe.personnages.forEach((p, i) => {
    positions.set(p.id, { x: depart + i * 2, y: LIGNES - 2 });
  });

  const ennemis: Ennemi[] = [];
  const obstacles = new Map<string, Obstacle>(
    carte.layout.obstacles.map((o: ObstacleCarte) => [
      cleCase(o.x, o.y),
      o.categorie === "INFRANCHISSABLE_ZONE"
        ? { categorie: "INFRANCHISSABLE_ZONE" as const }
        : {
            categorie: "GENERIQUE" as const,
            preset: o.preset,
            pv: o.pv,
            franchissable: o.franchissable,
            malusDexterite: o.malusDexterite,
            axeInteraction: o.axeInteraction,
          },
    ])
  );
  const tranchees = new Set<string>(carte.layout.tranchees.map((t) => cleCase(t.x, t.y)));
  let selectionneId: string | null = null;
  let modeObstacle = false;
  let modeTranchee = false;
  let modeFranchir = false;
  let modeDetruire = false;
  let configPose: ConfigPoseObstacle = configDepuisPreset("LEGER");
  let prochainInstanceId = 1;
  const journal: string[] = [];

  function caseOccupee(x: number, y: number, ignorerInstanceId?: string): boolean {
    if (obstacles.has(cleCase(x, y))) return true;
    if ([...positions.values()].some((pos) => pos.x === x && pos.y === y)) return true;
    return ennemis.some((e) => e.instanceId !== ignorerInstanceId && e.x === x && e.y === y);
  }

  /**
   * Cases réellement atteignables depuis `depart` en `portee` pas maximum, en tenant compte des
   * obstacles ET des cases déjà occupées comme des murs (on ne peut pas les traverser, pas
   * seulement s'y arrêter) — un obstacle coupe donc la route plutôt que d'être simplement
   * "impossible d'atterrir dessus". Coût variable par case (Dijkstra, pas une simple BFS) : 1 pas
   * normalement, 2 pas pour traverser une case Tranchée si le déplaceur n'est pas un Nain.
   */
  function casesAtteignables(depart: Position, portee: number, estNain: boolean, ignorerInstanceId?: string): Set<string> {
    const distance = new Map<string, number>();
    distance.set(cleCase(depart.x, depart.y), 0);
    const visite = new Set<string>();
    for (;;) {
      let courantCle: string | null = null;
      let courantDist = Infinity;
      for (const [cle, d] of distance) {
        if (!visite.has(cle) && d < courantDist) {
          courantDist = d;
          courantCle = cle;
        }
      }
      if (courantCle === null || courantDist >= portee) break;
      visite.add(courantCle);
      const [cx, cy] = courantCle.split(",").map(Number) as [number, number];
      for (const [dx, dy] of DIRECTIONS_8) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || x >= COLONNES || y < 0 || y >= LIGNES) continue;
        const cle = cleCase(x, y);
        if (visite.has(cle)) continue;
        if (caseOccupee(x, y, ignorerInstanceId)) continue;
        const coutPas = tranchees.has(cle) && !estNain ? COUT_TRANCHEE_NON_NAIN : 1;
        const nouvelleDistance = courantDist + coutPas;
        if (nouvelleDistance > portee) continue;
        if (!distance.has(cle) || nouvelleDistance < distance.get(cle)!) {
          distance.set(cle, nouvelleDistance);
        }
      }
    }
    distance.delete(cleCase(depart.x, depart.y));
    return new Set(distance.keys());
  }

  /** Place un nouvel ennemi sur la première case libre en haut de la grille, ligne par ligne. */
  function trouverCaseLibreHaut(): Position {
    for (let y = 0; y < LIGNES; y++) {
      for (let x = 0; x < COLONNES; x++) {
        if (!caseOccupee(x, y)) return { x, y };
      }
    }
    return { x: 0, y: 0 };
  }

  /**
   * Pose/retire un obstacle selon la config choisie dans le panneau de pose (preset ou
   * infranchissable de zone) — mode toggle activé par le bouton dédié. En dehors de ce mode, un
   * obstacle bloque totalement la case pour le déplacement normal (voir `casesAtteignables`) ; les
   * modes "Franchir"/"Détruire" (ci-dessous) sont les seuls moyens de le contourner.
   */
  function basculerObstacle(x: number, y: number) {
    const cle = cleCase(x, y);
    if (obstacles.has(cle)) {
      obstacles.delete(cle);
      journal.push(`Obstacle retiré en (${x}, ${y}).`);
    } else if (!caseOccupee(x, y) && !tranchees.has(cle)) {
      if (configPose.preset === "INFRANCHISSABLE_ZONE") {
        obstacles.set(cle, { categorie: "INFRANCHISSABLE_ZONE" });
        journal.push(`Case infranchissable de zone posée en (${x}, ${y}) — gouffre, jamais franchissable ni destructible.`);
      } else {
        const { preset, pv, franchissable, malusDexterite, axeInteraction } = configPose;
        obstacles.set(cle, { categorie: "GENERIQUE", preset, pv, franchissable, malusDexterite, axeInteraction });
        const detail = franchissable
          ? `franchissable (malus Dex -${malusDexterite}, axe ${axeInteraction === "ETROIT" ? "passage étroit" : "franchissement en hauteur"})`
          : "infranchissable";
        journal.push(`Obstacle ${PRESETS_OBSTACLE[preset].label} posé en (${x}, ${y}) — ${pv} PV, ${detail}.`);
      }
    }
    rendre();
  }

  /**
   * Pose/retire une case Souterrain/Tranchée — ne bloque jamais le passage (contrairement à un
   * obstacle), juste un coût de déplacement différent selon la race (voir casesAtteignables).
   */
  function basculerTranchee(x: number, y: number) {
    const cle = cleCase(x, y);
    if (tranchees.has(cle)) {
      tranchees.delete(cle);
      journal.push(`Tranchée comblée en (${x}, ${y}).`);
    } else if (!caseOccupee(x, y)) {
      tranchees.add(cle);
      journal.push(`Tranchée creusée en (${x}, ${y}) — abri pour un Nain, -1 case de déplacement pour les autres.`);
    }
    rendre();
  }

  /**
   * Tente de franchir un obstacle adjacent (§4-5) : les préconditions d'affichage instantané
   * (infranchissable de zone, adjacence, franchissable) restent vérifiées ici pour un retour sans
   * latence réseau ; le jet lui-même (d20 + Dextérité + interaction raciale − malus obstacle,
   * esquive Elfe) est résolu côté serveur (`api.tenterFranchir`) — seule source de vérité pour le
   * règlement. Échec = la case seule est refusée, le reste de la portée de déplacement du tour
   * reste utilisable. Succès = le personnage se déplace sur la case de l'obstacle (simplification
   * du banc d'essai : on ne modélise pas de case "de l'autre côté").
   */
  async function tenterFranchir(personnage: Personnage, obstacle: Obstacle, x: number, y: number) {
    if (obstacle.categorie === "INFRANCHISSABLE_ZONE") {
      journal.push(`${personnage.pseudo} ne peut pas franchir une case infranchissable de zone en (${x}, ${y}).`);
      rendre();
      return;
    }
    const pos = positions.get(personnage.id)!;
    if (distanceChebyshev(pos, { x, y }) > 1) {
      journal.push(`${personnage.pseudo} doit être adjacent à l'obstacle en (${x}, ${y}) pour tenter de le franchir.`);
      rendre();
      return;
    }
    if (!obstacle.franchissable) {
      journal.push(`${personnage.pseudo} ne peut pas franchir l'obstacle en (${x}, ${y}) — il n'est pas franchissable, tente Détruire ou contourne-le.`);
      rendre();
      return;
    }

    let resultat;
    try {
      resultat = await api.tenterFranchir(carte.id, { x, y, personnageId: personnage.id, personnagePosition: pos });
    } catch (e) {
      journal.push(`Erreur lors de la tentative de franchissement : ${(e as Error).message}`);
      rendre();
      return;
    }
    const detailEsquive = resultat.ignoreMalusObstacle ? " (esquive Elfe : malus obstacle ignoré)" : "";
    journal.push(
      `${personnage.pseudo} tente de franchir en (${x}, ${y}) : d20(${resultat.d20}) + Dex ${personnage.dexterite} + interaction ${formatSigne(resultat.bonusMalusRacial)} − malus obstacle ${resultat.malusObstacleApplique}${detailEsquive} = ${resultat.jet} vs seuil ${resultat.seuil} → ${resultat.succes ? "réussite" : "échec"}.`
    );
    if (resultat.succes) {
      positions.set(personnage.id, { x, y });
      journal.push(`${personnage.pseudo} franchit l'obstacle et se déplace en (${x}, ${y}).`);
    } else {
      journal.push(`${personnage.pseudo} échoue à franchir cette case — le reste de sa portée de déplacement reste disponible ce tour.`);
    }
    rendre();
  }

  /**
   * Tente de détruire un obstacle adjacent (§5) : préconditions d'affichage instantané vérifiées
   * ici (infranchissable de zone, adjacence), le jet (d20 + Force contre le seuil de résistance)
   * et la persistance des PV de l'obstacle en base sont résolus côté serveur (`api.tenterDetruire`,
   * `Carte.jsonLayout`). Aucun plancher de rattrapage (asymétrie de Force assumée) : un échec ne
   * change rien aux PV.
   */
  async function tenterDetruire(personnage: Personnage, obstacle: Obstacle, x: number, y: number, cle: string) {
    if (obstacle.categorie === "INFRANCHISSABLE_ZONE") {
      journal.push(`${personnage.pseudo} ne peut pas détruire une case infranchissable de zone en (${x}, ${y}).`);
      rendre();
      return;
    }
    const pos = positions.get(personnage.id)!;
    if (distanceChebyshev(pos, { x, y }) > 1) {
      journal.push(`${personnage.pseudo} doit être adjacent à l'obstacle en (${x}, ${y}) pour tenter de le détruire.`);
      rendre();
      return;
    }

    let resultat;
    try {
      resultat = await api.tenterDetruire(carte.id, { x, y, personnageId: personnage.id, personnagePosition: pos });
    } catch (e) {
      journal.push(`Erreur lors de la tentative de destruction : ${(e as Error).message}`);
      rendre();
      return;
    }
    journal.push(
      `${personnage.pseudo} tente de détruire l'obstacle en (${x}, ${y}) : d20(${resultat.d20}) + Force ${personnage.force} = ${resultat.jet} vs seuil ${resultat.seuil} → ${resultat.succes ? "réussite" : "échec"}.`
    );
    if (resultat.succes) {
      obstacle.pv = resultat.pvRestants;
      journal.push(`${personnage.pseudo} inflige des dégâts à l'obstacle (${resultat.pvRestants} PV restants).`);
      if (resultat.detruit) {
        obstacles.delete(cle);
        journal.push(`L'obstacle en (${x}, ${y}) est détruit — la case redevient un terrain normal.`);
      }
    } else {
      journal.push(`${personnage.pseudo} échoue à entamer l'obstacle en (${x}, ${y}) — il tient toujours debout.`);
    }
    rendre();
  }

  function ajouterEnnemi(creature: CreatureBestiaire) {
    const pos = trouverCaseLibreHaut();
    ennemis.push({ instanceId: `e${prochainInstanceId++}`, creature, ...pos, pv: creature.pv });
    journal.push(`${creature.nom} apparaît sur le terrain.`);
    rendre();
  }

  function viderEnnemis() {
    ennemis.length = 0;
    journal.push("Terrain d'ennemis vidé.");
    rendre();
  }

  /** Trouve le personnage de l'équipe le plus proche d'une position donnée (distance de Chebyshev). */
  function personnageLePlusProche(depuis: Position): { personnage: Personnage; distance: number } | null {
    let meilleur: { personnage: Personnage; distance: number } | null = null;
    for (const p of equipe.personnages) {
      const pos = positions.get(p.id)!;
      const d = distanceChebyshev(depuis, pos);
      if (!meilleur || d < meilleur.distance) meilleur = { personnage: p, distance: d };
    }
    return meilleur;
  }

  /**
   * Comportement d'ennemi minimal demandé : s'il a un allié (personnage) en portée d'attaque, il
   * attaque (juste un message de journal, pas de dégâts — le moteur de combat arrive au Sprint 3).
   * Sinon, il se rapproche du personnage le plus proche, jusqu'à sa portée de déplacement
   * (Dextérité, comme les personnages), en choisissant la case libre qui réduit le plus la distance.
   */
  function agirEnnemi(ennemi: Ennemi) {
    const cible = personnageLePlusProche(ennemi);
    if (!cible) return;

    const porteeAttaque = PORTEE_CASES[ennemi.creature.porteeAttaque];
    if (cible.distance <= porteeAttaque) {
      journal.push(`${ennemi.creature.nom} attaque ${cible.personnage.pseudo} (${ennemi.creature.attaquePrincipale}) !`);
      rendre();
      return;
    }

    const portee = porteeDeplacement(ennemi.creature.dexterite);
    const posCible = positions.get(cible.personnage.id)!;
    const atteignables = casesAtteignables(ennemi, portee, false, ennemi.instanceId);
    let meilleureCase: Position | null = null;
    let meilleureDistance = cible.distance;
    for (const cle of atteignables) {
      const [x, y] = cle.split(",").map(Number) as [number, number];
      const d = distanceChebyshev({ x, y }, posCible);
      if (d < meilleureDistance) {
        meilleureDistance = d;
        meilleureCase = { x, y };
      }
    }

    if (meilleureCase) {
      ennemi.x = meilleureCase.x;
      ennemi.y = meilleureCase.y;
      journal.push(`${ennemi.creature.nom} se rapproche de ${cible.personnage.pseudo}.`);
    } else {
      journal.push(`${ennemi.creature.nom} ne peut pas se rapprocher davantage.`);
    }
    rendre();
  }

  /**
   * Attaque du joueur sur un ennemi en portée (§5bis) : dégâts fixes, mêlée/distance déjà tranchés
   * par `determinerModeAttaque` au moment de l'appel. Distinct d'`agirEnnemi` (qui simule le tour de
   * l'ennemi) — un clic sur un ennemi attaquable déclenche celle-ci en priorité (voir le handler de
   * clic dans `rendre`).
   */
  function attaquerEnnemi(personnage: Personnage, ennemi: Ennemi, mode: ModeAttaque) {
    ennemi.pv -= DEGATS_ATTAQUE_FIXES;
    const moyen = mode === "DISTANCE" ? "à distance" : "au corps-à-corps";
    journal.push(`${personnage.pseudo} attaque ${ennemi.creature.nom} ${moyen} — ${DEGATS_ATTAQUE_FIXES} dégâts.`);
    if (ennemi.pv <= 0) {
      ennemis.splice(ennemis.indexOf(ennemi), 1);
      journal.push(`${ennemi.creature.nom} est vaincu !`);
    }
    rendre();
  }

  app.innerHTML = `
    <div class="page-combat-test">
      <div class="entete-combat-test">
        <h1>Combat test (préprod)</h1>
        <div style="display:flex;gap:10px">
          <button class="btn btn--fantome" id="btn-mode-obstacle">🪨 Poser un obstacle</button>
          <button class="btn btn--fantome" id="btn-mode-tranchee">🕳️ Poser une tranchée (Nain)</button>
          <button class="btn btn--fantome" id="btn-mode-franchir">🧗 Franchir</button>
          <button class="btn btn--fantome" id="btn-mode-detruire">💥 Détruire</button>
          <button class="btn btn--fantome" id="btn-retour-aventure">← Retour</button>
        </div>
      </div>
      <div class="panneau-pose-obstacle" id="panneau-pose-obstacle" hidden></div>
      <p class="note-combat-test">
        Banc d'essai Sprint 2 : clique un personnage puis une case surlignée pour le déplacer.
        Portée de déplacement = Dextérité, pas de dé. <strong>Attaque</strong> : un personnage
        sélectionné avec un ennemi surligné en or à portée l'attaque au clic (5 dégâts fixes) — arme
        à distance/objet magique en main droite = portée de déplacement sans bouger, sinon mêlée =
        doit être adjacent. Cliquer un ennemi hors de cette portée le fait agir lui-même à la place
        (attaque s'il est en portée d'un allié, sinon déplacement vers le plus proche).
        <strong>Obstacles</strong> : preset Léger/Moyen/Lourd ou case infranchissable de zone
        (panneau ci-dessus) — bloquent toujours totalement la case en déplacement normal.
        <strong>Franchir</strong>/<strong>Détruire</strong> : sélectionne un personnage adjacent à
        l'obstacle, active le mode correspondant puis clique l'obstacle — lance le jet dédié (d20 +
        Dextérité + bonus/malus racial − malus obstacle pour Franchir, d20 + Force pour Détruire),
        déplace le personnage sur succès de Franchir, retire 5 PV à l'obstacle sur succès de Détruire
        (case infranchissable de zone toujours refusée). <strong>Tranchée</strong> : ne bloque
        jamais, coûte 1 case de déplacement en plus pour tout le monde sauf les Nains (visibilité
        réduite et protection au combat pas encore codées, dépendent du Sprint 3). Voir
        <code>vibe/design/plan_grille_combat.md</code>.
      </p>
      <div class="mise-en-page-combat-test">
        <div class="colonne-grille-combat">
          <div id="fiche-selection"></div>
          <div class="grille-combat" id="grille-combat" style="--colonnes:${COLONNES};--lignes:${LIGNES};--taille-case:${TAILLE_CASE}px"></div>
          <div class="journal-combat-test" id="journal-combat-test"></div>
        </div>
        <aside class="panneau-ennemis">
          <div class="entete-panneau-ennemis">
            <h3>Ennemis</h3>
            <button class="btn btn--fantome" id="btn-vider-ennemis">Vider</button>
          </div>
          <div class="liste-ennemis" id="liste-ennemis"></div>
        </aside>
      </div>
    </div>
  `;

  const grille = app.querySelector<HTMLElement>("#grille-combat")!;
  const ficheSelection = app.querySelector<HTMLElement>("#fiche-selection")!;
  const journalEl = app.querySelector<HTMLElement>("#journal-combat-test")!;
  const panneauPose = app.querySelector<HTMLElement>("#panneau-pose-obstacle")!;

  /** Panneau de config affiché en mode "Poser un obstacle" : choix du preset + ajustement libre. */
  function rendrePanneauPose() {
    panneauPose.hidden = !modeObstacle;
    if (!modeObstacle) {
      panneauPose.innerHTML = "";
      return;
    }
    const estZone = configPose.preset === "INFRANCHISSABLE_ZONE";
    panneauPose.innerHTML = `
      <label>Preset
        <select id="select-preset-obstacle">
          <option value="LEGER" ${configPose.preset === "LEGER" ? "selected" : ""}>Léger — ${PRESETS_OBSTACLE.LEGER.exemple}</option>
          <option value="MOYEN" ${configPose.preset === "MOYEN" ? "selected" : ""}>Moyen — ${PRESETS_OBSTACLE.MOYEN.exemple}</option>
          <option value="LOURD" ${configPose.preset === "LOURD" ? "selected" : ""}>Lourd — ${PRESETS_OBSTACLE.LOURD.exemple}</option>
          <option value="INFRANCHISSABLE_ZONE" ${estZone ? "selected" : ""}>Infranchissable de zone — gouffre, ravin</option>
        </select>
      </label>
      ${
        estZone
          ? `<span class="note-preset-obstacle">Jamais de PV, jamais franchissable, jamais destructible.</span>`
          : `
        <label>PV <input type="number" id="input-pv-obstacle" min="1" value="${configPose.pv}" /></label>
        <label><input type="checkbox" id="checkbox-franchissable-obstacle" ${configPose.franchissable ? "checked" : ""} /> Franchissable</label>
        <label>Malus Dex <input type="number" id="input-malus-obstacle" min="0" value="${configPose.malusDexterite}" ${configPose.franchissable ? "" : "disabled"} /></label>
        <label>Axe
          <select id="select-axe-obstacle" ${configPose.franchissable ? "" : "disabled"}>
            <option value="ETROIT" ${configPose.axeInteraction === "ETROIT" ? "selected" : ""}>Passage étroit</option>
            <option value="HAUTEUR" ${configPose.axeInteraction === "HAUTEUR" ? "selected" : ""}>Franchissement en hauteur</option>
          </select>
        </label>
      `
      }
    `;

    panneauPose.querySelector<HTMLSelectElement>("#select-preset-obstacle")!.addEventListener("change", (e) => {
      const valeur = (e.target as HTMLSelectElement).value as PresetObstacle | "INFRANCHISSABLE_ZONE";
      configPose =
        valeur === "INFRANCHISSABLE_ZONE"
          ? { preset: "INFRANCHISSABLE_ZONE", pv: 0, franchissable: false, malusDexterite: 0, axeInteraction: "ETROIT" }
          : configDepuisPreset(valeur);
      rendrePanneauPose();
    });

    if (!estZone) {
      panneauPose.querySelector<HTMLInputElement>("#input-pv-obstacle")!.addEventListener("input", (e) => {
        configPose.pv = Math.max(1, Number((e.target as HTMLInputElement).value) || 1);
      });
      panneauPose.querySelector<HTMLInputElement>("#checkbox-franchissable-obstacle")!.addEventListener("change", (e) => {
        configPose.franchissable = (e.target as HTMLInputElement).checked;
        rendrePanneauPose();
      });
      panneauPose.querySelector<HTMLInputElement>("#input-malus-obstacle")!.addEventListener("input", (e) => {
        configPose.malusDexterite = Math.max(0, Number((e.target as HTMLInputElement).value) || 0);
      });
      panneauPose.querySelector<HTMLSelectElement>("#select-axe-obstacle")!.addEventListener("change", (e) => {
        configPose.axeInteraction = (e.target as HTMLSelectElement).value as AxeInteractionObstacle;
      });
    }
  }

  // Panneau des ennemis disponibles : rempli une seule fois (ne dépend pas de rendre()).
  const listeEnnemis = app.querySelector<HTMLElement>("#liste-ennemis")!;
  listeEnnemis.innerHTML = ZONES.map(
    (zone) => `
      <div class="groupe-zone-ennemis">
        <h4>${zone}</h4>
        ${CREATURES.filter((c) => c.zone === zone)
          .map(
            (c) => `
          <div class="ligne-ennemi-dispo">
            <span>${c.nom}</span>
            <button class="btn btn--fantome btn--petit" data-ajouter="${c.id}">+ Ajouter</button>
          </div>
        `
          )
          .join("")}
      </div>
    `
  ).join("");
  listeEnnemis.querySelectorAll<HTMLButtonElement>("[data-ajouter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const creature = CREATURES.find((c) => c.id === btn.dataset["ajouter"]);
      if (creature) ajouterEnnemi(creature);
    });
  });
  app.querySelector("#btn-vider-ennemis")!.addEventListener("click", viderEnnemis);

  const btnModeObstacle = app.querySelector<HTMLButtonElement>("#btn-mode-obstacle")!;
  const btnModeTranchee = app.querySelector<HTMLButtonElement>("#btn-mode-tranchee")!;
  const btnModeFranchir = app.querySelector<HTMLButtonElement>("#btn-mode-franchir")!;
  const btnModeDetruire = app.querySelector<HTMLButtonElement>("#btn-mode-detruire")!;

  /** Les 4 modes de pose/interaction sont mutuellement exclusifs — un seul actif à la fois. */
  function basculerMode(mode: "obstacle" | "tranchee" | "franchir" | "detruire") {
    modeObstacle = mode === "obstacle" ? !modeObstacle : false;
    modeTranchee = mode === "tranchee" ? !modeTranchee : false;
    modeFranchir = mode === "franchir" ? !modeFranchir : false;
    modeDetruire = mode === "detruire" ? !modeDetruire : false;
    btnModeObstacle.classList.toggle("btn--actif", modeObstacle);
    btnModeTranchee.classList.toggle("btn--actif", modeTranchee);
    btnModeFranchir.classList.toggle("btn--actif", modeFranchir);
    btnModeDetruire.classList.toggle("btn--actif", modeDetruire);
    rendrePanneauPose();
    rendre();
  }

  btnModeObstacle.addEventListener("click", () => basculerMode("obstacle"));
  btnModeTranchee.addEventListener("click", () => basculerMode("tranchee"));
  btnModeFranchir.addEventListener("click", () => basculerMode("franchir"));
  btnModeDetruire.addEventListener("click", () => basculerMode("detruire"));

  function occupantPersonnage(x: number, y: number): Personnage | null {
    for (const p of equipe.personnages) {
      const pos = positions.get(p.id)!;
      if (pos.x === x && pos.y === y) return p;
    }
    return null;
  }

  function occupantEnnemi(x: number, y: number): Ennemi | null {
    return ennemis.find((e) => e.x === x && e.y === y) ?? null;
  }

  function rendre() {
    const selectionne = selectionneId ? equipe.personnages.find((p) => p.id === selectionneId) ?? null : null;
    const posSelection = selectionne ? positions.get(selectionne.id)! : null;
    const portee = selectionne ? porteeDeplacement(selectionne.dexterite) : 0;
    const estNain = selectionne?.raceId === "nain";
    const atteignables = posSelection
      ? casesAtteignables(posSelection, portee, estNain, selectionneId ?? undefined)
      : new Set<string>();

    const modeAttaque = selectionne ? determinerModeAttaque(selectionne) : null;
    const porteeAtq = selectionne && modeAttaque ? porteeAttaquePersonnage(selectionne, modeAttaque) : 0;
    const attaquables = new Set<string>();
    if (posSelection && modeAttaque) {
      for (const ennemi of ennemis) {
        if (distanceChebyshev(posSelection, ennemi) <= porteeAtq) attaquables.add(ennemi.instanceId);
      }
    }

    ficheSelection.innerHTML = selectionne
      ? `<div class="fiche-selection-combat">${selectionne.pseudo} — ${selectionne.race.nom} · ${selectionne.classe.nom} — Dextérité ${selectionne.dexterite} → portée ${portee} · Attaque ${modeAttaque === "DISTANCE" ? "à distance" : "au corps-à-corps"} (portée ${porteeAtq})</div>`
      : `<div class="fiche-selection-combat fiche-selection-combat--vide">Sélectionne un personnage pour voir sa portée de déplacement et d'attaque.</div>`;

    let html = "";
    for (let y = 0; y < LIGNES; y++) {
      for (let x = 0; x < COLONNES; x++) {
        const perso = occupantPersonnage(x, y);
        const ennemi = occupantEnnemi(x, y);
        const cle = cleCase(x, y);
        const obstacle = obstacles.get(cle);
        const tranchee = tranchees.has(cle);
        const estAtteignable = atteignables.has(cle);
        const modePlacement = modeObstacle || modeTranchee;
        const estZoneInfranchissable = obstacle?.categorie === "INFRANCHISSABLE_ZONE";
        const classes = [
          "case-combat",
          estAtteignable && "case-combat--atteignable",
          (perso || ennemi) && "case-combat--occupee",
          obstacle && (estZoneInfranchissable ? "case-combat--obstacle-zone" : "case-combat--obstacle"),
          tranchee && "case-combat--tranchee",
          modePlacement && !perso && !ennemi && "case-combat--pose",
        ]
          .filter(Boolean)
          .join(" ");
        html += `<div class="${classes}" data-x="${x}" data-y="${y}">`;
        if (perso) {
          const estSelectionne = perso.id === selectionneId;
          html += `<img class="jeton-personnage ${estSelectionne ? "jeton-personnage--selectionne" : ""}" data-perso="${perso.id}" src="/img/equipe-portraits/${perso.raceId}.webp" alt="${perso.pseudo}" title="${perso.pseudo}" />`;
        } else if (ennemi) {
          const estAttaquable = attaquables.has(ennemi.instanceId);
          html += `<div class="jeton-ennemi ${estAttaquable ? "jeton-ennemi--attaquable" : ""}" data-ennemi="${ennemi.instanceId}" title="${ennemi.creature.nom} — PV ${ennemi.pv}/${ennemi.creature.pv}${estAttaquable ? " (à portée d'attaque)" : ""}">👹</div>`;
        } else if (obstacle && estZoneInfranchissable) {
          html += `<div class="jeton-obstacle jeton-obstacle--zone" title="Infranchissable de zone — jamais de PV, jamais franchissable/destructible">⬛</div>`;
        } else if (obstacle) {
          const detail = obstacle.franchissable
            ? `franchissable (malus Dex -${obstacle.malusDexterite}, axe ${obstacle.axeInteraction === "ETROIT" ? "passage étroit" : "franchissement en hauteur"})`
            : "infranchissable";
          html += `<div class="jeton-obstacle" title="${PRESETS_OBSTACLE[obstacle.preset].label} — ${obstacle.pv} PV, ${detail}">🪨</div>`;
        } else if (tranchee) {
          html += `<div class="jeton-tranchee" title="Tranchée — abri Nain, -1 case pour les autres">🕳️</div>`;
        }
        html += `</div>`;
      }
    }
    grille.innerHTML = html;

    journalEl.innerHTML = journal
      .slice(-8)
      .map((ligne) => `<div class="ligne-journal-combat">${ligne}</div>`)
      .join("");
    journalEl.scrollTop = journalEl.scrollHeight;

    grille.querySelectorAll<HTMLImageElement>("[data-perso]").forEach((jeton) => {
      jeton.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = jeton.dataset["perso"]!;
        selectionneId = selectionneId === id ? null : id;
        rendre();
      });
    });

    grille.querySelectorAll<HTMLElement>("[data-ennemi]").forEach((jeton) => {
      jeton.addEventListener("click", (e) => {
        e.stopPropagation();
        const instanceId = jeton.dataset["ennemi"]!;
        const ennemi = ennemis.find((en) => en.instanceId === instanceId);
        if (!ennemi) return;
        // Un personnage sélectionné avec cet ennemi à portée d'attaque l'attaque (§5bis) ; sinon,
        // clic = faire agir l'ennemi lui-même (comportement existant, inchangé).
        if (selectionne && modeAttaque && attaquables.has(ennemi.instanceId)) {
          attaquerEnnemi(selectionne, ennemi, modeAttaque);
        } else {
          agirEnnemi(ennemi);
        }
      });
    });

    grille.querySelectorAll<HTMLElement>(".case-combat--atteignable").forEach((case_) => {
      case_.addEventListener("click", () => {
        if (!selectionneId || modeObstacle || modeTranchee || modeFranchir || modeDetruire) return;
        const x = Number(case_.dataset["x"]);
        const y = Number(case_.dataset["y"]);
        positions.set(selectionneId, { x, y });
        rendre();
      });
    });

    grille.querySelectorAll<HTMLElement>(".case-combat--pose").forEach((case_) => {
      case_.addEventListener("click", () => {
        const x = Number(case_.dataset["x"]);
        const y = Number(case_.dataset["y"]);
        if (modeObstacle) basculerObstacle(x, y);
        else if (modeTranchee) basculerTranchee(x, y);
      });
    });

    grille.querySelectorAll<HTMLElement>(".jeton-obstacle").forEach((jeton) => {
      jeton.addEventListener("click", (e) => {
        e.stopPropagation();
        const case_ = jeton.closest<HTMLElement>(".case-combat")!;
        const x = Number(case_.dataset["x"]);
        const y = Number(case_.dataset["y"]);
        if (modeObstacle) {
          basculerObstacle(x, y);
          return;
        }
        const cle = cleCase(x, y);
        const obstacleCible = obstacles.get(cle);
        if (!obstacleCible) return;
        if (modeFranchir || modeDetruire) {
          if (!selectionne) {
            journal.push("Sélectionne un personnage avant de tenter de franchir ou détruire un obstacle.");
            rendre();
            return;
          }
          if (modeFranchir) tenterFranchir(selectionne, obstacleCible, x, y);
          else tenterDetruire(selectionne, obstacleCible, x, y, cle);
        } else {
          journal.push("Active le mode Franchir ou Détruire pour interagir avec cet obstacle.");
          rendre();
        }
      });
    });

    grille.querySelectorAll<HTMLElement>(".jeton-tranchee").forEach((jeton) => {
      jeton.addEventListener("click", (e) => {
        e.stopPropagation();
        const case_ = jeton.closest<HTMLElement>(".case-combat")!;
        if (modeTranchee) {
          basculerTranchee(Number(case_.dataset["x"]), Number(case_.dataset["y"]));
        }
      });
    });
  }

  rendrePanneauPose();
  rendre();

  app.querySelector("#btn-retour-aventure")!.addEventListener("click", () => naviguer("/aventure"));
}
