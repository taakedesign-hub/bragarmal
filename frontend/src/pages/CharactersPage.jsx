import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Trash2, X as XIcon, Loader2, Sparkles, User as UserIcon, Save } from "lucide-react";

const FIELDS = [
  { key: "role",            label: "Rolle",            placeholder: "F.eks. protagonist, sidekick, antagonist" },
  { key: "appearance",      label: "Utseende",         placeholder: "Fysisk beskrivelse" },
  { key: "inner_struggle",  label: "Indre kamp",       placeholder: "Hva sliter karakteren med innerst inne?" },
  { key: "outer_struggle",  label: "Ytre kamp",        placeholder: "Konflikten i verden rundt" },
  { key: "relationships",   label: "Relasjoner",       placeholder: "Til andre karakterer" },
  { key: "arc",             label: "Karakterbue",      placeholder: "Hvordan endrer denne seg gjennom historien?" },
  { key: "voice_notes",     label: "Stemme/dialog",    placeholder: "Særtrekk ved hvordan karakteren snakker" },
];

export default function CharactersPage() {
  const [chars, setChars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get("/characters");
      setChars(r.data || []);
    } catch (e) { console.debug("chars load failed", e); toast("Kunne ikke laste karakterer"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const addBlank = async () => {
    try {
      const r = await api.post("/characters", { name: "Ny karakter" });
      setChars((a) => [...a, r.data]);
      setEditing(r.data);
    } catch (e) { toast("Kunne ikke opprette"); }
  };

  const extract = async () => {
    setExtracting(true);
    try {
      const r = await api.post("/characters/extract", {}, { timeout: 90000 });
      toast(`${r.data.count} karakter${r.data.count === 1 ? "" : "er"} hentet fra manuskriptet`);
      await load();
    } catch (e) {
      toast(e?.response?.data?.detail || "AI-uttrekk feilet");
    } finally { setExtracting(false); }
  };

  const del = async (id) => {
    if (!window.confirm("Slett denne karakteren?")) return;
    try { await api.delete(`/characters/${id}`); setChars((a) => a.filter((c) => c.id !== id)); }
    catch (e) { toast("Kunne ikke slette"); }
  };

  const save = async (upd) => {
    try {
      const r = await api.patch(`/characters/${upd.id}`, upd);
      setChars((a) => a.map((c) => c.id === r.data.id ? r.data : c));
      setEditing(r.data);
      toast("Lagret");
    } catch (e) { toast(e?.response?.data?.detail || "Kunne ikke lagre"); }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16">
      <div className="fade-in">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <div className="label-ui">Karakterer</div>
            <h1 className="font-serif-display text-5xl font-light mt-3" style={{ color: "var(--ink)" }}>
              Persongalleriet
            </h1>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={extract}
              disabled={extracting}
              className="inline-flex items-center gap-2 font-mono-ui text-[11px] tracking-widest hover:underline disabled:opacity-40"
              style={{ color: "var(--rust)" }}
              data-testid="chars-extract-btn"
            >
              {extracting ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} strokeWidth={1.5} />}
              {extracting ? "HENTER…" : "HENT FRA MANUSKRIPT"}
            </button>
            <button
              onClick={addBlank}
              className="inline-flex items-center gap-2 px-4 py-2 font-mono-ui text-[11px] tracking-widest"
              style={{ background: "var(--ink)", color: "var(--paper)" }}
              data-testid="chars-add-btn"
            >
              <Plus size={14} strokeWidth={1.5} /> NY KARAKTER
            </button>
          </div>
        </div>
        <p className="font-editor mt-4 max-w-[65ch]" style={{ color: "var(--ink-soft)" }}>
          Psykologiske profiler for hovedpersonene dine. Bragarmål kan lese scenene i /manuskript
          og trekke ut profilene automatisk — eller du bygger dem selv.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && (
          <div className="col-span-full py-10 text-center">
            <Loader2 size={20} className="animate-spin inline" />
          </div>
        )}
        {!loading && chars.length === 0 && (
          <div className="col-span-full py-10 font-editor italic" style={{ color: "var(--ink-mute)" }}>
            Ingen karakterer ennå. Klikk "HENT FRA MANUSKRIPT" hvis du har scener, eller "NY KARAKTER" for å bygge selv.
          </div>
        )}
        {!loading && chars.map((c) => (
          <button
            key={c.id}
            onClick={() => setEditing(c)}
            className="text-left p-5 hover:bg-neutral-50 transition-colors"
            style={{ border: "1px solid var(--line)" }}
            data-testid={`char-card-${c.id}`}
          >
            <div className="flex items-center gap-2">
              <UserIcon size={14} strokeWidth={1.3} style={{ color: "var(--rust)" }} />
              <h3 className="font-serif-display text-xl" style={{ color: "var(--ink)" }}>{c.name}</h3>
            </div>
            {c.role && <div className="label-ui mt-1">{c.role}</div>}
            {c.inner_struggle && (
              <p className="mt-3 font-editor text-sm line-clamp-3" style={{ color: "var(--ink-soft)" }}>
                {c.inner_struggle}
              </p>
            )}
          </button>
        ))}
      </div>

      {editing && (
        <CharacterEditor char={editing} onClose={() => setEditing(null)} onSave={save} onDelete={() => { del(editing.id); setEditing(null); }} />
      )}
    </div>
  );
}

function CharacterEditor({ char, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(char);
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(20,18,15,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col"
        style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 hairline-b">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-transparent font-serif-display text-2xl md:text-3xl outline-none flex-1"
            style={{ color: "var(--ink)" }}
            data-testid="char-editor-name"
          />
          <button onClick={onClose} className="p-2 hover:opacity-70" style={{ color: "var(--ink-mute)" }}>
            <XIcon size={18} strokeWidth={1.3} />
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-5 space-y-5">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <div className="label-ui mb-2">{f.label}</div>
              <textarea
                value={form[f.key] || ""}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full bg-transparent font-editor text-base outline-none resize-y min-h-[70px] p-3"
                style={{ color: "var(--ink)", border: "1px solid var(--line)" }}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between px-6 py-4 hairline-t">
          <button onClick={onDelete} className="inline-flex items-center gap-2 font-mono-ui text-[11px] tracking-widest hover:opacity-70" style={{ color: "var(--ink-mute)" }}>
            <Trash2 size={13} strokeWidth={1.5} /> SLETT
          </button>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="font-mono-ui text-[11px] tracking-widest" style={{ color: "var(--ink-mute)" }}>LUKK</button>
            <button
              onClick={() => onSave(form)}
              className="inline-flex items-center gap-2 px-4 py-2 font-mono-ui text-[11px] tracking-widest"
              style={{ background: "var(--ink)", color: "var(--paper)" }}
              data-testid="char-editor-save"
            >
              <Save size={13} strokeWidth={1.5} /> LAGRE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
