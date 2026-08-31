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

export const BACKEND = BACKEND_URL;
