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

Commité dans `703470b` (branche `feat/sprint1-creation-equipe`).

### Sous-étape "étoile de race" — construite, pas encore commitée

L'écran de sélection de race est fait :
- `client/src/components/etoile-liens.ts` — génère le SVG du hub central + 5 branches +
  médaillons (motif original, pas de reprise de la croix de référence sous licence).
- Cadres thématiques par matière (CSS, dégradés coniques + ombres pour l'effet 3D/embossé) :
  `.cadre--metal` (Nain), `.cadre--bois` (Elfe), `.cadre--bronze` (Humain), `.cadre--os`
  (Demi-Orc), `.cadre--obsidienne` (Mage) — dans `style.css`.
- Positionnement des 5 points en cercle via l'astuce CSS `rotate() translate() rotate(-1*angle)`
  (pas de calcul JS de trigonométrie nécessaire pour ce positionnement précis).
- Au clic sur une race : layout 2 colonnes (`client/src/pages/creation-personnage.ts`,
  fonction `afficherDetailRace`) — portrait à gauche, à droite un graphique radar
  (`client/src/components/radar-stats.ts`, SVG octogonal façon le radar du Bestiaire, échelle
  fixe 0-20) puis en dessous les classes disponibles avec icône (`client/src/components/
  icones-classes.ts`, 7 icônes SVG dessinées en interne).
- Responsive : 2 colonnes au-delà de 720px, empilé en dessous (vérifié par mesure DOM directe,
  le rendu visuel via capture d'écran de ce navigateur outil est trompeur au-delà de ~500px de
  large — se fier aux mesures `getBoundingClientRect`/`getComputedStyle`, pas seulement au
  screenshot, pour vérifier le responsive large écran).
- Testé de bout en bout dans le navigateur (sélection race → classe → création → transition →
  page équipe), aucune erreur console.

**Pas encore fait** : nettoyage des classes CSS mortes de l'ancien layout (`.carte-race`,
`.detail-race`, `.detail-race-entete`, `.portrait-race`, `.portrait-race-grand` — remplacées mais
pas supprimées de `style.css`, sans impact fonctionnel).

### ✅ RÉSOLU — cadres réels intégrés (remplace toute la section "Itération 3" CSS ci-dessous)

Les 4 images de cadre fournies par l'utilisateur ont été déposées dans `docs/img/cadre/` (dossier
**singulier**, pas `cadres/`) sous les noms `cadre_elf.png`, `cadre_nain.png`, `cadre mage.png`
(avec un espace, attention), `cadre_demi-orc.png`. **Décision actée : on utilise ces vraies
images plutôt qu'une recréation CSS des matières** (bien plus fidèle).

Traitement effectué :
- `client/scripts/detourer-cadres.mjs` (script one-off, sharp réinstallé puis désinstallé après
  usage) : détoure le fond blanc de chaque image en transparence (seuil doux 222-250 sur le canal
  minimum RGB, pour un anti-aliasing propre en gardant l'ivoire du cadre Elfe intact — vérifié :
  alpha=0 au centre et aux coins de chaque image exportée), redimensionne à 700px de large,
  exporte en WebP dans `client/public/img/cadres/{elfe,nain,mage,demi-orc}.webp`.
- `client/src/pages/creation-personnage.ts` : nouvelle structure de marquage — pour l'Humain
  (bronze), un seul `<img>` circulaire comme avant (`.cadre--bronze`) ; pour les 4 autres, DEUX
  `<img>` superposées dans `.cadre-race-etoile.cadre--image` : `.portrait-dans-cadre` (portrait,
  60% de la taille du cadre, centré, cerclé) en dessous, `.image-cadre` (le PNG de cadre réel,
  100% de la taille, `object-fit: contain`) au-dessus, pointer-events none.
- `client/src/style.css` : toutes les anciennes textures CSS approximatives (`.cadre--pierre`,
  `.cadre--bois`, `.cadre--os`, `.cadre--obsidienne` — dégradés coniques/radiaux) ont été
  **supprimées**, remplacées par `.cadre--image` (juste un `filter: drop-shadow` pour l'ombre/glow
  au survol et à la sélection, suit le contour réel du PNG plutôt qu'un rectangle). Variables CSS
  `--mat-basalte-*` et `--mat-bois-*` (blanc bouleau) ajoutées lors d'une tentative CSS
  intermédiaire, **actuellement inutilisées** puisqu'on est passé aux vraies images — à nettoyer
  si confirmé qu'on ne reviendra pas à une approche CSS.
- Testé en navigateur : les 4 cadres s'affichent correctement avec transparence réelle (fond
  sombre de l'app visible à travers, pas de blanc résiduel), portraits bien positionnés dedans,
  rotation de la roue + agrandissement + parchemin fonctionnent toujours normalement avec ces
  nouveaux cadres. Aucune erreur console.

**Pas encore fait** : l'objet-position du portrait dans le cadre (60% taille, centré) n'a été
ajusté finement que par défaut (`object-position: 50% 15%`, avec une exception Demi-Orc à
`24% 18%` héritée de l'itération précédente) — à vérifier/peaufiner à l'usage si un portrait
déborde mal du trou du cadre pour une race donnée. Le trou de l'octogone Nain n'est pas
exactement suivi par le portrait (resté circulaire) — laisse de petits coins transparents visibles
aux 4 angles de l'octogone, jugé acceptable pour l'instant mais à revoir si l'utilisateur le
signale.

### ✅ RÉSOLU — parchemin 100% CSS amélioré (image réelle essayée puis abandonnée) + spécialisations en grille 2×2 avec icônes

Aller-retour sur le fond de `.etiquette-parchemin` : une texture réelle avait été fournie
(`docs/img/background/parchemin.jpg`), détourée via `client/scripts/detourer-parchemin.mjs` et
posée en `background-image` à 100%×100%. **Rejeté par l'utilisateur** : détourage de mauvaise
qualité, et l'image (portrait ~572×1024) étirée en `100% 100%` déformait visiblement le panneau
plus large. Décision : **revenir à une texture 100% CSS** (comme avant l'essai), mais en
l'améliorant — l'utilisateur a supprimé le fichier source (`docs/img/background/`) entre-temps,
donc plus d'image du tout désormais. `client/public/img/parchemin.webp` et
`detourer-parchemin.mjs` supprimés.

Nouvelle version CSS de `.etiquette-parchemin` (`style.css`) :
- `clip-path: polygon(...)` — bords déchirés irréguliers sur les 4 côtés (léger zigzag, quelques
  points en amplitude ~1-3% du panneau), plus riche que la première tentative CSS.
- `background` : empilement de calques — 4 `radial-gradient` sombres aux coins (effet "brûlé"),
  4 `radial-gradient` de tache plus douces à divers endroits (mottling), un
  `repeating-linear-gradient` fin à 96° en overlay très discret (grain/fibres du papier), et un
  `linear-gradient` de fond en tons parchemin (crème → tan → doré, `#ecd9ac` à `#cfab74`).
- `box-shadow: inset ...` (deux couches, sombre) pour assombrir légèrement le pourtour intérieur
  en plus du `clip-path`, renforçant l'effet de vieux papier.
- `filter: drop-shadow(...)` conservé pour l'ombre portée du panneau sur le fond de la page.

Vérifié en navigateur (viewport 520px, Mage) : bords déchirés visibles en haut/bas, coins
assombris, aucun étirement ni artefact de détourage, texte parfaitement lisible. Aucune erreur
console.

**Leçon retenue** : ne pas remplacer un rendu CSS validé par une image réelle sans valider le
rendu final (proportions, qualité de détourage) avant de considérer l'étape terminée — demander si
un doute existe plutôt que de committer directement.

Séparément (même passage) : **`#zone-specs` sorti du grid 2 colonnes** — dans
`creation-personnage.ts`, la div `#zone-specs` (aperçu des spécialisations) est maintenant un
**sibling** de `.parchemin-corps` (qui ne contient plus que radar + classes), avec sa propre
classe `.zone-specs-pleine-largeur` — occupe donc toute la largeur du parchemin au lieu d'être
coincée dans une des deux colonnes. Et **grille de spécialisations en 2×2** ("comme le logo
Windows") : `.grille-specs` passée de `grid-template-columns: repeat(auto-fill, minmax(240px,1fr))`
à `grid-template-columns: repeat(2, 1fr)` (1 colonne sous 480px), cartes bien plus grandes et
lisibles. Et **icône par spécialisation** : nouveau fichier
`client/src/components/icones-specialisations.ts`, 37 icônes SVG (trait, dessinées à la main
comme celles des classes), une par spécialisation, clé = nom (`Record<string,string>`) sauf
collision "Traqueur" (existe chez Berserker ET Chasseur sylvestre) résolue par clé composite
`classeId:nom`. Fonction exportée `iconeSpecialisation(classeId, nom)`. Intégrée dans `carteHtml`
de `creation-personnage.ts` via un wrapper `.entete-carte-spec` (icône + nom sur la même ligne,
au-dessus de la description). Couleur d'icône sur fond parchemin : `.etiquette-parchemin
.icone-spec { color: #7a2f14; }`.

Vérifié en navigateur (viewport 520px, race Mage → classe Mage) : grille 2×2 avec icônes
(vent/montagne/goutte/flamme pour l'École Élémentaire) bien rendue. Aucune erreur console.
`npx tsc --noEmit` propre.

**Pas encore fait** : nettoyage des variables CSS `--mat-basalte-*`/`--mat-bois-*` (héritées de
la tentative CSS abandonnée, toujours inutilisées).

**Historique (abandonné, ne pas reprendre) :** l'utilisateur avait d'abord demandé une recréation
CSS pure des 4 matières (métal/bois/os/obsidienne gravés), avant de fournir les vraies images de
référence ci-dessus et de trancher pour les utiliser directement à la place. Le détail de cette
tentative CSS (remplacée, code retiré de `style.css`) reste décrit ci-dessous à titre indicatif
seulement :

L'utilisateur avait montré 4 images de référence qu'il voulait utiliser **directement comme
cadres réels** (PNG détourés, superposés aux portraits) si la recréation CSS n'était pas assez
fidèle. Ce sont des cadres très détaillés et ouvragés :
- **Elfe** : cercle ivoire/crème à motifs celtiques entrelacés (nœuds), avec du lierre vert et des
  feuilles enroulées autour.
- **Nain** : octogone en pierre grise sombre avec runes gravées, et une gemme sertie (rubis,
  saphir, émeraude...) à chaque sommet de l'octogone.
- **Mage** : anneau cristallin violet/noir facetté (façon obsidienne géologique, pas pixelisé),
  avec runes gravées lumineuses violettes et des petites chaînes métalliques reliant les segments.
- **Demi-Orc** : cercle formé d'os et d'ossements assemblés, avec plusieurs crânes d'animaux
  (cornes, crocs) intercalés, attachés par des lanières de cuir et quelques chaînes.

**Action demandée à l'utilisateur (en attente)** : déposer ces 4 fichiers dans
`docs/img/cadres/` sous les noms `elfe.png`, `nain.png`, `mage.png`, `demi-orc.png`. Une fois
reçus : détourer le fond (transparence) si besoin, optimiser en WebP comme pour les portraits
(voir `client/scripts/optimiser-images.mjs`), puis les superposer aux portraits dans l'étoile
(`client/src/pages/creation-personnage.ts` + `client/src/style.css`, classes `.cadre--*`) à la
place des tentatives de recréation CSS pure de l'itération 3 ci-dessous (qui restent en place en
attendant, mais seront probablement remplacées).

**Ne pas oublier de vérifier au prochain démarrage de session si ces fichiers sont arrivés** dans
`docs/img/cadres/` avant de continuer le travail CSS sur les matières.

### Itération 3 sur l'étoile — EN COURS, pas terminée (contexte proche de la limite)

Après l'itération 2 (voir plus bas), nouveau retour utilisateur avec 5 images de référence
(décrites ici en mots, images non stockées dans le repo — demander à l'utilisateur de les
refournir si besoin de les revoir précisément) :

**1. Bug de rotation — CORRIGÉ.** Passer d'Humain à Elfe (ou toute paire éloignée) faisait parfois
un détour d'un demi-tour complet au lieu du chemin le plus court. Cause : `--rotation-globale`
était recalculée comme une valeur absolue (`180 - angle`) à chaque clic, ce qui peut être numériquement
très loin de la valeur courante même si visuellement équivalent (mod 360). **Fix appliqué** :
`client/src/pages/creation-personnage.ts`, fonction `tournerRoueVers()` — calcule maintenant le
delta le plus court via `(((cible - rotationCourante) % 360) + 540) % 360 - 180` et accumule dans
une variable `rotationCourante` (pas mod 360), au lieu de sauter à une valeur absolue.

**2. Taille et espacement — CORRIGÉ.** Cadres 150px → 168px (~2x la taille d'origine 84px), rayon
des branches 165px → 210px (tiges de l'étoile allongées pour éloigner les portraits), conteneur
460px → 560px. Fichiers : `client/src/components/etoile-liens.ts` (constantes `RAYON_LIGNE`,
`CENTRE`, viewBox), `client/src/style.css` (`.conteneur-etoile`, `.point-race`, `.cadre-race-etoile`).

**3. Parchemin — CORRIGÉ.** Était trop étroit (max-width 520px) et sans style "papier brûlé".
Maintenant : max-width 900px, bords irréguliers via `clip-path: polygon(...)` (forme déchirée, pas
un rectangle net), taches de brûlé aux coins/bas via `radial-gradient` sombres superposées, contenu
réorganisé en 2 colonnes (`.parchemin-corps`, radar à gauche / classes à droite) pour mieux utiliser
la largeur plutôt qu'empiler tout en une colonne étroite.

**4. Cadres de matière — PARTIELLEMENT refait, PUIS remis en question par l'utilisateur (voir
itération 3 ci-dessous, dernière demande pas encore implémentée) :**

Dans l'itération 2, j'avais remplacé les couleurs unies par :
- Nain : passé de "métal" à un **octogone en pierre** grise tachetée (`clip-path` polygon octogonal,
  `.cadre--pierre`)
- Elfe : bois avec encoches sombres façon entailles (`repeating-conic-gradient` sur le bois)
- Demi-Orc : anneau à segments répétés façon "chapelet d'articulations osseuses"
  (`repeating-conic-gradient` par tranches de 30°)
- Mage : base vitreuse + fentes lumineuses violettes répétées (`repeating-conic-gradient` fines
  fentes + `radial-gradient` glossy)

**Nouveau retour (5 images de référence fournies, pas encore implémenté)** — l'utilisateur a
regardé le rendu et veut aller plus loin dans le détail visuel, avec des références précises :

- **Bois (Elfe)** : PAS un cadre de rondins bruns rustiques (image de référence 1 : cadre en bûches
  avec nœuds, façon rustique/log-cabin — **à ne pas suivre tel quel**, juste une indication du
  type d'objet). Voulu : **plus elfique**, **bois blanc pur** (bouleau clair, pas brun), avec
  **petites tiges et feuilles** décoratives sur le pourtour (image de référence 2 : cadre ouvragé
  ivoire/crème avec volutes sculptées — s'en inspirer pour le niveau de finesse/ouvragé, mais en
  version "tiges et feuilles elfiques" plutôt que volutes baroques).
- **Nain** : **pas besoin d'un carré/octogone strict**, la forme importe peu, mais matière =
  **pierre sombre, un peu basalte**, avec des **gravures naines en relief saillant** (embossées,
  pas juste une texture plate). Actuellement c'est une pierre grise claire tachetée sans relief
  gravé — à corriger : assombrir vers du basalte, ajouter un vrai relief de gravure (pas juste des
  taches).
- **Mage** : s'inspirer du bloc "obsidienne" de Minecraft (image de référence 3 : cube violet-noir
  cristallin/mordoré, texture minérale dense) **mais surtout pas pixelisé** — une version lisse/
  organique de ce même esprit visuel (violet-noir profond, minéral, pas de facettes dures en
  triangle façon "covering de voiture" comme avant). Ajouter des **runes gravées qui brillent**
  dedans (image de référence 4 : sceau/cercle magique noir avec runes et symboles blancs
  lumineux, glyphes variés autour d'un cercle — s'en inspirer pour le style des runes, pas copier
  le motif exact). Forme libre, ne pas forcément rester circulaire.
- **Demi-Orc** : le plus gros changement demandé. **Pas une simple couleur "os"** avec quelques
  mouchetures — l'utilisateur veut un **véritable amas de carcasses/os détaillé** : vrais os,
  crânes, dents, cornes visibles (image de référence 5 : empilement réaliste de crânes et
  ossements d'animaux, très détaillé, texture organique complexe). C'est la demande la plus
  ambitieuse en CSS pur — envisager plusieurs os/crânes stylisés distincts autour de l'anneau
  (silhouettes simplifiées mais reconnaissables comme des os/crânes, pas juste une teinte).
- **Consigne générale** : **varier les formes** des cadres entre les races (pas tous des cercles
  ou tous la même forme) — seul l'Humain (bronze) doit rester **lisse et rond**, garanti comme
  ancrage "normal" au milieu des formes plus organiques/travaillées des autres.

**Point mineur en suspens (pas grave, à vérifier plus tard)** : lors d'une vérification de layout
en cours d'itération, mesure DOM a montré le conteneur de l'étoile pas parfaitement centré à une
largeur de viewport donnée (`left: 20px` avec un espace différent à droite) — écart mineur,
pas encore diagnostiqué ni corrigé, à surveiller si visible à l'usage.

**Prochaine action immédiate** : reprendre l'implémentation CSS des 4 matières (bois blanc
elfique, basalte gravé nain, obsidienne lisse runique mage, amas d'os détaillé demi-orc) selon
la description ci-dessus, en gardant en tête que ce sont des approximations CSS (pas de vraies
textures/images sourcées) — être honnête avec l'utilisateur sur les limites de ce qui est
réalisable en CSS pur si le rendu n'est toujours pas satisfaisant après cette passe.

### Itération 2 sur l'étoile (retour utilisateur après premier essai)

Corrections apportées :
- **Recadrage Demi-Orc** : `object-position: 24% 18%` spécifique (le perso était décentré sur la
  gauche de l'image source, le recadrage par défaut `top`/centre tombait sur le vide). Réglage
  ad-hoc par `data-id` dans `style.css` (`.point-race[data-id="demi-orc"] img`).
- **Taille des portraits doublée** : cadres 84px → 150px, conteneur 340px → 460px, rayon des
  branches 140px → 165px (`etoile-liens.ts` + `style.css`).
- **Textures de matière remplacées** (étaient des couleurs unies en dégradé conique, jugé pas
  assez "relief") : métal (Nain) = anneau brossé + rainures concentriques ; bois (Elfe) = veinage
  par bandes obliques irrégulières ; os (Demi-Orc) = mouchetures/porosité (radial-gradients
  éparpillés) ; obsidienne (Mage) = facettes vitreuses anguleuses (conic-gradient à paliers durs)
  + lueur violette. **Seul le bronze (Humain) reste lisse**, comme demandé explicitement.
- **Nouvelle mécanique d'interaction** (remplace le "layout 2 colonnes qui apparaît en dessous") :
  au clic sur une race, **toute la roue tourne** pour amener la race choisie en bas (180°), où son
  cercle **grossit** (`transform: scale(1.55)`), puis une **étiquette parchemin** verticale se
  déroule en dessous (`.etiquette-parchemin`, fond crème/parchemin, texte sépia, animation
  `scaleY` depuis le haut). Contient : nom, lore, trait racial, radar (recoloré pour fond clair),
  classes disponibles avec icônes (recolorées pour fond clair).
  - Rotation synchronisée de la roue (SVG + points) via une **custom property CSS enregistrée**
    `@property --rotation-globale` (`syntax: "<angle>"`), portée par `.conteneur-etoile` et lue
    dans le `transform` de chaque `.point-race` ET de `.etoile-svg` — permet une transition fluide
    d'angle sans recalcul JS, et garde chaque portrait bien droit malgré la rotation d'ensemble
    (grâce à la contre-rotation déjà en place dans l'astuce CSS de positionnement circulaire).
  - Le portrait n'est plus dupliqué dans le panneau de détail (il est déjà visible en grand dans
    la roue) — l'étiquette parchemin ne contient que texte + radar + classes.
- Testé de bout en bout dans le navigateur après ces changements, aucune erreur console.

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

1. ✅ Palette + police + écran sélection race (étoile détaillée + effet 3D) — commité (`3a32627`)
2. ✅ Commit
3. ✅ Animations de transition par race — implémentées, décrites et validées par l'utilisateur
   avant codage (voir section dédiée ci-dessous) → **en attente du test utilisateur** avant de
   passer à l'étape 4
4. Layout page équipe (habillage visuel)
5. Animation des pièces (transition boutique)
6. Boutique (refonte complète : mannequin, filtres, liste)
7. Compagnons (héritera du style, peu de travail spécifique attendu)
8. Récapitulatif général (radar + images + layout fluide)

### ✅ Étape 3 — Animations de transition par race (implémentée, feu vert utilisateur reçu)

Méthode suivie : description textuelle détaillée de chaque animation envoyée à l'utilisateur
**avant** tout code ("afin que tu ne code pas pour rien"), validée explicitement ("ça me plait
bien je te donne le feu vert"), puis implémentation.

Remplace l'ancien placeholder (couleur unie + emoji + balayage CSS) dans
`client/src/components/transition-race.ts` + section correspondante de `style.css`. Toujours en
CSS/SVG pur, calque plein écran (`position: fixed`) créé/retiré par `jouerTransitionRace(raceId)`,
durée totale portée en CSS via une variable `--duree-totale` posée par JS (source unique, pas de
duplication de durée entre le `setTimeout` JS et l'`animation-duration` CSS).

- **Humain** (1100ms) : deux battants de porte (texture bois en bandes, `rotateY` avec
  `perspective` sur le conteneur, origine sur le bord extérieur), légère anticipation avant
  ouverture, `cubic-bezier` avec dépassement en fin de course. Lumière ambre en `radial-gradient`
  derrière, 3 particules de poussière montantes.
- **Elfe** (1300ms) : 22 feuilles (2 silhouettes SVG, 4 teintes vert/or/bouleau), montée du bas
  vers le haut (`ease-in-out`), dérive horizontale via un calque `.particule-vent` séparé,
  rotation continue via `.particule-rotation` (linear), délais aléatoires par feuille.
- **Nain** (1150ms) : 18 gemmes facettées (polygones, 5 teintes), chute du haut vers le bas en
  `cubic-bezier` accélérée (gravité), reste opaque jusqu'à sortir de l'écran (contrairement à la
  feuille qui s'estompe), scintillement (`drop-shadow` pulsé) à mi-parcours.
- **Demi-Orc** (1000ms) : 14 ossements (silhouette d'os + silhouette de crâne, teintes
  ivoire/rouge-brun), traversée d'un bord aléatoire de l'écran à un autre bord aléatoire différent
  (pas juste haut/bas), rotation heurtée via `steps(8, end)` (effet cliquetis), voile de poussière
  d'impact en surimpression pulsée. **Vérifié visuellement** (capture d'écran, animations figées à
  un instant donné via `Animation.currentTime`) : particules bien dispersées avec des
  positions/rotations variées, confirmant que l'interpolation CSS fonctionne correctement.
- **Mage** (1450ms, structure différente des 4 autres — pas de particules traversantes) :
  matérialisation rituelle en 3 temps. Un cercle (`stroke-dasharray`/`stroke-dashoffset` animés)
  se trace en 55% du temps total ; 10 runes originales (glyphes géométriques simples, pas
  d'alphabet runique existant copié) apparaissent en fondu à des positions réparties en cercle
  (technique `rotate(angle) translate(rayon) rotate(-angle)`, la même astuce que pour l'étoile de
  race) avec un délai croissant façon tracé horaire ; un voile violet et un flash final
  (`radial-gradient` pulsé) referment la séquence.

**Vérification technique effectuée** : `npx tsc --noEmit` propre, aucune erreur console sur les 5
races testées en navigateur (création de personnage réelle via le flux complet, à chaque fois
suivie d'une navigation correcte vers `/equipe`), comptages DOM corrects (18 `.particule--gemme`,
10 `.rune-mage`, 14 os).

**Règle de méthode donnée par l'utilisateur** : avancer étape par étape, ne pas tout faire d'un
coup, committer entre les étapes, tester avant de continuer sur la suivante.

### v0 jugée ratée — retravail en cours, race par race, avec questions ciblées

Après le feu vert initial, l'utilisateur a vu le rendu réel et l'a jugé "horrible"/"pas du tout"
satisfaisant — feu vert donné sur la **description**, pas sur le **rendu visuel** réel. Nouvelle
méthode adoptée pour la suite : (1) rallonger toutes les durées pour bien voir chaque animation
se jouer, (2) revoir les 5 transitions **une par une**, question ciblée à chaque fois (via
`AskUserQuestion`) plutôt que de deviner, (3) committer un "v0 fixup" une fois une race
retravaillée, avant de passer à la suivante.

**Durées rallongées (~×1.8, pour bien observer chaque animation)** : Humain 1100→2000ms, Elfe
1300→2350ms, Nain 1150→2050ms, Demi-Orc 1000→1800ms, Mage 1450→2600ms. Les durées/délais internes
des particules (feuilles, gemmes, os, runes) et les animations à durée fixe (poussière, brume,
apparition de rune) ont été rescalées dans les mêmes proportions pour garder un mouvement cohérent
plutôt que de simplement rallonger le temps mort en fin de séquence.

**Bug de fond corrigé sur toutes les transitions, découvert en creusant Humain** :
`jouerTransitionRace` attendait la fin complète du calque (fondu de sortie inclus) avant
d'appeler `naviguer(...)`, ce qui laissait apparaître un flash de l'ancienne page (celle de
création) juste avant la coupure vers la nouvelle — la transition perdait tout son sens.
**Fix** : `jouerTransitionRace(raceId, auMilieu?)` accepte maintenant un callback déclenché à 85%
de la durée totale (juste avant le début du fondu de sortie CSS), pendant que le calque est encore
opaque — le fondu révèle donc la nouvelle page plutôt que l'ancienne. `creation-personnage.ts`
passe `() => naviguer("/equipe")` comme callback au lieu d'appeler `naviguer` après le `await`.
Vérifié par mesure réelle (`hashchange` déclenché à ~1716ms sur une durée Humain de 2000ms, soit
85.8% — conforme).

#### Humain — 2 rounds de retouches, validé

**Round 1** (retour sur la v0 générique) :
1. Timing du battement de porte jugé bon, **conservé tel quel**.
2. Lumière ambrée derrière la porte **restait allumée bien trop longtemps** (plafonnait à opacité
   0.85 de 45% à 100% de la durée) → nouvelle courbe resserrée, calée sur le battement :
   monte jusqu'à 40%, redescend dès 70%, éteinte à 100% (`lumiere-taverne-anim`).
3. **Esthétique de la porte jugée hors-sujet** (pas assez dark fantasy) → première passe : refonte
   CSS pure (bandes de fer plus épaisses avec bouts en pointe façon losange via `clip-path`,
   rivets par `radial-gradient` répété, poignée en anneau à 2 couches, bois éclairci).

**Round 2** (après un sprite de référence fourni par l'utilisateur, jugé "de très mauvaise
qualité" mais utile comme direction) : bandes encore plus épaisses/sombres à bouts pointus, rivets
plus marqués, anneau creux à 2 couches, bois éclairci par rapport au sprite. **Toujours jugé pas
assez réaliste** (texture bois/métal CSS plafonne en crédibilité) → même conclusion que pour les
cadres de race : **abandon du CSS pur au profit d'une vraie illustration**.

**Round 3 — vraie image (résolu)** : l'utilisateur a généré une illustration via un prompt fourni
(voir ci-dessous) et l'a déposée dans `docs/img/transition/porte.png` — un seul panneau de porte
vu de face à plat (pas de perspective, pour laisser la rotation 3D au CSS), fond blanc uni, style
peint semi-réaliste. Traitement : nouveau script one-off `client/scripts/detourer-porte.mjs`
(sharp réinstallé puis désinstallé après usage, même seuillage alpha 222–250 que
`detourer-cadres.mjs`) → export `client/public/img/transition/porte.webp` (900×1342, vérifié
transparent aux coins, opaque au centre). Le même panneau est réutilisé **en miroir**
(`transform: scaleX(-1)` sur `.battant--droit .image-porte`) pour l'autre battant plutôt que de
générer 2 illustrations distinctes. CSS des battants simplifié (l'image porte déjà tous les
détails : planches, bandes, rivets, anneau) — anciennes règles `.sangle-fer`/`.poignee-anneau`
supprimées.

**Prompt d'image utilisé** (pour référence future si une autre race a besoin du même traitement) :
> Single medieval tavern door panel, weathered oak wood planks with visible wood grain, reinforced
> with two thick horizontal wrought-iron bands with round rivets, a circular iron ring handle
> mounted on a round backplate at the center, medium warm brown wood tone (not too dark, not
> black), semi-realistic painted dark fantasy game-art style, flat frontal orthographic view, no
> perspective, no angle, straight-on, soft even lighting with no strong directional shadow, plain
> solid white background, high detail texture, weathered and slightly worn, RPG game asset,
> portrait orientation --ar 2:3

**Retouche finale** : du noir apparaissait autour de l'image (marges `top/bottom:14px`,
`left/right:5px` de l'ancienne mise en page CSS) → marges retirées, `.battant` occupe maintenant
tout l'écran (`top:0;bottom:0;width:50%`), `object-fit: cover` évite toute déformation visible.

**Statut Humain : validé par l'utilisateur, commité** (`fc29fb2`).

#### Elfe — EN COURS (retouches faites, pas encore de retour utilisateur sur le rendu final)

Retour utilisateur : (1) les feuilles SVG dessinées à la main manquent de réalisme — demande de
prompts d'image pour en générer de vraies (comme la porte), (2) pas assez dense — le but de
l'effet est d'inonder l'écran pour masquer la coupure de page à un moment, (3) **bug** : les
feuilles semblaient apparaître depuis le milieu de l'écran plutôt que de partir du bas.

Corrections appliquées :
- **Bug d'ancrage corrigé** : `.particule` utilisait `top:50%` comme point d'ancrage pour tous les
  types, avec un décalage de départ trop faible (`translateY(15vh)`) pour sortir réellement de
  l'écran sur un viewport haut. Chaque type a maintenant son propre ancrage réel
  (`.particule--feuille{top:100%}` = bord bas, `.particule--gemme{top:0%}` = bord haut) et un
  parcours bien plus long (`translateY(±160vh)` au lieu de `130vh`), garantissant un vrai départ
  hors-écran. Corrige potentiellement le même souci pour le Nain (pas encore confirmé par
  l'utilisateur, à vérifier à son tour).
- **Densité fortement augmentée** : 22 → 130 feuilles. Taille passée de px fixe à **vw** (nouveau
  paramètre `tailleUnite` sur `champDeParticules`, 3.2–6.8vw) pour que la couverture visuelle reste
  proportionnelle à la largeur d'écran réelle plutôt que de s'éclaircir sur un grand écran avec une
  taille en px fixe. Non encore vérifié visuellement de façon fiable sur un large viewport (outil
  de capture d'écran instable à 900px+ de large durant cette session — cf. limite déjà notée pour
  Demi-Orc/Mage plus haut) ; fonctionnellement vérifié en DOM (130 éléments présents, positions
  réparties `-4vw` à `100vw`) et visuellement correct sur un viewport mobile étroit (375px).

**Statut Elfe : validé par l'utilisateur ("ça me suffit"), commité** (`85c5524`). Les feuilles
restent en SVG dessinées à la main pour l'instant (prompts d'image fournis mais pas encore
générés par l'utilisateur pour cette race — contrairement au Nain, voir ci-dessous) :
1. Feuille de chêne dorée/orangée (5 lobes)
2. Feuille de bouleau pâle vert sauge (ovale dentelée)
3. Feuille de lierre elfique vert forêt à bord doré (allongée pointue)

Si ces images arrivent plus tard : même traitement que `detourer-porte.mjs`/`detourer-gemmes.mjs`
(seuillage alpha blanc→transparent), export WebP, remplacement des SVG dans `FEUILLES`/
`COULEURS_FEUILLE` (`transition-race.ts`) par un tableau d'images (voir Nain ci-dessous pour un
exemple concret de ce remplacement déjà fait).

#### Nain — retravaillé, vraies illustrations intégrées

Retour utilisateur : (1) les gemmes SVG (losanges plats) ne sont pas réalistes — demande de
prompts pour de vraies illustrations, façon "cristaux sortant d'une pierre noire", (2) pas assez
grosses/nombreuses (même retour que l'Elfe), (3) confirmation que le sens de chute (haut→bas) est
correct — aucun bug d'ancrage constaté ici (contrairement à l'Elfe).

- **Densité** : 18 → 110 gemmes, taille en `vw` (3.4–6.8vw, même logique que l'Elfe) au lieu de px
  fixe. Vérifié visuellement (bonne couverture progressive, aucune erreur console).
- **Vraies illustrations reçues et intégrées** : l'utilisateur a déposé 5 images dans
  `docs/img/transition/` — `ruby.png`, `saphire.png`, `emeraude.png`, `ambre.png`, `kayou.png`
  (pierre brute sans cristal, pour varier). Chacune : un amas de cristaux (ou une simple pierre
  pour `kayou`) sur un bloc de roche noire, vue de face.
  `transition-race.ts` : `COULEURS_GEMME`/`gemmeSvg()` supprimés, remplacés par un tableau
  `GEMMES_IMG` de 5 chemins, l'icône de chaque particule devient un `<img>` plutôt qu'un SVG coloré
  par `currentColor`. CSS (`.particule-rotation svg` → `.particule-rotation svg, .particule-rotation
  img`, idem pour `.particule--gemme ... svg` → `+ img`) pour que l'ombre portée et le scintillement
  s'appliquent aussi aux images.
- **Détourage : premier essai automatique raté, corrigé par un détourage manuel de
  l'utilisateur.** Premier traitement via un script one-off à seuillage alpha (même technique que
  `detourer-cadres.mjs`/`detourer-porte.mjs`) : fonctionnait sur le papier (alpha=0 vérifié aux
  coins) mais laissait un résidu visible à l'usage — un halo carré flou autour de chaque gemme,
  surtout perceptible pendant le flash de scintillement (`drop-shadow` élargissant le moindre pixel
  semi-transparent résiduel en un carré net). L'utilisateur a **détouré les 5 images lui-même** et
  les a redéposées aux mêmes chemins — alpha réel et propre vérifié (0 aux 4 coins, 255 au centre,
  sur les 8 images gemmes+feuilles). Le script one-off à seuillage (`detourer-gemmes.mjs`) est
  **supprimé**, remplacé par `client/scripts/convertir-gemmes.mjs` : simple redimensionnement +
  export WebP, aucun traitement de transparence puisque les sources sont déjà propres. Revérifié
  en navigateur après ce correctif : halos nets, plus aucun artefact carré.
- **Scintillement adouci en passant** (indépendamment du bug de détourage) : le flash blanc à
  mi-chute (`drop-shadow`) réduit de 10px/0.9 opacité à 6px/0.65, plus discret et cohérent avec des
  illustrations déjà détaillées (contrairement à l'ancien losange plat qui avait besoin d'un flash
  marqué pour suggérer un reflet).

**Statut Nain : validé, prêt à committer.**

#### Elfe — vraies illustrations intégrées (complète le round précédent)

Après le premier commit Elfe (`85c5524`, feuilles encore en SVG), l'utilisateur a généré et fourni
3 images de feuilles dans `docs/img/transition/` : `feuille_orange.png` (chêne doré/orangé),
`feuille_verte.png` (bouleau pâle vert sauge), `feuille_elfique.png` (lierre elfique vert forêt à
bord doré — celle-ci en particulier très réussie, avec vrilles). Même traitement que les gemmes :
détourage manuel par l'utilisateur (pas de script de seuillage), conversion simple via nouveau
`client/scripts/convertir-feuilles.mjs` → `client/public/img/transition/feuilles/
{orange,verte,elfique}.webp`. `transition-race.ts` : `FEUILLES`/`COULEURS_FEUILLE` (SVG + couleurs)
supprimés, remplacés par `FEUILLES_IMG` (3 chemins), même changement `<svg>` → `<img>` que pour les
gemmes. Vérifié en navigateur (viewport mobile 375px, 130 feuilles chargées) : rendu net, aucune
erreur console.

**Statut Elfe (round 2, vraies images) : validé, prêt à committer** — vient compléter le commit
`85c5524` (qui portait sur le bug d'ancrage + la densité, feuilles encore en SVG à ce moment-là).

**Leçon retenue pour la suite (Demi-Orc, Mage)** : le seuillage alpha automatique (blanc→
transparent) qui fonctionnait bien pour la porte et les cadres de race peut laisser un résidu
invisible en inspection mais perceptible à l'usage (halos, glows) selon la qualité du fond de
l'image source. Si un futur asset montre un artefact similaire, proposer à l'utilisateur de
détourer lui-même plutôt que d'insister sur l'ajustement des seuils.

#### Demi-Orc — refonte complète du concept (pas juste un ajustement)

Retour utilisateur, beaucoup plus radical que pour les 3 races précédentes : "on comprend rien à ce
qui se passe" — l'ancienne version (os traversant l'écran d'un bord aléatoire à un autre) ne se
lisait pas du tout comme le concept voulu ("c'est censé être l'explosion d'un tas d'ossements"),
et était beaucoup trop lente. Nouveau concept détaillé par l'utilisateur : **une pile d'ossements
tombe et apparaît au milieu-bas de l'écran, puis explose** en projetant crânes/os/tibias/mains/
cage thoracique dans tout l'écran (ce qui masque la vue et permet la coupure), **le fond
s'assombrit au fur et à mesure** que les ossements apparaissent. "Tout est à changer."

**Refonte complète de `construireDemiOrc`** (`transition-race.ts` + `style.css`) :
- L'ancienne mécanique `pointHorsEcran`/`champOs` (traversée d'un bord aléatoire à un autre bord
  aléatoire) est **supprimée**, remplacée par `pointAleatoireEcran`/`explosionOs(nombre, origineX,
  origineY)` : tous les ossements partent d'un **point fixe** (centre-bas, là où la pile atterrit)
  vers des destinations aléatoires réparties sur **tout l'écran**. Nombre d'ossements : 14 →
  **100**. Taille en `vw` (couverture proportionnelle à l'écran, même logique que les autres races).
- **Nouvel élément `.pile-os`** : tombe du haut de l'écran et atterrit au centre-bas avec un petit
  effet d'écrasement à l'impact, puis se fond rapidement (comme si elle "éclatait") pile au moment
  où l'explosion prend le relais.
- **Nouvel élément `.noircissement-os`** : voile radial noir centré sur le point d'origine,
  assombrit progressivement l'écran en même temps que l'explosion se déploie, pour masquer la
  coupure. Remplace l'ancien `.brume-impact` (halo de poussière brun, jugé insuffisant), supprimé.

**Bug d'easing découvert et corrigé pendant la vérification** : `.pile-os` utilisait un
`animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.35)` appliqué sur l'ensemble de
l'animation (chute + rebond + fondu) — un bezier custom déforme la correspondance entre les
pourcentages de keyframes et le temps réel écoulé (constaté : à 55% du temps réel, la pile était
encore quasiment à sa position de départ au lieu d'être proche de l'atterrissage à 70%). Remplacé
par `cubic-bezier(0.5, 0, 1, 1)` (accélération de type gravité, monotone) — les pourcentages de
keyframes correspondent alors bien au temps réel. **Leçon générale** : éviter un bezier custom
complexe comme `animation-timing-function` global quand l'animation a plusieurs keyframes à des
pourcentages précis à respecter ; préférer un easing standard/simple et réserver les beziers
personnalisés aux animations à 2 seules étapes (0%→100%).

**Vraies illustrations reçues et intégrées.** L'utilisateur a réorganisé tous les assets de
transition en sous-dossiers (`docs/img/transition/elf/`, `kayou/`, `os/` — seul `porte.png` reste
à la racine) et fourni 6 images déjà détourées à la main dans `docs/img/transition/os/` :
`crâne.png`, `fémure.png`, `main.png`, `tibia.png`, `torax.png`, `tas_os.png` (l'amas complet pour
l'élément qui tombe — composition très réussie : crâne posé sur un enchevêtrement dense d'os,
inspirée de la référence stock montrée plus tôt mais dans notre propre style peint). Alpha vérifié
propre (0 aux coins, 255 au centre) pour les 6.

- Nouveau script `client/scripts/convertir-os.mjs` (sharp temporaire, aucun seuillage — sources
  déjà transparentes) → `client/public/img/transition/os/{crane,femur,main,tibia,torax,tas}.webp`
  (noms de destination volontairement en ASCII, pas d'accents, pour éviter tout souci d'URL).
  `convertir-gemmes.mjs`/`convertir-feuilles.mjs` mis à jour pour lire depuis les nouveaux
  sous-dossiers `kayou/`/`elf/` plutôt que la racine.
- `transition-race.ts` : `OS[]` (SVG) supprimé, remplacé par `OS_IMG` (5 chemins, pour les
  projectiles) et `TAS_OS_IMG` (1 chemin, pour la pile). `.pile-os` passe de 3 SVG superposés à un
  simple `<img>` unique.

**Trois rounds d'ajustement timing/mise en scène après retour utilisateur** :
1. *"les os vont trop vite, l'animation dure trop longtemps, autant d'os sur moins de temps et qui
   se déplacent moins vite"* → durée totale 2400 → **1900ms** ; easing des os
   `cubic-bezier(0.15,0.7,0.3,1)` (lancement très franc) → `ease-out` standard (plus posé) ; délai
   de lancement resserré (0–0.85s → 0–0.5s).
2. *"mieux mais encore trop rapide, diviser leur vitesse par 2 ; le tas doit être posé sur le bas
   de l'écran, plus gros que les os individuels puisqu'il en représente tout un tas ; les os
   doivent sortir du tas seulement après l'impact (il tombe, paf, puis ça explose)"* →
   - Vitesse des os divisée par 2 : durée individuelle 0.85–1.3s → **1.7–2.6s**.
   - **Séquencement corrigé** : le délai de lancement des os partait de 0s (donc certains
     explosaient avant même que la pile ait atterri à ~452ms). Recalé à **0.45–0.95s**, aligné sur
     l'atterrissage réel de la pile — l'explosion ne démarre visuellement qu'après l'impact.
   - `.pile-os` : `bottom: 8%` (flottante) → **`bottom: 0`** (posée directement sur le bas de
     l'écran) ; taille 15vw/max 130px → **24vw/max 210px**. Point d'origine de l'explosion
     (`origineY`) réaligné de 84 à **96** (vh) pour correspondre à la nouvelle position au ras du
     bas.
3. *"tu peux la faire 1,4 fois plus grande encore"* → `.pile-os` 24vw/210px → **33.6vw/294px**
   (largeur rendue vérifiée : 126px avant/après comparaison ≈ ×1.47, conforme).

**Vérifié en navigateur après chaque round** (animations figées via `Animation.currentTime`,
mesures `getBoundingClientRect` pour confirmer les positions/tailles réelles plutôt que de se fier
au ressenti) : pile posée exactement sur le bord bas à l'atterrissage (bottom mesuré à 811.7px sur
812px de fenêtre), aucun os explosé avant ~450ms, écran presque entièrement noir vers 85% de la
durée. Aucune erreur console à chaque étape.

**Statut Demi-Orc : validé par l'utilisateur, commité** (`7f0d20e`).

#### Mage — refonte complète de la chorégraphie + vraie illustration

**Round 1 — nouvelle chorégraphie du cercle** (remplace l'ancien "tracé au stroke-dasharray puis
apparition en cercle des runes"), décrite en détail par l'utilisateur : le cercle apparaît minuscule
avec un effet de rebond (dépasse sa taille finale puis redescend), tourne un peu dans un sens
(charge), puis se relâche d'un coup façon ressort — rotation rapide en sens inverse en rétrécissant,
expulsant des runes dans tous les sens jusqu'à disparaître.

- `.cercle-mage-scale`/`.cercle-mage-rotate` : deux calques imbriqués (comme `.particule-vent`/
  `.particule-rotation` ailleurs) pour séparer l'échelle (rebond puis rétrécissement) de la
  rotation (charge lente puis relâchement rapide en sens inverse) — un seul `transform` ne peut
  pas porter deux timelines indépendantes sur le même élément.
- **Rebond/ressort portés par `animation-timing-function` posé DANS chaque étape de keyframe**
  (pas globalement sur l'animation) : `cubic-bezier(0.34, 1.56, 0.64, 1)` (courbe "back-out"
  standard, dépasse naturellement 1 avant de se stabiliser) pour l'apparition ; easing différent
  pour la charge (`ease-in`) puis le relâchement (`cubic-bezier(0.7,0,0.85,0.3)`, accélération
  franche). **Applique directement la leçon retenue sur la pile d'ossements** (un bezier global sur
  toute l'animation déforme la correspondance keyframe↔temps réel) — ici chaque segment garde son
  propre easing local, pas de bug de timing constaté.
- Nouvelle fonction `explosionRunes()` : réutilise le même principe que l'explosion de la pile
  (`explosion-radiale`, renommée depuis `explosion-os` pour usage partagé) — les runes ne
  s'éjectent qu'au moment du relâchement (~58% de la durée), pas dès le début.
- `RUNES`/`COULEURS_RUNE` : SVG placeholder existants réutilisés pour les runes éjectées (l'image
  reçue de l'utilisateur, voir round 2, sert uniquement pour le cercle central lui-même — "je te
  laisse gérer pour les runes").

**Round 2 — vraie illustration du cercle.** L'utilisateur a généré et fourni
`docs/img/transition/cercle magique.png` : un sceau alchimique très ouvragé (anneaux de runes,
étoiles imbriquées, symboles), dégradé magenta → violet → bleu → cyan, déjà détouré (fond
transparent, vérifié : alpha=0 aux coins). Nouveau script `client/scripts/convertir-cercle.mjs`
(conversion simple, pas de seuillage) → `client/public/img/transition/cercle.webp`. Remplace le
`<svg><circle></svg>` plat par un `<img>` dans `.cercle-mage-rotate` ; CSS `.cercle-mage circle`
(devenu inutile) supprimé.

**Round 3 — 3 retours après premier essai avec l'image réelle** :
1. *"ça grossit trop vite, il faut qu'on le voit grossir ; il ne grossit pas assez, il faut qu'il
   touche les limites de l'écran (hauteur), puis qu'il rétrécisse"* → phase de croissance
   0→22% → **0→40%** de la durée (nettement plus lente à l'œil) ; conteneur `.cercle-mage-scale`
   56vh → **92vh** (touche quasiment les bords en hauteur une fois à taille pleine). Phases de
   charge/relâchement décalées en conséquence (40→58%→92%).
2. *"les runes doivent sortir de l'extrémité du cercle"* — `explosionRunes()` prenait un point de
   départ fixe au centre (50vw/50vh) pour toutes les runes ; **corrigé** : chaque rune calcule un
   angle aléatoire, part d'un point sur le bord de l'anneau (`rayonDepart`, ≈ moitié du conteneur)
   à cet angle, et poursuit dans le prolongement du même rayon vers sa destination — lit comme une
   éjection radiale depuis le bord, pas un tir depuis le centre.
3. *"les runes doivent être dans la gamme de couleur (le dégradé) de l'image"* — couleur fixe
   `#d8c4f5` remplacée par `COULEURS_RUNE` (5 teintes échantillonnées sur le dégradé réel de
   l'illustration : magenta/violet/bleu-violet/bleu/cyan), une par rune au hasard. Le halo
   (`filter: drop-shadow`) utilise maintenant `currentColor` au lieu d'une couleur fixe, pour
   suivre automatiquement la teinte de chaque instance.
4. *"je veux plus de runes, beaucoup plus"* — 20 → **90** runes éjectées.

**Vérifié en navigateur après chaque round** (animations figées via `Animation.currentTime`,
comptage DOM) : cercle bien visible en pleine croissance à 900ms (~35% de 2600ms), 90 particules
`.particule--rune` confirmées dans le DOM, glyphes colorés visibles au bord de l'anneau pendant la
phase d'éjection (~1900ms) avec des teintes variées cohérentes avec le dégradé. Aucune erreur
console à chaque étape.

**Statut Mage : validé par l'utilisateur ("parfait").**

## Les 5 transitions sont maintenant toutes retravaillées et validées

Humain (`bb04a04`), Elfe (`85c5524` + `3bf2e1b`), Nain (`3bf2e1b`), Demi-Orc (`7f0d20e`), Mage
(`b03ceeb`).

## Étape 3 — Layout de la page équipe (en cours)

Après les 5 transitions, retour à l'étape 3 de l'ordre de travail initial. L'utilisateur a demandé
de se souvenir du croquis papier donné en tout début de session (photo, prise **tournée 90° — à
lire en la faisant pivoter dans le sens anti-horaire**). Une fois correctement orienté : un bloc
"Inventaire" (grille/tableau) sur la **droite** de la page (pas en haut comme la photo brute le
suggérait avant rotation), les personnages ("Perso 1", "Perso 2"...) en capsules avec "+", et un
bloc "Compagnon" en dessous.

### Portée de l'Inventaire — clarifiée avant de coder

Le bloc Inventaire n'est pas qu'une intention visuelle : l'utilisateur confirme qu'il faut un
vrai endroit pour voir les objets achetés en boutique qui ne s'équipent pas directement (potions,
etc.) — actuellement **aucun moyen de les stocker n'existe en base**
(`InventairePersonnage.emplacement` est obligatoire et unique par personnage, aucun concept de
"sac"). Décision (question posée, réponse utilisateur) : **placeholder visuel pour cette passe**,
pas de nouveau schéma/route maintenant — mais avec une vraie règle de capacité dès maintenant :
- **4 emplacements de base par personnage** (donné explicitement par l'utilisateur).
- **+ la capacité de transport de base du compagnon** (avant tout craft — les sacoches/harnais de
  l'Ingénieur n'existent pas encore). Dérivée du texte libre `capaciteTransport` du seed
  (`CAPACITE_BASE_COMPAGNON` dans `equipe.ts`) : mule=2, élan=4, sanglier dressé=1, chiens/fée/
  gnome=0 (les chiens nécessitent un harnais crafté ; le Gnome a une capacité illimitée mais
  réservée aux objets alchimiques — nuance pas modélisée ici, comptée 0 pour l'instant).
- Chaque case affichée = un petit rond bordé blanc, barré de rouge façon pictogramme "vide"
  (`.case-inventaire--vide`) ; toutes vides pour l'instant puisqu'aucune donnée réelle n'existe
  encore derrière. Le NOMBRE de cases, lui, est bien réel (recalculé à chaque render selon la
  taille d'équipe + compagnon présent).

### Bug transversal corrigé en premier : `#app` limitait TOUTES les pages à 1000px

Avant même de retravailler la page équipe, retour utilisateur : *"tu te limites trop, on est en
plein écran pas en résolution réduite"*. Cause : `#app { max-width: 1000px; }` dans `style.css`
bridait la largeur de **toute l'application**, quelle que soit la résolution réelle de l'écran —
pas spécifique à la page équipe. **Corrigé pour toutes les pages** : `max-width: 1800px` (large
mais pas infini, pour éviter un étirement absurde sur très grand écran), padding latéral ajusté.
Règle retenue pour la suite : *plein écran par défaut sur toutes les pages*, une page qui a besoin
d'une colonne de lecture étroite (formulaire, parchemin) pose son propre `max-width` localement
plutôt que de brider `#app` globalement.

### Round 1 — 3 colonnes, bannières, inventaire (implémenté, puis corrigé 2 fois sur retour)

Nouvelle structure (`equipe.ts` réécrit, `.mise-en-page-equipe` en CSS grid 3 colonnes égales au
départ, empilées sous 860px) : **Inventaire | Personnages | Compagnon**. Personnages en bannières
larges (pas les capsules hautes d'un essai précédent abandonné) : portrait + fondu vers une couleur
de classe (`COULEUR_CLASSE`, une teinte par classe — guerrier=rouge sang, voleur=violet ombre,
barde=or, berserker=orange-rouge, ingénieur=cuivre, chasseur sylvestre=vert forêt, mage
élémentaire=orange élémentaire, mage noir=violet vide, mage blanc=or pâle) + nom/race/classe.
Compagnon : photo pleine carte si rempli, petit carré "+" centré (pas pleine taille) si vide.

Bordures des bannières : **interim CSS par matière de race** (`--mat-*` déjà existants, réutilisés
depuis l'étoile de sélection) — décision explicite de ne pas essayer de redécouper les cadres
*circulaires* existants en bordures rectangulaires (aurait donné un résultat raté), avec proposition
de prompt de secours si l'utilisateur voulait de vraies images.

**Vérifié en navigateur** : 3 colonnes fonctionnelles, 4 couleurs de classe distinctes affichées,
compagnon rempli/vide corrects, capacité d'inventaire calculée juste (16 = 4×3 personnages + 4
Élan), aucune erreur console.

### Round 2 — l'utilisateur avait déjà généré de vraies images de cadre, à utiliser directement

L'utilisateur signale l'existence de `docs/img/cadre/personnage/` (5 cadres **circulaires**,
détourés à la main, remplaçant l'étoile — **incluant un nouveau cadre Humain réel**, la race qui
utilisait jusque-là un anneau bronze généré en CSS) et `docs/img/cadre/equipe/` (5 cadres
**bannière**, format large ~4:1, un par race, pensés spécifiquement pour les cartes personnage de
la page équipe).

- Nouveau script `client/scripts/convertir-cadres-v2.mjs` (sharp temporaire, pas de seuillage —
  sources déjà transparentes) → `client/public/img/cadres/{humain,nain,elfe,demi-orc,mage}.webp`
  (cadres circulaires) et `client/public/img/cadres/equipe/{même 5 races}.webp` (cadres bannière).
- `creation-personnage.ts` : `RACES_AVEC_IMAGE_CADRE` (qui excluait l'Humain) **supprimé** — les 5
  races utilisent maintenant uniformément le chemin "vraie image de cadre", plus de branche
  spéciale CSS. `.cadre--bronze` (conic-gradient CSS, 2 règles) supprimé de `style.css`, devenu
  mort.
- `equipe.ts`/`style.css` : `.cadre-matiere--*` (interim CSS du round 1) **supprimé**, remplacé par
  un vrai `<img class="cadre-banniere">` superposé (z-index au-dessus du portrait/dégradé/texte),
  une image par race, chemin `/img/cadres/equipe/{raceId}.webp`.

**Bug de débordement découvert à ce round** : le contenu (portrait + étiquette) était inset d'une
valeur fixe estimée (9%/6%) au lieu de la vraie épaisseur de bordure du cadre — mesurée après coup
au pixel près par script one-off (alpha channel, détection de la transition opaque→transparent sur
les lignes/colonnes médianes) : l'inset vertical réel varie de **13% (Mage, cadre fin) à 30%
(Demi-Orc, cadre épais)** selon la race, très différent de l'estimation initiale. Table
`INSET_CADRE_EQUIPE` (par race, mesurée) ajoutée dans `equipe.ts`, posée en variables CSS
`--inset-v`/`--inset-h` inline par carte.

### Round 3 — débordement persistant + repositionnement (retours successifs)

Malgré la mesure précise, un **second bug de débordement** est apparu : `.portrait-slot` utilisait
`top` + `bottom` avec `height: auto` sur une balise `<img>` — pour un élément remplacé
(intrinsic ratio), CSS calcule la hauteur à partir du ratio intrinsèque de l'image et de la largeur
utilisée, **pas** en étirant pour satisfaire à la fois `top` et `bottom` (piège classique). Résultat :
la hauteur réelle dépassait souvent l'espace disponible, `bottom` étant silencieusement ignoré.
**Corrigé** : `height: calc(100% - 2 * var(--inset-v))` explicite au lieu de `height: auto`.

Retours suivants de l'utilisateur, tous appliqués :
- *"réduis le rectangle par rapport à l'image, fois 0.9"* — marge de sécurité supplémentaire :
  toutes les valeurs `INSET_CADRE_EQUIPE` recalculées pour correspondre à 90% de la fenêtre
  mesurée (pas 100%), sur les 5 races.
- *"il faut que tu smooth les bords, c'est censé être des rectangles à coins ronds"* —
  `border-radius` des bannières (et de l'emplacement vide assorti) passé de 4px (quasi invisible)
  à **18px**, correctement clippé par `overflow: hidden` déjà présent sur `.carte-slot-perso`.
- *"pour la photo on avait dit à gauche dans le cadre et l'écriture à droite... tu peux grossir
  l'image fois 1.5"* — **inversion** de la disposition round 1/2 (portrait avait été mis à droite,
  texte à gauche) : portrait maintenant à **gauche** (largeur 56%→66%), fondu et étiquette à
  **droite** (`linear-gradient` inversé à 270deg, `etiquette-slot--banniere` alignée à droite,
  texte `text-align:right`).

**Vérifié en navigateur après ce round** (mesures `getBoundingClientRect`, pas seulement visuel) :
aucun débordement sur les 4 races testées (portrait, étiquette), aucune erreur console.

**Statut : en attente de confirmation utilisateur sur ce round avant commit** (rien committé sur
la page équipe depuis le début de cette étape — un seul commit à prévoir une fois validé, pas un
par micro-retouche, vu le nombre d'allers-retours).

### Note pour plus tard (pas maintenant) — conversion des transitions en GIF

L'utilisateur a signalé une baisse de FPS perceptible en début de chaque transition (calcul de
nombreuses particules DOM + animations CSS simultanées, son PC "rame un peu"). Idée retenue pour
**après** que les 5 transitions soient finalisées et validées : convertir chaque transition en
fichier GIF (ou vidéo courte) plutôt que de la recalculer en CSS/DOM à chaque lecture — réduirait
drastiquement la charge de calcul au prix de perdre la génération procédurale (positions
aléatoires à chaque lecture). **Ne pas commencer ce chantier avant d'avoir fini et validé les 5
transitions** (Mage restant, puis retouches finales) — c'est une optimisation de la toute fin.
Reste non fait à la clôture du Sprint 1 (voir section de clôture ci-dessous) — backlog Sprint 2+.

---

## ✅ CLÔTURE SPRINT 1 — étapes 3 à 8 de l'ordre de travail, toutes terminées

Tout ce qui restait planifié plus haut ("Ordre de travail confirmé", étapes 4 à 8) a été fait dans
la suite de la session (après les 5 transitions par race, elles-mêmes validées et commitées). Résumé
haut niveau (le détail technique/CSS complet vit dans l'historique de commits et dans les fichiers
concernés, pas ici — ce doc n'est plus tenu ligne à ligne au-delà de ce point) :

- **Page équipe** (`equipe.ts`) : layout 3 colonnes (inventaire | personnages | compagnon), cartes
  personnage en bannière 2:1 avec cadre thématique par race + fondu vers la couleur de classe.
  Fiche détaillée par personnage en popup (`components/fiche-personnage.ts`) : portrait, radar de
  stats, renommage, suppression, navigation flèches gauche/droite entre personnages (cyclique).
  Suppression d'équipe possible depuis l'accueil (`accueil.ts`).
- **Boutique/équipement** (`equipement.ts`) : refonte complète demandée par l'utilisateur —
  mannequin illustré (`docs/img/boutique/`, image détourée + pièces d'équipement superposées une
  par emplacement, calées par scan du canal alpha) qui s'illumine (teinte dorée, léger zoom) au
  survol de l'objet correspondant en boutique, et se teinte en acier quand l'emplacement est déjà
  équipé. Liste boutique en pile verticale (rectangles pleine largeur), filtre par type, scroll
  interne à la boutique (le mannequin reste fixe à l'écran).
- **Fusion Bras gauche/droit → un seul emplacement `BRAS`** (décision utilisateur, écart documenté
  dans `CLAUDE.md`) : un brassard s'achète et s'équipe désormais pour les deux bras en un seul
  achat. Main droite/gauche restent volontairement séparées (arme vs bouclier/grimoire).
- **Page compagnon** (`compagnon.ts`) : grille fixe 5×2 (10 compagnons), radar de stats (PV/Force/
  Dex/Vitalité) réutilisant le composant radar généralisé (`components/radar-stats.ts`, accepte
  maintenant des axes et une échelle personnalisés, plus seulement les 8 stats de personnage sur
  0-20). Cartes toujours entièrement dépliées (un essai de dépliage au survol/clic a été fait puis
  explicitement abandonné par l'utilisateur — ne pas le réintroduire sans nouvelle demande).
- **Récapitulatif général** : le besoin a été absorbé par la page équipe (hub central) + la fiche
  personnage en popup — pas de page "récap" séparée construite, conformément à la question restée
  ouverte plus haut dans ce document (tranchée de fait par l'usage plutôt que par une décision
  explicite ; à re-questionner si l'utilisateur en reparle).

**Non fait, reporté** : conversion des transitions en GIF (note ci-dessus, optimisation Sprint 2+),
animation "pièces qui tombent" à l'entrée de la boutique (mentionnée à l'étape 4 de l'ordre de
travail initial, jamais implémentée — pas redemandée depuis, à clarifier si toujours voulue).

Sprint 1 déclaré terminé par l'utilisateur. Ce fichier devient un historique de référence pour les
décisions de style déjà tranchées (palette, polices, cadres, mannequin) plutôt qu'un plan actif —
consulter `Roadmap_Sprints.md` pour le suivi de sprint à jour.
