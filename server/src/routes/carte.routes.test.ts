import type { Server } from "node:http";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { creerApp } from "../app";
import { prisma } from "../db";

/**
 * Tests d'intégration des routes `/franchir` et `/detruire` (ticket #1, Testing Decisions :
 * "vérifier qu'elles persistent correctement (PV d'obstacle...) et rejettent les entrées
 * invalides (obstacle déjà détruit, cible hors de portée)"). Le d20 n'étant pas injectable via
 * l'API HTTP (contrairement aux fonctions pures de `combat-resolution.service.test.ts`), on le
 * fige avec `vi.spyOn(Math, "random")` — pas de dépendance de test supplémentaire nécessaire.
 *
 * Utilise une carte et un personnage dédiés (pas `carte-test`/données de la seed) pour ne jamais
 * interférer avec le banc d'essai manuel côté client.
 */

const CARTE_ID = "carte-test-integration-franchir-detruire";
const RACE_ID = "humain"; // bonus/malus racial neutre (§4) — jet prévisible dans les assertions.

let server: Server;
let baseUrl: string;
let personnageId: string;
let equipeId: string;

function mockD20(valeur: number) {
  // lancerD20() = Math.floor(Math.random() * 20) + 1 → random = (valeur - 1) / 20 tombe pile dans
  // le bucket attendu (evite les soucis d'arrondi flottant sur les bornes).
  vi.spyOn(Math, "random").mockReturnValue((valeur - 1) / 20 + 0.01);
}

async function ecrireLayoutCarte(obstacles: Record<string, unknown>[]) {
  await prisma.carte.update({
    where: { id: CARTE_ID },
    data: { jsonLayout: JSON.stringify({ obstacles, tranchees: [] }) },
  });
}

async function lireLayoutCarte() {
  const carte = await prisma.carte.findUniqueOrThrow({ where: { id: CARTE_ID } });
  return JSON.parse(carte.jsonLayout) as { obstacles: { x: number; y: number; pv?: number }[] };
}

type ReponseTentative = { succes?: boolean; pvRestants?: number; detruit?: boolean; erreur?: string };

async function corpsJson(reponse: Response): Promise<ReponseTentative> {
  return reponse.json() as Promise<ReponseTentative>;
}

beforeAll(async () => {
  const app = creerApp();
  server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const adresse = server.address();
  const port = typeof adresse === "object" && adresse ? adresse.port : 0;
  baseUrl = `http://127.0.0.1:${port}`;

  await prisma.raceRef.findUniqueOrThrow({ where: { id: RACE_ID } });
  const classe = await prisma.classeRef.findFirstOrThrow();
  const equipe = await prisma.equipe.create({ data: { nom: "temp-integration-carte-routes" } });
  equipeId = equipe.id;
  const personnage = await prisma.personnage.create({
    data: {
      pseudo: "Fixture",
      equipeId,
      raceId: RACE_ID,
      classeId: classe.id,
      force: 10,
      dexterite: 10,
      vitalite: 10,
      charisme: 10,
      intelligence: 10,
      sagesse: 10,
      chance: 10,
      perception: 10,
    },
  });
  personnageId = personnage.id;

  await prisma.carte.create({
    data: { id: CARTE_ID, nom: "Fixture intégration", zoneLiee: "Forêt", largeur: 20, hauteur: 20, jsonLayout: "{}" },
  });
});

afterAll(async () => {
  vi.restoreAllMocks();
  await prisma.personnage.deleteMany({ where: { equipeId } });
  await prisma.equipe.delete({ where: { id: equipeId } });
  await prisma.carte.delete({ where: { id: CARTE_ID } });
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

describe("POST /api/cartes/:id/franchir", () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    await ecrireLayoutCarte([
      { x: 0, y: 0, categorie: "GENERIQUE", preset: "LEGER", pv: 5, franchissable: true, malusDexterite: 1, axeInteraction: "ETROIT" },
      { x: 5, y: 5, categorie: "GENERIQUE", preset: "LOURD", pv: 50, franchissable: false, malusDexterite: 3, axeInteraction: "HAUTEUR" },
      { x: 9, y: 9, categorie: "INFRANCHISSABLE_ZONE" },
    ]);
  });

  it("réussit et ne persiste rien (Franchir ne modifie jamais la carte)", async () => {
    mockD20(20); // 20 + Dex 10 + racial 0 - malus 1 = 29 ≥ 12
    const reponse = await fetch(`${baseUrl}/api/cartes/${CARTE_ID}/franchir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x: 0, y: 0, personnageId, personnagePosition: { x: 0, y: 1 } }),
    });
    const corps = await corpsJson(reponse);
    expect(reponse.status).toBe(200);
    expect(corps.succes).toBe(true);

    const layout = await lireLayoutCarte();
    expect(layout.obstacles.find((o) => o.x === 0 && o.y === 0)?.pv).toBe(5);
  });

  it("échoue sous le seuil", async () => {
    mockD20(1); // 1 + Dex 10 + racial 0 - malus 1 = 10 < 12
    const reponse = await fetch(`${baseUrl}/api/cartes/${CARTE_ID}/franchir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x: 0, y: 0, personnageId, personnagePosition: { x: 0, y: 1 } }),
    });
    const corps = await corpsJson(reponse);
    expect(corps.succes).toBe(false);
  });

  it("rejette une cible hors de portée (non adjacente)", async () => {
    const reponse = await fetch(`${baseUrl}/api/cartes/${CARTE_ID}/franchir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x: 0, y: 0, personnageId, personnagePosition: { x: 0, y: 5 } }),
    });
    expect(reponse.status).toBe(400);
    const corps = await corpsJson(reponse);
    expect(corps.erreur).toMatch(/adjacent/);
  });

  it("rejette une case infranchissable de zone", async () => {
    const reponse = await fetch(`${baseUrl}/api/cartes/${CARTE_ID}/franchir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x: 9, y: 9, personnageId, personnagePosition: { x: 9, y: 8 } }),
    });
    expect(reponse.status).toBe(400);
    const corps = await corpsJson(reponse);
    expect(corps.erreur).toMatch(/infranchissable de zone/);
  });

  it("rejette un obstacle non franchissable", async () => {
    const reponse = await fetch(`${baseUrl}/api/cartes/${CARTE_ID}/franchir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x: 5, y: 5, personnageId, personnagePosition: { x: 5, y: 6 } }),
    });
    expect(reponse.status).toBe(400);
    const corps = await corpsJson(reponse);
    expect(corps.erreur).toMatch(/franchissable/);
  });

  it("rejette une case sans obstacle (obstacle déjà détruit ou jamais posé)", async () => {
    const reponse = await fetch(`${baseUrl}/api/cartes/${CARTE_ID}/franchir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x: 1, y: 1, personnageId, personnagePosition: { x: 1, y: 1 } }),
    });
    expect(reponse.status).toBe(400);
    const corps = await corpsJson(reponse);
    expect(corps.erreur).toMatch(/Aucun obstacle/);
  });
});

describe("POST /api/cartes/:id/detruire", () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    await ecrireLayoutCarte([
      { x: 0, y: 0, categorie: "GENERIQUE", preset: "MOYEN", pv: 25, franchissable: true, malusDexterite: 2, axeInteraction: "ETROIT" },
      { x: 2, y: 2, categorie: "GENERIQUE", preset: "LEGER", pv: 5, franchissable: true, malusDexterite: 1, axeInteraction: "ETROIT" },
      { x: 9, y: 9, categorie: "INFRANCHISSABLE_ZONE" },
    ]);
  });

  it("réussit, inflige les dégâts fixes et persiste les PV restants sans détruire l'obstacle", async () => {
    mockD20(20); // 20 + Force 10 = 30 ≥ 12
    const reponse = await fetch(`${baseUrl}/api/cartes/${CARTE_ID}/detruire`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x: 0, y: 0, personnageId, personnagePosition: { x: 0, y: 1 } }),
    });
    const corps = await corpsJson(reponse);
    expect(corps.succes).toBe(true);
    expect(corps.pvRestants).toBe(20);
    expect(corps.detruit).toBe(false);

    const layout = await lireLayoutCarte();
    expect(layout.obstacles.find((o) => o.x === 0 && o.y === 0)?.pv).toBe(20);
  });

  it("détruit l'obstacle et le retire du layout persisté quand ses PV tombent à 0", async () => {
    mockD20(20); // 20 + Force 10 = 30 ≥ 12, obstacle à 5 PV (Léger) meurt en un coup
    const reponse = await fetch(`${baseUrl}/api/cartes/${CARTE_ID}/detruire`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x: 2, y: 2, personnageId, personnagePosition: { x: 2, y: 1 } }),
    });
    const corps = await corpsJson(reponse);
    expect(corps.succes).toBe(true);
    expect(corps.detruit).toBe(true);

    const layout = await lireLayoutCarte();
    expect(layout.obstacles.find((o) => o.x === 2 && o.y === 2)).toBeUndefined();
  });

  it("un échec ne persiste aucun changement de PV", async () => {
    mockD20(1); // 1 + Force 10 = 11 < 12
    const reponse = await fetch(`${baseUrl}/api/cartes/${CARTE_ID}/detruire`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x: 0, y: 0, personnageId, personnagePosition: { x: 0, y: 1 } }),
    });
    const corps = await corpsJson(reponse);
    expect(corps.succes).toBe(false);

    const layout = await lireLayoutCarte();
    expect(layout.obstacles.find((o) => o.x === 0 && o.y === 0)?.pv).toBe(25);
  });

  it("rejette une cible hors de portée (non adjacente)", async () => {
    const reponse = await fetch(`${baseUrl}/api/cartes/${CARTE_ID}/detruire`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x: 0, y: 0, personnageId, personnagePosition: { x: 0, y: 9 } }),
    });
    expect(reponse.status).toBe(400);
    const corps = await corpsJson(reponse);
    expect(corps.erreur).toMatch(/adjacent/);
  });

  it("rejette une case infranchissable de zone", async () => {
    const reponse = await fetch(`${baseUrl}/api/cartes/${CARTE_ID}/detruire`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x: 9, y: 9, personnageId, personnagePosition: { x: 9, y: 8 } }),
    });
    expect(reponse.status).toBe(400);
    const corps = await corpsJson(reponse);
    expect(corps.erreur).toMatch(/infranchissable de zone/);
  });

  it("rejette une case sans obstacle (obstacle déjà détruit ou jamais posé)", async () => {
    const reponse = await fetch(`${baseUrl}/api/cartes/${CARTE_ID}/detruire`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x: 1, y: 1, personnageId, personnagePosition: { x: 1, y: 1 } }),
    });
    expect(reponse.status).toBe(400);
    const corps = await corpsJson(reponse);
    expect(corps.erreur).toMatch(/Aucun obstacle/);
  });
});
