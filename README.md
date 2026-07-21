# JDR — Le Début d'une Épopée

RPG tactique narratif avec combat au tour par tour sur grille, et un MJ IA qui anime les affrontements en temps réel. Développé en TypeScript, testé en web local avant portage Steam.

## 📁 Structure du projet
JDR/
├── client/          # Frontend (Vite + TypeScript)
├── server/          # Backend (Node + TypeScript + Prisma)
├── docs/            # Codex de référence (PDF) : bestiaire, classes, équipement, craft, compagnons
├── README.md
└── .gitignore

## 🛠️ Stack technique

- **Langage** : TypeScript de bout en bout (client + serveur)
- **Frontend** : Vite
- **Backend** : Node.js + tsx
- **Base de données** : SQLite (dev local, sans serveur à installer), via Prisma comme ORM
- **Agent MJ** (à venir) : API Claude (Anthropic)

## 🚀 Lancer le projet en local

### Client
```bash
cd client
npm install
npm run dev
```
→ accessible sur `http://localhost:5173`

### Serveur
```bash
cd server
npm install
npm run dev
```
→ affiche `Serveur JDR — prêt.` dans le terminal

### Base de données
```bash
cd server
npx prisma migrate dev --name init
npx prisma studio   # interface visuelle pour explorer la base
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
