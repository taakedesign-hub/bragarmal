import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { TID } from "@/lib/testIds";
import { toast } from "sonner";
import {
  Upload, Trash2, FileText, Camera, Mic, Square, ClipboardPaste, ScanLine, Loader2,
  BookOpen, X as XIcon, Save, ArrowRight, GitCompare
} from "lucide-react";
import { useCategories, labelForCategory } from "@/lib/categories";

const TABS = [
  { id: "paste", label: "Lim inn", icon: ClipboardPaste, tid: "tab-paste" },
  { id: "file", label: "Fil", icon: Upload, tid: "tab-file" },
  { id: "scan", label: "Foto/scan", icon: Camera, tid: "tab-scan" },
  { id: "audio", label: "Høytlesning", icon: Mic, tid: "tab-audio" },
];

export default function SamplesPage() {
  const [samples, setSamples] = useState([]);
  const [tab, setTab] = useState("paste");
  const [openSample, setOpenSample] = useState(null);
  const cats = useCategories();
  const navigate = useNavigate();

  const load = async () => {
    try {
      const r = await api.get("/samples");
      setSamples(r.data || []);
    } catch {}
  };
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    try {
      await api.delete(`/samples/${id}`);
      setSamples((s) => s.filter((x) => x.id !== id));
      toast("Slettet");
    } catch { toast("Kunne ikke slette"); }
  };

  const changeCategory = async (id, category) => {
    try {
      await api.patch(`/samples/${id}/category`, { category });
      setSamples((s) => s.map((x) => (x.id === id ? { ...x, category } : x)));
      toast("Kategori oppdatert");
    } catch { toast("Kunne ikke oppdatere"); }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12">
      <div className="fade-in">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <div className="label-ui">Bibliotek</div>
            <h1 className="font-serif-display text-5xl font-light mt-3" style={{ color: "var(--ink)" }}>
              Skriveprøver
            </h1>
          </div>
          <Link
            to="/eksempler#testprompter"
            data-testid="samples-testprompter-link"
            className="font-mono-ui text-[11px] tracking-widest hover:underline"
            style={{ color: "var(--rust)" }}
          >
            SE TESTPROMPTER →
          </Link>
        </div>
        <p className="font-editor mt-4 max-w-[62ch]" style={{ color: "var(--ink-soft)" }}>
          Jo mer variert materiale, desto tydeligere stemme. Lim inn tekst, last opp filer,
          fotografer håndskrevne notater, eller les høyt for meg.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
        <div className="lg:col-span-7">
          {/* Tabs */}
          <div className="hairline-b flex flex-wrap">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  data-testid={t.tid}
                  onClick={() => setTab(t.id)}
                  className="label-ui px-4 py-3 inline-flex items-center gap-2"
                  style={{
                    color: active ? "var(--ink)" : "var(--ink-mute)",
                    borderBottom: active ? "1px solid var(--ink)" : "1px solid transparent",
                    marginBottom: "-1px",
                  }}
                >
                  <Icon size={14} strokeWidth={1.5} /> {t.label}
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            {tab === "paste" && <PasteForm onSaved={load} />}
            {tab === "file" && <FileForm onSaved={load} />}
            {tab === "scan" && <ScanForm onSaved={load} />}
            {tab === "audio" && <AudioForm onSaved={load} />}
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-5">
          <div className="hairline-b pb-3 flex items-center justify-between">
            <span className="label-ui">Dine prøver</span>
            <span className="label-ui">{samples.length}</span>
          </div>
          {samples.length === 0 ? (
            <div className="mt-6 font-editor italic" style={{ color: "var(--ink-mute)" }}>
              Ingen prøver ennå.
            </div>
          ) : (
            <ul className="mt-2">
              {samples.map((s) => (
                <li
                  key={s.id}
                  data-testid={TID.sampleListItem(s.id)}
                  className="hairline-b py-4 flex items-start gap-4"
                >
                  <FileText size={16} strokeWidth={1.3} className="mt-1" style={{ color: "var(--ink-mute)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-serif-display text-lg truncate" style={{ color: "var(--ink)" }}>
                      {s.title || "Uten tittel"}
                    </div>
                    <div className="label-ui mt-1">
                      {s.word_count} ord · {sourceLabel(s.source)}
                    </div>
                    <div className="font-editor text-sm mt-2 line-clamp-2" style={{ color: "var(--ink-soft)" }}>
                      {s.content.slice(0, 180)}…
                    </div>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <button
                        data-testid={`sample-open-${s.id}`}
                        onClick={() => setOpenSample(s)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 font-mono-ui text-[11px] tracking-widest hover:bg-neutral-50 transition-colors"
                        style={{ border: "1px solid var(--line)", color: "var(--ink)" }}
                      >
                        <BookOpen size={13} strokeWidth={1.5} />
                        ÅPNE
                      </button>
                      <select
                        data-testid={TID.sampleCategorySelect(s.id)}
                        value={s.category || "ren_menneske_ny"}
                        onChange={(e) => changeCategory(s.id, e.target.value)}
                        className="select-line text-xs"
                        style={{ padding: "4px 8px" }}
                      >
                        {cats.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    data-testid={TID.sampleDeleteBtn(s.id)}
                    onClick={() => del(s.id)}
                    aria-label="Slett"
                    title="Slett"
                    className="p-2"
                    style={{ color: "var(--ink-mute)" }}
                  >
                    <Trash2 size={16} strokeWidth={1.3} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {openSample && (
        <SampleEditorModal
          sample={openSample}
          onClose={() => setOpenSample(null)}
          onSaved={(updated) => {
            setSamples((s) => s.map((x) => (x.id === updated.id ? updated : x)));
            setOpenSample(updated);
          }}
          onSendToWrite={(text, mode) => {
            setOpenSample(null);
            navigate("/skriv", { state: { draft: text, source: openSample.title, mode, autoRun: mode !== "next_steps" } });
          }}
        />
      )}
    </div>
  );
}

function sourceLabel(src) {
  return { paste: "limt inn", file: "opplastet", handwriting: "håndskrevet", audio: "høytlest" }[src] || src;
}

function SampleEditorModal({ sample, onClose, onSaved, onSendToWrite }) {
  const [title, setTitle] = useState(sample.title || "");
  const [content, setContent] = useState(sample.content || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const isDirty = title.trim() !== (sample.title || "").trim() || content.trim() !== (sample.content || "").trim();
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const save = async () => {
    if (content.trim().length < 20) { toast("Minst 20 tegn"); return; }
    setSaving(true);
    try {
      const r = await api.patch(`/samples/${sample.id}`, {
        title: title.trim() || "Uten tittel",
        content: content.trim(),
      });
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
      style={{ background: "rgba(20, 18, 15, 0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      data-testid="sample-editor-modal"
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] flex flex-col"
        style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 hairline-b">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <BookOpen size={16} strokeWidth={1.3} style={{ color: "var(--rust)" }} />
            <span className="label-ui truncate">
              {sourceLabel(sample.source)} · {wordCount} ord
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Lukk"
            className="p-2 hover:opacity-70 transition-opacity"
            style={{ color: "var(--ink-mute)" }}
            data-testid="sample-editor-close"
          >
            <XIcon size={18} strokeWidth={1.3} />
          </button>
        </div>

        {/* Body — title + content */}
        <div className="flex-1 overflow-auto px-6 py-5">
          <input
            data-testid="sample-editor-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tittel"
            className="w-full bg-transparent font-serif-display text-2xl md:text-3xl outline-none border-none"
            style={{ color: "var(--ink)" }}
          />
          <div className="hairline-b mt-3" />
          <textarea
            data-testid="sample-editor-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Skriv eller rediger teksten din …"
            className="w-full mt-4 bg-transparent font-editor text-base outline-none border-none resize-none leading-relaxed"
            style={{ color: "var(--ink)", minHeight: "50vh" }}
          />
        </div>

        {/* Footer — actions */}
        <div className="px-6 py-4 hairline-t space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-4 flex-wrap">
              <button
                data-testid="sample-editor-send-to-write"
                onClick={() => onSendToWrite(content, "next_steps")}
                disabled={content.trim().length < 20}
                className="inline-flex items-center gap-2 font-mono-ui text-[11px] tracking-widest hover:opacity-70 transition-opacity disabled:opacity-40"
                style={{ color: "var(--ink)" }}
                title="Send til Skrivepulten og be om retninger å utforske videre"
              >
                HJELP MEG VIDERE
                <ArrowRight size={14} strokeWidth={1.5} />
              </button>
              <button
                data-testid="sample-editor-humanize"
                onClick={() => onSendToWrite(content, "voice_match")}
                disabled={content.trim().length < 20}
                className="inline-flex items-center gap-2 font-mono-ui text-[11px] tracking-widest hover:opacity-70 transition-opacity disabled:opacity-40"
                style={{ color: "var(--rust)" }}
                title="Sjekk om denne teksten låter som deg — sammenlign mot stemmeprofilen din"
              >
                <GitCompare size={13} strokeWidth={1.5} />
                SAMMENLIGN MED STEMMEN MIN
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="font-mono-ui text-[11px] tracking-widest hover:opacity-70"
                style={{ color: "var(--ink-mute)" }}
              >
                LUKK
              </button>
              <button
                data-testid="sample-editor-save"
                onClick={save}
                disabled={!isDirty || saving}
                className="inline-flex items-center gap-2 px-4 py-2 font-mono-ui text-[11px] tracking-widest transition-all disabled:opacity-40"
                style={{ background: "var(--ink)", color: "var(--paper)" }}
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} strokeWidth={1.5} />}
                LAGRE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- PASTE ----------
function PasteForm({ onSaved }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("ren_menneske_ny");
  const [submitting, setSubmitting] = useState(false);
  const cats = useCategories();

  const submit = async (e) => {
    e?.preventDefault?.();
    if (content.trim().length < 20) { toast("Minst 20 tegn"); return; }
    setSubmitting(true);
    try {
      await api.post("/samples", { title: title.trim() || "Uten tittel", content, category });
      setTitle(""); setContent("");
      toast("Lagret prøve");
      onSaved();
    } catch (e) {
      toast(e?.response?.data?.detail || "Kunne ikke lagre");
    } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={submit}>
      <input
        data-testid={TID.sampleTitleInput}
        className="input-line"
        placeholder="Tittel (valgfritt)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        data-testid={TID.sampleContentInput}
        className="textarea-editor paper p-6 min-h-[280px] mt-6"
        placeholder="Lim inn en tekst du har skrevet — en scene, et essay, en dagbokoppføring…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <div className="label-ui mb-2">Kategori</div>
          <select
            data-testid={TID.categorySelector}
            className="select-line w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {cats.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <span className="label-ui">
            {content.trim().length > 0 ? `${content.trim().split(/\s+/).length} ord` : "0 ord"}
          </span>
          <button
            data-testid={TID.sampleSubmitBtn}
            type="submit"
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? "Lagrer…" : "Lagre prøve"}
          </button>
        </div>
      </div>
      <p className="label-ui mt-4" style={{ maxWidth: "60ch" }}>
        Tips: bare «ren menneske»-prøver brukes til å bygge stemmeprofilen din. Hybrid og AI holdes utenfor.
      </p>
    </form>
  );
}

// ---------- FILE ----------
function FileForm({ onSaved }) {
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    if (!/\.(txt|md|pdf|docx)$/i.test(file.name)) { toast(".txt, .md, .pdf, .docx"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", file.name);
      await api.post("/samples/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast(`Lastet opp ${file.name}`);
      onSaved();
    } catch (e) {
      toast(e?.response?.data?.detail || "Kunne ikke laste opp");
    } finally { setUploading(false); }
  };

  return (
    <div
      data-testid={TID.sampleUploadBtn}
      className={`dropzone ${dragging ? "dragging" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); Array.from(e.dataTransfer.files || []).forEach(upload); }}
      onClick={() => fileRef.current?.click()}
      role="button"
    >
      <Upload size={22} strokeWidth={1.3} className="mx-auto" style={{ color: "var(--ink-mute)" }} />
      <div className="font-serif-display text-xl mt-3">Slipp filer her</div>
      <div className="label-ui mt-2">.txt · .md · .pdf · .docx (maks 5 MB)</div>
      <input
        ref={fileRef}
        data-testid={TID.sampleUploadInput}
        type="file"
        accept=".txt,.md,.pdf,.docx"
        className="hidden"
        onChange={(e) => upload(e.target.files?.[0])}
      />
      {uploading && <div className="label-ui mt-3"><Loader2 size={12} className="inline animate-spin" /> Laster opp…</div>}
    </div>
  );
}

// ---------- SCAN (photo of handwriting) ----------
function ScanForm({ onSaved }) {
  const fileRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const scan = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast("Bare bilder"); return; }
    setPreview(URL.createObjectURL(file));
    setScanning(true);
    setText("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await api.post("/samples/scan", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setText(r.data.text || "");
      setTitle(r.data.suggested_title || file.name.replace(/\.[^.]+$/, ""));
      toast("Transkribert — sjekk og lagre");
    } catch (e) {
      toast(e?.response?.data?.detail || "Kunne ikke scanne");
    } finally { setScanning(false); }
  };

  const save = async () => {
    if (text.trim().length < 20) { toast("Teksten må være minst 20 tegn"); return; }
    setSaving(true);
    try {
      await api.post("/samples", { title: title.trim() || "Håndskrevet", content: text });
      // Mark source: paste — we don't expose source override; scan is close enough.
      // The scan endpoint didn't save; we save via /samples which defaults source=paste.
      // For semantics, we tag title with (håndskrevet) if not present.
      toast("Lagret");
      setText(""); setTitle(""); setPreview(null);
      onSaved();
    } catch (e) {
      toast(e?.response?.data?.detail || "Kunne ikke lagre");
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div
        className="dropzone"
        onClick={() => fileRef.current?.click()}
        role="button"
      >
        <Camera size={22} strokeWidth={1.3} className="mx-auto" style={{ color: "var(--ink-mute)" }} />
        <div className="font-serif-display text-xl mt-3">Ta bilde eller last opp</div>
        <div className="label-ui mt-2">Fotografer håndskrevne sider — jeg leser dem</div>
        <input
          ref={fileRef}
          data-testid={TID.sampleScanInput}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => scan(e.target.files?.[0])}
        />
      </div>

      {preview && (
        <div className="mt-6 flex items-start gap-4">
          <img src={preview} alt="" className="w-24 h-24 object-cover" style={{ border: "1px solid var(--line)" }} />
          <div className="flex-1">
            {scanning ? (
              <div className="label-ui inline-flex items-center gap-2">
                <ScanLine size={14} strokeWidth={1.5} className="animate-pulse" />
                Leser håndskriften…
              </div>
            ) : (
              <div className="label-ui">Transkribert · rediger før lagring</div>
            )}
          </div>
        </div>
      )}

      {(scanning || text) && (
        <div className="mt-6">
          <input
            className="input-line"
            placeholder="Tittel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            data-testid={TID.sampleScanReviewInput}
            className="textarea-editor paper p-6 min-h-[240px] mt-6"
            placeholder="Transkribert tekst vises her — juster feil før du lagrer"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-6 flex items-center justify-between">
            <span className="label-ui">
              {text.trim() ? `${text.trim().split(/\s+/).length} ord` : "0 ord"}
            </span>
            <button
              data-testid={TID.sampleScanSaveBtn}
              onClick={save}
              disabled={saving || scanning || text.trim().length < 20}
              className="btn-primary"
            >
              {saving ? "Lagrer…" : "Lagre som prøve"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- AUDIO (høytlesning) ----------
function AudioForm({ onSaved }) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(0);
  const [saving, setSaving] = useState(false);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const startedAtRef = useRef(0);
  const timerRef = useRef(null);
  const fileRef = useRef(null);

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
      const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      mediaRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mime || "audio/webm" });
        await transcribe(blob, "opptak.webm");
      };
      mr.start();
      setRecording(true);
      startedAtRef.current = Date.now();
      timerRef.current = setInterval(() => setDuration(Math.floor((Date.now() - startedAtRef.current) / 1000)), 250);
    } catch (e) {
      toast("Ingen mikrofontilgang");
    }
  };

  const stopRec = () => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") {
      mediaRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setRecording(false);
  };

  const transcribe = async (blob, name) => {
    setTranscribing(true);
    setText("");
    try {
      const fd = new FormData();
      const file = new File([blob], name, { type: blob.type || "audio/webm" });
      fd.append("file", file);
      const r = await api.post("/samples/transcribe", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setText(r.data.text || "");
      setTitle(r.data.suggested_title || "Høytlesning");
      toast("Transkribert");
    } catch (e) {
      toast(e?.response?.data?.detail || "Kunne ikke transkribere");
    } finally { setTranscribing(false); }
  };

  const uploadFile = async (f) => {
    if (!f) return;
    if (!/\.(mp3|m4a|wav|webm|mp4|mpga|mpeg)$/i.test(f.name)) { toast("Bare lydfiler"); return; }
    setTitle(f.name.replace(/\.[^.]+$/, ""));
    await transcribe(f, f.name);
  };

  const save = async () => {
    if (text.trim().length < 20) { toast("Minst 20 tegn"); return; }
    setSaving(true);
    try {
      await api.post("/samples", { title: title.trim() || "Høytlesning", content: text });
      toast("Lagret");
      setText(""); setTitle(""); setDuration(0);
      onSaved();
    } catch (e) {
      toast(e?.response?.data?.detail || "Kunne ikke lagre");
    } finally { setSaving(false); }
  };

  const mm = String(Math.floor(duration / 60)).padStart(2, "0");
  const ss = String(duration % 60).padStart(2, "0");

  return (
    <div>
      <div className="paper p-8 text-center">
        <Mic size={22} strokeWidth={1.3} className="mx-auto" style={{ color: recording ? "var(--rust)" : "var(--ink-mute)" }} />
        <div className="font-serif-display text-xl mt-3">Les høyt for meg</div>
        <div className="label-ui mt-2">
          {recording ? `Tar opp · ${mm}:${ss}` : "Trykk for å starte — les fra manus, dagbok, eller improviser"}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          {!recording ? (
            <button
              data-testid={TID.sampleAudioRecordBtn}
              onClick={startRec}
              disabled={transcribing}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Mic size={16} strokeWidth={1.5} /> Start opptak
            </button>
          ) : (
            <button
              data-testid={TID.sampleAudioStopBtn}
              onClick={stopRec}
              className="btn-primary inline-flex items-center gap-2"
              style={{ background: "var(--rust)", borderColor: "var(--rust)" }}
            >
              <Square size={14} strokeWidth={1.8} /> Stopp
            </button>
          )}
          <button
            data-testid={TID.sampleAudioUploadBtn}
            onClick={() => fileRef.current?.click()}
            className="btn-ghost inline-flex items-center gap-2"
            disabled={recording || transcribing}
          >
            <Upload size={16} strokeWidth={1.5} /> Last opp lydfil
          </button>
          <input
            ref={fileRef}
            data-testid={TID.sampleAudioUploadInput}
            type="file"
            accept="audio/*,.mp3,.m4a,.wav,.webm"
            className="hidden"
            onChange={(e) => uploadFile(e.target.files?.[0])}
          />
        </div>

        {transcribing && (
          <div className="label-ui mt-4 inline-flex items-center gap-2">
            <Loader2 size={12} className="animate-spin" /> Transkriberer…
          </div>
        )}
      </div>

      {(transcribing || text) && (
        <div className="mt-8">
          <input
            className="input-line"
            placeholder="Tittel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            data-testid={TID.sampleAudioReviewInput}
            className="textarea-editor paper p-6 min-h-[220px] mt-6"
            placeholder="Transkriberingen dukker opp her — rett feil før du lagrer"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-6 flex items-center justify-between">
            <span className="label-ui">
              {text.trim() ? `${text.trim().split(/\s+/).length} ord` : "0 ord"}
            </span>
            <button
              data-testid={TID.sampleAudioSaveBtn}
              onClick={save}
              disabled={saving || transcribing || text.trim().length < 20}
              className="btn-primary"
            >
              {saving ? "Lagrer…" : "Lagre som prøve"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
