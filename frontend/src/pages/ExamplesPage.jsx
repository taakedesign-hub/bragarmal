import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { ArrowLeft, ArrowRight, Compass, BookOpen, GitCompare, Layers, Users, Lightbulb, Camera, Mic } from "lucide-react";
import InfoMenu from "@/components/InfoMenu";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const SCENARIOS = [
  {
    scenario: "Du har skrevet halve boka og står bom fast.",
    tool: "Skrivepult · Finn veien videre",
    help: "Lim inn scenen du sitter i. Bragarmål gir deg 3–5 konkrete retninger — sanselige detaljer å prøve, uventede vinkler, spørsmål å utforske. Aldri ferdig prosa. Du velger.",
  },
  {
    scenario: "Manuset ditt er blitt uoversiktlig — scener, POV, sammenhenger flyter.",
    tool: "Manuskript",
    help: "Legg inn scenene dine i outlineren. Se POV, status, ordantall og rekkefølge i ett blikk. Snapshots av tidligere versjoner. Eksporter hele manuset som DOCX når du er klar.",
  },
  {
    scenario: "En karakter oppfører seg plutselig annerledes — men du husker ikke hvorfor.",
    tool: "Karakterer",
    help: "Bygg psykologiske profiler for hovedkarakterene: indre og ytre konflikt, karakterbue, relasjoner, stemmenoter. Eller la Bragarmål hente dem ut av manuskript-scenene dine automatisk.",
  },
  {
    scenario: "Du fikk hjelp av en AI før, og teksten mistet sjelen.",
    tool: "Skrivepult · Sammenlign med min stemme",
    help: "Lim inn den polerte AI-teksten. Bragarmål viser deg — setning for setning — hvor stemmen din forsvant. Røde setninger går videre til nærlesning i «Les det jeg har».",
  },
  {
    scenario: "Du har notater, opptak og bilder av håndskrift fra flere år.",
    tool: "Prøver",
    help: "Ta bilde av gamle sider. Les inn lange monologer. Lim inn meldinger og fragmenter. Bragarmål transkriberer, samler, og bygger stemmeprofilen din — jo mer materiale, jo skarpere resultat.",
  },
  {
    scenario: "Du vet ikke om det du skriver «låter som deg» lenger.",
    tool: "Stemmeprofil",
    help: "Bragarmål analyserer prøvene dine: rytme, ordvalg, signaturord, setningslengde. Du får en profil du kan sammenligne enhver ny tekst mot. Der stemmen svikter, ser du det.",
  },
  {
    scenario: "Du har bok, men vet ikke hvordan du søker stipend eller kontakter forlag.",
    tool: "Tips",
    help: "Praktiske råd på ett sted: disposisjonsteknikker, stipendkilder (Forfatterforbundet, DnF, NBU, private legater), oversikt over norske forlag, og maler for følgebrev.",
  },
  {
    scenario: "Du skriver på nynorsk, dialekt eller en helt egen tone.",
    tool: "Alle verktøy",
    help: "Vi legger oss aldri i språkvalg. Bragarmål bevarer dialekt, tegnsetting, brudd, uvante formuleringer — alt som gjør skriften din gjenkjennelig.",
  },
];

const MODES = [
  {
    icon: Compass,
    label: "Finn veien videre",
    tool: "Skrivepult · Modus 01",
    intro: "Du limer inn teksten din. Bragarmål gir deg retninger — ikke ferdig prosa.",
    input: "Hun sto ved vinduet og så på regnet. Det hadde vært en lang dag.",
    outputTitle: "Retninger å utforske",
    output: [
      "Legg til en kroppslig detalj i første setning — hendene mot glasset, spennet i skuldrene, noe som avslører hva hun holder inne.",
      "Prøv å ta bort «det hadde vært en lang dag». La regnet gjøre den jobben. Hva ser hun i regnet som forteller det?",
      "Hva var det spesifikke ved dagen? Én ting. Et navn, en telefonsamtale, et blikk på trikken. Forankre det.",
      "Skift synsvinkel for en setning. Regnet ser henne. Hva ser regnet?",
    ],
  },
  {
    icon: BookOpen,
    label: "Les det jeg har",
    tool: "Skrivepult · Modus 02",
    intro: "Editorisk lesning uten råd. Bragarmål speiler tilbake hva den ser.",
    input: "Hun sto ved vinduet og så på regnet. Kaffen var kald i koppen. Ingenting føltes riktig lenger.",
    outputTitle: "Editorisk lesning",
    output: [
      "Jeg legger merke til at du holder tilbake. To konkrete detaljer — vinduet og kaffen — bærer scenen. De fungerer. De er forankret i sansene.",
      "Så kommer «ingenting føltes riktig lenger» og du forlater konkretheten. Det blir en påstand, ikke en følelse. Stemmen din har vist mer tillit til bildene tidligere.",
      "Spenningen sitter i det du ikke sier. Hvor lenge har hun stått der? Hvorfor akkurat i dag?",
    ],
  },
  {
    icon: GitCompare,
    label: "Sammenlign med min stemme",
    tool: "Skrivepult · Modus 03",
    intro: "Bragarmål sjekker teksten setning for setning mot stemmeprofilen din.",
    input: "Regnet falt over byen som et teppe. Hun sto ved vinduet, forankret i tanker. I dagens raske verden er det viktig å finne øyeblikk av ro.",
    outputTitle: "Passer dette med min stemme?",
    output: [
      { color: "moss", note: "«Hun sto ved vinduet» — 78/100 · likner deg (konkret, sparsom)" },
      { color: "rust", note: "«forankret i tanker» — 42/100 · litt formell for din stemme, du ville nok skrevet «i tanker»" },
      { color: "red",  note: "«I dagens raske verden er det viktig» — 12/100 · klisjé · dette låter som en AI-frase, ikke deg" },
    ],
  },
];

export default function ExamplesPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Seo
        title="Eksempler — Bragarmål"
        description="Konkrete eksempler på når og hvordan Bragarmål hjelper deg: skrivesperre, manuskript, karakterer, stemmesammenligning, håndskrift og opptak."
        path="/eksempler"
      />
      <div className="hairline-b">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-3 md:py-4 flex items-center justify-between gap-3">
          <Link to="/" aria-label="Bragarmål — gå til forsiden" data-testid="header-logo-link" className="flex items-center shrink-0 transition-opacity hover:opacity-80">
            <Logo size={56} />
          </Link>
          <nav className="flex items-center gap-3 md:gap-6">
            <InfoMenu align="right" />
            <Link to="/" className="label-ui flex items-center gap-2" style={{ color: "var(--ink-mute)" }}>
              <ArrowLeft size={14} /> Tilbake
            </Link>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-6">
        <div className="label-ui mb-4">Eksempler <span className="marker-ornament" /> når det låser seg</div>
        <h1 className="font-serif-display font-light text-4xl md:text-6xl leading-[1.05] tracking-tight" style={{ color: "var(--ink)" }}>
          Når hjelper <em className="italic" style={{ color: "var(--moss)" }}>Bragarmål</em> deg?
        </h1>
        <p className="mt-6 font-editor text-lg md:text-xl max-w-[62ch]" style={{ color: "var(--ink-soft)" }}>
          Konkrete situasjoner — og hvilket verktøy i Bragarmål som hjelper deg videre. Uten å ta over.
        </p>
      </section>

      {/* Intro — hvorfor AI-en bommer, og hvorfor det er et godt tegn */}
      <section className="max-w-[900px] mx-auto px-6 md:px-10 pb-6">
        <div className="hairline-t pt-10 md:pt-12 space-y-5 font-editor text-base md:text-lg leading-[1.75]" style={{ color: "var(--ink)" }}>
          <p>AI forstår ikke språk slik et menneske gjør.</p>
          <p>
            Den gjenkjenner mønstre — rytme, tone, ordvalg og intensjon — ut fra det du faktisk skriver.
            Når den ikke kjenner din personlige måte å snakke og tenke på, kan den bomme.
          </p>
          <p className="font-serif-display text-xl md:text-2xl italic" style={{ color: "var(--moss)" }}>
            Det er faktisk et godt tegn.
          </p>
          <p>Det betyr at den slutter å gjette og begynner å være ærlig.</p>
          <p style={{ color: "var(--ink-soft)" }}>
            Jo mer du legger inn, jo bedre kjenner Bragarmål stemmen din — og jo mer presise blir forslagene.
          </p>
        </div>
      </section>

      {/* SCENARIOS — matched to specific tools */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {SCENARIOS.map((ex, i) => (
            <div key={i} data-testid={`example-${i + 1}`} className="hairline-t pt-6 md:pt-8">
              <div className="flex items-baseline gap-3 flex-wrap">
                <div className="font-mono-ui text-xs tracking-widest" style={{ color: "var(--moss)" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="label-ui" style={{ color: "var(--rust)" }}>{ex.tool}</div>
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
      </section>

      {/* NEW: Three Skrivepult modes — concrete examples */}
      <section id="skrivepult-modi" className="hairline-t scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="col-span-12 md:col-span-4">
              <div className="label-ui">Skrivepulten</div>
              <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
                Tre måter å <em className="italic" style={{ color: "var(--moss)" }}>sparre</em> — konkret.
              </h2>
              <p className="font-editor mt-6" style={{ color: "var(--ink-soft)" }}>
                Ikke autopilot. Aldri ferdig prosa. Under er ekte eksempler på hva du får tilbake fra
                hver av de tre modusene, med samme utgangstekst.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8 space-y-8">
              {MODES.map((m, i) => (
                <ModeExample key={m.label} idx={i + 1} {...m} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Manuskript module preview */}
      <section id="manuskript-eksempel" className="hairline-t scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="col-span-12 md:col-span-4">
              <div className="label-ui inline-flex items-center gap-2" style={{ color: "var(--rust)" }}>
                <Layers size={14} strokeWidth={1.5} /> Manuskript
              </div>
              <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
                Hold <em className="italic" style={{ color: "var(--moss)" }}>oversikten</em>.
              </h2>
              <p className="font-editor mt-6" style={{ color: "var(--ink-soft)" }}>
                Alle scener i én tabell. POV, status, ordantall, rekkefølge. Snapshots før du redigerer noe kritisk. Eksporter hele manuset som DOCX når du er klar for redaktør eller korrektur.
              </p>
              <ul className="mt-4 font-editor text-sm space-y-1.5" style={{ color: "var(--ink-soft)" }}>
                <li className="pl-4 relative"><span className="absolute left-0" style={{ color: "var(--moss)" }}>—</span>Sceneoversikt med filter på POV og status</li>
                <li className="pl-4 relative"><span className="absolute left-0" style={{ color: "var(--moss)" }}>—</span>Word-mål: totalt og per skriveøkt</li>
                <li className="pl-4 relative"><span className="absolute left-0" style={{ color: "var(--moss)" }}>—</span>Scrivenings-visning (les scener sammenhengende)</li>
                <li className="pl-4 relative"><span className="absolute left-0" style={{ color: "var(--moss)" }}>—</span>Komposisjonsmodus (fullskjerm, ingen distraksjon)</li>
              </ul>
            </div>
            <div className="col-span-12 md:col-span-8">
              <div className="paper p-6 md:p-8" style={{ background: "var(--linen)", border: "1px solid var(--line)" }}>
                <div className="grid grid-cols-12 gap-3 pb-3 hairline-b label-ui" style={{ color: "var(--ink-mute)" }}>
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Scene</div>
                  <div className="col-span-2">POV</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-3 text-right">Ord</div>
                </div>
                {[
                  ["01", "Ellen kommer inn på minilageret", "Ellen", "Ferdig", "1 240", "moss"],
                  ["02", "Telefonsamtalen fra advokaten", "Ellen", "Utkast", "820", "rust"],
                  ["03", "Middag med Sofie — noe skjer", "Ellen", "Idé", "—", "mute"],
                  ["04", "Kjøring hjem, mørke, regn", "Ellen", "Utkast", "560", "rust"],
                  ["05", "Konvolutten i postkassen", "Ellen", "Skrives", "310", "ink"],
                ].map(([n, title, pov, status, words, tone]) => (
                  <div key={n} className="grid grid-cols-12 gap-3 py-3 hairline-b font-editor text-sm">
                    <div className="col-span-1 font-mono-ui text-xs" style={{ color: "var(--ink-mute)" }}>{n}</div>
                    <div className="col-span-4" style={{ color: "var(--ink)" }}>{title}</div>
                    <div className="col-span-2" style={{ color: "var(--ink-soft)" }}>{pov}</div>
                    <div className="col-span-2 label-ui" style={{
                      color: tone === "moss" ? "var(--moss)" : tone === "rust" ? "var(--rust)" : tone === "mute" ? "var(--ink-mute)" : "var(--ink)",
                    }}>{status}</div>
                    <div className="col-span-3 text-right font-mono-ui text-xs" style={{ color: "var(--ink)" }}>{words}</div>
                  </div>
                ))}
                <div className="mt-4 flex items-center justify-between label-ui" style={{ color: "var(--ink-mute)" }}>
                  <span>5 scener · 2 930 ord totalt</span>
                  <span style={{ color: "var(--moss)" }}>Ordmål i dag: 500 / 800</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Karakter module preview */}
      <section id="karakter-eksempel" className="hairline-t scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="col-span-12 md:col-span-4">
              <div className="label-ui inline-flex items-center gap-2" style={{ color: "var(--rust)" }}>
                <Users size={14} strokeWidth={1.5} /> Karakterer
              </div>
              <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
                Psykologiske <em className="italic" style={{ color: "var(--moss)" }}>profiler</em>.
              </h2>
              <p className="font-editor mt-6" style={{ color: "var(--ink-soft)" }}>
                Bygg karakterene manuelt — eller la Bragarmål hente ut profiler fra manuskript-scenene dine automatisk. Beholder du oversikten når karakterer er komplekse og manuset er langt.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8">
              <div className="paper p-6 md:p-8" style={{ background: "var(--paper)", border: "1px solid var(--line)" }}>
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="font-serif-display text-2xl md:text-3xl" style={{ color: "var(--ink)" }}>Ellen Wold</h3>
                    <p className="mt-1 label-ui" style={{ color: "var(--ink-mute)" }}>Hovedkarakter · protagonist</p>
                  </div>
                  <span className="label-ui" style={{ color: "var(--moss)" }}>Ekstrahert fra 12 scener</span>
                </div>

                <div className="mt-6 space-y-5 font-editor text-base leading-relaxed" style={{ color: "var(--ink)" }}>
                  <ProfileField label="Ytre konflikt" text="Kaffebar-eier i konkurs. Har tre måneder på seg til å redde det hun har bygget opp — eller miste alt til eks-mannen som eier bygget." />
                  <ProfileField label="Indre konflikt" text="Frykt for å måtte innrømme at hun ikke lenger vet hvem hun er uten kaffebaren. Skammen over å ha stolt på Ola i så mange år." />
                  <ProfileField label="Karakterbue" text="Fra kontroll til aksept. Går fra å tro at hun kan holde alt sammen, til å innse at oppløsning noen ganger er starten." />
                  <ProfileField label="Stemmenoter" text="Snakker sparsomt, observerer mye. Bruker konkrete substantiver, unngår adjektiver. Ironi som forsvar. Bryter setninger når hun blir presset." />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stemmeprofil — kept from original */}
      <section id="stemmeprofil" className="hairline-t scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-20">
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
              <div className="p-6 md:p-7" style={{ background: "var(--linen)", border: "1px solid var(--line)" }}>
                <div className="font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--rust)" }}>TONE</div>
                <p className="mt-3 font-editor text-base md:text-lg leading-relaxed" style={{ color: "var(--ink)" }}>
                  Tonen er nær, anspent og observerende, med korte, avsluttende setninger som skaper tempo og indre uro. Stemningen veksler mellom kontrollert ytre og kollapset indre, med hint av mørk ironi i kontraster som «romantisk kveld» mot konkurs.
                </p>
              </div>
              <div className="p-6 md:p-7" style={{ background: "var(--paper)", border: "1px solid var(--line)" }}>
                <div className="font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--rust)" }}>STIL</div>
                <p className="mt-3 font-editor text-base md:text-lg leading-relaxed" style={{ color: "var(--ink)" }}>
                  Setningene er korte, ofte brutale avbrudd av tankerekker. Forfatterens grep er filmisk: sanselige detaljer (lukt, lyd, lys), fysiske reaksjoner («armene ble tunge», «han drakk det som var igjen»), og tomme rom. Ordvalget veksler mellom hverdagslig presisjon og mettet bildespråk.
                </p>
              </div>
              <p className="font-editor text-sm" style={{ color: "var(--ink-mute)" }}>
                Denne profilen brukes av «Sammenlign med min stemme» — slik at forslag speiler din rytme, ikke bare språkmodellens gjennomsnitt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prøver — how to feed material in */}
      <section id="prover" className="hairline-t scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="col-span-12 md:col-span-4">
              <div className="label-ui">Prøver</div>
              <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
                Alt du har, i <em className="italic" style={{ color: "var(--moss)" }}>din stemme</em>.
              </h2>
              <p className="font-editor mt-6" style={{ color: "var(--ink-soft)" }}>
                Jo mer materiale du legger inn, jo skarpere blir stemmeprofilen. Fire innganger:
              </p>
            </div>
            <div className="col-span-12 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-0 hairline-t hairline-b">
              <EntryTile n="01" title="Lim inn" body="Kladder, meldinger, avsnitt du har liggende — bare kopier og lim." />
              <EntryTile n="02" title="Last opp fil" body=".txt, .md, .pdf, .docx. Nedskrevet materiale du har fra før." bordered />
              <EntryTile n="03" icon={<Camera size={16} strokeWidth={1.4} />} title="Foto av håndskrift" body="Fotografer gamle notatbøker og brev. Håndskriften blir tekst." />
              <EntryTile n="04" icon={<Mic size={16} strokeWidth={1.4} />} title="Høytlesning" body="Les direkte inn, eller last opp opptak. Muntlig fortellerstemme bevart." bordered />
            </div>
          </div>
        </div>
      </section>

      {/* Tips — practical resources */}
      <section id="tips" className="hairline-t scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="col-span-12 md:col-span-4">
              <div className="label-ui inline-flex items-center gap-2" style={{ color: "var(--rust)" }}>
                <Lightbulb size={14} strokeWidth={1.5} /> Tips
              </div>
              <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
                Praktiske råd, <em className="italic" style={{ color: "var(--moss)" }}>samlet</em>.
              </h2>
              <p className="font-editor mt-6" style={{ color: "var(--ink-soft)" }}>
                Ting det er nyttig å vite når du skriver. Kun for innloggede.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TipCard title="Disposisjonsteknikker" body="Seks metoder — snøflak, Save the Cat, tre-akt, heltens reise, kortstokk, skjelett." />
              <TipCard title="Stipend for forfattere" body="Fem viktige ordninger + praktiske råd om Stipendportalen og lokale legater." />
              <TipCard title="Kontakte forlagene" body="Seks trinn, tabell over norske forlag med innsendingsrutiner, viktige punkter." />
              <TipCard title="Forslag til følgebrev" body="Grunnregelen, anbefalt struktur, fallgruver — og eksempeltekst." />
            </div>
          </div>
        </div>
      </section>

      {/* Temperatur — still relevant to reflect/next_steps */}
      <section id="temperatur" className="hairline-t scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="col-span-12 md:col-span-4">
              <div className="label-ui">Temperatur</div>
              <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
                Hvor <em className="italic" style={{ color: "var(--moss)" }}>frekk</em> skal Bragarmål være?
              </h2>
              <p className="font-editor mt-6" style={{ color: "var(--ink-soft)" }}>
                Temperatur styrer hvor «trygg» eller «kreativ» forslagene blir i «Finn veien videre» og «Les det jeg har». Du velger — det finnes ingen fasit.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8 space-y-6">
              <TempTier range="0.3" title="Lav" desc="Forsiktig, stabil, «korrekt». Trygg — men kan føles flat." />
              <TempTier range="0.7" title="Middels" recommended desc="Balanse mellom kontroll og variasjon. Beste utgangspunkt for de fleste." />
              <TempTier range="1.0" title="Høy" desc="Frekkere, mer uforutsigbar. Mer personlighet — men kan spore av." />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hairline-t">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-14 flex items-center justify-between flex-wrap gap-6">
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

/* ─────────── Sub-components ─────────── */

function ModeExample({ idx, icon: Icon, label, tool, intro, input, outputTitle, output }) {
  return (
    <div className="paper p-6 md:p-7" style={{ background: "var(--linen)", border: "1px solid var(--line)" }} data-testid={`mode-example-${idx}`}>
      <div className="flex items-center gap-2" style={{ color: "var(--moss)" }}>
        <Icon size={16} strokeWidth={1.4} />
        <div className="label-ui">{tool}</div>
      </div>
      <h3 className="mt-2 font-serif-display text-2xl md:text-3xl leading-tight" style={{ color: "var(--ink)" }}>
        {label}
      </h3>
      <p className="mt-3 font-editor text-sm" style={{ color: "var(--ink-soft)" }}>{intro}</p>

      <div className="mt-5">
        <div className="label-ui" style={{ color: "var(--ink-mute)" }}>Din tekst</div>
        <p className="mt-2 font-editor text-base italic leading-relaxed" style={{ color: "var(--ink)" }}>«{input}»</p>
      </div>

      <div className="mt-5 hairline-t pt-4">
        <div className="label-ui" style={{ color: "var(--rust)" }}>{outputTitle}</div>
        {Array.isArray(output) && typeof output[0] === "string" ? (
          <ol className="mt-3 space-y-2 font-editor text-base leading-relaxed" style={{ color: "var(--ink)" }}>
            {output.map((line, i) => (
              <li key={i} className="pl-6 relative">
                <span className="absolute left-0 font-mono-ui text-xs" style={{ color: "var(--moss)" }}>{i + 1}.</span>
                {line}
              </li>
            ))}
          </ol>
        ) : (
          <ul className="mt-3 space-y-2 font-editor text-base leading-relaxed">
            {output.map((h, i) => {
              const bg = h.color === "moss" ? "rgba(74,93,78,0.14)" : h.color === "rust" ? "rgba(184,114,74,0.18)" : "rgba(161,58,58,0.22)";
              return (
                <li key={i} className="pl-3 py-1" style={{ background: bg, color: "var(--ink)" }}>
                  {h.note}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function ProfileField({ label, text }) {
  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-12 md:col-span-3 label-ui" style={{ color: "var(--ink-mute)" }}>{label}</div>
      <div className="col-span-12 md:col-span-9" style={{ color: "var(--ink)" }}>{text}</div>
    </div>
  );
}

function EntryTile({ n, icon, title, body, bordered }) {
  return (
    <div className={`p-6 ${bordered ? "sm:border-l" : ""}`} style={{ borderColor: "var(--line)" }}>
      <div className="flex items-start justify-between">
        <div className="label-ui">{n}</div>
        {icon && <div style={{ color: "var(--moss)" }}>{icon}</div>}
      </div>
      <h3 className="font-serif-display text-xl mt-4" style={{ color: "var(--ink)" }}>{title}</h3>
      <p className="font-editor text-sm mt-2 leading-relaxed" style={{ color: "var(--ink-soft)" }}>{body}</p>
    </div>
  );
}

function TipCard({ title, body }) {
  return (
    <Link to="/tips" className="p-5 block hover:opacity-80 transition-opacity" style={{ background: "var(--paper)", border: "1px solid var(--line)" }}>
      <h3 className="font-serif-display text-xl" style={{ color: "var(--ink)" }}>{title}</h3>
      <p className="mt-2 font-editor text-sm" style={{ color: "var(--ink-soft)" }}>{body}</p>
      <span className="mt-3 inline-block label-ui" style={{ color: "var(--rust)" }}>Åpne tips →</span>
    </Link>
  );
}

function TempTier({ range, title, desc, recommended }) {
  return (
    <div className="p-5 md:p-6 flex items-start gap-5 md:gap-6" style={{ background: "var(--paper)", border: `1px solid ${recommended ? "var(--moss)" : "var(--line)"}` }}>
      <div className="shrink-0 w-20">
        <div className="font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--ink-mute)" }}>{range}</div>
        <div className="font-serif-display text-xl mt-1" style={{ color: "var(--ink)" }}>{title}</div>
        {recommended && (
          <span className="mt-2 inline-block font-mono-ui text-[9px] tracking-widest px-1.5 py-0.5" style={{ background: "var(--moss)", color: "white" }}>ANBEFALT</span>
        )}
      </div>
      <p className="font-editor text-base leading-relaxed" style={{ color: "var(--ink-soft)" }}>{desc}</p>
    </div>
  );
}
