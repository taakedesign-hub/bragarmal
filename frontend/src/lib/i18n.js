import { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * Lightweight i18n — no external deps.
 * Usage:
 *   const { t, lang, setLang } = useI18n();
 *   <h1>{t("nav.tools")}</h1>
 *
 * Untranslated keys fall back to Norwegian, then to the key itself.
 */

const NO = {
  nav: {
    information: "Informasjon",
    tools: "Skrivepult",
    author: "Forfatter",
    illustrator: "Illustratør",
    login: "Logg inn",
    logout: "Logg ut",
    home: "Gå til forsiden",
  },
  info: {
    aboutApp: "Om appen",
    yourTools: "Dine verktøy",
    contact: "Kontakt",
    manifest: "Manifest",
    manifestDesc: "Original + AI-redigert side om side",
    examples: "Eksempler",
    examplesDesc: "Når hjelper Bragarmål deg — seks scenarier",
    ethics: "Etikk",
    ethicsDesc: "Etisk AI-skriving. Regler, arbeidsflyt, selvsjekk",
    pricing: "Priser",
    pricingDesc: "Månedlig, 3, 6, 12 mnd — alt i NOK",
    yourPage: "Din side",
    yourPageDesc: "Alle verktøy og hjelpemidler samlet",
    samples: "Prøver",
    samplesDesc: "Lim inn, last opp fil, foto, høytlesning",
    voice: "Stemmeprofil",
    voiceDesc: "Analyser rytme, tone og signaturord",
    write: "Skriv",
    writeDesc: "Skrivepulten — sparr med Bragarmål i din stemme",
    manuscript: "Manuskript",
    manuscriptDesc: "Oversikt over scener, POV, status og ordantall",
    characters: "Karakterer",
    charactersDesc: "Psykologiske profiler — bygg selv eller hent fra manuskript",
    tips: "Tips",
    tipsDesc: "Praktiske råd for forfattere",
    sendEmail: "Send e-post",
  },
  landing: {
    heroKicker: "Skriveverktøy for forfattere som vil beholde sin egen stemme",
    heroTitleA: "Skrive med",
    heroTitleB: "din egen stemme",
    heroTitleC: ".",
    heroBody: "Bragarmål er et redaksjonelt AI-verktøy for forfattere som er lei av AI-tekst som låter som alle andre. Vi lærer stemmen din — rytme, ordvalg, humor, alvor — og gir deg forslag som ligner deg, ikke maskinen.",
    tryFree: "Prøv gratis i 2 uker",
    tryFreeSub: "deretter månedlig medlemskap",
    beta: "Beta-versjon — gratis i 3 mnd",
    betaSub: "for de 10 første som registrerer seg",
    seePricing: "Se priser",
    seePricingSub: "månedlig, 3, 6 eller 12 måneder",
    tipsKicker: "Praktiske råd",
    tipsTitleA: "Samlet på",
    tipsTitleB: "ett sted",
    tipsBody: "Ting som er nyttige å vite når du skriver — disposisjon, stipend, forlagskontakt, følgebrev.",
    tipsAccess: "Kun for innloggede",
    tipsCta: "Åpne tips",
    box2Title: "Når hjelper Bragarmål deg?",
    box2Sub: "Måter Bragarmål hjelper deg videre — uten å ta over.",
    box2Cta: "Vis eksempler",
    box3Cta: "Les hele",
    box4Cta: "Etikk",
    box5Title1: "Personlig side med alle",
    box5Title2: "hjelpemidler og verktøy",
    box5Cta: "Til verktøyene",
    box6Title1: "Kom i gang —",
    box6Title2: "registrer deg nå",
    box6Sub: "Dine data er dine. Slett når du selv ønsker det.",
    box6Cta: "Logg inn",
  },
  heroBelow: {
    kicker: "For deg som står fast",
    titleA: "DIN stemme",
    titleB: "er din.",
    p1a: "Vi genererer ikke ord.",
    p1b: "Vi finner din stemme.",
    p2: "Ingen rask metode for å publisere. Kun et verktøy som tar deg videre — på dine premisser.",
    ninorseA: "er norrønt og står for",
    ninorseB: "skaldens språk",
    ninorseC: "— den fremste diktekunst.",
  },
  manifestSec: {
    fromNina: "Fra Nina",
    aside: "Manifest, skrevet uredigert av forfatteren selv.",
    p1: "Etter utallige påbegynte prosjekt og perioder med skrivesperre, sendte mitt nåværende bokprosjekt over 3 år meg ut på jakt etter skrivehjelp. Seriøse aktører ble for dyre, og AI tok bort det menneskelige aspektet som endret min egenart og fortellerstemme. Det ble rett og slett altfor glatt og perfeksjonert.",
    p2a: "Derfor lagde jeg",
    p2b: ": for å få den beste hjelpen mulig, til en overkommelig pris — på mine premisser, med min stemme intakt.",
    quote: "Bragarmål er en AI-basert tjeneste, som ivaretar fortellerstemmen din og hjelper deg videre når du står fast. Jo mer du legger inn, jo bedre resultat får du.",
    p3: "Bruk stemmen din ved å lese inn (fint for skrivevansker og for å fange rytme, stil, etc.), legg inn bilder av gamle håndskrevne tekster, last opp filer, skriv notater og mer.",
    p4: "Bragarmål er ikke en kjapp løsning som skriver boken (eller prosjektet) for deg.",
    p5a: "Bragarmål er for deg som forstår at det tar tid å bearbeide fortellingen, teksten din, rytmen — men vil ha veiledning og drahjelp når det låser seg. Eller hjelp til å komme i gang —",
    p5b: "med DIN fortellerstemme intakt.",
    readAll: "Les hele manifestet",
    ethicsLink: "Etisk AI-skriving →",
  },
  sparring: {
    kicker: "Filosofi",
    titleA: "Sparrings\u00adpartner. Ikke",
    titleB: "tekstautomat",
    intro: "Bruk Bragarmål — og AI generelt — som en sparringspartner. Ikke for å få ferdige, glatte tekster ut av en prompt. Verktøyet blir bedre jo lengre du jobber med det. Øvelse over tid. Din stemme, gjentatt.",
    q1: "«Jeg har en tendens til å gjenta meg selv, både når jeg prater og når jeg skriver. Dette hjelper AI meg ved å gå gjennom teksten og luke ut.»",
    q2: "«Kjapp i vendingen er jeg også, noe som fører både til skrivefeil og tidvis dårlige setninger. Der jeg kan ender jeg som regel opp med tidkrevende redigering. Kunne selvsagt jobbet med dette, men det er et personlighetstrekk, så da velger jeg heller å lage en app som hjelper meg.»",
    aiVersion: "AI-versjon",
    aiP1: "Det er nettopp slik det skal brukes. Ikke som en som skriver for deg, men som en som ser deg. Som luker der du gjentar deg selv. Som stopper opp der du hopper for fort. Som spør: er dette virkelig det du mente?",
    aiP2: "Prompten er ikke bestillingen. Prompten er samtalen.",
  },
  entry: {
    kicker: "Fire måter å mate inn på",
    titleA: "Alt du har, i",
    titleB: "din stemme",
    titleC: ".",
    sub1: "Jo mer materiale du mater inn, jo mer nøyaktig blir",
    sub2: "«din stemme»-lakmusen",
    sub3: ".",
    e1t: "Lim inn",
    e1b: "Kladder, meldinger, avsnitt du har liggende — bare kopier og lim.",
    e2t: "Last opp fil",
    e2b: ".txt, .md, .pdf, .docx. Nedskrevet materiale du har fra før.",
    e3t: "Foto av håndskrift",
    e3b: "Fotografer gamle notatbøker og brev. Håndskriften blir tekst.",
    e4t: "Høytlesning",
    e4b: "Les direkte inn, eller last opp opptak. Muntlig fortellerstemme bevart.",
  },
  modelRow: {
    kicker: "Sammenslått støtte fra",
    byok: "+ Legg til din egen",
    byokSub: "(med API-nøkkel)",
  },
  footer: {
    tagline: "et verktøy for kreativ skriving",
    contact: "Kontakt",
  },
  dashboard: {
    welcome: "Velkommen til",
    writingDesk: "skrivepulten",
  },
  common: {
    back: "Tilbake",
  },
};

const EN = {
  nav: {
    information: "Information",
    tools: "Writing desk",
    author: "Author",
    illustrator: "Illustrator",
    login: "Log in",
    logout: "Log out",
    home: "Go to homepage",
  },
  info: {
    aboutApp: "About the app",
    yourTools: "Your tools",
    contact: "Contact",
    manifest: "Manifesto",
    manifestDesc: "Original + AI-edited, side by side",
    examples: "Examples",
    examplesDesc: "When Bragarmål helps you — six scenarios",
    ethics: "Ethics",
    ethicsDesc: "Ethical AI writing. Rules, workflow, self-check",
    pricing: "Pricing",
    pricingDesc: "Monthly, 3, 6, 12 months — all in NOK",
    yourPage: "Your page",
    yourPageDesc: "All tools and aids in one place",
    samples: "Samples",
    samplesDesc: "Paste, upload file, photo, read aloud",
    voice: "Voice profile",
    voiceDesc: "Analyse rhythm, tone and signature words",
    write: "Write",
    writeDesc: "The writing desk — spar with Bragarmål in your voice",
    manuscript: "Manuscript",
    manuscriptDesc: "Scenes, POV, status and word count at a glance",
    characters: "Characters",
    charactersDesc: "Psychological profiles — build them or extract from manuscript",
    tips: "Tips",
    tipsDesc: "Practical advice for authors",
    sendEmail: "Send email",
  },
  landing: {
    heroKicker: "A writing tool for authors who want to keep their own voice",
    heroTitleA: "Writing with",
    heroTitleB: "your own voice",
    heroTitleC: ".",
    heroBody: "Bragarmål is an editorial AI tool for authors tired of AI text that sounds like everyone else. We learn your voice — rhythm, word choice, humour, gravity — and give you suggestions that sound like you, not the machine.",
    tryFree: "Try free for 2 weeks",
    tryFreeSub: "then monthly membership",
    beta: "Beta — free for 3 months",
    betaSub: "for the first 10 to sign up",
    seePricing: "See pricing",
    seePricingSub: "monthly, 3, 6 or 12 months",
    tipsKicker: "Practical advice",
    tipsTitleA: "All in",
    tipsTitleB: "one place",
    tipsBody: "Things worth knowing when you write — outlining, grants, publisher contacts, cover letters.",
    tipsAccess: "For members only",
    tipsCta: "Open tips",
    box2Title: "When does Bragarmål help you?",
    box2Sub: "Ways Bragarmål helps you move forward — without taking over.",
    box2Cta: "See examples",
    box3Cta: "Read it all",
    box4Cta: "Ethics",
    box5Title1: "A personal page with all",
    box5Title2: "your tools and aids",
    box5Cta: "To the tools",
    box6Title1: "Get started —",
    box6Title2: "sign up now",
    box6Sub: "Your data is yours. Delete it whenever you want.",
    box6Cta: "Log in",
  },
  heroBelow: {
    kicker: "For those who get stuck",
    titleA: "YOUR voice",
    titleB: "is yours.",
    p1a: "We don't generate words.",
    p1b: "We find your voice.",
    p2: "No quick shortcut to publishing. Just a tool that moves you forward — on your terms.",
    ninorseA: "is Old Norse and means",
    ninorseB: "the language of the skald",
    ninorseC: "— the highest form of poetic art.",
  },
  manifestSec: {
    fromNina: "From Nina",
    aside: "Manifesto, written unedited by the author herself.",
    p1: "After countless abandoned projects and long stretches of writer's block, my current book project — three years in the making — sent me searching for writing help. Real editors were too expensive, and AI stripped away the human aspect that made my voice mine. Everything came out too smooth, too polished.",
    p2a: "So I built",
    p2b: ": to get the best help I could afford — on my terms, with my voice intact.",
    quote: "Bragarmål is an AI-based service that preserves your narrative voice and helps you move forward when you get stuck. The more you give it, the better it gets.",
    p3: "Use your voice by reading aloud (great for writing difficulties and for capturing rhythm and style), upload photos of old handwritten texts, upload files, take notes and more.",
    p4: "Bragarmål is not a quick solution that writes the book (or project) for you.",
    p5a: "Bragarmål is for those who understand that shaping a story, your text, your rhythm takes time — but who want guidance and a push when they get stuck. Or help getting started —",
    p5b: "with YOUR narrative voice intact.",
    readAll: "Read the full manifesto",
    ethicsLink: "Ethical AI writing →",
  },
  sparring: {
    kicker: "Philosophy",
    titleA: "A sparring partner. Not a",
    titleB: "text machine",
    intro: "Use Bragarmål — and AI in general — as a sparring partner. Not for finished, polished prompt-output. The tool improves the longer you work with it. Practice over time. Your voice, repeated.",
    q1: "«I tend to repeat myself, both when I talk and when I write. AI helps me by going through the text and pruning.»",
    q2: "«I'm quick off the mark, which leads to typos and sometimes clumsy sentences. Where I can, I end up doing time-consuming edits. I could work on it, but it's a personality trait — so I'd rather build an app that helps me.»",
    aiVersion: "AI version",
    aiP1: "This is exactly how it should be used. Not as something that writes for you, but as something that sees you. That prunes where you repeat yourself. That stops where you rush. That asks: is this really what you meant?",
    aiP2: "The prompt is not an order. The prompt is a conversation.",
  },
  entry: {
    kicker: "Four ways to feed it in",
    titleA: "Everything you have, in",
    titleB: "your voice",
    titleC: ".",
    sub1: "The more material you feed in, the sharper the",
    sub2: "\"your voice\" litmus test",
    sub3: "becomes.",
    e1t: "Paste in",
    e1b: "Drafts, messages, passages you have lying around — just copy and paste.",
    e2t: "Upload file",
    e2b: ".txt, .md, .pdf, .docx. Written material you already have.",
    e3t: "Photo of handwriting",
    e3b: "Photograph old notebooks and letters. Handwriting becomes text.",
    e4t: "Read aloud",
    e4b: "Record directly, or upload audio. Spoken narrative voice preserved.",
  },
  modelRow: {
    kicker: "Combined support from",
    byok: "+ Add your own",
    byokSub: "(with API key)",
  },
  footer: {
    tagline: "a tool for creative writing",
    contact: "Contact",
  },
  dashboard: {
    welcome: "Welcome to",
    writingDesk: "the writing desk",
  },
  common: {
    back: "Back",
  },
};

const DICTS = { no: NO, en: EN };
const STORAGE_KEY = "bragr_lang";

function get(obj, path) {
  return path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj);
}

const I18nCtx = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === "undefined") return "no";
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "no" || saved === "en") return saved;
    // Detect browser language
    const nav = (navigator.language || "").toLowerCase();
    return nav.startsWith("no") || nav.startsWith("nb") || nav.startsWith("nn") ? "no" : "en";
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* ignore quota errors */ }
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
    }
  }, [lang]);

  const value = useMemo(() => ({
    lang,
    setLang: (v) => setLangState(v === "en" ? "en" : "no"),
    t: (key) => {
      const primary = get(DICTS[lang], key);
      if (primary != null) return primary;
      const fallback = get(DICTS.no, key);
      return fallback != null ? fallback : key;
    },
  }), [lang]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
