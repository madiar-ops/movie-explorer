import { useNavigate } from "react-router-dom";
import MovieGrid from "../components/MovieGrid.jsx";
import Card from "../components/Card.jsx";
import EmptyState from "../components/EmptyState.jsx";
import useFavorites from "../store/favorites.js";
import ExportImportPanel from "../components/ExportImportPanel.jsx";
import s from "./Favorites.module.css";

export default function Favorites() {
  const fav = useFavorites();
  const navigate = useNavigate();
  const items = fav.items;

  
  const getFavorites = () => items; 


  const getAllNotes = () => {
  
    return typeof fav.getAllNotes === "function" ? fav.getAllNotes() : {};
  };


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
        <MovieGrid>
          {items.map((m) => (
            <Card
              key={m.id}
              id={m.id}
              title={m.title}
              year={m.year}
              rating={m.rating}
              posterUrl={m.posterUrl}
              onOpen={() => navigate(`/movies/${m.id}`)}
              isFavorite={fav.isFavorite(m.id)}
              onToggleFavorite={() => fav.toggle(m)}
            />
          ))}
        </MovieGrid>
      )}
    </section>
  );
}
