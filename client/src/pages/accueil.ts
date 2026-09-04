import { api } from "../api";
import { confirmerSuppression } from "../components/confirmation";
import { echapperHtml } from "../components/echapper-html";
import { afficherErreur } from "../components/erreur";
import { naviguer } from "../router";
import { state } from "../state";

export async function renderAccueil(app: HTMLElement) {
  app.innerHTML = `
    <div class="accueil">
      <h1>Le Début d'une Épopée</h1>
      <p>Crée ton équipe d'aventuriers (1 à 4 personnages, 100 po partagées) pour commencer l'histoire.</p>

      <div class="carte">
        <div class="champ">
          <label for="nom-equipe">Nom de l'équipe</label>
          <input id="nom-equipe" type="text" placeholder="Les Compagnons de l'Aube" />
        </div>
        <div id="erreur-accueil"></div>
        <button class="btn btn--primaire" id="btn-creer-equipe" style="width:100%">Créer une nouvelle équipe</button>
      </div>

      <div id="equipes-existantes"></div>
    </div>
  `;

  const inputNom = app.querySelector<HTMLInputElement>("#nom-equipe")!;
  const zoneErreur = app.querySelector<HTMLElement>("#erreur-accueil")!;

  app.querySelector("#btn-creer-equipe")!.addEventListener("click", async () => {
    const nom = inputNom.value.trim();
    if (!nom) {
      zoneErreur.innerHTML = `<div class="erreur">Le nom de l'équipe est requis.</div>`;
      return;
    }
    try {
      const equipe = await api.creerEquipe(nom);
      state.equipeId = equipe.id;
      naviguer("/creation");
    } catch (e) {
      afficherErreur(zoneErreur, e);
    }
  });

  const zoneEquipes = app.querySelector<HTMLElement>("#equipes-existantes")!;

  async function chargerEquipes() {
    const equipes = await api.listerEquipes();
    if (equipes.length === 0) {
      zoneEquipes.innerHTML = "";
      return;
    }

    zoneEquipes.innerHTML = `
      <h2 style="margin-top:32px">Reprendre une équipe</h2>
      <div class="liste-equipes">
        ${equipes
          .map(
            (e) => `
          <div class="item-equipe" data-id="${e.id}">
            <span class="infos-item-equipe">
              <span>${echapperHtml(e.nom)} — ${e.personnages.length}/4 personnage(s)${e.compagnonEquipe ? ` · ${echapperHtml(e.compagnonEquipe.pseudo ?? e.compagnonEquipe.compagnon.nom)}` : ""}</span>
              <span>${e.orRestant} po restantes →</span>
            </span>
            <button class="bouton-croix btn-supprimer-equipe" data-supprimer-equipe="${e.id}" title="Supprimer ${echapperHtml(e.nom)}">✕</button>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    zoneEquipes.querySelectorAll<HTMLElement>(".item-equipe").forEach((el) => {
      el.addEventListener("click", (ev) => {
        if ((ev.target as HTMLElement).closest("[data-supprimer-equipe]")) return;
        const equipe = equipes.find((e) => e.id === el.dataset["id"])!;
        state.equipeId = equipe.id;
        naviguer(equipe.personnages.length > 0 ? "/equipe" : "/creation");
      });
    });

    zoneEquipes.querySelectorAll<HTMLElement>("[data-supprimer-equipe]").forEach((btn) => {
      btn.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        const equipe = equipes.find((e) => e.id === btn.dataset["supprimerEquipe"]);
        const ok = await confirmerSuppression(`Supprimer l'équipe "${equipe?.nom}" ? Cette action est irréversible.`);
        if (!ok) return;
        await api.supprimerEquipe(btn.dataset["supprimerEquipe"]!);
        await chargerEquipes();
      });
    });
  }

  await chargerEquipes();
}
