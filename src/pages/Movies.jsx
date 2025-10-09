import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieGrid from "../components/MovieGrid.jsx";
import Card from "../components/Card.jsx";
import { SkeletonGrid } from "../components/Skeleton.jsx";
import { fetchPopular } from "../api/movies.js";
import { posterUrl } from "../api/images.js";

export default function Movies() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchPopular(page, { signal: controller.signal });
        if (cancelled) return;

        const mapped = (data.results || []).map((m) => ({
          id: m.id,
          title: m.title || m.name || "Untitled",
          year: m.release_date ? new Date(m.release_date).getFullYear() : undefined,
          rating: typeof m.vote_average === "number" ? m.vote_average : undefined,
          posterUrl: m.poster_path ? posterUrl(m.poster_path, "w342") : "",
        }));

        setItems(mapped);
        setTotalPages(data.total_pages || 1);
      } catch (e) {
        if (!cancelled && e?.name !== "CanceledError" && e?.message !== "canceled") {
          setError("Failed to load movies. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [page]);

  function openDetails(id) {
    navigate(`/movies/${id}`);
  }

  return (
    <section>
      <header style={{ marginBottom: 12, display: "flex", alignItems: "baseline", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Popular Movies</h1>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>
          Page {page} / {totalPages}
        </span>
      </header>

      {error && (
        <div style={{ color: "#c62828", marginBottom: 12 }}>
          {error} <button onClick={() => setPage(1)}>Reload</button>
        </div>
      )}

      <MovieGrid>
        {loading ? (
          <SkeletonGrid count={8} />
        ) : (
          items.map((m) => (
            <Card
              key={m.id}
              title={m.title}
              year={m.year}
              rating={m.rating}
              posterUrl={m.posterUrl}
              onOpen={() => openDetails(m.id)}
            />
          ))
        )}
      </MovieGrid>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 16 }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          style={{
            border: "1px solid var(--border)",
            background: "#fff",
            padding: "6px 10px",
            borderRadius: 8,
            opacity: page <= 1 ? 0.6 : 1,
          }}
        >
          Prev
        </button>
        <span style={{ fontSize: 14, color: "var(--muted)" }}>
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          style={{
            border: "1px solid var(--border)",
            background: "#fff",
            padding: "6px 10px",
            borderRadius: 8,
            opacity: page >= totalPages ? 0.6 : 1,
          }}
        >
          Next
        </button>
      </div>
    </section>
  );
}
