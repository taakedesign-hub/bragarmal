import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "./api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const r = await api.get("/auth/me");
      setUser(r.data);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // CRITICAL: If returning from OAuth callback, skip the /me check.
    // AuthCallback will exchange the session_id and establish the session first.
    if (typeof window !== "undefined" && window.location.hash?.includes("session_id=")) {
      setLoading(false);
      return;
    }
    // Returning from the direct Google OAuth callback: the token rides in
    // the URL hash (never sent to any server) since the cookie it also sets
    // may get silently dropped by third-party-cookie blocking.
    if (typeof window !== "undefined" && window.location.hash?.includes("session_token=")) {
      const m = window.location.hash.match(/session_token=([^&]+)/);
      if (m) {
        try { localStorage.setItem("bragr_session_token", decodeURIComponent(m[1])); } catch {}
      }
      window.history.replaceState(null, "", window.location.pathname);
    }
    checkAuth();
  }, [checkAuth]);

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    try { localStorage.removeItem("bragr_session_token"); } catch {}
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthCtx.Provider value={{ user, setUser, loading, checkAuth, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
