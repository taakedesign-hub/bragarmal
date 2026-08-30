import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { ArrowLeft, ExternalLink, Info } from "lucide-react";
import InfoMenu from "@/components/InfoMenu";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import StatementBreak from "@/components/StatementBreak";

const SOURCES = [
  {
    title: "Den norske Forfatterforening",
    detail: "Vedtekter og regler knyttet til generativ KI og forfatterskap.",
    href: "https://forfatterforeningen.no/",
  },
  {
    title: "Den norske Forfatterforening — KI i bokbransjen",
    detail: "Om blant annet erfaringer med KI som redaksjonell sparringspartner.",
    href: "https://forfatterforeningen.no/",
  },
  {
    title: "Den norske Forleggerforening / NFFO",
    detail: "Normalkontrakter og protokoller om bruk av KI i utvikling og behandling av verk.",
    href: "https://forleggerforeningen.no/",
  },
  {
    title: "Den norske Forleggerforening / forfatterorganisasjonene",
    detail: "Avtaler og tillegg om opphavsrett, KI-bruk og vern av verk.",
    href: "https://forleggerforeningen.no/",
  },
  {
    title: "Fritt Ord",
    detail: "Perspektiver på kunstig intelligens, ytringsfrihet, journalistikk og menneskelig skapende arbeid.",
    href: "https://frittord.no/",
  },
];

export default function ManifestPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Seo
        title="Manifest — Bragarmål"
        description="Norsk skrivehjelp for mennesker som vil skrive selv. Hvor går grensen mellom menneske og maskin? Bragarmåls prinsipper og kilder."
        path="/manifest"
      />

      {/* Header */}
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
          <div className="flex items-center gap-3 md:gap-6">
            <InfoMenu align="right" />
            <Link to="/" className="label-ui inline-flex items-center gap-2">
              <ArrowLeft size={14} strokeWidth={1.5} /> Tilbake
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-[900px] mx-auto px-6 md:px-10 pt-14 md:pt-20 pb-8">
        <div className="label-ui">Manifest</div>
        <h1 className="font-serif-display text-4xl md:text-5xl lg:text-6xl font-light mt-3 leading-[1.1]" style={{ color: "var(--ink)" }}>
          Norsk skrivehjelp for mennesker som vil <em className="italic" style={{ color: "var(--rust)" }}>skrive selv</em>.
        </h1>

        {/* AI contribution notice */}
        <div
          className="mt-8 p-4 md:p-5 inline-flex items-start gap-3"
          style={{ background: "#fdfcf9", border: "1px solid var(--line)" }}
          data-testid="ai-contribution-notice"
        >
          <Info size={16} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: "var(--rust)" }} />
          <p className="font-editor text-sm md:text-base leading-relaxed" style={{ color: "var(--ink)" }}>
            <strong>AI har bidratt her.</strong> Denne manifest-siden er skrevet av Nina og bearbeidet
            i samarbeid med Bragarmål — som gjennomlesing, struktur og finpuss. Slik er også resten
            av tjenesten ment å brukes: mennesket skriver, maskinen sparrer.
          </p>
        </div>
      </section>

      {/* Body */}
      <article className="max-w-[720px] mx-auto px-6 md:px-10 font-editor text-lg leading-[1.85]" style={{ color: "var(--ink)" }}>
        <P>I tre år har jeg jobbet med den samme boka, skrevet, slettet, flyttet scener, begynt på nytt, mistet oversikten og funnet den igjen.</P>
        <P>Og jeg har hatt skrivesperre.</P>
        <P>Etter hvert innså jeg at jeg trengte hjelp, ikke noen som skulle skrive boka for meg, men noen som kunne lese den utenfra, se det jeg selv hadde stirret meg blind på og si fra når noe ikke fungerte.</P>
        <P>Jeg søkte profesjonell, menneskelig hjelp, men det ble for dyrt for meg.</P>
        <P>Så jeg begynte å se på hva AI kunne gjøre, og den kunne gjøre mye. Den kunne skrive om, rette, fortsette, gjøre språket glattere og få teksten til å flyte bedre.</P>
        <P>Men det var ikke det jeg trengte.</P>
        <P>Jeg ville ikke gi fra meg stemmen min og konseptet mitt til et program som ikke kunne vite hvorfor jeg hadde skrevet akkurat den setningen slik, hvorfor en karakter reagerte som hun gjorde, eller hvorfor noe litt skjevt i språket kanskje skulle få lov til å være skjevt.</P>
        <P>Jeg ville ha hjelp uten å gi fra meg forfatterskapet.</P>
        <P className="font-serif-display text-2xl md:text-3xl italic mt-10" style={{ color: "var(--rust)" }}>Derfor laget jeg Bragarmål.</P>

        <H2>Et manus er ikke bare data</H2>
        <P>Det er år med notater, halvferdige kapitler, tankespinn og ideer, tanker som ble skrevet klokka tre om natta, scener som ble kastet, og parkering på en bussholdeplass for å notere noe du absolutt ikke måtte glemme, selv om du allerede var sent ute til et bryllup.</P>
        <P>Et manus er arbeid som ikke alltid kan måles i antall ord, og når det vokser blir det vanskeligere å se alt. Det har i hvert fall vært en stor utfordring for meg, som kan være litt av et surrehue.</P>
        <P>Derfor skal du vite hva som skjer med det du legger inn, hva som lagres, hva som brukes til stemmeprofilen din, hva AI får tilgang til, og hva som ikke brukes til trening av AI-modeller.</P>
        <P>Kontrollen over teksten skal ligge hos deg.</P>
        <Pull>Ditt manus skal ikke være prisen du betaler for å få hjelp.</Pull>

        <H2>AI skal brukes der AI er nyttig</H2>
        <P>Jeg er ikke imot AI, Bragarmål bruker AI, men forskjellen ligger i hva vi ber den om å gjøre.</P>
        <P>Når et manus vokser kan Bragarmål hjelpe med å holde styr på karakterer, hendelser og sammenhenger, oppdage brudd, se endringer i tempo og stemme, finne gjentakelser og ting du selv har lest så mange ganger at du ikke lenger ser dem.</P>
        <P>Den kan lese langt mer på én gang enn jeg selv klarer å holde i hodet, sammenligne det som skjer nå med noe som skjedde mange kapitler tidligere, og stille spørsmål når ting ikke ser ut til å henge sammen.</P>
        <P>Ikke nødvendigvis for å gi deg svaret.</P>
        <P>Noen ganger trenger en forfatter først og fremst noen som oppdager spørsmålet.</P>
        <P>Bragarmål forsøker derfor å etablere et tydelig skille mellom menneske og maskin inne i selve arbeidsprosessen. Maskinen kan lese, huske, sammenligne og stille spørsmål, mens mennesket vurderer, velger og skriver.</P>

        <H2>Stemmen din er ikke en oppskrift</H2>
        <P>Bragarmål lærer å kjenne igjen hvordan du skriver, ikke for å lage en kopi av deg, men for å forstå hva som kjennetegner teksten din.</P>
        <P>Rytmen, setningene, ordvalget, det du gjør ofte, det du nesten aldri gjør, og kanskje det du gjør litt for mye.</P>
        <P>Når teksten plutselig avviker, skal ikke Bragarmåls første reaksjon være:</P>
        <P className="italic" style={{ color: "var(--ink-mute)" }}>Her er en bedre setning.</P>
        <P>Den bør heller være:</P>
        <P className="italic" style={{ color: "var(--rust)" }}>Her skjer det noe.</P>
        <P>For kanskje setningen din er bedre, kanskje den er akkurat slik fordi du ville ha den slik, og kanskje Bragarmål tar feil.</P>
        <P className="font-serif-display text-xl italic" style={{ color: "var(--ink)" }}>Det avgjør du.</P>
      </article>

      <StatementBreak kicker="Nina">
        Ikke alle har råd til en redaktør. Alle burde ha noen å teste mot.
      </StatementBreak>

      <article className="max-w-[720px] mx-auto px-6 md:px-10 font-editor text-lg leading-[1.85]" style={{ color: "var(--ink)" }}>
        <H2>Redaksjonell motstand skal ikke være forbeholdt dem som har råd</H2>
        <P>Bragarmål skal ikke erstatte en redaktør, menneskelig erfaring, skjønn og litterær forståelse betyr noe, og det kommer det fortsatt til å gjøre.</P>
        <P>Men alternativet for den som ikke har råd til profesjonell hjelp, bør heller ikke være å sitte helt alene.</P>
        <P>Jeg ønsker å gi flere mennesker tilgang til redaksjonell motstand før de kommer til redaktøren, et sted å prøve, rote, flytte og stryke, oppdage at yndlingsscenen kanskje ikke burde være med likevel, finne tråden man mistet for fem kapitler siden, eller stille spørsmål ved karakteren som plutselig gjør noe som ikke ligner henne.</P>
        <P>Kanskje er det akkurat det som skal til for å forstå hvorfor historien stopper opp, og komme videre på egen hånd.</P>

        <H2>Hvor går grensen?</H2>
        <P>Jeg har ikke lyst til å late som jeg alene sitter med svaret på hvor grensen mellom menneskelig skriving og kunstig intelligens skal gå.</P>
        <P>Det gjør heller ikke bokbransjen.</P>
        <P>Dette er spørsmål norske forfattere, forlag og organisasjoner arbeider med nå, og grensene kommer sannsynligvis til å utvikle seg sammen med teknologien.</P>
        <P>Men Bragarmål må ha en grense.</P>
        <P className="font-serif-display text-xl italic" style={{ color: "var(--rust)" }}>Og den skal være synlig.</P>
      </article>

      <StatementBreak kicker="Nina" dark>
        Det som avgjør er ikke om AI var involvert. Det er hva den fikk gjøre.
      </StatementBreak>

      <article className="max-w-[720px] mx-auto px-6 md:px-10 pb-24 font-editor text-lg leading-[1.85]" style={{ color: "var(--ink)" }}>
        <H2>Mennesket skal fortsatt være forfatteren</H2>
        <P>Den norske Forfatterforening har i 2026 tatt et tydelig standpunkt til generativ KI. Verk som i hovedsak er fremstilt med generativ KI kan ikke danne grunnlag for medlemskap, mens delvis bruk skal oppgis og vurderes skjønnsmessig.</P>
        <P>Det betyr ikke at all bruk av KI i skriveprosessen behandles likt.</P>
        <P>Norsk bokbransje diskuterer allerede KI brukt til blant annet analyse og redaksjonell sparring, og på Bokdagen i 2026 ble det presentert erfaringer med KI som sparringspartner på manus under trygge datadelingsforhold.</P>
        <P>For meg er det skillet interessant.</P>
        <P>Ikke om AI har vært i rommet.</P>
        <P className="font-serif-display text-xl italic" style={{ color: "var(--ink)" }}>Men hva AI gjorde mens den var der.</P>

        <H2>Åpenhet betyr noe</H2>
        <P>Forfatterorganisasjoner og forlag har allerede begynt å regulere bruk av KI gjennom avtaler og tillegg til normalkontrakter.</P>
        <P>For sakprosa er forfatter og forlag blant annet forpliktet til å informere hverandre om bruk av KI i fremstillingen av verket, og om senere bruk av det utgitte verket i KI-løsninger og tjenester.</P>
        <P>For oversettelser er grensene enda tydeligere, blant annet når det gjelder KI-bearbeiding og bruk av verk til trening av språkmodeller.</P>
        <P>Dette forteller meg noe viktig:</P>
        <P>Det holder ikke at et KI-verktøy sier at det er ansvarlig.</P>
        <P className="font-serif-display text-xl italic" style={{ color: "var(--rust)" }}>Vi må kunne forklare hva det faktisk gjør.</P>
        <P>Det prinsippet ønsker jeg å bygge inn i Bragarmål.</P>

        <H2>Hva betyr det i Bragarmål?</H2>
        <P>Bragarmål skal kunne analysere teksten din, holde styr på karakterer og hendelser, finne kontinuitetsbrudd og gjentakelser, sammenligne teksten med dine egne skriveprøver, se etter endringer i rytme, tempo og stemme, organisere et voksende manus og stille redaksjonelle spørsmål.</P>
        <P>Det kan foreslå retninger når du står fast, men målet skal ikke være å overta historien.</P>
        <P>Stemmeprofilen skal brukes til å kjenne deg igjen, ikke til å lage en kopi av deg.</P>
        <P>Og Bragarmål skal aldri bli et verktøy for å skjule AI-generert tekst og få den til å fremstå som menneskeskrevet.</P>
        <P>Hvis teknologien gjør det vanskeligere å svare på hvem som egentlig skrev boka, har vi beveget oss i feil retning.</P>

        <H2>Bragarmål foreslår. Du avgjør.</H2>
        <P>AI kan finne et brudd som viser seg å være helt tilsiktet.</P>
        <P>Den kan mene at en scene bør strammes inn når du vet at den trenger å få puste.</P>
        <P>Den kan tolke en karakter feil.</P>
        <P>Den kan ganske enkelt ta feil.</P>
        <P>Bragarmål skal derfor ikke presentere litterære vurderinger som fasit.</P>
        <P>Den skal vise deg hva den ser, hvorfor den reagerer, og gi vurderingen tilbake til deg.</P>
        <P className="font-serif-display text-xl italic" style={{ color: "var(--rust)" }}>Forfatteren skal fortsatt ha siste ord.</P>

        <H2>Målet</H2>
        <P>Jeg ønsker at Bragarmål etter hvert skal bli en norsk skrivehjelp man kan bruke med rak rygg, et verktøy norske forfattere kan bruke uten å måtte lure på om de samtidig har gitt fra seg forfatterskapet.</P>
        <P>Jeg håper også at Bragarmål kan være med på en større samtale om hvordan AI faktisk bør brukes i norsk skriving, ikke bare hva teknologien klarer å produsere.</P>
        <P>For det interessante spørsmålet er kanskje ikke hvor mye AI kan skrive.</P>
        <P>Det interessante er hvor mye den kan hjelpe mennesket med å skrive selv.</P>
        <P>At du til slutt skal kunne legge det ferdige manuset på bordet og si:</P>
        <P className="font-serif-display text-2xl md:text-3xl italic" style={{ color: "var(--ink)" }}>Dette skrev jeg.</P>
        <P>Ikke fordi AI aldri var i rommet, men fordi AI aldri fikk forfatterens plass.</P>

        <div className="mt-14 hairline-t pt-10">
          <p className="font-serif-display text-3xl md:text-4xl italic leading-snug" style={{ color: "var(--ink)" }}>
            Mennesket skriver. <span style={{ color: "var(--rust)" }}>Bragarmål sparrer.</span>
          </p>
          <p className="mt-6 label-ui" style={{ color: "var(--ink-mute)" }}>— Nina</p>
        </div>
      </article>

      {/* Sources */}
      <section className="hairline-t" data-testid="manifest-sources">
        <div className="max-w-[900px] mx-auto px-6 md:px-10 py-14 md:py-20">
          <div className="label-ui" style={{ color: "var(--rust)" }}>Kilder og retningslinjer</div>
          <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
            Bragarmål følger utviklingen.
          </h2>
          <p className="mt-4 font-editor text-base leading-relaxed max-w-[62ch]" style={{ color: "var(--ink-soft)" }}>
            Vi følger utviklingen i norsk bokbransje og vil oppdatere denne siden når avtaler,
            retningslinjer og praksis endres.
          </p>

          <ol className="mt-10">
            {SOURCES.map((s, i) => (
              <li key={s.title} className="hairline-t py-6 grid grid-cols-12 gap-4" data-testid={`manifest-source-${i + 1}`}>
                <div className="col-span-12 md:col-span-1 font-mono-ui text-xs tracking-widest" style={{ color: "var(--rust)" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="col-span-12 md:col-span-11">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif-display text-xl md:text-2xl leading-snug inline-flex items-center gap-2 hover:underline underline-offset-4"
                    style={{ color: "var(--ink)" }}
                  >
                    {s.title}
                    <ExternalLink size={14} strokeWidth={1.5} style={{ color: "var(--rust)" }} />
                  </a>
                  <p className="mt-2 font-editor text-base" style={{ color: "var(--ink-soft)" }}>
                    {s.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-10 hairline-t pt-6 font-editor text-sm italic" style={{ color: "var(--ink-mute)" }}>
            Sist faglig gjennomgått: august 2026.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="hairline-t">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-14 text-center">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/etikk" className="btn-ghost inline-flex items-center gap-2">
              Les etikk-siden →
            </Link>
            <Link to="/" className="btn-primary inline-flex items-center gap-3">
              Tilbake til forsiden
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ─────────── Sub-components ─────────── */

function H2({ children }) {
  return (
    <h2 className="font-serif-display text-2xl md:text-3xl font-light mt-14 leading-snug" style={{ color: "var(--ink)" }}>
      {children}
    </h2>
  );
}

function P({ children, className = "", style }) {
  return <p className={`mt-5 ${className}`} style={style}>{children}</p>;
}

function Pull({ children }) {
  return (
    <p
      className="mt-8 pl-5 py-2 font-serif-display text-xl md:text-2xl italic leading-snug"
      style={{ color: "var(--ink)", borderLeft: "2px solid var(--rust)" }}
    >
      {children}
    </p>
  );
}
