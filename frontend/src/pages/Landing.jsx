import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { TID } from "@/lib/testIds";
import { ArrowRight } from "lucide-react";
import InfoMenu from "@/components/InfoMenu";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import InstagramEmbed from "@/components/InstagramEmbed";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { api } from "@/lib/api";
import { toast } from "sonner";

// Felles rytme for alle åtte heltboksene: nummer øverst, innhold nederst, samme
// skala og lenkestil. Variasjonen ligger i farge og innhold — ikke i strukturen.
const BOX = "aspect-square flex flex-col justify-between overflow-hidden p-4 sm:p-6 md:p-8";
const NUM = "font-mono-ui text-[10px] md:text-xs tracking-widest opacity-60";
const TITLE = "font-serif-display text-lg sm:text-xl md:text-3xl leading-tight";
const SUB = "mt-2 font-editor text-[11px] sm:text-xs md:text-sm leading-snug opacity-80";
const CTA = "mt-3 font-mono-ui text-[10px] md:text-[11px] tracking-widest uppercase inline-flex items-center gap-2";
const TILE_IMG = "absolute inset-0 w-full h-full object-contain p-6 md:p-8 pointer-events-none";

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
        <div className="max-w-[1800px] mx-auto px-4 md:px-10 py-3 md:py-4 flex items-center justify-between gap-3">
          <Link
            to="/"
            aria-label="Bragarmål — gå til forsiden"
            data-testid="header-logo-link"
            className="flex items-center shrink-0 transition-opacity hover:opacity-80 cursor-pointer scale-[0.62] origin-left sm:scale-100"
          >
            <Logo size={56} />
          </Link>
          <nav className="flex items-center gap-0.5 md:gap-2 shrink min-w-0">
            <InfoMenu align="right" />
            {/* Skjult på liten skjerm — plassen holder ikke, og begge finnes som egne bokser rett under */}
            <Link to="/logg-inn" data-testid="nav-skrivepult" className="hidden sm:inline-block label-ui px-1.5 md:px-3 py-2 whitespace-nowrap" style={{ color: "var(--ink-mute)" }}>{t("nav.tools")}</Link>
            <Link to="/illustratorer" data-testid="nav-illustrators" className="hidden sm:inline-block label-ui px-1.5 md:px-3 py-2 whitespace-nowrap" style={{ color: "var(--ink-mute)" }}>{t("nav.illustrator")}</Link>
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
      <section className="max-w-[1800px] mx-auto px-6 md:px-10 pt-10 md:pt-14 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">

          {/* Box 1 — SVART: pris/prøve */}
          <div data-testid="hero-box-pricing" className={BOX} style={{ background: "#0f0e0d", color: "#ffffff" }}>
            <div className={NUM}>01</div>
            <ul className="space-y-2 sm:space-y-3 md:space-y-4">
              <li>
                <button
                  data-testid="hero-cta-trial"
                  onClick={startTrial}
                  className="text-left font-serif-display text-[13px] sm:text-base md:text-lg leading-tight hover:underline underline-offset-4"
                >
                  {t("landing.tryFree")}
                  <span className="block font-editor text-[10px] md:text-xs opacity-70 mt-0.5">{t("landing.tryFreeSub")}</span>
                </button>
              </li>
              <li>
                <button
                  data-testid={TID.ctaGetStarted}
                  onClick={goLogin}
                  className="text-left font-serif-display text-[13px] sm:text-base md:text-lg leading-tight hover:underline underline-offset-4"
                >
                  {t("landing.beta")}
                  <span className="block font-editor text-[10px] md:text-xs opacity-70 mt-0.5">{t("landing.betaSub")}</span>
                </button>
              </li>
              <li>
                <Link to="/priser" data-testid="hero-cta-pricing" className={`${CTA} hover:underline underline-offset-4`}>
                  {t("info.pricing")} <ArrowRight size={12} strokeWidth={1.6} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Box 2 — HVIT: Når hjelper Bragarmål deg? */}
          <Link
            to="/eksempler"
            data-testid="hero-box-examples"
            className={`${BOX} group transition-colors hover:bg-neutral-50`}
            style={{ background: "#ffffff", color: "#0f0e0d" }}
          >
            <div className={NUM}>02</div>
            <div>
              <div className={TITLE}>{t("landing.box2Title")}</div>
              <p className={SUB} style={{ color: "var(--ink-soft)" }}>{t("landing.box2Sub")}</p>
              <div className={CTA} style={{ color: "#c8432c" }}>
                {t("landing.box2Cta")} <ArrowRight size={12} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Box 3 — RØD: illustratører & kunstnere (eneste røde boks) */}
          <Link
            to="/illustratorer"
            data-testid="hero-box-illustrators"
            className={`${BOX} group transition-opacity hover:opacity-90`}
            style={{ background: "#c8432c", color: "#ffffff" }}
          >
            <div className={NUM}>03</div>
            <div>
              {/* Ett langt ord — må kunne krympe så det ikke renner ut av boksen på mobil */}
              <div className="font-serif-display text-base sm:text-xl md:text-3xl leading-tight tracking-tight break-words">
                ILLUSTRATØRER
              </div>
              <div className={SUB}>& kunstnere</div>
              <div className={CTA}>
                {t("landing.box3Cta")} <ArrowRight size={12} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Box 4 — HVIT: håndtegnet notatbok, lenke til Skriv */}
          <Link
            to="/skriv"
            data-testid="hero-box-write"
            className={`${BOX} group transition-colors hover:bg-neutral-50 relative`}
            style={{ background: "#ffffff", color: "#0f0e0d" }}
          >
            <img src="/tile-notatbok.svg" alt="" className={TILE_IMG} draggable={false} />
            <div className={`${NUM} relative`}>04</div>
            <div className="relative">
              <div className={`${TITLE} italic`}>Skriv.</div>
              <div className={CTA} style={{ color: "#c8432c" }}>
                Til skrivepulten <ArrowRight size={12} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Box 5 — HVIT: registrer deg */}
          <button
            data-testid="hero-box-register"
            onClick={goLogin}
            className={`${BOX} text-left group transition-colors hover:bg-neutral-50`}
            style={{ background: "#ffffff", color: "#0f0e0d" }}
          >
            <div className={NUM}>05</div>
            <div>
              <div className={TITLE}>
                {t("landing.box6Title1")}<br/>{t("landing.box6Title2")}
              </div>
              <div className={SUB} style={{ color: "var(--ink-soft)" }}>{t("landing.box6Sub")}</div>
              <div className={CTA} style={{ color: "#c8432c" }}>
                {t("landing.box6Cta")} <ArrowRight size={12} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </button>

          {/* Box 6 — SVART: verktøyene */}
          <Link
            to="/dashboard"
            data-testid="hero-box-tools"
            className={`${BOX} group transition-opacity hover:opacity-90`}
            style={{ background: "#0f0e0d", color: "#ffffff" }}
          >
            <div className={NUM}>06</div>
            <div>
              <div className={TITLE}>
                {t("landing.box5Title1")}<br/>{t("landing.box5Title2")}
              </div>
              <div className={CTA}>
                {t("landing.box5Cta")} <ArrowRight size={12} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Box 7 — HVIT: blekkhus og penn, lenke til Etikk */}
          <Link
            to="/etikk"
            data-testid="hero-box-image"
            className={`${BOX} group transition-colors hover:bg-neutral-50 relative`}
            style={{ background: "#ffffff", color: "#0f0e0d" }}
          >
            <img src="/ink-pen.png" alt="Blekkhus og fyllepenn" className={TILE_IMG} draggable={false} />
            <div className={`${NUM} relative`}>07</div>
            <div className="relative">
              <div className={`${TITLE} italic`}>{t("landing.box4Cta")}.</div>
              <div className={CTA} style={{ color: "#c8432c" }}>
                Slik tenker vi <ArrowRight size={12} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Box 8 — DYPGRØNN: blekkspor, lenke til Stemme */}
          <Link
            to="/stemme"
            data-testid="hero-box-voice"
            className={`${BOX} group transition-opacity hover:opacity-90 relative`}
            style={{ background: "#3d5c3a", color: "#ffffff" }}
          >
            <img
              src="/tile-blekkspor.svg"
              alt=""
              className="absolute inset-0 w-full h-full object-contain p-6 opacity-90 pointer-events-none"
              draggable={false}
            />
            <div className={`${NUM} relative`}>08</div>
            <div className="relative">
              <div className={`${TITLE} italic`}>Stemme.</div>
              <div className={CTA}>
                Din rytme, ikke maskinens <ArrowRight size={12} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

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
                {t("landing.tipsTitleA")} <em className="italic" style={{ color: "var(--rust)" }}>{t("landing.tipsTitleB")}</em>.
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
            {t("heroBelow.titleA")} <em className="italic" style={{ color: "var(--rust)" }}>{t("heroBelow.titleB")}</em>
          </h1>
          <p className="mt-6 font-editor text-lg md:text-xl" style={{ color: "var(--ink)" }}>
            {t("heroBelow.p1a")} <em className="italic" style={{ color: "var(--rust)" }}>{t("heroBelow.p1b")}</em>
          </p>
          <p className="mt-4 font-editor text-base md:text-lg" style={{ color: "var(--ink-soft)" }}>
            {t("heroBelow.p2")}
          </p>
          <div
            className="mt-8 pl-5 py-2"
            style={{ borderLeft: "3px solid var(--rust)" }}
          >
            <p className="font-serif-display text-xl md:text-2xl leading-snug" style={{ color: "var(--ink)" }}>
              <span className="font-serif-display" style={{ color: "var(--rust)" }}>Bragarmål</span>
              {" "}{t("heroBelow.ninorseA")}
              {" "}<em className="italic">{t("heroBelow.ninorseB")}</em>
              {" "}{t("heroBelow.ninorseC")}
            </p>
          </div>
        </div>
      </section>

      {/* MANIFEST — utdrag som leder til full manifestside */}
      <section className="hairline-t hairline-b">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 py-16 md:py-24">
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
                Norsk skrivehjelp for mennesker som vil <em className="italic" style={{ color: "var(--rust)" }}>skrive selv</em>.
              </h2>

              <div className="mt-10 max-w-[75ch] font-editor text-lg md:text-xl leading-[1.85]" style={{ color: "var(--ink)" }}>
                <p>I tre år har jeg jobbet med den samme boka, skrevet, slettet, flyttet scener, begynt på nytt, mistet oversikten og funnet den igjen. Og jeg har hatt skrivesperre.</p>
                <p className="mt-6">Etter hvert innså jeg at jeg trengte hjelp.</p>
                <p className="mt-6">Ikke noen som skulle skrive boka for meg, men noen som kunne lese den utenfra, se det jeg selv hadde stirret meg blind på og si fra når noe ikke fungerte.</p>
                <p className="mt-6">Jeg søkte profesjonell, menneskelig hjelp, men det ble for dyrt for meg.</p>
                <p className="mt-6">Så jeg begynte å se på hva AI kunne gjøre, og den kunne gjøre mye. Den kunne skrive om, rette, fortsette, gjøre språket glattere og få teksten til å flyte bedre.</p>
                <p className="mt-6">Men er det en ting jeg ikke vil gi fra meg, så er det stemmen min.</p>
                <p className="mt-6">Ei heller konseptet mitt til et program som ikke kunne vite hvorfor jeg hadde skrevet akkurat den setningen slik, hvorfor en karakter reagerte som hun gjorde, eller hvorfor noe litt skjevt i språket kanskje skulle få lov til å være skjevt.</p>
                <p className="mt-6">Jeg ville kort sagt ha hjelp uten å gi fra meg forfatterskapet.</p>
                <p className="mt-8 font-serif-display text-2xl md:text-3xl italic" style={{ color: "var(--rust)" }}>Derfor laget jeg Bragarmål.</p>

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
                <p className="mt-3 italic" style={{ color: "var(--rust)" }}>Her skjer det noe…</p>

                <h3 className="font-serif-display text-2xl md:text-3xl font-light mt-14" style={{ color: "var(--ink)" }}>Redaksjonell motstand skal ikke være forbeholdt dem som har råd</h3>
                <p className="mt-4">Bragarmål skal ikke erstatte en redaktør eller menneskelig erfaring. Skjønn og litterær forståelse betyr mest, og det skal det også gjøre.</p>
                <p className="mt-6">Men alternativet for den som ikke har råd til profesjonell hjelp, skal ikke være å måtte sitte helt alene med alle spørsmålene.</p>

                <h3 className="font-serif-display text-2xl md:text-3xl font-light mt-14" style={{ color: "var(--ink)" }}>Målet</h3>
                <p className="mt-4">Jeg ønsker at Bragarmål etter hvert skal bli en norsk skrivehjelp man kan bruke med rak rygg, der du kan bruke teknologien gjennom arbeidet med boka og fortsatt legge det ferdige manuset på bordet og si:</p>
                <p className="mt-6 font-serif-display text-2xl md:text-3xl italic" style={{ color: "var(--ink)" }}>Dette skrev jeg.</p>
                <p className="mt-6">Ikke fordi AI aldri var i rommet, men fordi AI aldri fikk forfatterens plass.</p>

                <p className="mt-10 font-serif-display text-3xl md:text-4xl italic leading-snug" style={{ color: "var(--ink)" }}>
                  Mennesket skriver. <span style={{ color: "var(--rust)" }}>Bragarmål sparrer.</span>
                </p>
              </div>

              <div className="rule mt-10" />
              <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                <span className="label-ui">— Nina</span>
                <div className="flex items-center gap-4">
                  <Link to="/manifest" data-testid="landing-manifest-read-all" className="btn-ghost inline-flex items-center gap-2">
                    Les hele manifestet <ArrowRight size={14} strokeWidth={1.6} />
                  </Link>
                  <Link to="/etikk" className="label-ui" style={{ color: "var(--rust)" }}>
                    Etisk AI-skriving →
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Instagram — siste innlegg */}
      <section className="hairline-t">
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 py-16 md:py-20 text-center">
          <div className="label-ui" style={{ color: "var(--rust)" }}>Følg med</div>
          <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
            Siste fra <em className="italic" style={{ color: "var(--rust)" }}>Instagram</em>.
          </h2>
          <div className="mt-10">
            <InstagramEmbed permalink="https://www.instagram.com/p/Dc25H4ADaTI/" />
          </div>
          <a
            href="https://www.instagram.com/bragarmal.no"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 font-mono-ui text-sm tracking-wide uppercase hover:underline underline-offset-4"
            style={{ color: "var(--rust)" }}
          >
            @bragarmal.no <ArrowRight size={14} strokeWidth={1.6} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

