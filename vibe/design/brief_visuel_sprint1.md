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
