# Le Début d'une Épopée — Roadmap de développement

Document de suivi du projet, découpé en sprints. Chaque sprint a un objectif unique et testable avant de passer au suivant. Le volet technique (BDD, architecture) est intégré à chaque étape plutôt que traité à part, pour que la base de données grandisse avec les besoins réels plutôt que d'être surdimensionnée dès le départ.

**Stack de référence** : TypeScript de bout en bout (client + serveur), Vite pour le dev local, SQLite + Prisma comme ORM pour démarrer (fichier unique, zéro configuration serveur, migration facile vers PostgreSQL plus tard si besoin d'hébergement multi-joueurs).

**Légende des priorités** : 🔴 Bloquant pour le sprint · 🟡 Important mais contournable · 🟢 Confort / peaufinage

---

## Sprint 0 — Fondations techniques

**Objectif** : avoir un projet qui tourne, vide, mais structuré correctement dès le départ.

### User story
> En tant que développeur, je veux un projet initialisé et structuré afin de pouvoir itérer rapidement sur les sprints suivants sans dette technique.

### Features
- 🔴 Initialisation du projet Vite + TypeScript (`npm create vite@latest`)
- 🔴 Séparation claire des dossiers : `client/` (front), `server/` (backend + agent MJ plus tard)
- 🔴 Dépôt Git initialisé, `.gitignore` correct (node_modules, .env, base SQLite locale)
- 🟡 Scripts npm de base (`dev`, `build`, `lint`)
- 🟢 Configuration ESLint/Prettier

### Technique — Base de données
- 🔴 Choix du moteur : **SQLite** (fichier local, aucune install serveur, parfait pour du test en continu)
- 🔴 Mise en place de **Prisma** comme ORM (cohérent avec TypeScript, migrations versionnées, autocomplétion des requêtes)
- 🔴 Premher schéma Prisma vide + première migration (`npx prisma migrate dev`)

---

## Sprint 1 — Créer son personnage de A à Z

**Objectif** : un joueur peut créer un personnage complet (race, classe, stats, équipement de départ) et le retrouver après rechargement de la page.

### User story
> En tant que joueur, je veux créer mon personnage (race, classe, statistiques, équipement de départ) afin de commencer l'aventure avec un personnage qui me ressemble.

### Features
- 🔴 Formulaire de création : choix de la Race (5 options), de la Classe (7 options). La Spécialisation n'est **pas** choisie ici (voir correction ci-dessous) — aperçu en lecture seule uniquement
- 🔴 Application automatique des modificateurs raciaux aux statistiques de base
- 🔴 Verrouillage des classes exclusives selon la race choisie (règle du Codex des Classes)
- 🔴 Boutique de départ : répartition du budget d'équipe (100 po / 3-4 personnages) entre armes, armures, accessoires
- 🔴 Validation des règles d'interdiction (le Mage ne peut pas équiper d'armure lourde, etc.) — **côté serveur**, pas seulement dans l'interface
- 🟡 Fiche personnage consultable après création (reprend la structure du Joueur.docx)
- 🟡 Modification d'un personnage existant (changer l'équipement avant le départ)
- 🟢 Aperçu visuel simple (icône de race)

### Technique — Base de données
- 🔴 Table `Personnage` (id, nom, race, classe, specialisation, force, dexterite, vitalite, charisme, intelligence, sagesse, pv_max, pv_actuel, niveau, xp, equipe_id)
- 🔴 Table `Equipe` (id, nom, or_restant)
- 🔴 Table `Objet` (id, nom, type, categorie, degats/defense, prix, effet) — import statique du Codex de l'Équipement
- 🔴 Table `InventairePersonnage` (personnage_id, objet_id, emplacement, quantite)
- 🔴 API : `POST /personnages`, `GET /personnages/:id`, `PATCH /personnages/:id/equipement`
- 🟡 Script de seed Prisma qui importe automatiquement tout le contenu du Codex de l'Équipement en base (au lieu de la ressaisie manuelle)

### Décisions de cadrage (voir `CLAUDE.md` et `vibe/implementation_plan/implementation_plan.md` pour le détail)
- Les 8 caractéristiques (dont Chance/Perception, absentes du Bestiaire source) sont toujours affichées complètes, jamais omises.
- Une classe "déconseillée" pour une race reste sélectionnable dans l'UI, jamais masquée — seule une case "—" bloque.
- Le stuff de spawn du Mage (Bâton + Grimoire + Robe d'apprenti) est verrouillé et gratuit ; le stuff "École Noire" (nécessite de vaincre le Cultiste mineur) est **hors périmètre du Sprint 1**, reporté au Sprint 3 (combat).
- La spécialisation n'est pas un choix à la création : c'est le contenu d'un futur arbre de compétences par classe (non conçu). Retirée du flux Sprint 1, affichée en lecture seule ; sa conception est à planifier dans un sprint ultérieur.

---

## Sprint 2 — Déplacement sur la carte de combat

**Objectif** : un personnage peut se déplacer sur une grille octogonale (8 directions) avec des obstacles, sur plusieurs cartes différentes.

### User story
> En tant que joueur, je veux déplacer mon personnage sur une grille avec des obstacles afin de me positionner tactiquement avant et pendant un combat.

### Features
- 🔴 Génération d'une grille avec adjacence à 8 directions (diagonales + lignes droites)
- 🔴 Modèle de case : terrain normal / obstacle / relief (hauteur), état de l'obstacle (PV, détruit ou non)
- 🔴 Affichage réactif : la couleur/l'apparence d'une case suit l'état de la donnée (pas d'image à changer manuellement)
- 🔴 Déplacement au clic, limité par la portée calculée (dé + modificateur Dextérité, cf. logique de combat déjà posée)
- 🔴 Destruction d'un obstacle (variable d'état qui change, la case se met à jour automatiquement)
- 🟡 Plusieurs cartes de test chargeables (format JSON décrivant dimensions + obstacles + reliefs)
- 🟢 Carte "grise/noire/blanc" minimale pour les tests, sans habillage visuel

### Technique — Base de données
- 🔴 Table `Carte` (id, nom, zone_liee, largeur, hauteur, json_layout) — `json_layout` stocke la position des obstacles/reliefs
- 🟡 Table `PartieEnCours` (id, carte_id, etat_json) si on veut pouvoir reprendre une carte en cours plus tard (pas bloquant pour ce sprint, mais la colonne coûte rien à prévoir)
- Aucune notion de combat/mob encore à ce stade — uniquement la mécanique de déplacement à valider

---

## Sprint 3 — Combat contre des mobs

**Objectif** : un affrontement complet est jouable, du placement des mobs jusqu'au loot final.

### User story
> En tant que joueur, je veux affronter un ou plusieurs mobs placés sur la carte, chacun avec ses propres déplacements et attaques, afin de vivre un vrai combat tactique au tour par tour.

### Features
- 🔴 Import des 38 créatures du Bestiaire en données structurées (stats, attaques, comportement, loot)
- 🔴 Placement des mobs sur la carte (manuel pour les tests, puis via des rencontres prédéfinies par zone)
- 🔴 Boucle de tour complète : initiative (d20 + Dextérité) une fois en début de combat, puis pour chaque personnage → déplacement (dé) → action (attaque/objet)
- 🔴 IA des mobs selon les 3 archétypes déjà définis (Mêlée / Distance / Support)
- 🔴 Résolution d'attaque (d20 vs Défense, dégâts selon la fourchette de l'attaque)
- 🔴 Application du système de loot en fin de combat (tirage indépendant par objet selon son %)
- 🟡 Comportements spéciaux liés au bestiaire (fuite du Gobelin éclaireur, régénération du Troll, etc.)
- 🟢 Obstacles destructibles utilisés tactiquement pendant le combat (lien avec le Sprint 2)

### Technique — Base de données
- 🔴 Table `Creature` (id, nom, zone, niveau, pv, force, dexterite, vitalite, resistance, faiblesse, comportement) — import du Bestiaire
- 🔴 Table `Attaque` (creature_id, nom, degats_min, degats_max, effet)
- 🔴 Table `Loot` (creature_id, objet_id, palier, pourcentage, quantite_min, quantite_max)
- 🔴 Table `CombatLog` (id, date, carte_id, participants_json, actions_json, resultat, loot_obtenu_json) — **cette table est la base exploitée plus tard par le MJ IA** pour ajuster ses décisions
- 🔴 Service `MoteurDeCombat` séparé de l'interface (logique pure, testable indépendamment de l'affichage)
- 🟡 Script de seed qui importe tout le Bestiaire (stats + attaques + loot) automatiquement plutôt qu'à la main

---

## Sprint 4 — Équipement, craft et compagnons

**Objectif** : personnaliser son build entre les combats : équiper, crafter, choisir un compagnon.

### User story
> En tant qu'équipe d'aventuriers, je veux équiper mes personnages, crafter des objets via l'Ingénieur et choisir un compagnon afin d'adapter notre stratégie de combat.

### Features
- 🔴 Interface d'inventaire et d'équipement par emplacement (reprend la fiche Joueur)
- 🔴 Système de craft : consommer des matériaux lootés pour produire un objet du Répertoire de Craft (réservé à l'Ingénieur pour l'équipement)
- 🔴 Alchimiste du village : préparation de potions à partir d'ingrédients + frais
- 🔴 Choix du compagnon d'équipe — un seul pour toute la compagnie, conditionné par la composition (classe requise dans le groupe)
- 🟡 Application des bonus de compagnon en combat (capacité de transport, attaques du compagnon)
- 🟢 Amélioration de l'équipement de compagnon (sacoches, tourelle du Sanglier, etc.)

### Technique — Base de données
- 🔴 Table `RecetteCraft` (objet_resultat_id, materiau_id, quantite_requise, classe_requise)
- 🔴 Table `Compagnon` (id, nom, lien_classe, pv, force, dexterite, vitalite, capacite_transport)
- 🔴 Table `CompagnonEquipe` (equipe_id, compagnon_id) — contrainte unique sur `equipe_id` pour forcer la règle "un seul compagnon par équipe"
- 🟡 Extension de `InventairePersonnage` pour gérer les emplacements de sacoche du compagnon

---

## Sprint 5 — Agent MJ IA

**Objectif** : un agent IA prend en charge la narration et l'animation des combats.

### User story
> En tant que joueur, je veux qu'un MJ IA anime le combat (narration, décisions des mobs, gestion des interactions) afin de vivre une expérience dynamique plutôt qu'un enchaînement de menus.

### Features
- 🔴 Intégration de l'API Claude côté serveur (jamais côté client — sécurité des clés)
- 🔴 RAG sur les documents de référence (Bestiaire, Codex des Classes, Codex de l'Équipement) pour que l'agent reste cohérent avec les règles établies
- 🔴 Outils exposés à l'agent : lancer un dé, déplacer un mob, appliquer des dégâts, consulter une fiche du bestiaire, consulter l'historique de combats (`CombatLog`)
- 🔴 Narration textuelle injectée dynamiquement dans l'interface de combat
- 🔴 Garde-fous : toute action proposée par l'agent est validée par le moteur de combat (Sprint 3) avant application — l'agent ne peut pas contourner les règles
- 🟡 Ajustement des taux de loot selon le mode d'achèvement du mob, en s'appuyant sur les logs stockés (amélioration notée dans le Bestiaire v3)
- 🟢 Mémoire longue de l'agent entre les sessions (référence aux combats précédents)

### Technique — Base de données
- 🔴 Base vectorielle pour le RAG (ex: Chroma en local pour commencer, ou pgvector si migration PostgreSQL)
- 🔴 Service `AgentMJ` isolé, orchestration des appels API + outils
- 🟡 Table `SessionNarrative` (id, equipe_id, resume_contexte) pour donner à l'agent un résumé de l'histoire en cours sans reposer tout l'historique brut à chaque appel

---

## Sprint 6 — Mis de côté pour plus tard (non prioritaire)

Idées déjà évoquées mais explicitement reportées :
- Génération procédurale de cartes de combat via IA (adaptées au type d'affrontement, réutilisables)
- Reliefs et objets interactifs avancés (tronc, muret destructible avec bonus d'armure, mécanismes de boss)
- Packaging Steam (Tauri/Electron + Steamworks) une fois le cœur de jeu validé en web local

---

## Suivi

| Sprint | Statut |
|---|---|
| 0 — Fondations techniques | ⬜ À faire |
| 1 — Création de personnage | ⬜ À faire |
| 2 — Déplacement sur carte | ⬜ À faire |
| 3 — Combat contre des mobs | ⬜ À faire |
| 4 — Équipement, craft, compagnons | ⬜ À faire |
| 5 — Agent MJ IA | ⬜ À faire |
| 6 — Améliorations futures | ⬜ Backlog |
