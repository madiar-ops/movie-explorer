import { create } from "zustand";

const persistKey = "movie-explorer:userData:v2";

const defaultState = {
  favorites: new Set(),
  notes: {},           
  ratings: {},            
  tags: {},               
  recentlyViewed: [],    
};

function revive(state) {
  if (!state) return defaultState;
  return {
    ...defaultState,
    ...state,
    favorites: new Set(state.favorites || []),
  };
}

export const useUserData = create((set, get) => ({
  ...revive(JSON.parse(localStorage.getItem(persistKey) || "null")),

  _flush() {
    const { favorites, notes, ratings, tags, recentlyViewed } = get();
    localStorage.setItem(
      persistKey,
      JSON.stringify({
        favorites: Array.from(favorites),
        notes,
        ratings,
        tags,
        recentlyViewed,
      })
    );
  },

  toggleFavorite(id) {
    const { favorites, _flush } = get();
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    set({ favorites: new Set(favorites) });
    _flush();
  },

  setNote(id, text) {
    const { notes, _flush } = get();
    const next = { ...notes, [id]: text || "" };
    set({ notes: next });
    _flush();
  },

  setRating(id, value) {
    const { ratings, _flush } = get();
    const next = { ...ratings, [id]: Number(value) || 0 };
    set({ ratings: next });
    _flush();
  },

  setTags(id, arr) {
    const { tags, _flush } = get();
    const uniq = Array.from(new Set((arr || []).map(s => s.trim()).filter(Boolean)));
    const next = { ...tags, [id]: uniq };
    set({ tags: next });
    _flush();
  },

  addTag(id, tag) {
    const { tags, _flush } = get();
    const curr = tags[id] || [];
    const next = Array.from(new Set([...curr, tag.trim()])).filter(Boolean);
    set({ tags: { ...tags, [id]: next } });
    _flush();
  },

  removeTag(id, tag) {
    const { tags, _flush } = get();
    const curr = tags[id] || [];
    const next = curr.filter(t => t.toLowerCase() !== String(tag).toLowerCase());
    set({ tags: { ...tags, [id]: next } });
    _flush();
  },

  touchViewed(id) {
    const { recentlyViewed, _flush } = get();
    const filtered = recentlyViewed.filter(x => x !== id);
    const next = [id, ...filtered].slice(0, 50);
    set({ recentlyViewed: next });
    _flush();
  },
}));

export default useUserData;
