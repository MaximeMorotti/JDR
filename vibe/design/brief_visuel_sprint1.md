# Brief visuel Sprint 1 — état courant et plan pas-à-pas

Ce fichier persiste le brief de refonte visuelle donné oralement par l'utilisateur (avec croquis),
pour qu'une session sans mémoire de la conversation puisse reprendre exactement où on en était.
À mettre à jour à chaque étape franchie (cocher, ne pas réécrire l'historique).

## Où on en est (code)

- Backend Sprint 1 complet et **commité** sur `feat/sprint1-creation-equipe` (schéma, seed, routes,
  validation). Voir `vibe/implementation_plan/implementation_plan.md` pour le détail technique.
- Frontend fonctionnel de bout en bout, **commité** une première fois (`f27bed0`), puis des
  correctifs/ajouts non commités depuis (voir `git status` / `git diff` pour l'état exact) :
  - Bug corrigé : chiens + Mule sont des compagnons **universels** (sans prérequis de classe),
    contrairement au Codex source — écart documenté dans `CLAUDE.md`.
  - Nouvelle page **`client/src/pages/equipe.ts`** : hub central après création d'un personnage.
    Remplace l'ancienne page `recapitulatif.ts` (supprimée). Affiche les emplacements personnages
    (max 4, "+" pour ajouter), l'emplacement compagnon ("+" pour ajouter), suppression avec popup
    de confirmation (`client/src/components/confirmation.ts`), bouton "Boutique" flottant bas-droit.
  - Navigation revue : après création d'un personnage → transition thématique → `/equipe` (plus
    directement `/equipement/:id`). Toutes les pages renvoient vers `/equipe` comme hub central.
  - Transition par race : `client/src/components/transition-race.ts` — **version simplifiée
    (placeholder)** : couleur + emoji + balayage CSS. Pas encore l'animation illustrée complète
    demandée (porte qui s'ouvre, feuilles, pierres, ossements, runes — voir plus bas).
  - Images : 5 portraits de race + 10 illustrations de compagnons optimisées en WebP dans
    `client/public/img/races/` et `client/public/img/compagnons/` (script one-off
    `client/scripts/optimiser-images.mjs`, sharp désinstallé après usage). Correspondance
    illustration↔espèce de compagnon déduite **visuellement** (pas de source), documentée dans
    `CLAUDE.md`.
  - Polices et palette **retravaillées et validées par l'utilisateur** (voir section dédiée
    ci-dessous "Décisions tranchées — Palette & Polices"). Cinzel/Inter abandonnés.

## Décisions tranchées — Palette & Polices (validées par l'utilisateur, étape 1 en cours)

Obtenu par itération visuelle directe dans le navigateur (captures d'écran commentées en direct).
Ne pas revenir en arrière sans repasser par le même type de validation.

### Palette (`client/src/style.css`, bloc `:root`)

Palette "donjon aux torches" (cuir/parchemin/bronze), en remplacement de la palette violette froide
initiale :
- `--bg-deep: #120d09`, `--bg-panel: #1e160e` — fond quasi noir, très chaud (brun/charbon, pas violet)
- `--gold: #cc9f3f`, `--ember: #d4622a` — accents dorés/braise
- `--text: #ece0c8` (**beige/crème** — c'est ce beige que l'utilisateur veut retrouver sur tout le
  texte, cf. demande "un beige en couleur")
- Variables de matière pour les futurs cadres thématiques (étape sélection de race) déjà posées :
  `--mat-metal-*`, `--mat-bois-*`, `--mat-bronze-*`, `--mat-os-*`, `--mat-obsidienne-*`

### Polices — système à 3 paliers (validé après plusieurs itérations)

| Palier | Police | Usage | Pourquoi |
|---|---|---|---|
| **Grands titres** | `UnifrakturMaguntia` (var `--gothique`) | `h1`, `h2` uniquement | Vrai blackletter gothique, très ornementé — illisible en dessous d'une certaine taille, réservé aux titres. Rendu avec un effet "bronze brossé" (voir ci-dessous), pas juste la police brute. |
| **Texte courant / UI** | `MedievalSharp` (var `--moyen`) | `h3`, `body` (police par défaut), boutons, champs, labels, placeholders | Palier intermédiaire demandé explicitement ("une police entre les deux") après que `UnifrakturMaguntia` partout se soit révélé illisible sur les placeholders ("Nom de l'équipe", "Compagnons de l'Aube"). |
| Disponible mais peu utilisé actuellement | `EB Garamond` (var `--serif`) | Fallback dans `--moyen`, réserve pour du texte très dense si besoin plus tard | Lisible, toujours dans l'esprit manuscrit, mais pas la priorité actuelle de l'utilisateur. |

Chargement des polices : `client/index.html`, un seul lien Google Fonts avec les 4 familles
(`UnifrakturMaguntia`, `MedievalSharp`, `Cinzel`, `EB Garamond`). **`Cinzel` reste chargé mais
n'est quasiment plus utilisé** (fallback uniquement) — pourrait être retiré si confirmé inutile.

### Effet "bronze brossé" sur `h1` (le titre "Le Début d'une Épopée")

Recette CSS retenue après plusieurs allers-retours (trop sombre → trop brillant/doré → bon) :
- Dégradé de fond (`background`, avec `background-clip: text`) : texture "brossée" via un
  `repeating-linear-gradient` à 97° en surcouche + dégradé de fond bronze
  (`#e8b673 → #c17f3e → #97602c → #6b4022 → #b0763a`), **pas de tons trop clairs (glow doré trop
  vif = "trop") ni trop sombres (se fond dans le fond = illisible)**.
  `-webkit-text-stroke` fin sombre pour la définition des contours.
- Lueur "derrière" le texte (demandée explicitement) : `filter: drop-shadow(...)` (pas
  `text-shadow`, qui ne donnait pas le même effet de halo) — actuellement deux couches, dosées
  pour être visibles mais discrètes (a été réduit une fois après avoir été jugé "trop").
- `font-size: 3.6rem` sur `h1` (agrandi une fois à la demande).

### Prochaine sous-étape de l'étape 1 (pas encore commencée)

L'écran de sélection de race (étoile ornementale + cadres thématiques par matière + effet 3D +
graphique radar au clic) **n'a pas encore été construit** — seuls la palette et les polices sont
validées pour l'instant. C'est la suite immédiate.

## Le brief visuel donné par l'utilisateur (avec croquis photo)

### 1. Palette + polices + écran de sélection de race — À FAIRE EN PREMIER

L'utilisateur est explicite : **ces trois éléments doivent être traités ensemble et validés avant
tout le reste**, car le style qui en ressort doit ensuite se propager à toutes les autres pages
(ça simplifie le travail futur si c'est fait dans le bon ordre).

- **Palette actuelle jugée pas assez "médiéval dark fantasy"**, même avec Cinzel + fond sombre
  violacé actuel. Direction proposée (à valider visuellement) : basculer vers une palette plus
  chaude (cuir/parchemin/bronze/torche) plutôt que la palette froide violette actuelle.
- **Polices** : Cinzel pour les titres semble correct dans l'esprit mais l'utilisateur trouve que
  "même les polices" ne font pas assez médiéval — probablement le contraste avec Inter (sans-serif
  moderne) pour le corps de texte. Piste : remplacer Inter par une serif type EB Garamond/Crimson
  Text pour un rendu manuscrit cohérent avec Cinzel.
- **Écran de sélection de race — refonte complète demandée**, croquis fourni (5 ovales en étoile
  autour d'un centre, reliés par des traits) :
  - Un graphique "en étoile" stylisé, **beaucoup de détail graphique**, avec un **effet 3D léger**
    sur le dessin (relief/embossage, pas de la vraie 3D WebGL — CSS/SVG suffit).
  - Référence de style donnée en image (croix ornementale noire) **explicitement sous licence,
    à ne PAS utiliser ni copier** — juste une indication du niveau de détail ornemental attendu.
    Dessiner un motif original (ou en trouver un libre de droits) qui s'en inspire sans le copier.
  - Au bout de chaque branche : le portrait de la race dans un **contour thématique à la matière** :
    - Nain → métal gravé
    - Elfe → bois
    - Humain → bronze lisse
    - Demi-Orc → os
    - Mage → obsidienne runique gravée
  - **Interaction** : au clic sur une race, l'image s'agrandit et vient se placer **à gauche de
    l'écran**, avec en **haut à droite un graphique radar des stats** (façon le PDF
    `Bestiaire_Stats_Radar.xlsx` / radar déjà utilisé pour illustrer les stats raciales), et
    **en dessous** les classes disponibles pour cette race, chacune avec une **petite icône**
    pour l'illustrer.

Une fois ce trio validé → **commit**, puis passage à l'étape suivante.

### 2. Animations de transition (par race) — après validation de l'étape 1

Actuellement un placeholder simplifié existe (`transition-race.ts`). L'utilisateur veut une passe
plus poussée après avoir validé le style de base. Thèmes déjà spécifiés par race (à conserver,
ne pas réinventer) :
- Humain → une porte de taverne qui s'ouvre
- Elfe → des feuilles qui volent et balaient l'écran **de bas en haut**
- Nain → même principe mais **de haut en bas**, avec des pierres précieuses
- Demi-Orc → des ossements
- Mage → des runes

L'utilisateur fera un **test** après cette étape avant de continuer (point de validation explicite).

### 3. Layout de la page équipe — après le test des animations

La page `equipe.ts` existe déjà fonctionnellement (voir plus haut) mais son **habillage visuel**
n'a pas encore reçu la passe de style riche (cadres thématiques, etc.) — à reprendre une fois le
style de base validé, pour qu'elle hérite de la palette/police/dépouille graphique tranchées à
l'étape 1.

### 4. Animation des pièces (transition boutique) — après le layout équipe

Transition d'entrée dans la boutique : "des pièces qui tombent" (coin-fall). Pas encore implémentée.

### 5. Boutique — refonte complète, après l'animation des pièces

Décrite en détail par l'utilisateur, pas encore commencée :
- **Mannequin à gauche** qui **illumine** les emplacements concernés par l'objet survolé/sélectionné.
- Sans personnage sélectionné : on peut tout acheter (pas de filtre par défaut).
- **Filtre par personnage** : grise les objets que ce personnage ne peut pas équiper (plutôt que
  de les cacher).
- **Clic sur le mannequin** = filtre direct par emplacement (ex: clic sur la tête → filtre casques).
- **Filtres cumulables** (mannequin + personnage + autres critères).
- **Layout de la liste** : à droite de l'écran, chaque objet en **rectangle pleine largeur**,
  empilés verticalement, triés par défaut **prix décroissant** (le plus cher en haut).
- **Important — silhouette du mannequin selon le contexte** : si on équipe un **compagnon**, le
  mannequin ne doit **pas** avoir une apparence humaine, il doit dessiner (de façon simplifiée) le
  compagnon concerné. Pour un **personnage joueur**, une silhouette humaine est acceptable.

### 6. Compagnons — après la boutique

L'utilisateur n'a pas encore pu visiter/tester l'interface compagnon en profondeur donc n'a pas de
direction précise à donner pour l'instant, **sauf** :
- Le **positionnement/layout actuel est bon**, à conserver.
- Le **style (couleurs, police)** ne fait pas assez médiéval dark fantasy — sera de toute façon
  corrigé automatiquement une fois la palette/police de l'étape 1 propagée à toutes les pages.

### 7. Récapitulatif général — en dernier

- Il manque des **images** et un **graphique** (probablement le même composant radar que pour la
  sélection de race, réutilisé).
- Ne pas utiliser un layout en blocs/grille rigide — l'utilisateur veut quelque chose de **plus
  fluide et visuel**, tout en respectant le thème une fois tranché.
- Note : la page "récap" séparée a été fusionnée dans `equipe.ts` (le hub) pendant cette session —
  à clarifier si l'utilisateur veut une page de détail distincte plus riche (radar + images) par
  personnage, ou si le hub `equipe.ts` doit lui-même devenir cette vue enrichie. Pas encore
  tranché — à vérifier avant de construire cette étape (dernière de la liste, donc du temps avant
  d'y arriver).

## Ordre de travail confirmé par l'utilisateur

1. **Palette + police + écran sélection race (étoile détaillée + effet 3D)** ← étape en cours
2. Commit
3. Animations de transition par race → test utilisateur
4. Layout page équipe (habillage visuel)
5. Animation des pièces (transition boutique)
6. Boutique (refonte complète : mannequin, filtres, liste)
7. Compagnons (héritera du style, peu de travail spécifique attendu)
8. Récapitulatif général (radar + images + layout fluide)

**Règle de méthode donnée par l'utilisateur** : avancer étape par étape, ne pas tout faire d'un
coup, committer entre les étapes, tester avant de continuer sur la suivante.
