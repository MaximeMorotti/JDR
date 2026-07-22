/**
 * Transition plein écran entre la création d'un personnage et la page équipe, thématisée
 * par race. Version simplifiée (couleur + symbole + balayage CSS) — à remplacer par une
 * illustration animée dédiée par race quand l'art sera disponible :
 *  - Humain  : porte de taverne qui s'ouvre
 *  - Elfe    : feuilles qui balaient l'écran de bas en haut
 *  - Nain    : pierres précieuses qui balaient l'écran de haut en bas
 *  - Demi-Orc: ossements
 *  - Mage    : runes
 */
const THEME_PAR_RACE: Record<string, { couleur: string; symbole: string; sens: "haut" | "bas" }> = {
  humain: { couleur: "#7a5a3a", symbole: "🚪", sens: "bas" },
  elfe: { couleur: "#3f6b45", symbole: "🍃", sens: "haut" },
  nain: { couleur: "#4a5a7a", symbole: "💎", sens: "bas" },
  "demi-orc": { couleur: "#5a3a3a", symbole: "🦴", sens: "haut" },
  mage: { couleur: "#5a3a7a", symbole: "🔮", sens: "bas" },
};

export function jouerTransitionRace(raceId: string): Promise<void> {
  const theme = THEME_PAR_RACE[raceId] ?? { couleur: "#333", symbole: "✨", sens: "bas" };

  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = `overlay-transition overlay-transition--${theme.sens}`;
    overlay.style.setProperty("--couleur-transition", theme.couleur);
    overlay.innerHTML = `<span class="symbole-transition">${theme.symbole}</span>`;
    document.body.appendChild(overlay);

    window.setTimeout(() => {
      overlay.classList.add("overlay-transition--sortie");
      window.setTimeout(() => {
        overlay.remove();
        resolve();
      }, 350);
    }, 550);
  });
}
