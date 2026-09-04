import { echapperHtml } from "./echapper-html";

/**
 * Bandeau d'onglets pour naviguer entre les personnages de l'équipe (boutique, compétences...).
 * Factorisé car identique sur toutes les pages par-personnage.
 */
export function afficherOngletsPersonnages(
  conteneur: HTMLElement,
  personnages: { id: string; pseudo: string }[],
  personnageActifId: string,
  onSelectionner: (id: string) => void
): void {
  conteneur.innerHTML = personnages
    .map(
      (p) =>
        `<button type="button" class="onglet-personnage ${p.id === personnageActifId ? "actif" : ""}" data-id="${p.id}">${echapperHtml(p.pseudo)}</button>`
    )
    .join("");
  conteneur.querySelectorAll<HTMLButtonElement>(".onglet-personnage").forEach((btn) => {
    btn.addEventListener("click", () => onSelectionner(btn.dataset["id"]!));
  });
}
