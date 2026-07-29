/**
 * Seed du catalogue de référence (Sprint 1) : races, classes, spécialisations,
 * objets, compagnons — données extraites des Codex dans docs/final/md_for_ide/.
 * Toute valeur "comblée" (absente des documents source) est signalée par un
 * commentaire renvoyant vers l'écart documenté dans CLAUDE.md.
 */
import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env["DATABASE_URL"] ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

// ============================================================
// RACES — cf. Bestiaire_et_Races.md
// ============================================================

const races = [
  {
    id: "humain",
    nom: "Humain",
    tailleMin: 160,
    tailleMax: 190,
    poidsMin: 60,
    poidsMax: 90,
    traitRacial:
      "Polyvalence : point de compétence bonus au niveau 1, +1 point libre à répartir à la création.",
    lore: "Peuple le plus répandu du royaume, on trouve des Humains dans chaque village, chaque cité et sur chaque route marchande.",
    force: 5,
    dexterite: 5,
    vitalite: 4,
    charisme: 8,
    intelligence: 5,
    sagesse: 4,
    chance: 5, // comblé — voir écart CLAUDE.md
    perception: 5, // comblé — voir écart CLAUDE.md
  },
  {
    id: "elfe",
    nom: "Elfe",
    tailleMin: 185,
    tailleMax: 195,
    poidsMin: 55,
    poidsMax: 75,
    traitRacial: "Vision nocturne. Résistance accrue au sommeil et aux effets de charme.",
    lore: "Les Elfes vivent en retrait des grandes routes, dans des clairières et des forêts anciennes qu'ils protègent depuis des générations.",
    force: 2,
    dexterite: 8,
    vitalite: 2,
    charisme: 5,
    intelligence: 7,
    sagesse: 7,
    chance: 5, // comblé
    perception: 8, // comblé
  },
  {
    id: "nain",
    nom: "Nain",
    tailleMin: 130,
    tailleMax: 150,
    poidsMin: 70,
    poidsMax: 95,
    traitRacial:
      "Résistance au poison. Vision dans le noir. Bonus de combat contre les créatures souterraines.",
    lore: "Bâtisseurs et forgerons intègres, les Nains creusent depuis toujours les profondeurs des montagnes à la recherche de minerais rares.",
    force: 8,
    dexterite: 2,
    vitalite: 6,
    charisme: 3,
    intelligence: 8,
    sagesse: 4,
    chance: 4, // comblé
    perception: 6, // comblé
  },
  {
    id: "demi-orc",
    nom: "Demi-Orc",
    tailleMin: 175,
    tailleMax: 200,
    poidsMin: 85,
    poidsMax: 110,
    traitRacial:
      "Rage du sang : bonus de dégâts quand les PV passent sous 30%. Intimidation naturelle envers les PNJ faibles.",
    lore: "Nés de l'union entre Humains et Orcs, les Demi-Orcs grandissent souvent à la marge des deux sociétés.",
    force: 7,
    dexterite: 7,
    vitalite: 8,
    charisme: 5,
    intelligence: 2,
    sagesse: 2,
    chance: 3, // comblé
    perception: 3, // comblé
  },
  {
    id: "mage",
    nom: "Mage",
    tailleMin: null,
    tailleMax: null,
    poidsMin: null,
    poidsMax: null,
    traitRacial:
      "Accès inné à la magie sans apprentissage préalable, mais grande fragilité physique.",
    lore: "Le don de magie n'appartient à aucune race en particulier : il s'agirait d'une mutation apparue chez les Elfes il y a des siècles.",
    force: 3,
    dexterite: 4,
    vitalite: 3,
    charisme: 5,
    intelligence: 8,
    sagesse: 8,
    chance: 6, // comblé
    perception: 6, // comblé
  },
] as const;

// ============================================================
// CLASSES — cf. Codex_des_Classes.md
// ============================================================

const classes = [
  {
    id: "guerrier",
    nom: "Guerrier",
    type: "GENERIQUE",
    roleCombat: "Corps-à-corps polyvalent : encaisse et inflige de lourds dégâts au contact.",
    armureMax: "LOURDE",
    armesInterdites: "Objets magiques (bâton, grimoire, orbe).",
  },
  {
    id: "voleur",
    nom: "Voleur",
    type: "GENERIQUE",
    roleCombat: "Corps-à-corps furtif et critique, forte mobilité.",
    armureMax: "LEGERE",
    armesInterdites: "Armes lourdes, objets magiques.",
  },
  {
    id: "barde",
    nom: "Barde",
    type: "GENERIQUE",
    roleCombat: "Soutien d'équipe via le Charisme : buff des alliés, debuff des ennemis.",
    armureMax: "LEGERE",
    armesInterdites: "Armes lourdes, objets magiques.",
  },
  // Le Codex modélise "le Mage" comme 1 classe à 3 écoles choisies à la création ; on l'implémente
  // comme 3 classes indépendantes (écart documenté dans CLAUDE.md) car l'école est un choix
  // structurant fait une fois pour toutes, pas un arbre de compétences différé comme les vraies
  // spécialisations — chacune garde ainsi exactement 4 spécialisations, comme les autres classes.
  {
    id: "mage-elementaire",
    nom: "Mage Élémentaire",
    type: "EXCLUSIVE",
    roleCombat: "Sorts à distance élémentaires (feu, eau, air, terre).",
    armureMax: "AUCUNE",
    armesInterdites: "Armes lourdes, armes de jet, armes de corps-à-corps classiques, armure (malus).",
  },
  {
    id: "mage-noir",
    nom: "Mage Noir",
    type: "EXCLUSIVE",
    roleCombat: "Sorts à distance occultes : nécromancie, malédictions, invocations démoniaques.",
    armureMax: "AUCUNE",
    armesInterdites: "Armes lourdes, armes de jet, armes de corps-à-corps classiques, armure (malus).",
  },
  {
    id: "mage-blanc",
    nom: "Mage Blanc",
    type: "EXCLUSIVE",
    roleCombat: "Sorts à distance sacrés : soin, lumière, protection.",
    armureMax: "AUCUNE",
    armesInterdites: "Armes lourdes, armes de jet, armes de corps-à-corps classiques, armure (malus).",
  },
  {
    id: "berserker",
    nom: "Berserker",
    type: "EXCLUSIVE",
    roleCombat: "Corps-à-corps brutal porté par la rage : dégâts croissants à mesure que les PV baissent.",
    armureMax: "MOYENNE",
    armesInterdites: "Objets magiques, armure lourde.",
  },
  {
    id: "ingenieur",
    nom: "Ingénieur",
    type: "EXCLUSIVE",
    roleCombat: "Artisanat, mécanismes et destruction.",
    armureMax: "LOURDE",
    armesInterdites: "Objets magiques.",
  },
  {
    id: "chasseur-sylvestre",
    nom: "Chasseur sylvestre",
    type: "EXCLUSIVE",
    roleCombat: "Distance et contrôle de terrain, au service de la nature.",
    armureMax: "LEGERE",
    armesInterdites: "Armes lourdes, objets magiques (sauf magie naturelle du Gardien sylvestre).",
  },
] as const;

// ============================================================
// MATRICE CLASSES × RACES — cf. Codex_des_Classes.md
// ============================================================

const classesAutoriseesParRace: { raceId: string; classeId: string; deconseille?: boolean }[] = [
  { raceId: "humain", classeId: "guerrier" },
  { raceId: "elfe", classeId: "guerrier" },
  { raceId: "nain", classeId: "guerrier" },
  { raceId: "demi-orc", classeId: "guerrier" },
  { raceId: "mage", classeId: "guerrier", deconseille: true },

  { raceId: "humain", classeId: "voleur" },
  { raceId: "elfe", classeId: "voleur" },
  { raceId: "nain", classeId: "voleur" },
  { raceId: "demi-orc", classeId: "voleur" },
  { raceId: "mage", classeId: "voleur", deconseille: true },

  { raceId: "humain", classeId: "barde" },
  { raceId: "elfe", classeId: "barde" },
  { raceId: "nain", classeId: "barde" },
  { raceId: "demi-orc", classeId: "barde" },
  { raceId: "mage", classeId: "barde" },

  { raceId: "mage", classeId: "mage-elementaire" },
  { raceId: "mage", classeId: "mage-noir" },
  { raceId: "mage", classeId: "mage-blanc" },
  { raceId: "demi-orc", classeId: "berserker" },
  { raceId: "nain", classeId: "ingenieur" },
  { raceId: "elfe", classeId: "chasseur-sylvestre" },
];

// ============================================================
// CATÉGORIES D'ARMES AUTORISÉES PAR CLASSE — cf. Codex_des_Classes.md
// ============================================================

const categoriesArmesAutoriseesParClasse: { classeId: string; categorie: string }[] = [
  { classeId: "guerrier", categorie: "ARME_LEGERE" },
  { classeId: "guerrier", categorie: "ARME_LOURDE" },
  { classeId: "guerrier", categorie: "ARME_JET" },
  { classeId: "guerrier", categorie: "BOUCLIER" },
  { classeId: "voleur", categorie: "ARME_LEGERE" },
  { classeId: "voleur", categorie: "ARME_JET" },
  { classeId: "barde", categorie: "ARME_LEGERE" },
  { classeId: "barde", categorie: "INSTRUMENT" },
  { classeId: "chasseur-sylvestre", categorie: "ARME_LEGERE" },
  { classeId: "chasseur-sylvestre", categorie: "ARME_DISTANCE" },
  { classeId: "chasseur-sylvestre", categorie: "COMPAGNON" },
  { classeId: "mage-elementaire", categorie: "OBJET_MAGIQUE" },
  { classeId: "mage-noir", categorie: "OBJET_MAGIQUE" },
  { classeId: "mage-blanc", categorie: "OBJET_MAGIQUE" },
  { classeId: "berserker", categorie: "ARME_LOURDE" },
  { classeId: "ingenieur", categorie: "ARME_LOURDE" },
  { classeId: "ingenieur", categorie: "OUTIL_ENGIN" },
];

// ============================================================
// SPÉCIALISATIONS — cf. Codex_des_Classes.md (37 au total)
// ============================================================

type Specialisation = {
  classeId: string;
  nom: string;
  description: string;
  attaqueSignature: string;
};

const specialisations: Specialisation[] = [
  // Guerrier
  { classeId: "guerrier", nom: "Paladin", description: "Guerrier lourd, orienté défense et puissance.", attaqueSignature: "Coup du guerrier : coup lourd capable de repousser l'ennemi, mais lent ; nécessite une arme de corps-à-corps." },
  { classeId: "guerrier", nom: "Escrimeur", description: "Maître de la lame, rapide et précis.", attaqueSignature: "Estoc : attaque rapide visant les points faibles. Dégâts élevés en cas de critique, faibles sinon, avec risque de contre-attaque en cas d'échec critique. Corps-à-corps uniquement." },
  { classeId: "guerrier", nom: "Maître d'armes", description: "Expert de toutes les armes, guerrier technique.", attaqueSignature: "Jet contondant : série de jets d'armes de lancer (javeline, javelot lourd...) dont l'efficacité dépend du niveau de l'arme et du porteur." },
  { classeId: "guerrier", nom: "Maître martial", description: "Combattant utilisant les arts martiaux.", attaqueSignature: "Frappe martiale : attaque basée sur l'Intelligence, la Dextérité et la Force. Peut toucher des ennemis de toute taille avec un malus selon leur gabarit ; faible contre les adversaires en armure." },

  // Voleur
  { classeId: "voleur", nom: "Assassin", description: "Expert de l'infiltration et des éliminations discrètes, excelle contre les ennemis surpris.", attaqueSignature: "Frappe sournoise : attaque de corps-à-corps infligeant de très lourds dégâts si la cible est surprise ou prise à revers." },
  { classeId: "voleur", nom: "Chapardeur", description: "Voleur agile spécialisé dans la vitesse et les déplacements.", attaqueSignature: "Vol à la tire : succession de coups rapides sur une ou plusieurs cibles proches. Permet de voler ou désarmer l'adversaire." },
  { classeId: "voleur", nom: "Lanceur", description: "Expert des armes de jet et du combat à distance légère.", attaqueSignature: "Salve de projectiles : lance rapidement plusieurs couteaux, hachettes ou shurikens." },
  { classeId: "voleur", nom: "Saboteur", description: "Spécialiste des pièges, poisons et gadgets.", attaqueSignature: "Piège dissimulé : place un piège ou lance un engin (fumigène, bombe, chausse-trape...)." },

  // Barde
  { classeId: "barde", nom: "Troubadour", description: "Artiste itinérant maîtrisant le chant et la poésie, inspire ses alliés et démoralise ses ennemis.", attaqueSignature: "Ballade héroïque : chant inspirant qui renforce le moral des alliés et réduit la détermination des ennemis à portée." },
  { classeId: "barde", nom: "Ménestrel", description: "Musicien virtuose utilisant son instrument comme canal de magie.", attaqueSignature: "Onde harmonique : mélodie créant une onde sonore capable de blesser, repousser ou déséquilibrer les ennemis devant lui." },
  { classeId: "barde", nom: "Orateur", description: "Maître de l'éloquence et de la persuasion, ses mots influencent les esprits.", attaqueSignature: "Verbe incisif : tirade cinglante qui déstabilise un adversaire, réduisant sa concentration, sa précision ou sa volonté de combattre." },
  { classeId: "barde", nom: "Danseur gymnaste", description: "Combine danse, rythme et gymnastique dans un style de combat élégant.", attaqueSignature: "Keri Pointe : danse distrayante se terminant par un coup de pied à la tête. Dégâts critiques élevés, plus étourdissement." },

  // Mage Élémentaire
  { classeId: "mage-elementaire", nom: "Pyromancien", description: "Maîtrise le feu (boules de feu, murs de flammes, explosions, combustion), très offensif.", attaqueSignature: "Flammèche : propulse une flamme plus ou moins puissante depuis sa main." },
  { classeId: "mage-elementaire", nom: "Hydromancien", description: "Manipule l'eau (vagues, soins légers, brouillard, contrôle des courants).", attaqueSignature: "Pistolet à eau : jet d'eau haute pression projeté jusqu'à environ 20 m." },
  { classeId: "mage-elementaire", nom: "Aéromancien", description: "Contrôle le vent et l'air (rafales, tornades, sustentation, vitesse).", attaqueSignature: "Dash : propulsion d'air sous les pieds, généralement utilisée pour se déplacer." },
  { classeId: "mage-elementaire", nom: "Géomancien", description: "Manipule la terre, la roche et parfois les cristaux (murs, séismes, armures de pierre).", attaqueSignature: "Le Mur : élève une colonne de terre plus ou moins large qui protège le joueur ou son équipe." },

  // Mage Noir
  { classeId: "mage-noir", nom: "Nécromancien", description: "Anime les morts, contrôle squelettes et fantômes, manipule les âmes et la mort.", attaqueSignature: "Rise : relève un ennemi mineur récemment mort au combat pour combattre à ses côtés." },
  { classeId: "mage-noir", nom: "Maléficien", description: "Spécialiste des malédictions, affaiblissements, poisons et souffrances magiques.", attaqueSignature: "Véhèmka : malédiction infligeant un débuff aléatoire à l'ennemi." },
  { classeId: "mage-noir", nom: "Démonologue", description: "Invoque et contrôle des démons, ou pactise avec des entités démoniaques pour s'octroyer des buffs.", attaqueSignature: "Pentacle : octroie un buff à l'équipe ou à soi-même en sacrifiant des PV." },
  { classeId: "mage-noir", nom: "Umbrancien", description: "Manipule les ténèbres, les ombres et le vide.", attaqueSignature: "Dark Paralysis : le joueur marche sur l'ombre de l'ennemi, le paralysant." },

  // Mage Blanc
  { classeId: "mage-blanc", nom: "Luminomancien", description: "Manipule la lumière sacrée pour blesser les créatures sombres et protéger ses alliés.", attaqueSignature: "Flash : éclaire une zone sombre et aveugle les ennemis proches." },
  { classeId: "mage-blanc", nom: "Guérisseur", description: "Soigne blessures, maladies et poisons ; mage de soutien.", attaqueSignature: "Mercurotrom : soigne à distance (soi-même ou un allié)." },
  { classeId: "mage-blanc", nom: "Exorciste", description: "Combat esprits, fantômes et démons en les bannissant ; très efficace contre les malédictions.", attaqueSignature: "Vague sainte : repousse les ennemis, dégâts doublés contre les morts-vivants." },
  { classeId: "mage-blanc", nom: "Oracle", description: "Reçoit des visions, prédit l'avenir, guide les autres ; contrôle la magie de téléportation et du temps.", attaqueSignature: "Xélus : ralentit le temps autour du joueur, permettant des déplacements amplifiés (x2)." },
  { classeId: "mage-blanc", nom: "Astromancien", description: "Utilise la lumière des étoiles et les constellations pour lancer des sorts.", attaqueSignature: "Jet cinétique : plus le jet est réussi, plus l'objet envoyé peut être lourd ou rapide." },

  // Berserker
  { classeId: "berserker", nom: "Brise-crâne", description: "Combattant privilégiant la force brute et les armes lourdes ; chaque coup peut fracasser les défenses ennemies.", attaqueSignature: "Fracassement : coup asséné avec ses deux armes en même temps, d'une violence extrême." },
  { classeId: "berserker", nom: "Sauvage", description: "Guerrier guidé par son instinct et sa rage ; plus il est blessé, plus il devient dangereux.", attaqueSignature: "Rage sanguinaire : entre en rage, augmentant sa force et sa vitesse pendant quelques tours." },
  { classeId: "berserker", nom: "Traqueur", description: "Prédateur redoutable capable de poursuivre sa proie sans relâche.", attaqueSignature: "Bond du prédateur : saut puissant pour atteindre un ennemi éloigné et lui infliger une attaque brutale." },
  { classeId: "berserker", nom: "Colosse", description: "Demi-orc à la carrure gigantesque utilisant son corps comme une arme.", attaqueSignature: "Charge écrasante : fonce sur une cible ou un groupe d'ennemis, les renverse." },

  // Ingénieur
  { classeId: "ingenieur", nom: "Mineur", description: "Expert de l'extraction et de la destruction de la roche, utilise pioches, marteaux et explosifs miniers.", attaqueSignature: "Coup de pioche : frappe puissante capable de fissurer armures, boucliers ou obstacles rocheux." },
  { classeId: "ingenieur", nom: "Forgeron", description: "Artisan maîtrisant le métal et les armes, renforce son équipement et celui de ses alliés.", attaqueSignature: "Marteau de forge : coup de marteau chauffé à blanc pouvant étourdir la cible." },
  { classeId: "ingenieur", nom: "Artificier", description: "Inventeur de mécanismes, gadgets et machines de guerre.", attaqueSignature: "Tourelle mécanique : déploie une tourelle automatique ou un automate." },
  { classeId: "ingenieur", nom: "Démolisseur", description: "Spécialiste de la poudre noire et des explosifs.", attaqueSignature: "Charge explosive : lance ou pose une charge provoquant une explosion à dégâts de zone." },

  // Chasseur sylvestre
  { classeId: "chasseur-sylvestre", nom: "Archer", description: "Maître incontesté de l'arc, tire avec une précision exceptionnelle à très longue distance.", attaqueSignature: "Flèche précise : vise un point vital ; dégâts fortement augmentés en cas de critique." },
  { classeId: "chasseur-sylvestre", nom: "Traqueur", description: "Expert du pistage et des embuscades, connaît parfaitement la forêt.", attaqueSignature: "Marquage du prédateur : désigne une cible ; le Traqueur inflige davantage de dégâts tant qu'elle est marquée." },
  { classeId: "chasseur-sylvestre", nom: "Maître des bêtes", description: "Combat aux côtés d'un compagnon animal (loup, faucon, ours, lynx...).", attaqueSignature: "Assaut coordonné : ordonne à son compagnon d'attaquer pendant qu'il tire ou frappe simultanément." },
  { classeId: "chasseur-sylvestre", nom: "Gardien sylvestre", description: "Protecteur des forêts utilisant les pouvoirs de la nature.", attaqueSignature: "Ronces entravantes : fait surgir des racines et des ronces qui immobilisent ou ralentissent les ennemis." },
];

// ============================================================
// OBJETS — cf. Codex_de_l_Equipement.md
// Grimoire/Robe/accessoires de "cultiste" (École Noire) volontairement exclus :
// nécessitent de vaincre le Cultiste mineur (combat), hors périmètre Sprint 1.
// ============================================================

type Objet = {
  id: string;
  nom: string;
  type: string;
  categorie: string;
  emplacement?: string;
  palier: string;
  origine: string;
  poidsArmure?: string;
  prix?: number;
  degats?: string;
  defense?: string;
  effet?: string;
  description: string;
};

const objets: Objet[] = [
  // --- Armes légères ---
  { id: "dague-simple", nom: "Dague simple", type: "ARME", categorie: "ARME_LEGERE", emplacement: "MAIN_DROITE", palier: "COMMUN", origine: "ACHAT_VILLAGE", prix: 5, degats: "+1", description: "Simple lame courte forgée à la va-vite, l'arme de base de tout aventurier." },
  { id: "epee-courte-milice", nom: "Épée courte de milice", type: "ARME", categorie: "ARME_LEGERE", emplacement: "MAIN_DROITE", palier: "COMMUN", origine: "ACHAT_VILLAGE", prix: 12, degats: "+2", description: "Épée standard des milices villageoises, fiable sans être impressionnante." },
  { id: "dague-croc-loup", nom: "Dague en croc de loup", type: "ARME", categorie: "ARME_LEGERE", emplacement: "MAIN_DROITE", palier: "RUDIMENTAIRE", origine: "CRAFT", degats: "+2", description: "Craft Ingénieur — 2× Croc de loup. Taillée à même un croc de loup, aussi tranchante qu'une lame forgée." },
  { id: "serpe-defense-sanglier", nom: "Serpe en défense de sanglier", type: "ARME", categorie: "ARME_LEGERE", emplacement: "MAIN_DROITE", palier: "RUDIMENTAIRE", origine: "CRAFT", degats: "+3", description: "Craft Ingénieur — 1× Défense de sanglier + 1× Fibre végétale. Lame recourbée improvisée, étonnamment efficace." },
  { id: "epee-rouillee", nom: "Épée rouillée", type: "ARME", categorie: "ARME_LEGERE", emplacement: "MAIN_DROITE", palier: "GOBELIN", origine: "LOOT", degats: "+2", description: "Loot Bandit pillard. Lame émoussée par l'usage, encore capable de blesser." },
  { id: "dague-gobeline", nom: "Dague gobeline", type: "ARME", categorie: "ARME_LEGERE", emplacement: "MAIN_DROITE", palier: "GOBELIN", origine: "LOOT", degats: "+2", description: "Loot Gobelin éclaireur. Petite lame ébréchée à l'odeur âcre, artisanat gobelin typique." },
  { id: "lame-de-chef", nom: "Lame de chef", type: "ARME", categorie: "ARME_LEGERE", emplacement: "MAIN_DROITE", palier: "GOBELIN", origine: "LOOT", degats: "+4", description: "Loot Bandit chef de bande. Meilleure facture que celle de ses hommes, signe de son rang." },

  // --- Armes lourdes ---
  { id: "epee-milice-2mains", nom: "Épée de milice (2 mains)", type: "ARME", categorie: "ARME_LOURDE", emplacement: "MAIN_DROITE", palier: "COMMUN", origine: "ACHAT_VILLAGE", prix: 20, degats: "+3", description: "Lame longue standard, lourde à manier sans entraînement." },
  { id: "marteau-simple", nom: "Marteau simple", type: "ARME", categorie: "ARME_LOURDE", emplacement: "MAIN_DROITE", palier: "COMMUN", origine: "ACHAT_VILLAGE", prix: 15, degats: "+3", description: "Outil de chantier reconverti en arme, brut mais efficace." },
  { id: "massue-os-ours", nom: "Massue en os d'ours", type: "ARME", categorie: "ARME_LOURDE", emplacement: "MAIN_DROITE", palier: "RUDIMENTAIRE", origine: "CRAFT", degats: "+5", description: "Craft Ingénieur — 1× Griffe d'ours + 1× Fourrure d'ours. Manche enroulé de fourrure, tête taillée dans un os d'ours massif." },
  { id: "hache-ebrechee", nom: "Hache ébréchée", type: "ARME", categorie: "ARME_LOURDE", emplacement: "MAIN_DROITE", palier: "GOBELIN", origine: "LOOT", degats: "+4", description: "Loot Gobelin ravageur. Émoussée par de nombreux combats, encore redoutable." },
  { id: "masse-garnison", nom: "Masse de garnison", type: "ARME", categorie: "ARME_LOURDE", emplacement: "MAIN_DROITE", palier: "GOBELIN", origine: "LOOT", degats: "+3", description: "Loot Zombie de garnison. Arme rouillée de l'ancien avant-poste, encore fonctionnelle." },
  { id: "massue-de-troll", nom: "Massue de Troll", type: "ARME", categorie: "ARME_LOURDE", emplacement: "MAIN_DROITE", palier: "UNIQUE", origine: "LOOT", degats: "+8", description: "Loot Troll des cavernes (boss). Bloc de pierre et de bois brut, chance d'étourdir la cible." },
  { id: "arme-chef-gobelin", nom: "Arme du Chef gobelin", type: "ARME", categorie: "ARME_LOURDE", emplacement: "MAIN_DROITE", palier: "UNIQUE", origine: "LOOT", degats: "+7", description: "Loot Chef gobelin (boss). Ornée de trophées, insuffle une intimidation naturelle en combat." },

  // --- Boucliers ---
  { id: "bouclier-bois", nom: "Bouclier en bois", type: "BOUCLIER", categorie: "BOUCLIER", emplacement: "MAIN_GAUCHE", palier: "COMMUN", origine: "ACHAT_VILLAGE", prix: 10, defense: "+1", description: "Planche renforcée de fer, le strict nécessaire pour parer." },
  { id: "bouclier-ecailles", nom: "Bouclier en écailles", type: "BOUCLIER", categorie: "BOUCLIER", emplacement: "MAIN_GAUCHE", palier: "RUDIMENTAIRE", origine: "CRAFT", defense: "+2", description: "Craft Ingénieur — 2× Peau écailleuse. Plaques de serpent assemblées sur une armature légère." },
  { id: "bouclier-bandit", nom: "Bouclier de bandit", type: "BOUCLIER", categorie: "BOUCLIER", emplacement: "MAIN_GAUCHE", palier: "GOBELIN", origine: "LOOT", defense: "+2", description: "Loot Bandit chef de bande / brute. Renforcé de plaques de fer récupérées." },

  // --- Armes de jet ---
  { id: "couteaux-lancer", nom: "Couteaux de lancer (lot de 3)", type: "ARME", categorie: "ARME_JET", emplacement: "MAIN_DROITE", palier: "COMMUN", origine: "ACHAT_VILLAGE", prix: 8, degats: "+1 chacun", description: "Petites lames équilibrées, simples mais fiables." },
  { id: "dents-serpent-empoisonnees", nom: "Dents de serpent empoisonnées", type: "ARME", categorie: "ARME_JET", emplacement: "MAIN_DROITE", palier: "RUDIMENTAIRE", origine: "CRAFT", degats: "+2 + poison léger", description: "Craft Ingénieur — 1× Venin de serpent + 1× Peau écailleuse. Dents montées sur de petites tiges, enduites de venin frais." },
  { id: "piquants-myconide", nom: "Piquants de myconide", type: "ARME", categorie: "ARME_JET", emplacement: "MAIN_DROITE", palier: "RUDIMENTAIRE", origine: "CRAFT", degats: "+1 + confusion légère", description: "Craft Ingénieur — 1× Spore rare. Piquants séchés qui libèrent un nuage désorientant à l'impact." },
  { id: "hachette-gobeline", nom: "Hachette gobeline", type: "ARME", categorie: "ARME_JET", emplacement: "MAIN_DROITE", palier: "GOBELIN", origine: "LOOT", degats: "+3", description: "Loot Gobelin archer. Petite hachette dissymétrique, taillée grossièrement." },
  { id: "eclat-cristal-taille", nom: "Éclat de cristal taillé", type: "ARME", categorie: "ARME_JET", emplacement: "MAIN_DROITE", palier: "GOBELIN", origine: "CRAFT", degats: "+3 + résonance magique légère", description: "Craft Ingénieur — 1× Éclat de cristal (Grotte). Fragment tranchant qui vibre faiblement au contact." },
  { id: "dard-royal", nom: "Dard royal", type: "ARME", categorie: "ARME_JET", emplacement: "MAIN_DROITE", palier: "UNIQUE", origine: "LOOT", degats: "+5 + poison puissant", description: "Loot Reine-araignée (boss). Extrait de l'aiguillon de la reine, encore chargé de venin." },

  // --- Armes à distance ---
  { id: "arc-court-chasse", nom: "Arc court de chasse", type: "ARME", categorie: "ARME_DISTANCE", emplacement: "MAIN_DROITE", palier: "COMMUN", origine: "ACHAT_VILLAGE", prix: 18, degats: "+3", description: "Arc simple utilisé par les chasseurs du village." },
  { id: "arc-renforce", nom: "Arc renforcé", type: "ARME", categorie: "ARME_DISTANCE", emplacement: "MAIN_DROITE", palier: "RUDIMENTAIRE", origine: "CRAFT", degats: "+4", description: "Craft Ingénieur — 1× Fibre végétale + 1× Sève rare. Corde tressée et bois gorgé de sève durcie." },
  { id: "arc-bandit", nom: "Arc de bandit", type: "ARME", categorie: "ARME_DISTANCE", emplacement: "MAIN_DROITE", palier: "GOBELIN", origine: "LOOT", degats: "+3", description: "Loot Bandit pillard archer. Arc pillé, entretenu tant bien que mal." },
  { id: "arc-gobelin", nom: "Arc gobelin", type: "ARME", categorie: "ARME_DISTANCE", emplacement: "MAIN_DROITE", palier: "GOBELIN", origine: "LOOT", degats: "+4", description: "Loot Gobelin archer. Petit arc noueux, étonnamment précis entre de bonnes mains." },

  // --- Instruments ---
  { id: "luth-simple", nom: "Luth simple", type: "INSTRUMENT", categorie: "INSTRUMENT", emplacement: "MAIN_DROITE", palier: "COMMUN", origine: "ACHAT_VILLAGE", prix: 10, effet: "Soutien +1", description: "Instrument basique, un peu désaccordé mais honnête." },
  { id: "flute-spectrale", nom: "Flûte spectrale", type: "INSTRUMENT", categorie: "INSTRUMENT", emplacement: "MAIN_DROITE", palier: "GOBELIN", origine: "LOOT", effet: "Soutien +3 + effet peur", description: "Loot Fantôme d'officier. Flûte d'os émettant une note glaçante." },
  { id: "tambour-gobelin", nom: "Tambour gobelin", type: "INSTRUMENT", categorie: "INSTRUMENT", emplacement: "MAIN_DROITE", palier: "GOBELIN", origine: "LOOT", effet: "Soutien +2", description: "Loot Gobelin chaman. Peau tendue sur un cadre d'os, résonance tribale." },

  // --- Objets magiques (Mage — stuff verrouillé) ---
  { id: "baton-apprenti", nom: "Bâton d'apprenti", type: "OBJET_MAGIQUE", categorie: "OBJET_MAGIQUE", emplacement: "MAIN_DROITE", palier: "COMMUN", origine: "SPAWN_GRATUIT", effet: "Dégâts magiques +2", description: "Spawn de départ. Bâton basique remis à tout jeune mage, encore imprégné d'une magie instable." },
  { id: "grimoire-apprenti", nom: "Grimoire d'apprenti", type: "OBJET_MAGIQUE", categorie: "OBJET_MAGIQUE", emplacement: "MAIN_GAUCHE", palier: "COMMUN", origine: "SPAWN_GRATUIT", effet: "+1 emplacement de sort", description: "Spawn de départ. Recueil incomplet des sorts fondamentaux, annoté par son ancien propriétaire." },
  { id: "robe-apprenti", nom: "Robe d'apprenti", type: "ARMURE", categorie: "ARMURE", emplacement: "TORSE", palier: "COMMUN", origine: "SPAWN_GRATUIT", effet: "Aucun bonus/malus", description: "Spawn de départ (tous Mages). Simple tissu léger, ne protège pas mais n'entrave rien." },

  // --- Outils / engins (Ingénieur) ---
  { id: "pioche-simple", nom: "Pioche simple", type: "OUTIL_ENGIN", categorie: "OUTIL_ENGIN", emplacement: "MAIN_DROITE", palier: "COMMUN", origine: "ACHAT_VILLAGE", prix: 12, effet: "Dégâts +2, bonus vs minéral", description: "Outil de mineur, robuste et polyvalent." },
  { id: "charge-explosive-rudimentaire", nom: "Charge explosive rudimentaire", type: "OUTIL_ENGIN", categorie: "OUTIL_ENGIN", emplacement: "MAIN_DROITE", palier: "GOBELIN", origine: "CRAFT", effet: "Dégâts de zone +6", description: "Craft Ingénieur — 1× Éclat de cristal + 1× Acide digestif (loot Ver des cavernes). Fabriquée à partir de réactifs instables trouvés en grotte." },

  // --- Armures : Tenue d'aventurier (Commun, Légère) ---
  { id: "casque-cuir", nom: "Casque en cuir", type: "ARMURE", categorie: "ARMURE", emplacement: "TETE", palier: "COMMUN", origine: "ACHAT_VILLAGE", poidsArmure: "LEGERE", prix: 4, defense: "+1", description: "Simple calotte de cuir bouilli." },
  { id: "plastron-cuir", nom: "Plastron en cuir", type: "ARMURE", categorie: "ARMURE", emplacement: "TORSE", palier: "COMMUN", origine: "ACHAT_VILLAGE", poidsArmure: "LEGERE", prix: 8, defense: "+2", description: "Pièce la plus protectrice du set, cuir épais cousu." },
  { id: "brassard-cuir", nom: "Brassards en cuir (paire)", type: "ARMURE", categorie: "ARMURE", emplacement: "BRAS", palier: "COMMUN", origine: "ACHAT_VILLAGE", poidsArmure: "LEGERE", prix: 6, defense: "+2", description: "Protection légère des avant-bras — les deux brassards, identiques et symétriques, s'achètent et s'équipent ensemble." },
  { id: "jambieres-cuir", nom: "Jambières en cuir", type: "ARMURE", categorie: "ARMURE", emplacement: "BAS", palier: "COMMUN", origine: "ACHAT_VILLAGE", poidsArmure: "LEGERE", prix: 5, defense: "+1", description: "Protège les jambes sans gêner la mobilité." },
  { id: "bottes-voyage", nom: "Bottes de voyage", type: "ARMURE", categorie: "ARMURE", emplacement: "PIED", palier: "COMMUN", origine: "ACHAT_VILLAGE", poidsArmure: "LEGERE", prix: 2, defense: "+1", description: "Bottes solides, pensées pour la marche longue." },

  // --- Armures : Rudimentaire (craft, Légère) ---
  { id: "casque-fourrure-ours", nom: "Casque en fourrure d'ours", type: "ARMURE", categorie: "ARMURE", emplacement: "TETE", palier: "RUDIMENTAIRE", origine: "CRAFT", poidsArmure: "LEGERE", defense: "+2", description: "Craft Ingénieur — 1× Fourrure d'ours. Épaisse fourrure protégeant crâne et nuque." },
  { id: "plastron-peau-sanglier", nom: "Plastron en peau de sanglier", type: "ARMURE", categorie: "ARMURE", emplacement: "TORSE", palier: "RUDIMENTAIRE", origine: "CRAFT", poidsArmure: "LEGERE", defense: "+3", description: "Craft Ingénieur — 1× Défense de sanglier + 1× Fibre végétale. Cuir épais renforcé de lanières végétales." },
  { id: "brassard-peau-ecailleuse", nom: "Brassards en peau écailleuse (paire)", type: "ARMURE", categorie: "ARMURE", emplacement: "BRAS", palier: "RUDIMENTAIRE", origine: "CRAFT", poidsArmure: "LEGERE", defense: "+2", description: "Craft Ingénieur — 2× Peau écailleuse (1 par bras). Écailles de serpent cousues sur cuir souple — les deux brassards s'équipent ensemble." },
  { id: "bottes-peau-loup", nom: "Bottes en peau de loup", type: "ARMURE", categorie: "ARMURE", emplacement: "PIED", palier: "RUDIMENTAIRE", origine: "CRAFT", poidsArmure: "LEGERE", defense: "+1", description: "Craft Ingénieur — 1× Peau de loup. Doublure chaude, bonne adhérence." },

  // --- Armures : Gobelin (loot, Moyenne) ---
  { id: "casque-bandit", nom: "Casque de bandit", type: "ARMURE", categorie: "ARMURE", emplacement: "TETE", palier: "GOBELIN", origine: "LOOT", poidsArmure: "MOYENNE", defense: "+2", description: "Loot Bandit pillard. Cabossé mais encore solide." },
  { id: "plastron-garnison", nom: "Plastron de garnison", type: "ARMURE", categorie: "ARMURE", emplacement: "TORSE", palier: "GOBELIN", origine: "LOOT", poidsArmure: "MOYENNE", defense: "+3", description: "Loot Squelette soldat (Fragment d'armure). Vestige rouillé de l'ancien avant-poste." },
  { id: "carapace-araignee", nom: "Carapace d'araignée", type: "ARMURE", categorie: "ARMURE", emplacement: "TORSE", palier: "GOBELIN", origine: "LOOT", poidsArmure: "MOYENNE", defense: "+3 + résistance poison légère", description: "Loot Araignée géante. Plaques chitineuses assemblées à la hâte." },

  // --- Armures : Unique (loot boss, Lourde) ---
  { id: "trophee-chef-gobelin", nom: "Trophée du Chef gobelin", type: "ARMURE", categorie: "ARMURE", emplacement: "TETE", palier: "UNIQUE", origine: "LOOT", poidsArmure: "LOURDE", defense: "+4 + bonus d'intimidation", description: "Loot Chef gobelin (boss). Casque orné de trophées de guerre." },
  { id: "carapace-royale", nom: "Carapace royale", type: "ARMURE", categorie: "ARMURE", emplacement: "TORSE", palier: "UNIQUE", origine: "LOOT", poidsArmure: "LOURDE", defense: "+6 + résistance poison forte", description: "Loot Reine-araignée (boss). Fragment de l'exosquelette de la reine, traité et renforcé." },

  // --- Accessoires : Collier ---
  { id: "pendentif-bois", nom: "Pendentif en bois", type: "ACCESSOIRE", categorie: "COLLIER", emplacement: "COLLIER", palier: "COMMUN", origine: "ACHAT_VILLAGE", prix: 3, effet: "Charisme +1", description: "Petit médaillon gravé, porte-bonheur de voyageur." },
  { id: "collier-crocs", nom: "Collier de crocs", type: "ACCESSOIRE", categorie: "COLLIER", emplacement: "COLLIER", palier: "RUDIMENTAIRE", origine: "CRAFT", effet: "Force +1", description: "Craft Ingénieur — 1× Croc de loup + 1× Croc de chien. Trophée de chasse monté sur lanière." },
  { id: "amulette-sombre", nom: "Amulette sombre", type: "ACCESSOIRE", categorie: "COLLIER", emplacement: "COLLIER", palier: "GOBELIN", origine: "LOOT", effet: "Intelligence +1", description: "Loot Cultiste mineur (Village). Amulette tiède au toucher, gravée de symboles interdits." },
  { id: "pendentif-reine", nom: "Pendentif de la Reine", type: "ACCESSOIRE", categorie: "COLLIER", emplacement: "COLLIER", palier: "UNIQUE", origine: "LOOT", effet: "Résistance poison forte", description: "Loot Reine-araignée (boss). Fragment durci de l'exosquelette royal, monté en pendentif." },

  // --- Accessoires : Anneaux (2 emplacements, même catalogue) ---
  { id: "anneau-etain", nom: "Anneau en étain", type: "ACCESSOIRE", categorie: "ANNEAU", emplacement: "ANNEAU", palier: "COMMUN", origine: "ACHAT_VILLAGE", prix: 5, effet: "Dextérité +1", description: "Anneau simple sans prétention." },
  { id: "anneau-griffe-ours", nom: "Anneau en griffe d'ours", type: "ACCESSOIRE", categorie: "ANNEAU", emplacement: "ANNEAU", palier: "RUDIMENTAIRE", origine: "CRAFT", effet: "Force +1", description: "Craft Ingénieur — 1× Griffe d'ours. Miniature de griffe sertie sur un anneau de fer." },
  { id: "anneau-chaman", nom: "Anneau du chaman", type: "ACCESSOIRE", categorie: "ANNEAU", emplacement: "ANNEAU", palier: "GOBELIN", origine: "LOOT", effet: "Sagesse +1", description: "Loot Gobelin chaman. Anneau d'os gravé de runes tribales." },
  { id: "anneau-chef", nom: "Anneau du Chef", type: "ACCESSOIRE", categorie: "ANNEAU", emplacement: "ANNEAU", palier: "UNIQUE", origine: "LOOT", effet: "Force +2, bonus intimidation", description: "Loot Chef gobelin (boss). Anneau massif porté par le chef du campement." },

  // --- Accessoires : Bracelets (2 emplacements, même catalogue) ---
  { id: "bracelet-cuir-tresse", nom: "Bracelet en cuir tressé", type: "ACCESSOIRE", categorie: "BRACELET", emplacement: "BRACELET", palier: "COMMUN", origine: "ACHAT_VILLAGE", prix: 3, effet: "Dextérité +1", description: "Simple lanière tressée au poignet." },
  { id: "bracelet-ecaille", nom: "Bracelet en écaille", type: "ACCESSOIRE", categorie: "BRACELET", emplacement: "BRACELET", palier: "RUDIMENTAIRE", origine: "CRAFT", effet: "Dextérité +1, résistance poison légère", description: "Craft Ingénieur — 1× Peau écailleuse. Écailles cousues sur cuir souple." },
  { id: "bracelet-pillard", nom: "Bracelet de pillard", type: "ACCESSOIRE", categorie: "BRACELET", emplacement: "BRACELET", palier: "GOBELIN", origine: "LOOT", effet: "Dextérité +1", description: "Loot Bandit pillard. Pris sur un bandit, sans grande valeur mais utile." },
  { id: "bracelet-spectral", nom: "Bracelet spectral", type: "ACCESSOIRE", categorie: "BRACELET", emplacement: "BRACELET", palier: "UNIQUE", origine: "LOOT", effet: "Résistance magique +2", description: "Loot Fantôme d'officier. Semble à moitié immatériel au poignet." },

  // --- Accessoires : Ceinture ---
  { id: "ceinture-cuir", nom: "Ceinture de cuir", type: "ACCESSOIRE", categorie: "CEINTURE", emplacement: "CEINTURE", palier: "COMMUN", origine: "ACHAT_VILLAGE", prix: 4, effet: "+1 emplacement d'objet", description: "Ceinture avec petite sacoche." },
  { id: "ceinture-renforcee", nom: "Ceinture renforcée", type: "ACCESSOIRE", categorie: "CEINTURE", emplacement: "CEINTURE", palier: "RUDIMENTAIRE", origine: "CRAFT", effet: "+2 emplacements d'objet", description: "Craft Ingénieur — 1× Fibre végétale + 1× Sève rare. Cuir doublé, plus grande capacité de rangement." },
  { id: "ceinture-pillard", nom: "Ceinture de pillard", type: "ACCESSOIRE", categorie: "CEINTURE", emplacement: "CEINTURE", palier: "GOBELIN", origine: "LOOT", effet: "Porte-flèches intégré", description: "Loot Bandit pillard archer. Facilite le réapprovisionnement en munitions." },

  // --- Accessoires : Cape ---
  { id: "cape-voyage", nom: "Cape de voyage", type: "ACCESSOIRE", categorie: "CAPE", emplacement: "CAPE", palier: "COMMUN", origine: "ACHAT_VILLAGE", prix: 6, effet: "Résistance froid légère", description: "Simple protection contre les intempéries." },
  { id: "cape-peau-loup", nom: "Cape en peau de loup", type: "ACCESSOIRE", categorie: "CAPE", emplacement: "CAPE", palier: "RUDIMENTAIRE", origine: "CRAFT", effet: "Résistance physique légère", description: "Craft Ingénieur — 1× Peau de loup. Doublure chaude et discrète." },
  { id: "cape-rapiecee", nom: "Cape rapiécée", type: "ACCESSOIRE", categorie: "CAPE", emplacement: "CAPE", palier: "GOBELIN", origine: "LOOT", effet: "Discrétion +1", description: "Loot Bandit chef de bande. Idéale pour le Voleur, coupée pour ne pas gêner les mouvements." },
  { id: "cape-soie-royale", nom: "Cape de soie royale", type: "ACCESSOIRE", categorie: "CAPE", emplacement: "CAPE", palier: "UNIQUE", origine: "LOOT", effet: "Discrétion +2, résistance poison", description: "Loot Reine-araignée (Soie précieuse). Tissée dans la soie la plus fine du nid." },

  // --- Accessoires : Carquois ---
  { id: "carquois-simple", nom: "Carquois simple", type: "ACCESSOIRE", categorie: "CARQUOIS", emplacement: "CARQUOIS", palier: "COMMUN", origine: "ACHAT_VILLAGE", prix: 5, effet: "8 munitions", description: "Carquois basique en cuir." },
  { id: "carquois-renforce", nom: "Carquois renforcé", type: "ACCESSOIRE", categorie: "CARQUOIS", emplacement: "CARQUOIS", palier: "RUDIMENTAIRE", origine: "CRAFT", effet: "12 munitions", description: "Craft Ingénieur — 2× Fibre végétale. Meilleure tenue, rechargement plus rapide." },
  { id: "carquois-gobelin", nom: "Carquois gobelin", type: "ACCESSOIRE", categorie: "CARQUOIS", emplacement: "CARQUOIS", palier: "GOBELIN", origine: "LOOT", effet: "10 flèches + 4 hachettes de jet", description: "Loot Gobelin archer. Compatible flèches et petites hachettes de jet." },
];

// ============================================================
// COMPAGNONS — cf. Codex_des_Compagnons.md (tableau comparatif retenu comme référence)
//
// ⚠️ Écart tranché avec l'utilisateur : le Codex source dit les 5 chiens et la Mule
// "disponibles pour toute équipe comportant un Guerrier, un Voleur ou un Barde". Décision
// explicite : ce sont en réalité des compagnons universels, sans prérequis de classe — aucun
// classesLiees pour ces 6 compagnons ci-dessous. Documenté dans CLAUDE.md.
// ============================================================

type Compagnon = {
  id: string;
  nom: string;
  role: string;
  lore: string;
  pv: number;
  force: number;
  dexterite: number;
  vitalite: number;
  intelligence?: number;
  capaciteTransport: string;
  attaques: string;
  classesLiees?: string[]; // au moins une des classes doit être présente dans l'équipe
  raceRequiseId?: string; // cas particulier Fée
};

const compagnons: Compagnon[] = [
  {
    id: "chihuahua",
    nom: "Chihuahua",
    role: "Éclaireur nerveux, très esquivant mais fragile",
    lore: "Minuscule mais increvable, le Chihuahua compense sa taille par des réflexes hors normes. Il jappe au moindre bruit suspect, prévenant l'équipe d'une embuscade avant qu'elle ne se déclenche.",
    pv: 10, force: 2, dexterite: 16, vitalite: 5,
    capaciteTransport: "Aucune sans harnais (1 emplacement une fois crafté)",
    attaques: "Morsure vive (1-2) : dégâts physiques mineurs, esquive très élevée en combat.",
  },
  {
    id: "cocker",
    nom: "Cocker",
    role: "Compagnon affectueux, léger soutien de moral",
    lore: "Doux et sociable, le Cocker s'attache vite à toute l'équipe. Sa présence détend le groupe entre deux combats et améliore légèrement la cohésion collective.",
    pv: 14, force: 4, dexterite: 12, vitalite: 8,
    capaciteTransport: "Aucune sans harnais (1 emplacement une fois crafté)",
    attaques: "Morsure (2-3) : dégâts physiques. Présence apaisante : léger bonus de moral (Charisme d'équipe) au campement.",
  },
  {
    id: "labrador",
    nom: "Labrador",
    role: "Compagnon robuste et loyal, bon en garde",
    lore: "Fidèle entre tous, le Labrador encaisse sans broncher et reste toujours au contact de son maître. Un choix solide pour une équipe qui veut un compagnon fiable plus qu'un athlète.",
    pv: 20, force: 7, dexterite: 8, vitalite: 12,
    capaciteTransport: "Aucune sans harnais (1 emplacement une fois crafté)",
    attaques: "Morsure ferme (3-5) : dégâts physiques.",
  },
  {
    id: "border-collie",
    nom: "Border Collie",
    role: "Pisteur agile et intelligent, soutien de détection",
    lore: "Réputé pour son intelligence, le Border Collie repère les pistes et anticipe les mouvements ennemis avec une acuité rare. Idéal pour une équipe qui veut éviter les mauvaises surprises.",
    pv: 16, force: 5, dexterite: 15, vitalite: 9,
    capaciteTransport: "Aucune sans harnais (1 emplacement une fois crafté)",
    attaques: "Morsure rapide (2-4) : dégâts physiques, bonus d'esquive au tour suivant.",
  },
  {
    id: "berger-australien",
    nom: "Berger Australien",
    role: "Chien de troupeau, contrôle de zone",
    lore: "Habitué à rabattre le bétail, le Berger Australien applique le même instinct au combat : il isole et repousse une cible désignée loin du reste du groupe ennemi.",
    pv: 18, force: 6, dexterite: 14, vitalite: 10,
    capaciteTransport: "Aucune sans harnais (1 emplacement une fois crafté)",
    attaques: "Morsure (3-4) : dégâts physiques. Rabattage : repousse et isole une cible proche, l'éloignant de ses alliés.",
  },
  {
    id: "mule",
    nom: "Mule",
    role: "Bête de somme, transport avant tout",
    lore: "Peu impressionnante au combat, la Mule reste le choix le plus pragmatique pour une équipe qui privilégie le stockage de ressources aux capacités offensives.",
    pv: 26, force: 9, dexterite: 5, vitalite: 15,
    capaciteTransport: "Selle de base : 2 emplacements. Avec 2 sacoches craftées (Ingénieur) : 10 emplacements (5 par sacoche).",
    attaques: "Ruade (2-3) : dégâts physiques défensifs, utilisée seulement si la Mule est attaquée directement.",
  },
  {
    id: "elan",
    nom: "Élan",
    role: "Monture de combat, gros gabarit offensif",
    lore: "Seul un Chasseur sylvestre parvient à gagner la confiance d'un Élan sauvage. Une fois lié, l'animal devient un allié redoutable, capable d'intervenir directement dans les affrontements.",
    pv: 45, force: 13, dexterite: 10, vitalite: 15,
    capaciteTransport: "Selle de base : 4 emplacements. Avec 4 sacoches craftées (Ingénieur) : 16 emplacements (4 par sacoche).",
    attaques: "Coup de bois (8-12) : charge d'andouillers, dégâts physiques lourds. Ruade (5-7) : dégâts physiques.",
    classesLiees: ["chasseur-sylvestre"],
  },
  {
    id: "gnome",
    nom: "Gnome",
    role: "Assistant alchimique, soutien",
    lore: "Petit être facétieux et savant, le Gnome se lie volontiers à un Mage curieux. Il trie et transporte sans effort tout le nécessaire alchimique de l'équipe, et peut préparer une potion à la volée en plein combat.",
    pv: 12, force: 3, dexterite: 11, vitalite: 6, intelligence: 8,
    capaciteTransport: "Illimitée, mais uniquement pour les objets alchimiques (potions, ingrédients) — poids nul pour ces objets.",
    attaques: "Projection alchimique (2-4) : dégâts magiques, effet aléatoire léger (poison/feu/givre). Mélange d'urgence : prépare une potion gratuitement, une fois par combat.",
    classesLiees: ["mage-elementaire", "mage-noir", "mage-blanc"],
  },
  {
    id: "sanglier-dresse",
    nom: "Sanglier (dressé)",
    role: "Monture robuste, plateforme d'équipement",
    lore: "Capturé jeune et dressé par un Ingénieur, ce sanglier est bien plus docile que ses cousins sauvages — mais tout aussi robuste. Sa large carrure en fait une excellente plateforme pour du matériel ou un armement embarqué.",
    pv: 40, force: 14, dexterite: 6, vitalite: 16,
    capaciteTransport: "Attache de base : 1 petit objet. Améliorable (Ingénieur) : tourelle arbalète miniature + coffre de transport (6 emplacements).",
    attaques: "Charge (9-13) : dégâts physiques lourds. Tir de tourelle (4-6, si équipée) : tir automatique à distance, une fois par tour.",
    classesLiees: ["ingenieur"],
  },
  {
    id: "fee",
    nom: "Fée",
    role: "Petit esprit protecteur, soutien magique offensif",
    lore: "Nul ne sait pourquoi une créature aussi délicate choisit de s'attacher à un Demi-Orc plutôt qu'à un être plus raffiné. Ce lien improbable est étonnamment solide.",
    pv: 8, force: 1, dexterite: 18, vitalite: 4, intelligence: 5,
    capaciteTransport: "Aucune — la Fée ne peut rien transporter.",
    attaques: "Étincelle (3-5) : dégâts magiques. Poussière stellaire : soin léger ou debuff Chance sur l'ennemi, au choix.",
    raceRequiseId: "demi-orc",
  },
];

// ============================================================
// EXÉCUTION DU SEED
// ============================================================

async function main() {
  console.log("Nettoyage des tables de catalogue...");
  await prisma.compagnonEquipe.deleteMany();
  await prisma.compagnonClasseLiee.deleteMany();
  await prisma.compagnonRef.deleteMany();
  await prisma.inventairePersonnage.deleteMany();
  await prisma.objetRef.deleteMany();
  await prisma.personnage.deleteMany();
  await prisma.specialisationRef.deleteMany();
  await prisma.categorieArmeAutoriseeParClasse.deleteMany();
  await prisma.classeAutoriseeParRace.deleteMany();
  await prisma.classeRef.deleteMany();
  await prisma.raceRef.deleteMany();

  console.log("Seed des races...");
  for (const race of races) {
    await prisma.raceRef.create({ data: race });
  }

  console.log("Seed des classes...");
  for (const classe of classes) {
    await prisma.classeRef.create({ data: classe });
  }

  console.log("Seed de la matrice classes × races...");
  await prisma.classeAutoriseeParRace.createMany({ data: classesAutoriseesParRace });

  console.log("Seed des catégories d'armes autorisées...");
  await prisma.categorieArmeAutoriseeParClasse.createMany({ data: categoriesArmesAutoriseesParClasse });

  console.log("Seed des spécialisations...");
  await prisma.specialisationRef.createMany({ data: specialisations });

  console.log("Seed du catalogue d'objets...");
  for (const objet of objets) {
    await prisma.objetRef.create({ data: objet });
  }

  console.log("Seed des compagnons...");
  for (const c of compagnons) {
    await prisma.compagnonRef.create({
      data: {
        id: c.id,
        nom: c.nom,
        role: c.role,
        lore: c.lore,
        pv: c.pv,
        force: c.force,
        dexterite: c.dexterite,
        vitalite: c.vitalite,
        intelligence: c.intelligence,
        capaciteTransport: c.capaciteTransport,
        attaques: c.attaques,
        raceRequise: c.raceRequiseId ? { connect: { id: c.raceRequiseId } } : undefined,
      },
    });
    if (c.classesLiees) {
      await prisma.compagnonClasseLiee.createMany({
        data: c.classesLiees.map((classeId) => ({ compagnonId: c.id, classeId })),
      });
    }
  }

  console.log("Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
