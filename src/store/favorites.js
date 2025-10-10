import { useEffect, useRef, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const LS_KEY = "movie-explorer:favorites:v1";

let listeners = new Set();
let state = {
  items: [],          
  ids: new Set(),     
  notes: {},           
  ratings: {},         
};

function emit() {
  listeners.forEach((l) => l(state));
}

export function ratingSet(id, value) {
  const n = Math.max(0, Math.min(10, Number(value)));
  state = { ...state, ratings: { ...state.ratings, [id]: n } };
  emit();
}
export function ratingGet(id) {
  return typeof state.ratings[id] === "number" ? state.ratings[id] : 0;
}
export function getAllRatings() {
  return state.ratings;
}

export function getNotesCount() {
  return Object.values(state.notes).filter((t) => String(t || "").trim().length > 0).length;
}
export function getAverageRating() {
  const vals = Object.values(state.ratings).map(Number).filter((n) => !Number.isNaN(n));
  if (vals.length === 0) return null;
  const sum = vals.reduce((a, b) => a + b, 0);
  return Math.round((sum / vals.length) * 10) / 10; 
}

export function favGetState() {
  return state;
}
export function favSubscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function add(item) {
  if (!item || typeof item.id !== "number") return;
  if (state.ids.has(item.id)) return;

  const nextItems = [...state.items, item];
  const nextIds = new Set(state.ids);
  nextIds.add(item.id);

  state = { ...state, items: nextItems, ids: nextIds };
  emit();
}

export function remove(id) {
  if (!state.ids.has(id)) return;

  const nextItems = state.items.filter((m) => m.id !== id);
  const nextIds = new Set(state.ids);
  nextIds.delete(id);

  state = { ...state, items: nextItems, ids: nextIds };
  emit();
}

export function toggle(item) {
  if (!item || typeof item.id !== "number") return;
  state.ids.has(item.id) ? remove(item.id) : add(item);
}

export function clear() {
  if (state.items.length === 0 && state.ids.size === 0) return;
  state = { ...state, items: [], ids: new Set() };
  emit();
}

export function isFavorite(id) {
  return state.ids.has(id);
}

export function favAdd(id)    { add({ id }); }
export function favRemove(id) { remove(id); }
export function favToggle(id) { isFavorite(id) ? remove(id) : add({ id }); }
export function favHas(id)    { return isFavorite(id); }
export function favSize()     { return state.items.length; }

export function noteSet(id, text) {
  state = { ...state, notes: { ...state.notes, [id]: text || "" } };
  emit();
}
export function noteGet(id) { return state.notes[id] || ""; }
export function getAllNotes() { return state.notes; }

export function favHydrate(favorites = [], notesObj = {}, ratingsObj = {}) {
  let nextItems;
  if (Array.isArray(favorites) && favorites.length > 0) {
    if (typeof favorites[0] === "number") {
      nextItems = favorites.map((id) => ({ id }));
    } else {
      nextItems = favorites.filter((x) => x && typeof x.id === "number");
    }
  } else {
    nextItems = [];
  }

  const nextIds = new Set(nextItems.map((m) => m.id));
  const nextNotes = typeof notesObj === "object" && notesObj ? { ...notesObj } : {};
  const nextRatings = typeof ratingsObj === "object" && ratingsObj ? { ...ratingsObj } : {};

  state = { items: nextItems, ids: nextIds, notes: nextNotes, ratings: nextRatings };
  emit();
}

export function useFavorites(selector = (s) => s) {
  const [saved, setSaved] = useLocalStorage(LS_KEY, { favorites: [], notes: {}, ratings: {} });
  const [, force] = useState(0);
  const hydrated = useRef(false);

  useEffect(() => favSubscribe(() => force((x) => x + 1)), []);

  useEffect(() => {
    if (!hydrated.current && saved && Array.isArray(saved.favorites)) {
      hydrated.current = true;
      favHydrate(saved.favorites, saved.notes || {}, saved.ratings || {});
    }
  }, [saved]);


  useEffect(() => {
    function onChange(next) {
      const payload = { favorites: next.items, notes: next.notes, ratings: next.ratings };
      const same =
        JSON.stringify(payload.favorites) === JSON.stringify(saved.favorites) &&
        JSON.stringify(payload.notes) === JSON.stringify(saved.notes) &&
        JSON.stringify(payload.ratings) === JSON.stringify(saved.ratings);
      if (!same) setSaved(payload);
    }
    const unsub = favSubscribe(onChange);
    return () => unsub();
  }, [saved]);

  const snapshot = selector({
    items: state.items,
    ids: state.ids,
    notes: state.notes,
    ratings: state.ratings,
    add, remove, toggle, clear, isFavorite,
    setNote: noteSet, getNote: noteGet, getAllNotes,
    setRating: ratingSet, getRating: ratingGet, getAllRatings,
    getNotesCount, getAverageRating,
    hydrate: favHydrate,
    size: () => state.items.length,
    has: isFavorite,
  });

  return snapshot;
}

export default useFavorites;
