# Plan — Grille de combat, obstacles et interactions raciales (Sprint 2)

**Statut : implémenté (Sprint 2, tickets GitHub #1 à #5).**
Le modèle d'obstacle, la table d'interaction raciale et les règles de combat simplifiées du banc
d'essai décrits ci-dessous sont codés et testés (voir section 6-7 pour le détail et le seul écart
restant). Ce document reste la référence du règlement pour le Sprint 3, qui remplacera les
placeholders explicitement marqués comme temporaires (§5bis, §7).

## 1. Rappel du cadre (`Roadmap_Sprints.md`, Sprint 2)

> Un personnage peut se déplacer sur une grille octogonale (8 directions) avec des obstacles, sur
> plusieurs cartes différentes.

- Grille **octogonale** = grille carrée classique où les 8 directions sont autorisées (lignes
  droites + diagonales), **pas** un pavage hexagonal (déjà acté dans `CLAUDE.md`). Concrètement :
  distance de Chebyshev (`max(|dx|, |dy|)`), pas la distance de Manhattan. Reconfirmé à plusieurs
  reprises — `combat-test.ts` reste valide tel quel, aucun changement de géométrie à faire.
- Modèle de case attendu par la Roadmap : terrain normal / obstacle / relief (hauteur), avec un
  état pour l'obstacle (PV, détruit ou non).
- Table technique prévue : `Carte` (id, nom, zoneLiee, largeur, hauteur, jsonLayout).

## 2. Modèle du plateau (final)

Une carte est une grille de cases `(x, y)`. Chaque case a :

- Un **type de terrain** : `NORMAL` par défaut.
- Un **obstacle optionnel**, type générique (voir §3 et ADR-0001 — pas de catégories figées en
  base), avec les propriétés suivantes :
  - **PV** — toujours présent, tout obstacle est destructible, juste en quantité variable. Un
    obstacle à 0 PV est détruit, la case redevient un terrain normal franchissable librement.
  - **Franchissable** (bool) — indépendant de la destructibilité. Si oui, un **malus de Dextérité**
    propre à l'obstacle s'applique au jet de franchissement (§5).
  - Ces deux champs (PV, malus) sont des nombres libres par instance ; des **presets** pratiques
    sont proposés à la pose (§3), sans être une catégorie mécanique figée.
- Une **case Tranchée/Souterrain optionnelle** (matérialisation probable du nœud Vitalité "Creuser
  une tranchée" du Nain, `codex_arbre_competences.md` §1.2) — **finalisée** :
  - Ne bloque **jamais** le passage, pour aucune race.
  - Coûte un déplacement **doublé** pour toute race sauf le Nain (déjà codé :
    `COUT_TRANCHEE_NON_NAIN = 2` dans `combat-test.ts`).
  - **Protection aux dégâts + visibilité réduite** (malus au jet d'attaque de quiconque cible
    l'occupant) : réservées au **Nain uniquement**, mais l'accès à la case reste ouvert à tous —
    seul le bénéfice de protection est Nain-exclusif, pas l'occupation elle-même. Ces deux effets
    dépendent du moteur de combat (Sprint 3), pas codés pour l'instant.
- Un **relief optionnel** (dénivelé) — mentionné par la Roadmap, toujours différé, pas indispensable
  pour un premier jet.

## 3. Taxonomie des obstacles (résolu — voir ADR-0001)

**Type générique unique**, pas de catégories figées en base : PV, franchissabilité et malus sont des
nombres libres par instance de l'obstacle. D'anciennes catégories envisagées survivent uniquement
comme **presets de PV suggérés à la pose** (raccourcis pratiques dans l'éditeur, pas une règle dure
ni un champ `categorie` en base) :

| Preset | PV suggérés | Exemple |
|---|---|---|
| Léger | 5 | Caisse, muret fragile, tonneau |
| Moyen | 25 | Rocher, tronc couché |
| Lourd | 50 | Mur en pierre, porte renforcée |

L'**infranchissable de zone** (gouffre, ravin) reste un cas à part, hors de cette échelle : pas de
PV, jamais destructible, jamais franchissable.

**Nouvelle règle raciale (Elfe)** : un Elfe esquive, grâce à son agilité, le malus de **tout**
obstacle du preset "Léger" — toute la catégorie, sans sous-cas ni exception à définir au coup par
coup.

## 4. Interaction race × catégorie d'obstacle (résolu)

| Race | Passage étroit (crevasse) | Franchissement en hauteur | Justification |
|---|---|---|---|
| **Nain** | **Bonus** | **Malus** | Petit gabarit trapu, pas agile en hauteur (Taille 130-150cm) |
| **Elfe** | **Malus** | **Bonus** | Grand gabarit agile, moins à l'aise en passage resserré (Taille 185-195cm) |
| **Humain** | Neutre | Neutre | Trait "Polyvalence" — ni bonus ni malus marqué |
| **Demi-Orc** | **Malus** | Neutre | Gabarit le plus large (175-200cm, 85-110kg) |
| **Mage** | Neutre | Léger malus | Fragilité physique générale, pas de gabarit particulier |

Cet axe (étroit/hauteur) est **indépendant** de la règle Elfe/obstacles-bas de la section 3 — les
deux peuvent se cumuler pour un même Elfe face à un obstacle qui coche les deux critères.

## 5. Jets de dé pour interagir avec un obstacle (résolu dans le principe)

```
Franchir  = d20 + Dextérité + bonus/malus racial (§4) − malus de l'obstacle ≥ Seuil de franchissement
Détruire  = d20 + Force ≥ Seuil de résistance
```

- N'importe quel personnage peut tenter l'une ou l'autre approche (Franchir ou Détruire),
  indépendamment de sa race/classe — rien n'est réservé, seule la probabilité de réussite varie
  selon les stats. Chaque personnage tente son propre jet individuellement pendant la phase de tour
  de son camp (le tour par tour alterne équipe/ennemis, mais ce n'est pas une capacité "d'équipe"
  mutualisée).
- **Asymétrie de Force assumée** : un groupe sans personnage à Force élevée (Nain, Demi-Orc) doit
  contourner un mur plutôt que le détruire. Aucun plancher de rattrapage ajouté — ça donne du poids
  à la composition d'équipe.
- **Échec de franchissement** : la case est refusée, le reste de la portée de déplacement du tour
  reste utilisable (pas de tour perdu en entier).
- **Conséquences narratives graduées (blessure en cas d'échec critique, etc.) : hors périmètre pour
  l'instant.** L'idée initiale était de les faire arbitrer au cas par cas par le MJ IA, mais le MJ
  IA **n'a aucun rôle actif dans la résolution du combat** avant le Sprint 5 (décision explicite, à
  revisiter à ce moment-là). En attendant, voir §5bis pour le comportement déterministe du banc
  d'essai.
- **Dégâts de destruction** : 5 PV fixes par réussite — temporaire, en attendant le vrai système de
  dégâts d'arme du Sprint 3.

## 5bis. Règles de combat simplifiées pour le banc d'essai (avant le vrai moteur de combat)

Le MJ IA n'intervenant pas encore, le combat du banc d'essai (`combat-test.ts`) suit des règles
fixes et déterministes, façon jeu de plateau classique :

- Sélection d'un personnage → attaque possible sur toute cible dans sa **portée d'attaque**.
- **Portée d'attaque** :
  - **Joueurs** (pas de donnée Bestiaire dédiée) : portée d'attaque = portée de déplacement
    (Dextérité) — placeholder, en attendant une vraie mécanique d'arme/classe.
  - **Ennemis** : gardent leur `porteeAttaque` du Bestiaire (`MELEE`/`DISTANCE`, déjà codé dans
    `agirEnnemi`), **indépendante** de leur déplacement — aucun changement ici, pas de confusion
    entre les deux règles.
- **Mêlée vs distance selon la catégorie de l'arme équipée** (objet en `MAIN_DROITE`,
  `personnage.routes.ts`/`seed.ts`) — **pas** selon la race (une version précédente de ce document
  le proposait par erreur, corrigé pour rester cohérent avec `CLAUDE.md` : c'est l'arme qui décide,
  un Elfe peut très bien jouer un Guerrier corps-à-corps) :
  - `ARME_DISTANCE`, `ARME_JET`, `OBJET_MAGIQUE` (Bâton/Grimoire du Mage — décrit comme infligeant
    des "Dégâts magiques", pas un outil) → attaque à distance, pas de déplacement nécessaire.
  - `ARME_LEGERE`, `ARME_LOURDE` → mêlée, déplacement jusqu'à la cible nécessaire pour attaquer.
  - Aucune arme équipée → mêlée par défaut (à mains nues).
  - **Placeholder explicitement temporaire**, à remplacer par la vraie logique de combat par
    arme/classe une fois le Sprint 3 (vrai moteur de combat) commencé.
- **Dégâts** : 5 PV fixes par attaque réussie (même valeur temporaire que la destruction d'obstacle,
  §5).
- **PV d'obstacle** : presets de la section 3 (5/25/50).

## 6. Déplacement de base (déjà tranché, déjà implémenté)

Pour un déplacement simple (repositionnement sur une carte **sans obstacle ni monstre**) :

> Portée de déplacement = **Dextérité du personnage**, sans jet de dé.

Pas de bonus/malus racial à ce stade — la race influe déjà via la Dextérité de base, sans règle
supplémentaire à inventer pour ce cas simple.

**Implémenté** : bouton « ⚔ Combat test (préprod) » sur la page d'aventure
(`client/src/pages/aventure.ts`) → grille de test (`client/src/pages/combat-test.ts`), personnages
de l'équipe placés dessus, chacun avec sa portée de déplacement affichée et applicable au clic
(distance de Chebyshev ≤ Dextérité). Obstacles (presets Léger/Moyen/Lourd + case infranchissable de
zone, §3), Tranchée, jets de franchissement/destruction avec interaction raciale (§4-5) et attaque
de base sur ennemi (§5bis) sont tous codés. La carte (dimensions, obstacles, Tranchée) est chargée
depuis l'API (`GET /cartes/:id`) au lieu de données codées en dur.

## 7. Ce qui reste à coder

Tout ce qui précède (§2-5bis) est codé et testé (module de résolution pur `combat-resolution.service.ts`,
47 tests vitest). Il ne reste que :

- **Route serveur pour l'attaque** : `determinerModeAttaque`/`determinerPorteeAttaquePersonnage`/
  `determinerPorteeAttaqueCreature` existent et sont testées côté serveur, mais aucune route ne les
  expose — `attaquerEnnemi` reste calculé et appliqué côté client dans `combat-test.ts`, contrairement
  à Franchir/Détruire qui passent bien par `POST /cartes/:id/franchir` et `/detruire`. Écart documenté
  dans `CLAUDE.md`, à corriger avant/pendant le Sprint 3 (qui remplace de toute façon ce placeholder
  par le vrai moteur de dégâts d'arme).
- Chargement de **plusieurs cartes** sélectionnables dans l'UI (une seule carte réelle chargée
  suffisait pour ce sprint, 🟡 dans la Roadmap) — pas indispensable avant Sprint 3.
- Relief/dénivelé — toujours hors périmètre, à définir si le besoin s'en fait sentir.
- Effets réels de la protection aux dégâts / visibilité réduite du Nain sur la case Tranchée —
  dépendent du moteur d'attaque du Sprint 3, seul l'indicateur de donnée est posé (§2).

## 8. Questions ouvertes — récapitulatif (toutes résolues)

1. ~~Malus racial : surcoût de déplacement ou blocage total ?~~ → ni l'un ni l'autre, un malus
   appliqué à un jet de dé (§5).
2. ~~Propositions Humain/Demi-Orc/Mage de la table race × obstacle ?~~ → validées telles quelles
   (§4).
3. ~~Catégorie générique ou catégories figées ?~~ → générique, voir ADR-0001 (§3).
4. ~~Formule de jet (d20 + stat vs seuil) ?~~ → validée, avec asymétrie de Force assumée (§5).
5. ~~Échec de franchissement : tour perdu ou case seule refusée ?~~ → case refusée seulement (§5).
6. ~~Dégâts fixes temporaires (5 PV/réussite) ?~~ → acceptés (§5).
7. ~~Case Tranchée : les autres races peuvent-elles s'y tenir ?~~ → oui, accessible à tous, seule
   la protection reste Nain-exclusive (§2).
8. ~~Malus de lenteur Tranchée : à coder isolément ou avec le reste ?~~ → déjà codé (§2), rien à
   refaire.
9. ~~Esquive Elfe sur les obstacles bas — portée exacte ?~~ → toute la catégorie "Léger" (§3).
10. ~~Rôle du MJ IA dans la résolution des échecs de combat ?~~ → aucun rôle avant le Sprint 5,
    combat "jeu de plateau" déterministe en attendant (§5bis).
11. ~~Mêlée/distance : par race ou par arme équipée ?~~ → par catégorie d'arme équipée, pas par
    race (§5bis).
12. ~~Portée d'attaque = portée de déplacement pour tout le monde ?~~ → seulement pour les joueurs
    (placeholder) ; les ennemis gardent leur `porteeAttaque` propre du Bestiaire (§5bis).

## 9. Prochaines étapes

Les trois étapes prévues ici (schéma `Carte`/Obstacle, implémentation des presets/règle
Elfe/interaction raciale/jets dans `combat-test.ts`, règles simplifiées §5bis) sont faites — voir
§6-7. Restent hors périmètre de ce document, pour de futurs sprints :

1. Sprint 3 (vrai moteur de combat) : remplace les placeholders de §5bis (dégâts fixes, portée
   d'attaque joueur = portée de déplacement, mêlée/distance temporaire par catégorie d'arme) et
   ajoute la route serveur d'attaque manquante (§7).
2. Sprint 5 (MJ IA) : à revisiter pour l'arbitrage narratif des échecs de franchissement/destruction
   (§5).
