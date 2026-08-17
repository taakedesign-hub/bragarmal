import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { TID } from "@/lib/testIds";
import { Feather, ArrowRight, Camera, Mic, FileText, ScanLine } from "lucide-react";
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
        description="Bragarmål er et norsk AI-skriveverktøy for forfattere og kreative. Vi genererer ikke ord — vi finner din stemme. Tren stemmeprofil, oppdag AI-signaturer, skriv videre uten AI-slop."
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

      {/* MANIFEST — teaser, links to full manifest page */}
      <section className="hairline-t hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <aside className="col-span-12 md:col-span-3 fade-in stagger-1">
              <div className="label-ui">{t("manifestSec.fromNina")}</div>
              <div className="rule my-4" />
              <p className="font-editor italic text-sm" style={{ color: "var(--ink-mute)" }}>
                {t("manifestSec.aside")}
              </p>
            </aside>

            <article className="col-span-12 md:col-span-9 md:pl-4 fade-in stagger-2">
              <div className="font-editor text-lg md:text-xl leading-[1.85]" style={{ color: "var(--ink)" }}>
                <p>{t("manifestSec.p1")}</p>
                <p className="mt-8">
                  {t("manifestSec.p2a")} <em className="italic" style={{ color: "var(--moss)" }}>Bragarmål</em>{t("manifestSec.p2b")}
                </p>
                <p
                  className="mt-10 font-serif-display text-2xl md:text-3xl leading-snug pl-6"
                  style={{ color: "var(--ink)", borderLeft: "2px solid var(--moss)" }}
                >
                  {t("manifestSec.quote")}
                </p>
                <p className="mt-6 font-editor text-lg md:text-xl leading-[1.85]" style={{ color: "var(--ink)" }}>
                  {t("manifestSec.p3")}
                </p>
                <p className="mt-8 font-serif-display text-xl md:text-2xl" style={{ color: "var(--ink)" }}>
                  {t("manifestSec.p4")}
                </p>
                <p className="mt-6" style={{ color: "var(--ink)" }}>
                  {t("manifestSec.p5a")}
                  {" "}<em className="italic" style={{ color: "var(--moss)" }}>{t("manifestSec.p5b")}</em>
                </p>
              </div>

              <div className="rule mt-10" />
              <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                <span className="label-ui">— Nina</span>
                <div className="flex items-center gap-4">
                  <Link to="/manifest" className="btn-ghost inline-flex items-center gap-2">
                    {t("manifestSec.readAll")} <ArrowRight size={14} strokeWidth={1.6} />
                  </Link>
                  <Link to="/etikk" className="label-ui" style={{ color: "var(--moss)" }}>
                    {t("manifestSec.ethicsLink")}
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Sparringspartner — practice over time */}
      <section>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="col-span-12 md:col-span-4">
              <div className="label-ui">{t("sparring.kicker")}</div>
              <h2 className="font-serif-display text-4xl md:text-5xl font-light mt-2" style={{ color: "var(--ink)" }}>
                {t("sparring.titleA")} <em className="italic" style={{ color: "var(--moss)" }}>{t("sparring.titleB")}</em>.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-8 md:pl-4 font-editor text-lg md:text-xl leading-[1.85]" style={{ color: "var(--ink)" }}>
              <p>{t("sparring.intro")}</p>
              <p
                className="mt-8 pl-6 font-serif-display text-xl md:text-2xl italic leading-snug"
                style={{ color: "var(--ink-soft)", borderLeft: "2px solid var(--rust)" }}
              >
                {t("sparring.q1")}
              </p>
              <p
                className="mt-6 pl-6 font-serif-display text-xl md:text-2xl italic leading-snug"
                style={{ color: "var(--ink-soft)", borderLeft: "2px solid var(--rust)" }}
              >
                {t("sparring.q2")}
              </p>
              <div className="mt-8 label-ui" style={{ color: "var(--ink-mute)" }}>
                {t("sparring.aiVersion")}
              </div>
              <p className="mt-3" style={{ color: "var(--ink-soft)" }}>
                {t("sparring.aiP1")}
              </p>
              <p className="mt-6" style={{ color: "var(--ink-soft)" }}>
                {t("sparring.aiP2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Practical entry-points */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
          <div className="label-ui">{t("entry.kicker")}</div>
          <h2 className="font-serif-display text-4xl md:text-5xl font-light mt-2" style={{ color: "var(--ink)" }}>
            {t("entry.titleA")} <em className="italic" style={{ color: "var(--moss)" }}>{t("entry.titleB")}</em>{t("entry.titleC")}
          </h2>
          <p className="font-editor text-lg mt-4 max-w-[62ch]" style={{ color: "var(--ink-soft)" }}>
            {t("entry.sub1")} <em className="italic" style={{ color: "var(--moss)" }}>{t("entry.sub2")}</em>{t("entry.sub3")}
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-0 hairline-t hairline-b">
            <EntryTile n="01" icon={<FileText size={20} strokeWidth={1.4} />} title={t("entry.e1t")} body={t("entry.e1b")} />
            <EntryTile n="02" icon={<ScanLine size={20} strokeWidth={1.4} />} title={t("entry.e2t")} body={t("entry.e2b")} bordered />
            <EntryTile n="03" icon={<Camera size={20} strokeWidth={1.4} />} title={t("entry.e3t")} body={t("entry.e3b")} bordered />
            <EntryTile n="04" icon={<Mic size={20} strokeWidth={1.4} />} title={t("entry.e4t")} body={t("entry.e4b")} bordered />
          </div>
        </div>
      </section>

      {/* Model row */}
      <section className="hairline-t hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 flex flex-wrap items-center gap-6 justify-between">
          <div className="label-ui">{t("modelRow.kicker")}</div>
          <div className="flex flex-wrap gap-3 items-center">
            <span className="chip">Claude Sonnet 4.5</span>
            <span className="chip">Claude Sonnet 4.6</span>
            <span className="chip">GPT 5.2</span>
            <span className="chip">GPT 5.4</span>
            <span className="chip">Gemini 3.1 Pro</span>
            <Link
              to="/logg-inn"
              className="chip inline-flex items-center gap-1.5"
              style={{ background: "var(--sky-soft)", color: "var(--ink)", borderColor: "var(--sky)" }}
            >
              {t("modelRow.byok")} <span style={{ color: "var(--ink-mute)" }}>{t("modelRow.byokSub")}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function EntryTile({ n, icon, title, body, bordered }) {
  return (
    <div className={`p-8 ${bordered ? "md:border-l" : ""}`} style={{ borderColor: "var(--line)" }}>
      <div className="flex items-start justify-between">
        <div className="label-ui">{n}</div>
        <div style={{ color: "var(--moss)" }}>{icon}</div>
      </div>
      <h3 className="font-serif-display text-2xl mt-6" style={{ color: "var(--ink)" }}>{title}</h3>
      <p className="font-editor text-sm mt-3 leading-relaxed" style={{ color: "var(--ink-soft)" }}>{body}</p>
    </div>
  );
}

