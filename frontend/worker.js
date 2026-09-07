// Reverse-proxies /api/* to the Railway backend so the frontend and the API
// are same-origin from the browser's point of view — this is what lets the
// session cookie survive (browsers now block cross-site cookies by default,
// which is what broke login when the API lived on a different domain).
const BACKEND_ORIGIN = "https://bragarmal-production.up.railway.app";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      const upstream = BACKEND_ORIGIN + url.pathname + url.search;
      const init = {
        method: request.method,
        headers: request.headers,
        // "manual" — the OAuth callback returns a 307 to /dashboard; if we
        // let fetch() follow it internally, the Worker (not the browser)
        // would end up fetching our own /dashboard route, which is wrong.
        // Passing the redirect straight through lets the browser navigate.
        redirect: "manual",
      };
      if (!["GET", "HEAD"].includes(request.method)) {
        init.body = request.body;
        init.duplex = "half";
      }
      try {
        const resp = await fetch(upstream, init);
        return new Response(resp.body, resp);
      } catch (err) {
        return new Response(
          JSON.stringify({ detail: "Fikk ikke kontakt med serveren — prøv igjen om litt." }),
          { status: 502, headers: { "content-type": "application/json" } }
        );
      }
    }
    return env.ASSETS.fetch(request);
  },
};
