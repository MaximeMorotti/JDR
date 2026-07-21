import { api, type Objet, type Personnage } from "../api";
import { naviguer } from "../router";
import { state } from "../state";

const LABEL_SLOT: Record<string, string> = {
  TETE: "Tête",
  TORSE: "Torse",
  BRAS_GAUCHE: "Bras gauche",
  BRAS_DROIT: "Bras droit",
  BAS: "Bas",
  PIED: "Pied",
  MAIN_DROITE: "Main droite",
  MAIN_GAUCHE: "Main gauche",
  ANNEAU_1: "Anneau 1",
  ANNEAU_2: "Anneau 2",
  BRACELET_1: "Bracelet 1",
  BRACELET_2: "Bracelet 2",
  COLLIER: "Collier",
  CEINTURE: "Ceinture",
  CAPE: "Cape",
  CARQUOIS: "Carquois",
};

const TOUS_LES_SLOTS = Object.keys(LABEL_SLOT);

const FAMILLES: Record<string, string[]> = {
  ANNEAU: ["ANNEAU_1", "ANNEAU_2"],
  BRACELET: ["BRACELET_1", "BRACELET_2"],
};

export async function renderEquipement(app: HTMLElement, params: { personnageId: string }) {
  const equipeId = state.equipeId;
  if (!equipeId) return naviguer("/accueil");

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
      <div class="etapes">
        <span class="etape">Personnages</span>
        <span class="etape etape--active">Équipement</span>
        <span class="etape">Compagnon</span>
        <span class="etape">Récapitulatif</span>
      </div>

      <div class="liste-personnages" id="onglets-persos"></div>

      <h2>${personnage.pseudo} — ${personnage.race.nom} ${personnage.classe.nom}${personnage.specialisation ? " · " + personnage.specialisation.nom : ""}</h2>

      ${
        personnage.classeId === "mage"
          ? `<div class="stuff-verrouille">🔒 Stuff de Mage verrouillé : Bâton d'apprenti, Grimoire d'apprenti et Robe d'apprenti sont assignés automatiquement et gratuitement, ils ne s'achètent pas en boutique.</div>`
          : ""
      }

      <div id="erreur-equipement"></div>

      <div class="colonnes-equipement">
        <div>
          <h3>Équipement porté</h3>
          <div class="emplacements" id="emplacements"></div>
        </div>
        <div>
          <h3>Boutique du village</h3>
          <div class="grille-objets" id="grille-objets"></div>
        </div>
      </div>

      <div class="actions">
        <button class="btn btn--fantome" id="btn-retour">← Retour</button>
        ${tousPersonnages.length < 4 ? `<button class="btn" id="btn-ajouter">+ Ajouter un personnage</button>` : ""}
        <button class="btn btn--primaire" id="btn-compagnon">Choisir le compagnon →</button>
        <button class="btn" id="btn-recap">Voir le récapitulatif</button>
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

    // Emplacements
    const zoneEmplacements = app.querySelector<HTMLElement>("#emplacements")!;
    zoneEmplacements.innerHTML = TOUS_LES_SLOTS.map((slot) => {
      const item = personnage.inventaire.find((i) => i.emplacement === slot);
      if (!item) return `<div class="emplacement"><span class="nom-slot">${LABEL_SLOT[slot]}</span><span>—</span></div>`;
      const retirable = item.prixPaye > 0 || personnage.classeId !== "mage" || item.objet.origine !== "SPAWN_GRATUIT";
      return `
        <div class="emplacement occupe">
          <span class="nom-slot">${LABEL_SLOT[slot]}</span>
          <span>${item.objet.nom}</span>
          ${retirable ? `<button class="btn btn--fantome btn--danger" data-retirer="${item.id}">Retirer</button>` : `<span style="font-size:0.75rem;color:var(--text-faint)">verrouillé</span>`}
        </div>
      `;
    }).join("");

    zoneEmplacements.querySelectorAll<HTMLElement>("[data-retirer]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try {
          await api.retirerObjet(equipeId!, personnage.id, btn.dataset["retirer"]!);
          await charger();
        } catch (e) {
          zoneErreur.innerHTML = `<div class="erreur">${(e as Error).message}</div>`;
        }
      });
    });

    // Boutique
    const zoneObjets = app.querySelector<HTMLElement>("#grille-objets")!;
    zoneObjets.innerHTML = objetsFiltres
      .map((o) => {
        const slotsPossibles = FAMILLES[o.emplacement ?? ""] ?? (o.emplacement ? [o.emplacement] : []);
        const slotLibre = slotsPossibles.find((s) => !slotsOccupes.has(s));
        return `
        <div class="carte-objet">
          <div class="nom">${o.nom}</div>
          <div class="prix">${o.prix} po</div>
          <div class="desc">${o.description}</div>
          ${o.degats ? `<div class="stat-obj">Dégâts ${o.degats}</div>` : ""}
          ${o.defense ? `<div class="stat-obj">Défense ${o.defense}</div>` : ""}
          ${o.effet ? `<div class="stat-obj">${o.effet}</div>` : ""}
          <button class="btn" style="width:100%;margin-top:8px" data-acheter="${o.id}" data-slot="${slotLibre ?? ""}" ${!slotLibre || orRestant < (o.prix ?? 0) ? "disabled" : ""}>
            ${!slotLibre ? "Emplacement occupé" : orRestant < (o.prix ?? 0) ? "Budget insuffisant" : "Acheter"}
          </button>
        </div>
      `;
      })
      .join("");

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

    app.querySelector("#btn-retour")!.addEventListener("click", () => naviguer("/creation"));
    app.querySelector("#btn-ajouter")?.addEventListener("click", () => naviguer("/creation"));
    app.querySelector("#btn-compagnon")!.addEventListener("click", () => naviguer("/compagnon"));
    app.querySelector("#btn-recap")!.addEventListener("click", () => naviguer("/recapitulatif"));
  }

  await charger();
}
