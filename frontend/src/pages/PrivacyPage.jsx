import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { ArrowLeft, ArrowRight } from "lucide-react";
import InfoMenu from "@/components/InfoMenu";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const DATA_TYPES = [
  { label: "Tekst du limer inn eller laster opp", detail: "Utkast, notater, tidligere tekster — lagret på din konto til du sletter det selv." },
  { label: "Håndskrift (foto)", detail: "Bilder tolkes til tekst av en KI-modell. Selve bildet lagres i Bragarmåls fillager, tolket til din konto." },
  { label: "Opptak av høytlesning", detail: "Lydfilen transkriberes til tekst (Whisper). Brukes til å bygge stemmeprofilen din." },
  { label: "Det du skriver i Skrivepulten", detail: "Sendes til en KI-modell for å generere forslag, sammen med relevante utdrag fra din stemmeprofil." },
  { label: "Konto-info", detail: "E-post og innloggingsdata, for autentisering." },
];

const PROVIDERS = [
  { name: "Anthropic (Claude)", role: "Tekstforslag og skrivehjelp" },
  { name: "OpenAI (GPT / Whisper)", role: "Tekstforslag, samt transkribering av høytlesning" },
  { name: "Google (Gemini)", role: "Tekstforslag og skrivehjelp" },
];

const RIGHTS = [
  { n: "01", title: "Se hva som er lagret", body: "Alt du har lastet opp — prøver, scener, karakterer, filer — ligger synlig under Din side. Ingenting er skjult for deg." },
  { n: "02", title: "Slette enkeltting selv", body: "Prøver, scener, karakterer, filer og øyeblikksbilder kan slettes ett og ett, direkte i appen, når som helst." },
  { n: "03", title: "Be om at alt slettes", body: "Full sletting av konto og alle data er foreløpig ikke en selvbetjent knapp. Send oss en e-post, så sletter vi manuelt og bekrefter." },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Seo
        title="Personvern — hvordan Bragarmål bruker KI"
        description="Hva Bragarmål samler inn, hvilke KI-modeller vi sender teksten din til og hvorfor, og hvordan du sletter dataene dine."
        path="/personvern"
      />
      <div className="hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo size={56} />
          </Link>
          <div className="flex items-center gap-4">
            <InfoMenu align="right" />
            <Link to="/" className="label-ui inline-flex items-center gap-2">
              <ArrowLeft size={14} strokeWidth={1.5} /> Tilbake
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-14 pb-6">
        <div className="label-ui">Personvern</div>
        <h1 className="font-serif-display text-5xl md:text-6xl font-light mt-3 max-w-[18ch]" style={{ color: "var(--ink)" }}>
          Hva som samles inn, og hvor det går.
        </h1>
        <p className="mt-6 font-editor text-lg md:text-xl max-w-[68ch]" style={{ color: "var(--ink-soft)" }}>
          Bragarmål er bygget rundt teksten din. Da må du vite nøyaktig
          hva som lagres, hvilke KI-modeller som ser den, og hva du selv
          rår over. Denne siden er skrevet så konkret vi klarer — ingen
          juridisk fyllord.
        </p>
      </section>

      {/* Del 1 — hva samles inn */}
      <section className="hairline-t mt-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <div className="label-ui">Del 1</div>
              <h2 className="font-serif-display text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
                Hva vi lagrer.
              </h2>
              <p className="font-editor mt-6" style={{ color: "var(--ink-soft)" }}>
                Alt du legger inn i Bragarmål, i klartekst.
              </p>
            </div>
            <div className="lg:col-span-8">
              {DATA_TYPES.map((d) => (
                <div key={d.label} className="hairline-b py-6">
                  <div className="font-serif-display text-lg" style={{ color: "var(--ink)" }}>{d.label}</div>
                  <div className="font-editor text-sm mt-2" style={{ color: "var(--ink-soft)" }}>{d.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Del 2 — hvem ser teksten */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
          <div className="label-ui">Del 2</div>
          <h2 className="font-serif-display text-4xl font-light mt-2 max-w-[24ch]" style={{ color: "var(--ink)" }}>
            Hvilke KI-modeller teksten din sendes til.
          </h2>
          <p className="font-editor mt-6 max-w-[68ch]" style={{ color: "var(--ink-soft)" }}>
            Bragarmål skriver ikke selv — vi sender forespørsler videre til
            eksterne KI-leverandører, via en samlet teknisk løsning driftet
            av vår plattformpartner Emergent. Avhengig av hvilken modell du
            velger i verktøyet, går teksten til:
          </p>
          <div className="mt-10 hairline-t hairline-b">
            {PROVIDERS.map((p) => (
              <div key={p.name} className="grid grid-cols-12 py-5 hairline-b items-start gap-y-2 last:border-b-0">
                <div className="col-span-12 md:col-span-4 font-serif-display text-lg" style={{ color: "var(--ink)" }}>{p.name}</div>
                <div className="col-span-12 md:col-span-8 font-editor text-sm" style={{ color: "var(--ink-soft)" }}>{p.role}</div>
              </div>
            ))}
          </div>
          <p className="font-editor mt-8 max-w-[68ch]" style={{ color: "var(--ink-soft)" }}>
            Vi bruker ikke teksten din til å trene den delte modellen alle
            andre brukere får svar fra. Stemmeprofilen din er noe annet:
            en <em className="italic" style={{ color: "var(--moss)" }}>privat, personlig referanse</em> —
            bygget for deg, låst til din konto, og slettet når du sletter den.
          </p>
        </div>
      </section>

      {/* Del 3 — lagring */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <div className="label-ui">Del 3</div>
              <h2 className="font-serif-display text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
                Hvor lenge, og hvor.
              </h2>
            </div>
            <div className="lg:col-span-8 font-editor text-lg leading-relaxed" style={{ color: "var(--ink-soft)" }}>
              <p>
                Data lagres i vår database og filtjeneste (driftet via Emergent)
                helt til du selv sletter det. Vi har ingen automatisk sletting
                etter en gitt tid — det er ditt materiale, og det ligger der du
                la det, til du fjerner det.
              </p>
              <p className="mt-4">
                Opplastede filer og lydopptak lagres i et eget fillager, ikke
                i selve teksten — kun knyttet til din konto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Del 4 — dine rettigheter */}
      <section className="hairline-t" style={{ background: "var(--bg-alt)" }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
          <div className="label-ui">Del 4</div>
          <h2 className="font-serif-display text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
            Det du rår over.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mt-10 hairline-t hairline-b">
            {RIGHTS.map((r, i) => (
              <div key={r.n} className={`p-8 ${i > 0 ? "md:border-l" : ""}`} style={{ borderColor: "var(--line)" }}>
                <div className="label-ui" style={{ color: "var(--moss)" }}>{r.n}</div>
                <h3 className="font-serif-display text-2xl mt-3" style={{ color: "var(--ink)" }}>{r.title}</h3>
                <p className="font-editor text-sm mt-3 leading-relaxed" style={{ color: "var(--ink-soft)" }}>{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing / contact */}
      <section className="hairline-t hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 text-center">
          <div className="label-ui">Spørsmål</div>
          <h2 className="font-serif-display text-4xl md:text-5xl font-light mt-4 max-w-[26ch] mx-auto" style={{ color: "var(--ink)" }}>
            Lurer du på noe vi ikke har svart på her?
          </h2>
          <p className="font-editor mt-6 max-w-[62ch] mx-auto text-lg" style={{ color: "var(--ink-soft)" }}>
            Send oss en e-post — vi svarer selv, ikke en bot.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <a
              href="mailto:hei@Bragarmål.no?subject=Personvern%20-%20BRAGARMÅL"
              className="btn-ghost inline-flex items-center gap-2"
            >
              hei@Bragarmål.no
            </a>
            <Link to="/etikk" className="btn-primary inline-flex items-center gap-3">
              Etikk <ArrowRight size={14} strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
