import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import fetchMovieDetails, {
  fetchMovieVideos,
  fetchRecommendations,
  fetchSimilar,
} from "../api/movieDetails.js";
import posterUrl from "../api/images.js";

import Card from "../components/Card.jsx";
import SkeletonGrid from "../components/Skeleton.jsx";
import EmptyState from "../components/EmptyState.jsx";
import useFavorites from "../store/favorites.js";
import StarRating from "../components/StarRating.jsx";
import NoteBox from "../components/NoteBox.jsx";

import s from "./MovieDetail.module.css";

export default function MovieDetail() {
  const { id } = useParams();
  const idNum = Number(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [recs, setRecs] = useState([]);
  const [err, setErr] = useState("");

  const fav = useFavorites();
  const rating = fav.getRating(idNum);
  const note = fav.getNote(idNum);

  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();

    async function load() {
      setLoading(true);
      setErr("");

      try {
        const [details, vids, recResp] = await Promise.all([
          fetchMovieDetails(idNum, { signal: ac.signal }),
          fetchMovieVideos(idNum, { signal: ac.signal }),
          fetchRecommendations(idNum, { signal: ac.signal }),
        ]);
        if (cancelled) return;

        const videosArr = Array.isArray(vids) ? vids : [];
        let recItems = Array.isArray(recResp?.results) ? recResp.results : [];

        if (recItems.length === 0) {
          try {
            const sim = await fetchSimilar(idNum, { signal: ac.signal });
            recItems = Array.isArray(sim?.results) ? sim.results : [];
          } catch (e) {
            if (e?.code === "ERR_CANCELED" || e?.message === "canceled") {
            }
          }
        }

        setMovie(details || null);
        setVideos(videosArr);
        setRecs(recItems.slice(0, 8)); 
      } catch (e) {
        if (e?.code === "ERR_CANCELED" || e?.message === "canceled") return;
        setErr("Failed to load movie details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [idNum]);

  if (loading) return <SkeletonGrid count={4} />;
  if (err) return <EmptyState message={err} />;
  if (!movie) return <EmptyState message="Movie not found." />;

  const trailer =
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
    videos.find((v) => v.site === "YouTube");

  return (
    <section>
      <button className={s.backBtn} onClick={() => navigate(-1)} type="button">
        ← Back
      </button>

      <div className={s.layout}>
        <img
          className={s.poster}
          src={posterUrl(movie.poster_path || movie.backdrop_path, "w500")}
          alt={movie.title || movie.name || "Untitled"}
        />

        <div className={s.info}>
          <h1 className={s.title}>{movie.title || movie.name || "Untitled"}</h1>
          <p className={s.meta}>
            {movie.release_date || movie.first_air_date || "—"} • ★{" "}
            {typeof movie.vote_average === "number" ? movie.vote_average.toFixed(1) : "—"}{" "}
            {movie.vote_count ? `(${movie.vote_count} votes)` : ""}
          </p>

          <div className={s.genreList}>
            {Array.isArray(movie.genres) &&
              movie.genres.map((g) => (
                <span key={g.id} className={s.genre}>
                  {g.name}
                </span>
              ))}
          </div>

          <p className={s.overview}>{movie.overview || "No description available."}</p>
        </div>

        <div className={s.reviewSection}>
          <h3>Your Review</h3>
          <StarRating value={rating} onChange={(n) => fav.setRating(idNum, n)} />
          <NoteBox value={note} onChange={(txt) => fav.setNote(idNum, txt)} />
        </div>
      </div>

      {trailer && (
        <iframe
          className={s.video}
          src={`https://www.youtube.com/embed/${trailer.key}`}
          allowFullScreen
          title={trailer.name || "Trailer"}
        />
      )}

      <h2>Recommended</h2>
      {recs.length > 0 ? (
        <div className={s.recoGrid}>
          {recs.map((m) => (
            <Card key={m.id ?? crypto.randomUUID()} movie={m} />
          ))}
        </div>
      ) : (
        <EmptyState message="No recommendations." />
      )}
    </section>
  );
}
