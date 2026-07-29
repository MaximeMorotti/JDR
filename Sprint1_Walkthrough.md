# Sprint 1 — Walkthrough : « Créer son personnage de A à Z »

Statut : **✅ Terminé**. Ce document reprend l'objectif fixé au départ (voir `Roadmap_Sprints.md`)
et détaille ce qui a réellement été construit, écran par écran, avec les écarts de conception
assumés en cours de route (détail complet dans `CLAUDE.md`, section « Écarts documentation ↔
implémentation »).

## Objectif de départ

> En tant que joueur, je veux créer mon personnage (race, classe, statistiques, équipement de
> départ) afin de commencer l'aventure avec un personnage qui me ressemble.

Périmètre fixé : un joueur peut créer une équipe de 1 à 4 personnages, répartir un budget partagé
de 100 po à la boutique du village, et retrouver son équipe après rechargement de la page.

## Parcours utilisateur, tel qu'il existe aujourd'hui

### 1. Accueil (`client/src/pages/accueil.ts`)
Création d'une nouvelle équipe (nom libre) ou reprise d'une équipe existante dans la liste — chaque
équipe peut désormais être supprimée directement depuis cette liste (croix de suppression avec
confirmation), sans avoir à l'ouvrir.

### 2. Création de personnage (`client/src/pages/creation-personnage.ts`)
- **Étoile de sélection de race** : les 5 races (Humain, Elfe, Nain, Demi-Orc, Mage) disposées en
  cercle autour d'un hub central, chacune dans un cadre illustré propre à sa matière (bronze,
  bois, métal gravé, os, obsidienne runique — vraies illustrations fournies par l'utilisateur, plus
  de recréation CSS des textures).
- Au clic sur une race, la roue tourne pour amener le portrait choisi en bas, un parchemin se
  déroule avec le lore, le trait racial, un **radar SVG** des 8 caractéristiques (toujours
  affichées complètes, y compris Chance/Perception qui n'existaient dans aucun document source),
  et les classes disponibles pour cette race — chacune avec sa propre icône dessinée en interne.
  Une classe « déconseillée » reste sélectionnable (jamais masquée) ; seule une case vide du Codex
  bloque réellement l'accès.
- Les spécialisations de la classe choisie s'affichent en **aperçu lecture seule** (pas un choix à
  la création — voir écart ci-dessous) juste en dessous.
- Validation du personnage → **transition plein écran thématique par race** (porte qui s'ouvre pour
  l'Humain, feuilles pour l'Elfe, gemmes pour le Nain, explosion d'ossements pour le Demi-Orc,
  cercle rituel et runes pour le Mage — chacune construite à partir d'une vraie illustration
  fournie par l'utilisateur, pas de placeholder) puis renvoi vers le hub équipe.

### 3. Hub équipe (`client/src/pages/equipe.ts`)
Page centrale après la création : 3 colonnes — inventaire (cases selon la capacité réelle de
l'équipe + du compagnon), personnages (cartes bannière 2:1 avec cadre thématique par race et fondu
vers la couleur de la classe), compagnon. Cliquer une carte personnage ouvre sa **fiche détaillée en
popup** (`client/src/components/fiche-personnage.ts`) : portrait, radar de stats, renommage inline,
suppression, navigation par flèches entre les personnages de l'équipe (cyclique). La suppression
d'un personnage ne se fait plus que depuis cette fiche.

### 4. Boutique / équipement (`client/src/pages/equipement.ts`)
Refonte complète demandée en cours de sprint : un **mannequin illustré** (image détourée fournie
par l'utilisateur, une illustration par emplacement d'équipement superposée dessus, calée au pixel
près par scan du canal alpha) occupe la moitié de l'écran. Survoler un objet dans la boutique fait
**s'illuminer** (léger zoom + teinte dorée brillante) l'emplacement correspondant sur le mannequin ;
un emplacement déjà équipé se teinte en acier en permanence. La boutique elle-même est une **pile
d'objets en rectangles pleine largeur**, filtrable par type, avec son propre défilement interne (le
mannequin reste fixe à l'écran pendant qu'on parcourt la liste). Toute règle de restriction (poids
d'armure max par classe, catégories d'armes autorisées, budget) est validée **côté serveur**
(`server/src/services/validation.service.ts`), jamais seulement dans l'interface.

### 5. Compagnon (`client/src/pages/compagnon.ts`)
Grille fixe de 5×2 (les 10 compagnons du Codex), chaque carte affichant portrait, rôle, un radar de
stats (PV/Force/Dextérité/Vitalité) et ses prérequis éventuels. Un seul compagnon par équipe,
accessible dès 1 personnage. Les 5 chiens et la Mule sont universels (aucun prérequis de classe,
écart assumé avec le Codex source).

## Écarts de conception assumés (détail complet dans `CLAUDE.md`)

Décisions prises en cours de sprint quand la documentation source (Codex) et l'usage réel
entraient en tension — jamais corrigées silencieusement, toujours documentées :

- **Budget 100 po quelle que soit la taille de l'équipe** (1 à 4), pas 100 po par personnage.
- **Compagnon accessible dès 1 personnage**, chiens + Mule sans prérequis de classe.
- **Spécialisation retirée du flux de création** : ce sont les briques d'un futur arbre de
  compétences à débloquer en progressant (non conçu), pas un choix figé à la création.
- **Le Mage devient 3 classes indépendantes** (Élémentaire/Noire/Blanche) plutôt qu'une classe
  unique à 3 écoles — l'école redevient un vrai choix de classe fait à la création.
- **Bras gauche/droit fusionnés en un seul emplacement `BRAS`** : un brassard s'achète et s'équipe
  pour les deux bras en un seul achat (prix et défense cumulés). Main droite/gauche restent
  séparées à dessein (arme principale vs bouclier/grimoire — les fusionner casserait le stuff
  verrouillé du Mage et empêcherait d'équiper une arme ET un bouclier simultanément).
- **Brassards de bras et paires d'accessoires (anneaux, bracelets)** : chaque paire occupe 2
  emplacements distincts choisis par le joueur, contrairement au bras désormais unique.
- Classification du poids d'armure (léger/moyen/lourd) et correspondance illustration↔compagnon
  comblées par déduction, sans effet pratique tant que seul le palier Commun est achetable.

## État des features par rapport à la Roadmap

| Feature prévue | Statut |
|---|---|
| Formulaire de création race + classe | ✅ |
| Modificateurs raciaux appliqués aux stats de base | ✅ |
| Verrouillage des classes exclusives par race | ✅ |
| Boutique de départ, budget d'équipe partagé | ✅ (refondue visuellement en cours de sprint) |
| Validation des règles d'interdiction côté serveur | ✅ |
| Fiche personnage consultable après création | ✅ (popup depuis le hub équipe) |
| Modification de l'équipement avant le départ | ✅ (achat/retrait libre depuis la boutique) |
| Aperçu visuel de race | ✅ — dépassé (portraits, cadres thématiques, mannequin, radar) |

Toutes les cases 🔴 bloquantes et 🟡 importantes du Sprint 1 sont couvertes.

## Backlog reporté (pas des blocages Sprint 1)

- Conversion des 5 transitions par race en GIF/vidéo (optimisation FPS, notée pour après validation
  complète — jamais commencée, volontairement).
- Animation « pièces qui tombent » à l'entrée de la boutique (mentionnée dans le brief visuel,
  jamais implémentée — à reconfirmer si toujours voulue).
- Arbre de compétences par spécialisation (conception à faire avant de pouvoir le brancher).
- Mécanique « arc à deux mains + carquois optionnel » évoquée sur la boutique, mise en pause :
  changement de modèle de données (un achat occupant 2 emplacements distincts) qui mérite sa propre
  passe plutôt que d'être ajouté à la volée.

## Repères techniques

- Commits Sprint 1 (frontend, du premier flux fonctionnel à la clôture) :
  `f27bed0` → `703470b` → `3a32627` → `bb04a04` → `fc29fb2` → `85c5524` → `3bf2e1b` → `7f0d20e` →
  `b03ceeb` → `ec5311f`.
- Stack : Vite + TypeScript strict (client vanilla TS, pas de framework), Express + Prisma + SQLite
  côté serveur. Toute règle de jeu validée serveur (`validation.service.ts`), jamais seulement
  côté client.
- Composants réutilisables clés : `components/radar-stats.ts` (radar SVG générique, axes/échelle
  paramétrables — utilisé pour les races, les personnages et les compagnons), `components/
  fiche-personnage.ts` (popup détail personnage), `components/confirmation.ts` (popup de
  confirmation thématique), `components/transition-race.ts` (transitions plein écran par race).
