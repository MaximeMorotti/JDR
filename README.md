# JDR — Le Début d'une Épopée

RPG tactique narratif avec combat au tour par tour sur grille, et un MJ IA qui anime les affrontements en temps réel. Développé en TypeScript, testé en web local avant portage Steam.

## 📁 Structure du projet
JDR/
├── client/          # Frontend (Vite + TypeScript)
├── server/          # Backend (Node + TypeScript + Prisma)
├── docs/            # Codex de référence : bestiaire, classes, équipement, craft, compagnons
├── vibe/            # Plans de sprint, briefs de conception (implémentation + visuel)
├── demarrer.bat     # Lance client + serveur en un clic (Windows)
├── CLAUDE.md        # Contexte projet (règles de jeu, conventions, écarts documentés)
├── README.md
└── .gitignore

## 🛠️ Stack technique

- **Langage** : TypeScript strict de bout en bout (client + serveur)
- **Frontend** : Vite, vanilla TS (pas de framework)
- **Backend** : Node.js + Express + tsx
- **Base de données** : SQLite (dev local, sans serveur à installer), via Prisma comme ORM
- **Agent MJ** (à venir, Sprint 5) : API Claude (Anthropic), côté serveur uniquement

## 🚀 Lancer le projet en local

### Démarrage rapide (Windows)

Double-cliquer sur **`demarrer.bat`** à la racine du projet : ouvre le serveur et le client
chacun dans sa propre fenêtre de terminal. Nécessite d'avoir déjà installé les dépendances une
première fois (voir ci-dessous) et la base de données initialisée.

### Installation initiale (à faire une seule fois)

```bash
cd server
npm install
npx prisma migrate dev   # crée la base SQLite et applique les migrations
npx prisma db seed       # peuple le catalogue (races, classes, objets, compagnons)

cd ../client
npm install
```

### Lancer manuellement (si besoin d'un contrôle plus fin)

**Serveur** (API, `http://localhost:3000`) :
```bash
cd server
npm run dev
```

**Client** (interface web, `http://localhost:5173`) :
```bash
cd client
npm run dev
```

### Base de données

```bash
cd server
npx prisma migrate dev --name <nom_de_la_migration>
npx prisma db seed        # à relancer après toute modification de prisma/seed.ts
npx prisma studio          # interface visuelle pour explorer la base
```

## 📋 Roadmap

Le développement est découpé en sprints. Voir [`docs/Roadmap_Sprints.md`](docs/Roadmap_Sprints.md) pour le détail complet des user stories et features de chaque étape.

- [x] **Sprint 0** — Fondations techniques (structure du repo, Vite + TS, Prisma + SQLite)
- [ ] **Sprint 1** — Création de personnage de A à Z
- [ ] **Sprint 2** — Déplacement sur la carte de combat (grille octogonale, obstacles)
- [ ] **Sprint 3** — Combat contre des mobs
- [ ] **Sprint 4** — Équipement, craft et compagnons
- [ ] **Sprint 5** — Agent MJ IA

## 📚 Documentation de jeu (`docs/`)

- Bestiaire — Chapitre 1 (races, créatures, stats, attaques, loot)
- Codex des Classes (7 classes, 38 spécialisations)
- Codex de l'Équipement (armes, armures, accessoires)
- Répertoire de Craft
- Codex des Compagnons

## ⚠️ Notes

- Les fichiers `.env` (clés API, secrets) et les bases `.db` locales ne sont **jamais** commit — voir `.gitignore`
- Les assets lourds (images, `.docx`) sont exclus du repo ; seuls les PDF finaux sont versionnés
