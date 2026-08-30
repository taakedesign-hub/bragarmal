/**
 * Compact bokmål/nynorsk switch. Controls which dictionary the browser's
 * own spellchecker uses on writing textareas (via their `lang` attribute) —
 * doesn't touch anything server-side.
 */
export default function WrittenFormToggle({ form, onChange, className = "" }) {
  return (
    <div className={`inline-flex items-center ${className}`} role="group" aria-label="Skriftspråk for stavekontroll">
      <button
        type="button"
        onClick={() => onChange("nb")}
        aria-pressed={form === "nb"}
        data-testid="written-form-nb"
        className="px-2.5 py-1 font-mono-ui text-[10px] tracking-widest"
        style={{
          border: `1px solid ${form === "nb" ? "var(--ink)" : "var(--line)"}`,
          color: form === "nb" ? "var(--ink)" : "var(--ink-mute)",
          background: "transparent",
        }}
      >
        BOKMÅL
      </button>
      <button
        type="button"
        onClick={() => onChange("nn")}
        aria-pressed={form === "nn"}
        data-testid="written-form-nn"
        className="px-2.5 py-1 -ml-px font-mono-ui text-[10px] tracking-widest"
        style={{
          border: `1px solid ${form === "nn" ? "var(--ink)" : "var(--line)"}`,
          color: form === "nn" ? "var(--ink)" : "var(--ink-mute)",
          background: "transparent",
        }}
      >
        NYNORSK
      </button>
    </div>
  );
}
