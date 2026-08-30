import { createContext, useContext, useMemo } from "react";

/**
 * Text lookup — Norwegian (bokmål) only.
 * Usage:
 *   const { t } = useI18n();
 *   <h1>{t("nav.tools")}</h1>
 *
 * Unknown keys fall back to the key itself.
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
    privacy: "Personvern",
    privacyDesc: "Hva som samles inn, sendes til KI og hvordan du sletter det",
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
    box3Cta: "Se katalogen",
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

function get(obj, path) {
  return path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj);
}

const I18nCtx = createContext(null);

export function I18nProvider({ children }) {
  const value = useMemo(() => ({
    t: (key) => {
      const v = get(NO, key);
      return v != null ? v : key;
    },
  }), []);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
