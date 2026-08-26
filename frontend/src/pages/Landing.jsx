import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { TID } from "@/lib/testIds";
import { Feather, ArrowRight } from "lucide-react";
import InfoMenu from "@/components/InfoMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function Landing() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { t } = useI18n();
  const goLogin = () => nav("/logg-inn");

  const startTrial = async () => {
    if (!user) {
      // Save intent, redirect to login/register
      try { localStorage.setItem("bragr:trial_intent", "1"); } catch {}
      nav("/logg-inn");
      return;
    }
    try {
      const { data } = await api.post("/billing/checkout", {
        lookup_key: "bragr_monthly_nok",
        origin_url: window.location.origin,
        trial_days: 14,
      });
      if (data?.checkout_url) window.location.href = data.checkout_url;
    } catch (e) {
      toast(e?.response?.data?.detail || "Kunne ikke starte prøveperioden");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Seo
        title="AI-skriveverktøy som bevarer din stemme"
        description="Bragarmål er et norsk AI-skriveverktøy for forfattere og kreative. Vi genererer ikke ord — vi finner din stemme. Tren stemmeprofil, sjekk om teksten låter som deg, skriv videre uten AI-slop."
        path="/"
      />
      {/* Top rule */}
      <div className="hairline-b">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-3 md:py-4 flex items-center justify-between gap-3">
          <Link
            to="/"
            aria-label="Bragarmål — gå til forsiden"
            data-testid="header-logo-link"
            className="flex items-center shrink-0 transition-opacity hover:opacity-80 cursor-pointer"
          >
            <Logo size={56} />
          </Link>
          <nav className="flex items-center gap-0.5 md:gap-2 shrink min-w-0">
            <InfoMenu align="right" />
            <Link to="/logg-inn" data-testid="nav-skrivepult" className="label-ui px-1.5 md:px-3 py-2 whitespace-nowrap" style={{ color: "var(--ink-mute)" }}>{t("nav.tools")}</Link>
            <Link to="/logg-inn" data-testid="nav-forfattere" className="label-ui px-1.5 md:px-3 py-2 whitespace-nowrap" style={{ color: "var(--ink-mute)" }}>{t("nav.author")}</Link>
            <Link to="/illustratorer" data-testid="nav-illustrators" className="label-ui px-1.5 md:px-3 py-2 whitespace-nowrap" style={{ color: "var(--ink-mute)" }}>{t("nav.illustrator")}</Link>
            <LanguageSwitcher className="ml-1" />
            <button
              data-testid={TID.loginBtn}
              onClick={goLogin}
              className="btn-ghost shrink-0 whitespace-nowrap"
            >
              {t("nav.login")}
            </button>
          </nav>
        </div>
      </div>

      {/* Hero — 6-box grid */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-10 md:pt-14 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">

          {/* Box 1 — BLACK: pricing bullets — text higher, slightly larger */}
          <div
            data-testid="hero-box-pricing"
            className="aspect-square flex flex-col p-6 md:p-8"
            style={{ background: "#0f0e0d", color: "#ffffff" }}
          >
            <div className="font-mono-ui text-[10px] md:text-xs tracking-widest opacity-70">01</div>
            <ul className="mt-6 md:mt-8 space-y-3 md:space-y-4">
              <li>
                <button
                  data-testid="hero-cta-trial"
                  onClick={startTrial}
                  className="text-left font-serif-display text-base md:text-lg leading-snug hover:underline underline-offset-4"
                >
                  {t("landing.tryFree")}
                  <span className="block font-editor text-[11px] md:text-xs opacity-70 mt-0.5">{t("landing.tryFreeSub")}</span>
                </button>
              </li>
              <li>
                <button
                  data-testid={TID.ctaGetStarted}
                  onClick={goLogin}
                  className="text-left font-serif-display text-base md:text-lg leading-snug hover:underline underline-offset-4"
                >
                  {t("landing.beta")}
                  <span className="block font-editor text-[11px] md:text-xs opacity-70 mt-0.5">{t("landing.betaSub")}</span>
                </button>
              </li>
              <li>
                <Link
                  to="/priser"
                  data-testid="hero-cta-pricing"
                  className="text-left font-serif-display text-base md:text-lg leading-snug hover:underline underline-offset-4 inline-flex items-center gap-1"
                >
                  {t("info.pricing")} <ArrowRight size={12} strokeWidth={1.6} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Box 2 — WHITE: Når hjelper Bragarmål deg? — top-right, right-aligned */}
          <Link
            to="/eksempler"
            data-testid="hero-box-examples"
            className="aspect-square flex flex-col justify-start items-end text-right p-6 md:p-8 group transition-all hover:bg-neutral-50 relative"
            style={{ background: "#ffffff", color: "#0f0e0d" }}
          >
            <div className="absolute top-6 md:top-8 left-6 md:left-8 font-mono-ui text-[10px] md:text-xs tracking-widest opacity-60">02</div>
            <div className="mt-1">
              <div className="font-serif-display text-2xl md:text-3xl leading-tight">
                {t("landing.box2Title")}
              </div>
              <p className="mt-3 font-serif-display italic text-sm md:text-base leading-snug max-w-[32ch] ml-auto" style={{ color: "var(--ink-soft)" }}>
                {t("landing.box2Sub")}
              </p>
              <div className="mt-4 font-mono-ui text-sm md:text-base tracking-wide uppercase inline-flex items-center gap-2 hover:underline underline-offset-4" style={{ color: "#c8432c" }}>
                {t("landing.box2Cta")} <ArrowRight size={12} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Box 3 — RED: MANIFEST — bottom-left */}
          <Link
            to="/manifest"
            data-testid="hero-box-manifest"
            className="aspect-square flex flex-col justify-between p-6 md:p-8 group transition-all hover:opacity-90"
            style={{ background: "#c8432c", color: "#ffffff" }}
          >
            <div className="font-mono-ui text-[10px] md:text-xs tracking-widest opacity-90">03</div>
            <div>
              <div className="font-serif-display text-3xl md:text-5xl leading-none tracking-tight">MANIFEST</div>
              <div className="mt-3 font-editor text-xs md:text-sm opacity-90 flex items-center gap-2">
                {t("landing.box3Cta")} <ArrowRight size={12} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Box 4 — Image with transparent bg: full ink+pen visible, ethics link */}
          <Link
            to="/etikk"
            data-testid="hero-box-image"
            className="aspect-square overflow-hidden relative group block"
            style={{ background: "#ffffff" }}
          >
            <img
              src="/ink-pen.png"
              alt="Blekkhus og fyllepenn"
              className="w-full h-full object-contain p-4"
              draggable={false}
            />
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 flex items-center justify-between">
              <span className="font-mono-ui text-[10px] md:text-xs tracking-widest" style={{ color: "#0f0e0d" }}>04</span>
              <span
                className="font-mono-ui text-base md:text-lg tracking-wide uppercase inline-flex items-center gap-2 hover:underline underline-offset-4"
                style={{ color: "#c8432c" }}
              >
                {t("landing.box4Cta")} <ArrowRight size={14} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Box 5 — BLACK: tools — bottom-left, serif-display title (like MANIFEST), italic serif link */}
          <Link
            to="/dashboard"
            data-testid="hero-box-tools"
            className="aspect-square flex flex-col justify-between p-6 md:p-8 group transition-all hover:opacity-90"
            style={{ background: "#0f0e0d", color: "#ffffff" }}
          >
            <div className="font-mono-ui text-[10px] md:text-xs tracking-widest opacity-70">05</div>
            <div>
              <div className="font-serif-display text-2xl md:text-3xl leading-tight">
                {t("landing.box5Title1")}<br/>{t("landing.box5Title2")}
              </div>
              <div className="mt-3 font-serif-display italic text-sm md:text-base opacity-80 flex items-center gap-2">
                {t("landing.box5Cta")} <ArrowRight size={12} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Box 6 — WHITE: register CTA — bottom-right */}
          <button
            data-testid="hero-box-register"
            onClick={goLogin}
            className="aspect-square flex flex-col justify-between p-6 md:p-8 group transition-all hover:bg-neutral-50 text-right"
            style={{ background: "#ffffff", color: "#0f0e0d" }}
          >
            <div className="font-mono-ui text-[10px] md:text-xs tracking-widest opacity-60 text-left">06</div>
            <div className="ml-auto">
              <div className="font-serif-display text-xl md:text-2xl leading-tight">
                {t("landing.box6Title1")}<br/>{t("landing.box6Title2")}
              </div>
              <div className="mt-3 font-editor text-[11px] md:text-xs opacity-70 max-w-[24ch] ml-auto">
                {t("landing.box6Sub")}
              </div>
              <div className="mt-3 font-editor text-xs md:text-sm inline-flex items-center gap-2 justify-end" style={{ color: "#c8432c" }}>
                {t("landing.box6Cta")} <ArrowRight size={12} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </button>

        </div>

        {/* Tips-teaser — rett under boksene, lenke til /tips (kun for innloggede) */}
        <Link
          to="/tips"
          data-testid="hero-tips-teaser"
          className="mt-6 md:mt-8 block group"
        >
          <div
            className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3 md:gap-6 px-6 md:px-8 py-6 md:py-7 transition-all hover:bg-neutral-50"
            style={{ border: "1px solid var(--line)", background: "#fdfcf9" }}
          >
            <div className="min-w-0">
              <div className="label-ui" style={{ color: "var(--rust)" }}>{t("landing.tipsKicker")}</div>
              <div className="mt-2 font-serif-display text-2xl md:text-3xl leading-tight" style={{ color: "var(--ink)" }}>
                {t("landing.tipsTitleA")} <em className="italic" style={{ color: "var(--moss)" }}>{t("landing.tipsTitleB")}</em>.
              </div>
              <p className="mt-2 font-editor text-sm md:text-base" style={{ color: "var(--ink-soft)" }}>
                {t("landing.tipsBody")}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="label-ui" style={{ color: "var(--ink-mute)" }}>{t("landing.tipsAccess")}</span>
              <span
                className="font-mono-ui text-sm tracking-wide uppercase inline-flex items-center gap-2 group-hover:underline underline-offset-4"
                style={{ color: "var(--rust)" }}
              >
                {t("landing.tipsCta")} <ArrowRight size={14} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>

        {/* Hero heading below grid */}
        <div className="mt-14 md:mt-16 max-w-[62ch]">
          <div className="label-ui mb-4">{t("heroBelow.kicker")}</div>
          <h1 className="font-serif-display font-light text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight" style={{ color: "var(--ink)" }}>
            {t("heroBelow.titleA")} <em className="italic" style={{ color: "var(--moss)" }}>{t("heroBelow.titleB")}</em>
          </h1>
          <p className="mt-6 font-editor text-lg md:text-xl" style={{ color: "var(--ink)" }}>
            {t("heroBelow.p1a")} <em className="italic" style={{ color: "var(--moss)" }}>{t("heroBelow.p1b")}</em>
          </p>
          <p className="mt-4 font-editor text-base md:text-lg" style={{ color: "var(--ink-soft)" }}>
            {t("heroBelow.p2")}
          </p>
          <div
            className="mt-8 pl-5 py-2"
            style={{ borderLeft: "3px solid var(--moss)" }}
          >
            <p className="font-serif-display text-xl md:text-2xl leading-snug" style={{ color: "var(--ink)" }}>
              <span className="font-serif-display" style={{ color: "var(--moss)" }}>Bragarmål</span>
              {" "}{t("heroBelow.ninorseA")}
              {" "}<em className="italic">{t("heroBelow.ninorseB")}</em>
              {" "}{t("heroBelow.ninorseC")}
            </p>
          </div>
        </div>
      </section>

      {/* MANIFEST — utdrag som leder til full manifestside */}
      <section className="hairline-t hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <aside className="col-span-12 md:col-span-3 fade-in stagger-1">
              <div className="label-ui">Fra Nina</div>
              <div className="rule my-4" />
              <p className="font-editor italic text-sm" style={{ color: "var(--ink-mute)" }}>
                Manifest — fra meg, Nina.
              </p>
            </aside>

            <article className="col-span-12 md:col-span-9 md:pl-4 fade-in stagger-2">
              <div className="label-ui" style={{ color: "var(--rust)" }}>Manifest</div>
              <h2 className="font-serif-display text-4xl md:text-5xl font-light mt-2 leading-[1.1]" style={{ color: "var(--ink)" }}>
                Norsk skrivehjelp for mennesker som vil <em className="italic" style={{ color: "var(--moss)" }}>skrive selv</em>.
              </h2>

              <div className="mt-10 font-editor text-lg md:text-xl leading-[1.85]" style={{ color: "var(--ink)" }}>
                <p>I tre år har jeg jobbet med den samme boka, skrevet, slettet, flyttet scener, begynt på nytt, mistet oversikten og funnet den igjen. Og jeg har hatt skrivesperre.</p>
                <p className="mt-6">Etter hvert innså jeg at jeg trengte hjelp.</p>
                <p className="mt-6">Ikke noen som skulle skrive boka for meg, men noen som kunne lese den utenfra, se det jeg selv hadde stirret meg blind på og si fra når noe ikke fungerte.</p>
                <p className="mt-6">Jeg søkte profesjonell, menneskelig hjelp, men det ble for dyrt for meg.</p>
                <p className="mt-6">Så jeg begynte å se på hva AI kunne gjøre, og den kunne gjøre mye. Den kunne skrive om, rette, fortsette, gjøre språket glattere og få teksten til å flyte bedre.</p>
                <p className="mt-6">Men er det en ting jeg ikke vil gi fra meg, så er det stemmen min.</p>
                <p className="mt-6">Ei heller konseptet mitt til et program som ikke kunne vite hvorfor jeg hadde skrevet akkurat den setningen slik, hvorfor en karakter reagerte som hun gjorde, eller hvorfor noe litt skjevt i språket kanskje skulle få lov til å være skjevt.</p>
                <p className="mt-6">Jeg ville kort sagt ha hjelp uten å gi fra meg forfatterskapet.</p>
                <p className="mt-8 font-serif-display text-2xl md:text-3xl italic" style={{ color: "var(--moss)" }}>Derfor laget jeg Bragarmål.</p>

                <h3 className="font-serif-display text-2xl md:text-3xl font-light mt-14" style={{ color: "var(--ink)" }}>Et manus er ikke bare data</h3>
                <p className="mt-4">Det er år med notater, halvferdige kapitler, tankespinn og ideer. Det er å våkne klokka tre om natta med noe som bare må skrives ned. Det er scener og kapitler som kastes og omskrives, det er parkering på en bussholdeplass for å notere noe du absolutt ikke må glemme, selv om du allerede er sent ute til et bryllup.</p>
                <p className="mt-6">Et manus er arbeid som ikke kan måles i antall ord, men når det vokser blir det også vanskeligere å se alt.</p>

                <h3 className="font-serif-display text-2xl md:text-3xl font-light mt-14" style={{ color: "var(--ink)" }}>Stemmen din er ikke en oppskrift</h3>
                <p className="mt-4">AI skal brukes der AI er nyttig. Du skal vite hva som skjer med det du legger inn, hva som lagres, hva som brukes til stemmeprofilen din, og hva som ikke brukes til trening av AI-modeller.</p>
                <p className="mt-6 font-serif-display text-xl md:text-2xl italic" style={{ color: "var(--ink)" }}>Kontrollen over teksten skal ligge hos deg.</p>
                <p className="mt-6">Jeg er ikke imot AI, Bragarmål bruker AI, men forskjellen ligger i hva vi ber den om å gjøre.</p>
                <p className="mt-6">Etter hvert som et manus vokser, kan Bragarmål hjelpe med å holde styr på karakterer, hendelser og sammenhenger, oppdage brudd, se endringer i tempo og stemme, og finne ting du selv har lest så mange ganger at du ikke lenger ser dem.</p>
                <p className="mt-6">Ikke nødvendigvis for å gi deg svaret, men for å bidra i fremdriften din. Noen ganger trenger en forfatter kanskje bare noen som faktisk stiller spørsmålet.</p>
                <p className="mt-6">Når teksten plutselig avviker, skal ikke Bragarmåls første reaksjon være:</p>
                <p className="mt-3 italic" style={{ color: "var(--ink-mute)" }}>Her er en bedre setning…</p>
                <p className="mt-3">Den bør heller være:</p>
                <p className="mt-3 italic" style={{ color: "var(--moss)" }}>Her skjer det noe…</p>

                <h3 className="font-serif-display text-2xl md:text-3xl font-light mt-14" style={{ color: "var(--ink)" }}>Redaksjonell motstand skal ikke være forbeholdt dem som har råd</h3>
                <p className="mt-4">Bragarmål skal ikke erstatte en redaktør eller menneskelig erfaring. Skjønn og litterær forståelse betyr mest, og det skal det også gjøre.</p>
                <p className="mt-6">Men alternativet for den som ikke har råd til profesjonell hjelp, skal ikke være å måtte sitte helt alene med alle spørsmålene.</p>

                <h3 className="font-serif-display text-2xl md:text-3xl font-light mt-14" style={{ color: "var(--ink)" }}>Målet</h3>
                <p className="mt-4">Jeg ønsker at Bragarmål etter hvert skal bli en norsk skrivehjelp man kan bruke med rak rygg, der du kan bruke teknologien gjennom arbeidet med boka og fortsatt legge det ferdige manuset på bordet og si:</p>
                <p className="mt-6 font-serif-display text-2xl md:text-3xl italic" style={{ color: "var(--ink)" }}>Dette skrev jeg.</p>
                <p className="mt-6">Ikke fordi AI aldri var i rommet, men fordi AI aldri fikk forfatterens plass.</p>

                <p className="mt-10 font-serif-display text-3xl md:text-4xl italic leading-snug" style={{ color: "var(--ink)" }}>
                  Mennesket skriver. <span style={{ color: "var(--moss)" }}>Bragarmål sparrer.</span>
                </p>
              </div>

              <div className="rule mt-10" />
              <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                <span className="label-ui">— Nina</span>
                <div className="flex items-center gap-4">
                  <Link to="/manifest" data-testid="landing-manifest-read-all" className="btn-ghost inline-flex items-center gap-2">
                    Les hele manifestet <ArrowRight size={14} strokeWidth={1.6} />
                  </Link>
                  <Link to="/etikk" className="label-ui" style={{ color: "var(--moss)" }}>
                    Etisk AI-skriving →
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

