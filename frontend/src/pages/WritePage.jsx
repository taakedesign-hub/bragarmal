import { useEffect, useRef, useState } from "react";
import { api, BACKEND } from "@/lib/api";
import { TID } from "@/lib/testIds";
import { toast } from "sonner";
import { PenLine, Copy, RefreshCcw, Wand2, Gauge, BookmarkPlus, X } from "lucide-react";

const MODES = [
  { id: "prompt", label: "Fra frø", hint: "Skriv fra et emne, en åpningslinje eller en idé." },
  { id: "continue", label: "Fortsett teksten", hint: "Lim inn teksten din — jeg fortsetter der du slapp." },
  { id: "humanize", label: "Gjør mer menneskelig", hint: "Skriv om en tekst for å fjerne AI-signaturer." },
];

const LENGTHS = [
  { id: "kort", label: "Kort" },
  { id: "medium", label: "Medium" },
  { id: "lang", label: "Lang" },
];

const HUMANIZE = [
  { id: 1, label: "Standard" },
  { id: 2, label: "Mer menneskelig" },
  { id: 3, label: "Rå" },
];

export default function WritePage() {
  const [models, setModels] = useState([]);
  const [model, setModel] = useState("claude-sonnet-4-5");
  const [mode, setMode] = useState("prompt");
  const [length, setLength] = useState("medium");
  const [humanize, setHumanize] = useState(1);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [detection, setDetection] = useState(null);
  const [samplesReady, setSamplesReady] = useState(false);
  const [profileReady, setProfileReady] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/models");
        setModels(r.data || []);
      } catch {}
      try {
        const s = await api.get("/samples");
        setSamplesReady((s.data || []).length > 0);
      } catch {}
      try {
        const p = await api.get("/voice/profile");
        setProfileReady(!!p.data);
      } catch {}
    })();
  }, []);

  const activeMode = MODES.find((m) => m.id === mode);

  const generate = async () => {
    if (!input.trim()) { toast("Skriv noe i input-feltet først"); return; }
    if (streaming) return;
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
        body: JSON.stringify({ mode, text: input, model, humanize_level: humanize, length }),
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

  const humanizeMore = async () => {
    if (!output.trim()) return;
    setInput(output);
    setMode("humanize");
    setHumanize(Math.min(humanize + 1, 3));
    setTimeout(() => generate(), 50);
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

  const runDetect = async () => {
    const text = output || input;
    if (!text.trim()) return;
    try {
      const r = await api.post("/detect", { text });
      setDetection(r.data);
    } catch {}
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12">
      <div className="fade-in">
        <div className="label-ui">Skrivepult</div>
        <h1 className="font-serif-display text-5xl font-light mt-3" style={{ color: "var(--ink)" }}>
          Bryt sperren.
        </h1>
        <p className="font-editor mt-4 max-w-[60ch]" style={{ color: "var(--ink-soft)" }}>
          {profileReady
            ? "Stemmen din er lastet. Skriv et frø eller lim inn teksten din."
            : samplesReady
            ? "Tips: kjør stemmeanalyse under «Stemme» for skarpere resultater."
            : "Tips: legg inn noen prøver under «Prøver» først — kvaliteten hopper."}
        </p>
      </div>

      {/* Controls row */}
      <div className="mt-10 hairline-t hairline-b py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        <ControlSelect
          label="Modus"
          tid={TID.writeModeSelect}
          value={mode}
          onChange={setMode}
          options={MODES.map((m) => ({ value: m.id, label: m.label }))}
        />
        <ControlSelect
          label="Modell"
          tid={TID.writeModelSelect}
          value={model}
          onChange={setModel}
          options={models.map((m) => ({ value: m.id, label: m.label }))}
        />
        <ControlSelect
          label="Lengde"
          tid={TID.writeLengthSelect}
          value={length}
          onChange={setLength}
          options={LENGTHS.map((l) => ({ value: l.id, label: l.label }))}
        />
        <ControlSelect
          label="Humanisering"
          tid={TID.writeHumanizeSelect}
          value={humanize}
          onChange={(v) => setHumanize(Number(v))}
          options={HUMANIZE.map((h) => ({ value: h.id, label: h.label }))}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between">
            <div className="label-ui">Input</div>
            <div className="label-ui">{activeMode?.hint}</div>
          </div>
          <textarea
            data-testid={TID.writePromptInput}
            className="textarea-editor paper p-6 min-h-[380px] mt-3"
            placeholder={
              mode === "prompt"
                ? "F.eks: «En natt i november da telefonen ringte tre ganger…»"
                : mode === "continue"
                ? "Lim inn teksten du vil at jeg skal fortsette…"
                : "Lim inn en tekst som skal skrives om…"
            }
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
                <PenLine size={16} strokeWidth={1.5} /> Skriv
              </button>
            ) : (
              <button onClick={stop} className="btn-ghost">Stopp</button>
            )}
            <button
              data-testid={TID.writeDetectBtn}
              onClick={runDetect}
              className="btn-ghost inline-flex items-center gap-2"
              disabled={!input && !output}
            >
              <Gauge size={16} strokeWidth={1.5} /> Sjekk AI-signatur
            </button>
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between">
            <div className="label-ui">Utkast i din stemme</div>
            {streaming && <span className="label-ui"><span className="pulse-dot" /> Skriver…</span>}
          </div>
          <div
            data-testid={TID.writeOutput}
            className="paper p-6 min-h-[380px] mt-3 font-editor text-[1.05rem] leading-relaxed whitespace-pre-wrap"
            style={{ color: "var(--ink)" }}
          >
            {output || <span style={{ color: "var(--ink-mute)" }} className="italic">Utkastet dukker opp her.</span>}
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
              <RefreshCcw size={16} strokeWidth={1.5} /> Skriv på nytt
            </button>
            <button
              data-testid={TID.writeHumanizeMoreBtn}
              onClick={humanizeMore}
              className="btn-ghost inline-flex items-center gap-2"
              disabled={streaming || !output}
            >
              <Wand2 size={16} strokeWidth={1.5} /> Gjør mer menneskelig
            </button>
            <button
              data-testid={TID.writeSaveAsSampleBtn}
              onClick={openSave}
              className="btn-ghost inline-flex items-center gap-2"
              disabled={streaming || !output}
            >
              <BookmarkPlus size={16} strokeWidth={1.5} /> Lagre som prøve
            </button>
          </div>
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
        <div data-testid={TID.writeDetectionResult} className="mt-12">
          <div className="hairline-t hairline-b py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="label-ui">Menneske-score</div>
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
              <div className="label-ui">AI-fraser funnet</div>
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
        </div>
      )}
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
