# Proposition — Arbre de compétences (par classe, modulé par race)

**Statut : brouillon v3, corrigé après tes réponses aux questions de la v2.** Rien n'est codé ni
tranché — **aucun code tant que tu ne l'as pas dit explicitement** (rappel que tu as toi-même
répété, bien noté). Cette v3 corrige : le plafond de progression (20 partout, pas "niveau 10"), le
rôle exact d'Intelligence/Sagesse (les deux influencent XP de maîtrise + XP de LV + probabilité
d'éveil, pas seulement Sagesse), le fait que le trait racial déjà écrit N'EST PAS un nœud de
l'Arbre LV (il vit du côté Maîtrise/Éveil, pas du côté stats), une proposition concrète pour la
branche Vitalité par race à partir de tes exemples, une formule (pas une suite figée) pour les
paliers de l'Arbre de Maîtrise, et un deuxième exemple complet travaillé (Voleur).

## 0. Vue d'ensemble — DEUX arbres, pas un seul

C'est le point que j'avais raté en v1. Il y a bien deux systèmes de progression distincts, avec
chacun sa propre monnaie :

| | **Arbre LV** | **Arbre de Maîtrise** |
|---|---|---|
| Monnaie dépensée | Points de compétence (1 par niveau de personnage) | XP propre à chaque attaque (système à établir) |
| Forme | Étoile à 8 branches, une par caractéristique de base | Une branche par spécialisation existante (Codex des Classes) |
| Ce qu'on y gagne | Stats brutes (plafonnées à 20) + nœuds thématiques par branche | Amélioration d'une attaque déjà débloquée par l'usage |
| Lien racial | La branche Vitalité EST le lien racial (contenu propre à chaque race) + quelques branches ont un bonus racial ponctuel (Perception chez l'Elfe sylvestre, Sagesse chez le Mage, intéligence ches le nain ingénieur et force chez le demi orc berserker) | Aucun lien racial direct — dépend de la classe/spécialisation choisie, pas de la race |

Les deux arbres avancent en parallèle et s'alimentent l'un l'autre par endroits (ex: la branche
Intelligence de l'Arbre LV accélère la progression de l'Arbre de Maîtrise), mais ce sont deux
compteurs différents, jamais la même monnaie.

---

## 1. Boucle de progression (variante retenue : C)

1. Un personnage gagne de l'XP de personnage (source : combat, Sprint 3 — hors périmètre ici).
2. Passage de niveau → **+1 point de compétence**. Correction : pas de "plafond de niveau 10" — le
   plafond est **20**, et il s'applique **à toutes les branches** (stats comme nœuds), pas
   seulement à une branche en particulier. Cohérent avec l'échelle 0-20 déjà utilisée partout
   ailleurs (radars de stats).
3. Chaque point de compétence se dépense sur l'**Arbre LV**, sur l'une de ces trois actions :
   - augmenter une caractéristique de base de +1 (**plafond universel : 20**, même règle pour
     toutes les races — pas de plafond différent par race comme je l'avais proposé en v1, tranché
     plus simple) ;
   - débloquer un **nouveau nœud** sur une des 8 branches ;
   - améliorer un **nœud déjà débloqué**.
4. **Séparément**, sans consommer de point de compétence : chaque attaque déjà débloquée (via
   l'Arbre de Maîtrise, voir section 3) progresse en étant **utilisée** — système d'XP dédié,
   propre à chaque attaque, encore à établir dans le détail (formule de gain par usage réussi,
   etc. — à concevoir avec le système de combat, Sprint 3).

---

## 2. Arbre LV — l'étoile à 8 branches

Forme retenue : un soleil/une étoile, une branche par caractéristique de base, dans l'esprit d'un
tableau de compétences façon Fallout mais organisé par stat plutôt que par thème libre. Chaque
branche a sa propre identité de gameplay — ce n'est pas juste "+1 dégât par nœud", chaque branche
raconte quelque chose de différent :

| Branche | Thème (tes mots, reformulés) | Exemples de nœuds (proposition à discuter) |
|---|---|---|
| **Force** | Dégâts et capacité de stockage | +dégâts physiques bruts ; +poids transportable (lien direct avec le budget/inventaire déjà existant) |
| **Dextérité** | Agilité, mouvements périlleux | **Crochetage** — exemple que tu as donné, gardé tel quel : débloqué à partir d'un seuil de Dextérité, 1 point de plus l'améliore pour ouvrir des coffres/portes scellées de niveau supérieur (le nœud a son propre "palier" interne, comme un perk Fallout à rangs). Autres pistes : acrobaties (franchir un obstacle), esquive avec repositionnement |
| **Vitalité** | **La branche racontant la race du personnage** (voir section dédiée ci-dessous) | Contenu propre à chaque race, pas un nœud générique |
| **Charisme** | Relations et négociation | Faciliter l'acceptation d'une proposition/requête, **peu importe l'alignement moral** du personnage (précision importante — pas un bonus réservé aux personnages "gentils") |
| **Intelligence** | Vitesse de progression + artisanat | **Avec Sagesse (ci-dessous) : accélère le gain d'XP, à la fois pour l'Arbre LV et l'Arbre de Maîtrise** ; débloque des recettes de craft pour l'Ingénieur |
| **Sagesse** | Éveil de capacités rares | **Avec Intelligence : booste la probabilité d'éveil** (palier 4 de l'Arbre de Maîtrise, section 3) — correction : la mécanique n'est pas différente pour les Mages, mais les **pourcentages/effets d'éveil eux-mêmes doivent être définis par race ET par classe/école** (ex: un Mage Noir ne doit pas s'optimiser comme un Mage Blanc — détail dans la section Maîtrise) |
| **Chance** | Loot et rencontres | Meilleur loot, influence les rencontres de mobs (rareté/fréquence) |
| **Perception** | Détection | Repérage d'ennemis ; **bonus chez l'Elfe sylvestre** (capacité spécifique encore à définir) |

**Nombre de nœuds par branche (tranché)** : **4 nœuds par branche pour l'instant** (phase bêta —
en théorie une branche pourrait aller jusqu'à 20 nœuds, un par niveau de la stat, mais ça demande
un volume de contenu hors de portée maintenant ; on grossira l'arbre plus tard si de bonnes idées
de nœuds supplémentaires émergent). Un nœud peut avoir son propre **palier interne** (comme
Crochetage ci-dessus : débloqué une fois, puis amélioré séparément) — chaque branche n'est donc pas
forcément "4 nœuds = 4 points dépensés maximum", certains nœuds peuvent absorber plusieurs points
à eux seuls.

### La branche Vitalité = le lien racial

C'est la réponse à ta demande d'origine ("il faut qu'en plus de chaque stat il faut un lien...
avec la race du personnage") — mais placée différemment de ma v1 (qui modulait le coût des 8
stats). Ici, une seule branche est **structurellement propre à chaque race** : son contenu change
entièrement selon la race du personnage, plutôt que d'appliquer un multiplicateur uniforme sur
toutes les branches.

**Correction importante suite à ta réponse** : le **trait racial déjà écrit** (Rage du sang,
Vision nocturne, etc.) **n'est PAS un nœud de cette branche, ni de l'Arbre LV du tout**. Ce sont
deux familles différentes : les nœuds de l'Arbre LV sont des compétences/stats à débloquer avec les
points de niveau, alors que les traits raciaux (comme les attaques signatures de classe) relèvent
du côté **Maîtrise/Éveil** — un trait racial pourrait très bien avoir sa propre progression par
l'usage un jour, au même titre qu'une attaque, mais ce n'est pas le sujet de cette section. La
branche Vitalité de l'Arbre LV propose donc du contenu **nouveau**, distinct du trait déjà écrit,
à partir de tes exemples :

| Race | Nœuds Vitalité proposés (à partir de tes exemples) |
|---|---|
| Elfe | **Double saut** (ton exemple) — mobilité verticale, utile en combat/exploration |
| Nain | **Creuser un trou/tranchée** (ton exemple) — se cacher ou s'abriter en combat, cohérent avec leur affinité minière déjà écrite |
| Demi-Orc | **Évolution des capacités physiques** (ton exemple, à préciser) — proposition concrète : bonus de Force/Vitalité qui s'accentue à mesure que la branche progresse, dans l'esprit de leur trait "Rage du sang" sans le dupliquer |
| Humain | Pas d'exemple donné — proposition : polyvalence, un nœud qui donne un petit bonus réparti plutôt qu'un pic (cohérent avec leur trait "Polyvalence") |
| Mage | Pas d'exemple donné — proposition : nœuds qui compensent leur fragilité physique (ex: réduire un malus plutôt que grossir un bonus) |

Humain et Mage restent des propositions de ma part (tu n'avais donné d'exemple que pour
Elfe/Nain/Demi-Orc) — à corriger si tu as une meilleure idée.

---

## 3. Arbre de Maîtrise — par attaque/spécialisation

**Différent de l'Arbre LV** (c'était mon erreur de v1 de les fusionner) : ici, pas de points de
compétence — chaque attaque progresse avec sa **propre monnaie d'XP**, gagnée en l'utilisant.
Intelligence ET Sagesse (Arbre LV) accélèrent ce gain d'XP ; Sagesse boost en plus la probabilité
du dernier palier (Éveil).

### Coût par palier : une formule, pas une suite figée

Correction suite à ta réponse : les nombres 10/25/50/.../10 000 de la v2 n'étaient qu'un exemple
pour UNE attaque de base — tu veux une **fonction**, influencée par (a) le palier de maîtrise et
(b) la rareté de l'attaque (liée à sa difficulté d'éveil), pas une suite unique recopiée partout.
Proposition de point de départ (à recalibrer via playtest une fois le Bestiaire/XP de combat posés,
Sprint 3 — tu l'as toi-même noté : "il faudra le tester") :

```
XP_requis(palier) = XP_base × croissance^palier × facteur_rarete
```

- `XP_base`, `croissance` : les mêmes pour toutes les attaques d'un même palier (ex: `XP_base = 10`,
  `croissance ≈ 2.2`, ce qui redonne à peu près la suite 10/22/48/105/230/500/1100/2400/5300/11600
  — proche de la suite de la v2, juste exprimée en formule plutôt qu'à la main).
- `facteur_rarete` : propre à chaque attaque, dérivé de sa difficulté d'éveil. **Question ouverte
  sur le sens** (à trancher ensemble, je ne veux pas trancher seul) : une attaque plus rare/difficile
  à éveiller doit-elle coûter **plus** cher à monter en maîtrise (cohérent — plus rare = plus dur
  partout), ou **moins** cher (pour compenser le fait qu'elle a déjà été dure à obtenir) ?

Palier 4 (Éveil) reste un jet de probabilité (pas un coût XP) — et comme discuté, les pourcentages
et les capacités débloquées doivent être définis **par race ET par classe/école**, pas un seul
tableau universel : ex. un Mage Noir et un Mage Blanc ne doivent pas être optimisés de la même
façon en termes de gameplay, donc leurs tables d'éveil doivent diverger (contenu à écrire
spécialisation par spécialisation, pas un pourcentage générique "Mage").

### Exemple travaillé — Guerrier (branche Paladin)

| Palier | XP requis (formule, base=10, croissance=2.2) | Effet |
|---|---|---|
| Apprentie | 0 | Coup du guerrier (tel qu'écrit dans le Codex) |
| Maîtrise I | 10 | +dégâts, recul plus fort |
| Maîtrise II | 22 | Réduit le temps de "lenteur" après le coup |
| Maîtrise III–IX | 48 → 5 300 | Paliers à définir précisément (portée, cadence, résistance à l'interruption...) |
| Maîtrise X | 11 600 | Dernier palier avant l'éveil |
| Éveil (Sagesse + Intelligence, % à définir par classe) | — | Nouvelle capacité : posture défensive (réduit les dégâts subis quelques tours) |

### Deuxième exemple travaillé — Voleur (branche Chapardeur)

Choisi parce qu'il illustre bien le lien avec l'Arbre LV : le Chapardeur mise sur la Dextérité, la
même stat que le nœud Crochetage de la section 2 — un Voleur qui investit dans les deux systèmes
en parallèle (LV Dextérité + Maîtrise Chapardeur) doit se sentir cohérent, pas comme deux jauges
sans rapport.

| Palier | XP requis | Effet |
|---|---|---|
| Apprentie | 0 | Vol à la tire (tel qu'écrit dans le Codex) |
| Maîtrise I | 10 | +dégâts ou +vitesse d'enchaînement des coups |
| Maîtrise II | 22 | Réduit la résistance de la cible au vol/désarmement |
| Maîtrise III–IX | 48 → 5 300 | Paliers à définir (nombre de cibles touchées, portée du déplacement...) |
| Maîtrise X | 11 600 | Dernier palier avant l'éveil |
| Éveil (Sagesse + Intelligence, % à définir par classe) | — | Nouvelle capacité, ex: vol d'un effet actif de la cible (pas juste un objet) |

Même structure à appliquer aux 43 autres spécialisations une fois validée — je ne les détaille pas
toutes ici pour garder ce document lisible, mais le patron (Apprentie gratuite → paliers croissants
par formule → éveil probabiliste lié à Sagesse+Intelligence, table propre par race/classe)
s'applique partout à l'identique.

---

## Modèle de données (esquisse conceptuelle, pas un schéma Prisma final)

- `Personnage.pointsCompetenceNonAlloues` existe déjà (champ prévu, jamais branché) — alimente
  l'Arbre LV uniquement.
- Arbre LV : `NoeudLV` (id, branche [Force/Dex/.../Perception], raceId nullable [rempli seulement
  pour la branche Vitalité], coût, palierInterne nullable [pour un nœud type Crochetage, à rangs],
  effet) + `NoeudLVDebloquePersonnage` (personnageId, noeudId, rangAtteint).
- **Ne contient PAS** les traits raciaux déjà écrits (Rage du sang, etc.) — ceux-ci resteront
  rattachés au même système que les attaques de classe (voir point suivant), pas à `NoeudLV`.
- Arbre de Maîtrise : `PaliersMaitrise` (specialisationId, palier, formuleXp ou coûtXp calculé,
  effet, estEveil bool) + `MaitriseAttaquePersonnage` (personnageId, specialisationId,
  xpAccumulee, dernierPalierAtteint). Le trait racial pourrait un jour suivre ce même modèle
  (`MaitriseTraitRacial` par exemple) si on veut le faire progresser par l'usage — pas urgent, à
  reprendre si tu veux vraiment que les traits raciaux évoluent eux aussi.
- Le jet d'éveil (palier 4) lit Intelligence + Sagesse courantes + une table de probabilité propre
  à `(race, classe, specialisation)` — pas un pourcentage unique global.

Pas de proposition de migration réelle ici — à faire une fois la structure validée. Le système
d'XP par attaque (combien on gagne par usage réussi, diminishing returns...) reste à concevoir
avec le moteur de combat plutôt que deviné isolément ici.

---

## Questions ouvertes restantes → déplacé vers le codex

Toutes les questions de la v2 et de la v3 ont eu une réponse de ta part (récapitulées dans le
changelog en tête de document, plus tes annotations directes reprises ci-dessus). Suite à ta
demande de passer directement à la rédaction complète plutôt que de valider spécialisation par
spécialisation, le contenu détaillé (lore des paliers de Maîtrise/Éveil pour les 37 spécialisations,
et contenu complet des 8 branches de l'Arbre LV) est maintenant rédigé dans
[`codex_arbre_competences.md`](codex_arbre_competences.md) — c'est ce fichier qu'il faut relire
maintenant, celui-ci (la v3) reste le document de cadrage/règles auquel le codex se réfère.

**Rappel explicite pris en compte : aucun code tant que tu ne l'as pas dit.**

## Prochaines étapes

1. Tu relis cette v3, on ajuste ensemble (toujours pas de code).
2. Une fois la structure des deux arbres figée : je détaille le contenu complet (branches Vitalité
   par race, paliers de maîtrise par spécialisation).
3. Système d'XP par attaque (combien on gagne par usage, diminishing returns...) à concevoir avec
   le moteur de combat, pas isolément — à reprendre au Sprint 3.
4. Seulement après tout ça, et seulement quand tu le dis explicitement : schéma Prisma réel +
   implémentation.
