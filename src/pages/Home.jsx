import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import fetchPopular from "../api/movies.js";
import fetchGenres from "../api/genres.js";
import posterUrl from "../api/images.js";

import Card from "../components/Card.jsx";
import SkeletonGrid from "../components/Skeleton.jsx";
import useFavorites from "../store/favorites.js";

import s from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const [loading, setLoading] = useState(true);
  const [popular, setPopular] = useState([]);
  const [genres, setGenres] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const [pop, gs] = await Promise.all([fetchPopular(1), fetchGenres()]);
        if (ignore) return;
        setPopular(pop?.results ?? []);
        setGenres(gs?.genres ?? []);
        setErr("");
      } catch (e) {
        if (!ignore) setErr(e?.message || "Failed to load home data");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const getImg = (path, kind = "backdrop") => {
    if (!path) return "";
    try {
      if (typeof posterUrl === "function") {
        const size = kind === "poster" ? "w342" : "w780";
        return posterUrl(path, size);
      }
      if (kind === "backdrop" && typeof posterUrl?.backdrop === "function") {
        return posterUrl.backdrop(path);
      }
      if (kind === "poster" && typeof posterUrl?.poster === "function") {
        return posterUrl.poster(path);
      }
      if (posterUrl?.w780) return `${posterUrl.w780}${path}`;
      if (posterUrl?.original) return `${posterUrl.original}${path}`;
    } catch {}
    const size = kind === "poster" ? "w342" : "w780";
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  const heroBackdrop = useMemo(() => {
    const m = popular?.[0];
    const p = m?.backdrop_path || m?.poster_path;
    const url = getImg(p, "backdrop");
    return url ? `url(${url})` : "";
  }, [popular]);

  const topGenres = useMemo(() => genres.slice(0, 10), [genres]);

  return (
    <div className={s.page}>
      <section
        className={s.hero}
        style={heroBackdrop ? { "--hero-bg": heroBackdrop } : undefined}
        aria-label="Intro section"
      >
        <div className={s.heroInner}>
          <h1 className={s.title}>Welcome to Movie Explorer</h1>
          <p className={s.lead}>
            Каталог фильмов с поиском, фильтрами, деталями и локальными «Избранными».
            Данные — из TMDB. 
          </p>

          <div className={s.cta}>
            <button className="btn btn--primary" onClick={() => navigate("/movies")}>
              Открыть каталог
            </button>
            <Link to="/about" className="btn btn--outline">О проекте</Link>
          </div>

          <div className={s.stats} aria-label="Quick stats">
            <div className={s.stat}>
              <span className={s.statVal}>{popular.length || "—"}</span>
              <span className={s.statLabel}>популярных</span>
            </div>
            <div className={s.stat}>
              <span className={s.statVal}>{genres.length || "—"}</span>
              <span className={s.statLabel}>жанров</span>
            </div>
            <div className={s.stat}>
              <span className={s.statVal}>{favorites.length || 0}</span>
              <span className={s.statLabel}>в избранном</span>
            </div>
          </div>
        </div>
        <div className={s.heroGradient} />
      </section>

      {topGenres.length > 0 && (
        <section className={s.section} aria-labelledby="quick-genres">
          <div className={s.sectionHead}>
            <h2 id="quick-genres" className={s.h2}>Быстрые жанры</h2>
            <button className="btn btn--ghost" onClick={() => navigate("/movies")}>
              Все фильмы
            </button>
          </div>

          <div className={s.chips}>
            {topGenres.map((g) => (
              <button
                key={g.id}
                className={s.chip}
                onClick={() => navigate(`/movies?genre=${g.id}`)}
                title={g.name}
              >
                {g.name}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className={s.section} aria-labelledby="popular-now">
        <div className={s.sectionHead}>
          <h2 id="popular-now" className={s.h2}>Сейчас в топе</h2>
          <button className="btn btn--ghost" onClick={() => navigate("/movies")}>Смотреть всё</button>
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : err ? (
          <div className="alert alert--danger">{err}</div>
        ) : (
          <div className={s.row} role="list">
            {popular.slice(0, 12).map((m) => (
              <div key={m.id} className={s.rowItem} role="listitem">
                <Card movie={m} compact />
              </div>
            ))}
          </div>
        )}
      </section>

      {favorites.length > 0 && (
        <section className={s.section} aria-labelledby="fav-preview">
          <div className={s.sectionHead}>
            <h2 id="fav-preview" className={s.h2}>Ваши избранные</h2>
            <Link to="/favorites" className="btn btn--ghost">Открыть избранное</Link>
          </div>

          <div className={s.grid}>
            {favorites.slice(0, 8).map((m) => (
              <Card key={m.id} movie={m} compact />
            ))}
          </div>
        </section>
      )}

      <footer className={s.footer}>
        <p>© Movie Explorer · TMDB API</p>
      </footer>
    </div>
  );
}
