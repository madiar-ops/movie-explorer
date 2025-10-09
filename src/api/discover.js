import client, { withSignal } from "./client.js";

/**
 * @param {string|number} genreId
 * @param {number} page
 * @param {{signal?: AbortSignal}} opts
 */
async function discoverMovies(genreId, page = 1, { signal } = {}) {
  const res = await client.get(
    "/discover/movie",
    withSignal(
      {
        params: {
          page,
          with_genres: genreId,
          sort_by: "popularity.desc",
          include_adult: false,
        },
      },
      signal
    )
  );
  return res.data; 
}

export default discoverMovies;
