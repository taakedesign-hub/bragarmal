import {
  Lightbulb,
  ExternalLink,
  Coins,
  MapPin,
  Search,
  BookOpen,
  Mail,
  Layers,
  Compass,
  Clock,
  Send,
  ListOrdered,
  Grid3x3,
  Map as MapIcon,
  FileText,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import Seo from "@/components/Seo";

/* ─────────────────────────────  TIP 01 — STIPEND  ───────────────────────────── */

const STIPEND_ORGS = [
  {
    n: "01",
    name: "Forfatterforbundets vederlagsfond",
    points: [
      "Åpent for alle som skriver skjønnlitteratur for voksne (krim passer perfekt).",
      "Du trenger ikke være medlem.",
      "Deler ut arbeidsstipend på 3, 6 eller 12 måneder.",
      "Frist vanligvis tidlig på året — sjekk aktuell utlysning.",
    ],
  },
  {
    n: "02",
    name: "Den norske Forfatterforening (DnF)",
    points: [
      "Flere stipendordninger som er åpne også for ikke-medlemmer.",
      "Noen krever utgitte bøker, andre ikke.",
      "Sjekk deres stipendfond og vederlagsfond.",
    ],
  },
  {
    n: "03",
    name: "Norske barne- og ungdomsbokforfattere (NBU)",
    points: [
      "Har egne stipend for barne- og ungdomslitteratur.",
      "Noen er åpne uten medlemskap, men mange krever at du har gitt ut minst én bok.",
      "Verdt å sjekke likevel.",
    ],
  },
  {
    n: "04",
    name: "Norsk faglitterær forfatter- og oversetterforening (NFFO)",
    points: [
      "Har debutantstipend for dem som ikke har gitt ut sakprosa før.",
      "Mindre relevant hvis du skriver ren skjønnlitteratur/krim, men greit å vite om.",
    ],
  },
  {
    n: "05",
    name: "Private legater via Stipendportalen og Legathåndboken",
    points: [
      "Mange mindre legater støtter forfattere i etableringsfasen, barnebøker, skjønnlitteratur, lokale forfattere og kvinner som skriver.",
      "Legathåndboken 2026 er den mest komplette oversikten over alle legater i Norge. Den kommer ut hvert år og er verdt å kjøpe eller låne på biblioteket.",
    ],
  },
];

const STIPEND_PRACTICAL = [
  {
    icon: <Search size={16} strokeWidth={1.5} />,
    text: (
      <>
        Start med å søke på{" "}
        <a
          href="https://stipendportalen.no"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-1 underline-offset-4"
          style={{ color: "var(--moss)" }}
          data-testid="tips-stipendportalen-link"
        >
          Stipendportalen.no
          <ExternalLink size={12} strokeWidth={1.5} className="inline ml-1 -mt-0.5" />
        </a>{" "}
        med ord som <em className="italic">«forfatter»</em>,{" "}
        <em className="italic">«skjønnlitteratur»</em>,{" "}
        <em className="italic">«barnebok»</em> og{" "}
        <em className="italic">«debutant»</em>.
      </>
    ),
  },
  {
    icon: <Coins size={16} strokeWidth={1.5} />,
    text: (
      <>
        Mange legater har lave beløp (<strong>10–50 000 kr</strong>), men det er lettere å få enn de
        store statlige stipendene.
      </>
    ),
  },
  {
    icon: <MapPin size={16} strokeWidth={1.5} />,
    text: (
      <>
        Noen legater prioriterer dem som bor i bestemte <strong>fylker eller kommuner</strong> —
        sjekk derfor lokale muligheter der du bor.
      </>
    ),
  },
  {
    icon: <BookOpen size={16} strokeWidth={1.5} />,
    text: (
      <>
        <strong>Gyldendalstipendet</strong> er spesielt for underrepresenterte stemmer — sjekk om
        det passer deg.
      </>
    ),
  },
];

/* ─────────────────────────────  TIP 02 — KONTAKTE FORLAG  ───────────────────────────── */

const FORLAG_STEPS = [
  {
    icon: <Search size={16} strokeWidth={1.5} />,
    title: "Undersøk forlaget først",
    body:
      "Passer bøkene forlaget gir ut til det du skriver? Ikke send krim til et forlag som bare gir ut lyrikk. Bla i katalogen deres, se hvem de har gitt ut de siste to årene, og hvilke redaktører som står bak.",
  },
  {
    icon: <ListOrdered size={16} strokeWidth={1.5} />,
    title: "Følg innsendingsrutinene",
    body:
      "Hvert forlag har egne rutiner (finnes på nettsiden). Vanligvis: kort synopsis + 1–3 kapittelutkast + forfatterpresentasjon. Send akkurat det de ber om — ikke mer, ikke mindre.",
  },
  {
    icon: <Send size={16} strokeWidth={1.5} />,
    title: "Skriv et profesjonelt følgebrev",
    body:
      "Kort, konkret, ærlig. Hvem er du, hva har du skrevet, hvorfor akkurat dette forlaget. Én side maks. Ikke prøv å være morsom — vær presis.",
  },
  {
    icon: <Clock size={16} strokeWidth={1.5} />,
    title: "Regn med lang ventetid",
    body:
      "3–6 måneder er normalt. Ikke purr før det har gått minst tre måneder, og gjør det da høflig i én e-post — ikke flere.",
  },
  {
    icon: <Mail size={16} strokeWidth={1.5} />,
    title: "Sjekk om eksklusivitet kreves",
    body:
      "Noen forlag krever at manuset ikke er sendt andre steder samtidig. Andre godtar parallelle innsendinger. Les vilkårene før du sender ut bredt.",
  },
  {
    icon: <Compass size={16} strokeWidth={1.5} />,
    title: "Ta avslag konstruktivt",
    body:
      "De fleste forfattere får mange avslag før første ja. Be om tilbakemelding når du kan — noen redaktører gir det, mange gjør det ikke. Bruk det som kommer.",
  },
];

const FORLAG_BIG = [
  {
    name: "Cappelen Damm",
    how: "E-post eller nettskjema",
    genres: "Skjønnlitteratur, barn/ungdom, sakprosa",
    note: "Flere adresser avhengig av sjanger",
  },
  {
    name: "Gyldendal",
    how: "Kun nettskjema på gyldendal.no",
    genres: "Skjønnlitteratur, barnebøker, sakprosa, faktabøker",
    note: "Tar ikke imot e-post eller papir",
  },
  {
    name: "Aschehoug",
    how: "E-post",
    genres: "Skjønnlitteratur, barn/ungdom, sakprosa",
    note: "Separate adresser for ulike redaksjoner",
  },
  {
    name: "Vigmostad & Bjørke",
    how: "E-post",
    genres: "Skjønnlitteratur, barn/ungdom, sakprosa",
    note: "Åpent for de fleste sjangre",
  },
  {
    name: "Bonnier Forlag",
    how: "E-post",
    genres: "Skjønnlitteratur, feelgood, fantasy, sakprosa",
    note: "Tar for tiden ikke imot barnebokmanus",
  },
  {
    name: "Samlaget",
    how: "E-post",
    genres: "Skjønnlitteratur, barn/ungdom, sakprosa",
    note: "Kun nynorsk",
  },
];

const FORLAG_OTHER = [
  { name: "Omnipax", note: "Barne- og ungdomslitteratur" },
  { name: "Flamme Forlag", note: "Del av Cappelen Damm" },
  { name: "Solum Bokvennen", note: null },
  { name: "Forlagshuset Publica", note: null },
  { name: "Bokhuset Forlag", note: null },
  { name: "Kagge Forlag", note: "Sjekk aktuelle retningslinjer" },
  { name: "Magikon Forlag", note: "Spesielt bildebøker" },
  { name: "Flux Forlag", note: "Sakprosa" },
  { name: "Efrem Forlag", note: null },
];

const FORLAG_KEYPOINTS = [
  <><strong>Alltid sjekk forlagets nettside</strong> før du sender. Retningslinjer endres.</>,
  <>De fleste vil ha <strong>Word eller PDF</strong>.</>,
  <>Mange ønsker <strong>fullt manus</strong> (spesielt skjønnlitteratur). For sakprosa godtas ofte prosjektbeskrivelse + prøvekapittel.</>,
  <>Svarstid er vanligvis <strong>4–12 uker</strong>.</>,
  <>Svært få manus blir antatt — <strong>ofte under 1 %</strong>.</>,
];

const FORLAG_PRACTICAL = [
  {
    icon: <BookOpen size={16} strokeWidth={1.5} />,
    text: (
      <>
        <strong>Start med forlag som faktisk utgir den typen bøker du har skrevet.</strong>{" "}
        Se på katalogen deres og sjekk om de har gitt ut lignende titler de siste årene.
      </>
    ),
  },
  {
    icon: <ExternalLink size={16} strokeWidth={1.5} />,
    text: (
      <>
        Nesten alle norske forlag har egen{" "}
        <em className="italic">«manuskript til vurdering»</em>-side. Google forlagsnavn + «manuskript».
      </>
    ),
  },
  {
    icon: <Layers size={16} strokeWidth={1.5} />,
    text: (
      <>
        Skrivekurs, tekstverksteder og litteraturfestivaler er gode arenaer for å bli kjent med
        redaktører uformelt. Norsk barnebokinstitutt, Norsk Forfattersentrum og festivaler som
        Kapittel, Lillehammer og Bjørnsonfestivalen er verdt å følge med på.
      </>
    ),
  },
  {
    icon: <Compass size={16} strokeWidth={1.5} />,
    text: (
      <>
        Vurder <strong>litterær agent</strong> hvis du sikter mot internasjonale rettigheter — men det
        er sjelden nødvendig for norsk debut.
      </>
    ),
  },
];

/* ─────────────────────────────  TIP 03 — DISPOSISJON  ───────────────────────────── */

const DISPOSISJON_METHODS = [
  {
    n: "01",
    name: "Snøflakmetoden",
    author: "Randy Ingermanson",
    body:
      "Start med én setning som beskriver hele boka. Utvid den til et avsnitt. Så til én side per hovedkarakter. Så til en scene-liste. Bygg boka lag for lag — som en snøflak vokser fra sentrum og ut.",
  },
  {
    n: "02",
    name: "Save the Cat / Beat Sheet",
    author: "Blake Snyder",
    body:
      "Femten faste vendepunkter (beats) fordelt over boka: åpningsbilde, katalysator, debatt, midtpunkt, alt-er-tapt, finale. Opprinnelig for film, men brukes tungt i kommersiell skjønnlitteratur — særlig thriller og krim.",
  },
  {
    n: "03",
    name: "Tre-aktsstrukturen",
    author: "Klassisk dramateori",
    body:
      "Anslag (25%): sett opp verden, karakter, konflikt. Oppbygging (50%): eskalering, komplikasjoner, midtvending. Klimaks (25%): konfrontasjon og oppløsning. Enkelt, robust, fungerer for de fleste sjangre.",
  },
  {
    n: "04",
    name: "Heltens reise",
    author: "Joseph Campbell / Christopher Vogler",
    body:
      "Tolv trinn fra kall til hjemkomst. Kraftig for mytisk fortelling og karakterreise, men kan gjøre plottet forutsigbart hvis du følger det slavisk. Bruk som sjekkliste, ikke oppskrift.",
  },
  {
    n: "05",
    name: "Kortstokk-metoden",
    author: "Praktisk teknikk",
    body:
      "Skriv én scene per kort — enten fysiske indeksekort eller digitale kort i et verktøy. Legg dem på et bord. Omorganiser fritt. Perfekt hvis du tenker visuelt eller sitter fast i lineær tenkning.",
  },
  {
    n: "06",
    name: "Skjelett-utkast",
    author: "Rask førsteoversikt",
    body:
      "Skriv hele boka som svært korte oppsummeringer — 1–2 setninger per kapittel — før du skriver detaljert. Da ser du hull, tempoproblemer og gjentakelser før du har brukt hundrevis av timer på å skrive dem ut.",
  },
];

const DISPOSISJON_PRACTICAL = [
  {
    icon: <Layers size={16} strokeWidth={1.5} />,
    text: (
      <>
        <strong>Kombinér metoder.</strong> Bruk gjerne én metode for plott (f.eks. tre-akts) og en
        annen for karakterer (f.eks. snøflak). Ingen enkelt metode dekker alt.
      </>
    ),
  },
  {
    icon: <Compass size={16} strokeWidth={1.5} />,
    text: (
      <>
        Vet hva som passer deg: <strong>«planner»</strong> (grundig disponering før du skriver) eller{" "}
        <strong>«pantser»</strong> (skriver seg fram og oppdager plottet underveis). Begge er
        gyldige — men du taper tid hvis du prøver å være den du ikke er.
      </>
    ),
  },
  {
    icon: <Clock size={16} strokeWidth={1.5} />,
    text: (
      <>
        <strong>Ikke bruk mer tid på disposisjon enn på skriving.</strong> Disposisjon er et verktøy,
        ikke et prokrastineringsprosjekt. Sett en tidsramme.
      </>
    ),
  },
  {
    icon: <Grid3x3 size={16} strokeWidth={1.5} />,
    text: (
      <>
        Test ut i <strong>Manuskript-modulen</strong> i Bragarmål — scener kan flyttes fritt, POV og
        status noteres, og du beholder oversikten uten å miste tak i detaljene.
      </>
    ),
  },
];

/* ─────────────────────────────  TIP 04 — FØLGEBREV  ───────────────────────────── */

const FOLGEBREV_PRINCIPLES = [
  "Kort — helst under en halv side.",
  "Konkret.",
  "Ryddig og profesjonelt.",
  "Fokusert på boka, ikke på deg.",
];

const FOLGEBREV_STRUCTURE = [
  {
    n: "01",
    title: "Åpning",
    body: "Si rett ut hva du sender.",
    example: "«Jeg sender hermed manuset til [sjanger + tittel] for vurdering.»",
  },
  {
    n: "02",
    title: "Kort om boka",
    body:
      "Fortell hva boka handler om, hvem den er skrevet for, og hva som gjør den interessant. Vær konkret, ikke generelt lovprisende. Unngå formuleringer som «en magisk fortelling om vennskap og mot». Si heller hva som faktisk skjer, hvilken alder den er ment for, og hva som er særegent ved den.",
  },
  {
    n: "03",
    title: "Hvorfor dette forlaget",
    body: "Vis at du har sett litt på utgivelsesprofilen deres. Én eller to setninger er nok.",
  },
  {
    n: "04",
    title: "Kort om deg",
    body:
      "Bare det som er relevant for boka. Ingen lang bakgrunnshistorie, ingen unødvendige detaljer om livssituasjon eller tidligere erfaringer som ikke har direkte betydning.",
  },
  {
    n: "05",
    title: "Avslutning",
    body: "Hold det enkelt.",
    example:
      "«Manuset følger vedlagt som Word/PDF.\nJeg hører gjerne fra dere.\n\nMed vennlig hilsen\n[Navn]\n[Telefon]\n[E-post]»",
  },
];

const FOLGEBREV_PITFALLS = [
  "Lange selvbiografier.",
  "Overdreven entusiasme («dette er en bok alle vil elske»).",
  "Humor eller selvironi som ikke treffer.",
  "Sammenligninger med kjente forfattere.",
  "Å forklare hvorfor du trenger å bli utgitt.",
  "Generiske brev som tydelig er sendt til mange forlag uten tilpasning.",
];

/* ─────────────────────────────  PAGE  ───────────────────────────── */

export default function TipsPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-12 md:py-16">
      <Seo title="Tips — Bragarmål" description="Praktiske råd for forfattere: stipend, forlagskontakt, disposisjon og følgebrev." />

      <div className="fade-in">
        <div className="label-ui inline-flex items-center gap-2">
          <Lightbulb size={14} strokeWidth={1.5} />
          Tips til forfattere
        </div>
        <h1 className="font-serif-display text-5xl md:text-6xl font-light mt-3" style={{ color: "var(--ink)" }}>
          Praktiske råd, <em className="italic" style={{ color: "var(--moss)" }}>samlet på ett sted</em>.
        </h1>
        <p className="font-editor text-lg mt-4 max-w-[62ch]" style={{ color: "var(--ink-soft)" }}>
          Ting som er nyttige å vite når du skriver.
        </p>
      </div>

      {/* Innholdsfortegnelse */}
      <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-2 label-ui" style={{ color: "var(--ink-mute)" }} data-testid="tips-toc">
        <span style={{ color: "var(--rust)" }}>Innhold:</span>
        <a href="#stipend" className="hover:underline" style={{ color: "var(--ink)" }}>01 · Stipend</a>
        <a href="#forlag" className="hover:underline" style={{ color: "var(--ink)" }}>02 · Kontakte forlagene</a>
        <a href="#disposisjon" className="hover:underline" style={{ color: "var(--ink)" }}>03 · Disposisjonsteknikker</a>
        <a href="#folgebrev" className="hover:underline" style={{ color: "var(--ink)" }}>04 · Følgebrev</a>
      </nav>

      {/* ────── TIP 01 — STIPEND ────── */}
      <section id="stipend" className="mt-16 scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12" data-testid="tip-stipend">
        <div className="lg:col-span-4">
          <TipHeader
            n="01"
            tag="Økonomi"
            icon={<Coins size={20} strokeWidth={1.4} />}
            title="Stipend for forfattere"
            subtitle="En oversikt over de viktigste ordningene — og hvordan du kan finne midler du faktisk kan få."
          />
        </div>
        <div className="lg:col-span-8">
          <div className="label-ui" style={{ color: "var(--moss)" }}>Fem steder å se</div>
          <ol className="mt-4">
            {STIPEND_ORGS.map((org) => (
              <li key={org.n} className="hairline-t py-6" data-testid={`stipend-org-${org.n}`}>
                <div className="flex items-baseline gap-3">
                  <div className="font-mono-ui text-xs tracking-widest" style={{ color: "var(--rust)" }}>{org.n}</div>
                  <h3 className="font-serif-display text-xl md:text-2xl leading-snug" style={{ color: "var(--ink)" }}>
                    {org.name}
                  </h3>
                </div>
                <ul className="mt-3 font-editor text-base leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  {org.points.map((p, i) => (
                    <li key={i} className="pl-4 relative mt-2">
                      <span className="absolute left-0" style={{ color: "var(--moss)" }}>—</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <PracticalList items={STIPEND_PRACTICAL} />
          <Aside>
            En god søknad handler like mye om å vise hvem du er som forfatter, som å beskrive prosjektet.
            Bruk gjerne Bragarmål til å skrive utkast i din egen stemme — så teksten låter som deg,
            ikke som en søknadsmal.
          </Aside>
        </div>
      </section>

      {/* ────── TIP 02 — KONTAKTE FORLAG ────── */}
      <section id="forlag" className="mt-24 scroll-mt-24 hairline-t pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12" data-testid="tip-forlag">
        <div className="lg:col-span-4">
          <TipHeader
            n="02"
            tag="Innsending"
            icon={<Mail size={20} strokeWidth={1.4} />}
            title="Hvordan kontakte forlagene"
            subtitle="Prosessen fra ferdig utkast til redaktørens innboks — uten å tabbe deg ut."
          />
        </div>
        <div className="lg:col-span-8">
          <div className="label-ui" style={{ color: "var(--moss)" }}>Seks trinn</div>
          <ol className="mt-4">
            {FORLAG_STEPS.map((s, i) => (
              <li key={i} className="hairline-t py-6" data-testid={`forlag-step-${i + 1}`}>
                <div className="flex items-center gap-3">
                  <div className="font-mono-ui text-xs tracking-widest" style={{ color: "var(--rust)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <span style={{ color: "var(--moss)" }}>{s.icon}</span>
                  <h3 className="font-serif-display text-xl md:text-2xl leading-snug" style={{ color: "var(--ink)" }}>
                    {s.title}
                  </h3>
                </div>
                <p className="mt-3 font-editor text-base leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  {s.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-10 hairline-t pt-8">
            <div className="label-ui" style={{ color: "var(--moss)" }}>De største forlagene</div>
            <p className="mt-3 font-editor text-sm" style={{ color: "var(--ink-soft)" }}>
              Tradisjonelle forlag som tar imot uoppfordrede innsendinger — uten at forfatter må betale.
            </p>

            {/* Tabellen: desktop-visning */}
            <div className="mt-5 hidden md:block">
              <div className="grid grid-cols-12 gap-4 pb-3 hairline-b label-ui" style={{ color: "var(--ink-mute)" }}>
                <div className="col-span-3">Forlag</div>
                <div className="col-span-3">Hvordan sende</div>
                <div className="col-span-3">Sjangre</div>
                <div className="col-span-3">Merknad</div>
              </div>
              {FORLAG_BIG.map((f) => (
                <div key={f.name} className="grid grid-cols-12 gap-4 py-4 hairline-b font-editor text-sm" data-testid={`forlag-big-${f.name}`}>
                  <div className="col-span-3 font-serif-display text-lg leading-tight" style={{ color: "var(--ink)" }}>{f.name}</div>
                  <div className="col-span-3" style={{ color: "var(--ink)" }}>{f.how}</div>
                  <div className="col-span-3" style={{ color: "var(--ink-soft)" }}>{f.genres}</div>
                  <div className="col-span-3 italic" style={{ color: "var(--ink-soft)" }}>{f.note}</div>
                </div>
              ))}
            </div>

            {/* Mobilvisning: stablet */}
            <div className="mt-5 md:hidden">
              {FORLAG_BIG.map((f) => (
                <div key={f.name} className="py-5 hairline-b" data-testid={`forlag-big-m-${f.name}`}>
                  <div className="font-serif-display text-xl" style={{ color: "var(--ink)" }}>{f.name}</div>
                  <dl className="mt-3 font-editor text-sm space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <dt className="label-ui" style={{ color: "var(--ink-mute)" }}>Sende</dt>
                      <dd className="col-span-2" style={{ color: "var(--ink)" }}>{f.how}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <dt className="label-ui" style={{ color: "var(--ink-mute)" }}>Sjangre</dt>
                      <dd className="col-span-2" style={{ color: "var(--ink-soft)" }}>{f.genres}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <dt className="label-ui" style={{ color: "var(--ink-mute)" }}>Merknad</dt>
                      <dd className="col-span-2 italic" style={{ color: "var(--ink-soft)" }}>{f.note}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 hairline-t pt-8">
            <div className="label-ui" style={{ color: "var(--moss)" }}>Andre forlag som tar imot manus</div>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {FORLAG_OTHER.map((f) => (
                <li key={f.name} className="font-editor text-base flex items-baseline gap-2" data-testid={`forlag-other-${f.name}`}>
                  <span className="shrink-0" style={{ color: "var(--moss)" }}>—</span>
                  <span>
                    <strong style={{ color: "var(--ink)" }}>{f.name}</strong>
                    {f.note && <span style={{ color: "var(--ink-soft)" }}> · {f.note}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 hairline-t pt-8">
            <div className="label-ui" style={{ color: "var(--moss)" }}>Viktige punkter</div>
            <ul className="mt-4 space-y-3">
              {FORLAG_KEYPOINTS.map((p, i) => (
                <li key={i} className="flex items-start gap-3 font-editor text-base leading-relaxed" style={{ color: "var(--ink)" }}>
                  <span className="mt-2 shrink-0 inline-block w-1.5 h-1.5" style={{ background: "var(--rust)" }} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <PracticalList items={FORLAG_PRACTICAL} />
          <Aside>
            Følgebrevet er der du oftest snubler. Ikke send AI-genererte følgebrev til redaktører —
            de gjenkjenner tonefallet umiddelbart. Bruk Bragarmål til å skrive utkastet i din egen
            stemme, og la det være ærlig framfor perfekt.
          </Aside>
        </div>
      </section>

      {/* ────── TIP 03 — DISPOSISJON ────── */}
      <section id="disposisjon" className="mt-24 scroll-mt-24 hairline-t pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12" data-testid="tip-disposisjon">
        <div className="lg:col-span-4">
          <TipHeader
            n="03"
            tag="Struktur"
            icon={<MapIcon size={20} strokeWidth={1.4} />}
            title="Disposisjonsteknikker"
            subtitle="Seks måter å strukturere en bok på — og hvordan du velger den som passer måten du tenker på."
          />
        </div>
        <div className="lg:col-span-8">
          <div className="label-ui" style={{ color: "var(--moss)" }}>Seks metoder</div>
          <ol className="mt-4">
            {DISPOSISJON_METHODS.map((m) => (
              <li key={m.n} className="hairline-t py-6" data-testid={`disposisjon-method-${m.n}`}>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <div className="font-mono-ui text-xs tracking-widest" style={{ color: "var(--rust)" }}>{m.n}</div>
                  <h3 className="font-serif-display text-xl md:text-2xl leading-snug" style={{ color: "var(--ink)" }}>
                    {m.name}
                  </h3>
                  <span className="label-ui" style={{ color: "var(--ink-mute)" }}>· {m.author}</span>
                </div>
                <p className="mt-3 font-editor text-base leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  {m.body}
                </p>
              </li>
            ))}
          </ol>
          <PracticalList items={DISPOSISJON_PRACTICAL} />
          <Aside>
            Disposisjon er ikke fasit — det er stillas. Rive det ned når det er reist, hvis det stenger
            for teksten. Poenget er å komme videre, ikke å ha den peneste planen.
          </Aside>
        </div>
      </section>

      {/* ────── TIP 04 — FØLGEBREV ────── */}
      <section id="folgebrev" className="mt-24 scroll-mt-24 hairline-t pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12" data-testid="tip-folgebrev">
        <div className="lg:col-span-4">
          <TipHeader
            n="04"
            tag="Innsending"
            icon={<FileText size={20} strokeWidth={1.4} />}
            title="Forslag til følgebrev"
            subtitle="Slik skriver du et brev en travel redaktør faktisk leser — kort, konkret og saklig."
          />
        </div>
        <div className="lg:col-span-8">
          {/* Grunnregelen */}
          <div className="label-ui" style={{ color: "var(--moss)" }}>Grunnregelen</div>
          <p className="mt-3 font-editor text-base leading-relaxed" style={{ color: "var(--ink)" }}>
            Forlagene får svært mange manus. De fleste følgebrev blir skumlest på under et minutt.
            Hvis brevet er langt, uklart eller for personlig, mister det fort interessen.
          </p>
          <p className="mt-4 font-editor text-base leading-relaxed" style={{ color: "var(--ink-soft)" }}>
            Et godt følgebrev er:
          </p>
          <ul className="mt-3 space-y-2">
            {FOLGEBREV_PRINCIPLES.map((p, i) => (
              <li key={i} className="pl-5 relative font-editor text-base" style={{ color: "var(--ink)" }} data-testid={`folgebrev-principle-${i + 1}`}>
                <span className="absolute left-0" style={{ color: "var(--moss)" }}>—</span>
                {p}
              </li>
            ))}
          </ul>

          {/* Anbefalt struktur */}
          <div className="mt-10 hairline-t pt-8">
            <div className="label-ui" style={{ color: "var(--moss)" }}>Anbefalt struktur</div>
            <ol className="mt-4">
              {FOLGEBREV_STRUCTURE.map((s) => (
                <li key={s.n} className="hairline-t py-6" data-testid={`folgebrev-step-${s.n}`}>
                  <div className="flex items-baseline gap-3">
                    <div className="font-mono-ui text-xs tracking-widest" style={{ color: "var(--rust)" }}>{s.n}</div>
                    <h3 className="font-serif-display text-xl md:text-2xl leading-snug" style={{ color: "var(--ink)" }}>
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-3 font-editor text-base leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                    {s.body}
                  </p>
                  {s.example && (
                    <pre
                      className="mt-4 p-4 md:p-5 font-editor text-sm md:text-base leading-relaxed whitespace-pre-wrap"
                      style={{
                        background: "var(--bg-alt, #faf7f1)",
                        borderLeft: "2px solid var(--rust)",
                        color: "var(--ink)",
                        fontStyle: "italic",
                      }}
                      data-testid={`folgebrev-example-${s.n}`}
                    >
                      {s.example}
                    </pre>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* Ting som svekker */}
          <div className="mt-10 hairline-t pt-8">
            <div className="label-ui inline-flex items-center gap-2" style={{ color: "var(--rust)" }}>
              <AlertTriangle size={14} strokeWidth={1.5} />
              Ting som svekker brevet
            </div>
            <ul className="mt-4 space-y-3">
              {FOLGEBREV_PITFALLS.map((p, i) => (
                <li key={i} className="flex items-start gap-3 font-editor text-base leading-relaxed" style={{ color: "var(--ink)" }} data-testid={`folgebrev-pitfall-${i + 1}`}>
                  <span className="mt-2 shrink-0 inline-block w-1.5 h-1.5" style={{ background: "var(--rust)" }} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tone */}
          <div className="mt-10 hairline-t pt-8">
            <div className="label-ui inline-flex items-center gap-2" style={{ color: "var(--moss)" }}>
              <MessageSquare size={14} strokeWidth={1.5} />
              Tone
            </div>
            <p className="mt-3 font-editor text-base leading-relaxed" style={{ color: "var(--ink)" }}>
              Skriv klart, rolig og saklig. Det skaper mer tillit enn forsøk på å imponere.
            </p>
          </div>

          <Aside>
            Følgebrev er der stemmen din blir mest naken. Skriv utkastet selv — la Bragarmål eventuelt
            hjelpe deg med å stramme det inn i din egen tone. Ikke la AI skrive brevet fra bunnen av;
            redaktører gjenkjenner en AI-tone på sekunder.
          </Aside>
        </div>
      </section>

      <div className="mt-20 hairline-t pt-10 font-editor text-sm italic" style={{ color: "var(--ink-mute)" }}>
        Flere tips kommer. Har du noe du synes andre forfattere burde vite?{" "}
        <a
          href="mailto:hei@bragarmål.no?subject=Tips%20til%20Bragarmål"
          className="underline decoration-1 underline-offset-4"
          style={{ color: "var(--moss)" }}
          data-testid="tips-send-suggestion"
        >
          Send det inn
        </a>
        .
      </div>
    </div>
  );
}

/* ─────────────────────────────  Sub-components  ───────────────────────────── */

function TipHeader({ n, tag, icon, title, subtitle }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="font-mono-ui text-xs tracking-widest" style={{ color: "var(--rust)" }}>{n}</div>
        <div className="label-ui" style={{ color: "var(--ink-mute)" }}>{tag}</div>
      </div>
      <div className="mt-4 inline-flex items-center gap-3" style={{ color: "var(--moss)" }}>{icon}</div>
      <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-3 leading-tight" style={{ color: "var(--ink)" }}>
        {title}
      </h2>
      <p className="font-editor text-base mt-4" style={{ color: "var(--ink-soft)" }}>{subtitle}</p>
    </div>
  );
}

function PracticalList({ items }) {
  return (
    <div className="mt-10 hairline-t pt-8">
      <div className="label-ui" style={{ color: "var(--moss)" }}>Praktiske råd</div>
      <ul className="mt-4 space-y-4">
        {items.map((p, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-1 shrink-0" style={{ color: "var(--moss)" }}>{p.icon}</span>
            <div className="font-editor text-base leading-relaxed" style={{ color: "var(--ink)" }}>
              {p.text}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Aside({ children }) {
  return (
    <div
      className="mt-8 p-5 md:p-6 font-editor text-sm md:text-base leading-relaxed"
      style={{
        background: "var(--bg-alt, #faf7f1)",
        borderLeft: "2px solid var(--moss)",
        color: "var(--ink)",
      }}
    >
      <em className="italic">{children}</em>
    </div>
  );
}
