import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE,
});

client.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const lang = "en-US"; 

  config.params = {
    api_key: apiKey,
    language: lang,
    ...(config.params || {}),
  };

  return config;
});

export function withSignal(config = {}, signal) {
  return { ...config, signal };
}

export default client;
