import { api, type Equipe } from "../api";
import { confirmerSuppression } from "../components/confirmation";
import { naviguer } from "../router";
import { state } from "../state";

export async function renderEquipe(app: HTMLElement) {
  const equipeId = state.equipeId;
  if (!equipeId) return naviguer("/accueil");

  async function charger() {
    const equipe = await api.obtenirEquipe(equipeId!);
    afficher(equipe);
  }

  function afficher(equipe: Equipe) {
    const emplacementsVides = 4 - equipe.personnages.length;

    app.innerHTML = `
      <div class="entete">
        <h1>${equipe.nom}</h1>
        <div class="budget ${equipe.orRestant < 20 ? "budget--faible" : ""}">${equipe.orRestant} po</div>
      </div>

      <h2>Personnages</h2>
      <div class="grille-equipe" id="grille-personnages"></div>

      <h2 style="margin-top:28px">Compagnon</h2>
      <div class="grille-equipe" id="grille-compagnon" style="grid-template-columns:repeat(auto-fill, minmax(200px, 220px))"></div>

      <button class="btn btn--primaire bouton-boutique-flottant" id="btn-boutique" ${equipe.personnages.length === 0 ? "disabled" : ""}>
        🛒 Boutique
      </button>
    `;

    const grillePersonnages = app.querySelector<HTMLElement>("#grille-personnages")!;
    grillePersonnages.innerHTML =
      equipe.personnages
        .map(
          (p) => `
      <div class="carte-slot-perso" data-perso="${p.id}">
        <button class="btn-supprimer-slot" data-supprimer-perso="${p.id}" title="Supprimer ${p.pseudo}">✕</button>
        <img class="portrait-slot" src="/img/races/${p.raceId}.webp" alt="${p.pseudo}" loading="lazy" />
        <h3 style="margin-bottom:2px">${p.pseudo}</h3>
        <div style="font-size:0.82rem;color:var(--text-dim)">${p.race.nom} · ${p.classe.nom}</div>
      </div>
    `
        )
        .join("") +
      (emplacementsVides > 0
        ? `<div class="slot-vide" id="ajouter-perso">+</div>`
        : "");

    grillePersonnages.querySelectorAll<HTMLElement>("[data-perso]").forEach((carte) => {
      carte.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).closest("[data-supprimer-perso]")) return;
        naviguer(`/equipement/${carte.dataset["perso"]}`);
      });
    });
    grillePersonnages.querySelectorAll<HTMLElement>("[data-supprimer-perso]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const perso = equipe.personnages.find((p) => p.id === btn.dataset["supprimerPerso"]);
        const ok = await confirmerSuppression(`Supprimer ${perso?.pseudo} ? Cette action est irréversible.`);
        if (!ok) return;
        await api.supprimerPersonnage(equipeId!, btn.dataset["supprimerPerso"]!);
        await charger();
      });
    });
    app.querySelector("#ajouter-perso")?.addEventListener("click", () => naviguer("/creation"));

    const grilleCompagnon = app.querySelector<HTMLElement>("#grille-compagnon")!;
    if (equipe.compagnonEquipe) {
      const c = equipe.compagnonEquipe.compagnon;
      grilleCompagnon.innerHTML = `
        <div class="carte-slot-perso" data-compagnon>
          <button class="btn-supprimer-slot" data-supprimer-compagnon title="Retirer ${c.nom}">✕</button>
          <img class="portrait-slot" src="/img/compagnons/${c.id}.webp" alt="${c.nom}" loading="lazy" />
          <h3 style="margin-bottom:2px">${c.nom}</h3>
          <div style="font-size:0.82rem;color:var(--text-dim)">${c.role}</div>
        </div>
      `;
      grilleCompagnon.querySelector("[data-compagnon]")!.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).closest("[data-supprimer-compagnon]")) return;
        naviguer("/compagnon");
      });
      grilleCompagnon.querySelector("[data-supprimer-compagnon]")!.addEventListener("click", async (e) => {
        e.stopPropagation();
        const ok = await confirmerSuppression(`Retirer ${c.nom} de l'équipe ?`);
        if (!ok) return;
        await api.retirerCompagnon(equipeId!);
        await charger();
      });
    } else {
      grilleCompagnon.innerHTML = `<div class="slot-vide" id="ajouter-compagnon">+</div>`;
      app.querySelector("#ajouter-compagnon")!.addEventListener("click", () => naviguer("/compagnon"));
    }

    app.querySelector<HTMLButtonElement>("#btn-boutique")!.addEventListener("click", () => {
      if (equipe.personnages.length === 0) return;
      naviguer(`/equipement/${equipe.personnages[0]!.id}`);
    });
  }

  await charger();
}
