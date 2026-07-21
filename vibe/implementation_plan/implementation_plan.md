# Sprint 1 — Création de personnage et d'équipe de A à Z

Permettre à un joueur (mode local, 1 appareil) de créer une équipe de 1 à 4 personnages (pseudo, race, classe, équipement de départ) avec budget partagé de 100 po, puis de choisir un compagnon — le tout persisté en SQLite via Prisma et rechargeable.

> **Correction en cours de sprint :** la spécialisation n'est **pas** un choix fait à la création (voir décision ci-dessous) — elle a été retirée du flux, contrairement à ce que dit le prompt initial.

---

## Décisions validées (relecture PDF sources + arbitrage utilisateur)

Toutes les questions ouvertes de la version précédente de ce plan ont été tranchées après relecture directe des PDF sources (`docs/final/pdf/`, convertis en texte via `pdftotext -layout` pour comparaison ligne à ligne avec les `.md`) et arbitrage explicite du porteur de projet. Les `.md` de `docs/final/md_for_ide/` sont **conservés comme source de vérité** (le contenu PDF ne s'est pas révélé plus complet que la conversion .md existante) mais ont été **enrichis** pour combler des trous réels du design d'origine — chaque ajout est marqué `⚠️ Écart comblé` dans le fichier concerné et repris dans `CLAUDE.md`.

> [!NOTE]
> **Taille de l'équipe : 1 à 4.** Confirmé — décision déjà actée dans `CLAUDE.md`, la restriction "3 à 4" des Codex concerne le mode campagne, pas la création.

> [!NOTE]
> **Statistiques des compagnons.** Le PDF contient la même double table que le `.md` (fiches individuelles + tableau comparatif), sans note de version. **Le tableau comparatif est retenu comme référence** (positionné en fin de document, cohérent avec le rôle combat réel des montures) — tranché et documenté dans `Codex_des_Compagnons.md` et `CLAUDE.md`. Les fiches individuelles restent du texte de lore uniquement, pas des données de jeu.

> [!NOTE]
> **La race « Mage » est une race, pas une classe.** Confirmé dans le PDF (matrice classes × races, colonne "Mage"). Le code distingue `race: "MAGE"` et `classe: "MAGE"`.

> [!NOTE]
> **Caractéristiques Chance et Perception.** Vérifié exhaustivement : absentes du Bestiaire PDF, du DOCX, et même du fichier `docs/maj/Bestiaire_Stats_Radar.xlsx` qui sert de source aux radars de stats (seules 6 stats y figurent). Ce ne sont donc pas des valeurs "à définir plus tard" mais un vrai trou du design. **Décision : elles ne sont jamais exclues** — la fiche personnage doit toujours afficher les 8 caractéristiques complètes, sans rien omettre, même si Chance/Perception n'ont pas encore d'usage mécanique au Sprint 1. Des valeurs ont été comblées par déduction du lore racial et ajoutées à `Bestiaire_et_Races.md` (ex: Elfe Perception 8, Demi-Orc Chance/Perception 3) — à valider par le game design ultérieurement, sans bloquer le Sprint 1.

> [!NOTE]
> **Poids d'armure (léger/moyen/lourd), absent du Codex Équipement.** Confirmé absent du PDF également (vérifié table par table). Une classification a été ajoutée par déduction (Commun/Rudimentaire = Légère, Gobelin = Moyenne, Unique = Lourde) dans `Codex_de_l_Equipement.md`. **Sans effet pratique au Sprint 1** puisque seul le palier Commun (entièrement Légère) est achetable — la restriction "pas d'armure lourde" ne peut jamais se déclencher ce sprint, mais le champ doit être modélisé dès maintenant pour rester valide aux sprints suivants (craft/loot).

> [!NOTE]
> **Grimoire/Robe/accessoires de cultiste (École Noire).** Confirmé : nécessite de vaincre le Cultiste mineur, donc un combat — **hors périmètre du Sprint 1** (pas de système de combat avant le Sprint 3). Tous les Mages, École Noire incluse, démarrent le Sprint 1 avec le même stuff verrouillé (Bâton d'apprenti + Grimoire d'apprenti + Robe d'apprenti). Ces objets peuvent être affichés à titre indicatif dans l'UI ("débloqué en vainquant le Cultiste mineur") mais ne sont jamais sélectionnables.

> [!NOTE]
> **Champs optionnels non implémentés au Sprint 1 :** Genre, Âge, Alignement, Origine, Faim, Soif, Endurance, Mana, Statuts actifs, Points de compétence, Titre, Arbre de compétences. Ces champs existent dans la fiche technique mais relèvent de sprints ultérieurs. Ils seront déclarés dans le schéma Prisma (colonnes optionnelles) mais pas exposés dans le flux de création.

---

## Proposed Changes

Le sprint est découpé en **5 missions** correspondant exactement à celles du prompt. Voici le plan fichier par fichier, groupé par composant.

---

### 1. Schéma Prisma — Modélisation des données

#### [MODIFY] [schema.prisma](file:///c:/Users/33768/Desktop/dev_open_source/JDR/server/prisma/schema.prisma)

Remplacement complet du schéma de test par le schéma relationnel du Sprint 1.

**Modèles créés :**

| Modèle | Rôle | Contraintes clés |
|---|---|---|
| `Equipe` | Groupe de 1-4 personnages | `orRestant` ≥ 0, défaut 100 |
| `Personnage` | Fiche complète d'un PJ | FK vers `Equipe`, unicité pseudo dans l'équipe |
| `RaceRef` | Catalogue des 5 races | Données statiques (seed), stats de base sur les **8** caractéristiques (Chance/Perception incluses) |
| `ClasseRef` | Catalogue des 7 classes | Données statiques, FK vers races autorisées, flag `deconseille` sur la liaison (jamais bloquant, voir `ClasseAutoriseeParRace`) |
| `SpecialisationRef` | Catalogue des 37 spécialisations | FK vers `ClasseRef`. **Purement informatif au Sprint 1** : `Personnage.specialisationId` reste toujours `null` — la spécialisation décrit un futur arbre de compétences (non conçu), pas un choix exclusif à la création. Affichée en lecture seule côté client. |
| `ObjetRef` | Catalogue des objets (armes, armures, accessoires) | Type, catégorie, palier, prix, stats, **`origine`** (`ACHAT_VILLAGE \| SPAWN_GRATUIT \| LOOT \| CRAFT`), **`poidsArmure`** (`LEGERE \| MOYENNE \| LOURDE`, nullable hors armures) |
| `InventairePersonnage` | Objets équipés/portés par un personnage | FK vers `Personnage` + `ObjetRef`, emplacement |
| `CompagnonRef` | Catalogue des 10 compagnons | Stats, prérequis classe/race |
| `CompagnonEquipe` | Compagnon choisi par l'équipe | FK vers `Equipe` + `CompagnonRef`, contrainte unique sur `equipeId` |
| `ClasseAutoriseeParRace` | Table de liaison N-N races ↔ classes | Champ `autorisee: bool` (case vide "—" du Codex = absente de la table = bloquant) + champ `deconseille: bool` (combo listée "✓ (déconseillé)" dans le Codex — **toujours autorisée**, jamais bloquante, juste signalée à titre indicatif dans l'UI) |
| `CategorieArmeAutorisee` | Catégories d'armes par classe | Pour valider l'équipement |

**Relations clés :**
- `Equipe` 1 → N `Personnage` (max 4, validé côté applicatif)
- `Equipe` 1 → 0..1 `CompagnonEquipe` (unicité via contrainte)
- `Personnage` N → N `ObjetRef` via `InventairePersonnage`

---

### 2. Seed — Initialisation du catalogue

#### [NEW] [seed.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/server/prisma/seed.ts)

Script de seed complet peuplant la base SQLite depuis les données des Codex Markdown.

**Données insérées :**

| Entité | Source | Nb d'entrées |
|---|---|---|
| 5 races | Bestiaire_et_Races.md | Humain, Elfe, Nain, Demi-Orc, Mage — avec stats de base (8 carac., Chance/Perception comblées) |
| 7 classes | Codex_des_Classes.md | Guerrier, Voleur, Barde, Mage, Berserker, Ingénieur, Chasseur sylvestre |
| 37 spécialisations | Codex_des_Classes.md | 4-5 par classe, Mage ventilé par école. Informatif uniquement, voir écart |
| Restrictions race ↔ classe | Codex_des_Classes.md (matrice) | Liens N-N |
| ~73 objets achetables/lootables/craftables | Codex_de_l_Equipement.md | Armes, armures, accessoires avec prix/stats, taggés origine + poids d'armure |
| 10 compagnons | Codex_des_Compagnons.md | Avec stats, prérequis (classe ou race), capacité de transport |
| Catégories d'armes par classe | Codex_des_Classes.md | Interdictions transversales |

---

### 3. Backend — API Node/Express

#### [MODIFY] [package.json](file:///c:/Users/33768/Desktop/dev_open_source/JDR/server/package.json)

Ajout des dépendances : `express`, `cors`, `@types/express`, `@types/cors`, `zod` (validation).

---

#### [MODIFY] [index.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/server/src/index.ts)

Point d'entrée du serveur Express (port 3000) avec middleware CORS et routes montées.

---

#### [NEW] [db.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/server/src/db.ts)

Instance singleton du `PrismaClient`.

---

#### [NEW] [routes/catalogue.routes.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/server/src/routes/catalogue.routes.ts)

Routes **GET** (lecture seule du catalogue de référence) :

| Route | Description |
|---|---|
| `GET /api/catalogue/races` | Liste des races avec stats de base |
| `GET /api/catalogue/classes` | Classes, regroupées par race autorisée |
| `GET /api/catalogue/classes/:classeId/specialisations` | Spécialisations pour une classe |
| `GET /api/catalogue/objets?type=&categorie=&palier=commun` | Catalogue filtrable (seul palier Commun achetable au Sprint 1) |
| `GET /api/catalogue/compagnons` | Liste des compagnons avec prérequis |

---

#### [NEW] [routes/equipe.routes.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/server/src/routes/equipe.routes.ts)

Routes de gestion d'équipe :

| Route | Description |
|---|---|
| `POST /api/equipes` | Créer une équipe (nom) → retourne l'équipe avec 100 po |
| `GET /api/equipes/:id` | Récupérer une équipe complète (personnages, inventaires, compagnon) |
| `DELETE /api/equipes/:id` | Supprimer une équipe |
| `GET /api/equipes` | Liste de toutes les équipes (pour le rechargement) |

---

#### [NEW] [routes/personnage.routes.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/server/src/routes/personnage.routes.ts)

Routes de gestion des personnages :

| Route | Description |
|---|---|
| `POST /api/equipes/:equipeId/personnages` | Créer un personnage (pseudo, race, classe — pas de spécialisation, voir écart) |
| `GET /api/equipes/:equipeId/personnages/:id` | Consulter la fiche complète |
| `PATCH /api/equipes/:equipeId/personnages/:id` | Modifier un personnage |
| `DELETE /api/equipes/:equipeId/personnages/:id` | Supprimer un personnage |
| `POST /api/equipes/:equipeId/personnages/:id/acheter` | Acheter un objet (déduit du budget équipe) |
| `DELETE /api/equipes/:equipeId/personnages/:id/inventaire/:inventaireId` | Retirer un objet (rembourse le budget) |

---

#### [NEW] [routes/compagnon.routes.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/server/src/routes/compagnon.routes.ts)

| Route | Description |
|---|---|
| `POST /api/equipes/:equipeId/compagnon` | Choisir un compagnon (vérifie les prérequis) |
| `DELETE /api/equipes/:equipeId/compagnon` | Retirer le compagnon |
| `GET /api/equipes/:equipeId/compagnons-disponibles` | Liste des compagnons éligibles pour l'équipe |

---

#### [NEW] [services/validation.service.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/server/src/services/validation.service.ts)

Service de validation autoritaire côté serveur :

- **`validerRaceClasse(raceId, classeId)`** — Vérifie la matrice d'exclusivité (case "—" = rejet ; "déconseillé" = accepté avec info) via `ClasseAutoriseeParRace`
- **`validerEquipement(personnageId, objetId, emplacement)`** — Vérifie les catégories d'armes autorisées par classe, les interdictions transversales par poids d'armure (`poidsArmure`), et **rejette systématiquement tout objet dont `origine != ACHAT_VILLAGE`** (empêche d'acheter/équiper un objet `SPAWN_GRATUIT` ou `LOOT` via la boutique)
- **`validerBudget(equipeId, prix)`** — Vérifie que l'or restant >= prix
- **`validerTailleEquipe(equipeId)`** — Maximum 4 personnages
- **`validerCompagnon(equipeId, compagnonId)`** — Vérifie les prérequis classe/race dans l'équipe

---

#### [NEW] [services/stats.service.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/server/src/services/stats.service.ts)

Service de calcul dynamique des statistiques :

- **`calculerStats(personnageId)`** — Retourne stats de base raciales + bonus d'équipement
- **`calculerPvMax(vitalite)`** — Formule de PV max à partir de la vitalité
- Les stats sont **calculées à la volée** (pas stockées en dur) pour refléter les changements d'équipement

---

### 4. Frontend — Client Vite/TS

Le client sera une SPA vanilla TypeScript avec un système de routing simple par hash (`#step-1`, `#step-2`, etc.) pour le flux pas-à-pas.

#### [MODIFY] [index.html](file:///c:/Users/33768/Desktop/dev_open_source/JDR/client/index.html)

Mise à jour du titre, meta, polices Google Fonts (Inter/Outfit), structure de base.

#### [MODIFY] [style.css](file:///c:/Users/33768/Desktop/dev_open_source/JDR/client/src/style.css)

Remplacement complet par le design system du JDR :
- Palette dark fantasy (fonds sombres, accents dorés/ambrés)
- Variables CSS pour les couleurs, espacements, typographies
- Glassmorphism pour les cartes de personnage
- Micro-animations (hover, transitions, apparitions)
- Design responsive

#### [MODIFY] [main.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/client/src/main.ts)

Remplacement du contenu Vite par défaut par le routeur et l'application JDR.

#### [NEW] [api.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/client/src/api.ts)

Client HTTP (fetch wrapper) pour communiquer avec le backend (base URL `http://localhost:3000/api`).

#### [NEW] [router.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/client/src/router.ts)

Routeur hash simple avec les étapes :
1. **Accueil** — Créer/charger une équipe
2. **Infos de base** — Pseudo, race, classe (par personnage) ; spécialisations affichées en aperçu, non sélectionnables
3. **Équipement** — Boutique de départ avec budget partagé
4. **Compagnon** — Choix du compagnon d'équipe
5. **Récapitulatif** — Fiche d'équipe complète

#### [NEW] [pages/accueil.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/client/src/pages/accueil.ts)

Page d'accueil : créer une nouvelle équipe ou charger une existante.

#### [NEW] [pages/creation-personnage.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/client/src/pages/creation-personnage.ts)

**Écran combiné race + classe, à divulgation progressive** (validé avec l'utilisateur — objectif : ne pas noyer le joueur d'information d'entrée) :

1. **Vue initiale :** grille des 5 races sous forme de cartes compactes (portrait, nom), sans détail.
2. **Au clic sur une race :** la carte s'agrandit (accordéon/expansion, pas de changement de page) et révèle :
   - Stats de base de la race (les 8 caractéristiques, y compris Chance/Perception),
   - Lore court + trait racial,
   - La liste des 7 classes juste en dessous, chacune avec une icône + titre, dans l'un des 3 états visuels suivants :
     - **Disponible** (case ✓ non déconseillée) : cliquable normalement.
     - **Disponible mais déconseillée** (ex: Mage-race → Guerrier) : cliquable, badge d'avertissement visible ("déconseillé") + micro-explication au survol/tap (ex: "Force et Vitalité faibles pour ce choix"). **Ne jamais la cacher** — règle actée dans `CLAUDE.md`.
     - **Bloquée** (case "—", ex: Nain → Barde... non, Nain n'a pas de case vide sauf classes exclusives d'autres races) : classe grisée/barrée, non cliquable, avec l'explication courte ("réservé aux Elfes").
3. **Au clic sur une classe disponible :** la sélection se confirme (race + classe verrouillées pour ce personnage), l'écran redescend vers un **aperçu en lecture seule** des 4-5 spécialisations de la classe (ou des 3 écoles pour le Mage) — **aucune sélection possible**. Voir écart ci-dessous : la spécialisation n'est pas un choix à la création, elle décrit le futur arbre de compétences (non conçu) que le personnage débloquera en progressant.
4. Calcul dynamique en temps réel des stats affichées (base raciale, la classe n'ajoute pas de bonus de stats dans les Codex actuels — seulement des restrictions d'équipement).

> **⚠️ Écart identifié en cours de sprint — spécialisation ≠ choix à la création.** Le prompt Sprint 1 listait la spécialisation comme un champ à choisir au même titre que race/classe. Erreur de conception repérée pendant l'implémentation : chaque spécialisation définit une unique attaque signature au sein d'un arbre de compétences par classe (4-5 spécialisations = 4-5 branches), pas une case exclusive cochée une fois pour toutes. Cet arbre de compétences (quelles attaques/compétences se débloquent, dans quel ordre, avec quels prérequis) **n'a jamais été conçu** — ni dans les Codex, ni dans les échanges de conception. Décision actée avec l'utilisateur : retirer le choix du Sprint 1, afficher les spécialisations en lecture seule, laisser `Personnage.specialisationId` toujours `null`, et concevoir l'arbre de compétences dans un sprint ultérieur avant de le brancher.

Ce flux évite un écran "race" puis un écran "classe" séparés (trop de clics/pages) tout en gardant l'information dense mais optionnelle (repliée par défaut).

#### [NEW] [pages/equipement.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/client/src/pages/equipement.ts)

Boutique de départ : catalogue filtré par classe (`origine = ACHAT_VILLAGE` uniquement — le stuff `SPAWN_GRATUIT` n'apparaît jamais en boutique), affichage du budget restant en temps réel, drag-and-drop ou clic pour équiper/retirer, emplacements visuels de la fiche personnage.

**Cas particulier Mage :** les emplacements Main Droite (Bâton), Sac de sorts (Grimoire) et Torse (Robe) sont pré-remplis automatiquement et grisés/verrouillés (non cliquables) dès la sélection de la classe Mage — l'API assigne ces 3 objets `SPAWN_GRATUIT` sans coût. Aucun objet École Noire (Grimoire/Robe/accessoires de cultiste) n'est proposé, même pour un Mage École Noire — un tooltip peut indiquer "débloqué après avoir vaincu le Cultiste mineur (à venir)".

#### [NEW] [pages/compagnon.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/client/src/pages/compagnon.ts)

Sélection du compagnon : filtre automatique selon la composition de l'équipe, affichage des stats et du lore, un seul choix possible.

#### [NEW] [pages/recapitulatif.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/client/src/pages/recapitulatif.ts)

Fiche d'équipe complète : tous les personnages avec stats calculées, équipement, compagnon. Reprend la structure visuelle de `fiche_technique_joueur_personnage.md`.

#### [NEW] [components/stat-bar.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/client/src/components/stat-bar.ts)

Composant réutilisable : barre de stat animée avec label et valeur.

#### [NEW] [components/carte-personnage.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/client/src/components/carte-personnage.ts)

Composant réutilisable : carte résumé d'un personnage (race, classe, stats principales).

#### [NEW] [components/objet-carte.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/client/src/components/objet-carte.ts)

Composant réutilisable : carte d'objet avec palier (couleur), stats, prix.

#### [DELETE] [counter.ts](file:///c:/Users/33768/Desktop/dev_open_source/JDR/client/src/counter.ts)

Suppression du fichier de démo Vite — plus utilisé.

---

### 5. Audit de cohérence — Écarts à reporter dans la documentation

Écarts déjà comblés directement dans les `.md` sources et repris dans `CLAUDE.md` (voir sections précédentes pour le détail) :

| # | Source | Écart | Résolution |
|---|---|---|---|
| 1 | Codex des Compagnons | Stats des fiches individuelles ≠ stats du tableau récapitulatif (ex: Chihuahua PV 5 vs 10) | Tableau comparatif retenu comme référence en base |
| 2 | Prompt vs Codex Équipement | « 1 à 4 personnages » vs « 3 à 4 aventuriers » | 1 à 4, déjà acté dans `CLAUDE.md` |
| 3 | Fiche technique | Chance et Perception n'ont pas de valeurs raciales de base (confirmé absent du PDF, du DOCX et du fichier Excel source des radars) | Valeurs comblées par déduction du lore racial dans `Bestiaire_et_Races.md` |
| 4 | Codex des Classes | La matrice classe×race a une colonne « Mage » (la race) — confusion car la classe s'appelle aussi « Mage » | Distingué clairement dans le code (`race: MAGE` / `classe: MAGE`) |
| 5 | Codex des Compagnons | Les chiens sont liés à « Guerrier, Voleur, Barde » mais la Mule aussi — or la Mule n'est pas un chien | Pas d'impact code, juste lore |
| 6 | Fiche technique | Le trait racial Humain « +1 point libre à répartir à la création » n'est pas formalisé dans un système de points de création | Reporté — pas de système de points au Sprint 1 |
| 7 | Codex de l'Équipement | Le Mage a un « stuff de spawn de départ » (bâton + grimoire + robe) gratuit mais aucun prix n'est listé | Champ `origine: SPAWN_GRATUIT`, assigné automatiquement, jamais en boutique |
| 8 | Codex des Classes | Le Chasseur sylvestre (Gardien sylvestre) a accès à la « magie naturelle » mais cette catégorie d'arme n'est pas dans le catalogue d'équipement | Pas d'impact Sprint 1 — pas d'arme de magie naturelle dans le catalogue |
| 9 | Codex de l'Équipement | Aucune pièce d'armure n'est classée par poids (léger/moyen/lourd), alors que le Codex des Classes restreint l'armure lourde par classe | Classification comblée (`poidsArmure`) — sans effet pratique au Sprint 1 (seul le Commun, tout Léger, est achetable) |
| 10 | Codex de l'Équipement | Grimoire/Robe/accessoires de cultiste (École Noire) nécessitent de vaincre le Cultiste mineur — combat inexistant au Sprint 1 | Objets non exposés (ni spawn, ni boutique) tant que le Sprint 3 n'est pas livré |

---

## Verification Plan

### Automated Tests

```bash
# Depuis server/ — Seed + vérification base
npx prisma migrate dev --name sprint1
npx prisma db seed

# Lancement du serveur
npm run dev

# Tests API via curl (ou script de test)
# POST /api/equipes → 201
# POST /api/equipes/:id/personnages → 201 (validation race/classe)
# POST /api/equipes/:id/personnages/:id/acheter → 200 (déduction budget)
# GET /api/equipes/:id → équipe complète
```

### Manual Verification

- Lancer le client (`cd client && npm run dev`) et le serveur (`cd server && npm run dev`) côté à côté.
- Parcourir le flux complet : Accueil → Création 1er personnage → Équipement → Ajouter un 2e personnage → Compagnon → Récapitulatif.
- Vérifier les cas limites :
  - Créer un Mage de race Humain → **refusé** par le serveur (case "—" de la matrice)
  - Créer un Guerrier de race Mage → **accepté** (déconseillé, mais jamais bloquant) et visible dans l'UI avec un badge d'avertissement, pas caché
  - Équiper une armure lourde sur un Mage → **refusé** (théorique : aucune armure lourde n'existe encore en boutique au Sprint 1, donc ce test valide surtout que la règle ne casse rien plutôt qu'un vrai rejet observable)
  - Tenter d'acheter/équiper le Bâton d'apprenti ou le Grimoire d'apprenti via la route boutique → **refusé** (`origine != ACHAT_VILLAGE`) ; ils doivent déjà être présents automatiquement sur un Mage
  - Vérifier qu'aucun objet "cultiste" (Grimoire/Robe/Pendentif/Anneau du pacte) n'apparaît dans `GET /api/catalogue/objets`, même pour un Mage École Noire
  - Dépasser le budget de 100 po → **refusé**
  - Ajouter un 5e personnage → **refusé**
  - Choisir l'Élan sans Chasseur sylvestre dans l'équipe → **refusé**
  - Créer un personnage et vérifier que ses 8 caractéristiques (Chance/Perception incluses) sont bien renvoyées par l'API, aucune omise
- Recharger la page → l'équipe est toujours là (persistance SQLite).
