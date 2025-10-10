import s from "./Card.module.css";
import FavButton from "./FavButton.jsx";

export default function Card({ id, title, year, rating, posterUrl, onOpen, isFavorite, onToggleFavorite }) {
  return (
    <article className={s.card}>
      <div className={s.posterWrap} role="button" aria-label={`Open ${title}`} onClick={onOpen}>
        {posterUrl ? <img className={s.poster} src={posterUrl} alt={title} loading="lazy" /> : null}
        <div className={s.overlay}>
          <div className={s.topRight}>
            {typeof isFavorite === "boolean" && onToggleFavorite ? (
              <FavButton
                active={isFavorite}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className={s.body}>
        <h3 className={s.title} title={title}>{title}</h3>
        <div className={s.meta}>
          {year ? <span className={s.tag}>{year}</span> : null}
          {typeof rating === "number" ? <span className={s.tag}>★ {rating.toFixed(1)}</span> : null}
        </div>
        <div className={s.actions}>
          <button className={s.button} onClick={onOpen}>Details</button>
        </div>
      </div>
    </article>
  );
}
