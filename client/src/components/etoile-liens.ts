/**
 * Dessine le connecteur SVG ornemental de l'étoile de sélection de race : hub central et
 * 5 branches avec un médaillon (petit losange) à mi-chemin. Motif original, dessiné en interne
 * (pas de reprise de la croix de référence donnée par l'utilisateur, sous licence).
 */
const RAYON_LIGNE = 210;
const CENTRE = 280;

function pointSurCercle(angleDeg: number, rayon: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CENTRE + rayon * Math.sin(rad), y: CENTRE - rayon * Math.cos(rad) };
}

export function genererEtoileLiens(angles: number[]): string {
  const branches = angles
    .map((angle) => {
      const bout = pointSurCercle(angle, RAYON_LIGNE);
      const milieu = pointSurCercle(angle, RAYON_LIGNE * 0.55);
      return `
        <line x1="${CENTRE}" y1="${CENTRE}" x2="${bout.x.toFixed(1)}" y2="${bout.y.toFixed(1)}"
              class="etoile-branche" />
        <g transform="translate(${milieu.x.toFixed(1)}, ${milieu.y.toFixed(1)}) rotate(${angle})">
          <rect x="-8" y="-8" width="16" height="16" class="etoile-medaillon" transform="rotate(45)" />
        </g>
      `;
    })
    .join("");

  return `
    <svg class="etoile-svg" viewBox="0 0 560 560" aria-hidden="true">
      <defs>
        <radialGradient id="etoile-hub-degrade" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#f0cd6e" />
          <stop offset="45%" stop-color="#b0813f" />
          <stop offset="100%" stop-color="#5c4118" />
        </radialGradient>
      </defs>
      ${branches}
      <circle cx="${CENTRE}" cy="${CENTRE}" r="48" class="etoile-hub" />
      <circle cx="${CENTRE}" cy="${CENTRE}" r="48" fill="url(#etoile-hub-degrade)" opacity="0.9" />
      <circle cx="${CENTRE}" cy="${CENTRE}" r="48" class="etoile-hub-contour" />
      <circle cx="${CENTRE}" cy="${CENTRE}" r="15" class="etoile-hub-gemme" />
    </svg>
  `;
}

/** Angles (0° = haut, sens horaire) pour les 5 races, dans l'ordre du croquis utilisateur. */
export const ANGLES_RACES: Record<string, number> = {
  humain: 0,
  nain: 72,
  mage: 144,
  "demi-orc": 216,
  elfe: 288,
};
