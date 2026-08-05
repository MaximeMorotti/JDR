/**
 * Popup de confirmation thématique (remplace window.confirm, incohérent avec le style du jeu).
 * Retourne une Promise<boolean> résolue selon le choix du joueur.
 */
export function confirmerSuppression(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "overlay-confirmation";
    overlay.innerHTML = `
      <div class="boite-confirmation">
        <p>${message}</p>
        <div class="actions" style="margin-top:16px">
          <button class="btn btn--fantome" data-annuler>Annuler</button>
          <button class="btn btn--danger" data-confirmer>Supprimer</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    function fermer(resultat: boolean) {
      overlay.remove();
      resolve(resultat);
    }

    overlay.querySelector("[data-annuler]")!.addEventListener("click", () => fermer(false));
    overlay.querySelector("[data-confirmer]")!.addEventListener("click", () => fermer(true));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) fermer(false);
    });
  });
}

/**
 * Popup d'avertissement générique (ex: équipe partant sans ou avec peu d'équipement avant de
 * lancer l'aventure) — même mécanique que confirmerSuppression mais message/bouton/couleur
 * personnalisables, et un bouton "confirmer" qui n'est pas forcément destructif (--attention par
 * défaut plutôt que --danger).
 */
export function confirmerAvertissement(options: {
  titre: string;
  message: string;
  texteConfirmer: string;
}): Promise<boolean> {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "overlay-confirmation";
    overlay.innerHTML = `
      <div class="boite-confirmation boite-avertissement">
        <h3>${options.titre}</h3>
        <p>${options.message}</p>
        <div class="actions" style="margin-top:16px">
          <button class="btn btn--fantome" data-annuler>Annuler</button>
          <button class="btn btn--attention" data-confirmer>${options.texteConfirmer}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    function fermer(resultat: boolean) {
      overlay.remove();
      resolve(resultat);
    }

    overlay.querySelector("[data-annuler]")!.addEventListener("click", () => fermer(false));
    overlay.querySelector("[data-confirmer]")!.addEventListener("click", () => fermer(true));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) fermer(false);
    });
  });
}
