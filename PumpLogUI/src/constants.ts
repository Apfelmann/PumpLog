// API base URL per environment. Override via VITE_API_BASE_URL if needed.
const fallbackBaseUrl = import.meta.env.DEV
  ? "http://localhost:5290/api"
  : `${window.location.origin}/api`;

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? fallbackBaseUrl;
