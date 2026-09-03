/**
 * Liste des 38 créatures du Bestiaire Chapitre 1 (docs/final/md_for_ide/Bestiaire_et_Races.md),
 * recopiée à la main pour le banc d'essai "Combat test" du Sprint 2 — PAS encore une vraie table
 * `Creature` en base (celle-ci arrive au Sprint 3, cf. Roadmap_Sprints.md, avec import complet du
 * Bestiaire). À supprimer/remplacer quand ce modèle existera.
 *
 * `porteeAttaque` : le Bestiaire ne donne pas de portée en cases, seulement des attaques
 * "à distance" ou non — classification déduite du texte de chaque attaque, pas une donnée
 * sourcée. MELEE = doit être adjacent (Chebyshev 1) ; DISTANCE = portée arbitraire de 5 cases
 * (valeur de test, à retravailler quand le vrai système de combat sera conçu, Sprint 3).
 */
export type ZoneBestiaire = "Forêt" | "Ruines" | "Grotte" | "Village" | "Boss";
export type PorteeAttaque = "MELEE" | "DISTANCE";

export type CreatureBestiaire = {
  id: string;
  nom: string;
  zone: ZoneBestiaire;
  pv: number;
  force: number;
  dexterite: number;
  vitalite: number;
  porteeAttaque: PorteeAttaque;
  attaquePrincipale: string;
};

export const PORTEE_CASES: Record<PorteeAttaque, number> = {
  MELEE: 1,
  DISTANCE: 5,
};

export const CREATURES: CreatureBestiaire[] = [
  // ---------- Forêt ----------
  { id: "loup-gris", nom: "Loup gris", zone: "Forêt", pv: 18, force: 8, dexterite: 12, vitalite: 9, porteeAttaque: "MELEE", attaquePrincipale: "Morsure" },
  { id: "loup-alpha", nom: "Loup alpha", zone: "Forêt", pv: 40, force: 12, dexterite: 14, vitalite: 13, porteeAttaque: "MELEE", attaquePrincipale: "Morsure puissante" },
  { id: "sanglier-sauvage", nom: "Sanglier sauvage", zone: "Forêt", pv: 22, force: 10, dexterite: 6, vitalite: 12, porteeAttaque: "MELEE", attaquePrincipale: "Charge" },
  { id: "serpent-des-bois", nom: "Serpent des bois", zone: "Forêt", pv: 12, force: 5, dexterite: 14, vitalite: 6, porteeAttaque: "MELEE", attaquePrincipale: "Morsure venimeuse" },
  { id: "corbeau-maudit", nom: "Corbeau maudit", zone: "Forêt", pv: 14, force: 4, dexterite: 15, vitalite: 6, porteeAttaque: "MELEE", attaquePrincipale: "Griffures" },
  { id: "ours-des-bois", nom: "Ours des bois", zone: "Forêt", pv: 45, force: 14, dexterite: 5, vitalite: 15, porteeAttaque: "MELEE", attaquePrincipale: "Coup de griffes" },
  { id: "lutin-farceur", nom: "Lutin farceur (Sprite)", zone: "Forêt", pv: 8, force: 2, dexterite: 16, vitalite: 4, porteeAttaque: "MELEE", attaquePrincipale: "Griffure joueuse" },
  { id: "gobelin-eclaireur", nom: "Gobelin éclaireur", zone: "Forêt", pv: 15, force: 6, dexterite: 12, vitalite: 7, porteeAttaque: "MELEE", attaquePrincipale: "Coup de dague" },
  { id: "champignon-marcheur", nom: "Champignon marcheur (Myconide)", zone: "Forêt", pv: 20, force: 7, dexterite: 3, vitalite: 12, porteeAttaque: "MELEE", attaquePrincipale: "Coup de tige" },
  { id: "liane-etrangleuse", nom: "Liane étrangleuse", zone: "Forêt", pv: 25, force: 11, dexterite: 4, vitalite: 14, porteeAttaque: "MELEE", attaquePrincipale: "Étranglement" },
  { id: "loup-garou", nom: "Loup-garou", zone: "Forêt", pv: 55, force: 16, dexterite: 13, vitalite: 15, porteeAttaque: "MELEE", attaquePrincipale: "Griffes féroces" },

  // ---------- Ruines de l'avant-poste ----------
  { id: "bandit-chef", nom: "Bandit chef de bande / brute", zone: "Ruines", pv: 35, force: 13, dexterite: 8, vitalite: 12, porteeAttaque: "MELEE", attaquePrincipale: "Coup d'arme lourde" },
  { id: "bandit-pillard", nom: "Bandit pillard", zone: "Ruines", pv: 22, force: 9, dexterite: 10, vitalite: 9, porteeAttaque: "MELEE", attaquePrincipale: "Coup d'épée courte" },
  { id: "bandit-pillard-archer", nom: "Bandit pillard archer", zone: "Ruines", pv: 18, force: 6, dexterite: 13, vitalite: 8, porteeAttaque: "DISTANCE", attaquePrincipale: "Tir d'arc" },
  { id: "squelette-soldat", nom: "Squelette soldat", zone: "Ruines", pv: 20, force: 9, dexterite: 8, vitalite: 10, porteeAttaque: "MELEE", attaquePrincipale: "Coup d'épée rouillée" },
  { id: "squelette-archer", nom: "Squelette archer", zone: "Ruines", pv: 16, force: 6, dexterite: 12, vitalite: 8, porteeAttaque: "DISTANCE", attaquePrincipale: "Tir d'arc ancien" },
  { id: "zombie-de-garnison", nom: "Zombie de garnison", zone: "Ruines", pv: 30, force: 10, dexterite: 3, vitalite: 12, porteeAttaque: "MELEE", attaquePrincipale: "Coup lourd" },
  { id: "fantome-officier", nom: "Fantôme d'officier", zone: "Ruines", pv: 28, force: 4, dexterite: 10, vitalite: 8, porteeAttaque: "MELEE", attaquePrincipale: "Toucher spectral" },
  { id: "rat-geant", nom: "Rat géant des décombres", zone: "Ruines", pv: 10, force: 5, dexterite: 11, vitalite: 6, porteeAttaque: "MELEE", attaquePrincipale: "Morsure" },
  { id: "chauve-souris", nom: "Chauve-souris", zone: "Ruines", pv: 8, force: 3, dexterite: 15, vitalite: 4, porteeAttaque: "MELEE", attaquePrincipale: "Morsure rapide" },
  { id: "esprit-follet", nom: "Esprit follet (Wisp errant)", zone: "Ruines", pv: 14, force: 2, dexterite: 10, vitalite: 5, porteeAttaque: "DISTANCE", attaquePrincipale: "Décharge éthérée" },

  // ---------- Grotte ----------
  { id: "gobelin-archer", nom: "Gobelin archer", zone: "Grotte", pv: 16, force: 6, dexterite: 13, vitalite: 7, porteeAttaque: "DISTANCE", attaquePrincipale: "Tir d'arc" },
  { id: "gobelin-ravageur", nom: "Gobelin ravageur", zone: "Grotte", pv: 24, force: 11, dexterite: 9, vitalite: 10, porteeAttaque: "MELEE", attaquePrincipale: "Coup de hache" },
  { id: "gobelin-chaman", nom: "Gobelin chaman", zone: "Grotte", pv: 20, force: 6, dexterite: 8, vitalite: 8, porteeAttaque: "DISTANCE", attaquePrincipale: "Sort mineur" },
  { id: "araignee-geante", nom: "Araignée géante", zone: "Grotte", pv: 26, force: 9, dexterite: 14, vitalite: 10, porteeAttaque: "MELEE", attaquePrincipale: "Morsure venimeuse" },
  { id: "araignee-cracheuse", nom: "Araignée géante cracheuse de venin", zone: "Grotte", pv: 24, force: 7, dexterite: 13, vitalite: 9, porteeAttaque: "DISTANCE", attaquePrincipale: "Crachat de venin" },
  { id: "ver-des-cavernes", nom: "Ver des cavernes", zone: "Grotte", pv: 35, force: 12, dexterite: 4, vitalite: 14, porteeAttaque: "MELEE", attaquePrincipale: "Broyage" },
  { id: "troll-des-cavernes", nom: "Troll des cavernes (mini-boss)", zone: "Grotte", pv: 90, force: 18, dexterite: 6, vitalite: 18, porteeAttaque: "MELEE", attaquePrincipale: "Coup de massue" },
  { id: "champignon-toxique", nom: "Champignon toxique ambulant", zone: "Grotte", pv: 18, force: 6, dexterite: 3, vitalite: 10, porteeAttaque: "MELEE", attaquePrincipale: "Coup toxique" },
  { id: "cristal-vivant", nom: "Cristal vivant (élémental mineur)", zone: "Grotte", pv: 40, force: 10, dexterite: 5, vitalite: 16, porteeAttaque: "DISTANCE", attaquePrincipale: "Décharge d'énergie" },

  // ---------- Village ----------
  { id: "voleur-de-village", nom: "Voleur de village", zone: "Village", pv: 14, force: 6, dexterite: 12, vitalite: 7, porteeAttaque: "MELEE", attaquePrincipale: "Coup de dague" },
  { id: "loup-enrage-infiltre", nom: "Loup enragé infiltré", zone: "Village", pv: 20, force: 9, dexterite: 13, vitalite: 9, porteeAttaque: "MELEE", attaquePrincipale: "Morsure enragée" },
  { id: "corbeau-espion", nom: "Corbeau espion", zone: "Village", pv: 10, force: 3, dexterite: 14, vitalite: 5, porteeAttaque: "MELEE", attaquePrincipale: "Coup de bec" },
  { id: "garde-corrompu", nom: "Garde corrompu", zone: "Village", pv: 26, force: 10, dexterite: 8, vitalite: 11, porteeAttaque: "MELEE", attaquePrincipale: "Coup d'épée de garde" },
  { id: "cultiste-mineur", nom: "Cultiste mineur", zone: "Village", pv: 18, force: 6, dexterite: 8, vitalite: 8, porteeAttaque: "DISTANCE", attaquePrincipale: "Rituel mineur" },
  { id: "chien-sauvage", nom: "Chien sauvage", zone: "Village", pv: 12, force: 6, dexterite: 11, vitalite: 7, porteeAttaque: "MELEE", attaquePrincipale: "Morsure" },

  // ---------- Boss ----------
  { id: "chef-gobelin", nom: "Chef gobelin du campement", zone: "Boss", pv: 70, force: 15, dexterite: 10, vitalite: 14, porteeAttaque: "MELEE", attaquePrincipale: "Coup d'arme de chef" },
  { id: "reine-araignee", nom: "Reine-araignée", zone: "Boss", pv: 110, force: 14, dexterite: 15, vitalite: 16, porteeAttaque: "MELEE", attaquePrincipale: "Morsure royale" },
];
