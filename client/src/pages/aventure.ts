import { api } from "../api";
import { echapperHtml } from "../components/echapper-html";
import { naviguer } from "../router";
import { state } from "../state";

/**
 * Lore d'introduction affiché comme premier message du MJ. Simple texte statique pour l'instant —
 * pas de génération, le vrai MJ-IA arrive au Sprint 5 (cf. CLAUDE.md). Le détail du gameplay
 * (déplacement, grille de combat) est repoussé au Sprint 2, à concevoir séparément.
 */
const LORE_DEBUT_AVENTURE = `Le soleil se lève à peine sur le village. Une odeur de pain chaud flotte encore près de la
boulangerie, mais quelque chose cloche : les hurlements de loups se rapprochent nuit après nuit, et une rumeur
circule sur un cultiste étrange rôdant du côté des ruines de l'avant-poste.

Sac sur le dos, votre équipe se tient à l'orée du village, prête à partir. La route vers la forêt s'ouvre devant
vous.

Que faites-vous ?`;

const MESSAGE_MJ_INDISPONIBLE =
  "⚠ MJ-IA indisponible pour le moment (maintenance). Réessaie plus tard.";

export async function renderAventure(app: HTMLElement) {
  const equipeId = state.equipeId;
  if (!equipeId) return naviguer("/accueil");

  const equipe = await api.obtenirEquipe(equipeId);

  app.innerHTML = `
    <div class="page-aventure">
      <div class="entete-aventure">
        <h1>${echapperHtml(equipe.nom)}</h1>
      </div>
      <div class="chat-aventure" id="chat-log"></div>
      <form class="chat-saisie" id="form-chat">
        <input id="chat-input" type="text" placeholder="Écris ton action..." autocomplete="off" />
        <button type="submit" class="btn btn--primaire">Envoyer</button>
      </form>
    </div>
    <button class="btn btn--primaire bouton-equipe-flottant" id="btn-equipe">👥 Équipe</button>
  `;

  const log = app.querySelector<HTMLElement>("#chat-log")!;
  const form = app.querySelector<HTMLFormElement>("#form-chat")!;
  const input = app.querySelector<HTMLInputElement>("#chat-input")!;

  function ajouterMessage(texte: string, auteur: "mj" | "joueur" | "erreur") {
    const bulle = document.createElement("div");
    bulle.className = `bulle-chat bulle-chat--${auteur}`;
    bulle.textContent = texte;
    log.appendChild(bulle);
    log.scrollTop = log.scrollHeight;
  }

  ajouterMessage(LORE_DEBUT_AVENTURE, "mj");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const valeur = input.value.trim();
    if (!valeur) return;
    ajouterMessage(valeur, "joueur");
    input.value = "";
    setTimeout(() => ajouterMessage(MESSAGE_MJ_INDISPONIBLE, "erreur"), 400);
  });

  app.querySelector("#btn-equipe")!.addEventListener("click", () => naviguer("/equipe"));
}
