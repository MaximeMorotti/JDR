import { describe, expect, it } from "vitest";
import {
  DEGATS_FIXES,
  SEUIL_FRANCHISSEMENT,
  SEUIL_RESISTANCE,
  determinerInteractionRaciale,
  determinerModeAttaque,
  determinerPorteeAttaqueCreature,
  determinerPorteeAttaquePersonnage,
  resoudreDestruction,
  resoudreFranchissement,
} from "./combat-resolution.service";

describe("determinerInteractionRaciale", () => {
  // Table race × axe d'interaction (§4) — les 5 races × les 2 défis, valeur exacte attendue.
  const cas: [string, "ETROIT" | "HAUTEUR", number][] = [
    ["nain", "ETROIT", 2],
    ["nain", "HAUTEUR", -2],
    ["elfe", "ETROIT", -2],
    ["elfe", "HAUTEUR", 2],
    ["humain", "ETROIT", 0],
    ["humain", "HAUTEUR", 0],
    ["demi-orc", "ETROIT", -2],
    ["demi-orc", "HAUTEUR", 0],
    ["mage", "ETROIT", 0],
    ["mage", "HAUTEUR", -1],
  ];

  it.each(cas)("race %s, axe %s → bonus/malus %i", (raceId, axe, attendu) => {
    expect(determinerInteractionRaciale(raceId, axe, "MOYEN").bonusMalus).toBe(attendu);
  });

  it("race inconnue → neutre (0)", () => {
    expect(determinerInteractionRaciale("inconnue", "ETROIT", "MOYEN").bonusMalus).toBe(0);
    expect(determinerInteractionRaciale("inconnue", "HAUTEUR", "MOYEN").bonusMalus).toBe(0);
  });

  it("cas spécial Elfe/obstacle-léger : immunité totale au malus, indépendante de l'axe", () => {
    expect(determinerInteractionRaciale("elfe", "ETROIT", "LEGER").ignoreMalusObstacle).toBe(true);
    expect(determinerInteractionRaciale("elfe", "HAUTEUR", "LEGER").ignoreMalusObstacle).toBe(true);
  });

  it("l'immunité Elfe ne s'applique pas aux obstacles Moyen/Lourd", () => {
    expect(determinerInteractionRaciale("elfe", "ETROIT", "MOYEN").ignoreMalusObstacle).toBe(false);
    expect(determinerInteractionRaciale("elfe", "ETROIT", "LOURD").ignoreMalusObstacle).toBe(false);
  });

  it("l'immunité obstacle-léger ne s'applique qu'à l'Elfe", () => {
    expect(determinerInteractionRaciale("nain", "ETROIT", "LEGER").ignoreMalusObstacle).toBe(false);
    expect(determinerInteractionRaciale("humain", "ETROIT", "LEGER").ignoreMalusObstacle).toBe(false);
  });
});

describe("resoudreFranchissement", () => {
  it("réussit exactement au seuil (borne basse de la réussite)", () => {
    // d20(10) + Dex 2 + racial 0 - malus 0 = 12 = SEUIL_FRANCHISSEMENT
    const resultat = resoudreFranchissement({
      d20: 10,
      dexterite: 2,
      raceId: "humain",
      axeInteraction: "ETROIT",
      presetObstacle: "MOYEN",
      malusDexterite: 0,
    });
    expect(resultat.jet).toBe(SEUIL_FRANCHISSEMENT);
    expect(resultat.succes).toBe(true);
    expect(resultat.d20).toBe(10);
  });

  it("échoue juste sous le seuil", () => {
    const resultat = resoudreFranchissement({
      d20: 9,
      dexterite: 2,
      raceId: "humain",
      axeInteraction: "ETROIT",
      presetObstacle: "MOYEN",
      malusDexterite: 0,
    });
    expect(resultat.jet).toBe(SEUIL_FRANCHISSEMENT - 1);
    expect(resultat.succes).toBe(false);
  });

  it("applique le bonus racial (Nain, passage étroit)", () => {
    // d20(8) + Dex 2 + bonus nain 2 - malus 0 = 12 → réussite alors qu'un Humain échouerait
    const resultat = resoudreFranchissement({
      d20: 8,
      dexterite: 2,
      raceId: "nain",
      axeInteraction: "ETROIT",
      presetObstacle: "MOYEN",
      malusDexterite: 0,
    });
    expect(resultat.bonusMalusRacial).toBe(2);
    expect(resultat.jet).toBe(12);
    expect(resultat.succes).toBe(true);
  });

  it("applique le malus racial (Elfe, passage étroit)", () => {
    // d20(12) + Dex 2 + malus elfe -2 - malus 0 = 12 → réussite malgré le malus
    const resultat = resoudreFranchissement({
      d20: 12,
      dexterite: 2,
      raceId: "elfe",
      axeInteraction: "ETROIT",
      presetObstacle: "MOYEN",
      malusDexterite: 0,
    });
    expect(resultat.bonusMalusRacial).toBe(-2);
    expect(resultat.jet).toBe(12);
    expect(resultat.succes).toBe(true);
  });

  it("applique le malus de l'obstacle", () => {
    // d20(12) + Dex 2 + racial 0 - malus obstacle 2 = 12 → réussite pile
    const resultat = resoudreFranchissement({
      d20: 12,
      dexterite: 2,
      raceId: "humain",
      axeInteraction: "ETROIT",
      presetObstacle: "MOYEN",
      malusDexterite: 2,
    });
    expect(resultat.malusObstacleApplique).toBe(2);
    expect(resultat.jet).toBe(12);
    expect(resultat.succes).toBe(true);
  });

  it("l'esquive Elfe ignore le malus d'un obstacle Léger, cumulée avec le bonus/malus racial", () => {
    // Elfe, obstacle Léger, axe hauteur (bonus elfe +2) : malus obstacle totalement ignoré.
    const resultat = resoudreFranchissement({
      d20: 5,
      dexterite: 2,
      raceId: "elfe",
      axeInteraction: "HAUTEUR",
      presetObstacle: "LEGER",
      malusDexterite: 5,
    });
    expect(resultat.ignoreMalusObstacle).toBe(true);
    expect(resultat.malusObstacleApplique).toBe(0);
    // d20(5) + Dex 2 + bonus 2 - 0 = 9
    expect(resultat.jet).toBe(9);
  });

  it("sans esquive, le même obstacle Léger pénaliserait un Elfe en passage étroit", () => {
    const resultat = resoudreFranchissement({
      d20: 5,
      dexterite: 2,
      raceId: "elfe",
      axeInteraction: "ETROIT",
      presetObstacle: "LEGER",
      malusDexterite: 5,
    });
    // L'immunité obstacle-léger est indépendante de l'axe : elle s'applique aussi en passage étroit.
    expect(resultat.ignoreMalusObstacle).toBe(true);
    expect(resultat.malusObstacleApplique).toBe(0);
  });
});

describe("resoudreDestruction", () => {
  it("réussit exactement au seuil et inflige les dégâts fixes", () => {
    // d20(10) + Force 2 = 12 = SEUIL_RESISTANCE
    const resultat = resoudreDestruction({ d20: 10, force: 2, pvActuels: 25 });
    expect(resultat.jet).toBe(SEUIL_RESISTANCE);
    expect(resultat.succes).toBe(true);
    expect(resultat.d20).toBe(10);
    expect(resultat.pvRestants).toBe(25 - DEGATS_FIXES);
    expect(resultat.detruit).toBe(false);
  });

  it("échoue juste sous le seuil et laisse les PV intacts (pas de plancher de rattrapage)", () => {
    const resultat = resoudreDestruction({ d20: 9, force: 2, pvActuels: 25 });
    expect(resultat.jet).toBe(SEUIL_RESISTANCE - 1);
    expect(resultat.succes).toBe(false);
    expect(resultat.pvRestants).toBe(25);
    expect(resultat.detruit).toBe(false);
  });

  it("détruit l'obstacle quand les PV tombent à 0", () => {
    const resultat = resoudreDestruction({ d20: 15, force: 5, pvActuels: DEGATS_FIXES });
    expect(resultat.succes).toBe(true);
    expect(resultat.pvRestants).toBe(0);
    expect(resultat.detruit).toBe(true);
  });

  it("les PV ne descendent jamais sous 0 (obstacle presque mort)", () => {
    const resultat = resoudreDestruction({ d20: 15, force: 5, pvActuels: 1 });
    expect(resultat.succes).toBe(true);
    expect(resultat.pvRestants).toBe(0);
    expect(resultat.detruit).toBe(true);
  });
});

describe("determinerModeAttaque", () => {
  it.each([
    ["ARME_DISTANCE", "DISTANCE"],
    ["ARME_JET", "DISTANCE"],
    ["OBJET_MAGIQUE", "DISTANCE"],
    ["ARME_LEGERE", "MELEE"],
    ["ARME_LOURDE", "MELEE"],
  ] as const)("catégorie %s → %s", (categorie, attendu) => {
    expect(determinerModeAttaque(categorie)).toBe(attendu);
  });

  it("aucune arme équipée (mains nues) → mêlée", () => {
    expect(determinerModeAttaque(null)).toBe("MELEE");
  });
});

describe("determinerPorteeAttaquePersonnage vs determinerPorteeAttaqueCreature — chemins distincts", () => {
  it("portée joueur à distance = sa Dextérité (pas la table Bestiaire)", () => {
    expect(determinerPorteeAttaquePersonnage("DISTANCE", 7)).toBe(7);
  });

  it("portée joueur en mêlée = toujours 1, quelle que soit la Dextérité", () => {
    expect(determinerPorteeAttaquePersonnage("MELEE", 7)).toBe(1);
    expect(determinerPorteeAttaquePersonnage("MELEE", 1)).toBe(1);
  });

  it("portée créature vient de la table Bestiaire, indépendante de toute Dextérité", () => {
    expect(determinerPorteeAttaqueCreature("MELEE")).toBe(1);
    expect(determinerPorteeAttaqueCreature("DISTANCE")).toBe(5);
  });

  it("les deux chemins ne se confondent pas : une créature à distance (5) diffère d'un joueur à distance avec une Dextérité de 5 tant que sa Dextérité change", () => {
    expect(determinerPorteeAttaqueCreature("DISTANCE")).toBe(5);
    expect(determinerPorteeAttaquePersonnage("DISTANCE", 9)).toBe(9);
    expect(determinerPorteeAttaqueCreature("DISTANCE")).not.toBe(9);
  });
});
