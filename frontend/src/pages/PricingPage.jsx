import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import InfoMenu from "@/components/InfoMenu";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const REGULAR = {
  monthly: { key: "bragr_monthly_nok", price: 149, per: "mnd" },
  yearly:  { key: "bragr_yearly_nok",  price: 1290, per: "år" },
};

export default function PricingPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(null);

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

  const isBeta = status?.beta;
  const isActive = status?.active;
  const isLifetime = status?.plan === "lifetime";

  // Yearly savings math
  const monthlyPrice = REGULAR.monthly.price;
  const yearlyPrice = REGULAR.yearly.price;
  const yearlyEquivMonthly = Math.round(yearlyPrice / 12);
  const savedPerYear = monthlyPrice * 12 - yearlyPrice;
  const savedMonths = Math.round(savedPerYear / monthlyPrice);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Seo
        title="Priser — fair pris, ingen skjulte grenser"
        description="Bragarmål-medlemskap fra 149 kr/mnd. Beta-plasser gratis i 3 måneder for de 10 første. Alle modeller, ubegrenset generering."
        path="/priser"
      />
      <div className="hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo size={70} />
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
          Alle modeller. Alle prøver. Ubegrenset generering. Alt lagret kun på din konto.
          Ingen deler dataene dine.
        </p>

        {isLifetime && (
          <div className="mt-6 inline-flex items-center gap-3 px-3 py-1.5" style={{ background: "var(--moss)", color: "white" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "white" }} />
            <span className="font-mono-ui text-xs tracking-wider">LIVSTIDS­MEDLEM · GRATIS FOR ALLTID</span>
          </div>
        )}
        {isBeta && !isLifetime && (
          <div className="mt-6 inline-flex items-center gap-3 px-3 py-1.5" style={{ background: "var(--linen)", color: "var(--ink)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--ink)" }} />
            <span className="font-mono-ui text-xs tracking-wider">BETA-MEDLEM · GRATIS I 3 MÅNEDER</span>
          </div>
        )}
      </section>

      {/* Tier cards */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[960px]">

          {/* BETA */}
          <div className="paper p-8 md:p-10 flex flex-col" style={{ borderColor: isBeta ? "var(--moss)" : "var(--line)", borderWidth: isBeta ? "2px" : "1px" }}>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-2.5 py-1" style={{ background: "var(--linen)", color: "var(--ink)" }}>
                <span className="font-mono-ui text-[10px] tracking-widest">BETA</span>
              </span>
              <span className="label-ui" style={{ color: "var(--ink-mute)" }}>
                {status ? `${status.beta_slots_remaining} av ${status.beta_total} plasser igjen` : "For de 10 første"}
              </span>
            </div>
            <h2 className="font-serif-display text-3xl md:text-4xl mt-6" style={{ color: "var(--ink)" }}>
              Gratis <em className="italic" style={{ color: "var(--moss)" }}>· 3 mnd</em>
            </h2>
            <div className="mt-3 flex items-baseline gap-1" style={{ color: "var(--ink)" }}>
              <span className="font-serif-display text-5xl md:text-6xl">0</span>
              <span className="font-editor text-sm" style={{ color: "var(--ink-mute)" }}>kr / de første 3 månedene</span>
            </div>
            <p className="font-editor text-sm mt-4" style={{ color: "var(--ink-soft)" }}>
              For de 10 første som registrerer seg. Etter 3 måneder velger du selv om du vil fortsette.
            </p>
            <button className="btn-primary mt-8" disabled data-testid="tier-beta-btn">
              {isBeta ? "Du er beta-medlem" : "Kun for de 10 første"}
            </button>
          </div>

          {/* ORDINÆR — both cycles as two-in-one card */}
          <div className="paper p-8 md:p-10 flex flex-col" style={{ borderColor: "var(--line)", borderWidth: "1px" }}>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-2.5 py-1" style={{ background: "var(--moss)", color: "white" }}>
                <span className="font-mono-ui text-[10px] tracking-widest">ORDINÆR</span>
              </span>
              <span className="label-ui" style={{ color: "var(--ink-mute)" }}>Alle funksjoner</span>
            </div>
            <h2 className="font-serif-display text-3xl md:text-4xl mt-6" style={{ color: "var(--ink)" }}>
              Ordinært medlemskap
            </h2>
            <p className="font-editor text-sm mt-3" style={{ color: "var(--ink-soft)" }}>
              Alle modeller, ubegrenset generering, dine data forblir dine.
            </p>

            {/* Two purchase options side by side */}
            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                data-testid="tier-monthly-btn"
                onClick={() => checkout(REGULAR.monthly.key)}
                disabled={busy || isActive}
                className="flex items-baseline justify-between p-4 text-left hover:bg-neutral-50 transition-all"
                style={{ border: "1px solid var(--line)" }}
              >
                <span className="font-serif-display text-xl" style={{ color: "var(--ink)" }}>Månedlig</span>
                <span className="flex items-baseline gap-1">
                  <span className="font-serif-display text-2xl md:text-3xl" style={{ color: "var(--ink)" }}>{monthlyPrice}</span>
                  <span className="font-editor text-sm" style={{ color: "var(--ink-mute)" }}>kr/mnd</span>
                </span>
              </button>
              <button
                data-testid="tier-yearly-btn"
                onClick={() => checkout(REGULAR.yearly.key)}
                disabled={busy || isActive}
                className="flex items-baseline justify-between p-4 text-left hover:bg-neutral-50 transition-all relative"
                style={{ border: "2px solid var(--moss)" }}
              >
                <span className="absolute -top-2.5 left-4 px-2 py-0.5 font-mono-ui text-[10px] tracking-widest" style={{ background: "var(--moss)", color: "white" }}>
                  SPAR {savedPerYear} KR
                </span>
                <span className="font-serif-display text-xl" style={{ color: "var(--ink)" }}>
                  Årlig
                  <span className="block font-editor text-xs mt-1" style={{ color: "var(--moss)" }}>
                    tilsvarer {yearlyEquivMonthly} kr/mnd · gratis i {savedMonths} måneder
                  </span>
                </span>
                <span className="flex items-baseline gap-1">
                  <span className="font-serif-display text-2xl md:text-3xl" style={{ color: "var(--ink)" }}>{yearlyPrice}</span>
                  <span className="font-editor text-sm" style={{ color: "var(--ink-mute)" }}>kr/år</span>
                </span>
              </button>
            </div>

            {busy && (
              <p className="mt-4 label-ui text-center" style={{ color: "var(--ink-mute)" }}>Sender til Stripe…</p>
            )}
            {isActive && (
              <p className="mt-4 label-ui text-center" style={{ color: "var(--moss)" }}>Aktivt medlemskap</p>
            )}
          </div>
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

        <div className="mt-14 max-w-[62ch] font-editor text-sm space-y-3" style={{ color: "var(--ink-mute)" }}>
          <p>Alle priser i norske kroner.</p>
          <p>
            Du kan si opp abonnementet når som helst — det forblir aktivt ut den betalte perioden,
            og fornyes ikke etter det. Ingen refusjon for allerede påbegynte perioder.
          </p>
          <p>
            Ved oppsigelse beholder du all data — prøver, stemmeprofil, filer — men kan ikke
            generere ny tekst før medlemskapet er aktivt igjen.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
