import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { TID } from "@/lib/testIds";
import { toast } from "sonner";
import { Upload, Trash2, FileText } from "lucide-react";

export default function SamplesPage() {
  const [samples, setSamples] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const load = async () => {
    try {
      const r = await api.get("/samples");
      setSamples(r.data || []);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!content.trim() || content.trim().length < 20) {
      toast("Teksten må være minst 20 tegn");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/samples", { title: title.trim() || "Uten tittel", content });
      setTitle(""); setContent("");
      toast("Lagret prøve");
      load();
    } catch (e) {
      toast(e?.response?.data?.detail || "Kunne ikke lagre");
    } finally {
      setSubmitting(false);
    }
  };

  const uploadFile = async (file) => {
    if (!file) return;
    const okExt = /\.(txt|pdf|docx|md)$/i.test(file.name);
    if (!okExt) { toast("Bare .txt, .md, .pdf eller .docx"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", file.name);
      await api.post("/samples/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast(`Lastet opp ${file.name}`);
      load();
    } catch (e) {
      toast(e?.response?.data?.detail || "Kunne ikke laste opp");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    files.forEach(uploadFile);
  };

  const del = async (id) => {
    try {
      await api.delete(`/samples/${id}`);
      setSamples((s) => s.filter((x) => x.id !== id));
      toast("Slettet");
    } catch { toast("Kunne ikke slette"); }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12">
      <div className="fade-in">
        <div className="label-ui">Bibliotek</div>
        <h1 className="font-serif-display text-5xl font-light mt-3" style={{ color: "var(--ink)" }}>
          Skriveprøver
        </h1>
        <p className="font-editor mt-4 max-w-[60ch]" style={{ color: "var(--ink-soft)" }}>
          Jo mer variert materiale du gir meg, desto tydeligere blir stemmen din. Blanding av sjangre og lengder er en fordel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
        {/* Left: upload + paste */}
        <div className="lg:col-span-7">
          <div
            data-testid={TID.sampleUploadBtn}
            className={`dropzone ${dragging ? "dragging" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
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
              onChange={(e) => uploadFile(e.target.files?.[0])}
            />
            {uploading && <div className="label-ui mt-3"><span className="pulse-dot" /> Laster opp…</div>}
          </div>

          <div className="mt-10">
            <div className="label-ui mb-3">Eller lim inn</div>
            <form onSubmit={submit}>
              <input
                data-testid={TID.sampleTitleInput}
                className="input-line"
                placeholder="Tittel (valgfritt)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="mt-6">
                <textarea
                  data-testid={TID.sampleContentInput}
                  className="textarea-editor paper p-6 min-h-[240px]"
                  placeholder="Lim inn en tekst du har skrevet — en scene, et essay, en dagbokoppføring…"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="mt-6 flex items-center justify-between">
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
            </form>
          </div>
        </div>

        {/* Right: list */}
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
                      {s.word_count} ord · {s.source === "file" ? "opplastet" : "limt inn"}
                    </div>
                    <div className="font-editor text-sm mt-2 line-clamp-2" style={{ color: "var(--ink-soft)" }}>
                      {s.content.slice(0, 180)}…
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
    </div>
  );
}
