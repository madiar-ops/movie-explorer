import s from "./SearchBar.module.css";

export default function SearchBar({ query, onChange, onClear, placeholder = "Search movies..." }) {
  return (
    <div className={s.wrap}>
      <input
        type="search"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search movies"
        className={s.input}
      />
      {query?.trim() ? (
        <button className={s.clearBtn} onClick={onClear} type="button">Clear</button>
      ) : null}
    </div>
  );
}
