const BASE_IMG = import.meta.env.VITE_TMDB_IMG || "https://image.tmdb.org/t/p";
export function posterUrl(path, size = "w342") {
  if (!path) return ""; 
  return `${BASE_IMG}/${size}${path}`;
}
