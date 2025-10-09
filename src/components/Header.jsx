import { NavLink } from "react-router-dom";
import clsx from "clsx";
import s from "./Header.module.css";

export default function Header() {
  return (
    <header className={s.wrap}>
      <div className={s.inner}>
        <div className={s.brand}>🎬 Movie Explorer</div>
        <nav className={s.nav}>
          <NavLink
            to="/"
            className={({ isActive }) => clsx(s.link, isActive && s.active)}
          >
            Home
          </NavLink>
          <NavLink
            to="/movies"
            className={({ isActive }) => clsx(s.link, isActive && s.active)}
          >
            Movies
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => clsx(s.link, isActive && s.active)}
          >
            About
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
