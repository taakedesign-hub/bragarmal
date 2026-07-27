import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { TID } from "@/lib/testIds";

export default function AuthCallback() {
  const nav = useNavigate();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);
  const [status, setStatus] = useState("Bekrefter innlogging…");

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    (async () => {
      const hash = window.location.hash || "";
      const m = hash.match(/session_id=([^&]+)/);
      if (!m) {
        setStatus("Fant ingen økt. Sender deg tilbake…");
        setTimeout(() => nav("/", { replace: true }), 800);
        return;
      }
      const session_id = decodeURIComponent(m[1]);
      try {
        const r = await api.post("/auth/session", { session_id });
        setUser(r.data);
        // Clear hash & go
        window.history.replaceState(null, "", "/dashboard");
        nav("/dashboard", { replace: true, state: { user: r.data } });
      } catch (e) {
        setStatus("Kunne ikke bekrefte økt. Prøv igjen.");
        setTimeout(() => nav("/", { replace: true }), 1500);
      }
    })();
  }, [nav, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div data-testid={TID.authCallbackStatus} className="text-center">
        <span className="pulse-dot" />
        <div className="label-ui mt-4">{status}</div>
      </div>
    </div>
  );
}
