import { useEffect, useMemo, useState } from "react";
import { api, API, BACKEND } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, X as XIcon, Loader2, BookOpen, Save, Download, ScrollText, Camera, RotateCcw, Target, Rows3, LayoutGrid, UserRound, Search, Link2, GripVertical } from "lucide-react";

const RESEARCH_CATEGORY_LABEL = {
  person: "Person",
  sted: "Sted",
  tidsperiode: "Tidsperiode",
  gjenstand: "Gjenstand",
  annet: "Annet",
};

const TAG_PALETTE = ["#8A4B2A", "#5c7a4a", "#c8432c", "#4a6b7a", "#8a6a4a", "#6a5a7a"];
function tagColor(tag) {
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) >>> 0;
  return TAG_PALETTE[h % TAG_PALETTE.length];
}
import { useWrittenForm } from "@/lib/writtenForm";
import WrittenFormToggle from "@/components/WrittenFormToggle";

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
  const [scrivenings, setScrivenings] = useState(false);
  const [goals, setGoals] = useState({ total_goal: 0, session_goal: 0 });
  const [goalOpen, setGoalOpen] = useState(false);
  const [snapshotsFor, setSnapshotsFor] = useState(null);
  const [view, setView] = useState("table"); // "table" | "grid"
  const [characters, setCharacters] = useState([]);
  const [researchNotes, setResearchNotes] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const [r, g, c, rn] = await Promise.all([
        api.get("/manuscript"),
        api.get("/manuscript/goals"),
        api.get("/characters"),
        api.get("/research"),
      ]);
      setScenes(r.data || []);
      setGoals(g.data || { total_goal: 0, session_goal: 0 });
      setCharacters(c.data || []);
      setResearchNotes(rn.data || []);
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

  const [draggedId, setDraggedId] = useState(null);

  const dropSceneOn = async (draggedSceneId, targetId) => {
    if (!draggedSceneId || draggedSceneId === targetId) return;
    const ordered = [...scenes].sort((a, b) => a.order - b.order);
    const fromIdx = ordered.findIndex((s) => s.id === draggedSceneId);
    const toIdx = ordered.findIndex((s) => s.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    const [moved] = ordered.splice(fromIdx, 1);
    ordered.splice(toIdx, 0, moved);
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
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setScrivenings(true)}
              disabled={scenes.length === 0}
              className="inline-flex items-center gap-2 font-mono-ui text-[11px] tracking-widest hover:underline disabled:opacity-40"
              style={{ color: "var(--ink-mute)" }}
              data-testid="ms-scrivenings-btn"
            >
              <ScrollText size={13} strokeWidth={1.5} />
              LES SAMMENHENGENDE
            </button>
            <a
              href={`${BACKEND}/api/manuscript/compile.docx`}
              className="inline-flex items-center gap-2 font-mono-ui text-[11px] tracking-widest hover:underline"
              style={{ color: "var(--ink-mute)" }}
              data-testid="ms-compile-docx"
            >
              <Download size={13} strokeWidth={1.5} />
              LAST NED .DOCX
            </a>
            <button
              onClick={() => setShowSynopsis((v) => !v)}
              className="font-mono-ui text-[11px] tracking-widest hover:underline"
              style={{ color: "var(--ink-mute)" }}
              data-testid="ms-toggle-synopsis"
            >
              {showSynopsis ? "SKJUL SYNOPSIS" : "VIS SYNOPSIS"}
            </button>
            <button
              onClick={() => setView((v) => (v === "table" ? "grid" : "table"))}
              className="inline-flex items-center gap-2 font-mono-ui text-[11px] tracking-widest hover:underline"
              style={{ color: "var(--ink-mute)" }}
              data-testid="ms-toggle-view"
              title="Bytt mellom tabell og rutenett"
            >
              {view === "table" ? <LayoutGrid size={13} strokeWidth={1.5} /> : <Rows3 size={13} strokeWidth={1.5} />}
              {view === "table" ? "RUTENETT" : "TABELL"}
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
          Bytt til rutenett for å se strukturen visuelt — nyttig for å oppdage hull i tempoet.
        </p>
      </div>

      {/* Targets widget */}
      <GoalStrip
        totalWords={totalWords}
        goals={goals}
        onEdit={() => setGoalOpen(true)}
      />

      {/* Table or grid */}
      {view === "grid" ? (
        <PlotGrid
          scenes={[...scenes].sort((a, b) => a.order - b.order)}
          loading={loading}
          onOpen={setEditorScene}
          onSnapshots={setSnapshotsFor}
          onDelete={removeScene}
          onMove={moveScene}
          draggedId={draggedId}
          onDragStart={setDraggedId}
          onDrop={dropSceneOn}
        />
      ) : (
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
              <tr
                key={s.id}
                className="hairline-b hover:bg-neutral-50 transition-colors"
                data-testid={`ms-row-${s.id}`}
                draggable={sortKey === "order"}
                onDragStart={() => setDraggedId(s.id)}
                onDragOver={(e) => sortKey === "order" && e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); dropSceneOn(draggedId, s.id); setDraggedId(null); }}
                style={{ opacity: draggedId === s.id ? 0.4 : 1, cursor: sortKey === "order" ? "grab" : "default" }}
              >
                <td className="py-3 pr-4 font-mono-ui text-xs" style={{ color: "var(--ink-mute)" }}>
                  <span className="inline-flex items-center gap-1.5">
                    {sortKey === "order" && <GripVertical size={12} strokeWidth={1.5} style={{ color: "var(--ink-mute)" }} />}
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <input
                    className="w-full bg-transparent font-serif-display text-lg outline-none"
                    style={{ color: "var(--ink)" }}
                    defaultValue={s.title}
                    onBlur={(e) => e.target.value !== s.title && patchScene(s.id, { title: e.target.value })}
                    data-testid={`ms-title-${s.id}`}
                  />
                  {s.tags?.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 font-mono-ui text-[9px] tracking-wide"
                          style={{ border: `1px solid ${tagColor(t)}`, color: tagColor(t) }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
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
                      onClick={() => setSnapshotsFor(s)}
                      title="Øyeblikksbilder"
                      className="p-1.5 hover:bg-neutral-100"
                      style={{ color: "var(--ink-mute)" }}
                      data-testid={`ms-snapshots-${s.id}`}
                    >
                      <Camera size={13} strokeWidth={1.5} />
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
      )}

      {editorScene && (
        <SceneContentEditor
          scene={editorScene}
          characters={characters}
          researchNotes={researchNotes}
          onClose={() => setEditorScene(null)}
          onSaved={(u) => { setScenes((arr) => arr.map((s) => s.id === u.id ? u : s)); setEditorScene(u); }}
          onSnapshot={async () => {
            try {
              await api.post(`/manuscript/${editorScene.id}/snapshots`, { scene_id: editorScene.id, label: "manuell" });
              toast("Øyeblikksbilde tatt");
            } catch (e) { toast("Kunne ikke ta øyeblikksbilde"); }
          }}
        />
      )}

      {scrivenings && (
        <ScrivenningsView
          scenes={[...scenes].sort((a, b) => a.order - b.order)}
          onClose={() => setScrivenings(false)}
        />
      )}

      {snapshotsFor && (
        <SnapshotsModal
          scene={snapshotsFor}
          onClose={() => setSnapshotsFor(null)}
          onRestored={(u) => {
            setScenes((arr) => arr.map((s) => s.id === u.id ? u : s));
          }}
        />
      )}

      {goalOpen && (
        <GoalModal
          goals={goals}
          onClose={() => setGoalOpen(false)}
          onSaved={(g) => { setGoals(g); setGoalOpen(false); toast("Mål lagret"); }}
        />
      )}
    </div>
  );
}

function SceneContentEditor({ scene, characters = [], researchNotes = [], onClose, onSaved, onSnapshot }) {
  const [content, setContent] = useState(scene.content || "");
  const [title, setTitle] = useState(scene.title || "");
  const [tags, setTags] = useState(scene.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [viewingChar, setViewingChar] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [writtenForm, setWrittenForm] = useWrittenForm();

  const addTag = (raw) => {
    const t = raw.trim();
    if (!t || tags.includes(t) || tags.length >= 12) { setTagInput(""); return; }
    setTags((a) => [...a, t]);
    setTagInput("");
  };
  const removeTag = (t) => setTags((a) => a.filter((x) => x !== t));

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  const sameTags = tags.length === (scene.tags || []).length && tags.every((t) => (scene.tags || []).includes(t));
  const dirty = title !== (scene.title || "") || content !== (scene.content || "") || !sameTags;
  const wc = content.trim() ? content.trim().split(/\s+/).length : 0;

  const mentioned = useMemo(() => {
    const text = content.toLowerCase();
    return characters.filter((c) => c.name && text.includes(c.name.toLowerCase()));
  }, [content, characters]);

  const mentionedNotes = useMemo(() => {
    const text = content.toLowerCase();
    return researchNotes.filter((n) => n.title && text.includes(n.title.toLowerCase()));
  }, [content, researchNotes]);

  const suggestedTags = mentioned.map((c) => c.name).filter((n) => !tags.includes(n));

  const save = async () => {
    setSaving(true);
    try {
      const r = await api.patch(`/manuscript/${scene.id}`, { title, content, tags });
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
          <div className="flex items-center gap-3">
            <WrittenFormToggle form={writtenForm} onChange={setWrittenForm} />
            <button onClick={onClose} className="p-2 hover:opacity-70" style={{ color: "var(--ink-mute)" }}>
              <XIcon size={18} strokeWidth={1.3} />
            </button>
          </div>
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
            lang={writtenForm}
            spellCheck="true"
          />
          <div className="mt-4 pt-4 hairline-t">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--ink-mute)" }}>
                MERKELAPPER:
              </span>
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono-ui text-[11px]"
                  style={{ border: `1px solid ${tagColor(t)}`, color: tagColor(t) }}
                  data-testid={`ms-tag-${t}`}
                >
                  {t}
                  <button onClick={() => removeTag(t)} style={{ color: tagColor(t) }}>
                    <XIcon size={11} strokeWidth={1.5} />
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); }
                }}
                placeholder="Legg til …"
                className="bg-transparent font-mono-ui text-[11px] outline-none w-24"
                style={{ color: "var(--ink)" }}
                data-testid="ms-tag-input"
              />
            </div>
            {suggestedTags.length > 0 && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--ink-mute)" }}>
                  FORESLÅTT FRA KARAKTERER:
                </span>
                {suggestedTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => addTag(t)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 font-mono-ui text-[11px] hover:opacity-70"
                    style={{ border: "1px dashed var(--line)", color: "var(--ink-mute)" }}
                  >
                    <Plus size={10} strokeWidth={1.5} /> {t}
                  </button>
                ))}
              </div>
            )}
          </div>
          {mentioned.length > 0 && (
            <div className="mt-4 pt-4 hairline-t flex items-center gap-2 flex-wrap">
              <span className="font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--ink-mute)" }}>
                KARAKTERER I DENNE SCENEN:
              </span>
              {mentioned.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setViewingChar(c)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono-ui text-[11px] hover:opacity-70"
                  style={{ border: "1px solid var(--line)", color: "var(--ink)" }}
                  data-testid={`ms-mentioned-${c.id}`}
                >
                  <UserRound size={11} strokeWidth={1.5} />
                  {c.name}
                </button>
              ))}
            </div>
          )}
          {mentionedNotes.length > 0 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--ink-mute)" }}>
                OMTALT I DENNE SCENEN:
              </span>
              {mentionedNotes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setViewingNote(n)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono-ui text-[11px] hover:opacity-70"
                  style={{ border: "1px solid var(--line)", color: "var(--ink)" }}
                  data-testid={`ms-mentioned-note-${n.id}`}
                >
                  <Search size={11} strokeWidth={1.5} />
                  {n.title}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 px-6 py-4 hairline-t">
          <button
            onClick={onSnapshot}
            className="inline-flex items-center gap-2 font-mono-ui text-[11px] tracking-widest hover:opacity-70"
            style={{ color: "var(--ink-mute)" }}
            data-testid="scene-editor-snapshot"
            title="Ta et øyeblikksbilde før du redigerer videre"
          >
            <Camera size={13} strokeWidth={1.5} />
            TA ØYEBLIKKSBILDE
          </button>
          <div className="flex items-center gap-3">
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
      {viewingChar && (
        <CharacterQuickView character={viewingChar} onClose={() => setViewingChar(null)} />
      )}
      {viewingNote && (
        <ResearchNoteQuickView note={viewingNote} onClose={() => setViewingNote(null)} />
      )}
    </div>
  );
}

function ResearchNoteQuickView({ note, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(20,18,15,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[80vh] flex flex-col"
        style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 hairline-b flex items-center justify-between">
          <span className="font-serif-display text-2xl" style={{ color: "var(--ink)" }}>{note.title}</span>
          <button onClick={onClose} style={{ color: "var(--ink-mute)" }}><XIcon size={16} strokeWidth={1.3} /></button>
        </div>
        <div className="flex-1 overflow-auto">
          {note.has_image && (
            <img src={`${API}/research/${note.id}/image`} alt="" className="w-full h-48 object-cover" draggable={false} />
          )}
          <div className="px-6 py-5 space-y-4">
            <div>
              <div className="label-ui">Kategori</div>
              <p className="mt-1 font-editor text-sm" style={{ color: "var(--ink-soft)" }}>
                {RESEARCH_CATEGORY_LABEL[note.category] || "Annet"}
              </p>
            </div>
            {note.content && (
              <div>
                <div className="label-ui">Notat</div>
                <p className="mt-1 font-editor text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--ink-soft)" }}>
                  {note.content}
                </p>
              </div>
            )}
            {note.source_url && (
              <a
                href={note.source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono-ui text-[11px] tracking-widest hover:opacity-70"
                style={{ color: "var(--moss)" }}
              >
                <Link2 size={12} strokeWidth={1.5} /> ÅPNE KILDE
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const CHARACTER_FIELDS = [
  { key: "role",            label: "Rolle" },
  { key: "appearance",      label: "Utseende" },
  { key: "inner_struggle",  label: "Indre kamp" },
  { key: "outer_struggle",  label: "Ytre kamp" },
  { key: "relationships",   label: "Relasjoner" },
  { key: "arc",             label: "Karakterbue" },
  { key: "voice_notes",     label: "Stemme/dialog" },
];

function CharacterQuickView({ character, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(20,18,15,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[80vh] flex flex-col"
        style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 hairline-b flex items-center justify-between">
          <span className="font-serif-display text-2xl" style={{ color: "var(--ink)" }}>{character.name}</span>
          <button onClick={onClose} style={{ color: "var(--ink-mute)" }}><XIcon size={16} strokeWidth={1.3} /></button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-5 space-y-4">
          {CHARACTER_FIELDS.filter((f) => character[f.key]).map((f) => (
            <div key={f.key}>
              <div className="label-ui">{f.label}</div>
              <p className="mt-1 font-editor text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                {character[f.key]}
              </p>
            </div>
          ))}
          {CHARACTER_FIELDS.every((f) => !character[f.key]) && (
            <p className="font-editor italic text-sm" style={{ color: "var(--ink-mute)" }}>
              Ingen detaljer lagt inn ennå — rediger i Persongalleriet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// -------- Sub-components --------

function PlotGrid({ scenes, loading, onOpen, onSnapshots, onDelete, onMove, draggedId, onDragStart, onDrop }) {
  if (loading) {
    return (
      <div className="mt-10 py-16 text-center">
        <Loader2 size={20} className="animate-spin inline" style={{ color: "var(--ink-mute)" }} />
      </div>
    );
  }
  if (scenes.length === 0) {
    return (
      <div className="mt-10 py-16 text-center font-editor italic" style={{ color: "var(--ink-mute)" }}>
        Ingen scener ennå. Klikk «Ny scene» for å komme i gang.
      </div>
    );
  }
  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="ms-plot-grid">
      {scenes.map((s, i) => {
        const meta = STATUS_META[s.status] || STATUS_META.skisse;
        return (
          <div
            key={s.id}
            className="paper p-5 flex flex-col"
            style={{ borderLeft: `3px solid ${meta.color}`, opacity: draggedId === s.id ? 0.4 : 1, cursor: "grab" }}
            data-testid={`ms-grid-card-${s.id}`}
            draggable
            onDragStart={() => onDragStart(s.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); onDrop(draggedId, s.id); onDragStart(null); }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--ink-mute)" }}>
                <GripVertical size={12} strokeWidth={1.5} />
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="font-mono-ui text-[10px] tracking-widest" style={{ color: meta.color }}>
                {meta.label.toUpperCase()}
              </div>
            </div>
            <button
              onClick={() => onOpen(s)}
              className="mt-2 text-left font-serif-display text-lg leading-tight hover:opacity-70"
              style={{ color: "var(--ink)" }}
            >
              {s.title || "Uten tittel"}
            </button>
            <p className="mt-2 font-editor text-sm leading-relaxed flex-1" style={{ color: "var(--ink-soft)" }}>
              {s.synopsis || <span className="italic" style={{ color: "var(--ink-mute)" }}>Ingen synopsis</span>}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--ink-mute)" }}>
              {s.pov && <span>POV: {s.pov}</span>}
              {s.location && <span>{s.location}</span>}
              {s.scene_date && <span>{s.scene_date}</span>}
              <span>{s.word_count || 0} ord</span>
            </div>
            {s.tags?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 font-mono-ui text-[9px] tracking-wide"
                    style={{ border: `1px solid ${tagColor(t)}`, color: tagColor(t) }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-4 pt-3 hairline-t flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button onClick={() => onMove(s.id, "up")} title="Flytt opp" className="p-1.5 hover:bg-neutral-100" style={{ color: "var(--ink-mute)" }}>
                  <ArrowUp size={13} strokeWidth={1.5} />
                </button>
                <button onClick={() => onMove(s.id, "down")} title="Flytt ned" className="p-1.5 hover:bg-neutral-100" style={{ color: "var(--ink-mute)" }}>
                  <ArrowDown size={13} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => onSnapshots(s)} title="Øyeblikksbilder" className="p-1.5 hover:bg-neutral-100" style={{ color: "var(--ink-mute)" }}>
                  <Camera size={13} strokeWidth={1.5} />
                </button>
                <button onClick={() => onDelete(s.id)} title="Slett" className="p-1.5 hover:bg-neutral-100" style={{ color: "var(--ink-mute)" }}>
                  <Trash2 size={13} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GoalStrip({ totalWords, goals, onEdit }) {
  const totalPct = goals.total_goal > 0 ? Math.min(100, Math.round((totalWords / goals.total_goal) * 100)) : 0;
  const hasGoals = goals.total_goal > 0 || goals.session_goal > 0;
  return (
    <div className="mt-8 p-5" style={{ background: "var(--linen)", border: "1px solid var(--line)" }}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Target size={16} strokeWidth={1.5} style={{ color: "var(--rust)" }} />
          <span className="label-ui">Skrivemål</span>
        </div>
        <button
          onClick={onEdit}
          className="font-mono-ui text-[11px] tracking-widest hover:underline"
          style={{ color: "var(--ink-mute)" }}
          data-testid="ms-edit-goals"
        >
          {hasGoals ? "REDIGER MÅL" : "SETT MÅL"}
        </button>
      </div>
      {hasGoals ? (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--ink-mute)" }}>TOTALT</div>
            <div className="font-serif-display text-3xl mt-1" style={{ color: "var(--ink)" }}>
              {totalWords.toLocaleString("nb-NO")}
              {goals.total_goal > 0 && <span className="text-lg" style={{ color: "var(--ink-mute)" }}> / {goals.total_goal.toLocaleString("nb-NO")}</span>}
            </div>
            {goals.total_goal > 0 && (
              <div className="mt-2 h-1.5 relative" style={{ background: "var(--paper)" }}>
                <div className="absolute inset-y-0 left-0" style={{ background: "var(--rust)", width: `${totalPct}%` }} />
              </div>
            )}
          </div>
          <div>
            <div className="font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--ink-mute)" }}>ØKT-MÅL</div>
            <div className="font-serif-display text-3xl mt-1" style={{ color: "var(--ink)" }}>
              {goals.session_goal > 0 ? goals.session_goal.toLocaleString("nb-NO") : "—"}
              {goals.session_goal > 0 && <span className="text-lg" style={{ color: "var(--ink-mute)" }}> ord</span>}
            </div>
          </div>
          <div>
            <div className="font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--ink-mute)" }}>PROGRESJON</div>
            <div className="font-serif-display text-3xl mt-1" style={{ color: goals.total_goal > 0 ? (totalPct >= 100 ? "var(--moss)" : "var(--ink)") : "var(--ink-mute)" }}>
              {goals.total_goal > 0 ? `${totalPct}%` : "—"}
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-3 font-editor text-sm" style={{ color: "var(--ink-soft)" }}>
          Sett et totalt ordmål (f.eks. 80 000 for en roman) og et daglig økt-mål for å holde tempoet.
        </p>
      )}
    </div>
  );
}

function GoalModal({ goals, onClose, onSaved }) {
  const [total, setTotal] = useState(goals.total_goal || 0);
  const [session, setSession] = useState(goals.session_goal || 0);
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    try {
      const r = await api.put("/manuscript/goals", { total_goal: Number(total) || 0, session_goal: Number(session) || 0 });
      onSaved(r.data);
    } catch (e) { toast("Kunne ikke lagre"); }
    finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(20,18,15,0.55)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="w-full max-w-md" style={{ background: "var(--paper)", border: "1px solid var(--line)" }} onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 hairline-b flex items-center justify-between">
          <span className="label-ui">Skrivemål</span>
          <button onClick={onClose} style={{ color: "var(--ink-mute)" }}><XIcon size={16} strokeWidth={1.3} /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <div className="label-ui mb-2">Totalt ordmål</div>
            <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} placeholder="F.eks. 80000" className="w-full input-line" />
            <p className="mt-1 font-editor text-xs" style={{ color: "var(--ink-mute)" }}>Typisk roman: 80 000. Novelle: 20 000.</p>
          </div>
          <div>
            <div className="label-ui mb-2">Økt-mål (ord per dag)</div>
            <input type="number" value={session} onChange={(e) => setSession(e.target.value)} placeholder="F.eks. 1000" className="w-full input-line" />
          </div>
        </div>
        <div className="px-6 py-4 hairline-t flex items-center justify-end gap-3">
          <button onClick={onClose} className="font-mono-ui text-[11px] tracking-widest" style={{ color: "var(--ink-mute)" }}>AVBRYT</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 font-mono-ui text-[11px] tracking-widest disabled:opacity-40" style={{ background: "var(--ink)", color: "var(--paper)" }} data-testid="ms-save-goals">
            {saving ? "LAGRER…" : "LAGRE"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ScrivenningsView({ scenes, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);
  const total = scenes.reduce((s, x) => s + (x.word_count || 0), 0);
  return (
    <div className="fixed inset-0 z-50" style={{ background: "var(--paper)" }} data-testid="scrivenings-view">
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16">
        <div className="flex items-center justify-between hairline-b pb-4">
          <span className="label-ui">Sammenhengende visning · {total.toLocaleString("nb-NO")} ord</span>
          <button onClick={onClose} className="font-mono-ui text-[11px] tracking-widest hover:opacity-70" style={{ color: "var(--ink-mute)" }}>
            LUKK
          </button>
        </div>
        <div className="mt-10 space-y-14">
          {scenes.map((s, i) => (
            <article key={s.id}>
              <div className="text-center">
                <div className="font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--ink-mute)" }}>KAPITTEL {String(i + 1).padStart(2, "0")}</div>
                <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
                  {s.title || `Scene ${i + 1}`}
                </h2>
                {s.synopsis && (
                  <p className="mt-3 font-editor italic text-base max-w-[50ch] mx-auto" style={{ color: "var(--ink-soft)" }}>
                    {s.synopsis}
                  </p>
                )}
              </div>
              <div className="mt-8 font-editor text-[1.05rem] leading-[1.9] whitespace-pre-wrap" style={{ color: "var(--ink)" }}>
                {s.content || <span className="italic" style={{ color: "var(--ink-mute)" }}>(tom scene)</span>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function SnapshotsModal({ scene, onClose, onRestored }) {
  const [snaps, setSnaps] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const r = await api.get(`/manuscript/${scene.id}/snapshots`);
        setSnaps(r.data || []);
      } catch (e) { console.debug("snapshots load failed", e); }
      finally { setLoading(false); }
    })();
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [scene.id, onClose]);
  const takeSnap = async () => {
    try {
      const r = await api.post(`/manuscript/${scene.id}/snapshots`, { scene_id: scene.id, label: "manuell" });
      setSnaps((arr) => [r.data, ...arr]);
      toast("Øyeblikksbilde tatt");
    } catch (e) { toast("Kunne ikke ta bilde"); }
  };
  const restore = async (id) => {
    if (!window.confirm("Erstatte gjeldende scene med dette øyeblikksbildet?")) return;
    try {
      const r = await api.post(`/manuscript/snapshots/${id}/restore`);
      onRestored(r.data);
      toast("Gjenopprettet");
      onClose();
    } catch (e) { toast("Kunne ikke gjenopprette"); }
  };
  const remove = async (id) => {
    if (!window.confirm("Slett dette øyeblikksbildet?")) return;
    try {
      await api.delete(`/manuscript/snapshots/${id}`);
      setSnaps((arr) => arr.filter((s) => s.id !== id));
    } catch (e) { toast("Kunne ikke slette"); }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8" style={{ background: "rgba(20,18,15,0.55)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col" style={{ background: "var(--paper)", border: "1px solid var(--line)" }} onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 hairline-b flex items-center justify-between">
          <span className="label-ui">Øyeblikksbilder · {scene.title}</span>
          <button onClick={onClose} style={{ color: "var(--ink-mute)" }}><XIcon size={16} strokeWidth={1.3} /></button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-4">
          <button onClick={takeSnap} className="inline-flex items-center gap-2 px-3 py-2 font-mono-ui text-[11px] tracking-widest mb-4" style={{ background: "var(--ink)", color: "var(--paper)" }} data-testid="snap-take-btn">
            <Camera size={13} strokeWidth={1.5} />
            TA ØYEBLIKKSBILDE
          </button>
          {loading ? (
            <div className="text-center py-8"><Loader2 size={20} className="animate-spin inline" /></div>
          ) : snaps.length === 0 ? (
            <p className="font-editor italic text-sm" style={{ color: "var(--ink-mute)" }}>Ingen øyeblikksbilder ennå.</p>
          ) : (
            <ul className="space-y-3">
              {snaps.map((s) => (
                <li key={s.id} className="p-4 hairline-b flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-serif-display text-base" style={{ color: "var(--ink)" }}>{s.title}</div>
                    <div className="label-ui mt-1">
                      {new Date(s.created_at).toLocaleString("nb-NO")} · {s.word_count} ord{s.label && ` · ${s.label}`}
                    </div>
                    <p className="mt-2 font-editor text-sm line-clamp-3" style={{ color: "var(--ink-soft)" }}>
                      {(s.content || "").slice(0, 200)}{(s.content || "").length > 200 ? "…" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => restore(s.id)} title="Gjenopprett" className="p-2 hover:bg-neutral-100" style={{ color: "var(--rust)" }}>
                      <RotateCcw size={13} strokeWidth={1.5} />
                    </button>
                    <button onClick={() => remove(s.id)} title="Slett" className="p-2 hover:bg-neutral-100" style={{ color: "var(--ink-mute)" }}>
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
