import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
if (!BACKEND_URL) {
  console.error("REACT_APP_BACKEND_URL is not set — API requests will fail.");
}
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

// Cookie-based auth doesn't survive when the frontend and backend are on
// different sites (third-party cookie blocking), so every request also
// carries the session token as a Bearer header — see lib/auth.js for where
// it's stored after login.
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("bragr_session_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});

export const BACKEND = BACKEND_URL;
