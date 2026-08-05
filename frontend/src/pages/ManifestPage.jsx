import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Feather, ArrowLeft } from "lucide-react";
import InfoMenu from "@/components/InfoMenu";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const ORIGINAL = [
  "Publisert forfatter er jeg ikke enda, men har utallige påbegynte prosjekter over flere år. Legg merke til at jeg skrev « ikke enda» — for det er nettopp derfor jeg laget denne appen, til meg selv, men deler den slik at andre også kan få tilgang.",
  "I tre år har jeg jobbet med samme bok. Dette siste året begynte jeg å teste ut diverse AI for å se om jeg kunne få hjelp med skrivingen. Resultatet har så langt vært nedslående. De beste forteller hva som fungerer og ikke er bra.",
  "Men dessverre, alt handler om å kunne publisere mest mulig og fortest mulig. I tillegg testet jeg også AI-detektorer, og selv mine personlige tekster ble flagget som AI. Fordi AI fungerer på data, matematikk, ord som er matet inn. Dette gjelder spesielt for akademiske tekster og kreative tekster som er ryddige, har flyt fra før.",
  "Etter utallige påbegynte prosjekt og perioder med skrivesperre, sendte mitt nåværende bokprosjekt over 3 år meg ut på jakt etter skrivehjelp. Seriøse aktører ble for dyre, og AI tok bort det menneskelige aspektet som endret min egenart og fortellerstemme. Det ble rett og slett altfor glatt og perfeksjonert.",
  "Derfor lagde jeg Bragarmål: for å få den beste hjelpen mulig, til en overkommelig pris — på mine premisser, med min stemme intakt.",
  "I tillegg mister jeg oversikten over karakter beskrivelser, profiler, indre og ytre kamp, kapitler og dermed sammenheng.",
  "Manuskript-verktøyet er derfor noe av det viktigste for meg, som Bragarmål hjelper meg med. Det å beholde oversikten og unngå alt ekstraarbeidet en drøss med uoversiktlige scener og notater fører til.",
  { block: "Det viktigst av alt med Bragarmål er ikke at det er et verktøy for deg som bare vil skrive en bok, publisere tekst, løse skriveoppgaver etisk, men for deg som står fast, trenger noen nye vinklinger, etc., med DIN stemme, gjennom bilder av tekster du har skrevet for hånd, notater, meldinger om du vil, den boka du begynte på en gang for lenge siden, men aldri skreiv ferdig. Stemmeaktivering for å fange din fortellerstemme muntlig om du har problemer med skriftspråket, og ikke vil gi fra deg fortellerstemmen din og miste ektheten som er deg." },
  { emphasis: "Test den ut nå, mat inn det du har og vil, ta bilder av gamle tekster du har skrevet på papir, les inn, noter og les gjennom." },
];

const AI_EDITED = [
  "Publisert forfatter er jeg ikke enda. Men jeg har utallige påbegynte prosjekter bak meg, spredt over flere år. Legg merke til at jeg skriver «ikke enda» — det er nettopp derfor denne appen finnes. Den er laget for meg. Jeg deler den slik at andre også kan bruke den.",
  "I tre år har jeg jobbet med samme bok. Det siste året begynte jeg å teste diverse AI for å se om jeg kunne få hjelp med skrivingen. Resultatet har så langt vært nedslående. De beste verktøyene kan fortelle deg hva som fungerer og hva som ikke gjør det. Men nesten alt handler om å publisere mest mulig – og fortest mulig.",
  "Jeg testet også AI-detektorer. Selv mine personlige tekster, skrevet lenge før AI fantes, ble flagget som maskinskrevet. Fordi AI lever av data, matematikk og ord som allerede er matet inn. Det gjelder særlig akademiske tekster og kreative tekster som allerede har flyt og orden.",
  { block: "Det viktigste med Bragarmål er ikke at det er et verktøy for deg som bare vil skrive en bok. Det er et verktøy for deg som står fast. For deg som trenger nye vinklinger, uten å miste din egen fortellerstemme." },
  "Du kan mate inn det du allerede har: bilder av håndskrevne tekster, gamle notater, meldinger, den boka du startet på for lenge siden men aldri fullførte. Du kan bruke stemmen din. Lese inn. Fortelle. Ikke bare ordene, men rytmen, pausene og måten du bygger en historie på når du snakker. Særlig hvis skriftspråket er en kamp.",
];

const NOTES = [
  { label: "Stavefeil bevart", detail: "«viktigst av alt» → renset til «viktigste med Bragarmål». Særegenhet borte." },
  { label: "Setnings­sammensmelting", detail: "Ett langt, myldrende avsnitt om håndskrift/notater/meldinger → tre korte, ryddige setninger. Rytmen borte." },
  { label: "Direkte tiltale­fjernet", detail: "«Test den ut nå, mat inn det du har» → fjernet helt. Den varme, muntlige oppfordringen forsvant." },
  { label: "«jævla», «vissvass»-nivået", detail: "Munnlig norsk («skreiv», «vissvass») glattet ut mot standardformer. Tonen ble kjøligere." },
  { label: "«DIN» → «Din»", detail: "Versalene understreket eierskap. De ble tatt bort — dermed også temperaturen." },
];

export default function ManifestPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="hairline-b">
        <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
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

      <section className="max-w-[1500px] mx-auto px-6 md:px-10 pt-14 pb-8">
        <div className="label-ui">Manifest · før og etter</div>
        <h1 className="font-serif-display text-5xl md:text-6xl font-light mt-3" style={{ color: "var(--ink)" }}>
          Det som forsvinner når AI <em className="italic" style={{ color: "var(--moss)" }}>«pynter»</em>.
        </h1>
        <p className="mt-6 font-editor text-lg max-w-[70ch]" style={{ color: "var(--ink-soft)" }}>
          Til venstre står manifestet slik det ble skrevet: uredigert, med skrivemåter, brudd og
          direkte tiltale. Til høyre står samme tekst etter en typisk AI-redigering — «ryddet»,
          «flyt», «forbedret». Legg merke til hva som blir borte.
        </p>
        <p className="mt-8 font-editor text-sm italic max-w-[60ch]" style={{ color: "var(--moss)" }}>
          <em>Bragarmál</em> — skaldens språk. Det språket bare du kan snakke.
        </p>
      </section>

      <section className="max-w-[1500px] mx-auto px-6 md:px-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 hairline-t">
          <Column
            heading="Original"
            sub="Ninas stemme, uredigert"
            accent="var(--moss)"
            paragraphs={ORIGINAL}
            side="left"
          />
          <Column
            heading="AI-redigert"
            sub="Glattet, ryddet, forbedret"
            accent="var(--rust)"
            paragraphs={AI_EDITED}
            side="right"
          />
        </div>
      </section>

      <section className="hairline-t">
        <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <div className="label-ui">Hva forsvant</div>
              <h2 className="font-serif-display text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
                Fem tap, punkt for punkt.
              </h2>
              <p className="font-editor mt-6" style={{ color: "var(--ink-soft)" }}>
                Ingen enkeltendring er dramatisk. Summen er det som gjør at teksten slutter å
                lyde som deg.
              </p>
            </div>
            <div className="lg:col-span-8">
              <ul>
                {NOTES.map((n, i) => (
                  <li key={n.label} className="hairline-b py-6 grid grid-cols-12 gap-6">
                    <div className="col-span-12 md:col-span-4">
                      <div className="label-ui" style={{ color: "var(--rust)" }}>{String(i + 1).padStart(2, "0")}</div>
                      <div className="font-serif-display text-xl mt-1" style={{ color: "var(--ink)" }}>{n.label}</div>
                    </div>
                    <div className="col-span-12 md:col-span-8 font-editor" style={{ color: "var(--ink-soft)" }}>
                      {n.detail}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="hairline-t">
        <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-16 text-center">
          <div className="label-ui">Poenget</div>
          <h2 className="font-serif-display text-4xl md:text-5xl font-light mt-3 max-w-[26ch] mx-auto" style={{ color: "var(--ink)" }}>
            Bragarmål sender deg tilbake til <em className="italic" style={{ color: "var(--moss)" }}>deg selv</em>.
          </h2>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
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

function Column({ heading, sub, accent, paragraphs, side }) {
  return (
    <div
      className={`p-8 md:p-12 ${side === "right" ? "lg:border-l" : ""}`}
      style={{ borderColor: "var(--line)", background: side === "right" ? "var(--bg-alt)" : "transparent" }}
    >
      <div className="flex items-baseline gap-3">
        <div className="w-1 h-8" style={{ background: accent }} />
        <div>
          <div className="label-ui" style={{ color: accent }}>{heading}</div>
          <div className="font-serif-display text-2xl mt-1" style={{ color: "var(--ink)" }}>{sub}</div>
        </div>
      </div>
      <div className="mt-8 font-editor text-[1.05rem] md:text-lg leading-[1.85]" style={{ color: "var(--ink)" }}>
        {paragraphs.map((p, i) => {
          if (typeof p === "string") return <p key={i} className="mt-6 first:mt-0">{p}</p>;
          if (p.block)
            return (
              <p
                key={i}
                className="mt-8 pl-5 font-serif-display text-2xl leading-snug"
                style={{ color: "var(--ink)", borderLeft: `2px solid ${accent}` }}
              >
                {p.block}
              </p>
            );
          if (p.emphasis)
            return (
              <p key={i} className="mt-6 italic" style={{ color: accent }}>
                <em>{p.emphasis}</em>
              </p>
            );
          if (p.closing)
            return (
              <p
                key={i}
                className="mt-10 font-serif-display text-3xl md:text-4xl leading-snug whitespace-pre-line"
                style={{ color: "var(--ink)" }}
              >
                {p.closing}
              </p>
            );
          return null;
        })}
      </div>
    </div>
  );
}
