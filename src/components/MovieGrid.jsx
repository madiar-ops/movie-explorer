import Card from "./Card";
import s from "./MovieGrid.module.css";

export default function MovieGrid({ movies, children }) {
  if (children) {
    return <div className={s.grid}>{children}</div>;
  }

  const items = Array.isArray(movies) ? movies.filter(Boolean) : [];
  if (!items.length) return null;

  return (
    <div className={s.grid}>
      {items.map((m, idx) => {
        const key = m?.id ?? m?.movie_id ?? `row-${idx}`;
        return <Card key={key} movie={m} />;
      })}
    </div>
  );
}
