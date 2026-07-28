import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { ArrowLeft, ArrowRight } from "lucide-react";
import InfoMenu from "@/components/InfoMenu";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const EXAMPLES = [
  {
    scenario: "Du har skrevet halve boken, og står bom fast.",
    help:
      "Mat inn kapitlene du har. Bragarmål lærer stemmen din, viser deg hvor du selv skinner, og foreslår retninger videre — ikke ferdig tekst. Du bestemmer.",
  },
  {
    scenario: "Du har skrivevansker, men flommen kommer når du snakker.",
    help:
      "Les inn tanker, ideer, hele scener. Bragarmål transkriberer, henter rytmen din, og gir deg tilbake en versjon som ligner den du hadde i hodet.",
  },
  {
    scenario: "Du har notater og bilder av håndskrevne tekster fra flere år.",
    help:
      "Ta bilde. Bragarmål leser håndskriften, samler stemmen din på tvers av kilder, og lager en profil som blir bedre jo mer du legger inn.",
  },
  {
    scenario: "Du har en idé, men vet ikke hvor du skal begynne.",
    help:
      "Skriv én setning. Bragarmål sparrer med deg — foreslår vinklinger, spør oppfølgingsspørsmål, hjelper deg strukturere. Aldri autopilot; alltid samtale.",
  },
  {
    scenario: "Du har fått hjelp av en AI før, og teksten mistet sjelen.",
    help:
      "Legg inn AI-teksten sammen med dine egne skisser. Bragarmål viser deg — setning for setning — hvor stemmen din forsvant, og gir deg tilbake det som var ditt.",
  },
  {
    scenario: "Du skriver på nynorsk, dialekt, eller en helt egen tone.",
    help:
      "Vi legger oss aldri i språkvalg. Bragarmål bevarer dialekt, tegnsetting, brudd, uvante formuleringer — alt som gjør skriften din gjenkjennelig.",
  },
];

export default function ExamplesPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Seo
        title="Eksempler på når Bragarmål hjelper"
        description="Konkrete scenarier: skrivesperre, dialekt, håndskrevne notater, stemmeaktivering. Slik hjelper Bragarmål deg videre — uten å ta over."
        path="/eksempler"
      />
      <div className="hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo size={52} />
          </Link>
          <nav className="flex items-center gap-6">
            <InfoMenu align="right" />
            <Link to="/" className="label-ui flex items-center gap-2" style={{ color: "var(--ink-mute)" }}>
              <ArrowLeft size={14} /> Tilbake
            </Link>
          </nav>
        </div>
      </div>

      <section className="max-w-[1200px] mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-6">
        <div className="label-ui mb-4">Eksempler <span className="marker-ornament" /> når det låser seg</div>
        <h1 className="font-serif-display font-light text-4xl md:text-6xl leading-[1.05] tracking-tight" style={{ color: "var(--ink)" }}>
          Når hjelper <em className="italic" style={{ color: "var(--moss)" }}>Bragarmål</em> deg?
        </h1>
        <p className="mt-6 font-editor text-lg md:text-xl max-w-[62ch]" style={{ color: "var(--ink-soft)" }}>
          Seks konkrete situasjoner der Bragarmål tar deg videre — uten å ta over.
        </p>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {EXAMPLES.map((ex, i) => (
            <div
              key={i}
              data-testid={`example-${i + 1}`}
              className="hairline-t pt-6 md:pt-8"
            >
              <div className="font-mono-ui text-xs tracking-widest" style={{ color: "var(--moss)" }}>
                0{i + 1}
              </div>
              <p className="mt-3 font-serif-display text-xl md:text-2xl leading-snug" style={{ color: "var(--ink)" }}>
                {ex.scenario}
              </p>
              <p className="mt-4 font-editor text-base md:text-lg leading-[1.75]" style={{ color: "var(--ink-soft)" }}>
                {ex.help}
              </p>
            </div>
          ))}
        </div>

        {/* Prompt eksempler — sånn spør du */}
        <div className="mt-16 md:mt-20 grid grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="col-span-12 md:col-span-4">
            <div className="label-ui">Sånn spør du</div>
            <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
              Eksempler på når Bragarmål <em className="italic" style={{ color: "var(--moss)" }}>hjelper</em>.
            </h2>
            <p className="font-editor mt-6" style={{ color: "var(--ink-soft)" }}>
              Ikke spør «skriv kapittel to for meg». Spør slik du ville spurt en betrodd kollega
              — konkret, med kontekst.
            </p>
          </div>
          <div className="col-span-12 md:col-span-8 space-y-6">
            <ExamplePrompt
              situation="Skrivesperre midt i teksten"
              prompt="Jeg har skrevet 4 sider, men står fast. Kan Bragarmål gi meg et tekstforslag for å løsne skrivesperren?"
            />
            <ExamplePrompt
              situation="Ny scene i din stemme"
              prompt="Skriv en åpning på et kapittel der Ellen kommer inn på minilageret for siste gang — mørkt, kort, i min stemme."
            />
            <ExamplePrompt
              situation="Vei videre fra et fragment"
              prompt="Her er en dialogsnutt jeg har liggende. Foreslå tre retninger scenen kan gå videre — jeg velger selv."
            />
            <ExamplePrompt
              situation="Sjekk om det lyder som deg"
              prompt="Sjekk denne teksten mot stemmeprofilen min. Hvilke setninger skiller seg mest ut, og hvorfor?"
            />
            <ExamplePrompt
              situation="Bearbeide gammelt materiale"
              prompt="Jeg har fotografert en side fra dagboka mi fra 2003. Transkriber, og foreslå hvordan den kan brukes som scene i romanen."
            />
          </div>
        </div>

        <div className="hairline-t mt-16 pt-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-serif-display text-2xl md:text-3xl" style={{ color: "var(--moss)" }}>
              En sparringspartner. Ikke tekstautomat.
            </p>
            <p className="mt-3 font-editor text-base md:text-lg" style={{ color: "var(--ink)" }}>
              Klar til å prøve?
            </p>
          </div>
          <Link to="/logg-inn" className="btn-primary inline-flex items-center gap-3" data-testid="examples-cta">
            Kom i gang <ArrowRight size={14} strokeWidth={1.6} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ExamplePrompt({ situation, prompt }) {
  return (
    <div className="paper p-6 md:p-7" style={{ background: "#fafafa" }}>
      <div className="label-ui" style={{ color: "var(--moss)" }}>{situation}</div>
      <p
        className="mt-3 font-editor text-base md:text-lg leading-relaxed italic"
        style={{ color: "var(--ink)" }}
      >
        «{prompt}»
      </p>
    </div>
  );
}
