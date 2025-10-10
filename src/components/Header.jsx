import { NavLink } from "react-router-dom";
import clsx from "clsx";
import s from "./Header.module.css";
import useFavorites from "../store/favorites.js";
import HeaderStats from "../components/HeaderStats.jsx"
export default function Header() {
  const fav = useFavorites();
    const savedCount =
    Array.isArray(fav?.items) ? fav.items.length
    : fav?.ids instanceof Set ? fav.ids.size
    : 0;

  return (
    <header className={s.wrap}>
      <div className={s.inner}>
        <div className={s.brand}>🎬 Movie Explorer</div>
        <nav className={s.nav}>
          <NavLink to="/" className={({ isActive }) => clsx(s.link, isActive && s.active)}>Home</NavLink>
          <NavLink to="/movies" className={({ isActive }) => clsx(s.link, isActive && s.active)}>Movies</NavLink>
          <NavLink to="/favorites" className={({ isActive }) => clsx(s.link, isActive && s.active)}>
            Favorites
            {savedCount > 0 ? <span className={s.badge}>{savedCount}</span> : null}
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => clsx(s.link, isActive && s.active)}>About</NavLink>
          <HeaderStats />
        </nav>
      </div>
    </header>
  );
}
