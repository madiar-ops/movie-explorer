import client, { withSignal } from "./client";

export async function fetchPopular(page = 1, { signal } = {}) {
  const res = await client.get("/movie/popular", withSignal({ params: { page } }, signal));
  return res.data; 
}

export async function fetchByQuery(query, page = 1, { signal } = {}) {
  const res = await client.get(
    "/search/movie",
    withSignal({ params: { query, page, include_adult: false } }, signal)
  );
  return res.data;
}

export async function fetchById(id, { signal } = {}) {
  const res = await client.get(`/movie/${id}`, withSignal({}, signal));
  return res.data;
}

export async function fetchGenres({ signal } = {}) {
  const res = await client.get("/genre/movie/list", withSignal({}, signal));
  return res.data.genres; 
}
