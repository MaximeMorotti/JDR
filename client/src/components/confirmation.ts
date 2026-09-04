/**
 * Ouvre un overlay de confirmation déjà construit (doit contenir `[data-annuler]` et
 * `[data-confirmer]`) : le pose dans le DOM, câble les boutons et le clic hors-boîte, et résout
 * la promesse selon le choix du joueur. Factorisé car identique pour toutes les popups de
 * confirmation/avertissement/récapitulatif (cf. `ouvrirRecapAventure` dans lancement-aventure.ts).
 */
export function ouvrirOverlayConfirmation(overlay: HTMLElement): Promise<boolean> {
  return new Promise((resolve) => {
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
 * Popup de confirmation thématique (remplace window.confirm, incohérent avec le style du jeu).
 * Retourne une Promise<boolean> résolue selon le choix du joueur.
 */
export function confirmerSuppression(message: string): Promise<boolean> {
  const overlay = document.createElement("div");
  overlay.className = "overlay-confirmation";
  overlay.innerHTML = `
    <div class="boite-confirmation">
      <p></p>
      <div class="actions" style="margin-top:16px">
        <button class="btn btn--fantome" data-annuler>Annuler</button>
        <button class="btn btn--danger" data-confirmer>Supprimer</button>
      </div>
    </div>
  `;
  overlay.querySelector("p")!.textContent = message;
  return ouvrirOverlayConfirmation(overlay);
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
  const overlay = document.createElement("div");
  overlay.className = "overlay-confirmation";
  overlay.innerHTML = `
    <div class="boite-confirmation boite-avertissement">
      <h3></h3>
      <p></p>
      <div class="actions" style="margin-top:16px">
        <button class="btn btn--fantome" data-annuler>Annuler</button>
        <button class="btn btn--attention" data-confirmer></button>
      </div>
    </div>
  `;
  overlay.querySelector("h3")!.textContent = options.titre;
  overlay.querySelector("p")!.textContent = options.message;
  overlay.querySelector("[data-confirmer]")!.textContent = options.texteConfirmer;
  return ouvrirOverlayConfirmation(overlay);
}
