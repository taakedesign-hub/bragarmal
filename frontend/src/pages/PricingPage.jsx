import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import InfoMenu from "@/components/InfoMenu";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const REGULAR = {
  monthly: { key: "bragr_monthly_nok", price: 249, months: 1,  label: "Månedlig",   save: 0  },
  q3:      { key: "bragr_3mo_nok",     price: 710, months: 3,  label: "3 måneder",  save: 5  },
  q6:      { key: "bragr_6mo_nok",     price: 1345, months: 6, label: "6 måneder",  save: 10 },
  yearly:  { key: "bragr_yearly_nok",  price: 2092, months: 12, label: "12 måneder", save: 30 },
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

  // Monthly baseline for "you save" math
  const baseMonthly = REGULAR.monthly.price;

  const options = [REGULAR.monthly, REGULAR.q3, REGULAR.q6, REGULAR.yearly];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Seo
        title="Priser — fair pris, ingen skjulte grenser"
        description="Bragarmål-medlemskap for forfattere fra 249 kr/mnd — 14 dagers gratis prøvetid. Illustratører og kunstnere kan bli oppført i katalogen for 199 kr/mnd."
        path="/priser"
      />
      <div className="hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo size={56} />
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
          Fair pris. <em className="italic" style={{ color: "var(--rust)" }}>Ingen skjulte grenser</em>.
        </h1>
        <p className="mt-6 font-editor text-lg max-w-[62ch]" style={{ color: "var(--ink-soft)" }}>
          Bragarmål er en AI-basert tjeneste, som ivaretar fortellerstemmen din og hjelper
          deg videre når du står fast. Jo mer du legger inn, jo bedre resultat får du.
        </p>
        <p className="mt-3 font-editor text-lg max-w-[62ch]" style={{ color: "var(--ink-soft)" }}>
          Alle modeller. Alle prøver. Ubegrenset generering. Alt lagret kun på din konto —
          slett når du vil.
        </p>

        {isLifetime && (
          <div className="mt-6 inline-flex items-center gap-3 px-3 py-1.5" style={{ background: "var(--ink)", color: "white" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--rust)" }} />
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
          <div className="paper p-8 md:p-10 flex flex-col" style={{ borderColor: isBeta ? "var(--ink)" : "var(--line)", borderWidth: isBeta ? "2px" : "1px" }}>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-2.5 py-1" style={{ background: "var(--linen)", color: "var(--ink)" }}>
                <span className="font-mono-ui text-[10px] tracking-widest">BETA</span>
              </span>
              <span className="label-ui" style={{ color: "var(--ink-mute)" }}>
                {status ? `${status.beta_slots_remaining} av ${status.beta_total} plasser igjen` : "For de 10 første"}
              </span>
            </div>
            <h2 className="font-serif-display text-3xl md:text-4xl mt-6" style={{ color: "var(--ink)" }}>
              Gratis <em className="italic" style={{ color: "var(--rust)" }}>· 3 mnd</em>
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
              <span className="inline-flex items-center gap-2 px-2.5 py-1" style={{ background: "var(--ink)", color: "white" }}>
                <span className="font-mono-ui text-[10px] tracking-widest">ORDINÆR</span>
              </span>
              <span className="label-ui" style={{ color: "var(--ink-mute)" }}>Alle funksjoner</span>
            </div>
            <h2 className="font-serif-display text-3xl md:text-4xl mt-6" style={{ color: "var(--ink)" }}>
              Ordinært medlemskap
            </h2>
            <p className="font-editor text-sm mt-3" style={{ color: "var(--ink-soft)" }}>
              Alle modeller, ubegrenset generering, du styrer dataene dine.
            </p>

            {/* Trial frame */}
            <div
              className="mt-6 p-3 flex items-center gap-3"
              style={{ border: "1px solid var(--rust)", background: "var(--bg-alt, #faf7f1)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--rust)" }} />
              <span className="font-mono-ui text-[11px] tracking-widest" style={{ color: "var(--ink)" }}>
                AUTOMATISK 2 UKERS PRØVETID VED FØRSTE GANGS REGISTRERING
              </span>
            </div>

            {/* Four purchase options — monthly / 3mo / 6mo / yearly */}
            <div className="mt-6 grid grid-cols-1 gap-3">
              {options.map((opt) => {
                const equivMonthly = Math.round(opt.price / opt.months);
                const saved = baseMonthly * opt.months - opt.price;
                const isYearly = opt.months === 12;
                const isMonthly = opt.months === 1;
                return (
                  <button
                    key={opt.key}
                    data-testid={`tier-${opt.key}-btn`}
                    onClick={() => checkout(opt.key)}
                    disabled={busy || isActive}
                    className="group flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-all relative w-full disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    style={{ border: isYearly ? "2px solid var(--rust)" : "1px solid var(--line)" }}
                  >
                    {opt.save > 0 && (
                      <span
                        className="absolute -top-2.5 left-4 px-2 py-0.5 font-mono-ui text-[10px] tracking-widest"
                        style={{ background: "var(--rust)", color: "white" }}
                      >
                        SPAR {opt.save}%
                      </span>
                    )}
                    <span className="font-serif-display text-xl" style={{ color: "var(--ink)" }}>
                      {opt.label}
                      {opt.save > 0 && (
                        <span className="block font-editor text-xs mt-1" style={{ color: "var(--rust)" }}>
                          tilsvarer {equivMonthly} kr/mnd · du sparer {saved} kr
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="flex items-baseline gap-1">
                        <span className="font-serif-display text-2xl md:text-3xl" style={{ color: "var(--ink)" }}>{opt.price}</span>
                        <span className="font-editor text-sm" style={{ color: "var(--ink-mute)" }}>kr{isMonthly ? " / mnd" : ""}</span>
                      </span>
                      <ArrowRight
                        size={18}
                        strokeWidth={1.5}
                        className="transition-transform group-hover:translate-x-1"
                        style={{ color: "var(--ink)" }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>

            {busy && (
              <p className="mt-4 label-ui text-center" style={{ color: "var(--ink-mute)" }}>Sender til Stripe…</p>
            )}
            {isActive && (
              <p className="mt-4 label-ui text-center" style={{ color: "var(--ink)" }}>Aktivt medlemskap</p>
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

        {/* Illustratører & kunstnere — egen prisboks under forfatter-tiers */}
        <div className="mt-16 max-w-[960px]" data-testid="tier-illustrator">
          <div className="hairline-t pt-10">
            <div className="label-ui" style={{ color: "var(--rust)" }}>For illustratører og kunstnere</div>
            <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
              Bli oppført i katalogen
            </h2>
          </div>

          <div className="paper mt-6 p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center" style={{ borderColor: "var(--line)" }}>
            <div className="md:col-span-7">
              <p className="font-editor text-base md:text-lg leading-relaxed" style={{ color: "var(--ink)" }}>
                Er du illustratør eller kunstner? Bli oppført i den åpne katalogen der Bragarmål-forfattere
                søker etter samarbeid — helt gratis. Du styrer selv porteføljelenken, stilen og hva du tilbyr.
              </p>
              <ul className="mt-4 font-editor text-sm space-y-1.5" style={{ color: "var(--ink-soft)" }}>
                <li className="pl-4 relative"><span className="absolute left-0" style={{ color: "var(--rust)" }}>—</span>Gratis oppføring, ingen tidsbegrensning</li>
                <li className="pl-4 relative"><span className="absolute left-0" style={{ color: "var(--rust)" }}>—</span>Du kontaktes direkte via porteføljelenken din</li>
                <li className="pl-4 relative"><span className="absolute left-0" style={{ color: "var(--rust)" }}>—</span>Valgfritt: bli fremhevet øverst i katalogen for 89 kr/mnd, avslutt når du vil</li>
              </ul>
            </div>
            <div className="md:col-span-5 md:border-l md:pl-10" style={{ borderColor: "var(--line)" }}>
              <div className="flex items-baseline gap-1" style={{ color: "var(--ink)" }}>
                <span className="font-serif-display text-5xl md:text-6xl">Gratis</span>
              </div>
              <p className="font-editor text-xs mt-2" style={{ color: "var(--ink-mute)" }}>
                Fremhevet plassering er valgfritt, fra 89 kr/mnd. Ingen skjulte kostnader.
              </p>
              <Link
                to="/illustratorer"
                data-testid="tier-illustrator-cta"
                className="btn-primary mt-6 inline-flex items-center gap-2 w-full justify-center"
              >
                Send inn portefølje <ArrowRight size={14} strokeWidth={1.6} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-[960px] hairline-t pt-10">
          <div className="label-ui" style={{ color: "var(--rust)" }}>Greit å vite</div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoBox label="Valuta">Alle priser i norske kroner.</InfoBox>
            <InfoBox label="Oppsigelse">
              Si opp når som helst. Medlemskapet forblir aktivt ut den betalte perioden og fornyes
              ikke etter det. Ingen refusjon for allerede påbegynte perioder.
            </InfoBox>
            <InfoBox label="Dine data">
              Slett prøver, stemmeprofil og filer selv, når du vil, direkte fra kontoen din.
            </InfoBox>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function InfoBox({ label, children }) {
  return (
    <div className="p-5" style={{ border: "1px solid var(--line)" }}>
      <div className="label-ui" style={{ color: "var(--ink-mute)" }}>{label}</div>
      <p className="mt-2 font-editor text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
        {children}
      </p>
    </div>
  );
}
