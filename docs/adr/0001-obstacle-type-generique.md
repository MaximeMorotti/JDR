# Obstacle modélisé comme type générique plutôt que catégories figées

Le plan de grille de combat (`vibe/design/plan_grille_combat.md`) proposait initialement 4
catégories figées d'obstacle (bas/léger, en hauteur, mur épais, infranchissable de zone), chacune
avec sa propre franchissabilité et sa plage de PV en base. On a tranché pour un type générique
unique où PV, franchissabilité et malus sont des nombres libres par instance — les anciennes
catégories ne survivent que comme presets de PV suggérés à la pose (5/25/50), pas comme un champ
`categorie` figé. Raison : le contenu réel (quels obstacles existeront dans quelles zones) n'est pas
encore connu, et un schéma figé aurait forcé à anticiper toutes les variantes à l'avance ; le
générique laisse cette liberté sans bloquer la mécanique de jet (Franchir/Détruire), qui ne dépend
que des nombres de l'instance, jamais de sa catégorie.
