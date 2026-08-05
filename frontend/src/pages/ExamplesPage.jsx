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
            <Logo size={56} />
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
          Måter Bragarmål hjelper deg videre — uten å ta over.
        </p>
      </section>

      {/* Intro — hvorfor AI-en bommer, og hvorfor det er et godt tegn */}
      <section className="max-w-[900px] mx-auto px-6 md:px-10 pb-6">
        <div className="hairline-t pt-10 md:pt-12 space-y-5 font-editor text-base md:text-lg leading-[1.75]" style={{ color: "var(--ink)" }}>
          <p>
            AI forstår ikke språk slik et menneske gjør.
          </p>
          <p>
            Den gjenkjenner mønstre — rytme, tone, ordvalg og intensjon — ut fra det du
            faktisk skriver. Når den ikke kjenner din personlige måte å snakke og tenke på,
            kan den bomme. Noen ganger flere ganger på rad. Den kan gi deg svar du ikke
            ba om, før den til slutt innrømmer at den er usikker på hva du mener.
          </p>
          <p className="font-serif-display text-xl md:text-2xl italic" style={{ color: "var(--moss)" }}>
            Det er faktisk et godt tegn.
          </p>
          <p>
            Det betyr at den slutter å gjette og begynner å være ærlig.
          </p>
          <div className="pt-2">
            <p className="mb-3">Derfor fungerer det best når du:</p>
            <ul className="space-y-2 ml-1" style={{ color: "var(--ink-soft)" }}>
              <li className="flex gap-3"><span style={{ color: "var(--rust)" }}>—</span> Skriver som du faktisk snakker</li>
              <li className="flex gap-3"><span style={{ color: "var(--rust)" }}>—</span> Retter den tydelig når den bommer</li>
              <li className="flex gap-3"><span style={{ color: "var(--rust)" }}>—</span> Gir den tid til å lære rytmen din</li>
            </ul>
          </div>
          <p className="pt-2">
            Du trenger ikke tilpasse deg AI-en.
          </p>
          <p style={{ color: "var(--ink-soft)" }}>
            Jo mer ærlig og menneskelig du er, jo fortere klarer den å speile deg tilbake.
          </p>
        </div>
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

        {/* Stemmeprofil — eksempel på hva Bragarmål lager til deg */}
        <section id="stemmeprofil" className="mt-20 md:mt-24 scroll-mt-24">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="col-span-12 md:col-span-4">
              <div className="label-ui">Stemmeprofil</div>
              <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
                Slik <em className="italic" style={{ color: "var(--moss)" }}>ser Bragarmål</em> stemmen din.
              </h2>
              <p className="font-editor mt-6" style={{ color: "var(--ink-soft)" }}>
                Etter noen prøver bygger Bragarmål en analyse av tone og stil.
                Under er et faktisk eksempel — slik en profil kan se ut.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8 space-y-6">
              <div
                className="p-6 md:p-7"
                style={{ background: "var(--linen)", border: "1px solid var(--line)" }}
              >
                <div className="font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--rust)" }}>
                  TONE
                </div>
                <p className="mt-3 font-editor text-base md:text-lg leading-relaxed" style={{ color: "var(--ink)" }}>
                  Tonen er nær, anspent og observerende, med korte, avsluttende setninger som
                  skaper tempo og indre uro. Stemningen veksler mellom kontrollert ytre og
                  kollapset indre, med hint av mørk ironi i kontraster som «romantisk kveld»
                  mot konkurs.
                </p>
              </div>
              <div
                className="p-6 md:p-7"
                style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
              >
                <div className="font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--rust)" }}>
                  STIL
                </div>
                <p className="mt-3 font-editor text-base md:text-lg leading-relaxed" style={{ color: "var(--ink)" }}>
                  Setningene er korte, ofte brutale avbrudd av tankerekker. Forfatterens
                  grep er filmisk: sanselige detaljer (lukt, lyd, lys), fysiske reaksjoner
                  («armene ble tunge», «han drakk det som var igjen»), og tomme rom.
                  Ordvalget veksler mellom hverdagslig presisjon og mettet bildespråk.
                </p>
              </div>
              <p className="font-editor text-sm" style={{ color: "var(--ink-mute)" }}>
                Denne profilen brukes deretter når du sparrer med Bragarmål i Skrivepulten —
                slik at forslag speiler din rytme, ikke bare språkmodellens gjennomsnitt.
              </p>
            </div>
          </div>
        </section>

        {/* Testprompter — snakk naturlig, ikke maskinelt */}
        <section id="testprompter" className="mt-20 md:mt-24 scroll-mt-24">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="col-span-12 md:col-span-4">
              <div className="label-ui">Testprompter</div>
              <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
                Tre enkle måter å <em className="italic" style={{ color: "var(--moss)" }}>komme i gang</em>.
              </h2>
              <p className="font-editor mt-6" style={{ color: "var(--ink-soft)" }}>
                Disse tre prompt-ene viser forskjellen mellom å snakke naturlig og å prøve å være
                «korrekt». Bragarmål fungerer best når du <em>ikke</em> forsøker å være maskinell.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8 space-y-6">
              <TestPrompt
                number="01"
                title="Den mest ærlige"
                recommended
                intro="Skriv som jeg snakker."
                body="Jeg vil bare prøve å beskrive hvordan jeg har det akkurat nå, uten å pynte på det:"
                placeholder="[her skriver du fritt med egne ord]"
              />
              <TestPrompt
                number="02"
                title="Rytme-testen"
                intro="Jeg skal skrive noen setninger helt slik jeg vanligvis tenker og snakker."
                body="Ikke gjør språket mer pent eller mer korrekt. Bare speil rytmen min:"
                placeholder="[du skriver 4–6 setninger slik du faktisk snakker]"
              />
              <TestPrompt
                number="03"
                title="Når AI-en bommer"
                intro="Du bommet på det jeg mente forrige gang."
                body="Jeg skal forklare det på nytt med mine egne ord, og jeg vil at du svarer i samme tone og rytme som jeg bruker nå:"
                placeholder="[du skriver på nytt, mer naturlig]"
              />
              <p className="font-editor text-sm mt-2" style={{ color: "var(--ink-mute)" }}>
                Disse tre gjør det tydelig at AI-en fungerer best når du ikke prøver å være maskinell.
              </p>
            </div>
          </div>
        </section>

        {/* Temperatur — hva betyr det, og hvorfor bør du velge selv */}
        <section id="temperatur" className="mt-20 md:mt-24 scroll-mt-24">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="col-span-12 md:col-span-4">
              <div className="label-ui">Temperatur</div>
              <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
                Hvor <em className="italic" style={{ color: "var(--moss)" }}>forutsigbar</em> skal Bragarmål være?
              </h2>
              <p className="font-editor mt-6" style={{ color: "var(--ink-soft)" }}>
                Temperatur styrer hvor «trygg» eller «kreativ» AI-en er når den svarer.
                Du velger selv — det finnes ingen fasit. Prøv deg fram.
              </p>
              <p className="font-editor mt-4 text-sm" style={{ color: "var(--ink-mute)" }}>
                Bragarmål-anbefaling: hvis du vil ha svar som føles mer menneskelige og har mer
                naturlig rytme, trenger du ofte litt <em>høyere</em> temperatur. For lav gjør språket
                stivt. For høy kan gjøre det kaotisk.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8 space-y-6">
              <TempTier
                range="0.2 – 0.5"
                title="Lav"
                desc="AI-en blir forsiktig, stabil og «korrekt». Trygg, men kan føles flat og livløs."
              />
              <TempTier
                range="0.6 – 0.8"
                title="Middels"
                recommended
                desc="Balanse mellom kontroll og naturlig variasjon. Ofte det beste utgangspunktet for vanlig skrivearbeid."
              />
              <TempTier
                range="0.9 – 1.2"
                title="Høy"
                desc="Frekkere, mer uforutsigbar, mer kreativ. Får mer rytme og personlighet — men kan spore av."
              />

              <div className="mt-8 pt-6 hairline-t">
                <div className="label-ui mb-4">Eksempel · «Det er stille her inne i meg nå.»</div>
                <div className="space-y-4">
                  <div className="p-5" style={{ background: "var(--linen)", border: "1px solid var(--line)" }}>
                    <div className="font-mono-ui text-xs tracking-widest" style={{ color: "var(--ink-mute)" }}>
                      LAV TEMPERATUR (0.3)
                    </div>
                    <p className="mt-3 font-editor text-base md:text-lg italic" style={{ color: "var(--ink)" }}>
                      «Det høres ut som du er i en rolig og reflekterende tilstand.»
                    </p>
                  </div>
                  <div className="p-5" style={{ background: "var(--linen)", border: "1px solid var(--rust)" }}>
                    <div className="font-mono-ui text-xs tracking-widest" style={{ color: "var(--rust)" }}>
                      HØY TEMPERATUR (1.0)
                    </div>
                    <p className="mt-3 font-editor text-base md:text-lg italic" style={{ color: "var(--ink)" }}>
                      «Stille på den måten som ikke er fred, bare tomrom. Som om noe har gått ut av
                      rommet og etterlatt bare veggene.»
                    </p>
                  </div>
                </div>

                <div className="label-ui mt-8 mb-4">Eksempel · om å bære en fasade</div>
                <div className="space-y-4">
                  <div className="p-5" style={{ background: "var(--linen)", border: "1px solid var(--line)" }}>
                    <div className="font-mono-ui text-xs tracking-widest" style={{ color: "var(--ink-mute)" }}>
                      LAV TEMPERATUR (0.3)
                    </div>
                    <p className="mt-3 font-editor text-base md:text-lg italic" style={{ color: "var(--ink)" }}>
                      «Det høres ut som du er sliten av å holde fasaden. Det er forståelig å føle det slik.»
                    </p>
                  </div>
                  <div className="p-5" style={{ background: "var(--linen)", border: "1px solid var(--rust)" }}>
                    <div className="font-mono-ui text-xs tracking-widest" style={{ color: "var(--rust)" }}>
                      HØY TEMPERATUR (1.0)
                    </div>
                    <p className="mt-3 font-editor text-base md:text-lg italic" style={{ color: "var(--ink)" }}>
                      «Ja. Den der fasaden er tung å bære. Den sitter som et ekstra lag hud du aldri
                      ba om, og en dag bare sier kroppen nei.»
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
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

function TempTier({ range, title, desc, recommended }) {
  return (
    <div
      className="p-5 md:p-6 flex items-start gap-5 md:gap-6"
      style={{ background: "var(--paper)", border: `1px solid ${recommended ? "var(--moss)" : "var(--line)"}` }}
    >
      <div className="shrink-0 w-28">
        <div className="font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--ink-mute)" }}>{range}</div>
        <div className="font-serif-display text-xl mt-1" style={{ color: "var(--ink)" }}>{title}</div>
        {recommended && (
          <span
            className="mt-2 inline-block font-mono-ui text-[9px] tracking-widest px-1.5 py-0.5"
            style={{ background: "var(--moss)", color: "white" }}
          >
            ANBEFALT
          </span>
        )}
      </div>
      <p className="font-editor text-base leading-relaxed" style={{ color: "var(--ink-soft)" }}>{desc}</p>
    </div>
  );
}

function TestPrompt({ number, title, intro, body, placeholder, recommended }) {
  return (
    <div
      className="p-6 md:p-7"
      style={{ background: "var(--linen)", border: "1px solid var(--line)" }}
      data-testid={`testprompt-${number}`}
    >
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div className="flex items-baseline gap-3">
          <span className="font-mono-ui text-xs tracking-widest" style={{ color: "var(--moss)" }}>{number}</span>
          <h3 className="font-serif-display text-xl md:text-2xl" style={{ color: "var(--ink)" }}>{title}</h3>
        </div>
        {recommended && (
          <span
            className="font-mono-ui text-[10px] tracking-widest px-2 py-1"
            style={{ background: "var(--moss)", color: "white" }}
          >
            ANBEFALT FØRST
          </span>
        )}
      </div>
      <p className="mt-4 font-editor text-base md:text-lg" style={{ color: "var(--ink)" }}>
        {intro}
      </p>
      <p className="mt-2 font-editor text-base md:text-lg" style={{ color: "var(--ink-soft)" }}>
        {body}
      </p>
      <p className="mt-3 font-mono-ui text-xs tracking-wider" style={{ color: "var(--ink-mute)" }}>
        {placeholder}
      </p>
    </div>
  );
}
