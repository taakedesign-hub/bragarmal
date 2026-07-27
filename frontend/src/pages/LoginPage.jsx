import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Feather, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const TID = {
  googleBtn: "auth-google-btn",
  emailInput: "auth-email-input",
  passwordInput: "auth-password-input",
  nameInput: "auth-name-input",
  submitBtn: "auth-submit-btn",
  toggleMode: "auth-toggle-mode",
};

function startGoogleLogin() {
  const redirectUrl = window.location.origin + "/dashboard";
  window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
}

function formatDetail(detail) {
  if (detail == null) return "Noe gikk galt. Prøv igjen.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const { setUser } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e?.preventDefault?.();
    if (busy) return;
    if (!email.trim() || !password) { toast("Fyll ut e-post og passord"); return; }
    if (mode === "register" && password.length < 8) { toast("Passord må være minst 8 tegn"); return; }

    setBusy(true);
    try {
      const url = mode === "register" ? "/auth/register" : "/auth/login";
      const body = mode === "register"
        ? { email: email.trim(), password, name: name.trim() || undefined }
        : { email: email.trim(), password };
      const r = await api.post(url, body);
      setUser(r.data);
      nav("/dashboard", { replace: true });
    } catch (err) {
      toast(formatDetail(err?.response?.data?.detail) || "Innlogging feilet");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Feather size={18} strokeWidth={1.4} />
            <span className="font-serif-display text-xl tracking-widest">ECHO</span>
          </Link>
          <Link to="/" className="label-ui inline-flex items-center gap-2">
            <ArrowLeft size={14} strokeWidth={1.5} /> Tilbake
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left — copy */}
        <div className="lg:col-span-6">
          <div className="label-ui">Velkommen</div>
          <h1 className="font-serif-display text-5xl md:text-6xl font-light mt-3" style={{ color: "var(--ink)" }}>
            Logg inn i <em className="italic" style={{ color: "var(--moss)" }}>Echo</em>.
          </h1>
          <p className="font-editor text-lg mt-6 max-w-[48ch]" style={{ color: "var(--ink-soft)" }}>
            Velg den innloggingen du foretrekker. All data — tekster, opptak, stemmeprofil —
            er scoped kun til din konto. Ingen andre ser den.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 px-3 py-1.5" style={{ background: "var(--linen)", color: "var(--ink)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--ink)" }} />
            <span className="font-mono-ui text-xs tracking-wider">BETA · GRATIS FOR DE 10 FØRSTE</span>
          </div>
        </div>

        {/* Right — auth panel */}
        <div className="lg:col-span-6">
          <div className="paper p-8 md:p-10">
            {/* Google */}
            <button
              data-testid={TID.googleBtn}
              onClick={startGoogleLogin}
              className="btn-ghost w-full inline-flex items-center justify-center gap-3"
              style={{ padding: "0.9rem 1.25rem" }}
            >
              <GoogleGlyph /> Fortsett med Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
              <span className="label-ui" style={{ color: "var(--ink-mute)" }}>eller med e-post</span>
              <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
            </div>

            <form onSubmit={submit}>
              {mode === "register" && (
                <div className="mb-5">
                  <div className="label-ui mb-2">Navn (valgfritt)</div>
                  <input
                    data-testid={TID.nameInput}
                    className="input-line"
                    placeholder="Ditt navn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              )}
              <div className="mb-5">
                <div className="label-ui mb-2">E-post</div>
                <input
                  data-testid={TID.emailInput}
                  className="input-line"
                  type="email"
                  placeholder="deg@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="mb-6">
                <div className="label-ui mb-2">Passord {mode === "register" && <span style={{ color: "var(--ink-mute)" }}>(min 8 tegn)</span>}</div>
                <input
                  data-testid={TID.passwordInput}
                  className="input-line"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  required
                  minLength={mode === "register" ? 8 : 1}
                />
              </div>
              <button
                data-testid={TID.submitBtn}
                type="submit"
                disabled={busy}
                className="btn-primary w-full"
                style={{ padding: "0.9rem 1.25rem" }}
              >
                {busy ? "Vent…" : (mode === "register" ? "Opprett konto" : "Logg inn")}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                data-testid={TID.toggleMode}
                onClick={() => setMode(mode === "register" ? "login" : "register")}
                className="label-ui"
                style={{ color: "var(--ink-mute)" }}
              >
                {mode === "register" ? (
                  <>Har du allerede konto? <span style={{ color: "var(--moss)" }}>Logg inn →</span></>
                ) : (
                  <>Ingen konto ennå? <span style={{ color: "var(--moss)" }}>Opprett en →</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
