# CLAUDE.md — Contexte permanent du projet JDR

Ce fichier est réinjecté à chaque prompt : il reste volontairement court. Le détail (règles de jeu,
arbitrages, roadmap) vit dans les fichiers pointés ci-dessous et n'est lu qu'à la demande.

## Le projet

RPG tactique narratif avec combat au tour par tour sur grille, et un MJ IA qui anime les affrontements
en temps réel. Nom de travail : "Le Début d'une Épopée" (chapitre 1).

## Stack technique (décidée et figée)

- **TypeScript strict** de bout en bout (client + serveur)
- **Client** : Vite, vanilla TS pour l'instant (pas de framework tant que ce n'est pas nécessaire)
- **Serveur** : Node + Express
- **Base de données** : SQLite en dev local, via **Prisma** comme ORM
- **Distribution finale visée** : Steam, via Tauri ou Electron une fois le cœur de jeu validé en web local (pas encore commencé)
- **Agent MJ** (futur, Sprint 5) : API Claude côté serveur uniquement, jamais côté client (sécurité des clés)

## Conventions de code

- Commentaires en français
- Pas de dépendance superflue (éviter d'ajouter une lib pour ce qu'on peut faire simplement)
- Toute règle de jeu (budget, restrictions de classe, etc.) doit être validée **côté serveur**, jamais seulement côté client
- Si un écart apparaît entre ce que dit la documentation et ce que le code implémente, le documenter dans `docs/ECARTS_ET_ARBITRAGES.md` — ne jamais corriger silencieusement un Codex

## Carte du projet

- **Codex canoniques du jeu (source de vérité des règles)** : `docs/final/md_for_ide/` — `fiche_technique_joueur_personnage.md`, `Codex_des_Classes.md`, `Codex_de_l_Equipement.md`, `Codex_des_Compagnons.md`, `Repertoire_de_Craft.md`, `Bestiaire_et_Races.md`. Toujours les consulter avant d'implémenter une mécanique, ne jamais halluciner une règle. Pour un fichier encore au format `.pdf` ou `.docx` (voir `docs/final/pdf/`, `docs/maj/`), demander à le convertir en `.md` d'abord — taux d'erreur élevé des agents en lisant un PDF/DOCX directement.
- **Règles de jeu clés et écarts doc/code déjà arbitrés avec l'utilisateur** : `docs/ECARTS_ET_ARBITRAGES.md` — à consulter avant de "corriger" un comportement qui semble contredire un Codex, il est peut-être déjà tranché.
- **Vocabulaire du domaine** : `CONTEXT.md`
- **Décisions d'architecture (ADR)** : `docs/adr/`
- **Propositions de design en cours de validation (pas une source de vérité figée, vérifier le statut en tête de fichier)** : `vibe/design/`
- **Roadmap et état des sprints** : `Roadmap_Sprints.md`

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`MaximeMorotti/JDR`), managed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), used as-is. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout (`CONTEXT.md` + `docs/adr/` at the repo root). See `docs/agents/domain.md`.
