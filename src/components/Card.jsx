import s from "./Card.module.css";

export default function Card({ title, year, rating, posterUrl, onOpen }) {
  return (
    <article className={s.card}>
      <div className={s.posterWrap} onClick={onOpen} role="button" aria-label={`Open ${title}`}>
        {posterUrl ? (
          <img className={s.poster} src={posterUrl} alt={title} loading="lazy" />
        ) : null}
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
