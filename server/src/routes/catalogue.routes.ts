import { Router } from "express";
import { prisma } from "../db";

export const catalogueRouter = Router();

/** GET /api/catalogue/races — races avec leurs 8 caractéristiques de base. */
catalogueRouter.get("/races", async (_req, res) => {
  const races = await prisma.raceRef.findMany({ orderBy: { nom: "asc" } });
  res.json(races);
});

/** GET /api/catalogue/classes — classes, avec les races autorisées (+ info "déconseillé"). */
catalogueRouter.get("/classes", async (_req, res) => {
  const classes = await prisma.classeRef.findMany({
    orderBy: { nom: "asc" },
    include: {
      racesAutorisees: { include: { race: true } },
      categoriesArmesAutorisees: true,
    },
  });
  res.json(classes);
});

/** GET /api/catalogue/classes/:classeId/specialisations — spécialisations d'une classe. */
catalogueRouter.get("/classes/:classeId/specialisations", async (req, res) => {
  const specialisations = await prisma.specialisationRef.findMany({
    where: { classeId: req.params.classeId },
    orderBy: { nom: "asc" },
  });
  res.json(specialisations);
});

/**
 * GET /api/catalogue/objets?type=&categorie=&palier=&origine=
 * Catalogue filtrable. Pour la boutique du Sprint 1, filtrer avec palier=COMMUN&origine=ACHAT_VILLAGE
 * côté client (le stuff SPAWN_GRATUIT du Mage n'est jamais renvoyé comme achetable).
 */
catalogueRouter.get("/objets", async (req, res) => {
  const { type, categorie, palier, origine } = req.query;
  const objets = await prisma.objetRef.findMany({
    where: {
      type: typeof type === "string" ? type : undefined,
      categorie: typeof categorie === "string" ? categorie : undefined,
      palier: typeof palier === "string" ? palier : undefined,
      origine: typeof origine === "string" ? origine : undefined,
    },
    orderBy: { nom: "asc" },
  });
  res.json(objets);
});

/** GET /api/catalogue/compagnons — compagnons avec leurs prérequis (classe(s) et/ou race). */
catalogueRouter.get("/compagnons", async (_req, res) => {
  const compagnons = await prisma.compagnonRef.findMany({
    orderBy: { nom: "asc" },
    include: { classesLiees: { include: { classe: true } }, raceRequise: true },
  });
  res.json(compagnons);
});
