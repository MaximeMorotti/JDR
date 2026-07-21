# 📖 LE DÉBUT D'UNE ÉPOPÉE : Bestiaire & Compendium des Races

**Chapitre 1 : Le Village, la Forêt, les Ruines de l'Avant-poste et la Grotte**
*Fiches techniques complètes avec lore, statistiques, attaques et butin.*

---

## 🛡️ RACES JOUABLES

Fiches techniques complètes des cinq origines possibles pour la création d'un personnage aventurier, compatibles avec la fiche Joueur.

### Statistiques de base par race

| Race | Force | Dextérité | Vitalité | Charisme | Intelligence | Sagesse | Chance | Perception |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Humain** | 5 | 5 | 4 | 8 | 5 | 4 | 5 | 5 |
| **Elfe** | 2 | 8 | 2 | 5 | 7 | 7 | 5 | 8 |
| **Nain** | 8 | 2 | 6 | 3 | 8 | 4 | 4 | 6 |
| **Demi-Orc** | 7 | 7 | 8 | 5 | 2 | 2 | 3 | 3 |
| **Mage** | 3 | 4 | 3 | 5 | 8 | 8 | 6 | 6 |

> **⚠️ Valeurs comblées (absentes des documents sources) :** les colonnes **Chance** et **Perception** n'existaient dans aucune source d'origine — ni le PDF, ni le DOCX, ni le fichier `Bestiaire_Stats_Radar.xlsx` qui sert de base aux radars de stats (vérifié : seules 6 stats y figurent : Force, Dextérité, Vitalité, Charisme, Intelligence, Sagesse). La Fiche Technique Joueur définit pourtant 8 caractéristiques de base, donc ces deux colonnes ont été **complétées par l'IA** pour que la fiche personnage soit toujours affichée complète (aucune caractéristique omise), en s'appuyant sur le lore racial déjà écrit :
> - Elfe → Perception haute (vision nocturne, détection)
> - Nain → Perception moyenne-haute (vision dans le noir, bonus vs créatures souterraines)
> - Demi-Orc → Chance/Perception basses (cohérent avec son profil brut, Intelligence/Sagesse déjà faibles)
> - Humain/Mage → valeurs neutres (pas de trait racial dédié à ces deux stats)
>
> Ces valeurs sont **à valider ou ajuster par le game design** — voir l'écart correspondant dans `CLAUDE.md`.

### Humain

* **Taille :** 160-190 cm | **Poids :** 60-90 kg
* **Lore :** Peuple le plus répandu du royaume, on trouve des Humains dans chaque village, chaque cité et sur chaque route marchande. Leur histoire commune reste courte face à celle des Elfes ou des Nains, mais leur capacité d'adaptation leur permet de prospérer partout où ils s'installent. C'est un Humain, natif du village où débute cette histoire, qui incarne le héros de cette première épopée.
* **Trait racial (Polyvalence) :** Point de compétence bonus au niveau 1, +1 point libre à répartir à la création.
* **Équipement de départ typique :** Épée courte, bouclier léger, tenue de voyageur en cuir.

### Elfe

* **Taille :** 185-195 cm | **Poids :** 55-75 kg
* **Lore :** Les Elfes vivent en retrait des grandes routes, dans des clairières et des forêts anciennes qu'ils protègent depuis des générations. Leur longévité leur donne une mémoire collective immense, et beaucoup considèrent les autres peuples comme jeunes et impatients. Il n'est pas rare d'en croiser un, isolé loin de sa communauté, explorant le monde comme n'importe quel aventurier.
* **Trait racial :** Vision nocturne. Résistance accrue au sommeil et aux effets de charme.
* **Équipement de départ typique :** Arc court, dague, cape légère en tissu naturel.

### Nain

* **Taille :** 130-150 cm | **Poids :** 70-95 kg
* **Lore :** Bâtisseurs et forgerons intègres, les Nains creusent depuis toujours les profondeurs des montagnes à la recherche de minerais rares. Leur endurance légendaire et leur entêtement en font d'excellents compagnons de route, aussi solides au combat qu'à la table d'une taverne. Beaucoup quittent leur clan pour chercher fortune ou gloire loin des galeries familiales.
* **Trait racial :** Résistance au poison. Vision dans le noir. Bonus de combat contre les créatures souterraines.
* **Équipement de départ typique :** Marteau ou hache de guerre, armure lourde partielle.

### Demi-Orc

* **Taille :** 175-200 cm | **Poids :** 85-110 kg
* **Lore :** Nés de l'union entre Humains et Orcs, les Demi-Orcs grandissent souvent à la marge des deux sociétés, ni pleinement acceptés par l'une ni par l'autre. Leur carrure imposante et leur tempérament parfois brut cachent une loyauté sans faille envers ceux qu'ils considèrent comme les leurs. Beaucoup deviennent aventuriers pour se forger une identité loin des préjugés.
* **Trait racial (Rage du sang) :** Bonus de dégâts quand les PV passent sous 30%. Intimidation naturelle envers les PNJ faibles.
* **Équipement de départ typique :** Hache à deux mains ou masse tribale, armure légère renforcée.

### Mage (Mutation rare)

* **Taille :** ??? | **Poids :** ???
* **Lore :** Le don de magie n'appartient à aucune race en particulier : il s'agirait d'une mutation apparue chez les Elfes il y a des siècles, puis discrètement transmise à travers toutes les lignées au fil du temps. Un sédentaire croisera peut-être un seul Mage dans toute sa vie, ou aucun. Les aventuriers, eux, savent où chercher, et en croisent bien plus souvent que la moyenne.
* **Trait racial :** Accès inné à la magie sans apprentissage préalable, mais grande fragilité physique. Peut théoriquement apparaître dans n'importe quelle race.
* **Équipement de départ typique :** Bâton ou grimoire, robe légère (armure lourde impossible à porter).

---

## 💰 SYSTÈME DE LOOT

Chaque créature du chapitre 1 dispose d'une table de butin détaillée, tirée indépendamment objet par objet au moment du kill.

| Palier | % de drop | Concerne |
| --- | --- | --- |
| **Courant** | 70% | Matériaux d'artisanat basiques, monnaie, munitions |
| **Peu commun** | 45% (plafond) | Équipement qui drop tel quel, objets de quête mineurs, composants spéciaux |
| **Rare/complexe** | 30% (parfois 45%) | Composants alchimiques rares, objets de quête importants |
| **Unique (boss)** | 100% | Objet signature garanti de chaque boss (récompense fixe, pas une loterie) |

*Note pour amélioration future : chaque loot listé se tire indépendamment de son pourcentage pour l'instant. Plus tard, le système IA pourra ajuster ces taux selon la façon dont le monstre est achevé (mort nette, fuite, etc.).*

---

## 🌲 LA FORÊT

Faune et créatures rencontrées en s'enfonçant dans les bois autour du village.

### Loup gris

* **Niveau conseillé :** 1 | **Comportement :** Chasse en meute, encercle sa proie.
* **Lore :** Parcourent les sous-bois en meutes organisées. Leurs attaques se rapprochent dangereusement des habitations.
* **Stats :** PV **18** | Force **8** | Dextérité **12** | Vitalité **9** | Résistance : **Physique léger** | Faiblesse : **Feu**
* **Attaques :**
* *Morsure* (4-6) : Dégâts physiques.
* *Attaque groupée* (+2 par loup allié) : Bonus de contournement.


* **Butin :** Peau de loup (Craft, Courant 70%, 1-3), Croc de loup (Craft, Courant 70%, 1-2).

### Loup alpha

* **Niveau conseillé :** 3 | **Comportement :** Chef de meute, très agressif.
* **Lore :** Chef incontesté, il galvanise les autres loups des environs par sa simple présence.
* **Stats :** PV **40** | Force **12** | Dextérité **14** | Vitalité **13** | Résistance : **Physique** | Faiblesse : **Feu**
* **Attaques :**
* *Morsure puissante* (8-12) : Dégâts physiques.
* *Hurlement de meute* (—) : Buff de dégâts pour les loups alliés proches (2 tours).


* **Butin :** Peau de loup alpha (Craft, Courant 70%, 1-2), Griffe aiguisée (Craft, Peu commun 45%, 1).

### Sanglier sauvage

* **Niveau conseillé :** 1 | **Comportement :** Charge en ligne droite dès qu'il est dérangé.
* **Lore :** Animal territorial et nerveux qui charge sans sommation.
* **Stats :** PV **22** | Force **10** | Dextérité **6** | Vitalité **12** | Résistance : **Contondant** | Faiblesse : **Perforant**
* **Attaques :**
* *Charge* (5-7) : Dégâts physiques, chance d'étourdir.
* *Coup de défense* (3-4) : Attaque rapide au CàC.


* **Butin :** Défense de sanglier (Craft, Courant 70%, 1), Viande (Consommable, Courant 70%, 1-3).

### Serpent des bois

* **Niveau conseillé :** 1 | **Comportement :** Embuscade, fuit s'il est blessé.
* **Lore :** Camouflé dans les feuilles mortes, il attend patiemment avant de frapper.
* **Stats :** PV **12** | Force **5** | Dextérité **14** | Vitalité **6** | Résistance : **—** | Faiblesse : **Froid**
* **Attaques :**
* *Morsure venimeuse* (3-5) : Poison léger (DoT).
* *Fuite rapide* (—) : Se met hors de portée.


* **Butin :** Venin de serpent (Alchimie, Peu commun 45%, 1-2), Peau écailleuse (Craft, Courant 70%, 1-2).

### Corbeau maudit

* **Niveau conseillé :** 2 | **Comportement :** Tourne en cercle et harcèle à distance.
* **Lore :** Témoins d'un ancien rituel sombre dans les ruines, ils en portent les stigmates.
* **Stats :** PV **14** | Force **4** | Dextérité **15** | Vitalité **6** | Résistance : **Magie sombre** | Faiblesse : **Lumière / Sacré**
* **Attaques :**
* *Griffures* (2-4) : Dégâts physiques.
* *Malédiction mineure* (—) : Réduit temporairement la Chance de la cible.


* **Butin :** Plume maudite (Alchimie, Peu commun 45%, 1-2).

### Ours des bois

* **Niveau conseillé :** 3 | **Comportement :** Territorial, dangereux surtout s'il est surpris.
* **Lore :** Solitaire, il ne cherche pas le conflit mais gare à qui s'approche de son repaire.
* **Stats :** PV **45** | Force **14** | Dextérité **5** | Vitalité **15** | Résistance : **Physique** | Faiblesse : **Feu**
* **Attaques :**
* *Coup de griffes* (9-14) : Dégâts physiques lourds.
* *Charge intimidante* (—) : Chance d'effrayer la cible (recul).


* **Butin :** Fourrure d'ours (Craft, Courant 70%, 1), Griffe d'ours (Craft, Peu commun 45%, 1).

### Lutin farceur (Sprite)

* **Niveau conseillé :** 1 | **Comportement :** Fuyard, aime voler des objets brillants.
* **Lore :** Créature espiègle préférant fuir dès qu'il obtient ce qu'il convoite.
* **Stats :** PV **8** | Force **2** | Dextérité **16** | Vitalité **4** | Résistance : **Magie mineure** | Faiblesse : **Fer**
* **Attaques :**
* *Griffure joueuse* (1-2) : Dégâts mineurs.
* *Vol d'objet* (—) : Tente de dérober un objet avant de fuir.


* **Butin :** Poussière de lutin (Alchimie, Rare 30%, 1-2).

### Gobelin éclaireur

* **Niveau conseillé :** 1 | **Comportement :** Fuit pour alerter le reste de sa bande.
* **Lore :** Sentinelle qui observe plus qu'il ne combat.
* **Stats :** PV **15** | Force **6** | Dextérité **12** | Vitalité **7** | Résistance : **—** | Faiblesse : **Feu**
* **Attaques :**
* *Coup de dague* (3-5) : Dégâts physiques.
* *Fuite et alerte* (—) : S'enfuit pour prévenir d'autres gobelins.


* **Butin :** Piécettes (Monnaie, Courant 70%, 3-8 po), Dague rouillée (Arme, Peu commun 45%, 1).

### Champignon marcheur (Myconide)

* **Niveau conseillé :** 2 | **Comportement :** Lent, libère un nuage de spores confusant.
* **Lore :** Créature végétale lente mais résistante.
* **Stats :** PV **20** | Force **7** | Dextérité **3** | Vitalité **12** | Résistance : **Poison** | Faiblesse : **Feu**
* **Attaques :**
* *Coup de tige* (4-6) : Dégâts physiques.
* *Nuage de spores* (—) : Confusion (chance de rater la prochaine action).


* **Butin :** Spore rare (Alchimie, Rare 30%, 1-2), Chapeau de champignon (Consommable, Peu commun 45%, 1-3).

### Liane étrangleuse

* **Niveau conseillé :** 2 | **Comportement :** Immobile, attaque tout ce qui s'approche.
* **Lore :** Quasi invisible parmi la végétation, elle enlace sa proie.
* **Stats :** PV **25** | Force **11** | Dextérité **4** | Vitalité **14** | Résistance : **Tranchant léger, Poison** | Faiblesse : **Feu**
* **Attaques :**
* *Étranglement* (5-8) : Immobilise la cible 1 tour.
* *Fouet de liane* (3-5) : Attaque à courte portée.


* **Butin :** Fibre végétale (Craft, Courant 70%, 1-3), Sève rare (Craft, Peu commun 45%, 1-2).

### Loup-garou

* **Niveau conseillé :** 4 | **Comportement :** Rare, nocturne, extrêmement agressif.
* **Lore :** N'apparaît que les nuits de pleine lune.
* **Stats :** PV **55** | Force **16** | Dextérité **13** | Vitalité **15** | Résistance : **Physique** | Faiblesse : **Argent**
* **Attaques :**
* *Griffes féroces* (10-16) : Dégâts physiques lourds.
* *Frénésie* (+3) : Bonus de dégâts quand ses PV sont bas.


* **Butin :** Griffe de loup-garou (Craft, Peu commun 45%, 1), Fourrure maudite (Craft, Peu commun 45%, 1).

---

## 🏚️ LES RUINES DE L'AVANT-POSTE

Vestiges d'une ancienne garnison retrouvés au cœur de la forêt — repaire de morts-vivants et de pillards.

### Bandit chef de bande / brute

* **Niveau conseillé :** 3 | **Comportement :** Commande les autres bandits, CàC.
* **Lore :** Impose sa loi par la force brute.
* **Stats :** PV **35** | Force **13** | Dextérité **8** | Vitalité **12** | Résistance : **Physique léger** | Faiblesse : **—**
* **Attaques :**
* *Coup d'arme lourde* (8-11) : Dégâts physiques.
* *Rugissement de chef* (—) : Buff de dégâts pour les bandits alliés.


* **Butin :** Bourse de chef (Monnaie, Courant 70%, 10-20 po), Arme de qualité (Arme, Peu commun 45%, Lame de chef).

### Bandit pillard

* **Niveau conseillé :** 2 | **Comportement :** Attaque en groupe, fuit s'il est isolé.
* **Lore :** Fouille les ruines à la recherche d'objets monnayables.
* **Stats :** PV **22** | Force **9** | Dextérité **10** | Vitalité **9** | Résistance : **—** | Faiblesse : **—**
* **Attaques :**
* *Coup d'épée courte* (5-7) : Dégâts physiques.
* *Fuite tactique* (—) : Se replie s'il se retrouve isolé.


* **Butin :** Or (Monnaie, Courant 70%, 4-10 po), Arme rouillée (Arme, Peu commun 45%, 1).

### Bandit pillard archer

* **Niveau conseillé :** 2 | **Comportement :** Garde ses distances.
* **Lore :** Couvre ses complices à distance depuis les hauteurs.
* **Stats :** PV **18** | Force **6** | Dextérité **13** | Vitalité **8** | Résistance : **—** | Faiblesse : **Corps à corps rapide**
* **Attaques :**
* *Tir d'arc* (4-6) : Dégâts à distance.
* *Repli* (—) : Recule si un ennemi approche.


* **Butin :** Flèches (Munition, Courant 70%, 3-6), Or (Monnaie, Courant 70%, 4-10 po).

### Squelette soldat

* **Niveau conseillé :** 2 | **Comportement :** Défend les ruines sans relâche.
* **Lore :** Ancien défenseur incapable de quitter son poste.
* **Stats :** PV **20** | Force **9** | Dextérité **8** | Vitalité **10** | Résistance : **Perforant / Poison** | Faiblesse : **Contondant / Sacré**
* **Attaques :**
* *Coup d'épée rouillée* (5-7) : Dégâts physiques.
* *Garde inébranlable* (—) : Réduit les dégâts subis au CàC.


* **Butin :** Os (Craft, Courant 70%, 1-3), Fragment d'armure (Craft, Peu commun 45%, 1 - Plastron de garnison).

### Squelette archer

* **Niveau conseillé :** 2 | **Comportement :** Tire à distance, recule si approché.
* **Lore :** Insensible à la douleur, il tire sans relâche.
* **Stats :** PV **16** | Force **6** | Dextérité **12** | Vitalité **8** | Résistance : **Perforant / Poison** | Faiblesse : **Contondant / Sacré**
* **Attaques :**
* *Tir d'arc ancien* (4-6) : Dégâts à distance.
* *Recul tactique* (—) : Se replie pour garder ses distances.


* **Butin :** Os (Craft, Courant 70%, 1-3), Flèches anciennes (Munition, Courant 70%, 3-6).

### Zombie de garnison

* **Niveau conseillé :** 2 | **Comportement :** Lent mais increvable.
* **Lore :** Ancien soldat transformé par une force inconnue.
* **Stats :** PV **30** | Force **10** | Dextérité **3** | Vitalité **12** | Résistance : **Perforant / Poison** | Faiblesse : **Feu / Sacré**
* **Attaques :**
* *Coup lourd* (6-9) : Dégâts physiques.
* *Morsure infectée* (+1/tour) : Infection légère sur la durée.


* **Butin :** Chair putréfiée (Alchimie, Courant 70%, 1-2), Reste d'uniforme (Quête, Peu commun 45%, 1).

### Fantôme d'officier

* **Niveau conseillé :** 3 | **Comportement :** Traverse les murs, drainant.
* **Lore :** L'esprit de l'ancien commandant incapable de faire son deuil.
* **Stats :** PV **28** | Force **4** | Dextérité **10** | Vitalité **8** | Résistance : **Physique (quasi-immunité)** | Faiblesse : **Sacré / Magie**
* **Attaques :**
* *Toucher spectral* (5-8) : Dégâts + effet de peur bref.
* *Drain de vie* (3-5) : Vole une partie des PV infligés.


* **Butin :** Médaille spectrale (Quête, Peu commun 45%, 1), Essence spirituelle (Alchimie, Rare 30%, 1).

### Rat géant des décombres

* **Niveau conseillé :** 1 | **Comportement :** Vit en groupe, fuit s'il est isolé.
* **Lore :** Prolifèrent dans les décombres et se nourrissent de restes.
* **Stats :** PV **10** | Force **5** | Dextérité **11** | Vitalité **6** | Résistance : **—** | Faiblesse : **Feu**
* **Attaques :**
* *Morsure* (2-4) : Dégâts physiques.
* *Griffe maladive* (—) : Chance d'infliger une maladie légère.


* **Butin :** Queue de rat (Alchimie, Courant 70%, 1-3), Fourrure sale (Craft, Courant 70%, 1-3).

### Chauve-souris

* **Niveau conseillé :** 1 | **Zone :** Ruines / Grotte | **Comportement :** Vol erratique, en groupe.
* **Lore :** Niche dans les recoins sombres, attaque quiconque dérange son repos.
* **Stats :** PV **8** | Force **3** | Dextérité **15** | Vitalité **4** | Résistance : **—** | Faiblesse : **Lumière / Son**
* **Attaques :**
* *Morsure rapide* (1-3) : Dégâts physiques mineurs.
* *Vol erratique* (—) : Chance d'esquiver la prochaine attaque.


* **Butin :** Aile de chauve-souris (Alchimie, Courant 70%, 1-2).

### Esprit follet (Wisp errant)

* **Niveau conseillé :** 2 | **Comportement :** Attire les voyageurs, vol erratique.
* **Lore :** Lumière flottante aux intentions rarement bienveillantes.
* **Stats :** PV **14** | Force **2** | Dextérité **10** | Vitalité **5** | Résistance : **Physique** | Faiblesse : **Magie / Froid**
* **Attaques :**
* *Décharge éthérée* (3-5) : Dégâts magiques.
* *Attraction* (—) : Attire la cible vers l'esprit, la sortant de sa formation.


* **Butin :** Lumière captive (Alchimie, Rare 30%, 1), Essence éthérée (Alchimie, Rare 30%, 1).

---

## 🕳️ LA GROTTE

Refuge trouvé après la fuite des ruines — s'avère être l'antre d'un nid de gobelins.

### Gobelin archer

* **Niveau conseillé :** 2 | **Comportement :** Tir depuis hauteur/couvert.
* **Lore :** Posté sur les corniches, couvre les assauts.
* **Stats :** PV **16** | Force **6** | Dextérité **13** | Vitalité **7** | Résistance : **—** | Faiblesse : **Feu**
* **Attaques :**
* *Tir d'arc* (4-6) : Dégâts à distance.
* *Repli tactique* (—) : Se déplace vers une position en hauteur.


* **Butin :** Flèches (Munition, Courant 70%, 3-6), Or (Monnaie, Courant 70%, 4-10 po).

### Gobelin ravageur

* **Niveau conseillé :** 2 | **Comportement :** Fonceur, mène les assauts.
* **Lore :** Le plus téméraire, mène systématiquement la charge.
* **Stats :** PV **24** | Force **11** | Dextérité **9** | Vitalité **10** | Résistance : **—** | Faiblesse : **Feu**
* **Attaques :**
* *Coup de hache* (6-9) : Dégâts physiques.
* *Charge frontale* (+2) : Bonus sur la première attaque.


* **Butin :** Hache ébréchée (Arme, Peu commun 45%, 1), Or (Monnaie, Courant 70%, 4-10 po).

### Gobelin chaman

* **Niveau conseillé :** 3 | **Comportement :** Reste en arrière, soutient.
* **Spécial :** Intelligence 13, Sagesse 12
* **Lore :** Détenteur d'un savoir magique rudimentaire.
* **Stats :** PV **20** | Force **6** | Dextérité **8** | Vitalité **8** | Résistance : **Magie mineure** | Faiblesse : **Silence / Corps à corps rapide**
* **Attaques :**
* *Sort mineur* (5-8) : Dégâts magiques.
* *Soin tribal* (—) : Soigne un allié gobelin proche.


* **Butin :** Totem gobelin (Quête, Peu commun 45%, 1), Composants magiques (Craft Mage, Peu commun 45%, 1-2).

### Araignée géante

* **Niveau conseillé :** 3 | **Comportement :** Tisse des toiles, embuscade.
* **Lore :** Tisse ses toiles dans les recoins sombres avant de fondre sur sa proie.
* **Stats :** PV **26** | Force **9** | Dextérité **14** | Vitalité **10** | Résistance : **—** | Faiblesse : **Feu**
* **Attaques :**
* *Morsure venimeuse* (6-9) : Poison léger.
* *Piège de toile* (—) : Immobilise brièvement la cible.


* **Butin :** Soie d'araignée (Craft, Courant 70%, 1-3), Glande à venin (Alchimie, Peu commun 45%, 1).

### Araignée géante cracheuse de venin

* **Niveau conseillé :** 3 | **Comportement :** Attaque à distance, recule.
* **Lore :** Variante prudente préférant attaquer de loin.
* **Stats :** PV **24** | Force **7** | Dextérité **13** | Vitalité **9** | Résistance : **Poison** | Faiblesse : **Feu**
* **Attaques :**
* *Crachat de venin* (5-7) : Poison fort à distance.
* *Repli* (—) : Recule si approchée de trop près.


* **Butin :** Venin concentré (Alchimie, Peu commun 45%, 1-2), Soie (Craft, Courant 70%, 1-3).

### Ver des cavernes

* **Niveau conseillé :** 3 | **Comportement :** Surgit du sol, sensible aux vibrations.
* **Lore :** Aveugle mais happe quiconque marche trop près.
* **Stats :** PV **35** | Force **12** | Dextérité **4** | Vitalité **14** | Résistance : **Physique** | Faiblesse : **Tranchant / Feu**
* **Attaques :**
* *Broyage* (7-10) : Dégâts physiques lourds.
* *Jaillissement surprise* (—) : Bonus de dégâts à la première attaque.


* **Butin :** Peau de ver (Craft, Peu commun 45%, 1), Acide digestif (Craft, Peu commun 45%, 1 - charge explosive pour Ingénieur).

### Troll des cavernes *(Mini-boss)*

* **Niveau conseillé :** 6 | **Comportement :** Régénère ses PV, dangereux sur la durée.
* **Lore :** Gardien redouté des profondeurs de la grotte.
* **Stats :** PV **90** | Force **18** | Dextérité **6** | Vitalité **18** | Résistance : **Physique + régénération** | Faiblesse : **Feu / Acide (bloque la régén.)**
* **Attaques :**
* *Coup de massue* (14-20) : Dégâts physiques très lourds.
* *Régénération* (—) : Récupère des PV chaque tour, sauf si dégâts de feu.


* **Butin :** Sang de troll (Alchimie, Peu commun 45%, 1-2), Massue de Troll (Unique 100%, 1).

### Champignon toxique ambulant

* **Niveau conseillé :** 2 | **Comportement :** Nuage toxique passif.
* **Lore :** Variante toxique du champignon marcheur.
* **Stats :** PV **18** | Force **6** | Dextérité **3** | Vitalité **10** | Résistance : **Poison** | Faiblesse : **Feu**
* **Attaques :**
* *Coup toxique* (4-6) : Inflige Poison.
* *Nuage passif* (1/tour) : Dégâts de zone continus à proximité.


* **Butin :** Spore toxique (Alchimie, Peu commun 45%, 1-2).

### Cristal vivant (élémental mineur)

* **Niveau conseillé :** 4 | **Comportement :** Immobile, réagit à la magie.
* **Spécial :** Intelligence 8
* **Lore :** Formation minérale animée par une énergie mystérieuse.
* **Stats :** PV **40** | Force **10** | Dextérité **5** | Vitalité **16** | Résistance : **Physique / Magie** | Faiblesse : **Choc / Percussion**
* **Attaques :**
* *Décharge d'énergie* (7-10) : Dégâts magiques.
* *Résonance* (—) : Renforce sa résistance magique quelques tours.


* **Butin :** Éclat de cristal (Craft, Courant 70%, 1-2), Noyau énergétique (Craft, Rare 30%, 1).

---

## 🏘️ LE VILLAGE

Menaces et PNJ hostiles présents dans le village de départ du héros.

### Voleur de village

* **Niveau conseillé :** 1 | **Comportement :** Vole puis fuit, évite le combat.
* **Lore :** Opportuniste profitant du désordre pour multiplier les larcins.
* **Stats :** PV **14** | Force **6** | Dextérité **12** | Vitalité **7** | Résistance : **—** | Faiblesse : **—**
* **Attaques :**
* *Coup de dague* (3-5) : Dégâts physiques.
* *Vol à la tire* (—) : Tente de dérober un objet avant de fuir.


* **Butin :** Objets volés (Revente, Courant 70%, 1), Or (Monnaie, Courant 70%, 4-10 po).

### Loup enragé infiltré

* **Niveau conseillé :** 2 | **Comportement :** Attaque de nuit, isolé de sa meute.
* **Lore :** S'aventure la nuit dans le village, comportement anormal et inquiétant.
* **Stats :** PV **20** | Force **9** | Dextérité **13** | Vitalité **9** | Résistance : **—** | Faiblesse : **Feu**
* **Attaques :**
* *Morsure enragée* (5-8) : Dégâts physiques.
* *Attaque surprise* (+2) : Bonus de dégâts en cas d'attaque nocturne.


* **Butin :** Fourrure enragée (Craft, Peu commun 45%, 1).

### Corbeau espion

* **Niveau conseillé :** 1 | **Comportement :** Observe et fuit pour faire son rapport.
* **Lore :** Familier discret d'un ennemi inconnu.
* **Stats :** PV **10** | Force **3** | Dextérité **14** | Vitalité **5** | Résistance : **—** | Faiblesse : **—**
* **Attaques :**
* *Coup de bec* (1-3) : Dégâts mineurs.
* *Fuite et rapport* (—) : S'enfuit rapidement.


* **Butin :** Plume noire (Alchimie, Peu commun 45%, 1-2).

### Garde corrompu

* **Niveau conseillé :** 2 | **Comportement :** Semble loyal mais trahit au pire moment.
* **Lore :** Soudoyé, il facilite les activités criminelles dans le village.
* **Stats :** PV **26** | Force **10** | Dextérité **8** | Vitalité **11** | Résistance : **Physique léger (armure)** | Faiblesse : **—**
* **Attaques :**
* *Coup d'épée de garde* (6-9) : Dégâts physiques.
* *Trahison* (—) : Attaque surprise si sa couverture est découverte.


* **Butin :** Armure de garde (Armure, Peu commun 45%, 1 - Torse), Or (Monnaie, Courant 70%, 4-10 po).

### Cultiste mineur

* **Niveau conseillé :** 2 | **Comportement :** Invoque ou soutient ses alliés.
* **Spécial :** Sagesse 11
* **Lore :** Membre d'une secte liée aux véritables origines des troubles.
* **Stats :** PV **18** | Force **6** | Dextérité **8** | Vitalité **8** | Résistance : **Magie sombre** | Faiblesse : **Sacré**
* **Attaques :**
* *Rituel mineur* (4-7) : Dégâts magiques.
* *Invocation* (—) : Peut appeler un allié en renfort.


* **Butin :** Amulette sombre (Collier, Peu commun 45%, 1), Grimoire de cultiste (Arme Mage Noir, Rare 30%, 1).

### Chien sauvage

* **Niveau conseillé :** 1 | **Comportement :** Meute, agressif si affamé.
* **Lore :** Chiens domestiques retournés à l'état sauvage en périphérie.
* **Stats :** PV **12** | Force **6** | Dextérité **11** | Vitalité **7** | Résistance : **—** | Faiblesse : **—**
* **Attaques :**
* *Morsure* (3-5) : Dégâts physiques.
* *Attaque de meute* (+1 par allié) : Bonus de contournement.


* **Butin :** Croc de chien (Craft, Courant 70%, 1-2), Peau (Craft, Courant 70%, 1).

---

## 👑 BOSS DU CHAPITRE 1

### Chef gobelin du campement *(Boss Intermédiaire)*

* **Niveau conseillé :** 5 | **Zone :** Grotte
* **Lore :** À la tête du campement, il coordonne les raids. Le vaincre décapite l'organisation locale.
* **Stats :** PV **70** | Force **15** | Dextérité **10** | Vitalité **14** | Résistance : **Physique léger** | Faiblesse : **Feu**
* **Attaques :**
* *Coup d'arme de chef* (10-15) : Dégâts physiques lourds.
* *Cri de guerre* (—) : Buff de dégâts pour tous les gobelins alliés proches.


* **Butin garanti (100%) :** Couronne gobeline, Arme de chef, Or important.

### Reine-araignée *(Boss Final)*

* **Niveau conseillé :** 7 | **Zone :** Grotte
* **Lore :** Souveraine du nid, véritable cause de l'infestation d'araignées de la région. Défend sa progéniture avec acharnement.
* **Stats :** PV **110** | Force **14** | Dextérité **15** | Vitalité **16** | Résistance : **Poison, Toile** | Faiblesse : **Feu**
* **Attaques :**
* *Morsure royale* (12-18) : Poison puissant.
* *Ponte* (—) : Invoque 2 araignées supplémentaires toutes les quelques tours.


* **Butin garanti (100%) :** Glande royale, Soie précieuse, Œuf de reine (objet rare).

---

## 🔠 INDEX ALPHABÉTIQUE COMPLET (43 Entités)

| Nom de l'entité | Catégorie / Zone |
| --- | --- |
| Araignée géante | Grotte |
| Araignée géante cracheuse de venin | Grotte |
| Bandit chef de bande / brute | Ruines |
| Bandit pillard | Ruines |
| Bandit pillard archer | Ruines |
| Champignon marcheur (Myconide) | Forêt |
| Champignon toxique ambulant | Grotte |
| Chauve-souris | Ruines / Grotte |
| Chef gobelin du campement | Grotte (Boss) |
| Chien sauvage | Village |
| Corbeau espion | Village |
| Corbeau maudit | Forêt |
| Cristal vivant (élémental mineur) | Grotte |
| Cultiste mineur | Village |
| Demi-Orc | Race jouable |
| Elfe | Race jouable |
| Esprit follet (Wisp errant) | Ruines |
| Fantôme d'officier | Ruines |
| Garde corrompu | Village |
| Gobelin archer | Grotte |
| Gobelin chaman | Grotte |
| Gobelin éclaireur | Forêt / Grotte |
| Gobelin ravageur | Grotte |
| Humain | Race jouable |
| Liane étrangleuse | Forêt |
| Loup alpha | Forêt |
| Loup enragé infiltré | Village |
| Loup gris | Forêt |
| Loup-garou | Forêt |
| Lutin farceur (Sprite) | Forêt |
| Mage (Mutation rare) | Race jouable |
| Nain | Race jouable |
| Ours des bois | Forêt |
| Rat géant des décombres | Ruines |
| Reine-araignée | Grotte (Boss final) |
| Sanglier sauvage | Forêt |
| Serpent des bois | Forêt |
| Squelette archer | Ruines |
| Squelette soldat | Ruines |
| Troll des cavernes | Grotte |
| Ver des cavernes | Grotte |
| Voleur de village | Village |
| Zombie de garnison | Ruines |