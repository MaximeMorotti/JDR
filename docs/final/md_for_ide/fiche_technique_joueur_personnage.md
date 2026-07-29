# FICHE TECHNIQUE — JOUEUR / PERSONNAGE
**Document de conception — Modèle de données du personnage jouable**

> **Note :** La Race et la Classe choisies à la création du personnage déterminent des plages de valeurs (Taille, Poids, Caractéristiques de départ) ainsi que les emplacements d'équipement autorisés. Voir la section "Restrictions liées à la Classe" en fin de document.

---

## Table des matières
1. [Identité](#1-identité)
2. [Statistiques vitales](#2-statistiques-vitales)
3. [Caractéristiques (Compétences)](#3-caractéristiques-compétences)
4. [Progression](#4-progression)
5. [Équipement](#5-équipement)
   - 5.1 [Armure](#51-armure)
   - 5.2 [Armes / Arsenal](#52-armes--arsenal)
6. [Inventaire](#6-inventaire)
7. [Compagnon / Familier (optionnel)](#7-compagnon--familier-optionnel)
8. [Métadonnées techniques](#8-métadonnées-techniques)
9. [Restrictions liées à la Classe (exemple à compléter)](#9-restrictions-liées-à-la-classe-exemple-à-compléter)

---

## 1. Identité

| Champ | Type | Description |
|---|---|---|
| **Pseudo** | `str` | Nom affiché du joueur / personnage |
| **Classe** | `str` | Ex : Guerrier, Mage, Voleur, Archer, Barde... — verrouille certaines stats/équipements |
| **Race** | `str` | Ex : Humain, Elfe, Nain, Orc... — influence les plages Taille/Poids/Carac de base |
| **Genre** | `str` | Optionnel selon le design |
| **Age** | `int` | Peut influencer légèrement les stats de départ (option) |
| **Alignement** | `str` | Ex : Loyal Bon, Neutre, Chaotique Mauvais (optionnel, ambiance narrative) |
| **Taille** | `float` | En cm — plage définie par Race/Classe |
| **Poids** | `float` | En kg — plage définie par Race/Classe |
| **Origine** | `str` | Ville/région natale (optionnel, narratif) |

---

## 2. Statistiques vitales

| Champ | Type | Description |
|---|---|---|
| **Point de Vie (Pv)** | `int` | Vie actuelle / vie max |
| **Faim** | `int` | Descend avec le temps, impacte les PV si à 0 |
| **Soif** | `int` | Idem Faim, complémentaire |
| **Endurance / Stamina** | `int` | Consommée par course, esquive, attaques |
| **Mana / Énergie** | `int` | Utile seulement pour les classes à sorts (Mage, Druide...) |
| **Niveau** | `int` | Niveau global du personnage |
| **Expérience (Xp)** | `int` | Points cumulés avant passage au niveau suivant |
| **Statuts actifs** | `liste` | Ex : Empoisonné, Brûlé, Gelé, Étourdi, Régénération... |

---

## 3. Caractéristiques (Compétences)

| Champ | Type | Description |
|---|---|---|
| **Dextérité** | `int` | Précision, esquive, vitesse d'attaque |
| **Force** | `int` | Dégâts physiques, capacité de charge |
| **Vitalité** | `int` | PV max, régénération |
| **Charisme** | `int` | Prix marchands, dialogues, réactions PNJ |
| **Intelligence** | `int` | Dégâts magiques, mana max |
| **Sagesse** | `int` | Résistance magique, régénération de mana |
| **Chance** | `int` | Taux de critique, qualité des loots |
| **Perception** | `int` | Détection pièges/ennemis cachés/objets rares |

> **Note :** Les valeurs de départ de ces caractéristiques doivent être définies par une plage (min-max) propre à chaque combinaison Race + Classe, plutôt qu'une valeur fixe unique.

---

## 4. Progression

| Champ | Type | Description |
|---|---|---|
| **Points de compétence non alloués** | `int` | À distribuer manuellement par le joueur en montant de niveau |
| **Titre** | `str` | Ex : Novice, Aventurier, Chevalier, Légende... |
| **Arbre de compétences débloqué** | `liste` | Compétences/sorts actifs et passifs obtenus |

---

## 5. Équipement

### 5.1 Armure

| Champ | Type | Description |
|---|---|---|
| **Tête** | `objet` | Casque, capuche, couronne... |
| **Collier** | `objet` | Amulette, pendentif |
| **Torse** | `objet` | Plastron, tunique, robe |
| **Bras** | `objet` | Brassard/manche — un seul achat/équipement couvre les deux bras à la fois (fusion de "Bras Gauche"/"Bras Droit", décision Sprint 1 : voir écart CLAUDE.md) |
| **Anneau (x2)** | `objet[2]` | 2 emplacements disponibles |
| **Bracelet (x2)** | `objet[2]` | 2 emplacements disponibles |
| **Bas** | `objet` | Jambières, pantalon |
| **Pied** | `objet` | Bottes, sandales |
| **Ceinture** | `objet` | Emplacement supplémentaire recommandé |
| **Cape** | `objet` | Emplacement supplémentaire recommandé |

### 5.2 Armes / Arsenal

| Champ | Type | Description |
|---|---|---|
| **Main Droite** | `objet` | Arme principale (épée, bâton, dague...) |
| **Main Gauche** | `objet` | Arme secondaire ou bouclier |
| **Carquois / Sac de munitions** | `objet` | Réservé aux classes à distance (Archer) ou arme de lancé |

> **Note :** Main Droite et Main Gauche restent deux emplacements séparés (contrairement à Bras ci-dessus) : ce sont des objets fonctionnellement différents (arme principale vs arme secondaire/bouclier), pas une paire symétrique — les fusionner empêcherait d'équiper une arme ET un bouclier simultanément.

> **Note :** Chaque objet d'équipement pourrait avoir ses propres sous-attributs : Durabilité (`int`), Rareté (`str`: commun/rare/épique/légendaire), Bonus de statistiques (`liste`), Niveau requis (`int`).

---

## 6. Inventaire

| Champ | Type | Description |
|---|---|---|
| **Sac à dos** | `liste` | Objets transportés avec quantité + poids max total |
| **Or/Monnaie** | `int` | Monnaie du jeu |
| **Potions actives** | `liste` | Potions consommables en possession |
| **Objets clés de quête** | `liste` | Objets liés à la progression scénaristique |

---

## 7. Compagnon / Familier (optionnel)

| Champ | Type | Description |
|---|---|---|
| **Nom du compagnon** | `str` | Selon classe (ex : Druide, Rôdeur) — Optionnel |
| **Type** | `str` | Ex : Loup, Faucon, Élémentaire |
| **Niveau du compagnon** | `int` | Peut évoluer indépendamment ou lié au joueur |
| **Lien/Loyauté** | `int` | Optionnel, influence les bonus donnés |

---

## 8. Métadonnées techniques

| Champ | Type | Description |
|---|---|---|
| **ID unique joueur** | `str`/`int` | Identifiant interne pour la sauvegarde/BDD |
| **Timestamp de création** | `datetime` | Date/heure de création du personnage |
| **Version de sauvegarde** | `str` | Utile pour gérer les migrations de save entre versions du jeu |

---

## 9. Restrictions liées à la Classe (exemple à compléter)

> **Note :** Tableau d'exemple à titre indicatif à adapter selon les classes réellement présentes dans ton jeu. L'idée est que la Classe choisie verrouille/débloque certains emplacements d'équipement et certaines plages de caractéristiques.

| Classe | Armure lourde | Bouclier | Sorts/Mana | Carquois |
|---|---|---|---|---|
| **Guerrier** | Oui | Oui | Non | Non |
| **Mage** | Non | Non | Oui | Non |
| **Voleur** | Non | Non | Non | Non |
| **Archer** | Non | Non | Non | Oui |
| **Druide** | Non | Non | Oui | Non |

---

*Document généré comme base de travail à ajuster librement selon l'avancée de la conception.*
