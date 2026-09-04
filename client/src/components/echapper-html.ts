/**
 * Échappe une chaîne pour une insertion sûre dans un gabarit HTML (innerHTML) — texte ou
 * attribut. À utiliser pour toute donnée saisie par le joueur (pseudo, nom d'équipe...) avant
 * de l'interpoler dans un template literal assigné à innerHTML.
 */
export function echapperHtml(valeur: string): string {
  return valeur
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
