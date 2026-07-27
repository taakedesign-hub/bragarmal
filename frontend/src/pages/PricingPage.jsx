import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Feather, ArrowLeft, Check } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import InfoMenu from "@/components/InfoMenu";
import Footer from "@/components/Footer";

const REGULAR = {
  monthly: { key: "echo_monthly_nok", price: 149, per: "mnd" },
  yearly:  { key: "echo_yearly_nok",  price: 1290, per: "år" },
};
const FOUNDER = {
  monthly: { key: "echo_monthly_founder", price: 99, per: "mnd" },
  yearly:  { key: "echo_yearly_founder",  price: 890, per: "år" },
};

export default function PricingPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(null);
  const [cycle, setCycle] = useState("monthly"); // monthly | yearly

  useEffect(() => {
    (async () => {
      if (!user) return;
      try { const r = await api.get("/billing/status"); setStatus(r.data); } catch {}
    })();
  }, [user]);

  const checkout = async (lookup_key) => {
    if (!user) { nav("/logg-inn"); return; }
    setBusy(lookup_key);
    try {
      const r = await api.post("/billing/checkout", { lookup_key, origin_url: window.location.origin });
      window.location.href = r.data.checkout_url;
    } catch (e) {
      toast(e?.response?.data?.detail || "Kunne ikke starte betaling");
      setBusy(null);
    }
  };

  const founderEligible = status?.founder_eligible;
  const isBeta = status?.beta;
  const isActive = status?.active;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Feather size={18} strokeWidth={1.4} />
            <span className="font-serif-display text-xl tracking-widest">ECHO</span>
          </Link>
          <div className="flex items-center gap-4">
            <InfoMenu align="right" />
            <Link to={user ? "/dashboard" : "/"} className="label-ui inline-flex items-center gap-2">
              <ArrowLeft size={14} strokeWidth={1.5} /> Tilbake
            </Link>
          </div>
        </div>
      </div>

      <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-14 pb-6">
        <div className="label-ui">Medlemskap</div>
        <h1 className="font-serif-display text-5xl md:text-6xl font-light mt-3" style={{ color: "var(--ink)" }}>
          Fair pris. <em className="italic" style={{ color: "var(--moss)" }}>Ingen skjulte grenser</em>.
        </h1>
        <p className="mt-6 font-editor text-lg max-w-[62ch]" style={{ color: "var(--ink-soft)" }}>
          Alle modeller. Alle prøver. Ubegrenset generering. Alt scoped kun til din konto.
          Ingen deler dataene dine.
        </p>

        {isBeta && (
          <div className="mt-6 inline-flex items-center gap-3 px-3 py-1.5" style={{ background: "var(--linen)", color: "var(--ink)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--ink)" }} />
            <span className="font-mono-ui text-xs tracking-wider">BETA-MEDLEM · GRATIS FOR ALLTID</span>
          </div>
        )}
      </section>

      {/* Cycle toggle */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 pb-8">
        <div className="inline-flex hairline-b" style={{ borderColor: "var(--line)" }}>
          <button
            onClick={() => setCycle("monthly")}
            className="label-ui px-6 py-3"
            style={{
              color: cycle === "monthly" ? "var(--ink)" : "var(--ink-mute)",
              borderBottom: cycle === "monthly" ? "2px solid var(--ink)" : "2px solid transparent",
              marginBottom: "-1px",
            }}
          >Månedlig</button>
          <button
            onClick={() => setCycle("yearly")}
            className="label-ui px-6 py-3"
            style={{
              color: cycle === "yearly" ? "var(--ink)" : "var(--ink-mute)",
              borderBottom: cycle === "yearly" ? "2px solid var(--ink)" : "2px solid transparent",
              marginBottom: "-1px",
            }}
          >Årlig <span style={{ color: "var(--moss)" }}>· spar 2 mnd</span></button>
        </div>
      </section>

      {/* Tier cards */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Tier
            badge="BETA"
            badgeColor="var(--linen)"
            title="Gratis"
            price="0"
            unit="/for alltid"
            note={status ? `${status.beta_slots_remaining} av ${status.beta_total} plasser igjen` : "For de 10 første"}
            features={[
              "Alle funksjoner",
              "Alle modeller (Claude, GPT, Gemini, Grok)",
              "Ubegrenset generering",
              "Prioritet på tilbakemelding",
            ]}
            cta={isBeta ? "Du er beta-medlem" : "Kun for de 10 første"}
            disabled
            highlight={isBeta}
          />
          <Tier
            badge="GRUNNLEGGER"
            badgeColor="var(--sky)"
            title="Grunnlegger"
            price={FOUNDER[cycle].price}
            unit={` kr/${FOUNDER[cycle].per}`}
            note={status ? `${status.founder_slots_remaining} av ${status.founder_total} grunnleggerplasser igjen` : "For bruker 11-100"}
            features={[
              "Alle funksjoner",
              "Alle modeller",
              "Ubegrenset generering",
              "Låst pris for alltid",
              "Tidlig tilgang til nye funksjoner",
            ]}
            cta={busy === FOUNDER[cycle].key ? "Sender til Stripe…" : (isActive ? "Aktiv" : "Bli grunnlegger")}
            onClick={() => checkout(FOUNDER[cycle].key)}
            disabled={busy || (!founderEligible && !isBeta) || isActive}
            highlight={founderEligible && !isBeta && !isActive}
          />
          <Tier
            badge="ORDINÆR"
            badgeColor="var(--moss)"
            title="Ordinær"
            price={REGULAR[cycle].price}
            unit={` kr/${REGULAR[cycle].per}`}
            note="Uten begrensning på når"
            features={[
              "Alle funksjoner",
              "Alle modeller",
              "Ubegrenset generering",
              "Kanselle når som helst",
              "Data beholdes ved oppsigelse",
            ]}
            cta={busy === REGULAR[cycle].key ? "Sender til Stripe…" : (isActive ? "Aktiv" : "Velg ordinær")}
            onClick={() => checkout(REGULAR[cycle].key)}
            disabled={busy || isActive}
          />
        </div>

        {isActive && !isBeta && (
          <div className="mt-10 text-center">
            <button
              onClick={async () => {
                try {
                  const r = await api.post("/billing/portal", { return_url: window.location.origin + "/priser" });
                  window.location.href = r.data.portal_url;
                } catch (e) { toast(e?.response?.data?.detail || "Kunne ikke åpne portalen"); }
              }}
              className="btn-ghost"
            >
              Behandle abonnement →
            </button>
          </div>
        )}

        <p className="font-editor text-sm mt-12 max-w-[62ch]" style={{ color: "var(--ink-mute)" }}>
          Alle priser i norske kroner. Ved oppsigelse beholder du all data — prøver, stemmeprofil,
          filer — men kan ikke generere ny tekst før medlemskapet er aktivt igjen.
        </p>
      </section>
      <Footer />
    </div>
  );
}

function Tier({ badge, badgeColor, title, price, unit, note, features, cta, onClick, disabled, highlight }) {
  return (
    <div
      className="paper p-8 md:p-10 flex flex-col"
      style={{
        borderColor: highlight ? "var(--moss)" : "var(--line)",
        borderWidth: highlight ? "2px" : "1px",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 px-2.5 py-1" style={{ background: badgeColor, color: "var(--ink)" }}>
          <span className="font-mono-ui text-[10px] tracking-widest">{badge}</span>
        </span>
      </div>
      <h3 className="font-serif-display text-3xl mt-6" style={{ color: "var(--ink)" }}>{title}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-serif-display text-6xl font-light" style={{ color: "var(--ink)" }}>{price}</span>
        <span className="font-editor text-sm" style={{ color: "var(--ink-mute)" }}>{unit}</span>
      </div>
      <div className="label-ui mt-2">{note}</div>
      <ul className="mt-8 space-y-3 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 font-editor text-sm" style={{ color: "var(--ink)" }}>
            <Check size={14} strokeWidth={1.6} style={{ color: "var(--moss)", marginTop: 3, flexShrink: 0 }} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onClick}
        disabled={disabled}
        className={disabled ? "btn-ghost mt-8 w-full" : "btn-primary mt-8 w-full"}
        style={{ padding: "0.9rem 1.25rem", opacity: disabled ? 0.55 : 1 }}
      >
        {cta}
      </button>
    </div>
  );
}
