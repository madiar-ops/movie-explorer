import axios from "axios";

const client = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: import.meta.env.VITE_TMDB_API_KEY }, 
  headers: { Accept: "application/json" },
});

client.interceptors.response.use(
  (r) => r,
  (err) => {
    if (axios.isCancel?.(err) || err?.code === "ERR_CANCELED" || err?.message === "canceled") {
      return Promise.reject(err);
    }
    const st = err?.response?.status;
    const msg = err?.response?.data?.status_message || err.message;
    console.error("TMDB HTTP ERROR:", st, msg, err?.response?.data);
    return Promise.reject(err);
  }
);

export function withSignal(config = {}, signal) {
  return signal ? { ...config, signal } : config;
}
export default client;
