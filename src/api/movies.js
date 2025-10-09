import client, { withSignal } from "./client";
const PAGE_LIMIT = 150;
export async function fetchPopular(page = 1, { signal } = {}) {
  const safePage = Math.min(page, PAGE_LIMIT);
  const res = await client.get("/movie/popular", withSignal({ params: { page: safePage } }, signal));
  const data = res.data;
  data.total_pages = Math.min(data.total_pages, PAGE_LIMIT);
  return data;
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
export default fetchPopular;
