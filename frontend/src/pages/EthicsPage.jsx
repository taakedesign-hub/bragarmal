import { Link } from "react-router-dom";
import { Feather, ArrowLeft, ArrowRight } from "lucide-react";
import InfoMenu from "@/components/InfoMenu";
import Footer from "@/components/Footer";

const CORE_QUESTIONS = [
  {
    n: "01",
    title: "Hvem eier teksten?",
    body: "Hvis AI genererer store deler av innholdet, og forfatteren bare justerer litt, er det ikke lenger forfatterens verk. Den som bærer ansvaret må også ha gjort de avgjørende valgene. Uten det: ingen eierskap.",
  },
  {
    n: "02",
    title: "Blir stemmen bevart eller erstattet?",
    body: "Det er forskjell på å få hjelp til å komme videre i egen formulering, og å få servert ferdige setninger som «høres bra ut». Det første styrker forfatteren. Det andre svekker over tid, fordi motstanden i skrivingen — det som tvinger frem egne formuleringer — blir borte.",
  },
  {
    n: "03",
    title: "Er bruken transparent?",
    body: "Overfor leseren, forlaget, deg selv. Skjult bruk av genererende AI er falskhet. Særlig i skjønnlitteratur, personlige tekster og akademisk arbeid. Åpenhet er ærligere enn å late som teksten er skrevet helt alene.",
  },
  {
    n: "04",
    title: "Hvem blir hjulpet, og hvem blir forbigått?",
    body: "AI kan senke terskelen for folk med dysleksi og andre skriveutfordringer. Det er bra. Men det forsterker også presset om rask produksjon, og gjør det vanskeligere for dem som skriver sakte og grundig. Begge deler er sant samtidig.",
  },
];

const APPROACH_TABLE = [
  { approach: "AI genererer ferdig tekst", risk: "høy", verdict: "Eierskap og stemme tapt.", example: "«Skriv kapittel 3 for meg»" },
  { approach: "AI foreslår retninger", risk: "medium", verdict: "Forsvarlig hvis du velger og omskriver.", example: "«Foreslå tre veier videre i min stil»" },
  { approach: "AI til struktur, research, korrektur", risk: "lav", verdict: "Uproblematisk.", example: "Outline, faktasjekk, rettskriving" },
  { approach: "AI trent på ditt eget materiale", risk: "lav", verdict: "Sterkeste vernet av personlig stemme.", example: "Stilgjenkjenning fra egne tekster" },
];

const RULES = [
  "AI kan foreslå retninger, struktur og alternative formuleringer. AI kan peke på svakheter.",
  "AI skriver ikke ferdige avsnitt eller kapitler som du bare godtar.",
  "Du beholder alltid siste redigering. Og ansvaret for hvert valg.",
  "Du trener systemet på ditt materiale — gamle tekster, høytlesning, tidligere utkast. Ikke bare generelle modeller.",
];

const WORKFLOW = [
  { n: "01", title: "Du skriver først", body: "Selv om det er klønete. Selv om det er ufullstendig." },
  { n: "02", title: "AI hjelper når du står fast", body: "Foreslår vinklinger og alternative veier videre. I din stil." },
  { n: "03", title: "Du velger og omskriver", body: "Tar det som passer, stryker resten, formulerer på nytt med egne ord." },
  { n: "04", title: "Siste runde er menneskelig", body: "Ingen AI-generert tekst går rett inn i det ferdige manuset uten bearbeidelse." },
];

const CHECKS = [
  "Kan jeg forklare og forsvare hvert avsnitt som mitt?",
  "Har jeg gjort de avgjørende valgene?",
  "Ville teksten sett annerledes ut hvis AI ikke hadde vært involvert?",
];

const EKKO_DESIGN = [
  { label: "Stilgjenkjenning på ditt eget materiale", detail: "Jo mer Ekko kjenner din stemme — gamle tekster, håndskrift, høytlesning — desto mindre generisk blir forslagene." },
  { label: "Forslag, ikke ferdige kapitler", detail: "Retninger og korte formuleringer. Ikke hele avsnitt klare til kopiering." },
  { label: "Tydelig merking", detail: "Din tekst og AI-forslag holdes visuelt adskilt. Ingen skjult blanding." },
  { label: "Ingen skjult generering", detail: "«Skriv ferdig dette kapittelet» finnes ikke. Du jobber alltid videre med det Ekko leverer." },
  { label: "Stemme og fragmenter", detail: "Les inn, fotografer gamle notater, jobb videre derfra. Ingen overtar skrivingen." },
  { label: "Personvern og eierskap", detail: "Stemmeopptak og personlige tekster er dine. Alt låst til din innlogging. Ingen deler dine data." },
];

export default function EthicsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Feather size={18} strokeWidth={1.4} />
            <span className="font-serif-display text-xl tracking-widest">EKKO</span>
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
        <div className="label-ui">Etikk</div>
        <h1 className="font-serif-display text-5xl md:text-6xl font-light mt-3 max-w-[16ch]" style={{ color: "var(--ink)" }}>
          Etisk AI-skriving.
        </h1>
        <p className="mt-6 font-editor text-lg md:text-xl max-w-[68ch]" style={{ color: "var(--ink-soft)" }}>
          Etisk AI-skriving handler ikke om teknologien. Den handler om
          <em className="italic" style={{ color: "var(--moss)" }}> makt, eierskap og ansvar</em>.
          Når en maskin hjelper til med tekst, blir spørsmålene større enn
          «er dette lovlig?» eller «blir det detektert?».
        </p>
      </section>

      {/* Core questions */}
      <section className="hairline-t mt-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <div className="label-ui">Del 1</div>
              <h2 className="font-serif-display text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
                Kjerne­spørsmålene.
              </h2>
              <p className="font-editor mt-6" style={{ color: "var(--ink-soft)" }}>
                Fire spørsmål å svare på før du åpner et AI-verktøy.
              </p>
            </div>
            <div className="lg:col-span-8">
              {CORE_QUESTIONS.map((q, i) => (
                <div key={i} className="hairline-b py-8">
                  <div className="label-ui" style={{ color: "var(--moss)" }}>{q.n}</div>
                  <h3 className="font-serif-display text-2xl mt-2" style={{ color: "var(--ink)" }}>{q.title}</h3>
                  <p className="font-editor mt-3 leading-relaxed" style={{ color: "var(--ink-soft)" }}>{q.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Approach table */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
          <div className="label-ui">Del 2</div>
          <h2 className="font-serif-display text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
            Et praktisk skille.
          </h2>

          <div className="mt-10 hairline-t hairline-b">
            <div className="grid grid-cols-12 py-4 label-ui" style={{ color: "var(--ink)" }}>
              <div className="col-span-12 md:col-span-4">Tilnærming</div>
              <div className="col-span-6 md:col-span-2">Risiko</div>
              <div className="col-span-12 md:col-span-3 hidden md:block">Vurdering</div>
              <div className="col-span-12 md:col-span-3 hidden md:block">Eksempel</div>
            </div>
            {APPROACH_TABLE.map((r, i) => (
              <div key={i} className="grid grid-cols-12 py-6 hairline-t items-start gap-y-3">
                <div className="col-span-12 md:col-span-4 font-serif-display text-lg" style={{ color: "var(--ink)" }}>{r.approach}</div>
                <div className="col-span-6 md:col-span-2">
                  <RiskDot level={r.risk} />
                </div>
                <div className="col-span-12 md:col-span-3 font-editor text-sm" style={{ color: "var(--ink-soft)" }}>{r.verdict}</div>
                <div className="col-span-12 md:col-span-3 font-mono-ui text-xs" style={{ color: "var(--ink-mute)" }}>{r.example}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal rules */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <div className="label-ui">Del 3</div>
              <h2 className="font-serif-display text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
                Sett klare regler for deg selv.
              </h2>
              <p className="font-editor mt-6" style={{ color: "var(--ink-soft)" }}>
                Før du bruker noe verktøy. Skriv dem ned. Da er det lettere å holde seg til dem
                når du blir fristet av raske resultater.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ol>
                {RULES.map((r, i) => (
                  <li key={i} className="hairline-b py-5 flex items-start gap-4">
                    <span className="font-mono-ui text-sm w-8 flex-shrink-0" style={{ color: "var(--ink-mute)" }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-editor text-lg" style={{ color: "var(--ink)" }}>{r}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
          <div className="label-ui">Del 4</div>
          <h2 className="font-serif-display text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
            Bruk AI i lag — ikke som forfatter.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 mt-10 hairline-t hairline-b">
            {WORKFLOW.map((w, i) => (
              <div key={i} className={`p-8 ${i > 0 ? "md:border-l" : ""}`} style={{ borderColor: "var(--line)" }}>
                <div className="label-ui" style={{ color: "var(--moss)" }}>{w.n}</div>
                <h3 className="font-serif-display text-2xl mt-3" style={{ color: "var(--ink)" }}>{w.title}</h3>
                <p className="font-editor text-sm mt-3 leading-relaxed" style={{ color: "var(--ink-soft)" }}>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ekko's design ethics */}
      <section className="hairline-t" style={{ background: "var(--bg-alt)" }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <div className="label-ui">Del 5</div>
              <h2 className="font-serif-display text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
                Slik er Ekko bygget.
              </h2>
              <p className="font-editor mt-6" style={{ color: "var(--ink-soft)" }}>
                Etikk er ikke en side vi la til. Det er selve arkitekturen.
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-8">
              {EKKO_DESIGN.map((e, i) => (
                <div key={i} className="hairline-b py-6">
                  <div className="font-serif-display text-lg" style={{ color: "var(--ink)" }}>{e.label}</div>
                  <div className="font-editor text-sm mt-2" style={{ color: "var(--ink-soft)" }}>{e.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Self-check */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
          <div className="label-ui">Del 6</div>
          <h2 className="font-serif-display text-4xl font-light mt-2 max-w-[26ch]" style={{ color: "var(--ink)" }}>
            Vær ærlig — også overfor deg selv.
          </h2>
          <p className="font-editor mt-6 max-w-[68ch]" style={{ color: "var(--ink-soft)" }}>
            Den største etiske fellen er selvbedrag. Det er lett å si til seg selv at
            «jeg bare brukte AI til idéer», mens man i praksis har latt den skrive det meste.
            Tre spørsmål å sjekke med:
          </p>
          <ul className="mt-8 max-w-[70ch]">
            {CHECKS.map((c, i) => (
              <li key={i} className="hairline-b py-5 flex items-start gap-4">
                <span className="w-2 h-2 mt-3 flex-shrink-0" style={{ background: "var(--rust)" }} />
                <span className="font-serif-display text-2xl leading-snug" style={{ color: "var(--ink)" }}>{c}</span>
              </li>
            ))}
          </ul>
          <p className="font-editor mt-8 italic max-w-[68ch]" style={{ color: "var(--ink-soft)" }}>
            Hvis svaret er nei, har grensen sannsynligvis blitt krysset.
          </p>
        </div>
      </section>

      {/* Closing */}
      <section className="hairline-t hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 text-center">
          <div className="label-ui">Konklusjon</div>
          <h2 className="font-serif-display text-4xl md:text-5xl font-light mt-4 max-w-[28ch] mx-auto" style={{ color: "var(--ink)" }}>
            Aksepter at det går <em className="italic" style={{ color: "var(--moss)" }}>saktere</em>.
          </h2>
          <p className="font-editor mt-6 max-w-[62ch] mx-auto text-lg" style={{ color: "var(--ink-soft)" }}>
            Etisk AI-skriving er ikke den raskeste metoden. Den er laget for dem som er villige
            til å beholde ansvaret og stemmen. Også når det koster tid og motstand.
            Det er nettopp derfor den passer til folk som må skrive.
            Ikke bare de som vil ha en bok ferdig.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link to="/manifest" className="btn-ghost inline-flex items-center gap-2">
              <ArrowLeft size={14} strokeWidth={1.6} /> Manifestet
            </Link>
            <Link to="/" className="btn-primary inline-flex items-center gap-3">
              Tilbake til Ekko <ArrowRight size={14} strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function RiskDot({ level }) {
  const color = level === "høy" ? "#a13a3a" : level === "medium" ? "var(--rust)" : "var(--moss)";
  const label = level === "høy" ? "Høy" : level === "medium" ? "Medium" : "Lav";
  return (
    <span className="inline-flex items-center gap-2 label-ui" style={{ color }}>
      <span className="w-2 h-2 rounded-full" style={{ background: color }} /> {label}
    </span>
  );
}
