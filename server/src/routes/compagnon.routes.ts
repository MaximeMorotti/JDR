import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import { ErreurValidation, validerCompagnon, validerEquipeModifiable } from "../services/validation.service";

export const compagnonRouter = Router({ mergeParams: true });

/**
 * GET /api/equipes/:equipeId/compagnons-disponibles
 * Liste tous les compagnons avec un indicateur "accessible" selon la composition actuelle
 * de l'équipe. Ne cache jamais un compagnon — l'UI doit pouvoir montrer pourquoi il est bloqué.
 */
compagnonRouter.get("/compagnons-disponibles", async (req, res) => {
  // `equipeId` provient du segment dynamique du routeur parent (mergeParams) — Express ne le
  // type pas automatiquement sur req.params ici, d'où le cast explicite.
  const { equipeId } = req.params as { equipeId: string };
  const [compagnons, personnages] = await Promise.all([
    prisma.compagnonRef.findMany({ include: { classesLiees: { include: { classe: true } }, raceRequise: true } }),
    prisma.personnage.findMany({ where: { equipeId } }),
  ]);

  const resultat = compagnons.map((c) => {
    const raceOk = !c.raceRequiseId || personnages.some((p) => p.raceId === c.raceRequiseId);
    const classesRequises = c.classesLiees.map((cl) => cl.classeId);
    const classeOk = classesRequises.length === 0 || personnages.some((p) => classesRequises.includes(p.classeId));
    return { ...c, accessible: raceOk && classeOk };
  });

  res.json(resultat);
});

const choisirCompagnonSchema = z.object({
  compagnonId: z.string().min(1),
});

/** POST /api/equipes/:equipeId/compagnon — choisit le compagnon de l'équipe (un seul, prérequis vérifiés). */
compagnonRouter.post("/compagnon", async (req, res) => {
  const { equipeId } = req.params as { equipeId: string };
  const parsed = choisirCompagnonSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ erreur: parsed.error.issues[0]?.message });
  }

  try {
    await validerEquipeModifiable(equipeId);
    await validerCompagnon(equipeId, parsed.data.compagnonId);
    const compagnonEquipe = await prisma.compagnonEquipe.create({
      data: { equipeId, compagnonId: parsed.data.compagnonId },
      include: { compagnon: true },
    });
    res.status(201).json(compagnonEquipe);
  } catch (e) {
    if (e instanceof ErreurValidation) {
      return res.status(400).json({ erreur: e.message });
    }
    throw e;
  }
});

/** DELETE /api/equipes/:equipeId/compagnon — retire le compagnon de l'équipe. */
compagnonRouter.delete("/compagnon", async (req, res) => {
  const { equipeId } = req.params as { equipeId: string };
  try {
    await validerEquipeModifiable(equipeId);
    await prisma.compagnonEquipe.delete({ where: { equipeId } });
    res.status(204).send();
  } catch (e) {
    if (e instanceof ErreurValidation) {
      return res.status(400).json({ erreur: e.message });
    }
    throw e;
  }
});

const renommerCompagnonSchema = z.object({
  pseudo: z.string().trim().min(1, "Le pseudo est requis.").max(40),
});

/** PATCH /api/equipes/:equipeId/compagnon — donne un pseudo au compagnon de l'équipe. */
compagnonRouter.patch("/compagnon", async (req, res) => {
  const { equipeId } = req.params as { equipeId: string };
  const parsed = renommerCompagnonSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ erreur: parsed.error.issues[0]?.message });
  }
  try {
    await validerEquipeModifiable(equipeId);
    const compagnonEquipe = await prisma.compagnonEquipe.update({
      where: { equipeId },
      data: { pseudo: parsed.data.pseudo },
      include: { compagnon: true },
    });
    res.json(compagnonEquipe);
  } catch (e) {
    if (e instanceof ErreurValidation) {
      return res.status(400).json({ erreur: e.message });
    }
    if (e instanceof Error && "code" in e && (e as { code?: string }).code === "P2025") {
      return res.status(404).json({ erreur: "Aucun compagnon choisi pour cette équipe." });
    }
    throw e;
  }
});
