import s from "./GenreFilter.module.css";

export default function GenreFilter({ genres = [], selected, onChange }) {
  return (
    <div className={s.wrap}>
      <span className={s.label}>Genre:</span>
      <select
        className={s.select}
        value={selected || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
    </div>
  );
}
