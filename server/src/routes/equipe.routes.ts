import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";

export const equipeRouter = Router();

const creerEquipeSchema = z.object({
  nom: z.string().trim().min(1, "Le nom de l'équipe est requis."),
});

/** POST /api/equipes — crée une équipe avec 100 po de budget de départ. */
equipeRouter.post("/", async (req, res) => {
  const parsed = creerEquipeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ erreur: parsed.error.issues[0]?.message });
  }
  const equipe = await prisma.equipe.create({ data: { nom: parsed.data.nom } });
  res.status(201).json(equipe);
});

/** GET /api/equipes — liste des équipes (écran d'accueil : créer ou charger). */
equipeRouter.get("/", async (_req, res) => {
  const equipes = await prisma.equipe.findMany({
    orderBy: { createdAt: "desc" },
    include: { personnages: true, compagnonEquipe: { include: { compagnon: true } } },
  });
  res.json(equipes);
});

/** GET /api/equipes/:id — équipe complète (personnages, inventaires, compagnon). */
equipeRouter.get("/:id", async (req, res) => {
  const equipe = await prisma.equipe.findUnique({
    where: { id: req.params.id },
    include: {
      personnages: {
        include: {
          race: true,
          classe: { include: { categoriesArmesAutorisees: true } },
          specialisation: true,
          inventaire: { include: { objet: true } },
        },
      },
      compagnonEquipe: { include: { compagnon: true } },
    },
  });
  if (!equipe) {
    return res.status(404).json({ erreur: "Équipe introuvable." });
  }
  res.json(equipe);
});

/** DELETE /api/equipes/:id — supprime une équipe (cascade sur personnages/inventaire/compagnon). */
equipeRouter.delete("/:id", async (req, res) => {
  await prisma.equipe.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

/**
 * POST /api/equipes/:id/demarrer-aventure
 * Verrouille définitivement l'équipe (validation du récap "Jouer" côté client) — idempotent.
 */
equipeRouter.post("/:id/demarrer-aventure", async (req, res) => {
  const equipe = await prisma.equipe.update({
    where: { id: req.params.id },
    data: { aventureCommencee: true },
  });
  res.json(equipe);
});
