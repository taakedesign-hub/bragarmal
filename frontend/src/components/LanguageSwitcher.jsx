import { useI18n } from "@/lib/i18n";

/**
 * Compact NO/EN switcher with SVG flag icons (no external deps).
 * Renders as two small buttons; active language is bolded.
 */
export default function LanguageSwitcher({ className = "" }) {
  const { lang, setLang } = useI18n();

  return (
    <div
      className={`inline-flex items-center gap-1 ${className}`}
      role="group"
      aria-label="Language"
      data-testid="lang-switcher"
    >
      <button
        type="button"
        onClick={() => setLang("no")}
        aria-pressed={lang === "no"}
        aria-label="Norsk"
        data-testid="lang-no"
        className="inline-flex items-center gap-1 px-1.5 py-1 label-ui"
        style={{
          color: lang === "no" ? "var(--ink)" : "var(--ink-mute)",
          opacity: lang === "no" ? 1 : 0.7,
        }}
      >
        <FlagNO />
        <span className="hidden md:inline">NO</span>
      </button>
      <span aria-hidden="true" style={{ color: "var(--line)" }}>·</span>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        aria-label="English"
        data-testid="lang-en"
        className="inline-flex items-center gap-1 px-1.5 py-1 label-ui"
        style={{
          color: lang === "en" ? "var(--ink)" : "var(--ink-mute)",
          opacity: lang === "en" ? 1 : 0.7,
        }}
      >
        <FlagGB />
        <span className="hidden md:inline">EN</span>
      </button>
    </div>
  );
}

/** Norwegian flag — simple, accurate 22×16 SVG */
function FlagNO() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true" style={{ display: "block", border: "1px solid var(--line)" }}>
      <rect width="22" height="16" fill="#BA0C2F" />
      <rect x="6" width="2" height="16" fill="#FFFFFF" />
      <rect y="7" width="22" height="2" fill="#FFFFFF" />
      <rect x="6.5" width="1" height="16" fill="#00205B" />
      <rect y="7.5" width="22" height="1" fill="#00205B" />
    </svg>
  );
}

/** UK flag — Union Jack simplified 22×16 SVG */
function FlagGB() {
  return (
    <svg width="22" height="16" viewBox="0 0 60 30" aria-hidden="true" style={{ display: "block", border: "1px solid var(--line)" }}>
      <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
      <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
      <g clipPath="url(#s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
      </g>
    </svg>
  );
}
