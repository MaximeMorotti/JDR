# CODEX DE L'ÉQUIPEMENT : Armes, armures et accessoires
**Le Début d'une Épopée - Chapitre 1 - Document de référence**

## Introduction et règles économiques
Ce codex répertorie tout l'équipement disponible durant le chapitre 1 : armes, boucliers, armures et accessoires. Chaque objet suit un système à quatre paliers, cohérent avec le Codex des Classes et le bestiaire :

| Palier | Obtention | Logique |
|---|---|---|
| **Commun** | Achat au village | Équipement de départ, accessible dès la création |
| **Rudimentaire** | Craft - Ingénieur | Fabriqué à partir de matériaux lootés sur la faune de la Forêt |
| **Gobelin** | Loot direct | Récupéré sur les ennemis humanoïdes des Ruines et de la Grotte |
| **Unique** | Loot de boss | Exemplaire unique, obtenu sur le Troll des cavernes, le Chef gobelin ou la Reine-araignée |

**Budget de départ :**
L'équipe dispose de 100 pièces d'or (po) au total pour 3 à 4 aventuriers au début de l'aventure. À titre de repère, un set complet de Tenue d'aventurier (Tête + Torse + Bras G + Bras D + Bas + Pied) coûte 25 po par personnage — soit l'intégralité du budget si toute l'équipe s'équipe entièrement. Les pièces s'achètent aussi à l'unité, ce qui force de vrais choix : armure complète pour deux personnages plutôt que légère pour quatre, ou armes plutôt qu'armures. Un personnage peut tout à fait commencer à mains nues et compter sur l'Ingénieur pour un craft en cours de route.
*Note : Le Mage ne peut équiper aucune pièce d'armure (malus selon la règle du Codex des Classes) — cela libère mécaniquement du budget pour le reste de l'équipe.*

**Munitions :**
Les munitions (flèches, hachettes de jet) sont incluses avec l'achat ou le loot du carquois : on ne les rachète pas séparément. Chaque carquois a une capacité totale plutôt qu'une limite par combat, pour ne pas alourdir la temporisation en jeu — un carquois vide se rapproche donc d'un point de gestion entre les combats plutôt que d'une contrainte tour par tour.

> **⚠️ Écart comblé — Classification du poids des armures :** le Codex des Classes interdit l'armure lourde à certaines classes (Mage, Berserker, Voleur/Barde/Chasseur sylvestre implicitement via "légère uniquement") mais **aucune pièce d'armure de ce codex n'était taguée par poids** (léger/moyen/lourd) dans le document source — ni dans le PDF, ni dans le Markdown d'origine. Une classification a été ajoutée ci-dessous par déduction du contexte narratif (matériau, provenance) pour rendre la règle applicable :
> - **Tenue d'aventurier (Commun)** → **Légère** (cuir bouilli/souple)
> - **Armure Rudimentaire (craft Ingénieur)** → **Légère** (fourrure/peau/écailles)
> - **Armure Gobelin (loot Ruines/Grotte)** → **Moyenne** (pièces d'ancien avant-poste militaire / carapace chitineuse)
> - **Armure Unique (loot boss)** → **Lourde** (trophées de boss, exosquelette royal renforcé)
>
> **Conséquence pour le Sprint 1 :** comme seul le palier **Commun** est achetable à la création (voir tableau des paliers ci-dessus), et que tout le palier Commun est classé **Légère**, la règle "pas d'armure lourde" ne peut, dans les faits, jamais être déclenchée ce sprint — aucune armure moyenne/lourde n'est disponible en boutique. Le champ `poids` doit néanmoins être modélisé dès maintenant dans le schéma (`ObjetRef.poidsArmure`) pour rester valide aux sprints suivants (craft/loot). À valider par le game design — voir `CLAUDE.md`.

> **⚠️ Écart comblé — Origine des objets, distincte du palier :** le palier "Commun" recouvre en réalité deux origines différentes qu'il ne faut pas confondre dans le catalogue : les objets **achetables en boutique** (prix en po) et le stuff **gratuit de spawn** du Mage (Bâton d'apprenti, Grimoire d'apprenti, Robe d'apprenti — voir plus bas), qui n'a pas de prix et n'apparaît jamais dans la boutique. Le modèle de données doit donc porter un champ `origine` séparé du `palier` : `ACHAT_VILLAGE | SPAWN_GRATUIT | LOOT | CRAFT`. Seuls `ACHAT_VILLAGE` (boutique) et `SPAWN_GRATUIT` (assigné automatiquement au Mage) sont pertinents pour le Sprint 1.

---

## Armes

### Armes légères (Guerrier, Voleur, Barde, Chasseur sylvestre)
| Palier | Nom | Obtention | Dégâts | Description |
|---|---|---|---|---|
| Commun | Dague simple | Achat village — 5 po | +1 | Simple lame courte forgée à la va-vite, l'arme de base de tout aventurier |
| Commun | Épée courte de milice | Achat village — 12 po | +2 | Épée standard des milices villageoises, fiable sans être impressionnante |
| Rudimentaire | Dague en croc de loup | Craft Ingénieur — 2× Croc de loup | +2 | Taillée à même un croc de loup, aussi tranchante qu'une lame forgée |
| Rudimentaire | Serpe en défense de sanglier | Craft Ingénieur — 1× Défense de sanglier + 1× Fibre végétale | +3 | Lame recourbée improvisée, étonnamment efficace |
| Gobelin | Épée rouillée | Loot Bandit pillard | +2 | Lame émoussée par l'usage, encore capable de blesser |
| Gobelin | Dague gobeline | Loot Gobelin éclaireur | +2 | Petite lame ébréchée à l'odeur âcre, artisanat gobelin typique |
| Gobelin | Lame de chef | Loot Bandit chef de bande | +4 | Meilleure facture que celle de ses hommes, signe de son rang |

### Armes lourdes (Guerrier, Berserker, Ingénieur)
| Palier | Nom | Obtention | Dégâts | Description |
|---|---|---|---|---|
| Commun | Épée de milice (2 mains) | Achat village — 20 po | +3 | Lame longue standard, lourde à manier sans entraînement |
| Commun | Marteau simple | Achat village — 15 po | +3 | Outil de chantier reconverti en arme, brut mais efficace |
| Rudimentaire | Massue en os d'ours | Craft Ingénieur — 1× Griffe d'ours + 1× Fourrure d'ours | +5 | Manche enroulé de fourrure, tête taillée dans un os d'ours massif |
| Gobelin | Hache ébréchée | Loot Gobelin ravageur | +4 | Émoussée par de nombreux combats, encore redoutable |
| Gobelin | Masse de garnison | Loot Zombie de garnison | +3 | Arme rouillée de l'ancien avant-poste, encore fonctionnelle |
| Unique | Massue de Troll | Loot Troll des cavernes (boss) | +8 | Bloc de pierre et de bois brut, chance d'étourdir la cible |
| Unique | Arme du Chef gobelin | Loot Chef gobelin (boss) | +7 | Ornée de trophées, insuffle une intimidation naturelle en combat |

### Boucliers — défensif (Guerrier, requis pour la spécialisation Paladin)
| Palier | Nom | Obtention | Défense | Description |
|---|---|---|---|---|
| Commun | Bouclier en bois | Achat village — 10 po | +1 | Planche renforcée de fer, le strict nécessaire pour parer |
| Rudimentaire | Bouclier en écailles | Craft Ingénieur — 2× Peau écailleuse | +2 | Plaques de serpent assemblées sur une armature légère |
| Gobelin | Bouclier de bandit | Loot Bandit chef de bande / brute | +2 | Renforcé de plaques de fer récupérées |

### Armes de jet (Voleur, Guerrier/Maître d'armes)
| Palier | Nom | Obtention | Dégâts | Description |
|---|---|---|---|---|
| Commun | Couteaux de lancer (lot de 3) | Achat village — 8 po | +1 chacun | Petites lames équilibrées, simples mais fiables |
| Rudimentaire | Dents de serpent empoisonnées | Craft Ingénieur — 1× Venin de serpent + 1× Peau écailleuse | +2 + poison léger | Dents montées sur de petites tiges, enduites de venin frais |
| Rudimentaire | Piquants de myconide | Craft Ingénieur — 1× Spore rare | +1 + confusion légère | Piquants séchés qui libèrent un nuage désorientant à l'impact |
| Gobelin | Hachette gobeline | Loot Gobelin archer | +3 | Petite hachette dissymétrique, taillée grossièrement |
| Gobelin | Éclat de cristal taillé | Craft Ingénieur — 1× Éclat de cristal (Grotte) | +3 + résonance magique légère | Fragment tranchant qui vibre faiblement au contact |
| Unique | Dard royal | Loot Reine-araignée (boss) | +5 + poison puissant | Extrait de l'aiguillon de la reine, encore chargé de venin |

### Armes à distance (Chasseur sylvestre)
| Palier | Nom | Obtention | Dégâts | Description |
|---|---|---|---|---|
| Commun | Arc court de chasse | Achat village — 18 po | +3 | Arc simple utilisé par les chasseurs du village |
| Rudimentaire | Arc renforcé | Craft Ingénieur — 1× Fibre végétale + 1× Sève rare | +4 | Corde tressée et bois gorgé de sève durcie |
| Gobelin | Arc de bandit | Loot Bandit pillard archer | +3 | Arc pillé, entretenu tant bien que mal |
| Gobelin | Arc gobelin | Loot Gobelin archer | +4 | Petit arc noueux, étonnamment précis entre de bonnes mains |

### Instruments (Barde)
| Palier | Nom | Obtention | Effet | Description |
|---|---|---|---|---|
| Commun | Luth simple | Achat village — 10 po | Soutien +1 | Instrument basique, un peu désaccordé mais honnête |
| Gobelin/rare | Flûte spectrale | Loot Fantôme d'officier | Soutien +3 + effet peur | Flûte d'os émettant une note glaçante |
| Gobelin/rare | Tambour gobelin | Loot Gobelin chaman | Soutien +2 | Peau tendue sur un cadre d'os, résonance tribale |

### Objets magiques (Mage — stuff verrouillé, sauf École Noire)
Le stuff magique du Mage reste fixe tout le chapitre 1, à une exception : l'École Noire peut remplacer son grimoire en affrontant le culte du village.

| Nom | Obtention | Effet | Description |
|---|---|---|---|
| Bâton d'apprenti | Spawn de départ | Dégâts magiques +2 | Bâton basique remis à tout jeune mage, encore imprégné d'une magie instable |
| Grimoire d'apprenti | Spawn de départ | +1 emplacement de sort | Recueil incomplet des sorts fondamentaux, annoté par son ancien propriétaire |
| Grimoire de cultiste (Mage Noir uniquement) | Loot Cultiste mineur (Village) | Remplace le Grimoire d'apprenti : dégâts magiques noirs +3, débloque un sort supplémentaire | Ouvrage relié de peau tannée, pages tachées d'un rituel inachevé |

### Outils / engins (Ingénieur)
| Palier | Nom | Obtention | Effet | Description |
|---|---|---|---|---|
| Commun | Pioche simple | Achat village — 12 po | Dégâts +2, bonus vs minéral | Outil de mineur, robuste et polyvalent |
| Gobelin/craft | Charge explosive rudimentaire | Craft Ingénieur — 1× Éclat de cristal + 1× Acide digestif (loot Ver des cavernes) | Dégâts de zone +6 | Fabriquée à partir de réactifs instables trouvés en grotte |

---

## Armures

### Tenue d'aventurier - Commun (25 po le set complet par personnage)
Les pièces restent achetables séparément (ex: juste le plastron à 8 po si le budget est serré) - c'est ce qui crée le vrai choix entre équipement complet pour deux personnages ou partiel pour quatre.

| Emplacement | Nom | Prix | Défense | Description |
|---|---|---|---|---|
| Tête | Casque en cuir | 4 po | +1 | Simple calotte de cuir bouilli |
| Torse | Plastron en cuir | 8 po | +2 | Pièce la plus protectrice du set, cuir épais cousu |
| Bras gauche | Brassard en cuir | 3 po | +1 | Protection légère de l'avant-bras |
| Bras droit | Brassard en cuir | 3 po | +1 | Identique, symétrique |
| Bas | Jambières en cuir | 5 po | +1 | Protège les jambes sans gêner la mobilité |
| Pied | Bottes de voyage | 2 po | +1 | Bottes solides, pensées pour la marche longue |
| **Total du set** | | **25 po** | **+7** | |

### Armure Rudimentaire (craft Ingénieur uniquement)
| Emplacement | Nom | Matériaux | Défense | Description |
|---|---|---|---|---|
| Tête | Casque en fourrure d'ours | 1x Fourrure d'ours | +2 | Épaisse fourrure protégeant crâne et nuque |
| Torse | Plastron en peau de sanglier | 1x Défense de sanglier + 1x Fibre végétale | +3 | Cuir épais renforcé de lanières végétales |
| Bras (G/D) | Brassard en peau écailleuse | 1x Peau écailleuse (par bras) | +1 chacun | Écailles de serpent cousues sur cuir souple |
| Pied | Bottes en peau de loup | 1x Peau de loup | +1 | Doublure chaude, bonne adhérence |

### Armure Gobelin (loot Ruines / Grotte)
| Emplacement | Nom | Obtention | Défense | Description |
|---|---|---|---|---|
| Tête | Casque de bandit | Loot Bandit pillard | +2 | Cabossé mais encore solide |
| Torse | Plastron de garnison | Loot Squelette soldat (Fragment d'armure) | +3 | Vestige rouillé de l'ancien avant-poste |
| Torse (alt) | Carapace d'araignée | Loot Araignée géante | +3 + résistance poison légère | Plaques chitineuses assemblées à la hâte |

### Armure Unique (loot boss)
| Emplacement | Nom | Obtention | Défense | Description |
|---|---|---|---|---|
| Tête | Trophée du Chef gobelin | Loot Chef gobelin (boss) | +4 + bonus d'intimidation | Casque orné de trophées de guerre |
| Torse | Carapace royale | Loot Reine-araignée (boss) | +6 + résistance poison forte | Fragment de l'exosquelette de la reine, traité et renforcé |

---

## Accessoires
Emplacements complémentaires de la fiche Joueur : Collier, Anneaux, Bracelets, Ceinture, Cape et Carquois.

### Collier
| Palier | Nom | Obtention | Effet | Description |
|---|---|---|---|---|
| Commun | Pendentif en bois | Achat village — 3 po | Charisme +1 | Petit médaillon gravé, porte-bonheur de voyageur |
| Rudimentaire | Collier de crocs | Craft Ingénieur — 1× Croc de loup + 1× Croc de chien | Force +1 | Trophée de chasse monté sur lanière |
| Gobelin | Amulette sombre | Loot Cultiste mineur (Village) | Intelligence +1 | Amulette tiède au toucher, gravée de symboles interdits |
| Unique | Pendentif de la Reine | Loot Reine-araignée (boss) | Résistance poison forte | Fragment durci de l'exosquelette royal, monté en pendentif |

### Anneaux (2 emplacements)
| Palier | Nom | Obtention | Effet | Description |
|---|---|---|---|---|
| Commun | Anneau en étain | Achat village — 5 po | Dextérité +1 | Anneau simple sans prétention |
| Rudimentaire | Anneau en griffe d'ours | Craft Ingénieur — 1× Griffe d'ours | Force +1 | Miniature de griffe sertie sur un anneau de fer |
| Gobelin | Anneau du chaman | Loot Gobelin chaman | Sagesse +1 | Anneau d'os gravé de runes tribales |
| Unique | Anneau du Chef | Loot Chef gobelin (boss) | Force +2, bonus intimidation | Anneau massif porté par le chef du campement |

### Bracelets (2 emplacements)
| Palier | Nom | Obtention | Effet | Description |
|---|---|---|---|---|
| Commun | Bracelet en cuir tressé | Achat village — 3 po | Dextérité +1 | Simple lanière tressée au poignet |
| Rudimentaire | Bracelet en écaille | Craft Ingénieur — 1× Peau écailleuse | Dextérité +1, résistance poison légère | Écailles cousues sur cuir souple |
| Gobelin | Bracelet de pillard | Loot Bandit pillard | Dextérité +1 | Pris sur un bandit, sans grande valeur mais utile |
| Unique | Bracelet spectral | Loot Fantôme d'officier | Résistance magique +2 | Semble à moitié immatériel au poignet |

### Ceinture
| Palier | Nom | Obtention | Effet | Description |
|---|---|---|---|---|
| Commun | Ceinture de cuir | Achat village — 4 po | +1 emplacement d'objet | Ceinture avec petite sacoche |
| Rudimentaire | Ceinture renforcée | Craft Ingénieur — 1× Fibre végétale + 1× Sève rare | +2 emplacements d'objet | Cuir doublé, plus grande capacité de rangement |
| Gobelin | Ceinture de pillard | Loot Bandit pillard archer | Porte-flèches intégré | Facilite le réapprovisionnement en munitions |

### Cape
| Palier | Nom | Obtention | Effet | Description |
|---|---|---|---|---|
| Commun | Cape de voyage | Achat village — 6 po | Résistance froid légère | Simple protection contre les intempéries |
| Rudimentaire | Cape en peau de loup | Craft Ingénieur — 1× Peau de loup | Résistance physique légère | Doublure chaude et discrète |
| Gobelin | Cape rapiécée | Loot Bandit chef de bande | Discrétion +1 | Idéale pour le Voleur, coupée pour ne pas gêner les mouvements |
| Unique | Cape de soie royale | Loot Reine-araignée (Soie précieuse) | Discrétion +2, résistance poison | Tissée dans la soie la plus fine du nid |

### Carquois / Sac de munitions (Chasseur sylvestre, Voleur/Lanceur)
Les munitions sont incluses avec le carquois et ne se rachètent pas séparément : seule la capacité totale varie d'un modèle à l'autre.

| Palier | Nom | Obtention | Capacité | Description |
|---|---|---|---|---|
| Commun | Carquois simple | Achat village — 5 po | 8 munitions | Carquois basique en cuir |
| Rudimentaire | Carquois renforcé | Craft Ingénieur — 2× Fibre végétale | 12 munitions | Meilleure tenue, rechargement plus rapide |
| Gobelin | Carquois gobelin | Loot Gobelin archer | 10 flèches + 4 hachettes de jet | Compatible flèches et petites hachettes de jet |

---

## Équipement spécifique du Mage — le lien avec le culte
Le Mage a un stuff verrouillé sur la majorité de ses emplacements, mais conserve une vraie progression narrative via le Torse et les accessoires, réservée à l'École Noire s'il choisit d'affronter le culte du village.

> **⚠️ Hors périmètre Sprint 1 — confirmé :** le Grimoire de cultiste, la Robe de cultiste, le Pendentif de cultiste et l'Anneau du pacte s'obtiennent tous en **vainquant le Cultiste mineur** (loot/quête) — un affrontement. Le Sprint 1 ne comporte aucun système de combat (prévu Sprint 3). Ces objets sont donc **indisponibles à la création de personnage**, qu'importe l'école choisie : ils ne doivent apparaître ni au spawn, ni en boutique. Tout Mage (École Noire incluse) démarre le Sprint 1 avec uniquement Bâton d'apprenti + Grimoire d'apprenti + Robe d'apprenti. L'UI de création peut afficher ces objets à titre indicatif ("débloqué en vainquant le Cultiste mineur — indisponible pour l'instant") mais ils ne doivent pas être sélectionnables.

| Emplacement | Nom | Obtention | Effet | Description |
|---|---|---|---|---|
| Torse | Robe d'apprenti | Spawn de départ (tous Mages) | Aucun bonus/malus | Simple tissu léger, ne protège pas mais n'entrave rien |
| Torse | Robe de cultiste (Mage Noir uniquement) | Loot/quête Cultiste mineur (Village) | Intelligence +2, Sagesse -1, résistance magie noire | Tissu sombre couvrant tout le corps, encore imprégné du rituel inachevé — remplace la Robe d'apprenti |
| Collier | Pendentif de cultiste (Mage Noir uniquement) | Loot Cultiste mineur | Intelligence +1 | Pendentif jumeau de l'Amulette sombre, réservé au rituel |
| Anneau | Anneau du pacte (Mage Noir uniquement) | Loot/quête Cultiste mineur | Intelligence +2, Sagesse -1 | Un pacte à double tranchant, cohérent avec le lore de l'École Noire |
