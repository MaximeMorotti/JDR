import { Router } from "express";
import { prisma } from "../db";

export const carteRouter = Router();

/**
 * Forme attendue de `Carte.jsonLayout` (Sprint 2, ticket #5) : reprend tel quel le type
 * `Obstacle` de `combat-test.ts` (ticket #2/#4, ADR-0001) — pas de catégorie figée en base,
 * seulement des nombres libres par instance.
 */
type ObstacleJson =
  | {
      x: number;
      y: number;
      categorie: "GENERIQUE";
      preset: "LEGER" | "MOYEN" | "LOURD";
      pv: number;
      franchissable: boolean;
      malusDexterite: number;
      axeInteraction: "ETROIT" | "HAUTEUR";
    }
  | { x: number; y: number; categorie: "INFRANCHISSABLE_ZONE" };

type CarteJsonLayout = {
  obstacles: ObstacleJson[];
  tranchees: { x: number; y: number }[];
};

/** GET /api/cartes/:id — dimensions et disposition (obstacles + tranchées) d'une carte. */
carteRouter.get("/:id", async (req, res) => {
  const carte = await prisma.carte.findUnique({ where: { id: req.params.id } });
  if (!carte) {
    return res.status(404).json({ erreur: "Carte introuvable." });
  }
  res.json({
    id: carte.id,
    nom: carte.nom,
    zoneLiee: carte.zoneLiee,
    largeur: carte.largeur,
    hauteur: carte.hauteur,
    layout: JSON.parse(carte.jsonLayout) as CarteJsonLayout,
  });
});
