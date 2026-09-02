import "./style.css";
import { renderAccueil } from "./pages/accueil";
import { renderAventure } from "./pages/aventure";
import { renderCombatTest } from "./pages/combat-test";
import { renderCompagnon } from "./pages/compagnon";
import { renderCompetences } from "./pages/competences";
import { renderCreationPersonnage } from "./pages/creation-personnage";
import { renderEquipe } from "./pages/equipe";
import { renderEquipement } from "./pages/equipement";
import { demarrerRouteur, route } from "./router";

const app = document.querySelector<HTMLDivElement>("#app")!;

route("/accueil", () => renderAccueil(app));
route("/creation", () => renderCreationPersonnage(app));
route("/equipe", () => renderEquipe(app));
route("/equipement/:personnageId", (params) => renderEquipement(app, { personnageId: params["personnageId"]! }));
route("/compagnon", () => renderCompagnon(app));
route("/competences/:personnageId", (params) => renderCompetences(app, { personnageId: params["personnageId"]! }));
route("/aventure", () => renderAventure(app));
route("/combat-test", () => renderCombatTest(app));

demarrerRouteur();
