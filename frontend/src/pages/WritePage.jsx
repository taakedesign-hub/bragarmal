import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { api, BACKEND } from "@/lib/api";
import { TID } from "@/lib/testIds";
import { toast } from "sonner";
import { Copy, RefreshCcw, Gauge, BookmarkPlus, X, Download, Mail, FileText, Share2, Loader2, Compass, BookOpen, GitCompare } from "lucide-react";
import jsPDF from "jspdf";

const MODES = [
  {
    id: "next_steps",
    label: "Finn veien videre",
    hint: "Lim inn teksten din — jeg foreslår retninger, ikke ferdig prosa.",
    cta: "Foreslå retninger",
    icon: Compass,
    outputTitle: "Retninger å utforske",
  },
  {
    id: "reflect",
    label: "Les det jeg har",
    hint: "Lim inn teksten din — jeg speiler tilbake hva jeg leser, uten å gi råd.",
    cta: "Les det jeg har",
    icon: BookOpen,
    outputTitle: "Editorisk lesning",
  },
  {
    id: "voice_match",
    label: "Sammenlign med min stemme",
    hint: "Lim inn teksten — jeg sammenligner mot stemmeprofilen din, setning for setning.",
    cta: "Sammenlign",
    icon: GitCompare,
    outputTitle: "Sammenligning",
  },
];

const LENGTHS = [
  { id: "kort", label: "Kort" },
  { id: "medium", label: "Medium" },
  { id: "lang", label: "Lang" },
];

export default function WritePage() {
  const [mode, setMode] = useState("next_steps");
  const [length, setLength] = useState("medium");
  const [temperature, setTemperature] = useState(0.7);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [detection, setDetection] = useState(null);
  const [samplesReady, setSamplesReady] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [canSharePdf, setCanSharePdf] = useState(false);
  const abortRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Prefill draft when navigated here from a sample ("Send til Skrivepulten")
    const draft = location.state?.draft;
    if (draft && typeof draft === "string") {
      const requestedMode = location.state?.mode || "reflect";
      const autoRun = !!location.state?.autoRun;
      const passedTemp = location.state?.temperature;
      setInput(draft);
      // Guard: only allow modes that still exist
      const validModes = MODES.map((m) => m.id);
      setMode(validModes.includes(requestedMode) ? requestedMode : "reflect");
      if (typeof passedTemp === "number") setTemperature(passedTemp);
      toast(`Utkast hentet${location.state?.source ? ` fra "${location.state.source}"` : ""}`);
      // Clear state so a refresh doesn't refill
      navigate(location.pathname, { replace: true, state: {} });
      if (autoRun) {
        setTimeout(() => { generateRef.current?.(); }, 100);
      }
    }
  }, [location.state?.draft]);

  // Keep a stable ref to generate so the effect above can call it without stale closure
  const generateRef = useRef(null);

  useEffect(() => {
    // Detect Web Share API file support (mobile Safari, Chrome Android)
    try {
      const probe = new File(["x"], "probe.pdf", { type: "application/pdf" });
      setCanSharePdf(!!(navigator.canShare && navigator.canShare({ files: [probe] })));
    } catch {}
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const s = await api.get("/samples");
        setSamplesReady((s.data || []).length > 0);
      } catch (e) { console.debug("samples fetch failed", e); }
      try {
        const p = await api.get("/voice/profile");
        setProfileReady(!!p.data);
      } catch (e) { console.debug("voice profile fetch failed", e); }
    })();
  }, []);

  const activeMode = MODES.find((m) => m.id === mode) || MODES[0];

  const runVoiceMatch = async () => {
    if (!input.trim()) { toast("Lim inn tekst først"); return; }
    setOutput("");
    setDetection(null);
    setStreaming(true);
    try {
      const r = await api.post("/detect", { text: input });
      setDetection(r.data);
      setTimeout(() => {
        document.getElementById("detection-strip")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (e) {
      toast(e?.response?.data?.detail || "Kunne ikke sammenligne — prøv igjen");
    } finally {
      setStreaming(false);
    }
  };

  const generate = async () => {
    if (!input.trim()) { toast("Lim inn tekst først"); return; }
    if (streaming) return;
    if (mode === "voice_match") { return runVoiceMatch(); }
    setOutput("");
    setDetection(null);
    setStreaming(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch(`${BACKEND}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mode, text: input, length, temperature }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const err = await res.text();
        toast("Feil: " + (err || res.status));
        setStreaming(false);
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const events = buf.split("\n\n");
        buf = events.pop() || "";
        for (const ev of events) {
          if (!ev.startsWith("data:")) continue;
          const payload = ev.slice(5).trim();
          if (!payload) continue;
          try {
            const obj = JSON.parse(payload);
            if (obj.delta) setOutput((o) => o + obj.delta);
            if (obj.error) toast("Genereringsfeil: " + obj.error);
            if (obj.done) { /* end */ }
          } catch {}
        }
      }
    } catch (e) {
      if (e.name !== "AbortError") toast("Nettverksfeil");
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  // Wire the ref so navigation-triggered autoRun can invoke generate()
  generateRef.current = generate;

  const stop = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  const copyOut = async () => {
    try {
      await navigator.clipboard.writeText(output);
      toast("Kopiert");
    } catch { toast("Kunne ikke kopiere"); }
  };

  const downloadTxt = () => {
    if (!output.trim()) return;
    try {
      const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `bragarmal-utkast-${stamp}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast("Lastet ned");
    } catch { toast("Kunne ikke laste ned"); }
  };

  const emailOut = () => {
    if (!output.trim()) return;
    const subject = encodeURIComponent("Utkast fra BRAGARMÅL");
    const body = encodeURIComponent(output);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const buildPdf = async () => {
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 64;
    const stamp = new Date().toISOString().slice(0, 10);

    // Load logo once
    let logoImg = null;
    try {
      logoImg = await new Promise((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = "/bragr-logo.png";
      });
    } catch {}

    // Pre-scale logo variants to keep PDF small
    let watermarkData = null;
    let headerData = null;
    if (logoImg) {
      try {
        const wmCanvas = document.createElement("canvas");
        wmCanvas.width = 400;
        wmCanvas.height = Math.round(logoImg.naturalHeight * (400 / logoImg.naturalWidth));
        const wctx = wmCanvas.getContext("2d");
        wctx.globalAlpha = 0.07;
        wctx.drawImage(logoImg, 0, 0, wmCanvas.width, wmCanvas.height);
        watermarkData = wmCanvas.toDataURL("image/png");

        const hCanvas = document.createElement("canvas");
        hCanvas.width = 200;
        hCanvas.height = Math.round(logoImg.naturalHeight * (200 / logoImg.naturalWidth));
        hCanvas.getContext("2d").drawImage(logoImg, 0, 0, hCanvas.width, hCanvas.height);
        headerData = hCanvas.toDataURL("image/png");
      } catch {}
    }

    const wmRatio = logoImg ? logoImg.naturalHeight / logoImg.naturalWidth : 0.6;
    const wmW = pageW * 0.55;
    const wmH = wmW * wmRatio;

    pdf.setFont("times", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(28, 27, 26);
    const textWidth = pageW - margin * 2;
    const lines = pdf.splitTextToSize(output, textWidth);
    pdf.text(lines, margin, margin + 40, { lineHeightFactor: 1.55 });

    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      if (watermarkData) {
        try { pdf.addImage(watermarkData, "PNG", (pageW - wmW) / 2, (pageH - wmH) / 2, wmW, wmH); } catch {}
      }
      if (headerData) {
        try {
          const headerW = 70;
          pdf.addImage(headerData, "PNG", margin, margin - 32, headerW, headerW * wmRatio);
        } catch {}
      }
      pdf.setFontSize(8);
      pdf.setTextColor(122, 118, 110);
      pdf.text(`Bragarmål · Bragarmål.no · ${stamp}`, margin, pageH - margin / 2);
      pdf.text(`${i} / ${pageCount}`, pageW - margin, pageH - margin / 2, { align: "right" });
    }

    return { pdf, filename: `bragarmal-utkast-${stamp}.pdf` };
  };

  const downloadPdf = async () => {
    if (!output.trim()) return;
    try {
      const { pdf, filename } = await buildPdf();
      pdf.save(filename);
      toast("PDF lastet ned");
    } catch {
      toast("Kunne ikke lage PDF");
    }
  };

  const sharePdf = async () => {
    if (!output.trim()) return;
    try {
      const { pdf, filename } = await buildPdf();
      const blob = pdf.output("blob");
      const file = new File([blob], filename, { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Utkast fra Bragarmål",
          text: "Skrevet med Bragarmål — Bragarmål.no",
        });
        toast("Delt");
      } else {
        // Fallback — download instead
        pdf.save(filename);
        toast("Deling ikke støttet — PDF lastet ned");
      }
    } catch (e) {
      if (e && e.name === "AbortError") return; // user cancelled share sheet
      toast("Kunne ikke dele PDF");
    }
  };

  const openSave = () => {
    if (!output.trim()) return;
    // Default title from input or first line of output
    const seed = (input || output).trim().split(/\n/)[0].slice(0, 60);
    setSaveTitle(seed || "Utkast");
    setSaveOpen(true);
  };

  const saveAsSample = async () => {
    if (!output.trim()) return;
    setSaving(true);
    try {
      await api.post("/samples", {
        title: saveTitle.trim() || "Utkast",
        content: output,
      });
      toast("Lagret som prøve");
      setSaveOpen(false);
      setSaveTitle("");
    } catch (e) {
      toast(e?.response?.data?.detail || "Kunne ikke lagre");
    } finally {
      setSaving(false);
    }
  };

  const [composition, setComposition] = useState(false);

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12">
      <div className="fade-in">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <div className="label-ui">Skrivepult</div>
            <h1 className="font-serif-display text-5xl font-light mt-3" style={{ color: "var(--ink)" }}>
              Sparr med deg selv.
            </h1>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setComposition(true)}
              className="font-mono-ui text-[11px] tracking-widest hover:underline"
              style={{ color: "var(--ink-mute)" }}
              data-testid="write-composition-mode-btn"
              title="Distraksjonsfri fullskjermsmodus"
            >
              KOMPOSISJONSMODUS
            </button>
            <Link
              to="/eksempler#testprompter"
              data-testid="write-testprompter-link"
              className="font-mono-ui text-[11px] tracking-widest hover:underline inline-flex items-center gap-1.5"
              style={{ color: "var(--rust)" }}
            >
              SE EKSEMPLER →
            </Link>
          </div>
        </div>
        <p className="font-editor mt-4 max-w-[62ch]" style={{ color: "var(--ink-soft)" }}>
          Ikke en tekstautomat. En sparringspartner. Skriv teksten din selv —
          {" "}Bragarmål foreslår retninger, speiler det du har, og sammenligner mot din egen stemme.
          {" "}
          {profileReady
            ? "Stemmen din er lastet."
            : samplesReady
            ? "Tips: kjør stemmeanalyse under «Stemme» for skarpere resultater."
            : "Tips: legg inn noen prøver under «Prøver» først — kvaliteten hopper."}
        </p>
      </div>

      {/* Mode-fanene (nye) — de tre kjernemodusene */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-0 hairline-t hairline-b">
        {MODES.map((m, i) => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              data-testid={`write-mode-${m.id}`}
              onClick={() => { setMode(m.id); setOutput(""); setDetection(null); }}
              className={`text-left p-5 md:p-6 ${i > 0 ? "sm:border-l" : ""} transition-colors`}
              style={{
                borderColor: "var(--line)",
                background: active ? "var(--paper)" : "transparent",
                cursor: "pointer",
              }}
            >
              <div className="flex items-center gap-2" style={{ color: active ? "var(--moss)" : "var(--ink-mute)" }}>
                <Icon size={18} strokeWidth={1.4} />
                <div className="font-mono-ui text-[10px] tracking-widest">{String(i + 1).padStart(2, "0")}</div>
              </div>
              <div className="mt-3 font-serif-display text-xl md:text-2xl leading-tight" style={{ color: "var(--ink)" }}>
                {m.label}
              </div>
              <div className="mt-2 font-editor text-sm" style={{ color: "var(--ink-soft)" }}>
                {m.hint}
              </div>
            </button>
          );
        })}
      </div>

      {/* Controls row */}
      <div className="mt-8 hairline-t hairline-b py-5 grid grid-cols-2 gap-4">
        {mode !== "voice_match" && (
          <ControlSelect
            label="Temperatur"
            tid="write-temperature-select"
            value={String(temperature)}
            onChange={(v) => setTemperature(Number(v))}
            options={[
              { value: "0.3", label: "Lav · trygg og kontrollert" },
              { value: "0.7", label: "Middels · naturlig balanse" },
              { value: "1", label: "Høy · frekk og kreativ" },
            ]}
          />
        )}
        {mode === "reflect" && (
          <ControlSelect
            label="Lengde på lesning"
            tid={TID.writeLengthSelect}
            value={length}
            onChange={setLength}
            options={LENGTHS.map((l) => ({ value: l.id, label: l.label }))}
          />
        )}
      </div>
      <div className="mt-3 flex items-center justify-end">
        <Link
          to="/eksempler#temperatur"
          className="font-mono-ui text-[10px] tracking-widest hover:underline"
          style={{ color: "var(--ink-mute)" }}
          data-testid="write-temperature-help-link"
        >
          HVA ER TEMPERATUR? →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between">
            <div className="label-ui">Din tekst</div>
            <div className="label-ui">{activeMode?.hint}</div>
          </div>
          <textarea
            data-testid={TID.writePromptInput}
            className="textarea-editor paper p-6 min-h-[380px] mt-3"
            placeholder="Lim inn eller skriv teksten din her…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="mt-4 flex items-center gap-3">
            {!streaming ? (
              <button
                data-testid={TID.writeGenerateBtn}
                onClick={generate}
                className="btn-primary inline-flex items-center gap-2"
              >
                {activeMode?.icon && <activeMode.icon size={16} strokeWidth={1.5} />} {activeMode?.cta}
              </button>
            ) : (
              <button onClick={stop} className="btn-ghost">Stopp</button>
            )}
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between">
            <div className="label-ui">{activeMode?.outputTitle}</div>
            {streaming && <span className="label-ui"><span className="pulse-dot" /> Skriver…</span>}
          </div>
          {mode !== "voice_match" && (
            <>
              <div
                data-testid={TID.writeOutput}
                className="paper p-6 min-h-[380px] mt-3 font-editor text-[1.05rem] leading-relaxed whitespace-pre-wrap"
                style={{ color: "var(--ink)" }}
              >
                {output || <span style={{ color: "var(--ink-mute)" }} className="italic">
                  {mode === "next_steps"
                    ? "Retningsforslag dukker opp her — konkrete måter å ta teksten videre."
                    : "Lesningen dukker opp her — det jeg legger merke til i teksten din."}
                </span>}
              </div>
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <button
                  data-testid={TID.writeCopyBtn}
                  onClick={copyOut}
                  className="btn-ghost inline-flex items-center gap-2"
                  disabled={!output}
                >
                  <Copy size={16} strokeWidth={1.5} /> Kopier
                </button>
                <button
                  data-testid={TID.writeRegenerateBtn}
                  onClick={generate}
                  className="btn-ghost inline-flex items-center gap-2"
                  disabled={streaming || !input}
                >
                  <RefreshCcw size={16} strokeWidth={1.5} /> Kjør på nytt
                </button>
                <button
                  data-testid={TID.writeSaveAsSampleBtn}
                  onClick={openSave}
                  className="btn-ghost inline-flex items-center gap-2"
                  disabled={streaming || !output}
                >
                  <BookmarkPlus size={16} strokeWidth={1.5} /> Lagre som prøve
                </button>
                <button
                  data-testid={TID.writeDownloadBtn}
                  onClick={downloadTxt}
                  className="btn-ghost inline-flex items-center gap-2"
                  disabled={streaming || !output}
                >
                  <Download size={16} strokeWidth={1.5} /> Last ned .txt
                </button>
                <button
                  data-testid={TID.writePdfBtn}
                  onClick={downloadPdf}
                  className="btn-ghost inline-flex items-center gap-2"
                  disabled={streaming || !output}
                >
                  <FileText size={16} strokeWidth={1.5} /> Last ned .pdf
                </button>
                {canSharePdf && (
                  <button
                    data-testid={TID.writeSharePdfBtn}
                    onClick={sharePdf}
                    className="btn-ghost inline-flex items-center gap-2"
                    disabled={streaming || !output}
                  >
                    <Share2 size={16} strokeWidth={1.5} /> Del PDF
                  </button>
                )}
                <button
                  data-testid={TID.writeEmailBtn}
                  onClick={emailOut}
                  className="btn-ghost inline-flex items-center gap-2"
                  disabled={streaming || !output}
                >
                  <Mail size={16} strokeWidth={1.5} /> Send til e-post
                </button>
              </div>
            </>
          )}
          {mode === "voice_match" && !detection && (
            <div className="paper p-6 min-h-[380px] mt-3 font-editor text-[1.05rem] leading-relaxed" style={{ color: "var(--ink-mute)" }}>
              <span className="italic">Trykk «Sammenlign» — så viser jeg deg hva som ligner deg og hva som ikke gjør det, setning for setning.</span>
            </div>
          )}
        </div>
      </div>

      {/* Save-as-sample modal */}
      {saveOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center px-4"
          style={{ background: "rgba(28,27,26,0.35)" }}
          onClick={() => !saving && setSaveOpen(false)}
        >
          <div
            className="paper w-full max-w-lg p-8"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "var(--surface)" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="label-ui">Legg til i biblioteket</div>
                <h3 className="font-serif-display text-3xl mt-2" style={{ color: "var(--ink)" }}>
                  Lagre som prøve
                </h3>
              </div>
              <button
                onClick={() => !saving && setSaveOpen(false)}
                className="p-1"
                style={{ color: "var(--ink-mute)" }}
                aria-label="Lukk"
              >
                <X size={18} strokeWidth={1.4} />
              </button>
            </div>
            <p className="font-editor mt-4 text-sm" style={{ color: "var(--ink-soft)" }}>
              Utkastet legges til i «Prøver» og brukes til å forsterke stemmeprofilen din neste gang du kjører analyse.
            </p>
            <div className="mt-6">
              <div className="label-ui mb-2">Tittel</div>
              <input
                data-testid={TID.writeSaveAsSampleTitleInput}
                className="input-line"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="Kort beskrivelse"
                autoFocus
              />
            </div>
            <div className="mt-4 paper p-4 max-h-40 overflow-auto" style={{ background: "var(--bg-alt)" }}>
              <p className="font-editor text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--ink-soft)" }}>
                {output.slice(0, 400)}{output.length > 400 ? "…" : ""}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setSaveOpen(false)}
                className="btn-ghost"
                disabled={saving}
              >
                Avbryt
              </button>
              <button
                data-testid={TID.writeSaveAsSampleConfirm}
                onClick={saveAsSample}
                className="btn-primary"
                disabled={saving || !saveTitle.trim()}
              >
                {saving ? "Lagrer…" : "Lagre"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detection strip */}
      {detection && (
        <div id="detection-strip" data-testid={TID.writeDetectionResult} className="mt-12 scroll-mt-24">
          <div className="mb-6">
            <div className="label-ui" style={{ color: "var(--rust)" }}>Stemmesjekk</div>
            <h2 className="font-serif-display text-3xl md:text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
              Passer dette med min stemme?
            </h2>
          </div>

          {/* Warning if text was too short for reliable analysis */}
          {detection.too_short && (
            <div
              className="mb-6 p-4"
              style={{ background: "var(--linen)", border: "1px solid var(--rust)" }}
            >
              <div className="font-mono-ui text-[11px] tracking-widest" style={{ color: "var(--rust)" }}>
                FOR KORT TEKST FOR PÅLITELIG ANALYSE
              </div>
              <p className="mt-2 font-editor text-sm" style={{ color: "var(--ink)" }}>
                Teksten er kun {detection.word_count} ord. Analysen trenger minst {detection.min_words_reliable} ord
                for å gi en pålitelig vurdering. Tallene under er kun statistikk — ingen menneskelig-vs-AI-dom.
              </p>
            </div>
          )}

          {/* AI verdict — Claude's nuanced take (when text is long enough) */}
          {detection.ai_verdict && detection.ai_verdict.label && (
            <div
              className="mb-6 p-5"
              style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
            >
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <div className="label-ui">Lesning fra Bragarmål</div>
                {detection.ai_verdict.confidence != null && (
                  <div className="label-ui" style={{ color: "var(--ink-mute)" }}>
                    Sikkerhet: {detection.ai_verdict.confidence}%
                  </div>
                )}
              </div>
              <div
                className="font-serif-display text-3xl md:text-4xl mt-2"
                style={{
                  color:
                    /menneskelig/i.test(detection.ai_verdict.label)
                      ? "var(--moss)"
                      : /usikker/i.test(detection.ai_verdict.label)
                      ? "var(--rust)"
                      : "#a13a3a",
                }}
              >
                {detection.ai_verdict.label}
              </div>
              {detection.ai_verdict.reasoning && (
                <p className="mt-3 font-editor text-base leading-relaxed" style={{ color: "var(--ink)" }}>
                  {detection.ai_verdict.reasoning}
                </p>
              )}
              {Array.isArray(detection.ai_verdict.notes) && detection.ai_verdict.notes.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {detection.ai_verdict.notes.map((n, i) => (
                    <li key={i} className="font-editor text-sm flex gap-2" style={{ color: "var(--ink-soft)" }}>
                      <span style={{ color: "var(--rust)" }}>—</span> {n}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="hairline-t hairline-b py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="label-ui">Statistisk score</div>
              <div className="font-serif-display text-4xl mt-1" style={{ color: "var(--ink)" }}>
                {detection.score}<span className="text-xl" style={{ color: "var(--ink-mute)" }}>/100</span>
              </div>
              <div className="label-ui mt-1" style={{ color: detection.score >= 65 ? "var(--moss)" : detection.score >= 40 ? "var(--rust)" : "#a13a3a" }}>
                {detection.label}
              </div>
            </div>
            <div className="md:border-l md:pl-6" style={{ borderColor: "var(--line)" }}>
              <div className="label-ui">Rytme-variasjon</div>
              <div className="font-serif-display text-3xl mt-1" style={{ color: "var(--ink)" }}>
                {detection.burstiness}
              </div>
            </div>
            <div className="md:border-l md:pl-6" style={{ borderColor: "var(--line)" }}>
              <div className="label-ui">Ordforråd</div>
              <div className="font-serif-display text-3xl mt-1" style={{ color: "var(--ink)" }}>
                {Math.round(detection.vocab_richness * 100)}%
              </div>
            </div>
            <div className="md:border-l md:pl-6" style={{ borderColor: "var(--line)" }}>
              <div className="label-ui">Klisjéer funnet</div>
              <div className="font-serif-display text-3xl mt-1" style={{ color: "var(--ink)" }}>
                {(detection.ai_markers || []).reduce((a, m) => a + m.count, 0)}
              </div>
            </div>
          </div>

          {/* Personal style row */}
          {detection.personal_style?.available && (
            <div className="hairline-b py-6">
              <div className="label-ui mb-3">Sammenlignet med din stemme</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="label-ui">Personlig likhet</div>
                  <div
                    className="font-serif-display text-5xl mt-1"
                    style={{
                      color:
                        detection.personal_style.personal_similarity >= 70
                          ? "var(--moss)"
                          : detection.personal_style.personal_similarity >= 45
                          ? "var(--rust)"
                          : "#a13a3a",
                    }}
                  >
                    {detection.personal_style.personal_similarity}<span className="text-xl" style={{ color: "var(--ink-mute)" }}>/100</span>
                  </div>
                  <div className="label-ui mt-1">{detection.personal_style.label}</div>
                </div>
                <div className="md:border-l md:pl-6" style={{ borderColor: "var(--line)" }}>
                  <div className="label-ui">Funksjonsord</div>
                  <div className="font-serif-display text-3xl mt-1" style={{ color: "var(--ink)" }}>
                    {Math.round(detection.personal_style.function_word_cosine * 100)}%
                  </div>
                  <div className="label-ui">og · men · som · at …</div>
                </div>
                <div className="md:border-l md:pl-6" style={{ borderColor: "var(--line)" }}>
                  <div className="label-ui">Signaturord</div>
                  <div className="font-serif-display text-3xl mt-1" style={{ color: "var(--ink)" }}>
                    {Math.round(detection.personal_style.signature_word_overlap * 100)}%
                  </div>
                  <div className="label-ui">av topp-15 gjenfunnet</div>
                </div>
                <div className="md:border-l md:pl-6" style={{ borderColor: "var(--line)" }}>
                  <div className="label-ui">Setnings-form</div>
                  <div className="font-serif-display text-3xl mt-1" style={{ color: "var(--ink)" }}>
                    {Math.round(detection.personal_style.sentence_shape_similarity * 100)}%
                  </div>
                  <div className="label-ui">rytmelikhet</div>
                </div>
              </div>
            </div>
          )}

          {detection.personal_style && !detection.personal_style.available && (
            <div className="hairline-b py-4 font-editor italic text-sm" style={{ color: "var(--ink-mute)" }}>
              {detection.personal_style.reason}
            </div>
          )}

          {/* Sentence-level highlighting */}
          {detection.highlights && detection.highlights.length > 0 && (
            <div className="py-8">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div>
                  <div className="label-ui">Fremhevet</div>
                  <h4 className="font-serif-display text-2xl mt-1" style={{ color: "var(--ink)" }}>
                    Setninger fremmed fra din stemme
                  </h4>
                </div>
                <div className="flex items-center gap-4 label-ui flex-wrap">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block w-3 h-3" style={{ background: "rgba(74,93,78,0.18)" }} />
                    Din stemme
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block w-3 h-3" style={{ background: "rgba(184,114,74,0.22)" }} />
                    Blandet
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block w-3 h-3" style={{ background: "rgba(161,58,58,0.22)" }} />
                    Fremmed
                  </span>
                  {detection.highlights.some((h) => h.foreign) && (
                    <button
                      data-testid="rewrite-all-foreign-btn"
                      onClick={() => {
                        const foreignText = detection.highlights
                          .filter((h) => h.foreign)
                          .map((h) => h.sentence)
                          .join(" ");
                        if (!foreignText) return;
                        setInput(foreignText);
                        setMode("reflect");
                        setDetection(null);
                        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
                        toast("Alle røde setninger klare for lesning i «Les det jeg har»");
                      }}
                      className="btn-primary"
                      style={{ padding: "0.4rem 0.9rem", fontSize: "0.7rem" }}
                    >
                      Les de røde nærmere
                    </button>
                  )}
                </div>
              </div>

              <div className="paper p-6 md:p-8 font-editor text-[1.05rem] leading-[1.85]" style={{ color: "var(--ink)" }}>
                <div className="label-ui mb-4">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block w-1 h-1 rounded-full" style={{ background: "var(--ink-mute)" }} />
                    Trykk på hvilken som helst setning for å lese den nærmere
                  </span>
                </div>
                {detection.highlights.map((h, i) => {
                  const bg =
                    h.similarity >= 60
                      ? "rgba(74,93,78,0.14)"
                      : h.similarity >= 40
                      ? "rgba(184,114,74,0.18)"
                      : "rgba(161,58,58,0.18)";
                  return (
                    <span
                      key={i}
                      onClick={() => {
                        setInput(h.sentence);
                        setMode("reflect");
                        setDetection(null);
                        if (typeof window !== "undefined") {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                        toast(
                          h.foreign
                            ? "Setning satt til nærlesning i «Les det jeg har»"
                            : "Setning klar for lesning"
                        );
                      }}
                      title={`Trykk for å lese nærmere · Likhet ${h.similarity}/100${h.ai_marker_hit ? " · Klisjé" : ""}${h.foreign_words?.length ? " · " + h.foreign_words.join(", ") : ""}`}
                      data-testid={`highlight-sentence-${i}`}
                      style={{
                        background: bg,
                        padding: "0 4px",
                        marginRight: "4px",
                        borderRadius: "1px",
                        cursor: "pointer",
                        textDecoration: h.ai_marker_hit ? "underline wavy rgba(161,58,58,0.6)" : "none",
                      }}
                    >
                      {h.sentence}
                    </span>
                  );
                })}
              </div>

              {/* Foreign word list — aggregated */}
              {(() => {
                const all = [];
                const seen = new Set();
                for (const h of detection.highlights) {
                  for (const w of (h.foreign_words || [])) {
                    if (!seen.has(w)) { seen.add(w); all.push(w); }
                  }
                }
                if (all.length === 0) return null;
                return (
                  <div className="mt-6">
                    <div className="label-ui mb-3">Ord som skiller seg mest ut</div>
                    <div className="flex flex-wrap gap-2">
                      {all.slice(0, 30).map((w, i) => (
                        <span key={i} className="chip" style={{ background: "rgba(161,58,58,0.08)" }}>
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {composition && (
        <CompositionMode
          input={input}
          onInputChange={setInput}
          onClose={() => setComposition(false)}
        />
      )}
    </div>
  );
}

function CompositionMode({ input, onInputChange, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);
  const wc = input.trim() ? input.trim().split(/\s+/).length : 0;
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--paper)" }} data-testid="composition-mode">
      <div className="flex items-center justify-between px-8 py-4 hairline-b">
        <span className="label-ui">Komposisjonsmodus · {wc} ord</span>
        <button
          onClick={onClose}
          className="font-mono-ui text-[11px] tracking-widest hover:opacity-70 inline-flex items-center gap-2"
          style={{ color: "var(--ink-mute)" }}
          data-testid="composition-mode-close"
        >
          <X size={14} strokeWidth={1.4} />
          LUKK (ESC)
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <textarea
          autoFocus
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Skriv fritt. Ingen andre distraksjoner nå."
          className="w-full h-full max-w-[70ch] mx-auto px-8 py-16 bg-transparent font-editor text-lg md:text-xl leading-[1.9] outline-none resize-none"
          style={{ color: "var(--ink)", minHeight: "calc(100vh - 80px)" }}
        />
      </div>
    </div>
  );
}

function ControlSelect({ label, value, onChange, options, tid }) {
  return (
    <div>
      <div className="label-ui mb-2">{label}</div>
      <select
        data-testid={tid}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select-line w-full"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
