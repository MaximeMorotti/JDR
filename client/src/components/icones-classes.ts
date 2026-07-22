/** Petites icônes SVG (trait doré) pour illustrer chaque classe, dessinées en interne. */
const TRAIT = `fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"`;

const ICONES: Record<string, string> = {
  // Épée
  guerrier: `<path ${TRAIT} d="M12 2 L12 15 M8 6 L16 6 M9 15 L15 15 L15 18 L9 18 Z M12 18 L12 22" />`,
  // Dague double
  voleur: `<path ${TRAIT} d="M8 2 L11 9 L8 12 L5 9 Z M16 12 L19 15 L16 22 L13 15 Z M11 9 L13 15" />`,
  // Luth
  barde: `<circle cx="9" cy="16" r="5" ${TRAIT} /><path ${TRAIT} d="M12.5 12.5 L18 3 M18 3 L21 4 M18 3 L17 6" />`,
  // Grimoire / orbe
  mage: `<circle cx="12" cy="9" r="4.5" ${TRAIT} /><path ${TRAIT} d="M5 22 C5 17 8 15 12 15 C16 15 19 17 19 22" /><path ${TRAIT} d="M12 6 L12 9 L14 10.5" />`,
  // Hache
  berserker: `<path ${TRAIT} d="M12 3 L12 21" /><path ${TRAIT} d="M12 4 C6 4 4 8 4 10 C7 10 10 9 12 7 C14 9 17 10 20 10 C20 8 18 4 12 4 Z" />`,
  // Marteau / engrenage
  ingenieur: `<circle cx="12" cy="12" r="3" ${TRAIT} /><path ${TRAIT} d="M12 3 L12 6 M12 18 L12 21 M3 12 L6 12 M18 12 L21 12 M5.6 5.6 L7.8 7.8 M16.2 16.2 L18.4 18.4 M5.6 18.4 L7.8 16.2 M16.2 7.8 L18.4 5.6" />`,
  // Arc et flèche
  "chasseur-sylvestre": `<path ${TRAIT} d="M6 3 C6 3 6 21 6 21 C13 18 13 6 6 3 Z" /><path ${TRAIT} d="M6 12 L21 12 M18 9 L21 12 L18 15" />`,
};

const ICONE_DEFAUT = `<circle cx="12" cy="12" r="7" ${TRAIT} />`;

export function icone(classeId: string): string {
  return `<svg class="icone-classe" viewBox="0 0 24 24" width="20" height="20">${ICONES[classeId] ?? ICONE_DEFAUT}</svg>`;
}
