import { useEffect, useMemo, useState } from "react";
import MovieGrid from "../components/MovieGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";
import useFavorites from "../store/favorites.js";
import ExportImportPanel from "../components/ExportImportPanel.jsx";
import client from "../api/client";               
import posterUrl from "../api/images";           
import s from "./Favorites.module.css";

export default function Favorites() {
  const fav = useFavorites();
  const items = fav.items; 

  const [displayItems, setDisplayItems] = useState(items);

  const missing = useMemo(
    () => items.filter(m => !m?.title || !m?.posterUrl).map(m => m.id),
    [items]
  );

  useEffect(() => {
    let alive = true;
    if (missing.length === 0) {
      setDisplayItems(items);
      return;
    }

    (async () => {
      try {
        const res = await Promise.allSettled(
          missing.map(id => client.get(`/movie/${id}`))
        );
        const enriched = new Map(items.map(m => [m.id, { ...m }]));

        res.forEach((r) => {
          if (r.status !== "fulfilled") return;
          const d = r.value?.data;
          if (!d?.id) return;
          enriched.set(d.id, {
            id: d.id,
            title: d.title || d.name || "Untitled",
            posterUrl: d.poster_path ? posterUrl(d.poster_path, 342) : "",
            year: d.release_date ? new Date(d.release_date).getFullYear() : undefined,
            rating: typeof d.vote_average === "number" ? d.vote_average : undefined,
          });
        });

        if (alive) setDisplayItems(Array.from(enriched.values()));
      } catch {
        if (alive) setDisplayItems(items);
      }
    })();

    return () => { alive = false; };
  }, [items, missing]);

  const getFavorites = () => items;
  const getAllNotes = () => (typeof fav.getAllNotes === "function" ? fav.getAllNotes() : {});

  const applyBackup = async (data) => {
    const nextItems = Array.isArray(data.favorites) ? data.favorites : [];
    fav.clear();
    for (const m of nextItems) {
      if (!fav.isFavorite(m.id)) fav.toggle(m);
    }
    if (data.notes && typeof fav.setNote === "function") {
      for (const [idStr, text] of Object.entries(data.notes)) {
        const id = Number(idStr);
        if (!Number.isNaN(id)) fav.setNote(id, String(text || ""));
      }
    }
  };

  return (
    <section>
      <header className={s.header}>
        <h1 className={s.title}>Favorites</h1>
        <div className={s.subtitle}>{items.length} saved</div>
      </header>

      <div className={s.actions}>
        <button className={s.btn} onClick={() => fav.clear()} disabled={items.length === 0}>
          Clear all
        </button>
        <ExportImportPanel
          getFavorites={getFavorites}
          getAllNotes={getAllNotes}
          applyBackup={applyBackup}
        />
      </div>

      {items.length === 0 ? (
        <EmptyState message="No favorites yet." />
      ) : (
        <MovieGrid movies={displayItems} />
      )}
    </section>
  );
}
