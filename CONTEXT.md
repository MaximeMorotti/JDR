# Le Début d'une Épopée

RPG tactique narratif avec combat au tour par tour sur grille et un MJ IA (à venir, Sprint 5). Ce
glossaire couvre le vocabulaire du domaine de jeu — pour la stack technique et les décisions déjà
tranchées, voir `CLAUDE.md`.

## Language

**Obstacle** :
Élément de décor sur une case de grille de combat, doté de PV et d'un état franchissable ou non.
Modélisé comme un type générique — pas de catégories figées en base (voir ADR-0001).
_Avoid_: Décor, mur (trop spécifique — un mur n'est qu'un preset de PV parmi d'autres)

**Franchissement** :
Tentative de traverser une case d'obstacle sans le détruire, résolue par un jet de dé
(d20 + Dextérité + interaction raciale − malus de l'obstacle) contre un seuil.
_Avoid_: Passage, traversée

**Destruction (d'obstacle)** :
Tentative de réduire les PV d'un obstacle à 0 pour libérer la case, résolue par un jet de dé
(d20 + Force) contre un seuil de résistance.

**Case Tranchée** :
Case de terrain spécial creusée par un Nain (matérialisation du nœud de compétence "Creuser une
tranchée"), jamais bloquante pour aucune race, mais coûtant un déplacement double aux non-Nains et
offrant protection aux dégâts et visibilité réduite au seul Nain qui s'y trouve.
_Avoid_: Case Souterrain (nom de travail abandonné)

**Interaction raciale d'obstacle** :
Bonus, malus ou neutralité qu'une race applique à son jet de franchissement selon le type de défi
(passage étroit vs franchissement en hauteur) — indépendant de la catégorie de décor de l'obstacle,
et cumulable avec d'autres règles raciales (ex : l'esquive Elfe sur les obstacles légers).

**Portée d'attaque** :
Distance maximale, en cases, à laquelle un personnage peut cibler un ennemi sans se déplacer. Pour
les créatures du Bestiaire, une donnée propre (`MELEE`/`DISTANCE`) indépendante du déplacement ;
pour les personnages joueurs, en attendant le vrai moteur d'arme du Sprint 3, un placeholder qui
réutilise la portée de déplacement.
_Avoid_: Portée de déplacement (mesure la mobilité, pas l'attaque — les deux ne sont confondues que
temporairement côté joueur, jamais côté ennemi)
