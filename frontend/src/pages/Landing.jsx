import { Link, useNavigate } from "react-router-dom";
import { TID } from "@/lib/testIds";
import { Feather, ArrowRight, Camera, Mic, FileText, ScanLine } from "lucide-react";
import InfoMenu from "@/components/InfoMenu";
import Footer from "@/components/Footer";

export default function Landing() {
  const nav = useNavigate();
  const goLogin = () => nav("/logg-inn");

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Top rule */}
      <div className="hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Feather size={18} strokeWidth={1.4} />
            <span className="font-serif-display text-xl tracking-widest">ECHO</span>
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

      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-12">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
          <div className="col-span-12 md:col-span-9 fade-in">
            <div className="label-ui mb-6">Manifest <span className="marker-ornament" /> for deg som står fast</div>
            <h1 className="font-serif-display font-light text-5xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight" style={{ color: "var(--ink)" }}>
              DIN stemme <em className="italic" style={{ color: "var(--moss)" }}>er din.</em>
            </h1>
            <p className="mt-8 font-editor text-lg md:text-xl max-w-[62ch]" style={{ color: "var(--ink-soft)" }}>
              Ingen rask metode for å publisere. Kun et verktøy som tar deg videre — på dine premisser.
            </p>
            <p className="mt-4 font-editor text-base italic max-w-[62ch]" style={{ color: "var(--moss)" }}>
              Ikke bare for forfattere — for kreativ skriving generelt.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <button
                data-testid={TID.ctaGetStarted}
                onClick={goLogin}
                className="btn-primary inline-flex items-center gap-3"
              >
                Test den ut nå <ArrowRight size={16} strokeWidth={1.6} />
              </button>
              <span className="label-ui">Velg innlogging med Google eller e-post</span>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5"
                style={{ background: "var(--linen)", color: "var(--ink)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--ink)" }} />
                <span className="font-mono-ui text-xs tracking-wider">BETA</span>
              </span>
              <span className="font-editor text-sm" style={{ color: "var(--ink-soft)" }}>
                Gratis for de 50 første som prøver den ut.
              </span>
            </div>
          </div>
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
                  Det viktigst av alt med Echo er ikke at det er et verktøy for deg som bare vil
                  skrive en bok, publisere tekst, løse skriveoppgaver etisk, men for deg som står
                  fast, trenger noen nye vinklinger, etc., med DIN stemme.
                </p>
                <p className="mt-8" style={{ color: "var(--ink-soft)" }}>
                  En tekst på en app kunne nok vært mer formell, men det ville tatt bort poenget
                  mitt med ECHO. For som jeg hevder: <em className="italic" style={{ color: "var(--moss)" }}>«Din stemme»</em>.
                </p>
                <p
                  className="mt-10 font-serif-display text-3xl md:text-4xl leading-snug"
                  style={{ color: "var(--ink)" }}
                >
                  DIN stemme er din. Echo hjelper deg videre — på dine premisser.
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
                Bruk Echo — og AI generelt — som en sparringspartner. Ikke for å få ferdige, glatte
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
          <div className="flex flex-wrap gap-3">
            <span className="chip">Claude Sonnet 4.5</span>
            <span className="chip">Claude Sonnet 4.6</span>
            <span className="chip">GPT 5.2</span>
            <span className="chip">GPT 5.4</span>
            <span className="chip">Gemini 3.1 Pro</span>
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
