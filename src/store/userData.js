import { create } from "zustand";

const STORAGE_KEY = "movie_user_data_v1";

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}
function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}


const useUserData = create((set, get) => ({
  userData: load(),

  setRating(id, rating) {
    const next = { ...get().userData, [id]: { ...(get().userData[id] || {}), rating } };
    set({ userData: next });
    save(next);
  },

  setNote(id, note) {
    const next = { ...get().userData, [id]: { ...(get().userData[id] || {}), note } };
    set({ userData: next });
    save(next);
  },

  getRating(id) {
    return get().userData[id]?.rating || 0;
  },

  getNote(id) {
    return get().userData[id]?.note || "";
  },

  clear() {
    set({ userData: {} });
    save({});
  },
}));

export default useUserData;
