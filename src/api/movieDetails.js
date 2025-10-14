import client, { withSignal } from "./client";

export default async function fetchMovieDetails(movieId, { signal } = {}) {
  const r = await client.get(`/movie/${movieId}`, withSignal({}, signal));
  return r.data || null;
}

export async function fetchMovieVideos(movieId, { signal } = {}) {
  const r = await client.get(
    `/movie/${movieId}/videos`,
    withSignal({ params: { language: "en-US" } }, signal)
  );
  // На TMDB формат { id, results: [] }
  return Array.isArray(r.data?.results) ? r.data.results : [];
}

/** Рекомендации (вернём объект {results, total_pages, ...}) */
export async function fetchRecommendations(movieId, { signal } = {}) {
  const r = await client.get(
    `/movie/${movieId}/recommendations`,
    withSignal({ params: { page: 1 } }, signal)
  );
  // Гарантируем наличие results-массива
  const results = Array.isArray(r.data?.results) ? r.data.results : [];
  return { ...r.data, results };
}

/** Similar — пригодится как фолбэк, если рекомендаций нет */
export async function fetchSimilar(movieId, { signal } = {}) {
  const r = await client.get(
    `/movie/${movieId}/similar`,
    withSignal({ params: { page: 1 } }, signal)
  );
  const results = Array.isArray(r.data?.results) ? r.data.results : [];
  return { ...r.data, results };
}
