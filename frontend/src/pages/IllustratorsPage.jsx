import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import InfoMenu from "@/components/InfoMenu";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { TID } from "@/lib/testIds";
import { Palette, ArrowRight, ExternalLink, Send, CheckCircle2, Star } from "lucide-react";
import { contactMailto } from "@/lib/site";

export default function IllustratorsPage() {
  const nav = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [newId, setNewId] = useState(null);
  const [upgrading, setUpgrading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    portfolio_url: "",
    style: "",
    services: "",
    website: "", // honeypot
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/illustrators");
        setList(Array.isArray(data) ? data : []);
      } catch {
        // ignore — page still works for submissions
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const { data } = await api.post("/illustrators", form);
      setDone(true);
      setNewId(data?.id || null);
      // Optimistically add to list (server hides email)
      setList((prev) => [
        {
          id: data?.id || `local-${Date.now()}`,
          name: form.name,
          portfolio_url: form.portfolio_url,
          style: form.style,
          services: form.services,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setForm({ name: "", email: "", portfolio_url: "", style: "", services: "", website: "" });
    } catch (err) {
      toast(err?.response?.data?.detail || "Kunne ikke sende inn — prøv igjen");
    } finally {
      setSubmitting(false);
    }
  };

  const startFeatured = async () => {
    if (!newId || upgrading) return;
    setUpgrading(true);
    try {
      const { data } = await api.post("/illustrators/checkout", {
        illustrator_id: newId,
        origin_url: window.location.origin,
      });
      window.location.href = data.checkout_url;
    } catch (err) {
      toast(err?.response?.data?.detail || "Kunne ikke starte betaling");
      setUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Seo
        title="Illustratører — Bragarmål"
        description="Registrer deg som illustratør, eller finn norske illustratører til bokprosjektet ditt."
        path="/illustratorer"
      />

      {/* Header — samme som forsiden */}
      <div className="hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link
            to="/"
            aria-label="Bragarmål — gå til forsiden"
            data-testid="header-logo-link"
            className="flex items-center transition-opacity hover:opacity-80 cursor-pointer"
          >
            <Logo size={56} />
          </Link>
          <nav className="flex items-center gap-2 md:gap-6">
            <InfoMenu align="right" />
            <Link to="/logg-inn" data-testid="nav-forfattere" className="label-ui" style={{ color: "var(--ink-mute)" }}>Forfattere</Link>
            <Link to="/priser" className="label-ui" style={{ color: "var(--ink-mute)" }}>Priser</Link>
            <button
              data-testid={TID.loginBtn}
              onClick={() => nav("/logg-inn")}
              className="btn-ghost"
            >
              Logg inn
            </button>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-14 pb-12">
        <div className="max-w-[70ch]">
          <div className="label-ui inline-flex items-center gap-2">
            <Palette size={14} strokeWidth={1.5} />
            Illustratører
          </div>
          <h1 className="font-serif-display text-5xl md:text-6xl font-light mt-3 leading-[1.05]" style={{ color: "var(--ink)" }}>
            Bok trenger <em className="italic" style={{ color: "var(--rust)" }}>bilder</em>.
          </h1>
          <p className="mt-6 font-editor text-lg md:text-xl leading-relaxed" style={{ color: "var(--ink)" }}>
            Denne siden er en åpen katalog over illustratører — særlig for forfattere som skriver
            barnebøker, bildebøker, romaner med illustrasjoner, eller trenger omslagsdesign.
          </p>
          <p className="mt-4 font-editor text-base md:text-lg" style={{ color: "var(--ink-soft)" }}>
            Er du <strong>illustratør</strong>? Fyll ut skjemaet under og gjør deg synlig for
            forfattere som leter. Er du <strong>forfatter</strong>? Bla gjennom listen og ta direkte
            kontakt via portefølje-lenken.
          </p>
        </div>
      </section>

      {/* To spalter: Registrering + Katalog */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Venstre: skjema */}
          <div className="lg:col-span-5" data-testid="illustrator-form-section">
            <div className="label-ui" style={{ color: "var(--rust)" }}>Er du illustratør?</div>
            <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-2 leading-tight" style={{ color: "var(--ink)" }}>
              Send inn portefølje
            </h2>
            <p className="mt-4 font-editor" style={{ color: "var(--ink-soft)" }}>
              Kort skjema — under et minutt. Vi lister deg umiddelbart, og forfattere kontakter deg
              direkte via porteføljesiden din.
            </p>

            {done ? (
              <div
                className="mt-8 p-6 flex items-start gap-4"
                style={{ background: "#fdfcf9", borderLeft: "2px solid var(--rust)" }}
                data-testid="illustrator-form-success"
              >
                <CheckCircle2 size={22} strokeWidth={1.5} style={{ color: "var(--rust)" }} className="shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-serif-display text-xl" style={{ color: "var(--ink)" }}>Takk!</div>
                  <p className="mt-1 font-editor text-sm" style={{ color: "var(--ink-soft)" }}>
                    Du er nå oppført i katalogen — gratis, ingen tidsbegrensning. Rull ned for å se listen.
                  </p>

                  {newId && (
                    <div className="mt-5 p-4" style={{ border: "1px solid var(--rust)", background: "white" }}>
                      <div className="flex items-center gap-2">
                        <Star size={14} strokeWidth={1.5} style={{ color: "var(--rust)" }} />
                        <span className="label-ui" style={{ color: "var(--rust)" }}>Valgfritt</span>
                      </div>
                      <p className="mt-2 font-editor text-sm" style={{ color: "var(--ink)" }}>
                        Vil du stå øverst i katalogen og skille deg ut med et fremhevet merke?
                      </p>
                      <button
                        onClick={startFeatured}
                        disabled={upgrading}
                        data-testid="illustrator-feature-btn"
                        className="mt-3 btn-ghost inline-flex items-center gap-2 disabled:opacity-60"
                        style={{ borderColor: "var(--rust)", color: "var(--rust)" }}
                      >
                        {upgrading ? "Sender…" : "Bli fremhevet — 89 kr/mnd"}
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => { setDone(false); setNewId(null); }}
                    className="mt-4 label-ui underline underline-offset-4"
                    style={{ color: "var(--rust)" }}
                    data-testid="illustrator-form-again"
                  >
                    Send inn en til
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-8 space-y-6" data-testid="illustrator-form">
                <Field label="Navn" required htmlFor="ill-name">
                  <input
                    id="ill-name"
                    data-testid="ill-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={update("name")}
                    className="ill-input"
                    placeholder="For- og etternavn"
                  />
                </Field>

                <Field label="E-post" required htmlFor="ill-email" hint="Vises ikke offentlig — forfattere kontakter deg via porteføljelenken.">
                  <input
                    id="ill-email"
                    data-testid="ill-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    className="ill-input"
                    placeholder="deg@eksempel.no"
                  />
                </Field>

                <Field label="Portfolio-lenke" required htmlFor="ill-portfolio" hint="Nettside, Instagram, Behance, ArtStation — hva enn du foretrekker.">
                  <input
                    id="ill-portfolio"
                    data-testid="ill-portfolio"
                    type="url"
                    required
                    value={form.portfolio_url}
                    onChange={update("portfolio_url")}
                    className="ill-input"
                    placeholder="https://…"
                  />
                </Field>

                <Field label="Kort om stil" htmlFor="ill-style" hint="Noen få setninger — akvarell, digital, linjekunst, uttrykk?">
                  <textarea
                    id="ill-style"
                    data-testid="ill-style"
                    rows={3}
                    value={form.style}
                    onChange={update("style")}
                    className="ill-input resize-none"
                    placeholder="F.eks. varm akvarell med barnlig strek — jobber ofte med lys og natur."
                    maxLength={600}
                  />
                </Field>

                <Field label="Type arbeid du tilbyr" htmlFor="ill-services" hint="Bildebok, romanomslag, spot-illustrasjoner, kart, portretter …">
                  <textarea
                    id="ill-services"
                    data-testid="ill-services"
                    rows={2}
                    value={form.services}
                    onChange={update("services")}
                    className="ill-input resize-none"
                    placeholder="F.eks. bildebok for barn 3–8 år, kapittel-vignetter, omslag."
                    maxLength={600}
                  />
                </Field>

                {/* Honeypot — skjult for mennesker */}
                <div className="hidden" aria-hidden="true">
                  <label>Nettsted (ikke fyll ut)
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={update("website")}
                    />
                  </label>
                </div>

                <div className="flex items-center gap-4 flex-wrap pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    data-testid="illustrator-submit"
                    className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? "Sender…" : (<>Send inn <Send size={14} strokeWidth={1.6} /></>)}
                  </button>
                  <span className="label-ui" style={{ color: "var(--ink-mute)" }}>
                    Vi lagrer kun det som trengs. Ingen markedsføring.
                  </span>
                </div>
              </form>
            )}
          </div>

          {/* Høyre: katalog */}
          <div className="lg:col-span-7" data-testid="illustrator-list-section">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div>
                <div className="label-ui" style={{ color: "var(--rust)" }}>Finn illustratør</div>
                <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-2 leading-tight" style={{ color: "var(--ink)" }}>
                  Åpen katalog
                </h2>
              </div>
              <span className="label-ui" style={{ color: "var(--ink-mute)" }} data-testid="ill-count">
                {loading ? "Laster…" : `${list.length} oppført`}
              </span>
            </div>

            {loading ? (
              <div className="mt-10 font-editor text-sm" style={{ color: "var(--ink-mute)" }}>Laster katalog…</div>
            ) : list.length === 0 ? (
              <div className="mt-10 p-6 font-editor" style={{ background: "#fdfcf9", border: "1px solid var(--line)", color: "var(--ink-soft)" }} data-testid="ill-empty">
                Ingen oppført ennå — vær den første. Send inn skjemaet til venstre.
              </div>
            ) : (
              <ul className="mt-8">
                {list.map((it) => (
                  <li key={it.id} className="hairline-t py-6" data-testid={`ill-item-${it.id}`}>
                    <div className="flex items-baseline justify-between gap-4 flex-wrap">
                      <h3 className="font-serif-display text-xl md:text-2xl leading-snug inline-flex items-center gap-2" style={{ color: "var(--ink)" }}>
                        {it.name}
                        {it.is_featured && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 font-mono-ui text-[9px] tracking-widest align-middle"
                            style={{ background: "var(--rust)", color: "white" }}
                            data-testid={`ill-featured-${it.id}`}
                          >
                            <Star size={9} strokeWidth={2} /> FREMHEVET
                          </span>
                        )}
                      </h3>
                      <a
                        href={it.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label-ui inline-flex items-center gap-1.5 hover:underline underline-offset-4"
                        style={{ color: "var(--rust)" }}
                        data-testid={`ill-link-${it.id}`}
                      >
                        Se portefølje <ExternalLink size={12} strokeWidth={1.5} />
                      </a>
                    </div>
                    {it.services && (
                      <div className="mt-3 font-editor text-sm" style={{ color: "var(--ink)" }}>
                        <span className="label-ui" style={{ color: "var(--ink-mute)" }}>Tilbyr: </span>
                        {it.services}
                      </div>
                    )}
                    {it.style && (
                      <p className="mt-2 font-editor text-sm md:text-base leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                        {it.style}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* CTA-strimmel nederst */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-14 flex items-center justify-between flex-wrap gap-6">
          <div>
            <div className="label-ui">Fortell om andre</div>
            <p className="font-serif-display text-2xl md:text-3xl mt-2 leading-tight" style={{ color: "var(--ink)" }}>
              Kjenner du en illustratør som burde stå her?
            </p>
          </div>
          <a
            href={contactMailto("Illustratør-tips")}
            className="btn-ghost inline-flex items-center gap-2"
            data-testid="ill-refer"
          >
            Send tips <ArrowRight size={14} strokeWidth={1.6} />
          </a>
        </div>
      </section>

      <Footer />

      {/* Skjema-styling — matcher Nordic-uttrykket */}
      <style>{`
        .ill-input {
          width: 100%;
          background: #fdfcf9;
          border: 1px solid var(--line);
          padding: 12px 14px;
          font-family: var(--font-editor, "Newsreader", serif);
          font-size: 16px;
          color: var(--ink);
          transition: border-color 150ms, background 150ms;
          border-radius: 0;
          outline: none;
        }
        .ill-input:focus {
          border-color: var(--rust);
          background: #ffffff;
        }
        .ill-input::placeholder { color: var(--ink-mute); font-style: italic; }
      `}</style>
    </div>
  );
}

function Field({ label, required, htmlFor, hint, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label-ui flex items-baseline gap-2" style={{ color: "var(--ink)" }}>
        {label}
        {required && <span style={{ color: "var(--rust)" }}>*</span>}
      </label>
      <div className="mt-2">{children}</div>
      {hint && (
        <div className="mt-1.5 font-editor text-xs italic" style={{ color: "var(--ink-mute)" }}>
          {hint}
        </div>
      )}
    </div>
  );
}
