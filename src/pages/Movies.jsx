import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import MovieGrid from "../components/MovieGrid.jsx";
import Card from "../components/Card.jsx";
import SkeletonGrid from "../components/Skeleton.jsx";
import EmptyState from "../components/EmptyState.jsx";
import SearchBar from "../components/SearchBar.jsx";
import GenreFilter from "../components/GenreFilter.jsx";

import discoverMovies from "../api/discover.js";
import fetchPopular from "../api/movies.js";
import searchMovies from "../api/search.js";
import fetchGenres from "../api/genres.js";
import posterUrl from "../api/images.js";

import useScrollTop from "../hooks/useScrollTop.js";
import useDebounce from "../hooks/useDebounce.js";
import useFavorites from "../store/favorites.js";

const MAX_PAGES = 150;

export default function Movies() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryRaw = searchParams.get("q") || "";
  const genreRaw = searchParams.get("genre") || "";
  const pageRaw = Number(searchParams.get("page") || "1");
  const page = Number.isNaN(pageRaw) ? 1 : Math.min(Math.max(pageRaw, 1), MAX_PAGES);

  const debouncedQuery = useDebounce(queryRaw, 400);

  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [items,   setItems]   = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [genres,  setGenres]  = useState([]);

  const fav = useFavorites();
  useScrollTop(page);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    fetchGenres({ signal: controller.signal })
      .then((data) => { if (!cancelled) setGenres(Array.isArray(data) ? data : []); })
      .catch((e) => {
        if (e?.code === "ERR_CANCELED" || e?.message === "canceled") return;
        if (!cancelled) setGenres([]);
      });

    return () => { cancelled = true; controller.abort(); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");

      try {
        const q = debouncedQuery.trim();
        const useSearch = q.length >= 2;

        let data;
        if (useSearch) {
          data = await searchMovies(q, page, { signal: controller.signal });
        } else if (genreRaw) {
          data = await discoverMovies(genreRaw, page, { signal: controller.signal });
        } else {
          data = await fetchPopular(page, { signal: controller.signal });
        }

        if (cancelled) return;

        const mapped = (data?.results || [])
          .filter(Boolean)
          .map((m) => ({
            id: m.id,
            title: m.title || m.name || "Untitled",
            year: m.release_date ? new Date(m.release_date).getFullYear() : undefined,
            rating: typeof m.vote_average === "number" ? m.vote_average : undefined,
            posterUrl: m.poster_path ? posterUrl(m.poster_path, 342) : "",
          }));

        const cappedTotal = Math.min(data?.total_pages || 1, MAX_PAGES);
        setItems(mapped);
        setTotalPages(cappedTotal);

        if (page > cappedTotal) {
          const params = new URLSearchParams(searchParams);
          params.set("page", String(cappedTotal));
          setSearchParams(params, { replace: true });
        }
      } catch (e) {
        if (e?.code === "ERR_CANCELED" || e?.message === "canceled") return;
        if (!cancelled) setError("Failed to load movies. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; controller.abort(); };
  }, [debouncedQuery, page, genreRaw, searchParams, setSearchParams]);

  function openDetails(id) {
    navigate(`/movies/${id}`);
  }

  function handleQueryChange(next) {
    const params = new URLSearchParams(searchParams);
    if (next) params.set("q", next);
    else params.delete("q");
    params.set("page", "1");
    setSearchParams(params, { replace: true });
  }

  function clearQuery() {
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    params.set("page", "1");
    setSearchParams(params, { replace: true });
  }

  function handleGenreChange(next) {
    const params = new URLSearchParams(searchParams);
    if (next) params.set("genre", next);
    else params.delete("genre");
    params.set("page", "1");
    setSearchParams(params);
  }

  function nextPage() {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(Math.min(totalPages, page + 1)));
    setSearchParams(params);
  }

  function prevPage() {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(Math.max(1, page - 1)));
    setSearchParams(params);
  }

  const isSearch = debouncedQuery.trim().length >= 2;

  return (
    <section>
      <header>
        <h1>{isSearch ? "Search results" : "Popular Movies"}</h1>
        <div>
          Page {page} / {totalPages}
          {isSearch && debouncedQuery.trim() ? ` • "${debouncedQuery.trim()}"` : ""}
        </div>
      </header>

      <div className="search-bar" aria-label="Movie search">
     
        <SearchBar
          query={queryRaw}
          onChange={handleQueryChange}
          onClear={clearQuery}
        />
      </div>

      {!isSearch && (
        <div className="genre-filter" data-horizontal aria-label="Genre filter">
    
          <GenreFilter
            genres={genres}
            selected={genreRaw}
            onChange={handleGenreChange}
          />
        </div>
      )}

      {error && <EmptyState message={error} />}

      <MovieGrid>
        {loading ? (
          <SkeletonGrid count={8} />
        ) : items.length > 0 ? (
          items.map((m) => (
            <Card
              key={m.id}
              id={m.id}
              title={m.title}
              year={m.year}
              rating={m.rating}
              posterUrl={m.posterUrl}
              onOpen={() => openDetails(m.id)}
              isFavorite={fav.isFavorite(m.id)}
              onToggleFavorite={() =>
                fav.toggle({
                  id: m.id,
                  title: m.title,
                  posterUrl: m.posterUrl,
                  year: m.year,
                  rating: m.rating,
                })
              }
            />
          ))
        ) : (
          <EmptyState
            message={
              isSearch
                ? "Nothing found."
                : genreRaw
                ? "No movies in this genre."
                : "No movies available."
            }
          />
        )}
      </MovieGrid>

      {!loading && items.length > 0 && (
      <div className="nav-controls">
  <button onClick={prevPage} disabled={page <= 1}>← Prev</button>
  <span>{page} / {totalPages}</span>
  <button onClick={nextPage} disabled={page >= totalPages}>Next →</button>
</div>

      )}
    </section>
  );
}
