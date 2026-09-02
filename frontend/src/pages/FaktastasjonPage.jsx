import { useEffect, useState } from "react";
import { api, API } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Trash2, X as XIcon, Loader2, Save, ImagePlus, Link2, BookOpen } from "lucide-react";

const CATEGORIES = [
  { key: "person", label: "Person" },
  { key: "sted", label: "Sted" },
  { key: "tidsperiode", label: "Tidsperiode" },
  { key: "gjenstand", label: "Gjenstand" },
  { key: "annet", label: "Annet" },
];
const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]));

export default function FaktastasjonPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("alle");

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get("/research");
      setNotes(r.data || []);
    } catch (e) { console.debug("research load failed", e); toast("Kunne ikke laste faktastasjonen"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const addBlank = async () => {
    try {
      const r = await api.post("/research", { title: "Nytt notat", category: "annet" });
      setNotes((a) => [r.data, ...a]);
      setEditing(r.data);
    } catch (e) { toast("Kunne ikke opprette"); }
  };

  const del = async (id) => {
    if (!window.confirm("Slett dette notatet?")) return;
    try { await api.delete(`/research/${id}`); setNotes((a) => a.filter((n) => n.id !== id)); }
    catch (e) { toast("Kunne ikke slette"); }
  };

  const save = async (upd) => {
    try {
      const r = await api.patch(`/research/${upd.id}`, {
        title: upd.title, category: upd.category, content: upd.content, source_url: upd.source_url,
      });
      const merged = { ...r.data, has_image: upd.has_image };
      setNotes((a) => a.map((n) => (n.id === merged.id ? merged : n)));
      setEditing(merged);
      toast("Lagret");
    } catch (e) { toast(e?.response?.data?.detail || "Kunne ikke lagre"); }
  };

  const onImageUploaded = (id) => {
    setNotes((a) => a.map((n) => (n.id === id ? { ...n, has_image: true } : n)));
    setEditing((e) => (e && e.id === id ? { ...e, has_image: true } : e));
  };

  const visible = filter === "alle" ? notes : notes.filter((n) => n.category === filter);

  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16">
      <div className="fade-in">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <div className="label-ui">Undersøkelser</div>
            <h1 className="font-serif-display text-5xl font-light mt-3" style={{ color: "var(--ink)" }}>
              Bakgrunnen for historien
            </h1>
          </div>
          <button
            onClick={addBlank}
            className="inline-flex items-center gap-2 px-4 py-2 font-mono-ui text-[11px] tracking-widest"
            style={{ background: "var(--ink)", color: "var(--paper)" }}
            data-testid="research-add-btn"
          >
            <Plus size={14} strokeWidth={1.5} /> NYTT NOTAT
          </button>
        </div>
        <p className="font-editor mt-4 max-w-[65ch]" style={{ color: "var(--ink-soft)" }}>
          Bakgrunnsstoffet du samler underveis — personer, steder, tidsperioder,
          gjenstander. Hold det ved hånden mens du skriver, uten å rote til selve manuset.
        </p>
      </div>

      {/* Category filter */}
      <div className="mt-8 flex items-center gap-2 flex-wrap">
        <FilterChip active={filter === "alle"} onClick={() => setFilter("alle")} label={`Alle (${notes.length})`} />
        {CATEGORIES.map((c) => {
          const count = notes.filter((n) => n.category === c.key).length;
          if (count === 0) return null;
          return <FilterChip key={c.key} active={filter === c.key} onClick={() => setFilter(c.key)} label={`${c.label} (${count})`} />;
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && (
          <div className="col-span-full py-10 text-center">
            <Loader2 size={20} className="animate-spin inline" />
          </div>
        )}
        {!loading && visible.length === 0 && (
          <div className="col-span-full py-10 font-editor italic" style={{ color: "var(--ink-mute)" }}>
            Ingen notater ennå. Klikk "NYTT NOTAT" for å legge til research du vil ha lett tilgjengelig.
          </div>
        )}
        {!loading && visible.map((n) => (
          <button
            key={n.id}
            onClick={() => setEditing(n)}
            className="text-left hover:bg-neutral-50 transition-colors"
            style={{ border: "1px solid var(--line)" }}
            data-testid={`research-card-${n.id}`}
          >
            {n.has_image && (
              <img
                src={`${API}/research/${n.id}/image`}
                alt=""
                className="w-full h-36 object-cover"
                draggable={false}
              />
            )}
            <div className="p-5">
              <div className="flex items-center gap-2">
                <BookOpen size={14} strokeWidth={1.3} style={{ color: "var(--rust)" }} />
                <h3 className="font-serif-display text-xl" style={{ color: "var(--ink)" }}>{n.title}</h3>
              </div>
              <div className="label-ui mt-1">{CATEGORY_LABEL[n.category] || "Annet"}</div>
              {n.content && (
                <p className="mt-3 font-editor text-sm line-clamp-3" style={{ color: "var(--ink-soft)" }}>
                  {n.content}
                </p>
              )}
              {n.source_url && (
                <div className="mt-2 inline-flex items-center gap-1.5 font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--ink-mute)" }}>
                  <Link2 size={11} strokeWidth={1.5} /> KILDE
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {editing && (
        <NoteEditor
          note={editing}
          onClose={() => setEditing(null)}
          onSave={save}
          onDelete={() => { del(editing.id); setEditing(null); }}
          onImageUploaded={onImageUploaded}
        />
      )}
    </div>
  );
}

function FilterChip({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 font-mono-ui text-[11px] tracking-widest"
      style={{
        border: `1px solid ${active ? "var(--ink)" : "var(--line)"}`,
        color: active ? "var(--ink)" : "var(--ink-mute)",
        background: "transparent",
      }}
    >
      {label}
    </button>
  );
}

function NoteEditor({ note, onClose, onSave, onDelete, onImageUploaded }) {
  const [form, setForm] = useState(note);
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  const uploadImage = async () => {
    if (!imageFile || imageUploading) return;
    setImageUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", imageFile);
      await api.post(`/research/${note.id}/image`, fd);
      onImageUploaded(note.id);
      setImageFile(null);
      toast("Bilde lastet opp");
    } catch (err) {
      toast(err?.response?.data?.detail || "Kunne ikke laste opp bildet — prøv igjen");
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(20,18,15,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col"
        style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 hairline-b">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="bg-transparent font-serif-display text-2xl md:text-3xl outline-none flex-1"
            style={{ color: "var(--ink)" }}
            data-testid="research-editor-title"
          />
          <button onClick={onClose} className="p-2 hover:opacity-70" style={{ color: "var(--ink-mute)" }}>
            <XIcon size={18} strokeWidth={1.3} />
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-5 space-y-5">
          <div>
            <div className="label-ui mb-2">Kategori</div>
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setForm({ ...form, category: c.key })}
                  className="px-3 py-1.5 font-mono-ui text-[11px] tracking-widest"
                  style={{
                    border: `1px solid ${form.category === c.key ? "var(--ink)" : "var(--line)"}`,
                    color: form.category === c.key ? "var(--ink)" : "var(--ink-mute)",
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="label-ui mb-2">Notat</div>
            <textarea
              value={form.content || ""}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Det du vil huske — detaljer, research, observasjoner"
              className="w-full bg-transparent font-editor text-base outline-none resize-y min-h-[140px] p-3"
              style={{ color: "var(--ink)", border: "1px solid var(--line)" }}
            />
          </div>

          <div>
            <div className="label-ui mb-2">Kilde (valgfritt)</div>
            <input
              value={form.source_url || ""}
              onChange={(e) => setForm({ ...form, source_url: e.target.value })}
              placeholder="https://…"
              className="input-line"
              data-testid="research-editor-source"
            />
          </div>

          <div>
            <div className="label-ui mb-2">Bilde (valgfritt)</div>
            {form.has_image && (
              <img
                src={`${API}/research/${form.id}/image`}
                alt=""
                className="w-full max-h-52 object-cover mb-3"
              />
            )}
            <div className="flex items-center gap-3 flex-wrap">
              <label className="btn-ghost inline-flex items-center gap-2 cursor-pointer" style={{ padding: "0.5rem 0.9rem" }}>
                <ImagePlus size={14} strokeWidth={1.6} />
                {imageFile ? imageFile.name.slice(0, 24) : "Velg bilde"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  data-testid="research-editor-image-input"
                />
              </label>
              {imageFile && (
                <button
                  onClick={uploadImage}
                  disabled={imageUploading}
                  className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"
                  style={{ padding: "0.5rem 0.9rem", fontSize: "0.75rem" }}
                  data-testid="research-editor-image-submit"
                >
                  {imageUploading ? "Laster opp…" : "Last opp"}
                </button>
              )}
            </div>
          </div>
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
              data-testid="research-editor-save"
            >
              <Save size={13} strokeWidth={1.5} /> LAGRE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
