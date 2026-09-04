import { api, type Classe, type Race, type Specialisation } from "../api";
import { ANGLES_RACES, genererEtoileLiens } from "../components/etoile-liens";
import { afficherErreur } from "../components/erreur";
import { icone } from "../components/icones-classes";
import { iconeSpecialisation } from "../components/icones-specialisations";
import { genererRadarSVG } from "../components/radar-stats";
import { jouerTransitionRace } from "../components/transition-race";
import { naviguer } from "../router";
import { state } from "../state";

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
    <div class="conteneur-etoile" id="etoile-races"></div>
    <div id="zone-detail"></div>

    <div class="actions">
      <button class="btn btn--fantome" id="btn-retour">${equipe.personnages.length > 0 ? "← Retour à l'équipe" : "← Retour à l'accueil"}</button>
      <button class="btn btn--primaire" id="btn-suivant" disabled>Créer ce personnage</button>
    </div>
  `;

  const zoneErreur = app.querySelector<HTMLElement>("#erreur-creation")!;
  const zoneDetail = app.querySelector<HTMLElement>("#zone-detail")!;
  const conteneurEtoile = app.querySelector<HTMLElement>("#etoile-races")!;
  const btnSuivant = app.querySelector<HTMLButtonElement>("#btn-suivant")!;
  const inputPseudo = app.querySelector<HTMLInputElement>("#pseudo")!;

  app.querySelector("#btn-retour")!.addEventListener("click", () =>
    naviguer(equipe.personnages.length > 0 ? "/equipe" : "/accueil")
  );

  function majBoutonSuivant() {
    btnSuivant.disabled = !(inputPseudo.value.trim() && raceSelectionnee && classeSelectionnee);
  }
  inputPseudo.addEventListener("input", majBoutonSuivant);

  // ---------- Étoile de sélection de race ----------
  const angles = races.map((r) => ANGLES_RACES[r.id] ?? 0);
  conteneurEtoile.innerHTML =
    genererEtoileLiens(angles) +
    races
      .map(
        (r) => `
      <button type="button" class="point-race" data-id="${r.id}" style="--angle:${ANGLES_RACES[r.id] ?? 0}deg">
        <span class="cadre-race-etoile cadre--image">
          <img class="portrait-dans-cadre" src="/img/races/${r.id}.webp" alt="Portrait ${r.nom}" loading="lazy" />
          <img class="image-cadre" src="/img/cadres/${r.id}.webp" alt="" loading="lazy" />
        </span>
        <span class="nom-race-etoile">${r.nom}</span>
      </button>
    `
      )
      .join("");

  // Rotation cumulée réelle (pas mod 360) pour permettre à la roue de tourner dans le sens le
  // plus court d'une sélection à l'autre, plutôt que de sauter à une valeur absolue qui peut
  // forcer un tour complet superflu (ex: 180deg -> -108deg = 288° parcourus au lieu de 72°).
  let rotationCourante = 0;

  function tournerRoueVers(angleRace: number) {
    const cible = 180 - angleRace;
    const delta = (((cible - rotationCourante) % 360) + 540) % 360 - 180;
    rotationCourante += delta;
    conteneurEtoile.style.setProperty("--rotation-globale", `${rotationCourante}deg`);
  }

  conteneurEtoile.querySelectorAll<HTMLElement>(".point-race").forEach((point) => {
    point.addEventListener("click", () => {
      const race = races.find((r) => r.id === point.dataset["id"])!;
      raceSelectionnee = race;
      classeSelectionnee = null;

      conteneurEtoile.querySelectorAll(".point-race").forEach((p) => p.classList.remove("selectionnee"));
      point.classList.add("selectionnee");

      // Fait tourner la roue pour amener la race choisie en bas (180°), où son cercle grossit.
      tournerRoueVers(ANGLES_RACES[race.id] ?? 0);

      afficherDetailRace(race);
      majBoutonSuivant();
    });
  });

  // ---------- Étiquette parchemin : lore + radar + classes ----------
  function afficherDetailRace(race: Race) {
    zoneDetail.innerHTML = `
      <div class="etiquette-parchemin">
        <h2>${race.nom}</h2>
        <p>${race.lore}</p>
        ${race.tailleMin ? `<p style="font-size:0.85rem">Taille : ${race.tailleMin}-${race.tailleMax} cm · Poids : ${race.poidsMin}-${race.poidsMax} kg</p>` : `<p style="font-size:0.85rem">Taille/Poids : saisie libre (variable selon les individus)</p>`}
        <p class="trait-racial-parchemin">${race.traitRacial}</p>
        <div class="parchemin-corps">
          <div>
            ${genererRadarSVG({
              force: race.force,
              dexterite: race.dexterite,
              vitalite: race.vitalite,
              charisme: race.charisme,
              intelligence: race.intelligence,
              sagesse: race.sagesse,
              chance: race.chance,
              perception: race.perception,
            })}
          </div>
          <div>
            <h3>Classes disponibles</h3>
            <div class="liste-classes-icones" id="grille-classes"></div>
          </div>
        </div>
        <div id="zone-specs" class="zone-specs-pleine-largeur"></div>
      </div>
    `;

    const grilleClasses = zoneDetail.querySelector<HTMLElement>("#grille-classes")!;
    grilleClasses.innerHTML = classes
      .map((c) => {
        const lien = c.racesAutorisees.find((ra) => ra.raceId === race.id);
        if (!lien) {
          const raceAutorisee = c.racesAutorisees[0]?.race.nom ?? "une autre race";
          return `
            <div class="classe-icone-carte classe-icone-carte--bloquee" title="Réservé à : ${raceAutorisee}">
              ${icone(c.id)}
              <span class="nom-classe-icone">${c.nom}<br><span class="badge badge--bloque">Réservé à ${raceAutorisee}</span></span>
            </div>
          `;
        }
        return `
          <button type="button" class="classe-icone-carte" data-id="${c.id}">
            ${icone(c.id)}
            <span class="nom-classe-icone">${c.nom}${lien.deconseille ? `<br><span class="badge badge--attention">Déconseillé</span>` : ""}</span>
          </button>
        `;
      })
      .join("");

    grilleClasses.querySelectorAll<HTMLElement>(".classe-icone-carte:not(.classe-icone-carte--bloquee)").forEach((chip) => {
      chip.addEventListener("click", async () => {
        const classe = classes.find((c) => c.id === chip.dataset["id"])!;
        classeSelectionnee = classe;

        grilleClasses.querySelectorAll(".classe-icone-carte").forEach((c) => c.classList.remove("selectionnee"));
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
        <div class="entete-carte-spec">
          ${iconeSpecialisation(classe.id, s.nom)}
          <strong>${s.nom}</strong>
        </div>
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

    zoneSpecs.innerHTML = `
      <h3>Spécialisations à venir</h3>
      ${introduction}
      <div class="grille-specs">${specialisations.map(carteHtml).join("")}</div>
    `;
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
      await jouerTransitionRace(raceSelectionnee.id, () => naviguer("/equipe"));
    } catch (e) {
      afficherErreur(zoneErreur, e);
      btnSuivant.disabled = false;
    }
  });
}
