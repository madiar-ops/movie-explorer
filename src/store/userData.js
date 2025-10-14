import { useEffect, useMemo, useState } from "react";
import useFavorites from "./favorites";

const RV_LS_KEY = "movie-explorer:recentlyViewed:v1";
const RV_LIMIT = 50;

function loadRV() {
  try {
    const raw = localStorage.getItem(RV_LS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function saveRV(arr) {
  try {
    localStorage.setItem(RV_LS_KEY, JSON.stringify(arr.slice(0, RV_LIMIT)));
  } catch {}
}

export default function useUserData() {
  const fav = useFavorites((s) => ({
    ids:                      s.ids,              
    items:                    s.items,               
    notes:                    s.notes,              
    ratings:                  s.ratings,             
    isFavorite:               s.isFavorite,
    toggle:                   s.toggle,              
    setNote:                  s.setNote,
    setRating:                s.setRating,
    
  }));

  const [recentlyViewed, setRecentlyViewed] = useState(loadRV);

  useEffect(() => {
    saveRV(recentlyViewed);
  }, [recentlyViewed]);

  const api = useMemo(() => {
    return {
      favorites: fav.ids,

      isFavorite: (id) => fav.isFavorite(id),
      toggleFavorite: (id) => fav.toggle({ id }),

      notes: fav.notes,
      ratings: fav.ratings,
      setNote: (id, text) => fav.setNote(id, text),
      setRating: (id, value) => fav.setRating(id, value),

      recentlyViewed,
      addRecentlyViewed: (id) => {
        if (typeof id !== "number") return;
        setRecentlyViewed((prev) => {
          const next = [id, ...prev.filter((x) => x !== id)];
          return next.slice(0, RV_LIMIT);
        });
      },
      clearRecentlyViewed: () => setRecentlyViewed([]),
    };
  }, [fav, recentlyViewed]);

  return api;
}
