import client, { withSignal } from "./client.js";

export async function fetchMovieDetails(id, { signal } = {}) {
  const res = await client.get(`/movie/${id}`, withSignal({}, signal));
  return res.data;
}

export async function fetchMovieVideos(id, { signal } = {}) {
  const res = await client.get(`/movie/${id}/videos`, withSignal({}, signal));
  return res.data.results || [];
}

export async function fetchRecommendations(id, { signal } = {}) {
  const res = await client.get(`/movie/${id}/recommendations`, withSignal({}, signal));
  return res.data.results || [];
}

export default fetchMovieDetails;
