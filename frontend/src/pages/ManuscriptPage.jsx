import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, X as XIcon, Loader2, BookOpen, Save } from "lucide-react";

const STATUS_META = {
  skisse:   { label: "Skisse",   color: "#a6a29a" },
  utkast:   { label: "Utkast",   color: "#B8724A" },
  revidert: { label: "Revidert", color: "#5c7a4a" },
  ferdig:   { label: "Ferdig",   color: "#3a5a2a" },
};

const COLUMNS = [
  { key: "order",       label: "#",        w: "w-12"  },
  { key: "title",       label: "Tittel",   w: "min-w-[220px]" },
  { key: "synopsis",    label: "Synopsis", w: "min-w-[260px]" },
  { key: "pov",         label: "POV",      w: "w-32"  },
  { key: "location",    label: "Sted",     w: "w-32"  },
  { key: "scene_date",  label: "Tid",      w: "w-28"  },
  { key: "status",      label: "Status",   w: "w-32"  },
  { key: "word_count",  label: "Ord",      w: "w-20"  },
];

export default function ManuscriptPage() {
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState("order");
  const [sortDir, setSortDir] = useState("asc");
  const [showSynopsis, setShowSynopsis] = useState(true);
  const [editorScene, setEditorScene] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get("/manuscript");
      setScenes(r.data || []);
    } catch (e) {
      console.debug("manuscript load failed", e);
      toast("Kunne ikke laste manuskript");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const sorted = useMemo(() => {
    const arr = [...scenes];
    arr.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av === bv) return 0;
      if (av === undefined || av === null || av === "") return 1;
      if (bv === undefined || bv === null || bv === "") return -1;
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv), "nb")
        : String(bv).localeCompare(String(av), "nb");
    });
    return arr;
  }, [scenes, sortKey, sortDir]);

  const totalWords = useMemo(() => scenes.reduce((s, x) => s + (x.word_count || 0), 0), [scenes]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const addScene = async () => {
    try {
      const r = await api.post("/manuscript", { title: `Scene ${scenes.length + 1}` });
      setScenes((arr) => [...arr, r.data]);
      toast("Scene lagt til");
    } catch (e) { toast(e?.response?.data?.detail || "Kunne ikke legge til"); }
  };

  const patchScene = async (id, patch) => {
    // Optimistic
    setScenes((arr) => arr.map((s) => s.id === id ? { ...s, ...patch } : s));
    try { await api.patch(`/manuscript/${id}`, patch); }
    catch (e) { toast(e?.response?.data?.detail || "Kunne ikke lagre"); load(); }
  };

  const removeScene = async (id) => {
    if (!window.confirm("Slett denne scenen?")) return;
    setScenes((arr) => arr.filter((s) => s.id !== id));
    try { await api.delete(`/manuscript/${id}`); }
    catch (e) { toast("Kunne ikke slette"); load(); }
  };

  const moveScene = async (id, dir) => {
    // Only meaningful when sortKey === "order" — reorder by shifting indices
    const ordered = [...scenes].sort((a, b) => a.order - b.order);
    const idx = ordered.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const target = dir === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= ordered.length) return;
    [ordered[idx], ordered[target]] = [ordered[target], ordered[idx]];
    const reordered = ordered.map((s, i) => ({ ...s, order: i }));
    setScenes(reordered);
    try { await api.post("/manuscript/reorder", { ordered_ids: reordered.map((s) => s.id) }); }
    catch (e) { toast("Kunne ikke omorganisere"); load(); }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
      {/* Header */}
      <div className="fade-in">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <div className="label-ui">Manuskript</div>
            <h1 className="font-serif-display text-5xl font-light mt-3" style={{ color: "var(--ink)" }}>
              Oversikt
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <span className="label-ui">
              {scenes.length} scener · {totalWords.toLocaleString("nb-NO")} ord
            </span>
            <button
              onClick={() => setShowSynopsis((v) => !v)}
              className="font-mono-ui text-[11px] tracking-widest hover:underline"
              style={{ color: "var(--ink-mute)" }}
              data-testid="ms-toggle-synopsis"
            >
              {showSynopsis ? "SKJUL SYNOPSIS" : "VIS SYNOPSIS"}
            </button>
            <button
              onClick={addScene}
              className="inline-flex items-center gap-2 px-4 py-2 font-mono-ui text-[11px] tracking-widest"
              style={{ background: "var(--ink)", color: "var(--paper)" }}
              data-testid="ms-add-scene"
            >
              <Plus size={14} strokeWidth={1.5} />
              NY SCENE
            </button>
          </div>
        </div>
        <p className="font-editor mt-4 max-w-[65ch]" style={{ color: "var(--ink-soft)" }}>
          Se hele manuskriptet på ett brett. Sorter, rediger og hold oversikt over
          POV, stedslegninger, statuser og ordantall. Klikk på en scene for å redigere innholdet.
        </p>
      </div>

      {/* Table */}
      <div className="mt-10 overflow-x-auto">
        <table className="w-full text-left" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr className="hairline-b">
              {COLUMNS.filter((c) => showSynopsis || c.key !== "synopsis").map((c) => (
                <th
                  key={c.key}
                  className={`py-3 pr-4 label-ui cursor-pointer hover:underline ${c.w}`}
                  onClick={() => toggleSort(c.key)}
                  data-testid={`ms-header-${c.key}`}
                >
                  {c.label}
                  {sortKey === c.key && (
                    <ChevronDown
                      size={11}
                      className={`inline ml-1 transition-transform ${sortDir === "desc" ? "rotate-180" : ""}`}
                    />
                  )}
                </th>
              ))}
              <th className="py-3 label-ui w-32">Handlinger</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={COLUMNS.length + 1} className="py-10 text-center">
                <Loader2 size={20} className="animate-spin inline" style={{ color: "var(--ink-mute)" }} />
              </td></tr>
            )}
            {!loading && sorted.length === 0 && (
              <tr><td colSpan={COLUMNS.length + 1} className="py-10 font-editor italic" style={{ color: "var(--ink-mute)" }}>
                Ingen scener ennå. Klikk «Ny scene» for å komme i gang.
              </td></tr>
            )}
            {!loading && sorted.map((s, i) => (
              <tr key={s.id} className="hairline-b hover:bg-neutral-50 transition-colors" data-testid={`ms-row-${s.id}`}>
                <td className="py-3 pr-4 font-mono-ui text-xs" style={{ color: "var(--ink-mute)" }}>
                  {String(i + 1).padStart(2, "0")}
                </td>
                <td className="py-3 pr-4">
                  <input
                    className="w-full bg-transparent font-serif-display text-lg outline-none"
                    style={{ color: "var(--ink)" }}
                    defaultValue={s.title}
                    onBlur={(e) => e.target.value !== s.title && patchScene(s.id, { title: e.target.value })}
                    data-testid={`ms-title-${s.id}`}
                  />
                </td>
                {showSynopsis && (
                  <td className="py-3 pr-4">
                    <input
                      className="w-full bg-transparent font-editor text-sm outline-none"
                      style={{ color: "var(--ink-soft)" }}
                      placeholder="Kort sammendrag …"
                      defaultValue={s.synopsis || ""}
                      onBlur={(e) => e.target.value !== (s.synopsis || "") && patchScene(s.id, { synopsis: e.target.value })}
                    />
                  </td>
                )}
                <td className="py-3 pr-4">
                  <input
                    className="w-full bg-transparent font-editor text-sm outline-none"
                    style={{ color: "var(--ink)" }}
                    placeholder="POV"
                    defaultValue={s.pov || ""}
                    onBlur={(e) => e.target.value !== (s.pov || "") && patchScene(s.id, { pov: e.target.value })}
                  />
                </td>
                <td className="py-3 pr-4">
                  <input
                    className="w-full bg-transparent font-editor text-sm outline-none"
                    style={{ color: "var(--ink)" }}
                    placeholder="Sted"
                    defaultValue={s.location || ""}
                    onBlur={(e) => e.target.value !== (s.location || "") && patchScene(s.id, { location: e.target.value })}
                  />
                </td>
                <td className="py-3 pr-4">
                  <input
                    className="w-full bg-transparent font-editor text-sm outline-none"
                    style={{ color: "var(--ink)" }}
                    placeholder="Tid"
                    defaultValue={s.scene_date || ""}
                    onBlur={(e) => e.target.value !== (s.scene_date || "") && patchScene(s.id, { scene_date: e.target.value })}
                  />
                </td>
                <td className="py-3 pr-4">
                  <select
                    className="bg-transparent font-mono-ui text-[11px] tracking-widest outline-none cursor-pointer"
                    style={{ color: STATUS_META[s.status]?.color || "var(--ink)" }}
                    value={s.status}
                    onChange={(e) => patchScene(s.id, { status: e.target.value })}
                    data-testid={`ms-status-${s.id}`}
                  >
                    {Object.entries(STATUS_META).map(([k, v]) => (
                      <option key={k} value={k}>{v.label.toUpperCase()}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3 pr-4 font-mono-ui text-xs" style={{ color: "var(--ink-mute)" }}>
                  {s.word_count || 0}
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveScene(s.id, "up")}
                      title="Flytt opp"
                      disabled={sortKey !== "order"}
                      className="p-1.5 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ color: "var(--ink-mute)" }}
                    >
                      <ArrowUp size={13} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => moveScene(s.id, "down")}
                      title="Flytt ned"
                      disabled={sortKey !== "order"}
                      className="p-1.5 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ color: "var(--ink-mute)" }}
                    >
                      <ArrowDown size={13} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => setEditorScene(s)}
                      title="Rediger innhold"
                      className="p-1.5 hover:bg-neutral-100"
                      style={{ color: "var(--rust)" }}
                      data-testid={`ms-open-${s.id}`}
                    >
                      <BookOpen size={13} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => removeScene(s.id)}
                      title="Slett"
                      className="p-1.5 hover:bg-neutral-100"
                      style={{ color: "var(--ink-mute)" }}
                      data-testid={`ms-delete-${s.id}`}
                    >
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editorScene && (
        <SceneContentEditor
          scene={editorScene}
          onClose={() => setEditorScene(null)}
          onSaved={(u) => { setScenes((arr) => arr.map((s) => s.id === u.id ? u : s)); setEditorScene(u); }}
        />
      )}
    </div>
  );
}

function SceneContentEditor({ scene, onClose, onSaved }) {
  const [content, setContent] = useState(scene.content || "");
  const [title, setTitle] = useState(scene.title || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  const dirty = title !== (scene.title || "") || content !== (scene.content || "");
  const wc = content.trim() ? content.trim().split(/\s+/).length : 0;

  const save = async () => {
    setSaving(true);
    try {
      const r = await api.patch(`/manuscript/${scene.id}`, { title, content });
      toast("Lagret");
      onSaved(r.data);
    } catch (e) {
      toast(e?.response?.data?.detail || "Kunne ikke lagre");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(20,18,15,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] flex flex-col"
        style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 hairline-b">
          <span className="label-ui">Sceneinnhold · {wc} ord</span>
          <button onClick={onClose} className="p-2 hover:opacity-70" style={{ color: "var(--ink-mute)" }}>
            <XIcon size={18} strokeWidth={1.3} />
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent font-serif-display text-2xl md:text-3xl outline-none"
            style={{ color: "var(--ink)" }}
          />
          <div className="hairline-b mt-3" />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Skriv scenen …"
            className="w-full mt-4 bg-transparent font-editor text-base outline-none resize-none leading-relaxed"
            style={{ color: "var(--ink)", minHeight: "50vh" }}
          />
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 hairline-t">
          <button onClick={onClose} className="font-mono-ui text-[11px] tracking-widest hover:opacity-70" style={{ color: "var(--ink-mute)" }}>
            LUKK
          </button>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-2 px-4 py-2 font-mono-ui text-[11px] tracking-widest disabled:opacity-40"
            style={{ background: "var(--ink)", color: "var(--paper)" }}
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} strokeWidth={1.5} />}
            LAGRE
          </button>
        </div>
      </div>
    </div>
  );
}
