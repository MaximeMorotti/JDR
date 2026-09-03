import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";
import {
  SEUIL_FRANCHISSEMENT,
  SEUIL_RESISTANCE,
  resoudreDestruction,
  resoudreFranchissement,
  type AxeInteractionObstacle,
  type PresetObstacle,
} from "../services/combat-resolution.service";
import { ErreurValidation } from "../services/validation.service";

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
      preset: PresetObstacle;
      pv: number;
      franchissable: boolean;
      malusDexterite: number;
      axeInteraction: AxeInteractionObstacle;
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

/** d20 non-biaisé — jamais généré à l'intérieur des fonctions pures de résolution (voir le module). */
function lancerD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

function distanceChebyshev(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

const positionSchema = z.object({ x: z.number().int(), y: z.number().int() });

const tentativeObstacleSchema = z.object({
  x: z.number().int(),
  y: z.number().int(),
  personnageId: z.string().min(1),
  /**
   * Position actuelle du personnage sur la grille, fournie par le client (pas de position
   * persistée côté serveur : le banc d'essai `combat-test.ts` reste une session locale, voir
   * CLAUDE.md). Confiance faite au client pour cette donnée — jeu solo local, aucune préoccupation
   * anti-triche (hors périmètre du ticket #1, section "Out of Scope").
   */
  personnagePosition: positionSchema,
});

/** Récupère la carte et l'obstacle ciblé, ou lève une `ErreurValidation` explicite. */
async function trouverObstacleCible(carteId: string, x: number, y: number) {
  const carte = await prisma.carte.findUnique({ where: { id: carteId } });
  if (!carte) {
    throw new ErreurValidation("Carte introuvable.");
  }
  const layout = JSON.parse(carte.jsonLayout) as CarteJsonLayout;
  const obstacle = layout.obstacles.find((o) => o.x === x && o.y === y);
  if (!obstacle) {
    throw new ErreurValidation(`Aucun obstacle en (${x}, ${y}).`);
  }
  return { carte, layout, obstacle };
}

/**
 * POST /api/cartes/:id/franchir
 * Tente de franchir un obstacle adjacent (§4-5) : d20 + Dextérité + interaction raciale − malus de
 * l'obstacle contre le seuil de franchissement. N'écrit rien en base (contrairement à `/detruire`) :
 * un franchissement ne change ni l'obstacle ni une position persistée — la case refusée ou le
 * déplacement du personnage restent gérés côté client, comme sa position (voir CLAUDE.md).
 */
carteRouter.post("/:id/franchir", async (req, res) => {
  const parsed = tentativeObstacleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ erreur: parsed.error.issues[0]?.message });
  }
  const { x, y, personnageId, personnagePosition } = parsed.data;

  try {
    const { obstacle } = await trouverObstacleCible(req.params.id, x, y);
    if (obstacle.categorie === "INFRANCHISSABLE_ZONE") {
      throw new ErreurValidation(`La case (${x}, ${y}) est infranchissable de zone.`);
    }
    if (!obstacle.franchissable) {
      throw new ErreurValidation(`L'obstacle en (${x}, ${y}) n'est pas franchissable — tente Détruire.`);
    }
    if (distanceChebyshev(personnagePosition, { x, y }) > 1) {
      throw new ErreurValidation(`Le personnage doit être adjacent à l'obstacle en (${x}, ${y}) pour le franchir.`);
    }

    const personnage = await prisma.personnage.findUniqueOrThrow({ where: { id: personnageId } });

    const resultat = resoudreFranchissement({
      d20: lancerD20(),
      dexterite: personnage.dexterite,
      raceId: personnage.raceId,
      axeInteraction: obstacle.axeInteraction,
      presetObstacle: obstacle.preset,
      malusDexterite: obstacle.malusDexterite,
    });

    res.json({ ...resultat, seuil: SEUIL_FRANCHISSEMENT, x, y });
  } catch (e) {
    if (e instanceof ErreurValidation) {
      return res.status(400).json({ erreur: e.message });
    }
    throw e;
  }
});

/**
 * POST /api/cartes/:id/detruire
 * Tente de détruire un obstacle adjacent (§5) : d20 + Force contre le seuil de résistance. Succès
 * = -5 PV fixes, persistés dans `Carte.jsonLayout` ; à 0 PV l'obstacle est retiré du layout et la
 * case redevient un terrain normal.
 */
carteRouter.post("/:id/detruire", async (req, res) => {
  const parsed = tentativeObstacleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ erreur: parsed.error.issues[0]?.message });
  }
  const { x, y, personnageId, personnagePosition } = parsed.data;

  try {
    const { carte, layout, obstacle } = await trouverObstacleCible(req.params.id, x, y);
    if (obstacle.categorie === "INFRANCHISSABLE_ZONE") {
      throw new ErreurValidation(`La case (${x}, ${y}) est infranchissable de zone.`);
    }
    if (distanceChebyshev(personnagePosition, { x, y }) > 1) {
      throw new ErreurValidation(`Le personnage doit être adjacent à l'obstacle en (${x}, ${y}) pour le détruire.`);
    }

    const personnage = await prisma.personnage.findUniqueOrThrow({ where: { id: personnageId } });

    const resultat = resoudreDestruction({
      d20: lancerD20(),
      force: personnage.force,
      pvActuels: obstacle.pv,
    });

    if (resultat.succes) {
      const nouveauxObstacles = resultat.detruit
        ? layout.obstacles.filter((o) => !(o.x === x && o.y === y))
        : layout.obstacles.map((o) => (o.x === x && o.y === y ? { ...o, pv: resultat.pvRestants } : o));
      await prisma.carte.update({
        where: { id: carte.id },
        data: { jsonLayout: JSON.stringify({ ...layout, obstacles: nouveauxObstacles }) },
      });
    }

    res.json({ ...resultat, seuil: SEUIL_RESISTANCE, x, y });
  } catch (e) {
    if (e instanceof ErreurValidation) {
      return res.status(400).json({ erreur: e.message });
    }
    throw e;
  }
});
