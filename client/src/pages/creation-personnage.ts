import { api, type Classe, type Race, type Specialisation } from "../api";
import { jouerTransitionRace } from "../components/transition-race";
import { naviguer } from "../router";
import { state } from "../state";

const NOMS_STATS: [key: string, label: string][] = [
  ["force", "Force"],
  ["dexterite", "Dextérité"],
  ["vitalite", "Vitalité"],
  ["charisme", "Charisme"],
  ["intelligence", "Intelligence"],
  ["sagesse", "Sagesse"],
  ["chance", "Chance"],
  ["perception", "Perception"],
];

export async function renderCreationPersonnage(app: HTMLElement) {
  const equipeId = state.equipeId;
  if (!equipeId) return naviguer("/accueil");

  const equipe = await api.obtenirEquipe(equipeId);
  if (equipe.personnages.length >= 4) return naviguer("/equipe");

  const [races, classes] = await Promise.all([api.listerRaces(), api.listerClasses()]);

  let raceSelectionnee: Race | null = null;
  let classeSelectionnee: Classe | null = null;

  app.innerHTML = `
    <div class="entete">
      <h1>${equipe.nom}</h1>
      <div class="budget ${equipe.orRestant < 20 ? "budget--faible" : ""}">${equipe.orRestant} po</div>
    </div>
    <div class="etapes">
      <span class="etape etape--active">Nouveau personnage (${equipe.personnages.length + 1}/4)</span>
    </div>

    <div class="champ">
      <label for="pseudo">Pseudo du personnage</label>
      <input id="pseudo" type="text" placeholder="Ex : Aldric" />
    </div>

    <div id="erreur-creation"></div>

    <h2>Race</h2>
    <div class="grille-races" id="grille-races"></div>
    <div id="zone-detail"></div>

    <div class="actions">
      <button class="btn btn--fantome" id="btn-retour">${equipe.personnages.length > 0 ? "← Retour à l'équipe" : "← Retour à l'accueil"}</button>
      <button class="btn btn--primaire" id="btn-suivant" disabled>Créer ce personnage</button>
    </div>
  `;

  const zoneErreur = app.querySelector<HTMLElement>("#erreur-creation")!;
  const zoneDetail = app.querySelector<HTMLElement>("#zone-detail")!;
  const grilleRaces = app.querySelector<HTMLElement>("#grille-races")!;
  const btnSuivant = app.querySelector<HTMLButtonElement>("#btn-suivant")!;
  const inputPseudo = app.querySelector<HTMLInputElement>("#pseudo")!;

  app.querySelector("#btn-retour")!.addEventListener("click", () =>
    naviguer(equipe.personnages.length > 0 ? "/equipe" : "/accueil")
  );

  function majBoutonSuivant() {
    btnSuivant.disabled = !(inputPseudo.value.trim() && raceSelectionnee && classeSelectionnee);
  }
  inputPseudo.addEventListener("input", majBoutonSuivant);

  grilleRaces.innerHTML = races
    .map(
      (r) => `
    <div class="carte-race" data-id="${r.id}">
      <img class="portrait-race" src="/img/races/${r.id}.webp" alt="Portrait ${r.nom}" loading="lazy" />
      <h3>${r.nom}</h3>
      <div class="trait">${r.traitRacial}</div>
    </div>
  `
    )
    .join("");

  grilleRaces.querySelectorAll<HTMLElement>(".carte-race").forEach((carte) => {
    carte.addEventListener("click", () => {
      const race = races.find((r) => r.id === carte.dataset["id"])!;
      raceSelectionnee = race;
      classeSelectionnee = null;

      grilleRaces.querySelectorAll(".carte-race").forEach((c) => c.classList.remove("selectionnee"));
      carte.classList.add("selectionnee");

      afficherDetailRace(race);
      majBoutonSuivant();
    });
  });

  function afficherDetailRace(race: Race) {
    zoneDetail.innerHTML = `
      <div class="detail-race">
        <div class="detail-race-entete">
          <img class="portrait-race-grand" src="/img/races/${race.id}.webp" alt="Portrait ${race.nom}" />
          <div>
            <p>${race.lore}</p>
            ${race.tailleMin ? `<p style="font-size:0.8rem">Taille : ${race.tailleMin}-${race.tailleMax} cm · Poids : ${race.poidsMin}-${race.poidsMax} kg</p>` : `<p style="font-size:0.8rem">Taille/Poids : saisie libre (variable selon les individus)</p>`}
          </div>
        </div>
        <div class="stats-grille">
          ${NOMS_STATS.map(
            ([cle, label]) => `
            <div class="stat"><span class="valeur">${(race as any)[cle]}</span><span class="label">${label}</span></div>
          `
          ).join("")}
        </div>

        <h3>Classe</h3>
        <div class="grille-classes" id="grille-classes"></div>
        <div id="zone-specs"></div>
      </div>
    `;

    const grilleClasses = zoneDetail.querySelector<HTMLElement>("#grille-classes")!;
    grilleClasses.innerHTML = classes
      .map((c) => {
        const lien = c.racesAutorisees.find((ra) => ra.raceId === race.id);
        if (!lien) {
          const raceAutorisee = c.racesAutorisees[0]?.race.nom ?? "une autre race";
          return `
            <div class="chip-classe chip-classe--bloquee" title="Réservé à : ${raceAutorisee}">
              <span class="nom">${c.nom}</span>
              <span class="role">${c.roleCombat}</span>
              <span class="badge badge--bloque">Réservé à ${raceAutorisee}</span>
            </div>
          `;
        }
        return `
          <button type="button" class="chip-classe" data-id="${c.id}">
            <span class="nom">${c.nom}</span>
            <span class="role">${c.roleCombat}</span>
            ${lien.deconseille ? `<span class="badge badge--attention">Déconseillé pour cette race</span>` : ""}
          </button>
        `;
      })
      .join("");

    grilleClasses.querySelectorAll<HTMLElement>(".chip-classe:not(.chip-classe--bloquee)").forEach((chip) => {
      chip.addEventListener("click", async () => {
        const classe = classes.find((c) => c.id === chip.dataset["id"])!;
        classeSelectionnee = classe;

        grilleClasses.querySelectorAll(".chip-classe").forEach((c) => c.classList.remove("selectionnee"));
        chip.classList.add("selectionnee");

        const specialisations = await api.listerSpecialisations(classe.id);
        afficherApercuSpecialisations(classe, specialisations);
        majBoutonSuivant();
      });
    });
  }

  /**
   * Aperçu informatif uniquement — la spécialisation n'est PAS un choix à la création.
   * Elle décrit le futur arbre de compétences de la classe (à concevoir), débloqué/amélioré
   * en progressant. Aucune sélection possible ici, aucune valeur envoyée à l'API.
   */
  function afficherApercuSpecialisations(classe: Classe, specialisations: Specialisation[]) {
    const zoneSpecs = zoneDetail.querySelector<HTMLElement>("#zone-specs")!;
    const carteHtml = (s: Specialisation) => `
      <div class="carte-spec" style="cursor:default">
        <strong>${s.nom}</strong>
        <div style="font-size:0.82rem;color:var(--text-dim)">${s.description}</div>
        <div class="attaque">${s.attaqueSignature}</div>
      </div>
    `;

    const introduction = `
      <p style="font-size:0.82rem;margin-top:14px">
        Aperçu des ${specialisations.length} spécialisations de cette classe — elles ne se choisissent pas
        maintenant : elles composeront l'arbre de compétences que ce personnage débloquera et améliorera
        en progressant (à venir dans un prochain sprint).
      </p>
    `;

    if (classe.aBesoinEcole) {
      const ecoles = ["ELEMENTAIRE", "NOIRE", "BLANCHE"];
      const labels: Record<string, string> = { ELEMENTAIRE: "École Élémentaire", NOIRE: "École Noire", BLANCHE: "École Blanche" };
      zoneSpecs.innerHTML = `
        <h3>Spécialisations à venir</h3>
        ${introduction}
        ${ecoles
          .map(
            (ecole) => `
          <div class="groupe-ecole">
            <h3>${labels[ecole]}</h3>
            <div class="grille-specs">
              ${specialisations.filter((s) => s.ecole === ecole).map(carteHtml).join("")}
            </div>
          </div>
        `
          )
          .join("")}
      `;
    } else {
      zoneSpecs.innerHTML = `
        <h3>Spécialisations à venir</h3>
        ${introduction}
        <div class="grille-specs">${specialisations.map(carteHtml).join("")}</div>
      `;
    }
  }

  btnSuivant.addEventListener("click", async () => {
    if (!raceSelectionnee || !classeSelectionnee) return;
    zoneErreur.innerHTML = "";
    btnSuivant.disabled = true;
    try {
      await api.creerPersonnage(equipeId, {
        pseudo: inputPseudo.value.trim(),
        raceId: raceSelectionnee.id,
        classeId: classeSelectionnee.id,
      });
      await jouerTransitionRace(raceSelectionnee.id);
      naviguer("/equipe");
    } catch (e) {
      zoneErreur.innerHTML = `<div class="erreur">${(e as Error).message}</div>`;
      btnSuivant.disabled = false;
    }
  });
}
