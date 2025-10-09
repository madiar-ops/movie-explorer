import client, { withSignal } from "./client.js";

async function searchMovies(query, page = 1, { signal } = {}) {
  const res = await client.get(
    "/search/movie",
    withSignal({ params: { query, page, include_adult: false } }, signal)
  );
  return res.data; 
}

export default searchMovies;
