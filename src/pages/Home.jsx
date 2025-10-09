import { Link } from "react-router-dom";
import s from "./Home.module.css";

export default function Home() {
  return (
    <section>
      <h1>Welcome to Movie Explorer</h1>
      <p className={s.lead}>
        Каталог фильмов с поиском, фильтрами, деталями и вашей локальной коллекцией.
        Проект на React + React Router + CSS Modules. Данные — из TMDB.
      </p>
      <div className={s.actions}>
        <Link to="/movies" className={s.linkBtn}>Открыть каталог</Link>
        <Link to="/about" className={s.link}>О проекте</Link>
      </div>
    </section>
  );
}
