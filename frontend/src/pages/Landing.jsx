import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { TID } from "@/lib/testIds";
import { Feather, ArrowRight, Camera, Mic, FileText, ScanLine } from "lucide-react";
import InfoMenu from "@/components/InfoMenu";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

export default function Landing() {
  const nav = useNavigate();
  const goLogin = () => nav("/logg-inn");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Seo
        title="AI-skriveverktøy som bevarer din stemme"
        description="Bragarmål er et norsk AI-skriveverktøy for forfattere og kreative. Vi genererer ikke ord — vi finner din stemme. Tren stemmeprofil, oppdag AI-signaturer, skriv videre uten AI-slop."
        path="/"
      />
      {/* Top rule */}
      <div className="hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo size={28} />
          </Link>
          <nav className="flex items-center gap-2 md:gap-6">
            <InfoMenu align="right" />
            <Link to="/priser" className="label-ui" style={{ color: "var(--ink-mute)" }}>Priser</Link>
            <button
              data-testid={TID.loginBtn}
              onClick={goLogin}
              className="btn-ghost"
            >
              Logg inn
            </button>
          </nav>
        </div>
      </div>

      {/* Hero — mosaic grid inspired by literary editorial templates */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-8">
        <div className="grid grid-cols-12 gap-4 md:gap-6 items-stretch">
          {/* LEFT column — main heading + descriptions (spans 7 cols) */}
          <div className="col-span-12 md:col-span-7 fade-in">
            <div className="label-ui mb-6">Manifest <span className="marker-ornament" /> for deg som står fast</div>
            <h1 className="font-serif-display font-light text-5xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight" style={{ color: "var(--ink)" }}>
              DIN stemme <em className="italic" style={{ color: "var(--moss)" }}>er din.</em>
            </h1>
            <p className="mt-6 font-editor text-lg md:text-xl max-w-[52ch]" style={{ color: "var(--ink)" }}>
              Vi genererer ikke ord. <em className="italic" style={{ color: "var(--moss)" }}>Vi finner din stemme.</em>
            </p>
            <p className="mt-6 font-editor text-base md:text-lg max-w-[52ch]" style={{ color: "var(--ink-soft)" }}>
              Ingen rask metode for å publisere. Kun et verktøy som tar deg videre — på dine premisser.
            </p>
            <p className="mt-4 font-editor text-sm italic max-w-[52ch]" style={{ color: "var(--moss)" }}>
              Ikke bare for forfattere — for kreativ skriving generelt.
            </p>
            <p className="mt-6 font-editor text-sm max-w-[52ch]" style={{ color: "var(--ink-mute)" }}>
              <span className="font-serif-display text-base" style={{ color: "var(--ink)" }}>Bragarmål</span>
              {" "}— norrønt for «skaldens språk» og «den fremste diktekunst». Finn ditt eget.
            </p>
          </div>

          {/* RIGHT column — mosaic 2x2 (spans 5 cols) */}
          <div className="col-span-12 md:col-span-5">
            <div className="grid grid-cols-2 gap-3 md:gap-4 h-full">

              {/* Cell 1 — Black box with initial "B" */}
              <div
                data-testid="hero-tile-mark"
                className="aspect-square flex items-center justify-center"
                style={{ background: "#1c1b1a" }}
              >
                <span className="font-serif-display text-6xl md:text-7xl" style={{ color: "#f5f0e8" }}>B</span>
              </div>

              {/* Cell 2 — RED box with 3 CTA links */}
              <div
                data-testid="hero-tile-cta"
                className="aspect-square flex flex-col justify-between p-4 md:p-5"
                style={{ background: "#c8432c", color: "#f5f0e8" }}
              >
                <div className="font-mono-ui text-[10px] md:text-xs tracking-widest opacity-80">KOM I GANG</div>
                <div className="flex flex-col gap-2 md:gap-3">
                  <button
                    data-testid={TID.ctaGetStarted}
                    onClick={goLogin}
                    className="text-left font-serif-display text-sm md:text-base leading-tight hover:underline underline-offset-4"
                  >
                    Beta gratis i 3 mnd
                    <span className="block font-editor text-[10px] md:text-xs opacity-80 mt-0.5">de 10 første som registrerer seg</span>
                  </button>
                  <button
                    data-testid="hero-cta-trial"
                    onClick={goLogin}
                    className="text-left font-serif-display text-sm md:text-base leading-tight hover:underline underline-offset-4"
                  >
                    Prøv gratis i 1 uke
                  </button>
                  <Link
                    to="/priser"
                    data-testid="hero-cta-pricing"
                    className="text-left font-serif-display text-sm md:text-base leading-tight hover:underline underline-offset-4"
                  >
                    Se priser →
                  </Link>
                </div>
              </div>

              {/* Cell 3 — Papyrus with fountain-pen quote */}
              <div
                data-testid="hero-tile-quote"
                className="aspect-square flex items-center justify-center p-4"
                style={{ background: "var(--linen)" }}
              >
                <p className="font-serif-display italic text-center text-sm md:text-base leading-snug" style={{ color: "var(--ink)" }}>
                  «Skaldens språk<br/>er ditt eget.»
                </p>
              </div>

              {/* Cell 4 — Dark box with logo mark */}
              <div
                data-testid="hero-tile-logo"
                className="aspect-square flex items-center justify-center p-6"
                style={{ background: "#2d2b28" }}
              >
                <img src="/bragr-logo-dark.png" alt="Bragarmål" className="w-full h-auto opacity-90" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary CTA row */}
        <div className="mt-10 flex flex-wrap gap-4 items-center">
          <button
            data-testid="hero-primary-cta"
            onClick={goLogin}
            className="btn-primary inline-flex items-center gap-3"
          >
            Test den ut nå <ArrowRight size={16} strokeWidth={1.6} />
          </button>
          <span className="label-ui">Velg innlogging med Google eller e-post</span>
        </div>
      </section>

      {/* MANIFEST — teaser, links to full manifest page */}
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
                  Publisert forfatter er jeg ikke <em className="italic" style={{ color: "var(--moss)" }}>enda</em>,
                  men har utallige påbegynte prosjekter over flere år. Legg merke til at jeg skrev
                  «ikke enda» — for det er nettopp derfor jeg laget denne appen, til meg selv,
                  men deler den slik at andre også kan få tilgang.
                </p>
                <p className="mt-8">
                  I tre år har jeg jobbet med samme bok. Dette siste året begynte jeg å teste ut
                  diverse AI for å se om jeg kunne få hjelp med skrivingen. Resultatet har så langt
                  vært nedslående.
                </p>
                <p
                  className="mt-8 font-serif-display text-2xl md:text-3xl leading-snug pl-6"
                  style={{ color: "var(--ink)", borderLeft: "2px solid var(--moss)" }}
                >
                  Det viktigst av alt med Bragarmål er ikke at det er et verktøy for deg som bare vil
                  skrive en bok, publisere tekst, løse skriveoppgaver etisk, men for deg som står
                  fast, trenger noen nye vinklinger, etc., med <em className="italic" style={{ color: "var(--moss)" }}>DIN stemme</em>
                  {" "}— gjennom bilder av tekster du har skrevet for hånd, notater, meldinger om
                  du vil, den boka du begynte på en gang for lenge siden, men aldri skreiv ferdig.
                </p>
                <p className="mt-6 font-editor text-lg md:text-xl leading-[1.85]" style={{ color: "var(--ink)" }}>
                  Stemmeaktivering for å fange din fortellerstemme muntlig om du har problemer med
                  skriftspråket, og ikke vil gi fra deg fortellerstemmen din og miste ektheten som
                  er deg.
                </p>
                <p className="mt-8 font-serif-display text-xl md:text-2xl" style={{ color: "var(--moss)" }}>
                  Sparringspartner. Ikke tekstautomat.
                </p>
                <p className="mt-8" style={{ color: "var(--ink-soft)" }}>
                  En tekst på en app kunne nok vært mer formell, men det ville tatt bort poenget
                  mitt med BRAGARMÅL. For som jeg hevder: <em className="italic" style={{ color: "var(--moss)" }}>«Din stemme»</em>.
                </p>
                <p
                  className="mt-10 font-serif-display text-3xl md:text-4xl leading-snug"
                  style={{ color: "var(--ink)" }}
                >
                  DIN stemme er din. Bragarmål sender deg tilbake til deg selv.
                </p>
              </div>

              <div className="rule mt-10" />
              <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                <span className="label-ui">— Nina</span>
                <div className="flex items-center gap-4">
                  <Link to="/manifest" className="btn-ghost inline-flex items-center gap-2">
                    Les hele manifestet <ArrowRight size={14} strokeWidth={1.6} />
                  </Link>
                  <Link to="/etikk" className="label-ui" style={{ color: "var(--moss)" }}>
                    Etisk AI-skriving →
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Sparringspartner — practice over time */}
      <section>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="col-span-12 md:col-span-4">
              <div className="label-ui">Filosofi</div>
              <h2 className="font-serif-display text-4xl md:text-5xl font-light mt-2" style={{ color: "var(--ink)" }}>
                Sparrings­partner. Ikke <em className="italic" style={{ color: "var(--moss)" }}>tekstautomat</em>.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-8 md:pl-4 font-editor text-lg md:text-xl leading-[1.85]" style={{ color: "var(--ink)" }}>
              <p>
                Bruk Bragarmål — og AI generelt — som en sparringspartner. Ikke for å få ferdige, glatte
                tekster ut av en prompt. Verktøyet blir bedre jo lengre du jobber med det.
                Øvelse over tid. Din stemme, gjentatt.
              </p>
              <p
                className="mt-8 pl-6 font-serif-display text-xl md:text-2xl italic leading-snug"
                style={{ color: "var(--ink-soft)", borderLeft: "2px solid var(--rust)" }}
              >
                «Jeg har en tendens til å gjenta meg selv, både når jeg prater og når jeg skriver.
                Dette hjelper AI meg ved å gå gjennom teksten og luke ut.»
              </p>
              <p
                className="mt-6 pl-6 font-serif-display text-xl md:text-2xl italic leading-snug"
                style={{ color: "var(--ink-soft)", borderLeft: "2px solid var(--rust)" }}
              >
                «Kjapp i vendingen er jeg også, noe som fører både til skrivefeil og tidvis dårlige
                setninger. Der jeg kan ender jeg som regel opp med tidkrevende redigering.
                Kunne selvsagt jobbet med dette, men det er et personlighetstrekk, så da velger
                jeg heller å lage en app som hjelper meg.»
              </p>
              <div className="mt-8 label-ui" style={{ color: "var(--ink-mute)" }}>
                AI-versjon
              </div>
              <p className="mt-3" style={{ color: "var(--ink-soft)" }}>
                Det er nettopp slik det skal brukes. Ikke som en som skriver for deg, men som en
                som ser deg. Som luker der du gjentar deg selv. Som stopper opp der du hopper for
                fort. Som spør: er dette virkelig det du mente?
              </p>
              <p className="mt-6" style={{ color: "var(--ink-soft)" }}>
                Prompten er ikke bestillingen. Prompten er samtalen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example use cases — hvordan spør du Bragarmål */}
      <section>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="col-span-12 md:col-span-4">
              <div className="label-ui">Sånn spør du</div>
              <h2 className="font-serif-display text-4xl md:text-5xl font-light mt-2" style={{ color: "var(--ink)" }}>
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
        </div>
      </section>

      {/* Practical entry-points */}
      <section className="hairline-t">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
          <div className="label-ui">Fire måter å mate inn på</div>
          <h2 className="font-serif-display text-4xl md:text-5xl font-light mt-2" style={{ color: "var(--ink)" }}>
            Alt du har, i din stemme.
          </h2>
          <p className="font-editor text-lg mt-4 max-w-[62ch]" style={{ color: "var(--ink-soft)" }}>
            Jo mer materiale du mater inn, jo mer nøyaktig blir <em className="italic" style={{ color: "var(--moss)" }}>«din stemme»-lakmusen</em>.
          </p>
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
          <div className="label-ui">Sammenslått støtte fra</div>
          <div className="flex flex-wrap gap-3 items-center">
            <span className="chip">Claude Sonnet 4.5</span>
            <span className="chip">Claude Sonnet 4.6</span>
            <span className="chip">GPT 5.2</span>
            <span className="chip">GPT 5.4</span>
            <span className="chip">Gemini 3.1 Pro</span>
            <Link
              to="/logg-inn"
              className="chip inline-flex items-center gap-1.5"
              style={{ background: "var(--sky-soft)", color: "var(--ink)", borderColor: "var(--sky)" }}
            >
              + Legg til din egen <span style={{ color: "var(--ink-mute)" }}>(med API-nøkkel)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
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

function ExamplePrompt({ situation, prompt }) {
  return (
    <div className="paper p-6 md:p-7">
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
