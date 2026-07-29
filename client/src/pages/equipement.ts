import { api, type Objet, type Personnage } from "../api";
import { naviguer } from "../router";
import { state } from "../state";

/** Les 3 classes de Mage — voir écart documenté dans CLAUDE.md (le Codex modélise "le Mage" comme
 * 1 classe à 3 écoles ; implémenté ici comme 3 classes indépendantes). Toutes démarrent avec le
 * même stuff verrouillé au Sprint 1. */
const CLASSES_MAGE = ["mage-elementaire", "mage-noir", "mage-blanc"];

const LABEL_SLOT: Record<string, string> = {
  TETE: "Tête",
  COLLIER: "Collier",
  CAPE: "Cape",
  TORSE: "Torse",
  BRAS: "Bras",
  BAS: "Bas",
  CEINTURE: "Ceinture",
  PIED: "Pied",
  // Renommé "Carquois" → "Projectile" (décision utilisateur) : le carquois lui-même reste un achat
  // séparé et optionnel (on peut avoir un arc sans carquois) ; ce slot représente plus largement
  // tout ce qui se lance/tire (couteaux de lancer, munitions...), d'où le nom plus générique.
  CARQUOIS: "Projectile",
  BRACELET_1: "Bracelet 1",
  BRACELET_2: "Bracelet 2",
  ANNEAU_1: "Anneau 1",
  ANNEAU_2: "Anneau 2",
  MAIN_DROITE: "Main droite (arme)",
  MAIN_GAUCHE: "Main gauche (arme/bouclier)",
};

/**
 * Illustrations d'équipement fournies par l'utilisateur (docs/img/boutique/), une par emplacement,
 * toutes calées sur le même canevas 1024×1024 que `manequin.webp` — empilées par-dessus dans
 * l'ordre du tableau (dos → devant), elles "rhabillent" le mannequin de base. `ox`/`oy` = centre
 * réel de chaque illustration (mesuré par scan du canal alpha, script one-off) — sert de
 * `transform-origin` au survol pour que le zoom ×1.05 grossisse depuis SON propre centre et non
 * celui de la carte entière (sinon les pièces loin du centre — tête, pieds — dérivent au lieu de
 * grossir sur place).
 *
 * Le mannequin fait face au joueur : sa main DROITE est donc à GAUCHE de l'image (et inversement)
 * — piège classique, pris en compte ici (`arme-2.webp`, centré à gauche, = MAIN_DROITE).
 *
 * `CAPE` a deux calques distincts qui réagissent ENSEMBLE au survol : `cape-back` (le tissu qui
 * flotte dans le dos, visible sur les côtés dès ce calque bas) et `cape-front` (le fermoir au col,
 * qui doit rester visible PAR-DESSUS le torse — placé en dernier, donc au-dessus de tout, comme
 * demandé explicitement).
 */
const PARTIES_MANNEQUIN: { slot: string; src: string; ox: number; oy: number }[] = [
  { slot: "CAPE", src: "cape-back", ox: 50.1, oy: 60.7 },
  { slot: "TORSE", src: "torse", ox: 49.9, oy: 31.4 },
  { slot: "BRAS", src: "bras", ox: 50.1, oy: 36.5 },
  { slot: "BAS", src: "bas", ox: 50.0, oy: 66.1 },
  { slot: "PIED", src: "pied", ox: 50.0, oy: 89.6 },
  { slot: "CEINTURE", src: "ceinture", ox: 49.9, oy: 44.4 },
  { slot: "CARQUOIS", src: "carquois", ox: 37.2, oy: 13.6 },
  { slot: "TETE", src: "tete", ox: 50.0, oy: 10.8 },
  { slot: "COLLIER", src: "collier", ox: 50.0, oy: 18.4 },
  { slot: "BRACELET_1", src: "bracelet-1", ox: 70.4, oy: 45.1 },
  { slot: "BRACELET_2", src: "bracelet-2", ox: 29.7, oy: 44.9 },
  // Main/arme AVANT anneau : les anneaux se portent par-dessus la main qui tient l'arme, sinon
  // leur illumination au survol reste invisible sous l'image de la main (bug constaté).
  { slot: "MAIN_DROITE", src: "arme-2", ox: 26.2, oy: 49.6 },
  { slot: "MAIN_GAUCHE", src: "arme-1", ox: 73.8, oy: 49.6 },
  { slot: "ANNEAU_1", src: "anneau-1", ox: 75.9, oy: 50.3 },
  { slot: "ANNEAU_2", src: "anneau-2", ox: 24.1, oy: 50.2 },
  { slot: "CAPE", src: "cape-front", ox: 49.8, oy: 22.5 },
];

const TOUS_LES_SLOTS = Object.keys(LABEL_SLOT);

/** Objets ObjetRef.emplacement dont l'emplacement réel se choisit parmi 2 slots identiques. */
const FAMILLES: Record<string, string[]> = {
  ANNEAU: ["ANNEAU_1", "ANNEAU_2"],
  BRACELET: ["BRACELET_1", "BRACELET_2"],
};

const FILTRES_TYPE: { valeur: string; label: string }[] = [
  { valeur: "TOUS", label: "Tous les objets" },
  { valeur: "ARME", label: "Armes" },
  { valeur: "ARMURE", label: "Armures" },
  { valeur: "BOUCLIER", label: "Boucliers" },
  { valeur: "ACCESSOIRE", label: "Accessoires" },
  { valeur: "OUTIL_ENGIN", label: "Outils" },
  { valeur: "INSTRUMENT", label: "Instruments" },
  { valeur: "OBJET_MAGIQUE", label: "Objets magiques" },
];

export async function renderEquipement(app: HTMLElement, params: { personnageId: string }) {
  const equipeId = state.equipeId;
  if (!equipeId) return naviguer("/accueil");

  let filtreActuel = "TOUS";

  async function charger() {
    const [equipe, boutique] = await Promise.all([api.obtenirEquipe(equipeId!), api.listerObjetsBoutique()]);
    const personnage = equipe.personnages.find((p) => p.id === params.personnageId);
    if (!personnage) return naviguer("/accueil");
    afficher(equipe.nom, equipe.orRestant, equipe.personnages, personnage, boutique);
  }

  function afficher(nomEquipe: string, orRestant: number, tousPersonnages: Personnage[], personnage: Personnage, boutique: Objet[]) {
    const slotsOccupes = new Set(personnage.inventaire.map((i) => i.emplacement));

    const categoriesAutorisees = new Set(personnage.classe.categoriesArmesAutorisees.map((c) => c.categorie));
    const objetsFiltres = boutique.filter(
      (o) => o.type === "ACCESSOIRE" || o.type === "ARMURE" || o.type === "BOUCLIER" || categoriesAutorisees.has(o.categorie)
    );

    app.innerHTML = `
      <div class="entete">
        <h1>${nomEquipe}</h1>
        <div class="budget ${orRestant < 20 ? "budget--faible" : ""}">${orRestant} po</div>
      </div>
      <div class="liste-personnages" id="onglets-persos"></div>

      <h2>${personnage.pseudo} — ${personnage.race.nom} ${personnage.classe.nom}${personnage.specialisation ? " · " + personnage.specialisation.nom : ""}</h2>

      ${
        CLASSES_MAGE.includes(personnage.classeId)
          ? `<div class="stuff-verrouille">🔒 Stuff de Mage verrouillé : Bâton d'apprenti, Grimoire d'apprenti et Robe d'apprenti sont assignés automatiquement et gratuitement, ils ne s'achètent pas en boutique.</div>`
          : ""
      }

      <div id="erreur-equipement"></div>

      <div class="mise-en-page-boutique">
        <aside class="panneau-mannequin">
          <h3>Équipement porté</h3>
          <div class="zone-image-mannequin" id="zone-image-mannequin">
            <img class="image-mannequin" src="/img/boutique/manequin.webp" alt="Mannequin d'équipement" />
          </div>
          <div class="liste-equipement-compacte" id="liste-equipement-compacte"></div>
        </aside>

        <section class="panneau-boutique">
          <div class="entete-boutique">
            <h3>Boutique du village</h3>
          </div>
          <label class="ligne-filtre-boutique">Filtre :
            <select class="filtre-boutique" id="filtre-boutique">
              ${FILTRES_TYPE.map((f) => `<option value="${f.valeur}">${f.label}</option>`).join("")}
            </select>
          </label>
          <div class="grille-objets" id="grille-objets"></div>
        </section>
      </div>

      <div class="actions">
        <button class="btn btn--fantome" id="btn-retour">← Retour à l'équipe</button>
      </div>
    `;

    const zoneErreur = app.querySelector<HTMLElement>("#erreur-equipement")!;

    // Onglets personnages
    const onglets = app.querySelector<HTMLElement>("#onglets-persos")!;
    onglets.innerHTML = tousPersonnages
      .map(
        (p) => `<button type="button" class="onglet-personnage ${p.id === personnage.id ? "actif" : ""}" data-id="${p.id}">${p.pseudo}</button>`
      )
      .join("");
    onglets.querySelectorAll<HTMLElement>(".onglet-personnage").forEach((btn) => {
      btn.addEventListener("click", () => naviguer(`/equipement/${btn.dataset["id"]}`));
    });

    // Mannequin : les illustrations d'équipement empilées sur l'image de base (cf.
    // PARTIES_MANNEQUIN, ordre dos→devant). `.equipe` teinte la pièce en acier quand l'emplacement
    // est occupé — distinction visuelle "porté" vs "juste un emplacement possible", sans empêcher
    // le survol boutique de continuer à illuminer par-dessus (cf. règle de cascade dans style.css).
    // Liste compacte séparée en dessous pour le texte.
    const zoneImage = app.querySelector<HTMLElement>("#zone-image-mannequin")!;
    zoneImage.innerHTML += PARTIES_MANNEQUIN.map((p) => {
      const equipe = personnage.inventaire.some((i) => i.emplacement === p.slot);
      return `<img class="partie-mannequin ${equipe ? "equipe" : ""}" data-slot="${p.slot}" src="/img/boutique/${p.src}.webp" alt="" style="transform-origin:${p.ox}% ${p.oy}%" />`;
    }).join("");

    const listeCompacte = app.querySelector<HTMLElement>("#liste-equipement-compacte")!;
    listeCompacte.innerHTML = TOUS_LES_SLOTS.map((slot) => {
      const item = personnage.inventaire.find((i) => i.emplacement === slot);
      const retirable = item && (item.prixPaye > 0 || !CLASSES_MAGE.includes(personnage.classeId) || item.objet.origine !== "SPAWN_GRATUIT");
      return `
        <div class="ligne-equipement-compacte ${item ? "occupe" : ""}" data-slot-survol="${slot}">
          <div class="entete-ligne-compacte">
            <span class="nom-slot">${LABEL_SLOT[slot]}</span>
            <span class="contenu-slot">${item ? item.objet.nom : "—"}</span>
            ${item && retirable ? `<button class="bouton-croix" data-retirer="${item.id}" title="Retirer">✕</button>` : ""}
          </div>
          ${
            item
              ? `<div class="details-ligne-compacte">
                  ${item.objet.degats ? `<span class="stat-obj">Dégâts ${item.objet.degats}</span>` : ""}
                  ${item.objet.defense ? `<span class="stat-obj">Défense ${item.objet.defense}</span>` : ""}
                  ${item.objet.effet ? `<span class="stat-obj">${item.objet.effet}</span>` : ""}
                  <p class="desc">${item.objet.description}</p>
                </div>`
              : ""
          }
        </div>
      `;
    }).join("");

    listeCompacte.querySelectorAll<HTMLElement>("[data-retirer]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        try {
          await api.retirerObjet(equipeId!, personnage.id, btn.dataset["retirer"]!);
          await charger();
        } catch (e) {
          zoneErreur.innerHTML = `<div class="erreur">${(e as Error).message}</div>`;
        }
      });
    });

    // Survol d'une ligne : illumine le(s) point(s) chaud(s) du mannequin ET déplie ses détails
    // (stats/description). Clic : épingle le dépliement (reste ouvert même après avoir bougé la
    // souris) — bascule INDÉPENDAMMENT de chaque ligne, sans jamais replier les autres.
    listeCompacte.querySelectorAll<HTMLElement>("[data-slot-survol]").forEach((ligne) => {
      const slot = ligne.dataset["slotSurvol"]!;
      const points = zoneImage.querySelectorAll<HTMLElement>(`[data-slot="${slot}"]`);
      ligne.addEventListener("mouseenter", () => points.forEach((p) => p.classList.add("en-survol")));
      ligne.addEventListener("mouseleave", () => points.forEach((p) => p.classList.remove("en-survol")));
      ligne.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).closest("[data-retirer]")) return;
        ligne.classList.toggle("epingle");
      });
    });

    // Boutique — filtre par type, appliqué côté client (pas de rechargement serveur nécessaire).
    const zoneObjets = app.querySelector<HTMLElement>("#grille-objets")!;
    const selectFiltre = app.querySelector<HTMLSelectElement>("#filtre-boutique")!;
    selectFiltre.value = filtreActuel;

    function rendreObjets() {
      const objets = filtreActuel === "TOUS" ? objetsFiltres : objetsFiltres.filter((o) => o.type === filtreActuel);

      zoneObjets.innerHTML = objets
        .map((o) => {
          const slotsPossibles = FAMILLES[o.emplacement ?? ""] ?? (o.emplacement ? [o.emplacement] : []);
          const slotLibre = slotsPossibles.find((s) => !slotsOccupes.has(s));
          return `
          <div class="carte-objet" data-slot-cible="${slotLibre ?? slotsPossibles[0] ?? ""}">
            <div class="corps-carte-objet">
              <div class="nom">${o.nom} <span class="prix">${o.prix} po</span></div>
              <div class="desc">${o.description}</div>
              ${o.degats ? `<span class="stat-obj">Dégâts ${o.degats}</span>` : ""}
              ${o.defense ? `<span class="stat-obj">Défense ${o.defense}</span>` : ""}
              ${o.effet ? `<span class="stat-obj">${o.effet}</span>` : ""}
            </div>
            <button class="btn" data-acheter="${o.id}" data-slot="${slotLibre ?? ""}" ${!slotLibre || orRestant < (o.prix ?? 0) ? "disabled" : ""}>
              ${!slotLibre ? "Emplacement occupé" : orRestant < (o.prix ?? 0) ? "Budget insuffisant" : "Acheter"}
            </button>
          </div>
        `;
        })
        .join("");

      // Survol d'un objet → allume le(s) point(s) chaud(s) du mannequin qui lui correspond(ent)
      // (2 points pour Bras/Bas/Pied, qui couvrent les deux côtés en un seul achat).
      zoneObjets.querySelectorAll<HTMLElement>("[data-slot-cible]").forEach((carte) => {
        const slot = carte.dataset["slotCible"];
        if (!slot) return;
        const points = zoneImage.querySelectorAll<HTMLElement>(`[data-slot="${slot}"]`);
        if (points.length === 0) return;
        carte.addEventListener("mouseenter", () => points.forEach((p) => p.classList.add("en-survol")));
        carte.addEventListener("mouseleave", () => points.forEach((p) => p.classList.remove("en-survol")));
      });

      zoneObjets.querySelectorAll<HTMLButtonElement>("[data-acheter]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const objetId = btn.dataset["acheter"]!;
          const slot = btn.dataset["slot"]!;
          try {
            await api.acheterObjet(equipeId!, personnage.id, objetId, slot);
            await charger();
          } catch (e) {
            zoneErreur.innerHTML = `<div class="erreur">${(e as Error).message}</div>`;
          }
        });
      });
    }

    selectFiltre.addEventListener("change", () => {
      filtreActuel = selectFiltre.value;
      rendreObjets();
    });

    rendreObjets();

    app.querySelector("#btn-retour")!.addEventListener("click", () => naviguer("/equipe"));
  }

  await charger();
}
