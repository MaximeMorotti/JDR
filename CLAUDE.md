# CLAUDE.md — Contexte permanent du projet JDR

Ce fichier donne à Claude Code tout le contexte nécessaire pour travailler sur ce projet sans avoir à le réexpliquer. Il résume les décisions prises lors de la conception (hors de Claude Code, dans une conversation claude.ai séparée).

## Le projet

RPG tactique narratif avec combat au tour par tour sur grille, et un MJ IA qui anime les affrontements en temps réel. Nom de travail : "Le Début d'une Épopée" (chapitre 1).

## Stack technique (décidée et figée)

- **TypeScript strict** de bout en bout (client + serveur)
- **Client** : Vite, vanilla TS pour l'instant (pas de framework tant que ce n'est pas nécessaire)
- **Serveur** : Node + Express
- **Base de données** : SQLite en dev local, via **Prisma** comme ORM
- **Distribution finale visée** : Steam, via Tauri ou Electron une fois le cœur de jeu validé en web local (pas encore commencé)
- **Agent MJ** (futur, Sprint 5) : API Claude côté serveur uniquement, jamais côté client (sécurité des clés)

## Documentation de référence (`docs/`)

Ces fichiers sont la source de vérité pour toutes les règles de jeu. Toujours les consulter avant d'implémenter une mécanique — ne jamais halluciner une règle.

- `Fiche_Technique_Joueur.md` — structure de données d'un personnage
- `Codex_Classes.md` — 5 races, 7 classes au sens du Codex (génériques + exclusives, le Mage comptant pour 1 avec 3 écoles — **implémenté comme 9 classes**, voir écart documenté ci-dessous), 37 spécialisations (compté dans le seed : 4 par classe sauf Mage Blanc qui en a 5), restrictions d'armes/armures
- `Codex_de_l_Equipement.md` — armes, armures, accessoires, prix, budget d'équipe
- `Codex_Compagnons.md` — 10 compagnons, stats, conditions d'accès
- `Repertoire_de_Craft.md` — recettes de craft (armes, armures, potions, équipement de compagnon)
- `Bestiaire_Chapitre1.md` — 38 créatures/boss avec stats, attaques, système de loot

> Si un fichier ci-dessus est encore au format `.pdf` dans `docs/`, demande à le convertir en `.md` avant de t'en servir — les agents ont un taux d'erreur élevé en lisant des PDF directement (voir historique des écarts documentés).

## Documents de conception internes (`vibe/`)

Contrairement à `docs/` (Codex canoniques, sourcés du game design d'origine), `vibe/design/` contient
des propositions **encore en cours de validation** avec l'utilisateur — ne pas les traiter comme une
source de vérité figée, toujours vérifier leur statut en tête de fichier avant de s'en servir :

- `vibe/design/arbre_competences_proposition.md` — cadrage des règles du futur système de progression
  (deux arbres séparés : « Arbre LV » sur points de niveau, « Arbre de Maîtrise » sur XP d'usage par
  attaque). Document de référence pour les décisions de principe déjà tranchées avec l'utilisateur.
- `vibe/design/codex_arbre_competences.md` — contenu détaillé dérivé du document ci-dessus : les 8
  branches de l'Arbre LV (génériques + variantes par race) et les paliers de Maîtrise/Éveil pour les
  37 spécialisations du Codex des Classes. Toujours un brouillon en relecture au moment où ceci est
  écrit.
- Aucun des deux n'est encore branché en base ni en interface — `client/src/pages/competences.ts` est
  un stub purement visuel (radar + liste des 8 branches, aucun nœud réel) en attendant que ce contenu
  soit validé.

## Règles de jeu clés à ne jamais oublier

- **Budget de départ** : 100 po pour toute l'équipe (1 à 4 personnages), pas 100 po par personnage.
- **"Déconseillé" dans la matrice Classes × Races n'est jamais bloquant** — seule une case vide ("—") bloque l'accès à une classe.
- **Le Mage a un stuff verrouillé** (Bâton d'apprenti + Grimoire d'apprenti + Robe d'apprenti, gratuits au spawn), sauf la classe Mage Noir qui peut remplacer son grimoire/robe/accessoires en affrontant le Cultiste mineur du village — **mais ce remplacement nécessite un combat, donc hors périmètre du Sprint 1** (pas de système de combat avant le Sprint 3). Au Sprint 1, tous les Mages (Mage Noir inclus) démarrent avec le même stuff de base.
- **Le Mage se décline en 3 classes exclusives à la race Mage** : Mage Élémentaire, Mage Noir, Mage Blanc (voir écart documenté ci-dessous). Ce choix d'école est **structurant et fait à la création**, contrairement aux vraies spécialisations (voir plus bas) qui restent différées.
- **"Déconseillé" ne doit jamais être caché dans l'UI**, seulement signalé (badge d'avertissement) — ne pas confondre avec les combos bloquées ("—"), qui elles peuvent être grisées/barrées.
- **Un seul compagnon par équipe**, jamais plus, choisi après la création de tous les personnages. Accessible même en équipe solo (1 personnage). Les 5 chiens et la Mule sont des compagnons **universels, sans prérequis** (écart assumé avec le Codex, voir tableau ci-dessous). Élan → **classe** Chasseur sylvestre, Gnome → **classe** Mage, Sanglier → **classe** Ingénieur dans l'équipe — mais Fée → **race** Demi-Orc (pas une classe : "Demi-Orc" n'est jamais une classe, voir la matrice classes × races). Modélisé en base (`CompagnonRef.raceRequiseId` pour la Fée, `CompagnonClasseLiee` pour Élan/Gnome/Sanglier, aucune ligne pour les chiens/Mule).
- **Seul l'Ingénieur peut crafter** le palier Rudimentaire (armes/armures/accessoires) et les améliorations de compagnon. Les potions, elles, sont accessibles à toutes les classes via l'Alchimiste du village.
- **Le carquois et TOUS les accessoires (collier, anneaux, bracelets, ceinture, cape) ont une version Commune achetable au village** — ne pas les oublier de la boutique du Sprint 1.
- **Un arc ou une arme lourde (catégorie `ARME_DISTANCE`/`ARME_LOURDE`) prend les deux mains** : équiper l'un des deux en `MAIN_DROITE` rend `MAIN_GAUCHE` indisponible (pas de bouclier/grimoire en plus), et inversement. Pas sourcé dans le Codex — décision explicite de l'utilisateur (retour de test sur la boutique), validée à la fois côté serveur (`personnage.routes.ts`, route `acheter`) et côté client (mannequin grisé + boutique incompatible).
- **Tous les objets de la boutique restent toujours visibles**, quelle que soit la classe du personnage affiché — un objet qu'il ne peut pas équiper (catégorie d'arme non autorisée) est **grisé, jamais caché** (bug corrigé : un filtrage retirait entièrement de la liste les objets hors catégorie, donnant l'impression que des objets du Codex — ex: l'Arc court de chasse — manquaient au catalogue alors qu'ils étaient bien en base).
- **Grille de combat** : octogonale, 8 axes de déplacement (diagonales + lignes droites), pas hexagonale.
- **Système de loot** : 4 paliers de %, tirage indépendant par objet (Courant 70%, Peu commun 45% plafond, Rare 30%, Unique boss 100%).
- **La spécialisation n'est PAS un choix exclusif fait à la création du personnage.** Chaque classe a 4-5 spécialisations, chacune avec une attaque signature — mais ce sont les briques d'un futur **arbre de compétences** que le personnage débloque et améliore en progressant, pas une case cochée une fois pour toutes. Au Sprint 1, la création de personnage s'arrête à race + classe ; les spécialisations de la classe choisie s'affichent en aperçu informatif (lecture seule), `Personnage.specialisationId` reste toujours `null`. **L'arbre de compétences par spécialisation lui-même reste à concevoir** (omis de la conception initiale, repéré en cours de Sprint 1) — voir la conception en cours dans `vibe/design/` (section dédiée plus bas) ; ne pas l'implémenter sans avoir fait valider le contenu par l'utilisateur.
- **Une équipe se verrouille définitivement dès que l'aventure est lancée** (`Equipe.aventureCommencee`, mis à `true` par `POST /equipes/:id/demarrer-aventure` quand le joueur valide le récap de départ) : plus aucune création/suppression de personnage, plus de changement de compagnon, plus d'achat en boutique — vérifié **côté serveur** (`validerEquipeModifiable`) sur toutes les routes de modification, jamais seulement côté client. Ce verrou ne se retire jamais (pas de route pour repasser à `false`). L'accès à la boutique dépend en plus d'une variable `enVillage` (actuellement `= !aventureCommencee`, faute d'un vrai système de localisation/carte — à remplacer quand celui-ci existera, Sprint 2+).
- **La fiche personnage (popup depuis le hub équipe) ne permet plus de supprimer un personnage** — le bouton a été remplacé par un bouton **« Compétence »** qui ouvre la page de gestion des compétences du personnage (`/competences/:personnageId`, encore un stub visuel, voir section `vibe/design/` plus bas). Le renommage reste possible tant que l'équipe n'est pas verrouillée.

## Roadmap (sprints)

Voir `Roadmap_Sprints.md` (racine du dépôt) pour le détail complet. État actuel :

- [x] Sprint 0 — Fondations techniques (fait)
- [x] **Sprint 1 — Création de personnage (TERMINÉ)** : équipe de 1 à 4, budget partagé, choix du compagnon en fin de flux (avec pseudo personnalisable), boutique/mannequin, pages équipe/compagnon habillées visuellement, écran « Lancer l'aventure » (avertissements selon l'équipement acheté, récap final, transition de fumée) qui verrouille définitivement l'équipe et bascule sur un stub de jeu (chat MJ sans IA, page de compétences basique) — voir `Sprint1_Walkthrough.md` pour le détail
- [ ] Sprint 2 — Déplacement sur carte de combat (grille octogonale, obstacles)
- [ ] Sprint 3 — Combat contre des mobs
- [ ] Sprint 4 — Équipement, craft, compagnons (mécaniques de jeu, pas juste catalogue)
- [ ] Sprint 5 — Agent MJ IA

## Conventions de code

- Commentaires en français
- Pas de dépendance superflue (éviter d'ajouter une lib pour ce qu'on peut faire simplement)
- Toute règle de jeu (budget, restrictions de classe, etc.) doit être validée **côté serveur**, jamais seulement côté client
- Si un écart apparaît entre ce que dit la documentation et ce que le code implémente, le documenter explicitement (ne jamais corriger silencieusement un Codex) — voir section suivante

## Écarts documentation ↔ implémentation déjà identifiés

| Écart | Résolution appliquée |
|---|---|
| Budget "3 à 4 aventuriers" (Codex Équipement) vs "1 à 4" (décision ultérieure) | 100 po quelle que soit la taille de l'équipe (1 à 4) |
| Compagnon "3 à 4 personnages" (Codex Compagnons) vs accessible même seul | Compagnon accessible dès 1 personnage dans l'équipe |
| Taille/Poids du Mage : plage non définie dans le Bestiaire | Saisie libre à la création, pas de contrainte de plage |
| Fiche Technique Joueur section 4 "Progression" (Points de compétence, Titre, Arbre de compétences) | Existe bien, à ne pas oublier dans le schéma `Personnage` |
| Chance et Perception : absentes des stats de base par race (Bestiaire, PDF, DOCX et même `Bestiaire_Stats_Radar.xlsx` source des radars — vérifié, seules 6 stats existent) | Valeurs comblées par déduction du lore racial dans `Bestiaire_et_Races.md`, à valider par le game design |
| Codex Équipement : aucune pièce d'armure n'est classée par poids (léger/moyen/lourd), alors que le Codex des Classes restreint l'armure lourde par classe | Classification ajoutée par déduction (Commun/Rudimentaire = Légère, Gobelin = Moyenne, Unique = Lourde) dans `Codex_de_l_Equipement.md`. Sans effet pratique au Sprint 1 : seul le palier Commun (tout Légère) est achetable, donc la restriction ne se déclenche jamais encore |
| Codex Compagnons : stats des fiches individuelles ≠ stats du tableau comparatif (ex : Chihuahua PV 5 vs 10) — confirmé identique dans le PDF, aucune note de version | Le **tableau comparatif** fait référence en base (seed) ; les fiches individuelles restent du texte de lore uniquement |
| Grimoire/Robe/accessoires de cultiste (École Noire) nécessitent de vaincre le Cultiste mineur — combat inexistant au Sprint 1 | Objets non exposés (ni spawn, ni boutique) tant que le Sprint 3 (combat) n'est pas livré |
| Codex Compagnons : la Fée est présentée comme liée à "Demi-Orc requis dans l'équipe" au même titre que les 3 autres compagnons à prérequis (Élan/Gnome/Sanglier), mais Demi-Orc est une **race**, pas une classe — incohérence de nature entre les 4 prérequis | Modélisé séparément en base : `CompagnonRef.raceRequiseId` (race) pour la Fée uniquement, `CompagnonClasseLiee` (classe) pour les 3 autres |
| Le prompt Sprint 1 listait "choix de la spécialisation" comme une étape de création au même titre que race/classe, alors que la spécialisation décrit un arbre de compétences (non conçu) à débloquer en progressant, pas un choix figé à la création | Retiré du flux de création (race + classe uniquement) ; spécialisations affichées en aperçu informatif ; arbre de compétences à concevoir dans un sprint ultérieur avant d'être branché |
| `docs/img/img_compagnon/final/` contient 10 illustrations nommées par nom de compagnon individuel (Buck, Hyubert, Nono...), aucune source ne les relie aux 10 espèces du Codex des Compagnons | Correspondance déduite **visuellement** (inspection des illustrations) dans `client/scripts/optimiser-images.mjs` — ex: Buck→Élan (silhouette d'orignal), Hyubert→Fée (ailes), Nono→Chihuahua (petit chien). À confirmer si un doute apparaît ; ne pas la considérer comme une donnée sourcée |
| Codex des Compagnons : les 5 chiens et la Mule sont documentés comme "disponibles pour toute équipe comportant un Guerrier, un Voleur ou un Barde" | **Décision explicite de l'utilisateur** (retour de test) : ce sont des compagnons universels, sans prérequis de classe. `classesLiees` vide pour ces 6 dans le seed |
| Codex des Classes : "le Mage" est modélisé comme **1 classe unique divisée en 3 écoles** (Élémentaire/Noire/Blanche), l'école étant choisie à la création puis une spécialisation au sein de cette école — mais la première implémentation Sprint 1 avait confondu ce choix d'école (structurant, fait à la création) avec le système de spécialisation différée (arbre de compétences à débloquer en progressant), l'affichant en simple aperçu informatif au même titre que les vraies spécialisations | **Décision explicite de l'utilisateur** : implémenté comme **3 classes indépendantes et exclusives à la race Mage** (`mage-elementaire`, `mage-noir`, `mage-blanc` dans `ClasseRef`), chacune avec ses ~4 spécialisations propres (`SpecialisationRef.classeId`, champ `ecole` supprimé du schéma — devenu redondant). Chaque classe a ainsi uniformément 4-5 spécialisations, comme les 6 autres classes, et l'école redevient un vrai choix de classe fait à la création plutôt qu'un sous-groupe de spécialisations différées |
| Fiche Technique §5 et Codex de l'Équipement modélisent "Bras Gauche"/"Bras Droit" comme deux emplacements d'armure distincts (brassards) — redondant puisque le Codex lui-même les décrit "identiques, symétriques" | **Décision explicite de l'utilisateur** (retour sur la refonte de la page boutique/mannequin) : fusionnés en **un seul emplacement `BRAS`** — un brassard s'achète et s'équipe pour les deux bras à la fois (prix et défense cumulés : ex. Brassard en cuir 3po/+1 chacun → "Brassards en cuir (paire)" 6po/+2). `EMPLACEMENTS` dans `personnage.routes.ts` et le seed (`brassard-cuir`, `brassard-peau-ecailleuse`) mis à jour en conséquence. **`MAIN_DROITE`/`MAIN_GAUCHE` restent séparés, volontairement exclus de cette fusion** (l'utilisateur l'a explicitement précisé après une première question de clarification) : ce sont l'arme principale et l'arme secondaire/bouclier, deux objets fonctionnellement différents — pas une paire symétrique comme les brassards — les fusionner empêcherait d'équiper une arme ET un bouclier simultanément et casserait le stuff verrouillé du Mage (bâton + grimoire, un par main) |
| Le Berserker (Demi-Orc) est exempté de la règle "arme à 2 mains bloque l'autre main" (son attaque signature "Fracassement" tient deux armes lourdes en même temps, une par main) — exception déjà codée côté client et serveur (`CLASSE_EXCEPTION_DEUX_MAINS` / check `classeId !== "berserker"`) | **Limitation connue, non résolue à la clôture du Sprint 1** : tous les objets `ARME_LOURDE` du seed ont un `emplacement: "MAIN_DROITE"` figé (contrairement à `ANNEAU`/`BRACELET` qui utilisent `FAMILLES_MULTI_SLOTS` pour choisir entre 2 emplacements) — aucune arme ne peut donc actuellement être achetée en `MAIN_GAUCHE`, ce qui rend l'exception Berserker inexploitable en pratique malgré le code déjà en place. À corriger avant/pendant le Sprint 4 (équipement) : soit une famille multi-slots dédiée aux armes lourdes (réservée au Berserker), soit un second objet dupliqué par arme, soit un contournement spécifique dans `slotValide` (`personnage.routes.ts`) |

*Compléter ce tableau au fil des sprints plutôt que de modifier les Codex sources à chaud.*