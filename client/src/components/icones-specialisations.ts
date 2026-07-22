/** Petites icônes SVG (trait) pour illustrer chaque spécialisation, dessinées en interne. */
const TRAIT = `fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"`;

const ICONES: Record<string, string> = {
  // ---------- Guerrier ----------
  Paladin: `<path ${TRAIT} d="M12 2 L20 6 V12 C20 17 16.5 20.5 12 22 C7.5 20.5 4 17 4 12 V6 Z" /><path ${TRAIT} d="M12 8 V16 M8.5 12 H15.5" />`,
  Escrimeur: `<path ${TRAIT} d="M4 20 L18 6 M18 6 L22 2 M18 6 L20 8 M4 20 L2 18 M4 20 L6 22" />`,
  "Maître d'armes": `<path ${TRAIT} d="M3 21 L11 13 M9 15 L15 21 M15 21 L18 21 L18 18 M11 13 L14 10 M14 10 L21 3 M14 10 L17 13" />`,
  "Maître martial": `<circle cx="12" cy="12" r="9" ${TRAIT} /><path ${TRAIT} d="M9 12 L11 14 L15 9" />`,

  // ---------- Voleur ----------
  Assassin: `<path ${TRAIT} d="M6 18 L16 8 L18 6 L20 8 L18 10 L8 20 Z M6 18 L4 20" />`,
  Chapardeur: `<path ${TRAIT} d="M3 17 C7 17 6 12 10 12 C14 12 13 7 17 7 M17 7 L14 7 M17 7 L17 10" />`,
  Lanceur: `<path ${TRAIT} d="M3 21 L10 14 M8 21 L14 15 M13 21 L18 16 M17 4 L21 8 L14 15" />`,
  Saboteur: `<circle cx="12" cy="14" r="7" ${TRAIT} /><path ${TRAIT} d="M8 14 L16 14 M12 10 L12 18 M9 5 L11 8 M15 5 L13 8" />`,

  // ---------- Barde ----------
  Troubadour: `<circle cx="7" cy="18" r="3" ${TRAIT} /><path ${TRAIT} d="M10 18 V5 L18 3 V16" /><circle cx="15" cy="16" r="3" ${TRAIT} />`,
  Ménestrel: `<circle cx="9" cy="16" r="5" ${TRAIT} /><path ${TRAIT} d="M12.5 12.5 L18 3 M18 3 L21 4 M18 3 L17 6" />`,
  Orateur: `<path ${TRAIT} d="M4 5 H20 V15 H10 L6 19 V15 H4 Z" /><path ${TRAIT} d="M8 9 H16 M8 12 H13" />`,
  "Danseur gymnaste": `<circle cx="12" cy="4" r="2" ${TRAIT} /><path ${TRAIT} d="M12 6 V13 M12 9 L7 7 M12 9 L17 12 M12 13 L8 20 M12 13 L16 17" />`,

  // ---------- Mage — Élémentaire ----------
  Pyromancien: `<path ${TRAIT} d="M12 2 C9 7 6 9 6 13 C6 17.5 9 21 12 21 C15 21 18 17.5 18 13 C18 9 15 7 12 2 Z M12 12 C10.5 14 10 15.5 10 17 C10 18.5 11 19.5 12 19.5 C13 19.5 14 18.5 14 17 C14 15.5 13.5 14 12 12 Z" />`,
  Hydromancien: `<path ${TRAIT} d="M12 2 C7 9 4 13 4 16.5 C4 20 7.5 22 12 22 C16.5 22 20 20 20 16.5 C20 13 17 9 12 2 Z" />`,
  Aéromancien: `<path ${TRAIT} d="M3 8 H15 A3 3 0 1 0 12 5 M3 14 H18 A3 3 0 1 1 15 17 M3 20 H10" />`,
  Géomancien: `<path ${TRAIT} d="M2 20 L9 6 L13 14 L16 9 L22 20 Z" />`,

  // ---------- Mage — Noire ----------
  Nécromancien: `<circle cx="12" cy="10" r="7" ${TRAIT} /><path ${TRAIT} d="M9 9 L9.5 10 M14.5 9 L15 10 M9 14 H15 M12 17 V21 M9 21 H15" />`,
  Maléficien: `<circle cx="12" cy="12" r="8" ${TRAIT} /><path ${TRAIT} d="M12 8 V12 L15 15" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />`,
  Démonologue: `<path ${TRAIT} d="M12 2 L20 18 H4 Z" /><path ${TRAIT} d="M12 2 L6 12 H18 Z" /><circle cx="12" cy="14" r="2" ${TRAIT} />`,
  Umbrancien: `<path ${TRAIT} d="M15 3 C10 3 6 7 6 12 C6 17 10 21 15 21 C11.5 19 9 15.8 9 12 C9 8.2 11.5 5 15 3 Z" />`,

  // ---------- Mage — Blanche ----------
  Luminomancien: `<circle cx="12" cy="12" r="4" ${TRAIT} /><path ${TRAIT} d="M12 2 V5 M12 19 V22 M2 12 H5 M19 12 H22 M4.9 4.9 L7 7 M17 17 L19.1 19.1 M4.9 19.1 L7 17 M17 7 L19.1 4.9" />`,
  Guérisseur: `<path ${TRAIT} d="M12 20 C6 15.5 3 12 3 8.5 C3 5.8 5.2 4 7.5 4 C9.2 4 10.7 5 12 7 C13.3 5 14.8 4 16.5 4 C18.8 4 21 5.8 21 8.5 C21 12 18 15.5 12 20 Z" /><path ${TRAIT} d="M12 8 V13 M9.5 10.5 H14.5" />`,
  Exorciste: `<path ${TRAIT} d="M12 2 L21 6 V12 C21 17.5 17 20.8 12 22 C7 20.8 3 17.5 3 12 V6 Z" /><path ${TRAIT} d="M12 7 V17 M8 12 H16" />`,
  Oracle: `<path ${TRAIT} d="M2 12 C5 6 9 4 12 4 C15 4 19 6 22 12 C19 18 15 20 12 20 C9 20 5 18 2 12 Z" /><circle cx="12" cy="12" r="3" ${TRAIT} />`,
  Astromancien: `<path ${TRAIT} d="M12 2 L14.2 9.2 L21.5 9.2 L15.7 13.6 L17.8 20.8 L12 16.4 L6.2 20.8 L8.3 13.6 L2.5 9.2 L9.8 9.2 Z" />`,

  // ---------- Berserker ----------
  "Brise-crâne": `<circle cx="12" cy="11" r="7" ${TRAIT} /><path ${TRAIT} d="M9 10 L9.5 11 M14.5 10 L15 11 M9 14 H15 M6 5 L18 17" />`,
  Sauvage: `<path ${TRAIT} d="M4 20 L9 8 M9 20 L12 6 M14 20 L16 8 M19 20 L20 11" />`,
  "berserker:Traqueur": `<path ${TRAIT} d="M12 13 C10 13 9 15 9 17 C9 19 10.5 20 12 20 C13.5 20 15 19 15 17 C15 15 14 13 12 13 Z M8 8 C7 8 6.3 9 6.3 10 C6.3 11 7 11.8 8 11.8 C9 11.8 9.7 11 9.7 10 M16 8 C17 8 17.7 9 17.7 10 C17.7 11 17 11.8 16 11.8 C15 11.8 14.3 11 14.3 10" />`,
  Colosse: `<circle cx="8" cy="8" r="3" ${TRAIT} /><circle cx="16" cy="8" r="3" ${TRAIT} /><path ${TRAIT} d="M8 11 L6 20 M16 11 L18 20 M8 11 C8 15 16 15 16 11" />`,

  // ---------- Ingénieur ----------
  Mineur: `<path ${TRAIT} d="M4 14 C4 8 8 4 14 4 C13 8 13 10 20 10 C18 15 14 17 10 17 Z M10 17 L4 22" />`,
  Forgeron: `<path ${TRAIT} d="M3 15 L9 9 L11 11 L5 17 Z M9 9 L13 5 L19 3 L21 5 L19 11 L15 15 L13 13" />`,
  Artificier: `<circle cx="12" cy="12" r="3" ${TRAIT} /><path ${TRAIT} d="M12 3 L12 6 M12 18 L12 21 M3 12 L6 12 M18 12 L21 12 M5.6 5.6 L7.8 7.8 M16.2 16.2 L18.4 18.4 M5.6 18.4 L7.8 16.2 M16.2 7.8 L18.4 5.6" />`,
  Démolisseur: `<circle cx="10" cy="14" r="7" ${TRAIT} /><path ${TRAIT} d="M14.5 9.5 L18 6 M18 6 L17 3 M18 6 L21 7" />`,

  // ---------- Chasseur sylvestre ----------
  Archer: `<path ${TRAIT} d="M6 3 C6 3 6 21 6 21 C13 18 13 6 6 3 Z" /><path ${TRAIT} d="M6 12 L21 12 M18 9 L21 12 L18 15" />`,
  "chasseur-sylvestre:Traqueur": `<path ${TRAIT} d="M12 13 C10 13 9 15 9 17 C9 19 10.5 20 12 20 C13.5 20 15 19 15 17 C15 15 14 13 12 13 Z M8 8 C7 8 6.3 9 6.3 10 C6.3 11 7 11.8 8 11.8 M16 8 C17 8 17.7 9 17.7 10 C17.7 11 17 11.8 16 11.8" />`,
  "Maître des bêtes": `<path ${TRAIT} d="M6 20 C6 15 9 12 12 12 C15 12 18 15 18 20 M4 9 C3 9 2.3 10 2.3 11 C2.3 12 3 12.8 4 12.8 M20 9 C21 9 21.7 10 21.7 11 C21.7 12 21 12.8 20 12.8 M9 8 C8.4 6.6 8.7 5 9.5 4 M15 8 C15.6 6.6 15.3 5 14.5 4" />`,
  "Gardien sylvestre": `<path ${TRAIT} d="M12 2 C7 6 5 10 5 13 C5 17 8 19 12 19 C16 19 19 17 19 13 C19 10 17 6 12 2 Z M12 19 V22" />`,
};

const ICONE_DEFAUT = `<circle cx="12" cy="12" r="7" ${TRAIT} />`;

/**
 * "Traqueur" existe à la fois chez le Berserker et le Chasseur sylvestre — clé composite
 * `classeId:nom` pour ces deux-là afin d'éviter la collision, nom simple pour les 35 autres.
 */
export function iconeSpecialisation(classeId: string, nom: string): string {
  const svg = ICONES[`${classeId}:${nom}`] ?? ICONES[nom] ?? ICONE_DEFAUT;
  return `<svg class="icone-spec" viewBox="0 0 24 24" width="26" height="26">${svg}</svg>`;
}
