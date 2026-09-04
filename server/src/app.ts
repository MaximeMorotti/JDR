import cors from "cors";
import express from "express";
import { carteRouter } from "./routes/carte.routes";
import { catalogueRouter } from "./routes/catalogue.routes";
import { compagnonRouter } from "./routes/compagnon.routes";
import { equipeRouter } from "./routes/equipe.routes";
import { personnageRouter } from "./routes/personnage.routes";

/**
 * Construction de l'application Express, séparée du démarrage du serveur (`index.ts`) pour
 * pouvoir la monter dans des tests d'intégration (`carte.routes.test.ts`, ticket #1) sans ouvrir
 * de vrai port au chargement du module.
 */
/**
 * Origines autorisées pour le CORS : le client Vite en dev (port par défaut 5173, ou surchargé via
 * CORS_ORIGIN — liste séparée par des virgules — si le port change). Pas de wildcard : même en solo
 * local, le serveur écoute sur le réseau et n'a pas à répondre à n'importe quelle origine (SonarCloud).
 */
const originsAutorisees = (process.env["CORS_ORIGIN"] ?? "http://localhost:5173").split(",");

export function creerApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: originsAutorisees }));
  app.use(express.json());

  app.use("/api/catalogue", catalogueRouter);
  app.use("/api/cartes", carteRouter);
  app.use("/api/equipes", equipeRouter);
  app.use("/api/equipes/:equipeId/personnages", personnageRouter);
  app.use("/api/equipes/:equipeId", compagnonRouter);

  // Gestionnaire d'erreurs générique — évite qu'une exception non prévue ne fasse planter le process.
  app.use(
    (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error(err);
      res.status(500).json({ erreur: "Erreur interne du serveur." });
    }
  );

  return app;
}
