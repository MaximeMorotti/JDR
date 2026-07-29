import { api, type Equipe } from "../api";
import { confirmerSuppression } from "../components/confirmation";
import { ouvrirFichePersonnage } from "../components/fiche-personnage";
import { naviguer } from "../router";
import { state } from "../state";

/**
 * Capacité de transport de BASE (avant tout craft — les sacoches/harnais de l'Ingénieur ne sont
 * pas encore implémentés) par compagnon, dérivée du texte libre `capaciteTransport` du seed
 * (cf. Codex des Compagnons). Le Gnome a une capacité "illimitée mais alchimie uniquement" —
 * nuance pas encore modélisée ici, compté 0 pour l'instant (ne compte que pour l'inventaire
 * générique affiché sur cette page).
 */
const CAPACITE_BASE_COMPAGNON: Record<string, number> = {
  chihuahua: 0,
  cocker: 0,
  labrador: 0,
  "border-collie": 0,
  "berger-australien": 0,
  mule: 2,
  elan: 4,
  gnome: 0,
  "sanglier-dresse": 1,
  fee: 0,
};

/** 4 emplacements d'inventaire de base par personnage (règle donnée par l'utilisateur). */
const CAPACITE_BASE_PAR_PERSONNAGE = 4;

/** Teinte de fondu par classe, pour la bannière personnage (couleur = repère visuel de classe). */
const COULEUR_CLASSE: Record<string, string> = {
  guerrier: "#8a2a2a",
  voleur: "#3a2a52",
  barde: "#8a6a2a",
  berserker: "#a83a1a",
  ingenieur: "#7a5a2a",
  "chasseur-sylvestre": "#2a5a3a",
  "mage-elementaire": "#a8601a",
  "mage-noir": "#3a1a4a",
  "mage-blanc": "#8a7a52",
};
const COULEUR_CLASSE_DEFAUT = "#4a3a2a";

/**
 * Le PNG de chaque cadre a une marge transparente résiduelle autour de son illustration (le
 * dessin ne touche pas exactement les bords du canevas) — sans correction, le fond coloré de la
 * carte dépasse visuellement de la bordure peinte. Facteur d'agrandissement (mesuré au pixel
 * près, script one-off) appliqué en `transform: scale()` sur `.cadre-banniere` pour que
 * l'illustration atteigne vraiment les bords de la carte.
 */
const ECHELLE_CADRE_EQUIPE: Record<string, number> = {
  humain: 1.06,
  nain: 1.04,
  elfe: 1.07,
  "demi-orc": 1.06,
  mage: 1.04,
};
const ECHELLE_CADRE_DEFAUT = 1.08;

/**
 * Hauteur du rectangle de couleur (`.banniere-contenu`, et donc du portrait + texte qui partagent
 * ses bornes), en fraction de la hauteur de la carte, mesurée depuis son CENTRE (donc symétrique
 * haut/bas). `HAUTEUR_CONTENU_BASE` s'applique à toutes les races ; `HAUTEUR_CONTENU_EXTRA` est un
 * correctif MULTIPLICATIF propre à une race (1 = pas de correctif) quand son cadre laisse un peu
 * moins de hauteur que les autres avant que la bordure peinte ne commence à "ronger" le contenu —
 * c'est LE SEUL réglage à toucher pour changer la hauteur du rectangle. Ne JAMAIS mélanger ce
 * facteur avec celui de la largeur (cf. LARGEUR_CONTENU_*) : un ajustement sur un axe ne doit
 * jamais changer le ratio du rectangle sur l'autre axe.
 */
const HAUTEUR_CONTENU_BASE = 0.9;
const HAUTEUR_CONTENU_EXTRA: Record<string, number> = {
  "demi-orc": 0.65,
  nain: 0.65,
  elfe: 0.75
};

/** Même principe que HAUTEUR_CONTENU_* mais pour la largeur — axe totalement indépendant. */
const LARGEUR_CONTENU_BASE = 0.945;
const LARGEUR_CONTENU_EXTRA: Record<string, number> = {
  mage: 1.05,
};

/**
 * Décalage vertical fin du CADRE seul (`.cadre-banniere`), en % de sa PROPRE hauteur (pas celle de
 * la carte) — indépendant du rectangle/portrait/texte, pour les cas où l'illustration du cadre est
 * légèrement désaxée par rapport à sa fenêtre. Négatif = vers le haut. 0 = aucun décalage.
 */
const DECALAGE_CADRE_V: Record<string, number> = {
  "demi-orc": -2,
};

export async function renderEquipe(app: HTMLElement) {
  const equipeId = state.equipeId;
  if (!equipeId) return naviguer("/accueil");

  async function charger() {
    const equipe = await api.obtenirEquipe(equipeId!);
    afficher(equipe);
  }

  function afficher(equipe: Equipe) {
    const emplacementsVides = 4 - equipe.personnages.length;
    const capaciteCompagnon = equipe.compagnonEquipe
      ? (CAPACITE_BASE_COMPAGNON[equipe.compagnonEquipe.compagnon.id] ?? 0)
      : 0;
    const capaciteInventaire = equipe.personnages.length * CAPACITE_BASE_PAR_PERSONNAGE + capaciteCompagnon;

    app.innerHTML = `
      <div class="entete">
        <h1>${equipe.nom}</h1>
        <div class="budget ${equipe.orRestant < 20 ? "budget--faible" : ""}">${equipe.orRestant} po</div>
      </div>

      <div class="mise-en-page-equipe">
        <aside class="panneau-inventaire">
          <h2>Inventaire</h2>
          <div class="sac-inventaire" id="grille-inventaire"></div>
        </aside>

        <div class="colonne-personnages">
          <h2>Personnages</h2>
          <div class="grille-equipe grille-equipe--bannieres" id="grille-personnages"></div>
        </div>

        <div class="colonne-compagnon">
          <h2>Compagnon</h2>
          <div id="grille-compagnon"></div>
        </div>
      </div>

      <button class="btn btn--primaire bouton-boutique-flottant" id="btn-boutique" ${equipe.personnages.length === 0 ? "disabled" : ""}>
        🛒 Boutique
      </button>
    `;

    const grilleInventaire = app.querySelector<HTMLElement>("#grille-inventaire")!;
    // Les objets non équipés (potions, etc.) n'ont pas encore de stockage en base — toutes les
    // cases sont donc vides pour l'instant. Le nombre de cases reflète déjà la vraie capacité
    // (4 par personnage + capacité de base du compagnon), pour que l'utilisateur voie la place
    // disponible dès maintenant.
    grilleInventaire.innerHTML = Array.from({ length: capaciteInventaire })
      .map(() => `<span class="case-inventaire case-inventaire--vide" title="Emplacement vide"></span>`)
      .join("");

    const grillePersonnages = app.querySelector<HTMLElement>("#grille-personnages")!;
    grillePersonnages.innerHTML =
      equipe.personnages
        .map((p) => {
          const couleur = COULEUR_CLASSE[p.classeId] ?? COULEUR_CLASSE_DEFAUT;
          const echelleCadre = ECHELLE_CADRE_EQUIPE[p.raceId] ?? ECHELLE_CADRE_DEFAUT;
          const decalageCadreV = DECALAGE_CADRE_V[p.raceId] ?? 0;
          const hauteurContenu = HAUTEUR_CONTENU_BASE * (HAUTEUR_CONTENU_EXTRA[p.raceId] ?? 1);
          const largeurContenu = LARGEUR_CONTENU_BASE * (LARGEUR_CONTENU_EXTRA[p.raceId] ?? 1);
          // Rectangle flottant, centré depuis le centre de la carte. Portrait et texte partagent
          // EXACTEMENT ces mêmes bornes (même mur gauche, même hauteur que le rectangle, cf.
          // maquette de référence) — une seule paire de valeurs pour les trois, plutôt qu'un
          // cadrage indépendant qui désynchronise leurs tailles à chaque changement d'échelle par
          // race.
          const rectInsetV = (1 - hauteurContenu) * 50;
          const rectInsetH = (1 - largeurContenu) * 50;
          return `
      <div class="carte-slot-perso carte-slot-perso--banniere" data-perso="${p.id}" style="--couleur-classe:${couleur};--rect-inset-v:${rectInsetV}%;--rect-inset-h:${rectInsetH}%;--echelle-cadre:${echelleCadre};--decalage-cadre-v:${decalageCadreV}%">
        <div class="banniere-contenu"></div>
        <img class="portrait-slot" src="/img/equipe-portraits/${p.raceId}.webp" alt="${p.pseudo}" loading="lazy" />
        <div class="etiquette-slot etiquette-slot--banniere">
          <h3>${p.pseudo}</h3>
          <div class="sous-titre-slot">${p.race.nom} · ${p.classe.nom}</div>
        </div>
        <img class="cadre-banniere" src="/img/cadres/equipe/${p.raceId}.webp" alt="" loading="lazy" />
      </div>
    `;
        })
        .join("") +
      (emplacementsVides > 0
        ? `<div class="slot-vide slot-vide--banniere" id="ajouter-perso">+</div>`
        : "");

    // Le clic sur une carte ouvre la fiche détaillée du personnage (portrait, stats, renommage) —
    // c'est désormais SEULEMENT depuis cette fiche qu'on peut le supprimer (plus de croix sur la
    // carte elle-même). La boutique reste accessible via le bouton flottant en bas de page.
    grillePersonnages.querySelectorAll<HTMLElement>("[data-perso]").forEach((carte) => {
      carte.addEventListener("click", () => {
        const index = equipe.personnages.findIndex((p) => p.id === carte.dataset["perso"]);
        if (index === -1) return;
        ouvrirFichePersonnage(equipe, index, () => charger());
      });
    });
    app.querySelector("#ajouter-perso")?.addEventListener("click", () => naviguer("/creation"));

    const grilleCompagnon = app.querySelector<HTMLElement>("#grille-compagnon")!;
    if (equipe.compagnonEquipe) {
      const c = equipe.compagnonEquipe.compagnon;
      grilleCompagnon.innerHTML = `
        <div class="carte-slot-perso carte-slot-perso--compagnon" data-compagnon>
          <button class="bouton-croix btn-supprimer-slot" data-supprimer-compagnon title="Retirer ${c.nom}">✕</button>
          <img class="portrait-slot" src="/img/compagnons/${c.id}.webp" alt="${c.nom}" loading="lazy" />
          <div class="etiquette-slot">
            <h3>${c.nom}</h3>
            <div class="sous-titre-slot">${c.role}</div>
          </div>
        </div>
      `;
      grilleCompagnon.querySelector("[data-compagnon]")!.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).closest("[data-supprimer-compagnon]")) return;
        naviguer("/compagnon");
      });
      grilleCompagnon.querySelector("[data-supprimer-compagnon]")!.addEventListener("click", async (e) => {
        e.stopPropagation();
        const ok = await confirmerSuppression(`Retirer ${c.nom} de l'équipe ?`);
        if (!ok) return;
        await api.retirerCompagnon(equipeId!);
        await charger();
      });
    } else {
      grilleCompagnon.innerHTML = `<div class="slot-vide slot-vide--compagnon" id="ajouter-compagnon">+</div>`;
      app.querySelector("#ajouter-compagnon")!.addEventListener("click", () => naviguer("/compagnon"));
    }

    app.querySelector<HTMLButtonElement>("#btn-boutique")!.addEventListener("click", () => {
      if (equipe.personnages.length === 0) return;
      naviguer(`/equipement/${equipe.personnages[0]!.id}`);
    });
  }

  await charger();
}
