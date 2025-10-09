import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import fetchMovieDetails, { fetchMovieVideos, fetchRecommendations } from "../api/movieDetails.js";
import posterUrl from "../api/images.js";
import Card from "../components/Card.jsx";
import SkeletonGrid from "../components/Skeleton.jsx";
import EmptyState from "../components/EmptyState.jsx";

import s from "./MovieDetail.module.css";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [recs, setRecs] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const [details, vids, recList] = await Promise.all([
          fetchMovieDetails(id, { signal: controller.signal }),
          fetchMovieVideos(id, { signal: controller.signal }),
          fetchRecommendations(id, { signal: controller.signal }),
        ]);

        if (cancelled) return;

        setMovie(details);
        setVideos(vids);
        setRecs(recList.slice(0, 8)); 
      } catch {
        if (!cancelled) setErr("Failed to load movie details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [id]);

  if (loading) return <SkeletonGrid count={4} />;
  if (err) return <EmptyState message={err} />;
  if (!movie) return <EmptyState message="Movie not found." />;

  const trailer = videos.find((v) => v.site === "YouTube" && v.type === "Trailer");

  return (
    <section>
      <button className={s.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className={s.layout}>
        <img
          className={s.poster}
          src={posterUrl(movie.poster_path, "w500")}
          alt={movie.title}
        />

        <div className={s.info}>
          <h1 className={s.title}>{movie.title}</h1>
          <p className={s.meta}>
            {movie.release_date} • ★ {movie.vote_average?.toFixed(1)} ({movie.vote_count} votes)
          </p>

          <div className={s.genreList}>
            {movie.genres?.map((g) => (
              <span key={g.id} className={s.genre}>{g.name}</span>
            ))}
          </div>

          <p className={s.overview}>{movie.overview || "No description available."}</p>
        </div>
      </div>

      {trailer && (
        <iframe
          className={s.video}
          src={`https://www.youtube.com/embed/${trailer.key}`}
          allowFullScreen
          title={trailer.name}
        ></iframe>
      )}

      <h2>Recommended</h2>
      {recs.length > 0 ? (
        <div className={s.recoGrid}>
          {recs.map((m) => (
            <Card
              key={m.id}
              title={m.title}
              year={m.release_date ? new Date(m.release_date).getFullYear() : undefined}
              rating={m.vote_average}
              posterUrl={posterUrl(m.poster_path, "w342")}
              onOpen={() => navigate(`/movies/${m.id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="No recommendations." />
      )}
    </section>
  );
}
