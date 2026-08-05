import { api } from "../api";
import { genererRadarSVG } from "../components/radar-stats";
import { naviguer } from "../router";
import { state } from "../state";

/**
 * Les 8 branches de l'Arbre LV (cf. vibe/design/codex_arbre_competences.md) — pas encore de vrais
 * nœuds/contenu interactif ici, juste un aperçu basique en attendant que le système soit conçu et
 * validé. Purement visuel pour l'instant, à redessiner une fois le contenu réel branché.
 */
const BRANCHES: { cle: string; label: string; theme: string }[] = [
  { cle: "force", label: "Force", theme: "Dégâts et capacité de stockage" },
  { cle: "dexterite", label: "Dextérité", theme: "Agilité, mouvements périlleux" },
  { cle: "vitalite", label: "Vitalité", theme: "Propre à la race du personnage" },
  { cle: "charisme", label: "Charisme", theme: "Relations et négociation" },
  { cle: "intelligence", label: "Intelligence", theme: "Vitesse de progression, artisanat" },
  { cle: "sagesse", label: "Sagesse", theme: "Éveil de capacités rares" },
  { cle: "chance", label: "Chance", theme: "Loot et rencontres" },
  { cle: "perception", label: "Perception", theme: "Détection" },
];

export async function renderCompetences(app: HTMLElement, params: { personnageId: string }) {
  const equipeId = state.equipeId;
  if (!equipeId) return naviguer("/accueil");

  const equipe = await api.obtenirEquipe(equipeId);
  const personnage = equipe.personnages.find((p) => p.id === params.personnageId) ?? equipe.personnages[0];
  if (!personnage) return naviguer("/equipe");

  const stats: Record<string, number> = {
    force: personnage.force,
    dexterite: personnage.dexterite,
    vitalite: personnage.vitalite,
    charisme: personnage.charisme,
    intelligence: personnage.intelligence,
    sagesse: personnage.sagesse,
    chance: personnage.chance,
    perception: personnage.perception,
  };

  app.innerHTML = `
    <div class="entete">
      <h1>Arbre de compétences</h1>
      <button class="btn btn--fantome" id="btn-retour">← Retour à l'équipe</button>
    </div>

    <div class="liste-personnages" id="onglets-persos"></div>

    <div class="page-competences">
      <div class="competences-entete">
        <h2>${personnage.pseudo}</h2>
        <div class="sous-titre-slot">${personnage.race.nom} · ${personnage.classe.nom}</div>
        <div class="points-competence">${personnage.pointsCompetenceNonAlloues} point(s) de compétence non alloué(s)</div>
      </div>

      <div class="competences-corps">
        <div class="competences-radar">${genererRadarSVG(stats)}</div>

        <div class="grille-branches">
          ${BRANCHES.map(
            (b) => `
            <div class="carte-branche">
              <h3>${b.label}</h3>
              <div class="theme-branche">${b.theme}</div>
              <div class="valeur-branche">${stats[b.cle]}</div>
              <span class="badge badge--attention">Bientôt disponible</span>
            </div>
          `
          ).join("")}
        </div>
      </div>

      <p class="note-competences">
        L'arbre de compétences complet (nœuds par branche, paliers de maîtrise par attaque, éveil)
        est encore en conception — voir <code>vibe/design/</code>. Cette page affiche pour l'instant
        les 8 branches et les statistiques actuelles du personnage, en attendant le vrai contenu
        interactif.
      </p>
    </div>
  `;

  const onglets = app.querySelector<HTMLElement>("#onglets-persos")!;
  onglets.innerHTML = equipe.personnages
    .map(
      (p) => `<button type="button" class="onglet-personnage ${p.id === personnage.id ? "actif" : ""}" data-id="${p.id}">${p.pseudo}</button>`
    )
    .join("");
  onglets.querySelectorAll<HTMLElement>(".onglet-personnage").forEach((btn) => {
    btn.addEventListener("click", () => naviguer(`/competences/${btn.dataset["id"]}`));
  });

  app.querySelector("#btn-retour")!.addEventListener("click", () => naviguer("/equipe"));
}
