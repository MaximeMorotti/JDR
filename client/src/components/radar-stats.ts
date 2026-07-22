/**
 * Graphique radar des 8 caractéristiques, façon le radar du Bestiaire (échelle fixe 0-20 pour
 * rester comparable entre races). Rendu en SVG, style faceté (octogones) plutôt que cercles lisses
 * pour rester cohérent avec le thème gravé/anguleux du reste de l'interface.
 */
const NOMS_STATS: [cle: string, label: string][] = [
  ["force", "For"],
  ["dexterite", "Dex"],
  ["vitalite", "Vit"],
  ["charisme", "Cha"],
  ["intelligence", "Int"],
  ["sagesse", "Sag"],
  ["chance", "Cha."],
  ["perception", "Per"],
];

const ECHELLE_MAX = 20;
const CENTRE = 150;
const RAYON_MAX = 105;

function pointAxe(index: number, rayon: number) {
  const angle = (index * 360) / NOMS_STATS.length - 90;
  const rad = (angle * Math.PI) / 180;
  return { x: CENTRE + rayon * Math.cos(rad), y: CENTRE + rayon * Math.sin(rad) };
}

function polygone(rayonParAxe: number[]): string {
  return rayonParAxe.map((r, i) => pointAxe(i, r)).map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

export function genererRadarSVG(stats: Record<string, number>): string {
  const anneaux = [0.25, 0.5, 0.75, 1].map((f) => `<polygon points="${polygone(NOMS_STATS.map(() => RAYON_MAX * f))}" class="radar-anneau" />`).join("");
  const axes = NOMS_STATS.map((_, i) => {
    const p = pointAxe(i, RAYON_MAX);
    return `<line x1="${CENTRE}" y1="${CENTRE}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" class="radar-axe" />`;
  }).join("");
  const labels = NOMS_STATS.map(([cle, label], i) => {
    const p = pointAxe(i, RAYON_MAX + 20);
    return `<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" class="radar-label" text-anchor="middle" dominant-baseline="middle">${label}<tspan x="${p.x.toFixed(1)}" dy="13" class="radar-valeur">${stats[cle] ?? 0}</tspan></text>`;
  }).join("");
  const valeurs = polygone(NOMS_STATS.map(([cle]) => (Math.min(stats[cle] ?? 0, ECHELLE_MAX) / ECHELLE_MAX) * RAYON_MAX));

  return `
    <svg class="radar-svg" viewBox="0 0 300 300">
      ${anneaux}
      ${axes}
      <polygon points="${valeurs}" class="radar-forme" />
      ${labels}
    </svg>
  `;
}
