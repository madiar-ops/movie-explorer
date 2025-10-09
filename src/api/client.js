import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE,
  params: { api_key: import.meta.env.b9604d9e93d7854b79f845a96e2c663a, language: "en-US" },
});


export function withSignal(config = {}, signal) {
  return { ...config, signal };
}

export default client;
