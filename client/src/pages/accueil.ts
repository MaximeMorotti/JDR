import { api } from "../api";
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
      zoneErreur.innerHTML = `<div class="erreur">${(e as Error).message}</div>`;
    }
  });

  const equipes = await api.listerEquipes();
  const zoneEquipes = app.querySelector<HTMLElement>("#equipes-existantes")!;
  if (equipes.length === 0) return;

  zoneEquipes.innerHTML = `
    <h2 style="margin-top:32px">Reprendre une équipe</h2>
    <div class="liste-equipes">
      ${equipes
        .map(
          (e) => `
        <div class="item-equipe" data-id="${e.id}">
          <span>${e.nom} — ${e.personnages.length}/4 personnage(s)${e.compagnonEquipe ? ` · ${e.compagnonEquipe.compagnon.nom}` : ""}</span>
          <span>${e.orRestant} po restantes →</span>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  zoneEquipes.querySelectorAll<HTMLElement>(".item-equipe").forEach((el) => {
    el.addEventListener("click", () => {
      const equipe = equipes.find((e) => e.id === el.dataset["id"])!;
      state.equipeId = equipe.id;
      naviguer(equipe.personnages.length > 0 ? "/equipe" : "/creation");
    });
  });
}
