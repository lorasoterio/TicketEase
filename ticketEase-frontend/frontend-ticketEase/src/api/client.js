// src/api/client.js
import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7156/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;