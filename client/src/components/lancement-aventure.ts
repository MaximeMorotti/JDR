import { api, type Equipe } from "../api";
import { naviguer } from "../router";
import { confirmerAvertissement } from "./confirmation";

function attendre(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Transition de fumée qui recouvre tout l'écran, exécute `action` (la navigation) une fois
 * l'écran totalement voilé, puis se dissipe sur la nouvelle page. `action` est appelée pendant le
 * plein voile plutôt qu'avant/après pour que le changement de page soit invisible au joueur.
 */
async function jouerTransitionFumee(action: () => void): Promise<void> {
  const overlay = document.createElement("div");
  overlay.className = "overlay-fumee";
  overlay.innerHTML = `
    <div class="volute volute--1"></div>
    <div class="volute volute--2"></div>
    <div class="volute volute--3"></div>
    <div class="volute volute--4"></div>
  `;
  document.body.appendChild(overlay);

  await attendre(750);
  action();
  await attendre(120);
  overlay.classList.add("overlay-fumee--sortie");
  await attendre(700);
  overlay.remove();
}

/** Popup de récapitulatif final (équipe, compagnon, équipement) avant de lancer l'aventure. */
function ouvrirRecapAventure(equipe: Equipe): Promise<boolean> {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "overlay-confirmation";

    const compagnon = equipe.compagnonEquipe;
    const recapCompagnon = compagnon
      ? `<div class="recap-bloc">
          <h4>Compagnon</h4>
          <div class="recap-ligne">${compagnon.pseudo ?? compagnon.compagnon.nom} — <span class="recap-dim">${compagnon.compagnon.nom}</span></div>
        </div>`
      : `<div class="recap-bloc"><h4>Compagnon</h4><div class="recap-ligne recap-dim">Aucun</div></div>`;

    overlay.innerHTML = `
      <div class="boite-confirmation boite-recap">
        <h3>Valider cette équipe ?</h3>
        <p>Dernière vérification avant de partir — impossible de revenir en arrière une fois l'aventure lancée.</p>
        <div class="recap-personnages">
          ${equipe.personnages
            .map(
              (p) => `
            <div class="recap-bloc">
              <h4>${p.pseudo} <span class="recap-dim">— ${p.race.nom} · ${p.classe.nom}</span></h4>
              <div class="recap-ligne recap-dim">
                ${p.inventaire.length > 0 ? p.inventaire.map((i) => i.objet.nom).join(", ") : "Aucun équipement"}
              </div>
            </div>
          `
            )
            .join("")}
        </div>
        ${recapCompagnon}
        <div class="actions">
          <button class="btn btn--fantome" data-annuler>Annuler</button>
          <button class="btn btn--primaire" data-jouer>⚔ Jouer</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    function fermer(resultat: boolean) {
      overlay.remove();
      resolve(resultat);
    }

    overlay.querySelector("[data-annuler]")!.addEventListener("click", () => fermer(false));
    overlay.querySelector("[data-jouer]")!.addEventListener("click", () => fermer(true));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) fermer(false);
    });
  });
}

/**
 * Point d'entrée du bouton "Lancer l'aventure" : avertit si l'équipe part avec peu ou pas
 * d'équipement (seuils choisis par l'utilisateur — 100 po = rien acheté, >75 po = très peu acheté),
 * fait valider la composition finale de l'équipe, puis transitionne vers la page de jeu.
 */
export async function demarrerAventure(equipe: Equipe): Promise<void> {
  if (equipe.orRestant === 100) {
    const continuer = await confirmerAvertissement({
      titre: "Pieds nus dans l'aventure ?",
      message:
        "L'équipe n'a acheté strictement aucun équipement — pas même une paire de bottes. Es-tu sûr(e) de vouloir partir à l'aventure les mains nues et les pieds nus ?",
      texteConfirmer: "Partir quand même",
    });
    if (!continuer) return;
  } else if (equipe.orRestant > 75) {
    const continuer = await confirmerAvertissement({
      titre: "Équipement très léger",
      message: `Il reste encore ${equipe.orRestant} po non dépensées — l'équipe part avec très peu de matériel. Continuer malgré tout ?`,
      texteConfirmer: "Continuer",
    });
    if (!continuer) return;
  }

  const valide = await ouvrirRecapAventure(equipe);
  if (!valide) return;

  await api.demarrerAventureEquipe(equipe.id);
  await jouerTransitionFumee(() => naviguer("/aventure"));
}
