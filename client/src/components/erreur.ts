/** Affiche une erreur dans une zone dédiée, via textContent (pas d'injection HTML). */
export function afficherErreur(zone: HTMLElement, erreur: unknown): void {
  const div = document.createElement("div");
  div.className = "erreur";
  div.textContent = erreur instanceof Error ? erreur.message : String(erreur);
  zone.replaceChildren(div);
}
