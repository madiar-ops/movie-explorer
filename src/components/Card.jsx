import { Link } from "react-router-dom";
import posterUrl from "../api/images";
import useUserData from "../store/userData";
import s from "./Card.module.css";

function PinIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function Card(props) {
  const movie = props.movie;

  const id =
    (movie && (movie.id ?? movie.movie_id)) ??
    props.id;

  if (id == null) return null;

  const title =
    (movie && (movie.title || movie.name)) ??
    props.title ??
    "Untitled";

  const posterPath = movie?.poster_path || movie?.backdrop_path || null;
  const imgSrc =
    props.posterUrl ||
    movie?.posterUrl ||   
    (posterPath ? posterUrl(posterPath, 342) : "");

  const user = useUserData?.() 
  const fav = user.favorites?.has?.(id) || false;

  return (
    <div className={s.card} data-fav={fav ? "1" : "0"}>
      <button
        className={s.pin}
        onClick={() => user.toggleFavorite?.(id)}
        aria-label={fav ? "Unpin from favorites" : "Pin to favorites"}
        title={fav ? "Unpin" : "Pin"}
        type="button"
      >
        <PinIcon active={fav} />
      </button>

      <Link to={`/movies/${id}`} className={s.cover}>
        {imgSrc ? (
          <img src={imgSrc} alt={title} loading="lazy" />
        ) : (
          <div className={s.noPoster}>No poster</div>
        )}
      </Link>

      <div className={s.meta}>
        <Link to={`/movies/${id}`} className={s.title}>{title}</Link>
      </div>
    </div>
  );
}
