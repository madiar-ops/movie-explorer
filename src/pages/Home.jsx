import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section>
      <h1>Welcome to Movie Explorer</h1>
      <p style={{ color: "var(--muted)", maxWidth: 640 }}>
        Каталог фильмов с поиском, фильтрами, деталями и вашей локальной коллекцией.
        Проект на React + React Router + CSS Modules. Данные — из TMDB.
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/movies" style={{
          border: "1px solid var(--border)",
          background: "#fff",
          padding: "8px 12px",
          borderRadius: 8
        }}>
          Открыть каталог
        </Link>
        <Link to="/about" style={{ padding: "8px 12px" }}>
          О проекте
        </Link>
      </div>
    </section>
  );
}
