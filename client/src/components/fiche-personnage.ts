import { api, type Equipe, type Personnage } from "../api";
import { confirmerSuppression } from "./confirmation";
import { genererRadarSVG } from "./radar-stats";

/**
 * Fiche détaillée d'un personnage, en popup (remplace la navigation directe vers la boutique au
 * clic sur une carte de la page équipe). Bandeau portrait 2:1 en haut, description race/classe,
 * radar de stats, renommage inline, suppression — et navigation d'une fiche à l'autre via des
 * flèches, comme un slider de cartes. La suppression d'un personnage n'est désormais possible que
 * depuis ici (retirée de la carte bannière de la page équipe).
 */
export function ouvrirFichePersonnage(equipe: Equipe, indexDepart: number, onFerme: () => void) {
  let liste = [...equipe.personnages];
  let index = indexDepart;

  const overlay = document.createElement("div");
  overlay.className = "overlay-fiche-perso";
  document.body.appendChild(overlay);

  function fermer() {
    overlay.remove();
    document.removeEventListener("keydown", surTouche);
    onFerme();
  }

  function surTouche(e: KeyboardEvent) {
    if (e.key === "Escape") fermer();
    if (e.key === "ArrowLeft") allerA(index - 1);
    if (e.key === "ArrowRight") allerA(index + 1);
  }

  /** Navigation cyclique : au bout à droite, on retombe sur le premier (et inversement à gauche). */
  function allerA(nouvelIndex: number) {
    if (liste.length === 0) return;
    index = ((nouvelIndex % liste.length) + liste.length) % liste.length;
    rendre();
  }

  function rendre() {
    const p: Personnage = liste[index]!;

    overlay.innerHTML = `
      <div class="boite-fiche-perso">
        <button class="bouton-croix btn-fermer-fiche" data-fermer title="Fermer">✕</button>
        ${liste.length > 1 ? `<button class="fleche-fiche fleche-fiche--gauche" data-prec title="Personnage précédent">‹</button>` : ""}
        ${liste.length > 1 ? `<button class="fleche-fiche fleche-fiche--droite" data-suiv title="Personnage suivant">›</button>` : ""}

        <div class="fiche-perso-defilement">
          <img class="fiche-perso-banniere" src="/img/equipe-portraits/${p.raceId}.webp" alt="${p.pseudo}" />

          <div class="fiche-perso-corps">
            <input class="fiche-perso-nom" id="fiche-perso-nom" value="${p.pseudo}" maxlength="40" spellcheck="false" />
            <div class="fiche-perso-sous-titre">${p.race.nom} · ${p.classe.nom}</div>
            <p class="fiche-perso-lore">${p.race.lore}</p>

            <div class="fiche-perso-radar">${genererRadarSVG({
              force: p.force,
              dexterite: p.dexterite,
              vitalite: p.vitalite,
              charisme: p.charisme,
              intelligence: p.intelligence,
              sagesse: p.sagesse,
              chance: p.chance,
              perception: p.perception,
            })}</div>

            <div id="erreur-fiche-perso"></div>
            <div class="fiche-perso-actions">
              <button class="btn btn--danger" data-supprimer>SUPPRIMER</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const inputNom = overlay.querySelector<HTMLInputElement>("#fiche-perso-nom")!;
    const zoneErreur = overlay.querySelector<HTMLElement>("#erreur-fiche-perso")!;

    async function sauverNom() {
      const valeur = inputNom.value.trim();
      if (!valeur || valeur === p.pseudo) {
        inputNom.value = p.pseudo;
        return;
      }
      try {
        await api.renommerPersonnage(equipe.id, p.id, valeur);
        p.pseudo = valeur;
        zoneErreur.innerHTML = "";
      } catch (e) {
        inputNom.value = p.pseudo;
        zoneErreur.innerHTML = `<div class="erreur">${(e as Error).message}</div>`;
      }
    }
    inputNom.addEventListener("blur", sauverNom);
    inputNom.addEventListener("keydown", (e) => {
      if (e.key === "Enter") inputNom.blur();
    });

    overlay.querySelector("[data-fermer]")!.addEventListener("click", fermer);
    overlay.querySelector("[data-prec]")?.addEventListener("click", () => allerA(index - 1));
    overlay.querySelector("[data-suiv]")?.addEventListener("click", () => allerA(index + 1));

    overlay.querySelector("[data-supprimer]")!.addEventListener("click", async () => {
      const ok = await confirmerSuppression(`Supprimer ${p.pseudo} ? Cette action est irréversible.`);
      if (!ok) return;
      await api.supprimerPersonnage(equipe.id, p.id);
      liste = liste.filter((x) => x.id !== p.id);
      if (liste.length === 0) {
        fermer();
        return;
      }
      if (index >= liste.length) index = liste.length - 1;
      rendre();
    });
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) fermer();
  });
  document.addEventListener("keydown", surTouche);

  rendre();
}
