import { Lightbulb, ExternalLink, Coins, MapPin, Search } from "lucide-react";
import Seo from "@/components/Seo";

const TIPS = [
  {
    id: "stipend",
    n: "01",
    tag: "Økonomi",
    icon: <Coins size={20} strokeWidth={1.4} />,
    title: "Stipend for forfattere",
    subtitle: "Praktiske råd for å finne midler du faktisk kan få",
    intro:
      "De store statlige stipendene får svært få. De mindre legatene er ofte mer tilgjengelige — men de færreste kjenner til dem. Her er en enkel innfallsvinkel.",
    steps: [
      {
        icon: <Search size={16} strokeWidth={1.5} />,
        title: "Start med Stipendportalen",
        body: (
          <>
            Søk på{" "}
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
            <em className="italic">«debutant»</em>. Kombiner gjerne med sjanger, tema eller yrke.
          </>
        ),
      },
      {
        icon: <Coins size={16} strokeWidth={1.5} />,
        title: "Legater med lave beløp er lettere å få",
        body: (
          <>
            Mange legater deler ut <strong>10 000–50 000 kr</strong>. Beløpene er små, men
            konkurransen er langt mindre enn på de store statlige stipendene. Flere små bevilgninger
            gjennom året kan utgjøre en reell forskjell.
          </>
        ),
      },
      {
        icon: <MapPin size={16} strokeWidth={1.5} />,
        title: "Sjekk lokale muligheter",
        body: (
          <>
            Noen legater prioriterer søkere fra bestemte <strong>fylker eller kommuner</strong>.
            Undersøk hva som finnes der du bor eller er født. Kommunens kulturkontor har ofte en
            oversikt.
          </>
        ),
      },
    ],
    aside:
      "Husk: en god søknad handler like mye om å vise hvem du er som forfatter, som å beskrive prosjektet. Bruk gjerne Bragarmål til å skrive utkast i din egen stemme — så teksten låter som deg, ikke som en søknadsmal.",
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

      <div className="mt-14 space-y-16">
        {TIPS.map((tip) => (
          <TipBlock key={tip.id} tip={tip} />
        ))}
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

function TipBlock({ tip }) {
  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12" data-testid={`tip-${tip.id}`}>
      <div className="lg:col-span-4">
        <div className="flex items-center gap-3">
          <div className="font-mono-ui text-xs tracking-widest" style={{ color: "var(--rust)" }}>
            {tip.n}
          </div>
          <div className="label-ui" style={{ color: "var(--ink-mute)" }}>{tip.tag}</div>
        </div>
        <div className="mt-4 inline-flex items-center gap-3" style={{ color: "var(--moss)" }}>
          {tip.icon}
        </div>
        <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-3 leading-tight" style={{ color: "var(--ink)" }}>
          {tip.title}
        </h2>
        <p className="font-editor text-base mt-4" style={{ color: "var(--ink-soft)" }}>
          {tip.subtitle}
        </p>
      </div>

      <div className="lg:col-span-8">
        <p className="font-editor text-lg leading-relaxed" style={{ color: "var(--ink)" }}>
          {tip.intro}
        </p>

        <ol className="mt-8">
          {tip.steps.map((s, i) => (
            <li key={i} className="hairline-t py-6 grid grid-cols-12 gap-4 md:gap-6">
              <div className="col-span-12 md:col-span-4">
                <div className="inline-flex items-center gap-2" style={{ color: "var(--moss)" }}>
                  {s.icon}
                  <div className="label-ui" style={{ color: "var(--ink-mute)" }}>
                    Trinn {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="font-serif-display text-xl md:text-2xl mt-2 leading-snug" style={{ color: "var(--ink)" }}>
                  {s.title}
                </div>
              </div>
              <div className="col-span-12 md:col-span-8 font-editor text-base leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                {s.body}
              </div>
            </li>
          ))}
        </ol>

        {tip.aside && (
          <div
            className="mt-8 p-5 md:p-6 font-editor text-sm md:text-base leading-relaxed"
            style={{
              background: "var(--bg-alt, #faf7f1)",
              borderLeft: "2px solid var(--moss)",
              color: "var(--ink)",
            }}
          >
            <em className="italic">{tip.aside}</em>
          </div>
        )}
      </div>
    </article>
  );
}
