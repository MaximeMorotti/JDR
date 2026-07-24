/**
 * Transition plein écran jouée entre la création d'un personnage et la page équipe, thématisée
 * par race (voir vibe/design/brief_visuel_sprint1.md pour le détail visuel validé) :
 *  - Humain   : double porte de taverne en bois qui s'ouvre sur une lumière ambre
 *  - Elfe     : nuée de feuilles qui balaie l'écran de bas en haut, dérive façon courant d'air
 *  - Nain     : pluie de gemmes qui tombe de haut en bas, chute pesante avec scintillements
 *  - Demi-Orc : ossements projetés depuis plusieurs bords, tournoiement chaotique et heurté
 *  - Mage     : cercle runique qui se trace puis flashe (matérialisation rituelle en 3 temps)
 *
 * Chaque race construit son propre balisage dans un calque plein écran, animé en CSS pur (voir
 * style.css, section "Transitions thématiques par race"), qui se retire après une durée fixe
 * correspondant au temps total de son animation (portée à la CSS via --duree-totale).
 */

function alea(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// ---------- Elfe : feuilles ----------

const FEUILLES = [
  `<path d="M12 2 C5 7 4 16 12 22 C20 16 19 7 12 2 Z" fill="currentColor"/><path d="M12 4 V20" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>`,
  `<path d="M12 3 C7 6 5 13 11 21 C13 18 14 12 17 10 C15 8 13 6 12 3 Z" fill="currentColor"/>`,
];
const COULEURS_FEUILLE = ["#7c9a5e", "#c9a63f", "#e4d9b8", "#5f8c56"];

// ---------- Nain : gemmes ----------

const COULEURS_GEMME = ["#b0273a", "#2e5aa8", "#237a4e", "#c9862f", "#8a8a90"];

function gemmeSvg(): string {
  return `<polygon points="12,2 19,9 12,22 5,9" fill="currentColor"/><polygon points="12,2 19,9 12,9" fill="rgba(255,255,255,0.4)"/>`;
}

// ---------- Demi-Orc : ossements ----------

const OS = [
  `<path d="M5 9 C3 9 2 11 3.4 12.5 C2 14 3 16 5 16 C5.6 17.8 7.8 18.2 8.7 17 L15.3 17 C16.2 18.2 18.4 17.8 19 16 C21 16 22 14 20.6 12.5 C22 11 21 9 19 9 C18.4 7.2 16.2 6.8 15.3 8 L8.7 8 C7.8 6.8 5.6 7.2 5 9 Z" fill="currentColor"/>`,
  `<circle cx="12" cy="10" r="7" fill="currentColor"/><circle cx="9" cy="10" r="1.5" fill="#2a1c10"/><circle cx="15" cy="10" r="1.5" fill="#2a1c10"/><path d="M9.5 15 L9.5 18 M12 16 L12 19.5 M14.5 15 L14.5 18" stroke="#2a1c10" stroke-width="1.4" stroke-linecap="round"/>`,
];
const COULEURS_OS = ["#d8cdb8", "#c7bba4", "#8a4030"];

// ---------- Mage : runes ----------

const RUNES = [
  `<circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M12 5 V19" stroke="currentColor" stroke-width="1.4"/>`,
  `<path d="M12 3 L20 19 H4 Z" fill="none" stroke="currentColor" stroke-width="1.4"/>`,
  `<path d="M4 4 L20 20 M20 4 L4 20" stroke="currentColor" stroke-width="1.4"/>`,
  `<path d="M12 2 V8 M12 16 V22 M2 12 H8 M16 12 H22" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.4"/>`,
  `<path d="M6 6 L18 18 M6 18 L12 12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`,
];

// ---------- Génération de champs de particules (feuilles, gemmes) ----------

interface OptionsParticules {
  nombre: number;
  classeParticule: string;
  dureeBase: number;
  dureeVariation: number;
  delaiMax: number;
  tailleMin?: number;
  tailleMax?: number;
  /** "px" (défaut) = taille fixe ; "vw" = taille proportionnelle à la largeur d'écran, pour une
   * couverture visuelle cohérente quelle que soit la taille de la fenêtre (utile pour "inonder"
   * l'écran, ce qu'une taille en px fixe ne garantit pas sur un grand écran). */
  tailleUnite?: "px" | "vw";
  icone: () => string;
}

function champDeParticules(opts: OptionsParticules): string {
  let html = "";
  const unite = opts.tailleUnite ?? "px";
  for (let i = 0; i < opts.nombre; i++) {
    const delai = alea(0, opts.delaiMax).toFixed(2);
    const duree = (opts.dureeBase + Math.random() * opts.dureeVariation).toFixed(2);
    const x = alea(-4, 100).toFixed(1);
    const derive = alea(-20, 20).toFixed(1);
    const taille = alea(opts.tailleMin ?? 22, opts.tailleMax ?? 46);
    const tailleStr = unite === "vw" ? taille.toFixed(2) : Math.round(taille).toString();
    const tours = `${Math.random() < 0.5 ? "-" : ""}${alea(1, 2.4).toFixed(2)}turn`;
    html += `
      <div class="${opts.classeParticule}" style="--delai:${delai}s;--duree:${duree}s;--x:${x}vw;--derive:${derive}vw;--taille:${tailleStr}${unite}">
        <span class="particule-vent">
          <span class="particule-rotation" style="--tours:${tours}">${opts.icone()}</span>
        </span>
      </div>`;
  }
  return html;
}

// ---------- Génération des ossements (traversée d'un bord à un autre, aléatoire) ----------

function pointHorsEcran(bord: number): { x: number; y: number } {
  const long = alea(5, 95);
  const marge = alea(12, 22);
  if (bord === 0) return { x: long, y: -marge };
  if (bord === 1) return { x: 100 + marge, y: long };
  if (bord === 2) return { x: long, y: 100 + marge };
  return { x: -marge, y: long };
}

function champOs(nombre: number): string {
  let html = "";
  for (let i = 0; i < nombre; i++) {
    const bordDepart = Math.floor(Math.random() * 4);
    let bordArrivee = Math.floor(Math.random() * 4);
    while (bordArrivee === bordDepart) bordArrivee = Math.floor(Math.random() * 4);
    const depart = pointHorsEcran(bordDepart);
    const arrivee = pointHorsEcran(bordArrivee);
    const forme = OS[Math.floor(Math.random() * OS.length)];
    const couleur = COULEURS_OS[Math.floor(Math.random() * COULEURS_OS.length)];
    const delai = alea(0, 0.45).toFixed(2);
    const duree = alea(1.15, 1.6).toFixed(2);
    const taille = Math.round(alea(20, 36));
    const tours = `${Math.random() < 0.5 ? "-" : ""}${Math.round(alea(2, 4))}turn`;
    html += `
      <div class="particule particule--os" style="left:${depart.x.toFixed(1)}vw;top:${depart.y.toFixed(1)}vh;--dx:${(arrivee.x - depart.x).toFixed(1)}vw;--dy:${(arrivee.y - depart.y).toFixed(1)}vh;--delai:${delai}s;--duree:${duree}s;--taille:${taille}px">
        <span class="particule-rotation particule-rotation--hachee" style="--tours:${tours}"><svg viewBox="0 0 24 24" style="color:${couleur}">${forme}</svg></span>
      </div>`;
  }
  return html;
}

// ---------- Constructeurs par race ----------

function construireHumain(overlay: HTMLElement): number {
  overlay.classList.add("transition-humain");
  const poussieres = Array.from({ length: 3 })
    .map(() => `<span class="poussiere-taverne" style="--x:${alea(35, 65).toFixed(1)}%;--delai:${alea(0.2, 0.5).toFixed(2)}s"></span>`)
    .join("");
  const battant = (cote: "gauche" | "droit") => `
    <div class="battant battant--${cote}">
      <img class="image-porte" src="/img/transition/porte.webp" alt="" />
    </div>`;
  overlay.innerHTML = `
    <div class="lumiere-taverne"></div>
    ${battant("gauche")}
    ${battant("droit")}
    ${poussieres}
  `;
  return 2000;
}

function construireElfe(overlay: HTMLElement): number {
  overlay.classList.add("transition-particules", "transition-elfe");
  overlay.innerHTML = champDeParticules({
    nombre: 130,
    classeParticule: "particule particule--feuille",
    dureeBase: 1.8,
    dureeVariation: 0.9,
    delaiMax: 0.8,
    tailleMin: 3.2,
    tailleMax: 6.8,
    tailleUnite: "vw",
    icone: () => {
      const forme = FEUILLES[Math.floor(Math.random() * FEUILLES.length)];
      const couleur = COULEURS_FEUILLE[Math.floor(Math.random() * COULEURS_FEUILLE.length)];
      return `<svg viewBox="0 0 24 24" style="color:${couleur}">${forme}</svg>`;
    },
  });
  return 2350;
}

function construireNain(overlay: HTMLElement): number {
  overlay.classList.add("transition-particules", "transition-nain");
  overlay.innerHTML = champDeParticules({
    nombre: 18,
    classeParticule: "particule particule--gemme",
    dureeBase: 1.4,
    dureeVariation: 0.65,
    delaiMax: 0.55,
    icone: () => {
      const couleur = COULEURS_GEMME[Math.floor(Math.random() * COULEURS_GEMME.length)];
      return `<svg viewBox="0 0 24 24" style="color:${couleur}">${gemmeSvg()}</svg>`;
    },
  });
  return 2050;
}

function construireDemiOrc(overlay: HTMLElement): number {
  overlay.classList.add("transition-particules", "transition-demiorc");
  overlay.innerHTML = `<div class="brume-impact"></div>${champOs(14)}`;
  return 1800;
}

function construireMage(overlay: HTMLElement): number {
  overlay.classList.add("transition-mage");
  const nombre = 10;
  const runes = Array.from({ length: nombre })
    .map((_, i) => {
      const angle = (360 / nombre) * i;
      const rayon = alea(24, 30).toFixed(1);
      const delai = (1.0 + (i / nombre) * 0.9).toFixed(2);
      const forme = RUNES[i % RUNES.length];
      return `
        <span class="rune-mage" style="--angle:${angle}deg;--rayon:${rayon}vh;--delai:${delai}s">
          <svg viewBox="0 0 24 24">${forme}</svg>
        </span>`;
    })
    .join("");
  overlay.innerHTML = `
    <div class="voile-mage"></div>
    <svg class="cercle-mage" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" /></svg>
    ${runes}
    <div class="flash-mage"></div>
  `;
  return 2600;
}

const CONSTRUCTEURS: Record<string, (overlay: HTMLElement) => number> = {
  humain: construireHumain,
  elfe: construireElfe,
  nain: construireNain,
  "demi-orc": construireDemiOrc,
  mage: construireMage,
};

/**
 * Joue la transition plein écran, puis résout la Promise. `auMilieu` (ex: la navigation vers la
 * page suivante) est déclenché juste avant le début du fondu de sortie du calque (85% de la durée
 * totale, cf. `fondu-overlay-transition`), pendant qu'il est encore opaque — pour que la
 * disparition du calque révèle la nouvelle page plutôt que l'ancienne (sinon on voit un flash de
 * la page de départ juste avant la coupure, la transition perd tout son sens).
 */
export function jouerTransitionRace(raceId: string, auMilieu?: () => void): Promise<void> {
  const construire = CONSTRUCTEURS[raceId] ?? construireHumain;
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "overlay-transition-race";
    const duree = construire(overlay);
    overlay.style.setProperty("--duree-totale", `${duree}ms`);
    document.body.appendChild(overlay);
    const debutFonduSortie = Math.round(duree * 0.85);
    window.setTimeout(() => auMilieu?.(), debutFonduSortie);
    window.setTimeout(() => {
      overlay.remove();
      resolve();
    }, duree);
  });
}
