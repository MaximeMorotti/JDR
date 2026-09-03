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
export function creerApp() {
  const app = express();

  app.use(cors());
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
