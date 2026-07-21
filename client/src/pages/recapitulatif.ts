import { api } from "../api";
import { naviguer } from "../router";
import { state } from "../state";

const NOMS_STATS: [key: string, label: string][] = [
  ["force", "For"],
  ["dexterite", "Dex"],
  ["vitalite", "Vit"],
  ["charisme", "Cha"],
  ["intelligence", "Int"],
  ["sagesse", "Sag"],
  ["chance", "Cha."],
  ["perception", "Per"],
];

export async function renderRecapitulatif(app: HTMLElement) {
  const equipeId = state.equipeId;
  if (!equipeId) return naviguer("/accueil");

  const equipe = await api.obtenirEquipe(equipeId);

  app.innerHTML = `
    <div class="entete">
      <h1>${equipe.nom}</h1>
      <div class="budget">${equipe.orRestant} po restantes</div>
    </div>
    <div class="etapes">
      <span class="etape">Personnages</span>
      <span class="etape">Équipement</span>
      <span class="etape">Compagnon</span>
      <span class="etape etape--active">Récapitulatif</span>
    </div>

    <div class="grille-recap">
      ${equipe.personnages
        .map(
          (p) => `
        <div class="fiche-perso">
          <h3>${p.pseudo}</h3>
          <div style="color:var(--text-dim);font-size:0.85rem">${p.race.nom} · ${p.classe.nom}${p.specialisation ? " · " + p.specialisation.nom : ""}</div>
          <div class="stats-grille" style="margin-top:10px">
            ${NOMS_STATS.map(
              ([cle, label]) => `<div class="stat"><span class="valeur">${(p as any)[cle]}</span><span class="label">${label}</span></div>`
            ).join("")}
          </div>
          <div class="inventaire-recap">
            ${
              p.inventaire.length > 0
                ? p.inventaire.map((i) => `<div>${i.objet.nom}${i.prixPaye > 0 ? ` (${i.prixPaye} po)` : " (gratuit)"}</div>`).join("")
                : "<div>Aucun équipement.</div>"
            }
          </div>
          <button class="btn" style="width:100%;margin-top:10px" data-modifier="${p.id}">Modifier l'équipement</button>
        </div>
      `
        )
        .join("")}
    </div>

    <h2 style="margin-top:28px">Compagnon</h2>
    ${
      equipe.compagnonEquipe
        ? `<div class="carte">${equipe.compagnonEquipe.compagnon.nom} — ${equipe.compagnonEquipe.compagnon.role}</div>`
        : `<div class="carte">Aucun compagnon choisi.</div>`
    }

    <div class="actions">
      <button class="btn" id="btn-compagnon">Modifier le compagnon</button>
      <button class="btn btn--primaire" id="btn-nouvelle-equipe">Créer une nouvelle équipe</button>
    </div>
  `;

  app.querySelectorAll<HTMLButtonElement>("[data-modifier]").forEach((btn) => {
    btn.addEventListener("click", () => naviguer(`/equipement/${btn.dataset["modifier"]}`));
  });
  app.querySelector("#btn-compagnon")!.addEventListener("click", () => naviguer("/compagnon"));
  app.querySelector("#btn-nouvelle-equipe")!.addEventListener("click", () => {
    state.equipeId = null;
    naviguer("/accueil");
  });
}
