import { Lightbulb, ExternalLink, Coins, MapPin, Search, BookOpen } from "lucide-react";
import Seo from "@/components/Seo";

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

const PRACTICAL = [
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

export default function TipsPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-12 md:py-16">
      <Seo title="Tips — Bragarmål" description="Praktiske råd for forfattere: stipend, arbeidsflyt og skrivevaner." />

      <div className="fade-in">
        <div className="label-ui inline-flex items-center gap-2">
          <Lightbulb size={14} strokeWidth={1.5} />
          Tips til forfattere
        </div>
        <h1 className="font-serif-display text-5xl md:text-6xl font-light mt-3" style={{ color: "var(--ink)" }}>
          Praktiske råd, <em className="italic" style={{ color: "var(--moss)" }}>samlet på ett sted</em>.
        </h1>
        <p className="font-editor text-lg mt-4 max-w-[62ch]" style={{ color: "var(--ink-soft)" }}>
          Ting som er nyttige å vite når du skriver. Ingen store manifester — bare det som fungerer i praksis.
        </p>
      </div>

      <div className="mt-14">
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12" data-testid="tip-stipend">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="font-mono-ui text-xs tracking-widest" style={{ color: "var(--rust)" }}>01</div>
              <div className="label-ui" style={{ color: "var(--ink-mute)" }}>Økonomi</div>
            </div>
            <div className="mt-4 inline-flex items-center gap-3" style={{ color: "var(--moss)" }}>
              <Coins size={20} strokeWidth={1.4} />
            </div>
            <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-3 leading-tight" style={{ color: "var(--ink)" }}>
              Stipend for forfattere
            </h2>
            <p className="font-editor text-base mt-4" style={{ color: "var(--ink-soft)" }}>
              En oversikt over de viktigste ordningene — og hvordan du kan finne midler du faktisk kan få.
            </p>
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

            <div className="mt-10 hairline-t pt-8">
              <div className="label-ui" style={{ color: "var(--moss)" }}>Praktiske råd</div>
              <ul className="mt-4 space-y-4">
                {PRACTICAL.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 shrink-0" style={{ color: "var(--moss)" }}>{p.icon}</span>
                    <div className="font-editor text-base leading-relaxed" style={{ color: "var(--ink)" }}>
                      {p.text}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="mt-8 p-5 md:p-6 font-editor text-sm md:text-base leading-relaxed"
              style={{
                background: "var(--bg-alt, #faf7f1)",
                borderLeft: "2px solid var(--moss)",
                color: "var(--ink)",
              }}
            >
              <em className="italic">
                En god søknad handler like mye om å vise hvem du er som forfatter, som å beskrive prosjektet.
                Bruk gjerne Bragarmål til å skrive utkast i din egen stemme — så teksten låter som deg,
                ikke som en søknadsmal.
              </em>
            </div>
          </div>
        </article>
      </div>

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
