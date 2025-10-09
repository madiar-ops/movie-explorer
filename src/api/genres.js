import client, { withSignal } from "./client.js";

async function fetchGenres({ signal } = {}) {
  const res = await client.get("/genre/movie/list", withSignal({}, signal));
  return res.data.genres; 
}

export default fetchGenres;
