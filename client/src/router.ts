export type Route = {
  pattern: RegExp;
  params: string[];
  render: (params: Record<string, string>) => void | Promise<void>;
};

const routes: Route[] = [];

/** Déclare une route. Exemple : "#/equipement/:personnageId" -> params.personnageId */
export function route(chemin: string, render: Route["render"]) {
  const params: string[] = [];
  const pattern = new RegExp(
    "^" +
      chemin.replace(/:[a-zA-Z]+/g, (m) => {
        params.push(m.slice(1));
        return "([^/]+)";
      }) +
      "$"
  );
  routes.push({ pattern, params, render });
}

export function naviguer(chemin: string) {
  window.location.hash = chemin;
}

async function resoudre() {
  const hash = window.location.hash.replace(/^#/, "") || "/accueil";
  for (const r of routes) {
    const match = hash.match(r.pattern);
    if (match) {
      const params: Record<string, string> = {};
      r.params.forEach((nom, i) => (params[nom] = match[i + 1] ?? ""));
      await r.render(params);
      return;
    }
  }
  naviguer("/accueil");
}

export function demarrerRouteur() {
  window.addEventListener("hashchange", resoudre);
  resoudre();
}
