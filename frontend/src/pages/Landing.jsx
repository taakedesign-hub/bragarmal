import { Link, useNavigate } from "react-router-dom";
import { TID } from "@/lib/testIds";
import { Feather, ArrowRight, Camera, Mic, FileText, ScanLine } from "lucide-react";

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
            <span className="font-serif-display text-xl">Nina2</span>
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

      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-12">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
          <div className="col-span-12 md:col-span-9 fade-in">
            <div className="label-ui mb-6">Manifest <span className="marker-ornament" /> for deg som står fast</div>
            <h1 className="font-serif-display font-light text-5xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight" style={{ color: "var(--ink)" }}>
              DIN stemme <em className="italic" style={{ color: "var(--moss)" }}>er din.</em>
            </h1>
            <p className="mt-8 font-editor text-lg md:text-xl max-w-[62ch]" style={{ color: "var(--ink-soft)" }}>
              Ingen rask metode for å publisere. Kun et verktøy som tar deg videre — på dine premisser.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <button
                data-testid={TID.ctaGetStarted}
                onClick={startGoogleLogin}
                className="btn-primary inline-flex items-center gap-3"
              >
                Test den ut nå <ArrowRight size={16} strokeWidth={1.6} />
              </button>
              <span className="label-ui">gratis med Google-innlogging</span>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFEST — user's own voice, verbatim */}
      <section className="hairline-t hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <aside className="col-span-12 md:col-span-3 fade-in stagger-1">
              <div className="label-ui">Fra Nina</div>
              <div className="rule my-4" />
              <p className="font-editor italic text-sm" style={{ color: "var(--ink-mute)" }}>
                Manifest, skrevet uredigert av forfatteren selv.
              </p>
            </aside>

            <article className="col-span-12 md:col-span-9 md:pl-4 fade-in stagger-2">
              <div className="font-editor text-lg md:text-xl leading-[1.85]" style={{ color: "var(--ink)" }}>
                <p>
                  I tre år har jeg jobbet med samme bok. Dette siste året begynte jeg å teste ut
                  diverse AI for å se om jeg kunne få hjelp med skrivingen. Resultatet har så langt
                  vært nedslående. De beste forteller hva som fungerer og ikke er bra.
                </p>
                <p className="mt-6">
                  Men dessverre, alt handler om å kunne publisere mest mulig og fortest mulig.
                  I tillegg testet jeg også AI-detektorer, og selv mine personlige tekster ble
                  flagget som AI. Fordi AI fungerer på data, matematikk, ord som er matet inn.
                  Dette gjelder spesielt for akademiske tekster og kreative tekster som er ryddige,
                  har flyt fra før.
                </p>
                <p
                  className="mt-8 font-serif-display text-2xl md:text-3xl leading-snug pl-6"
                  style={{ color: "var(--ink)", borderLeft: "2px solid var(--moss)" }}
                >
                  Det viktigst av alt med Echo er ikke at det er et verktøy for deg som bare vil
                  skrive en bok, men for deg som står fast, trenger noen nye vinklinger, etc.,
                  med DIN fortellerstemme.
                </p>
                <p className="mt-8">
                  Gjennom bilder av tekster du har skrevet for hånd, notater, meldinger om du vil,
                  den boka du begynte på en gang for lenge siden, men aldri skrev ferdig.
                  Stemme­aktivering for å fange din fortellerstemme muntlig om du har problemer
                  med skriftspråket, og ikke vil gi fra deg fortellerstemmen din og miste ektheten
                  som er deg.
                </p>
                <p className="mt-6" style={{ color: "var(--moss)" }}>
                  <em className="italic">
                    Test den ut nå, mat inn det du har og vil, ta bilder av gamle tekster du har
                    skrevet på papir, les inn, noter og les gjennom.
                  </em>
                </p>
                <p className="mt-8">
                  For noen dager siden hadde jeg en prat med AI jeg brukt over tid, og jeg spurte
                  hvorfor den var blitt så kort og konkret i svarene, til og med diskutert og
                  kritisert. Vanligvis er AI smiskete og alltid enig, så dette var nytt.
                </p>
                <p className="mt-6">
                  Som sagt, ingen rask metode for å publisere, kun et verktøy som tar deg videre
                  på dine premisser. Herlig, men overraskende. Svaret jeg fikk var at jeg hadde
                  to stemmer, en for når jeg var varm og en for når jeg jobbet med noe og bare
                  ville ha svar. Den siste stemmen var konkret, kald, direkte og uten vissvass.
                  Jeg ble rett og slett speilet.
                </p>
                <p className="mt-6">
                  Ubehagelig oppdagelse, men understreker poenget mitt med Echo.
                </p>
                <p
                  className="mt-10 font-serif-display text-3xl md:text-4xl leading-snug"
                  style={{ color: "var(--ink)" }}
                >
                  DIN stemme er din. Og Echo hjelper deg uten at du må bruke lang tid på å trene
                  opp AI.
                </p>
              </div>

              <div className="rule mt-12" />
              <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                <span className="label-ui">— Nina</span>
                <button onClick={startGoogleLogin} className="btn-primary inline-flex items-center gap-3">
                  Begynn å mate inn <ArrowRight size={16} strokeWidth={1.6} />
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Practical entry-points */}
      <section>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
          <div className="label-ui">Fire måter å mate inn på</div>
          <h2 className="font-serif-display text-4xl md:text-5xl font-light mt-2" style={{ color: "var(--ink)" }}>
            Alt du har, i din stemme.
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-0 hairline-t hairline-b">
            <EntryTile n="01" icon={<FileText size={20} strokeWidth={1.4} />} title="Lim inn" body="Kladder, meldinger, avsnitt du har liggende — bare kopier og lim." />
            <EntryTile n="02" icon={<ScanLine size={20} strokeWidth={1.4} />} title="Last opp fil" body=".txt, .md, .pdf, .docx. Nedskrevet materiale du har fra før." bordered />
            <EntryTile n="03" icon={<Camera size={20} strokeWidth={1.4} />} title="Foto av håndskrift" body="Fotografer gamle notatbøker og brev. Håndskriften blir tekst." bordered />
            <EntryTile n="04" icon={<Mic size={20} strokeWidth={1.4} />} title="Høytlesning" body="Les direkte inn, eller last opp opptak. Muntlig fortellerstemme bevart." bordered />
          </div>
        </div>
      </section>

      {/* Model row */}
      <section className="hairline-t hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 flex flex-wrap items-center gap-6 justify-between">
          <div className="label-ui">Velg din modell</div>
          <div className="flex flex-wrap gap-3">
            <span className="chip">Claude Sonnet 4.5</span>
            <span className="chip">Claude Sonnet 4.6</span>
            <span className="chip">GPT 5.2</span>
            <span className="chip">GPT 5.4</span>
            <span className="chip">Gemini 3.1 Pro</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 flex items-center justify-between">
          <span className="label-ui">Echo <span className="marker-ornament" /> 2026</span>
          <span className="label-ui">et verktøy for forfattere som står fast</span>
        </div>
      </footer>
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
