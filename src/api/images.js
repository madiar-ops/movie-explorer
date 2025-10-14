export default function posterUrl(path, size = 342) {
  if (!path) return "";
  const s = typeof size === "number" ? `w${size}` : String(size);
  return `https://image.tmdb.org/t/p/${s}${path}`;
}
