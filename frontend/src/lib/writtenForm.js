import { useCallback, useState } from "react";

const KEY = "bragr_written_form";

export function getWrittenForm() {
  if (typeof window === "undefined") return "nb";
  try {
    const v = localStorage.getItem(KEY);
    return v === "nn" ? "nn" : "nb";
  } catch {
    return "nb";
  }
}

/**
 * Per-device written-form preference (bokmål/nynorsk), used to set `lang`
 * on writing textareas so the browser's own spellchecker picks the right
 * dictionary. Not synced to the account — purely a local UI convenience.
 */
export function useWrittenForm() {
  const [form, setFormState] = useState(getWrittenForm);

  const setForm = useCallback((v) => {
    const next = v === "nn" ? "nn" : "nb";
    setFormState(next);
    try { localStorage.setItem(KEY, next); } catch { /* ignore quota errors */ }
  }, []);

  return [form, setForm];
}
