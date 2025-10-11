import axios from "axios";


const baseURL = import.meta.env.VITE_DUMMY_API_URL || "http://localhost:3001";

const client = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

export default client;
