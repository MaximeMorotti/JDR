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
- `Codex_Classes.md` — 5 races, 7 classes (génériques + exclusives), 38 spécialisations, restrictions d'armes/armures
- `Codex_de_l_Equipement.md` — armes, armures, accessoires, prix, budget d'équipe
- `Codex_Compagnons.md` — 10 compagnons, stats, conditions d'accès
- `Repertoire_de_Craft.md` — recettes de craft (armes, armures, potions, équipement de compagnon)
- `Bestiaire_Chapitre1.md` — 38 créatures/boss avec stats, attaques, système de loot

> Si un fichier ci-dessus est encore au format `.pdf` dans `docs/`, demande à le convertir en `.md` avant de t'en servir — les agents ont un taux d'erreur élevé en lisant des PDF directement (voir historique des écarts documentés).

## Règles de jeu clés à ne jamais oublier

- **Budget de départ** : 100 po pour toute l'équipe (1 à 4 personnages), pas 100 po par personnage.
- **"Déconseillé" dans la matrice Classes × Races n'est jamais bloquant** — seule une case vide ("—") bloque l'accès à une classe.
- **Le Mage a un stuff verrouillé** (Bâton d'apprenti + Grimoire d'apprenti + Robe d'apprenti, gratuits au spawn), sauf l'École Noire qui peut remplacer son grimoire/robe/accessoires en affrontant le Cultiste mineur du village — **mais ce remplacement nécessite un combat, donc hors périmètre du Sprint 1** (pas de système de combat avant le Sprint 3). Au Sprint 1, tous les Mages (École Noire incluse) démarrent avec le même stuff de base.
- **"Déconseillé" ne doit jamais être caché dans l'UI**, seulement signalé (badge d'avertissement) — ne pas confondre avec les combos bloquées ("—"), qui elles peuvent être grisées/barrées.
- **Un seul compagnon par équipe**, jamais plus, choisi après la création de tous les personnages. Accessible même en équipe solo (1 personnage). Les 5 chiens et la Mule sont des compagnons **universels, sans prérequis** (écart assumé avec le Codex, voir tableau ci-dessous). Élan → **classe** Chasseur sylvestre, Gnome → **classe** Mage, Sanglier → **classe** Ingénieur dans l'équipe — mais Fée → **race** Demi-Orc (pas une classe : "Demi-Orc" n'est jamais une classe, voir la matrice classes × races). Modélisé en base (`CompagnonRef.raceRequiseId` pour la Fée, `CompagnonClasseLiee` pour Élan/Gnome/Sanglier, aucune ligne pour les chiens/Mule).
- **Seul l'Ingénieur peut crafter** le palier Rudimentaire (armes/armures/accessoires) et les améliorations de compagnon. Les potions, elles, sont accessibles à toutes les classes via l'Alchimiste du village.
- **Le carquois et TOUS les accessoires (collier, anneaux, bracelets, ceinture, cape) ont une version Commune achetable au village** — ne pas les oublier de la boutique du Sprint 1.
- **Grille de combat** : octogonale, 8 axes de déplacement (diagonales + lignes droites), pas hexagonale.
- **Système de loot** : 4 paliers de %, tirage indépendant par objet (Courant 70%, Peu commun 45% plafond, Rare 30%, Unique boss 100%).
- **La spécialisation n'est PAS un choix exclusif fait à la création du personnage.** Chaque classe a 4-5 spécialisations, chacune avec une attaque signature — mais ce sont les briques d'un futur **arbre de compétences** que le personnage débloque et améliore en progressant, pas une case cochée une fois pour toutes. Au Sprint 1, la création de personnage s'arrête à race + classe ; les spécialisations de la classe choisie s'affichent en aperçu informatif (lecture seule), `Personnage.specialisationId` reste toujours `null`. **L'arbre de compétences par spécialisation lui-même reste à concevoir** (omis de la conception initiale, repéré en cours de Sprint 1) — ne pas l'implémenter sans nouvelle conception explicite.

## Roadmap (sprints)

Voir `docs/Roadmap_Sprints.md` pour le détail complet. État actuel :

- [x] Sprint 0 — Fondations techniques (fait)
- [ ] **Sprint 1 — Création de personnage (EN COURS)** : équipe de 1 à 4, budget partagé, choix du compagnon en fin de flux
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

*Compléter ce tableau au fil des sprints plutôt que de modifier les Codex sources à chaud.*