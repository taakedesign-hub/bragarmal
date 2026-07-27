import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TID } from "@/lib/testIds";
import { Feather, ArrowRight } from "lucide-react";

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
function startGoogleLogin() {
  const redirectUrl = window.location.origin + "/dashboard";
  window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
}

export default function Landing() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Top rule */}
      <div className="hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Feather size={18} strokeWidth={1.4} />
            <span className="font-serif-display text-xl">Skrivestemme</span>
          </div>
          <nav className="flex items-center gap-6">
            <span className="label-ui hidden sm:inline">no · nb</span>
            <button
              data-testid={TID.loginBtn}
              onClick={startGoogleLogin}
              className="btn-ghost"
            >
              Logg inn
            </button>
          </nav>
        </div>
      </div>

      {/* Hero — asymmetric editorial */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-16">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
          <div className="col-span-12 md:col-span-8 fade-in">
            <div className="label-ui mb-6">Kapittel én <span className="marker-ornament" /> for norske forfattere</div>
            <h1 className="font-serif-display font-light text-5xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight" style={{ color: "var(--ink)" }}>
              Din stemme, ikke <em className="italic font-serif-display" style={{ color: "var(--moss)" }}>maskinens</em>.
            </h1>
            <p className="mt-8 font-editor text-lg md:text-xl max-w-[62ch]" style={{ color: "var(--ink-soft)" }}>
              Lim inn eller last opp tekstene du allerede har skrevet. Skrivestemme lærer rytmen din,
              ordvalgene dine, pausene dine — og hjelper deg gjennom skrivesperren uten å høres ut som en robot.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <button
                data-testid={TID.ctaGetStarted}
                onClick={startGoogleLogin}
                className="btn-primary inline-flex items-center gap-3"
              >
                Kom i gang <ArrowRight size={16} strokeWidth={1.6} />
              </button>
              <span className="label-ui">gratis med Google-innlogging</span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 fade-in stagger-2">
            <div className="paper p-6 md:p-8">
              <div className="label-ui mb-4">Utdrag · skrivemønster</div>
              <p className="font-editor italic text-base leading-relaxed" style={{ color: "var(--ink)" }}>
                «Han husker lukter best. Lukten av fuktig betong og sigarettrøyk. Lukten av blod da han var tolv.»
              </p>
              <div className="rule my-5" />
              <div className="grid grid-cols-3 gap-4">
                <Stat k="Setningsvar." v="høy" />
                <Stat k="Rytme" v="brutt" />
                <Stat k="Sanser" v="lukt" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features — grid divider style */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <Feature
              n="01"
              title="Lær din stemme"
              body="Last opp tekstene dine i .txt, .pdf, .docx — eller bare lim inn. Vi analyserer setningsbygning, ordforråd og tone."
              className="p-8 md:p-10 md:border-r border-b md:border-b-0"
            />
            <Feature
              n="02"
              title="Bryt skrivesperren"
              body="Skriv en åpning, be om fortsettelse, eller generér en helt ny tekst fra et frø. Alltid i din stemme."
              className="p-8 md:p-10 md:border-r border-b md:border-b-0"
            />
            <Feature
              n="03"
              title="Unngå AI-signaturer"
              body="Innebygd deteksjonsmåler. Humaniser mer, bryt opp glatt AI-flyt, sjekk score før du publiserer."
              className="p-8 md:p-10"
            />
          </div>
        </div>
      </section>

      {/* Model row */}
      <section className="hairline-t hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 flex flex-wrap items-center gap-6 justify-between">
          <div className="label-ui">Velg din modell</div>
          <div className="flex flex-wrap gap-3">
            <span className="chip">Claude Sonnet 4.5</span>
            <span className="chip">GPT 5.2</span>
            <span className="chip">Gemini 3.1 Pro</span>
            <span className="chip">og flere</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 flex items-center justify-between">
          <span className="label-ui">Skrivestemme <span className="marker-ornament" /> 2026</span>
          <span className="label-ui">et verktøy for forfattere</span>
        </div>
      </footer>
    </div>
  );
}

function Stat({ k, v }) {
  return (
    <div>
      <div className="label-ui">{k}</div>
      <div className="font-serif-display text-lg mt-1" style={{ color: "var(--ink)" }}>{v}</div>
    </div>
  );
}

function Feature({ n, title, body, className }) {
  return (
    <div className={className} style={{ borderColor: "var(--line)" }}>
      <div className="label-ui">{n}</div>
      <h3 className="font-serif-display text-3xl mt-4" style={{ color: "var(--ink)" }}>{title}</h3>
      <p className="font-editor mt-4 text-base leading-relaxed" style={{ color: "var(--ink-soft)" }}>{body}</p>
    </div>
  );
}
