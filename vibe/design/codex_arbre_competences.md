# Codex — Arbre de compétences : contenu complet

**Statut : brouillon v1 de ce codex — dérivé du cadre validé dans
[`arbre_competences_proposition.md`](arbre_competences_proposition.md) (v3).** Toujours aucun code
tant que tu ne l'as pas dit explicitement. Ce document ne redéfinit pas les règles (deux arbres
séparés, plafond 20, formule XP, etc.) — il **remplit le contenu** : le lore de chaque nœud de
l'Arbre LV, et le lore de chaque palier de Maîtrise + Éveil pour les 37 spécialisations du Codex des
Classes.

Deux décisions prises à partir de tes dernières réponses, à valider en le lisant :

1. **Sens du `facteur_rarete` (Q1 de la v3), tranché avec toi** : une attaque plus rare/dure à
   éveiller coûte **plus cher** à monter en maîtrise ensuite, en échange d'une capacité d'Éveil
   nettement plus forte — "plus dur et plus cher mais d'une capa beaucoup plus forte donc à chaque
   level elle prend beaucoup plus de stat" (tes mots). Voir §2.1.
2. **Simplification proposée sur la "table d'éveil par race × classe"** (Q2 de la v3) : plutôt
   qu'une table de pourcentages séparée pour chaque race, je propose qu'elle **émerge automatiquement**
   de deux choses déjà posées : (a) chaque spécialisation a déjà sa propre capacité d'Éveil unique
   (donc Mage Noir ≠ Mage Blanc *par construction*, pas besoin d'un tableau en plus), et (b) la
   probabilité elle-même ne dépend que de l'Intelligence/Sagesse **actuelles** du personnage, qui
   diffèrent déjà naturellement par race (stats de départ différentes, Bestiaire_et_Races.md) et par
   la façon dont le joueur a dépensé ses points de l'Arbre LV. Un Demi-Orc qui met tout dans
   l'Intelligence n'aura jamais le totem qu'un Mage qui fait pareil, non pas via un tableau
   arbitraire mais parce qu'il part de 2 et plafonne à 20 comme tout le monde, là où le Mage part de
   8 — **c'est exactement l'effet que tu demandais dès le message d'origine.** Voir §2.2. **Si tu
   préfères quand même des tables explicites par race en plus de ça, dis-le et je les écris.**

---

## Partie 1 — Arbre LV, contenu complet

### 1.0 Rappel de forme

8 branches (une par caractéristique), 4 nœuds par branche pour l'instant, plafond 20 par branche.
Un nœud est un achat permanent sauf mention "palier interne" (façon perk Fallout : débloqué une
fois, puis amélioré séparément avec d'autres points).

### 1.1 Les 7 branches communes

**Identiques pour toute race et toute classe**, sauf les 4 exceptions listées en §1.3.

#### Force — dégâts et capacité de stockage

| # | Nœud | Effet |
|---|---|---|
| 1 | Coup appuyé | +dégâts physiques bruts en corps-à-corps |
| 2 | Portefaix | +capacité de charge (lien direct avec le budget/inventaire) |
| 3 | Bras de fer | Réduit l'effet des étourdissements/reculs subis (résistance au contrôle physique) |
| 4 | Coup de bélier | Chance de briser un bouclier, une porte ou un obstacle en un coup au corps-à-corps |

#### Dextérité — agilité, mouvements périlleux

| # | Nœud | Effet |
|---|---|---|
| 1 | **Crochetage** (ton exemple, gardé tel quel) | **Palier interne.** Débloqué à un seuil de Dextérité ; chaque palier supplémentaire ouvre des coffres/portes scellées de rang supérieur |
| 2 | Pas assurés | Réduit le risque de trébucher/glisser sur terrain difficile (grille octogonale, cases accidentées) |
| 3 | Esquive avec repositionnement | Une esquive réussie permet un pas gratuit de replacement sur la grille |
| 4 | Acrobatie | Franchit un obstacle bas ou saute par-dessus une case occupée sans provoquer d'attaque d'opportunité |

#### Charisme — relations et négociation

| # | Nœud | Effet |
|---|---|---|
| 1 | Bagou | Facilite l'acceptation d'une requête auprès d'un PNJ, **peu importe l'alignement moral** du personnage |
| 2 | Prix d'ami | Meilleurs tarifs chez les marchands du village |
| 3 | Voix qui porte | Augmente la portée d'effet des capacités de soutien/intimidation d'un allié proche |
| 4 | Sang-froid social | Réduit la chance qu'un PNJ neutre devienne hostile après un dérapage de dialogue |

#### Intelligence — vitesse de progression + artisanat

| # | Nœud | Effet |
|---|---|---|
| 1 | Étude rapide | Accélère le gain d'XP de l'Arbre de Maîtrise (cumulatif avec Sagesse, voir §2.2) |
| 2 | Œil du bâtisseur | Débloque des recettes de craft Rudimentaire supplémentaires (pertinent surtout pour l'Ingénieur, mais ouvert à tous par cohérence de l'arbre) |
| 3 | Mémoire tactique | Révèle la résistance/faiblesse d'un ennemi déjà rencontré dès le premier tour d'un nouveau combat |
| 4 | Calcul froid | Palier supérieur du nœud 1 : réduit encore le coût XP de l'Arbre de Maîtrise |

#### Sagesse — éveil de capacités rares

| # | Nœud | Effet |
|---|---|---|
| 1 | Intuition | Accélère le gain d'XP de l'Arbre de Maîtrise (cumulatif avec Intelligence, voir §2.2) |
| 2 | Clarté d'éveil | Augmente la probabilité de réussite du jet d'Éveil (palier final de l'Arbre de Maîtrise) |
| 3 | Sérénité | Réduit la durée des effets d'altération subis (poison, peur, confusion...) |
| 4 | Résonance | Palier supérieur du nœud 2 : bonus d'Éveil encore plus important |

#### Chance — loot et rencontres

| # | Nœud | Effet |
|---|---|---|
| 1 | Bonne étoile | Améliore le taux de loot Courant/Peu commun |
| 2 | Coup du sort | Légère chance de critique bonus, indépendante de la classe |
| 3 | Rencontre favorable | Réduit la fréquence des rencontres de mobs très au-dessus du niveau recommandé |
| 4 | Jackpot | Améliore spécifiquement le taux de drop Rare |

#### Perception — détection

| # | Nœud | Effet |
|---|---|---|
| 1 | Œil aiguisé | Repère les ennemis embusqués/dissimulés (ex : Serpent des bois, Araignée en embuscade) |
| 2 | Détection de pièges | Repère un piège avant de le déclencher |
| 3 | Lecture de faiblesse | Révèle la résistance/faiblesse élémentaire d'un ennemi jamais rencontré, après un tour d'observation en combat |
| 4 | Vision perçante | Augmente la portée de détection générale hors combat |

### 1.2 Branche Vitalité — contenu propre à chaque race

Rappel : **le trait racial déjà écrit (Rage du sang, Vision nocturne...) n'est PAS ici** — il relève
de la Maîtrise/Éveil (voir Modèle de données de la v3). Ce qui suit est un contenu **nouveau**,
thématiquement proche du trait mais mécaniquement distinct.

#### Elfe

| # | Nœud | Effet |
|---|---|---|
| 1 | **Double saut** (ton exemple) | Mobilité verticale, franchit un obstacle en un mouvement supplémentaire |
| 2 | Foulée elfique | Réduit le coût en endurance des déplacements |
| 3 | Enracinement léger | Récupération de Vitalité accrue en zone naturelle (forêt, village verdoyant) |
| 4 | Longévité | Réduit le malus subi lors d'un statut d'épuisement prolongé |

#### Nain

| # | Nœud | Effet |
|---|---|---|
| 1 | **Creuser une tranchée** (ton exemple) | Se cacher ou s'abriter en combat |
| 2 | Pas lourd | Résistance accrue aux effets de déplacement forcé (poussée, recul) |
| 3 | Sens des galeries | Meilleure orientation en environnement souterrain (grotte), réduit les rencontres surprises en intérieur |
| 4 | Endurance de la montagne | Régénération de Vitalité accrue au repos |

#### Demi-Orc

| # | Nœud | Effet |
|---|---|---|
| 1 | **Évolution des capacités physiques** (ton exemple) | Bonus de Force/Vitalité qui s'accentue à mesure que la branche progresse |
| 2 | Cuir épais | Réduction passive des dégâts physiques subis, croissante avec la branche |
| 3 | Sang bouillonnant | Accélère la régénération de Vitalité **après** un combat (hors combat, pour ne pas dupliquer Rage du sang qui agit pendant) |
| 4 | Carrure | Bonus de capacité de charge supplémentaire (cumulatif avec Force #2) |

#### Humain

*(proposition de ma part, tu n'avais pas donné d'exemple — à corriger si besoin)*

| # | Nœud | Effet |
|---|---|---|
| 1 | Polyvalence | Bonus réparti plutôt qu'un pic, cohérent avec le trait racial déjà écrit |
| 2 | Adaptation | Réduit le coût du premier palier de n'importe quelle branche jamais débloquée encore |
| 3 | Ténacité ordinaire | Léger bonus de récupération de Vitalité, sans pic particulier |
| 4 | Esprit d'équipe | Léger bonus actif uniquement si le personnage combat en groupe |

#### Mage

*(proposition de ma part — à corriger si besoin)*

| # | Nœud | Effet |
|---|---|---|
| 1 | Compensation de fragilité | Réduit un malus plutôt que grossir un bonus |
| 2 | Réserve seconde | Tampon de PV supplémentaire, une fois par combat |
| 3 | Canalisation stable | Réduit le risque d'échec critique lié à la Maîtrise |
| 4 | Sursaut arcanique | À PV critiques, récupère du Mana au lieu de PV (équivalent Mage de la Rage du sang, orienté magie plutôt que dégâts) |

### 1.3 Nœuds bonus liés aux 4 combos race × classe exclusifs

Ceux que tu avais toi-même notés dans la v3 (ligne "Lien racial" du tableau §0). Ce sont des nœuds
**en plus** des 4 nœuds communs de la branche concernée, réservés au personnage qui a à la fois la
race ET la classe exclusive associée :

| Race | Classe exclusive | Branche modifiée | Nœud bonus |
|---|---|---|---|
| Elfe | Chasseur sylvestre | Perception | **Œil de la forêt** — détection spécifique et accrue en milieu naturel (forêt), au-delà du nœud générique Perception #1 |
| Nain | Ingénieur | Intelligence | **Savoir-faire ancestral** — débloque directement une recette de craft Rudimentaire supplémentaire, sans dépendre du nœud générique Intelligence #2 |
| Demi-Orc | Berserker | Force | **Rage canalisée** — accès à un palier de dégâts supplémentaire au-delà du plafond normal du nœud Force #1, mais seulement quand les PV sont bas (complète Rage du sang sans le dupliquer : ici c'est un nœud d'Arbre LV permanent une fois acheté, alors que Rage du sang est le trait racial toujours actif) |
| Mage (les 3 écoles) | Mage Élémentaire / Noir / Blanc | Sagesse | **Flux arcanique** — réduit encore le coût XP de l'Arbre de Maîtrise, spécifiquement pour les sorts, au-delà des nœuds génériques Sagesse #1/#4 |

Pour toute autre combinaison race × classe (ex : Nain Guerrier, Elfe Barde, Humain Voleur...), les 7
branches communes et la branche Vitalité de la race s'appliquent **sans rien ajouter** — pas besoin
de le détailler combo par combo, rien ne change.

---

## Partie 2 — Arbre de Maîtrise, contenu complet

### 2.0 Patron de progression standard

Pour ne pas réécrire la même mécanique 370 fois (37 spécialisations × 10 paliers), voici le patron
qui s'applique **sauf mention contraire** à chaque spécialisation ci-dessous :

- **Apprentie** (0 XP) : l'attaque telle qu'écrite dans le Codex des Classes, sans modification.
- **Maîtrise I** : premier axe d'amélioration, propre à chaque attaque (détaillé ci-dessous pour
  chacune) — en général l'effet principal (dégâts, durée, chance de l'effet secondaire).
- **Maîtrise II–III** : continuent d'amplifier l'axe ouvert au palier I, +10 % cumulés par palier
  (générique, pas détaillé attaque par attaque).
- **Maîtrise IV** : **premier axe qualitatif** — l'attaque gagne une capacité qu'elle n'avait pas
  (portée, cible supplémentaire, zone, effet secondaire nouveau). Détaillé ci-dessous pour chacune.
- **Maîtrise V** : **second axe qualitatif**, généralement le plus marquant avant l'Éveil. Détaillé
  ci-dessous pour chacune.
- **Maîtrise VI–IX** : continuent d'amplifier les axes ouverts aux paliers IV et V, +10 % cumulés
  par palier (générique).
- **Maîtrise X** : plafond de la maîtrise "classique" — l'attaque atteint sa forme la plus aboutie
  sans passer par l'Éveil. Débloque la tentative d'Éveil (voir §2.2).
- **Éveil** : jet de probabilité, pas un palier acheté. Transforme l'attaque en une capacité
  qualitativement nouvelle, propre à chaque spécialisation. Détaillé ci-dessous pour chacune.

### 2.1 Facteur de rareté (résolution de la question ouverte)

Décision prise avec toi : plus une attaque est rare/dure à éveiller, plus cher elle coûte à monter
en Maîtrise (pas moins cher pour "compenser"), en échange d'un Éveil nettement plus fort.

| Facteur | Classes/écoles concernées | Justification |
|---|---|---|
| ×1,0 (standard) | Guerrier, Voleur, Barde, Berserker, Ingénieur, Chasseur sylvestre, Mage Élémentaire, et École Blanche hors Oracle/Astromancien | Attaques directes, pas de contrepartie narrative particulière au Codex |
| ×1,3 | Toute l'École Noire (Nécromancien, Maléficien, Démonologue, Umbrancien) | Le Codex le dit littéralement : "tout s'octroie au prix de malus, de sacrifices ou de longs rituels" — cohérent que ce soit aussi plus cher à maîtriser |
| ×1,5 | Oracle, Astromancien | Le Codex les qualifie lui-même de "très complexe(s) à maîtriser" — le facteur le plus élevé leur revient logiquement |

### 2.2 Probabilité d'Éveil — proposition (à valider)

```
P_eveil = (P_base + k × Intelligence_actuelle + k × Sagesse_actuelle) / facteur_rarete
```

Valeurs de départ à recalibrer par playtest (Sprint 3, comme le reste du système d'XP de combat) :
`P_base = 10 %`, `k = 1,5 % par point`, plafonné à 80 %. Exemple concret : un Mage Blanc Oracle avec
Intelligence 14 et Sagesse 16 → `(10 + 21 + 24) / 1,5 ≈ 36,7 %` de chance à chaque tentative. Un
Demi-Orc Guerrier Paladin avec Intelligence 6 et Sagesse 5 (peu investi, cohérent avec ses stats de
base faibles dans ces deux caractéristiques) → `(10 + 9 + 7,5) / 1,0 = 26,5 %` — plus facile d'accès
malgré tout (facteur ×1,0), ce qui est voulu : le Guerrier n'a pas besoin d'être un érudit pour
éveiller son coup signature, contrairement à l'Oracle.

Ceci répond à Q2 de la v3 sans table par race à écrire à la main : la différence Demi-Orc/Mage
émerge directement de leurs stats de départ (Bestiaire_et_Races.md) plutôt que d'un tableau que je
devrais inventer et maintenir à la main pour 37 spécialisations × 5 races.

### 2.3 Guerrier

#### Paladin — *Coup du guerrier*

- **I** : recul infligé plus fort, lenteur qui suit légèrement réduite.
- **IV** : le coup étourdit brièvement en plus de repousser.
- **V** : peut frapper deux ennemis alignés au lieu d'un seul.
- **Éveil — Mur du Paladin** : une fois par combat, encaisse un coup à la place d'un allié adjacent
  et repousse l'attaquant.

#### Escrimeur — *Estoc*

- **I** : fenêtre de critique élargie.
- **IV** : risque de contre-attaque en cas d'échec fortement réduit.
- **V** : un critique réussi accorde une action bonus (second Estoc immédiat).
- **Éveil — Fente Fatale** : enchaîne automatiquement un second Estoc après un critique, sans coût
  d'action.

#### Maître d'armes — *Jet contondant*

- **I** : nombre de jets dans la série +1.
- **IV** : les jets peuvent viser plusieurs cibles différentes plutôt qu'une seule.
- **V** : les jets ricochent (touchent une cible secondaire à dégâts réduits).
- **Éveil — Pluie d'acier** : jette toutes les armes de jet disponibles en une seule action, sur une
  zone.

#### Maître martial — *Frappe martiale*

- **I** : malus contre les grandes créatures réduit.
- **IV** : malus contre les adversaires en armure réduit.
- **V** : enchaîne un second coup à cadence réduite si le premier touche.
- **Éveil — Poing qui brise** : ignore une partie de la résistance/armure de la cible.

### 2.4 Voleur

#### Assassin — *Frappe sournoise*

- **I** : perte de l'avantage de discrétion réduite en cas d'échec critique.
- **IV** : fonctionne aussi contre une cible déjà engagée par un allié.
- **V** : chance de rester indétecté après le coup.
- **Éveil — Ombre parfaite** : la première attaque d'un combat est automatiquement considérée comme
  une surprise.

#### Chapardeur — *Vol à la tire*

- **I** : cadence des coups augmentée.
- **IV** : peut toucher deux cibles proches dans la même série.
- **V** : chance de vol/désarmement nettement augmentée.
- **Éveil — Doigts de lumière** : chance de voler un effet actif (buff) sur la cible, pas seulement
  un objet.

#### Lanceur — *Salve de projectiles*

- **I** : nombre de projectiles +1.
- **IV** : peut enduire/empoisonner les projectiles avant la salve (lien avec l'Alchimiste du
  village).
- **V** : portée augmentée.
- **Éveil — Tempête de lames** : la salve touche automatiquement tous les ennemis à portée courte.

#### Saboteur — *Piège dissimulé*

- **I** : temps de pose réduit.
- **IV** : peut poser deux pièges différents avant le déclenchement du premier.
- **V** : les pièges deviennent invisibles à la Perception standard (nécessite une Perception élevée
  pour les repérer).
- **Éveil — Champ de ruines** : pose un piège de zone affectant tous les ennemis qui y entrent, pas
  une cible unique.

### 2.5 Barde

#### Troubadour — *Ballade héroïque*

- **I** : rayon d'effet augmenté.
- **IV** : l'effet persiste un tour de plus.
- **V** : peut cibler sélectivement (buff allié OU debuff ennemi, indépendamment l'un de l'autre).
- **Éveil — Hymne de légende** : applique instantanément l'équivalent de deux tours de Ballade,
  sans temps de préparation.

#### Ménestrel — *Onde harmonique*

- **I** : dégâts de l'onde augmentés.
- **IV** : la portée passe de "devant lui" à un cône plus large.
- **V** : chance d'étourdissement ajoutée à l'effet.
- **Éveil — Symphonie brisante** : l'onde traverse plusieurs rangs ennemis sans perte de puissance.

#### Orateur — *Verbe incisif*

- **I** : effet plus long.
- **IV** : peut cibler deux ennemis à la fois.
- **V** : chance d'ajouter un débuff de Chance à l'ennemi (moins de critiques).
- **Éveil — Sentence** : l'ennemi ciblé perd son action suivante.

#### Danseur gymnaste — *Keri Pointe*

- **I** : chance de critique augmentée.
- **IV** : la danse d'approche esquive automatiquement une attaque d'opportunité.
- **V** : l'étourdissement dure un tour de plus en cas de critique.
- **Éveil — Pas de la Muse** : enchaîne un second Keri Pointe sur une cible différente immédiatement
  après le premier.

### 2.6 Mage — École Élémentaire

#### Pyromancien — *Flammèche*

- **I** : dégâts augmentés / surface enflammable plus grande.
- **IV** : applique une brûlure (dégâts sur la durée) en plus des dégâts directs.
- **V** : passe d'un jet simple à un cône court.
- **Éveil — Colonne ardente** : invoque un mur de flammes bloquant une ligne de cases sur la grille.

#### Hydromancien — *Pistolet à eau*

- **I** : seuil de critique abaissé.
- **IV** : un critique inflige en plus un recul.
- **V** : peut soigner légèrement un allié en plus de blesser un ennemi (choix à l'activation).
- **Éveil — Déluge** : jet d'eau en zone touchant plusieurs cibles alignées, critique inclus sur
  chacune.

#### Aéromancien — *Dash*

- **I** : distance du dash augmentée.
- **IV** : utilisable même après avoir déjà agi ce tour (action bonus).
- **V** : bonus de dégâts en cas de combo corps-à-corps renforcé.
- **Éveil — Bourrasque totale** : le dash repousse tous les ennemis sur sa trajectoire.

#### Géomancien — *Le Mur*

- **I** : durée du mur augmentée.
- **IV** : inflige de légers dégâts à l'érection (chute de pierres).
- **V** : peut ériger deux murs plus petits au lieu d'un grand.
- **Éveil — Bastion** : le mur devient une enceinte complète protégeant toute l'équipe.

### 2.7 Mage — École Noire *(facteur de rareté ×1,3)*

#### Nécromancien — *Rise*

- **I** : durée de contrôle du mort-vivant allongée.
- **IV** : peut relever une cible de niveau légèrement supérieur.
- **V** : le mort-vivant relevé gagne un léger bonus de dégâts.
- **Éveil — Légion mineure** : relève jusqu'à deux morts-vivants simultanément.

#### Maléficien — *Véhèmka*

- **I** : chance de cumuler deux débuffs au lieu d'un seul.
- **IV** : peut choisir la catégorie de débuff plutôt que le tirage aléatoire pur.
- **V** : la malédiction se propage à un ennemi adjacent à la cible.
- **Éveil — Fléau** : touche tous les ennemis visibles, effet aléatoire tiré par cible.

#### Démonologue — *Pentacle*

- **I** : coût en PV réduit pour le même buff.
- **IV** : peut cibler un allié spécifique en plus de l'équipe/soi-même.
- **V** : le sacrifice de PV peut être remplacé par du Mana si suffisant.
- **Éveil — Pacte majeur** : invoque un démon mineur combattant à ses côtés pour la durée du combat.

#### Umbrancien — *Dark Paralysis*

- **I** : durée de paralysie augmentée.
- **IV** : fonctionne même sans ombre nettement visible (pénombre).
- **V** : la paralysie se propage à un ennemi proche de la cible.
- **Éveil — Éclipse** : plonge toute la zone de combat dans l'obscurité, paralysant brièvement tous
  les ennemis non résistants aux ténèbres.

### 2.8 Mage — École Blanche

#### Luminomancien — *Flash*

- **I** : rayon d'aveuglement augmenté.
- **IV** : inflige une légère brûlure aux créatures sombres/mortes-vivantes touchées.
- **V** : peut servir de source de lumière permanente hors combat, sans dépense.
- **Éveil — Aube** : la zone illuminée inflige des dégâts continus aux morts-vivants qui y
  stationnent.

#### Guérisseur — *Mercurotrom*

- **I** : soin augmenté.
- **IV** : peut cibler deux alliés en même temps.
- **V** : portée augmentée.
- **Éveil — Renaissance** : le soin peut relever un allié tombé de façon fiable (plus besoin de
  compter sur le hasard d'un critique).

#### Exorciste — *Vague sainte*

- **I** : dégâts contre les morts-vivants augmentés.
- **IV** : la purification d'un allié tombé restaure plus de PV.
- **V** : portée en cône élargie.
- **Éveil — Bannissement** : un mort-vivant non-boss touché est instantanément retiré du combat.

#### Oracle *(facteur de rareté ×1,5)* — *Xélus*

- **I** : durée du ralentissement temporel augmentée.
- **IV** : le bonus de déplacement (x2) s'étend brièvement à un allié proche.
- **V** : réduit la fatigue infligée par la téléportation d'objets.
- **Éveil — Portail** : ouvre un portail de courte portée déplaçant toute l'équipe d'une zone à une
  autre sur la carte de combat.

#### Astromancien *(facteur de rareté ×1,5)* — *Jet cinétique*

- **I** : poids/vitesse maximum lançable augmenté.
- **IV** : risque d'échec sur les jets de gros objets réduit.
- **V** : peut désormais cibler directement un ennemi (projection), pas seulement un objet.
- **Éveil — Gravité brisée** : soulève et immobilise brièvement une cible dans les airs avant de la
  relâcher (dégâts de chute + étourdissement).

### 2.9 Berserker

#### Brise-crâne — *Fracassement*

- **I** : chance d'étourdissement augmentée.
- **IV** : brise systématiquement un bouclier en un coup (plus un simple jet de chance).
- **V** : le recul infligé repousse sur deux cases au lieu d'une.
- **Éveil — Séisme** : le Fracassement touche tous les ennemis adjacents, pas une cible unique.

#### Sauvage — *Rage sanguinaire*

- **I** : durée augmentée.
- **IV** : le malus de défense est réduit sans réduire le bonus offensif.
- **V** : en rage, chaque coup porté restaure un peu de Vitalité.
- **Éveil — Fureur sans fin** : la rage ne s'arrête plus après un nombre fixe de tours, mais tant que
  les PV restent sous 50 %.

#### Traqueur (Berserker) — *Bond du prédateur*

- **I** : distance de saut augmentée.
- **IV** : ignore totalement les obstacles bas (plus seulement partiellement).
- **V** : l'atterrissage inflige un léger dégât de zone en plus de la cible visée.
- **Éveil — Chasse sans fin** : un second Bond devient disponible dans le même tour si le premier a
  tué sa cible.

#### Colosse — *Charge écrasante*

- **I** : distance de charge augmentée.
- **IV** : renverse systématiquement au lieu d'un simple jet de chance.
- **V** : la charge continue sa trajectoire après avoir touché une première cible.
- **Éveil — Avalanche** : la charge touche et renverse toute une ligne d'ennemis sur son passage.

### 2.10 Ingénieur

#### Mineur — *Coup de pioche*

- **I** : dégâts contre l'armure augmentés.
- **IV** : la fissure infligée persiste (l'ennemi reste affaibli plusieurs tours).
- **V** : le bonus contre créatures minérales s'étend aux créatures blindées/mécaniques.
- **Éveil — Faille** : un coup critique détruit purement et simplement une pièce d'armure/bouclier de
  la cible pour le reste du combat.

#### Forgeron — *Marteau de forge*

- **I** : chance d'étourdissement augmentée.
- **IV** : réduit aussi la résistance à un second type de dégâts (pas seulement physique).
- **V** : peut réappliquer l'effet sur un allié pour renforcer temporairement son arme.
- **Éveil — Enclume vivante** : le coup suivant porté par n'importe quel allié sur la même cible
  bénéficie d'un bonus de dégâts.

#### Artificier — *Tourelle mécanique*

- **I** : durée de la tourelle augmentée.
- **IV** : la tourelle peut cibler deux ennemis en alternance.
- **V** : dégâts de la tourelle augmentés.
- **Éveil — Essaim** : déploie deux tourelles simultanément.

#### Démolisseur — *Charge explosive*

- **I** : rayon de l'explosion augmenté.
- **IV** : peut poser deux charges avant de les déclencher ensemble.
- **V** : réduit le délai entre pose et explosion.
- **Éveil — Terre brûlée** : l'explosion laisse une zone de dégâts continus pendant quelques tours.

### 2.11 Chasseur sylvestre

#### Archer — *Flèche précise*

- **I** : seuil de critique abaissé.
- **IV** : portée encore augmentée.
- **V** : ignore une partie de la résistance/armure sur critique.
- **Éveil — Flèche du destin** : critique automatique si la cible n'a pas bougé depuis le tour
  précédent.

#### Traqueur (Chasseur sylvestre) — *Marquage du prédateur*

- **I** : bonus de dégâts sur cible marquée augmenté.
- **IV** : peut marquer deux cibles simultanément.
- **V** : la marque persiste même après un changement de zone.
- **Éveil — Proie condamnée** : la cible marquée subit des dégâts bonus de la part de tous les
  alliés, pas seulement du Traqueur.

#### Maître des bêtes — *Assaut coordonné*

- **I** : dégâts combinés augmentés.
- **IV** : le compagnon peut agir une seconde fois si l'assaut tue sa cible.
- **V** : l'assaut peut cibler deux ennemis proches (un chacun).
- **Éveil — Meute** : le compagnon devient temporairement plus puissant (bonus généralisé) pour le
  reste du combat.

#### Gardien sylvestre — *Ronces entravantes*

- **I** : durée d'immobilisation augmentée.
- **IV** : la zone d'effet passe d'une cible à une petite zone.
- **V** : les dégâts infligés augmentent chaque tour où la cible reste prise.
- **Éveil — Étreinte de la forêt** : les ronces immobilisent totalement une cible pour un tour
  complet, sans jet de résistance.

---

## Ce qui reste ouvert

1. **Les deux propositions du chapeau** (sens du `facteur_rarete`, simplification "pas de table par
   race séparée") — confirme si ça te va ou si tu veux que je les modifie.
2. **Nœuds Vitalité Humain/Mage** (§1.2) — toujours mes propositions, pas les tiennes, à valider ou
   remplacer.
3. Les I/IV/V/Éveil ci-dessus sont un **premier jet complet** sur les 37 spécialisations — normal
   qu'il y ait des trucs à corriger ligne par ligne en le relisant, c'est fait pour.
4. Toujours pas fait : le détail des paliers II-III/VI-IX attaque par attaque (volontairement laissé
   générique, §2.0) — dis-moi si tu veux que je les détaille aussi ou si le patron générique te va.

**Aucun code tant que tu ne l'as pas dit.**
