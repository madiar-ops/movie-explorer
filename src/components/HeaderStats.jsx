import React from "react";
import useFavorites from "../store/favorites.js";
import s from "./HeaderStats.module.css";

export default function HeaderStats() {
  const fav = useFavorites();
  const avg = fav.getAverageRating();      
  const notesCount = fav.getNotesCount();  

  return (
    <div className={s.stats} aria-label="user-stats">
      <div className={s.item} title="Average user rating">
        <span className={s.icon} aria-hidden>★</span>
        <span className={s.value}>{avg !== null ? avg : "—"}</span>
      </div>
      <div className={s.sep} aria-hidden>•</div>
      <div className={s.item} title="Movies with notes">
        <span className={s.icon} aria-hidden>📓</span>
        <span className={s.value}>{notesCount}</span>
      </div>
    </div>
  );
}
