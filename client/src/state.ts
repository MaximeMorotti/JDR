const CLE_EQUIPE = "jdr:equipeId";

export const state = {
  get equipeId(): string | null {
    return localStorage.getItem(CLE_EQUIPE);
  },
  set equipeId(id: string | null) {
    if (id) localStorage.setItem(CLE_EQUIPE, id);
    else localStorage.removeItem(CLE_EQUIPE);
  },
};
