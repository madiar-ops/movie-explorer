import { Link } from "react-router-dom";
import posterUrl from "../api/images";
import useUserData from "../store/userData";
import s from "./Card.module.css";

function PinIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M14 3l7 7-4 1-3 6-4-4 6-3 1-4zM5 19l6-1-5-5-1 6z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function Card({ movie }) {
  if (!movie || typeof movie !== "object") return null;

  const id = movie.id ?? movie.movie_id; 
  if (id == null) return null;

  const title = movie.title || movie.name || "Untitled";
  const posterPath = movie.poster_path || movie.backdrop_path || null;

  const user = useUserData();
  const fav = user.favorites.has(id);
  const tags = user.tags[id] || [];

  return (
    <div className={s.card} data-fav={fav ? "1" : "0"}>
      <button
        className={s.pin}
        onClick={() => user.toggleFavorite(id)}
        aria-label={fav ? "Unpin from favorites" : "Pin to favorites"}
        title={fav ? "Unpin" : "Pin"}
        type="button"
      >
        <PinIcon active={fav} />
      </button>

      <Link to={`/movie/${id}`} className={s.cover}>
        {posterPath ? (
          <img src={posterUrl(posterPath, 342)} alt={title} loading="lazy" />
        ) : (
          <div className={s.noPoster}>No poster</div>
        )}
      </Link>

      <div className={s.meta}>
        <Link to={`/movie/${id}`} className={s.title}>{title}</Link>
        <div className={s.badges}>
          {tags.slice(0, 4).map((t) => (
            <span key={t} className={s.tag}>{t}</span>
          ))}
          {tags.length > 4 && <span className={s.more}>+{tags.length - 4}</span>}
        </div>
      </div>
    </div>
  );
}
