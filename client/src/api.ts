const BASE_URL = "http://localhost:3000/api";

export class ErreurApi extends Error {}

async function requete<T>(chemin: string, options?: RequestInit): Promise<T> {
  const reponse = await fetch(`${BASE_URL}${chemin}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!reponse.ok) {
    const corps = await reponse.json().catch(() => ({}));
    throw new ErreurApi(corps.erreur ?? `Erreur ${reponse.status}`);
  }
  if (reponse.status === 204) return undefined as T;
  return reponse.json() as Promise<T>;
}

// ---------- Types ----------

export type Race = {
  id: string;
  nom: string;
  tailleMin: number | null;
  tailleMax: number | null;
  poidsMin: number | null;
  poidsMax: number | null;
  traitRacial: string;
  lore: string;
  force: number;
  dexterite: number;
  vitalite: number;
  charisme: number;
  intelligence: number;
  sagesse: number;
  chance: number;
  perception: number;
};

export type RaceAutorisee = { raceId: string; classeId: string; deconseille: boolean; race: Race };

export type Classe = {
  id: string;
  nom: string;
  type: string;
  roleCombat: string;
  armureMax: string;
  aBesoinEcole: boolean;
  armesInterdites: string;
  racesAutorisees: RaceAutorisee[];
  categoriesArmesAutorisees: { classeId: string; categorie: string }[];
};

export type Specialisation = {
  id: string;
  classeId: string;
  ecole: string | null;
  nom: string;
  description: string;
  attaqueSignature: string;
};

export type Objet = {
  id: string;
  nom: string;
  type: string;
  categorie: string;
  emplacement: string | null;
  palier: string;
  origine: string;
  poidsArmure: string | null;
  prix: number | null;
  degats: string | null;
  defense: string | null;
  effet: string | null;
  description: string;
};

export type InventaireItem = {
  id: string;
  personnageId: string;
  objetId: string;
  emplacement: string;
  quantite: number;
  prixPaye: number;
  objet: Objet;
};

export type Personnage = {
  id: string;
  pseudo: string;
  equipeId: string;
  raceId: string;
  classeId: string;
  specialisationId: string | null;
  force: number;
  dexterite: number;
  vitalite: number;
  charisme: number;
  intelligence: number;
  sagesse: number;
  chance: number;
  perception: number;
  race: Race;
  classe: Classe;
  specialisation: Specialisation | null;
  inventaire: InventaireItem[];
};

export type Compagnon = {
  id: string;
  nom: string;
  role: string;
  lore: string;
  pv: number;
  force: number;
  dexterite: number;
  vitalite: number;
  intelligence: number | null;
  capaciteTransport: string;
  attaques: string;
  raceRequiseId: string | null;
  classesLiees: { classeId: string; classe: Classe }[];
  raceRequise: Race | null;
};

export type CompagnonDisponible = Compagnon & { accessible: boolean };

export type Equipe = {
  id: string;
  nom: string;
  orRestant: number;
  personnages: Personnage[];
  compagnonEquipe: { compagnon: Compagnon } | null;
};

// ---------- Catalogue ----------

export const api = {
  listerRaces: () => requete<Race[]>("/catalogue/races"),
  listerClasses: () => requete<Classe[]>("/catalogue/classes"),
  listerSpecialisations: (classeId: string) =>
    requete<Specialisation[]>(`/catalogue/classes/${classeId}/specialisations`),
  listerObjetsBoutique: () => requete<Objet[]>("/catalogue/objets?palier=COMMUN&origine=ACHAT_VILLAGE"),
  listerCompagnons: () => requete<Compagnon[]>("/catalogue/compagnons"),

  // ---------- Équipes ----------
  listerEquipes: () => requete<Equipe[]>("/equipes"),
  creerEquipe: (nom: string) => requete<Equipe>("/equipes", { method: "POST", body: JSON.stringify({ nom }) }),
  obtenirEquipe: (id: string) => requete<Equipe>(`/equipes/${id}`),
  supprimerEquipe: (id: string) => requete<void>(`/equipes/${id}`, { method: "DELETE" }),

  // ---------- Personnages ----------
  creerPersonnage: (equipeId: string, data: { pseudo: string; raceId: string; classeId: string }) =>
    requete<{ personnage: Personnage; deconseille: boolean }>(`/equipes/${equipeId}/personnages`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  supprimerPersonnage: (equipeId: string, id: string) =>
    requete<void>(`/equipes/${equipeId}/personnages/${id}`, { method: "DELETE" }),
  acheterObjet: (equipeId: string, personnageId: string, objetId: string, emplacement: string) =>
    requete<InventaireItem>(`/equipes/${equipeId}/personnages/${personnageId}/acheter`, {
      method: "POST",
      body: JSON.stringify({ objetId, emplacement }),
    }),
  retirerObjet: (equipeId: string, personnageId: string, inventaireId: string) =>
    requete<void>(`/equipes/${equipeId}/personnages/${personnageId}/inventaire/${inventaireId}`, {
      method: "DELETE",
    }),

  // ---------- Compagnon ----------
  compagnonsDisponibles: (equipeId: string) =>
    requete<CompagnonDisponible[]>(`/equipes/${equipeId}/compagnons-disponibles`),
  choisirCompagnon: (equipeId: string, compagnonId: string) =>
    requete<unknown>(`/equipes/${equipeId}/compagnon`, {
      method: "POST",
      body: JSON.stringify({ compagnonId }),
    }),
  retirerCompagnon: (equipeId: string) =>
    requete<void>(`/equipes/${equipeId}/compagnon`, { method: "DELETE" }),
};
