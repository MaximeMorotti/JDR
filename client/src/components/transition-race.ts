/**
 * Transition plein écran jouée entre la création d'un personnage et la page équipe, thématisée
 * par race (voir vibe/design/brief_visuel_sprint1.md pour le détail visuel validé) :
 *  - Humain   : double porte de taverne en bois qui s'ouvre sur une lumière ambre
 *  - Elfe     : nuée de feuilles qui balaie l'écran de bas en haut, dérive façon courant d'air
 *  - Nain     : pluie de gemmes qui tombe de haut en bas, chute pesante avec scintillements
 *  - Demi-Orc : pile d'ossements qui tombe au centre-bas de l'écran puis explose, projetant des
 *              os dans tout l'écran pendant que le fond s'assombrit
 *  - Mage     : cercle runique qui se trace puis flashe (matérialisation rituelle en 3 temps)
 *
 * Chaque race construit son propre balisage dans un calque plein écran, animé en CSS pur (voir
 * style.css, section "Transitions thématiques par race"), qui se retire après une durée fixe
 * correspondant au temps total de son animation (portée à la CSS via --duree-totale).
 */

function alea(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// ---------- Elfe : feuilles (illustrations réelles, cf. docs/img/transition/, détourées par
// client/scripts/detourer-feuilles.mjs) ----------

const FEUILLES_IMG = [
  "/img/transition/feuilles/orange.webp",
  "/img/transition/feuilles/verte.webp",
  "/img/transition/feuilles/elfique.webp",
];

// ---------- Nain : gemmes (illustrations réelles, cf. docs/img/transition/, détourées par
// client/scripts/detourer-gemmes.mjs — amas de cristaux sur roche noire) ----------

const GEMMES_IMG = [
  "/img/transition/gemmes/ruby.webp",
  "/img/transition/gemmes/saphir.webp",
  "/img/transition/gemmes/emeraude.webp",
  "/img/transition/gemmes/ambre.webp",
  "/img/transition/gemmes/pierre.webp",
];

// ---------- Demi-Orc : ossements (illustrations réelles, cf. docs/img/transition/os/, détourées
// à la main par l'utilisateur, converties par client/scripts/convertir-os.mjs) ----------

const OS_IMG = [
  "/img/transition/os/crane.webp",
  "/img/transition/os/femur.webp",
  "/img/transition/os/main.webp",
  "/img/transition/os/tibia.webp",
  "/img/transition/os/torax.webp",
];
const TAS_OS_IMG = "/img/transition/os/tas.webp";

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

// ---------- Génération de l'explosion d'ossements (radiale depuis un point d'origine fixe,
// façon pile qui explose — pas une simple traversée d'un bord à un autre) ----------

function pointAleatoireEcran(): { x: number; y: number } {
  return { x: alea(-8, 108), y: alea(-15, 108) };
}

function explosionOs(nombre: number, origineX: number, origineY: number): string {
  let html = "";
  for (let i = 0; i < nombre; i++) {
    const dest = pointAleatoireEcran();
    const src = OS_IMG[Math.floor(Math.random() * OS_IMG.length)];
    // Le délai démarre après l'atterrissage de la pile (~0.45s, cf. .pile-os / chute-pile) —
    // les os n'explosent qu'une fois l'impact survenu, pas avant. Durée doublée (vitesse divisée
    // par 2) par rapport à la première passe, jugée trop rapide.
    const delai = alea(0.45, 0.95).toFixed(2);
    const duree = alea(1.7, 2.6).toFixed(2);
    const taille = alea(2.8, 5.8).toFixed(2);
    const tours = `${Math.random() < 0.5 ? "-" : ""}${Math.round(alea(2, 5))}turn`;
    html += `
      <div class="particule particule--os" style="left:${origineX}vw;top:${origineY}vh;--dx:${(dest.x - origineX).toFixed(1)}vw;--dy:${(dest.y - origineY).toFixed(1)}vh;--delai:${delai}s;--duree:${duree}s;--taille:${taille}vw">
        <span class="particule-rotation particule-rotation--hachee" style="--tours:${tours}"><img src="${src}" alt="" style="width:100%;height:100%;object-fit:contain;display:block;" /></span>
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
      const src = FEUILLES_IMG[Math.floor(Math.random() * FEUILLES_IMG.length)];
      return `<img src="${src}" alt="" style="width:100%;height:100%;object-fit:contain;display:block;" />`;
    },
  });
  return 2350;
}

function construireNain(overlay: HTMLElement): number {
  overlay.classList.add("transition-particules", "transition-nain");
  overlay.innerHTML = champDeParticules({
    nombre: 110,
    classeParticule: "particule particule--gemme",
    dureeBase: 1.4,
    dureeVariation: 0.65,
    delaiMax: 0.7,
    tailleMin: 3.4,
    tailleMax: 7.2,
    tailleUnite: "vw",
    icone: () => {
      const src = GEMMES_IMG[Math.floor(Math.random() * GEMMES_IMG.length)];
      return `<img src="${src}" alt="" style="width:100%;height:100%;object-fit:contain;display:block;" />`;
    },
  });
  return 2050;
}

function construireDemiOrc(overlay: HTMLElement): number {
  overlay.classList.add("transition-particules", "transition-demiorc");
  const origineX = 50;
  const origineY = 96;
  const pile = `<div class="pile-os"><img src="${TAS_OS_IMG}" alt="" style="width:100%;height:100%;object-fit:contain;display:block;" /></div>`;
  overlay.innerHTML = `
    <div class="noircissement-os"></div>
    ${pile}
    ${explosionOs(100, origineX, origineY)}
  `;
  return 1900;
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
