// Reverse-proxies /api/* to the Railway backend so the frontend and the API
// are same-origin from the browser's point of view — this is what lets the
// session cookie survive (browsers now block cross-site cookies by default,
// which is what broke login when the API lived on a different domain).
const BACKEND_ORIGIN = "https://bragarmal-production.up.railway.app";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      const upstream = new URL(url.pathname + url.search, BACKEND_ORIGIN);
      const upstreamRequest = new Request(upstream.toString(), request);
      return fetch(upstreamRequest);
    }
    return env.ASSETS.fetch(request);
  },
};
