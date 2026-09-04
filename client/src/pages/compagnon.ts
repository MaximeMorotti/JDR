import { api } from "../api";
import { echapperHtml } from "../components/echapper-html";
import { afficherErreur } from "../components/erreur";
import { genererRadarSVG } from "../components/radar-stats";
import { naviguer } from "../router";
import { state } from "../state";

/**
 * Radar de compagnon : 4 axes seulement (pas les 8 des personnages) — l'Intelligence est absente
 * de 8 des 10 compagnons du Codex, l'inclure uniformément aurait affiché un "0" trompeur pour la
 * plupart d'entre eux. PV/Force/Dex/Vitalité sont communs à tous.
 */
const AXES_COMPAGNON: [cle: string, label: string][] = [
  ["pv", "PV"],
  ["force", "For"],
  ["dexterite", "Dex"],
  ["vitalite", "Vit"],
];

export async function renderCompagnon(app: HTMLElement) {
  const equipeId = state.equipeId;
  if (!equipeId) return naviguer("/accueil");

  async function charger() {
    const [equipe, compagnons] = await Promise.all([
      api.obtenirEquipe(equipeId!),
      api.compagnonsDisponibles(equipeId!),
    ]);
    afficher(equipe.nom, equipe.compagnonEquipe, compagnons);
  }

  function afficher(
    nomEquipe: string,
    compagnonEquipe: { compagnon: { id: string }; pseudo: string | null } | null,
    compagnons: Awaited<ReturnType<typeof api.compagnonsDisponibles>>,
  ) {
    const choisiId = compagnonEquipe?.compagnon.id ?? null;
    app.innerHTML = `
      <div class="entete"><h1>${echapperHtml(nomEquipe)}</h1></div>
      <p>Un seul compagnon par équipe. Les chiens et la Mule sont accessibles à toute équipe ; les autres nécessitent une classe ou une race précise dans l'équipe.</p>
      <div id="erreur-compagnon"></div>
      <div class="grille-compagnons" id="grille-compagnons"></div>
      <div class="actions">
        <button class="btn btn--fantome" id="btn-retour">← Retour à l'équipe</button>
      </div>
    `;

    const zoneErreur = app.querySelector<HTMLElement>("#erreur-compagnon")!;
    const grille = app.querySelector<HTMLElement>("#grille-compagnons")!;

    grille.innerHTML = compagnons
      .map((c) => {
        const estChoisi = c.id === choisiId;
        const prerequis = c.raceRequise
          ? `Nécessite : race ${c.raceRequise.nom}`
          : c.classesLiees.length > 0
            ? `Nécessite : ${c.classesLiees.map((cl) => cl.classe.nom).join(" ou ")}`
            : "";
        const echelle = Math.max(c.pv, c.force, c.dexterite, c.vitalite, 10);
        return `
        <div class="carte-compagnon ${!c.accessible ? "inaccessible" : ""} ${estChoisi ? "choisi" : ""}">
          <img class="portrait-compagnon" src="/img/compagnons/${c.id}.webp" alt="Portrait ${c.nom}" loading="lazy" />
          ${
            estChoisi
              ? `<input class="nom-compagnon" data-nom-compagnon value="${echapperHtml(compagnonEquipe?.pseudo ?? "")}" placeholder="${c.nom}" maxlength="40" spellcheck="false" />
                 <div style="font-size:0.8rem;color:var(--text-dim);margin-top:-4px">${c.nom}</div>`
              : `<h3>${c.nom}</h3>`
          }
          <div style="font-size:0.85rem;color:var(--text-dim)">${c.role}</div>
          <div class="radar-compagnon">${genererRadarSVG({ pv: c.pv, force: c.force, dexterite: c.dexterite, vitalite: c.vitalite }, AXES_COMPAGNON, echelle)}</div>
          <p style="font-size:0.8rem;margin-top:8px">${c.capaciteTransport}</p>
          ${prerequis ? `<span class="badge ${c.accessible ? "badge--attention" : "badge--bloque"}">${prerequis}</span>` : ""}
          <div style="margin-top:10px">
            ${
              estChoisi
                ? `<button class="btn btn--danger" data-retirer>Retirer ce compagnon</button>`
                : `<button class="btn ${c.accessible ? "btn--primaire" : ""}" data-choisir="${c.id}" ${!c.accessible || choisiId ? "disabled" : ""}>Choisir</button>`
            }
          </div>
        </div>
      `;
      })
      .join("");

    grille.querySelectorAll<HTMLButtonElement>("[data-choisir]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          await api.choisirCompagnon(equipeId!, btn.dataset["choisir"]!);
          await charger();
        } catch (e) {
          afficherErreur(zoneErreur, e);
        }
      });
    });

    grille.querySelectorAll<HTMLButtonElement>("[data-retirer]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await api.retirerCompagnon(equipeId!);
        await charger();
      });
    });

    const inputNom = grille.querySelector<HTMLInputElement>("[data-nom-compagnon]");
    inputNom?.addEventListener("blur", async () => {
      const valeur = inputNom.value.trim();
      if (!valeur || valeur === compagnonEquipe?.pseudo) {
        inputNom.value = compagnonEquipe?.pseudo ?? "";
        return;
      }
      try {
        await api.renommerCompagnon(equipeId!, valeur);
        await charger();
      } catch (e) {
        afficherErreur(zoneErreur, e);
      }
    });
    inputNom?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") inputNom.blur();
    });

    app.querySelector("#btn-retour")!.addEventListener("click", () => naviguer("/equipe"));
  }

  await charger();
}
