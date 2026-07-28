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

      {/* Hero — 6-box grid */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-10 md:pt-14 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">

          {/* Box 1 — BLACK: MANIFEST link */}
          <Link
            to="/manifest"
            data-testid="hero-box-manifest"
            className="aspect-square flex flex-col justify-between p-6 md:p-8 group transition-all hover:opacity-90"
            style={{ background: "#0f0e0d", color: "#ffffff" }}
          >
            <div className="font-mono-ui text-[10px] md:text-xs tracking-widest opacity-70">01</div>
            <div>
              <div className="font-serif-display text-3xl md:text-5xl leading-none tracking-tight">MANIFEST</div>
              <div className="mt-3 font-editor text-xs md:text-sm opacity-70 flex items-center gap-2">
                Les hele <ArrowRight size={12} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Box 2 — WHITE: ink + fountain pen photo */}
          <div
            data-testid="hero-box-image"
            className="aspect-square overflow-hidden"
            style={{ background: "#ffffff", border: "1px solid #e5e5e5" }}
          >
            <img
              src="/ink-pen.jpg"
              alt="Blekkhus og fyllepenn"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>

          {/* Box 3 — RED: Examples link */}
          <Link
            to="/eksempler"
            data-testid="hero-box-examples"
            className="aspect-square flex flex-col justify-between p-6 md:p-8 group transition-all hover:opacity-90"
            style={{ background: "#c8432c", color: "#ffffff" }}
          >
            <div className="font-mono-ui text-[10px] md:text-xs tracking-widest opacity-90">02</div>
            <div>
              <div className="font-serif-display text-xl md:text-2xl leading-tight">
                Eksempler på når<br/>Bragarmål hjelper
              </div>
              <div className="mt-3 font-editor text-xs md:text-sm opacity-90 flex items-center gap-2">
                Se scenarier <ArrowRight size={12} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Box 4 — WHITE with black text: pricing bullets */}
          <div
            data-testid="hero-box-pricing"
            className="aspect-square flex flex-col justify-between p-6 md:p-8"
            style={{ background: "#ffffff", border: "1px solid #e5e5e5", color: "#0f0e0d" }}
          >
            <div className="font-mono-ui text-[10px] md:text-xs tracking-widest opacity-60">03</div>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <button
                  data-testid="hero-cta-trial"
                  onClick={goLogin}
                  className="text-left font-serif-display text-sm md:text-base leading-snug hover:underline underline-offset-4"
                >
                  Test gratis i 2 uker
                </button>
              </li>
              <li>
                <button
                  data-testid={TID.ctaGetStarted}
                  onClick={goLogin}
                  className="text-left font-serif-display text-sm md:text-base leading-snug hover:underline underline-offset-4"
                >
                  Beta-versjon — gratis i 3 mnd
                  <span className="block font-editor text-[10px] md:text-xs opacity-70 mt-0.5">for de 10 første som registrerer seg</span>
                </button>
              </li>
              <li>
                <Link
                  to="/priser"
                  data-testid="hero-cta-pricing"
                  className="text-left font-serif-display text-sm md:text-base leading-snug hover:underline underline-offset-4 inline-flex items-center gap-1"
                >
                  Priser <ArrowRight size={12} strokeWidth={1.6} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Box 5 — BLACK: link to personal tools */}
          <Link
            to="/dashboard"
            data-testid="hero-box-tools"
            className="aspect-square flex flex-col justify-between p-6 md:p-8 group transition-all hover:opacity-90"
            style={{ background: "#0f0e0d", color: "#ffffff" }}
          >
            <div className="font-mono-ui text-[10px] md:text-xs tracking-widest opacity-70">04</div>
            <div>
              <div className="font-serif-display text-lg md:text-xl leading-snug">
                Din egen personlige side<br/>med alle hjelpemidler og verktøy
              </div>
              <div className="mt-3 font-editor text-xs md:text-sm opacity-70 flex items-center gap-2">
                Til verktøyene <ArrowRight size={12} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Box 6 — WHITE: register CTA */}
          <button
            data-testid="hero-box-register"
            onClick={goLogin}
            className="aspect-square flex flex-col justify-between p-6 md:p-8 group transition-all hover:bg-neutral-50 text-left"
            style={{ background: "#ffffff", color: "#0f0e0d", border: "1px solid #e5e5e5" }}
          >
            <div className="font-mono-ui text-[10px] md:text-xs tracking-widest opacity-60">05</div>
            <div>
              <div className="font-serif-display text-xl md:text-2xl leading-tight">
                Kom i gang —<br/>registrer deg nå
              </div>
              <div className="mt-3 font-editor text-[11px] md:text-xs opacity-70 max-w-[24ch]">
                Du beholder alle dine data — også hvis du senere pauser abonnementet.
              </div>
              <div className="mt-3 font-editor text-xs md:text-sm flex items-center gap-2" style={{ color: "var(--moss)" }}>
                Logg inn <ArrowRight size={12} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </button>

        </div>

        {/* Hero heading below grid */}
        <div className="mt-14 md:mt-16 max-w-[62ch]">
          <div className="label-ui mb-4">For deg som står fast</div>
          <h1 className="font-serif-display font-light text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight" style={{ color: "var(--ink)" }}>
            DIN stemme <em className="italic" style={{ color: "var(--moss)" }}>er din.</em>
          </h1>
          <p className="mt-6 font-editor text-lg md:text-xl" style={{ color: "var(--ink)" }}>
            Vi genererer ikke ord. <em className="italic" style={{ color: "var(--moss)" }}>Vi finner din stemme.</em>
          </p>
          <p className="mt-4 font-editor text-base md:text-lg" style={{ color: "var(--ink-soft)" }}>
            Ingen rask metode for å publisere. Kun et verktøy som tar deg videre — på dine premisser.
          </p>
          <p className="mt-4 font-editor text-sm" style={{ color: "var(--ink-mute)" }}>
            <span className="font-serif-display text-base" style={{ color: "var(--ink)" }}>Bragarmål</span>
            {" "}— norrønt for «skaldens språk» og «den fremste diktekunst». Finn ditt eget.
          </p>
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
                  Etter utallige påbegynte prosjekt og perioder med skrivesperre, sendte mitt
                  nåværende bokprosjekt over 3 år meg ut på jakt etter skrivehjelp. Seriøse aktører
                  ble for dyre, og AI tok bort det menneskelige aspektet som endret min egenart og
                  fortellerstemme. Det ble rett og slett altfor glatt og perfeksjonert.
                </p>
                <p className="mt-8">
                  Derfor lagde jeg <em className="italic" style={{ color: "var(--moss)" }}>Bragarmål</em>:
                  for å få den beste hjelpen mulig, til en overkommelig pris — på mine premisser,
                  med min stemme intakt.
                </p>
                <p
                  className="mt-10 font-serif-display text-2xl md:text-3xl leading-snug pl-6"
                  style={{ color: "var(--ink)", borderLeft: "2px solid var(--moss)" }}
                >
                  Bragarmål er en AI-basert tjeneste, men den genererer ikke AI-basert tekst til
                  deg — den hjelper deg videre når du står fast. Jo mer du legger inn, jo bedre
                  resultat får du.
                </p>
                <p className="mt-6 font-editor text-lg md:text-xl leading-[1.85]" style={{ color: "var(--ink)" }}>
                  Bruk stemmen din ved å lese inn (fint for skrivevansker og for å fange rytme,
                  stil, etc.), legg inn bilder av gamle håndskrevne tekster, last opp filer, skriv
                  notater og mer.
                </p>
                <p className="mt-8 font-serif-display text-xl md:text-2xl" style={{ color: "var(--ink)" }}>
                  Bragarmål er ikke en kjapp løsning som skriver boken (eller prosjektet) for deg.
                </p>
                <p className="mt-6" style={{ color: "var(--ink)" }}>
                  Bragarmål er for deg som forstår at det tar tid å bearbeide fortellingen,
                  teksten din, rytmen — men vil ha veiledning og drahjelp når det låser seg. Eller
                  hjelp til å komme i gang —
                  {" "}<em className="italic" style={{ color: "var(--moss)" }}>med DIN fortellerstemme intakt.</em>
                </p>
                <p className="mt-10 font-serif-display text-2xl md:text-3xl" style={{ color: "var(--moss)" }}>
                  En sparringspartner. Ikke tekstautomat.
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
