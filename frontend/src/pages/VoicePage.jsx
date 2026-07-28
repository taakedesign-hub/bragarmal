import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { TID } from "@/lib/testIds";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Sparkles, RefreshCcw, Plus, X, Key } from "lucide-react";

export default function VoicePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [samplesCount, setSamplesCount] = useState(0);
  const [inspirations, setInspirations] = useState([]);
  const [inspName, setInspName] = useState("");
  const [inspNote, setInspNote] = useState("");
  const [addingInsp, setAddingInsp] = useState(false);

  const [helpers, setHelpers] = useState([]);
  const [helperName, setHelperName] = useState("");
  const [helperProvider, setHelperProvider] = useState("openai");
  const [helperModelId, setHelperModelId] = useState("");
  const [helperApiKey, setHelperApiKey] = useState("");
  const [helperPersona, setHelperPersona] = useState("");
  const [addingHelper, setAddingHelper] = useState(false);

  const load = async () => {
    try {
      const [p, s, i, h] = await Promise.all([
        api.get("/voice/profile"),
        api.get("/samples"),
        api.get("/inspirations"),
        api.get("/helpers"),
      ]);
      setProfile(p.data || null);
      setSamplesCount((s.data || []).length);
      setInspirations(i.data || []);
      setHelpers(h.data || []);
    } catch {}
  };
  useEffect(() => { load(); }, []);

  const run = async () => {
    setLoading(true);
    try {
      const r = await api.post("/voice/analyze");
      setProfile(r.data);
      toast("Stemmeprofil oppdatert");
    } catch (e) {
      toast(e?.response?.data?.detail || "Kunne ikke analysere");
    } finally {
      setLoading(false);
    }
  };

  const addInsp = async (e) => {
    e?.preventDefault?.();
    const name = inspName.trim();
    if (!name) return;
    setAddingInsp(true);
    try {
      const r = await api.post("/inspirations", { name, note: inspNote.trim() });
      setInspirations((arr) => [...arr, r.data]);
      setInspName("");
      setInspNote("");
      toast("Lagt til");
    } catch (e) {
      toast(e?.response?.data?.detail || "Kunne ikke legge til");
    } finally {
      setAddingInsp(false);
    }
  };

  const removeInsp = async (id) => {
    try {
      await api.delete(`/inspirations/${id}`);
      setInspirations((arr) => arr.filter((i) => i.id !== id));
    } catch {
      toast("Kunne ikke fjerne");
    }
  };

  const addHelper = async (e) => {
    e?.preventDefault?.();
    if (!helperName.trim() || !helperModelId.trim() || !helperApiKey.trim()) {
      toast("Fyll ut navn, modell og API-nøkkel");
      return;
    }
    setAddingHelper(true);
    try {
      const r = await api.post("/helpers", {
        name: helperName.trim(),
        provider: helperProvider,
        model_id: helperModelId.trim(),
        api_key: helperApiKey.trim(),
        persona_addon: helperPersona.trim(),
      });
      setHelpers((arr) => [...arr, r.data]);
      setHelperName(""); setHelperModelId(""); setHelperApiKey(""); setHelperPersona("");
      toast("AI-hjelper lagt til");
    } catch (err) {
      toast(err?.response?.data?.detail || "Kunne ikke legge til");
    } finally {
      setAddingHelper(false);
    }
  };

  const removeHelper = async (id) => {
    try {
      await api.delete(`/helpers/${id}`);
      setHelpers((arr) => arr.filter((h) => h.id !== id));
    } catch {
      toast("Kunne ikke fjerne");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12">
      <div className="fade-in">
        <div className="label-ui">Analyse</div>
        <h1 className="font-serif-display text-5xl font-light mt-3" style={{ color: "var(--ink)" }}>
          Din stemmeprofil
        </h1>
        <p className="font-editor mt-4 max-w-[60ch]" style={{ color: "var(--ink-soft)" }}>
          Tallene forteller én ting. Beskrivelsen forteller resten. Kjør analysen på nytt hver gang du legger til nye prøver.
        </p>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          data-testid={TID.analyzeVoiceBtn}
          className="btn-primary inline-flex items-center gap-2"
          onClick={run}
          disabled={loading || samplesCount === 0}
        >
          {loading ? <RefreshCcw size={16} strokeWidth={1.5} className="animate-spin" /> : <Sparkles size={16} strokeWidth={1.5} />}
          {profile ? "Kjør analyse på nytt" : "Kjør analyse"}
        </button>
        <span className="label-ui">{samplesCount} prøver tilgjengelig</span>
      </div>

      {!profile ? (
        <div className="mt-16 font-editor italic text-lg" style={{ color: "var(--ink-mute)" }}>
          {samplesCount === 0
            ? "Legg til prøver først."
            : "Ingen analyse ennå. Trykk «Kjør analyse»."}
        </div>
      ) : (
        <div data-testid={TID.voiceProfileCard} className="mt-12">
          {/* Numbers row */}
          <div className="hairline-t hairline-b grid grid-cols-2 md:grid-cols-4">
            <Metric label="Prøver" value={profile.total_samples} />
            <Metric label="Ord totalt" value={profile.total_words?.toLocaleString("nb-NO")} b />
            <Metric label="Setn.lengde" value={profile.avg_sentence_length} b />
            <Metric label="Ordforråd" value={`${Math.round((profile.vocabulary_richness || 0) * 100)}%`} b />
          </div>

          {/* Description */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <div className="label-ui mb-3">Tone</div>
              <p className="font-editor text-xl leading-relaxed" style={{ color: "var(--ink)" }}>
                {profile.tone_description || "—"}
              </p>
              <div className="rule my-8" />
              <div className="label-ui mb-3">Stil</div>
              <p className="font-editor text-lg leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                {profile.style_summary || "—"}
              </p>
              <div className="rule my-8" />
              <div className="label-ui mb-3">Signaturuttrykk</div>
              <div className="flex flex-wrap gap-2">
                {(profile.signature_phrases || []).length === 0 ? (
                  <span className="font-editor italic" style={{ color: "var(--ink-mute)" }}>—</span>
                ) : (
                  profile.signature_phrases.map((p, i) => (
                    <span key={i} className="chip">{p}</span>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="label-ui mb-3">Setningslengde-fordeling</div>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={profile.sentence_length_distribution || []}
                    margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
                  >
                    <XAxis
                      dataKey="range"
                      tick={{ fill: "#7A7772", fontSize: 11, fontFamily: "IBM Plex Sans" }}
                      axisLine={{ stroke: "#D9D4C7" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#7A7772", fontSize: 11, fontFamily: "IBM Plex Sans" }}
                      axisLine={{ stroke: "#D9D4C7" }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#FFFFFF",
                        border: "1px solid #D9D4C7",
                        borderRadius: 2,
                        fontFamily: "IBM Plex Sans",
                        fontSize: 12,
                      }}
                      cursor={{ fill: "rgba(74,93,78,0.08)" }}
                    />
                    <Bar dataKey="count" fill="#4A5D4E" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="label-ui mt-8 mb-3">Ord du bruker ofte</div>
              <ul>
                {(profile.top_words || []).slice(0, 10).map((w, i) => (
                  <li key={i} className="flex items-center justify-between py-1.5 hairline-b">
                    <span className="font-editor" style={{ color: "var(--ink)" }}>{w.word}</span>
                    <span className="label-ui">{w.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Inspirations section */}
      <div className="mt-24">
        <div className="hairline-t pt-10">
          <div className="label-ui">Litterære slektninger</div>
          <h2 className="font-serif-display text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
            Forfattere hvis stemme ligner din
          </h2>
          <p className="font-editor mt-4 max-w-[65ch]" style={{ color: "var(--ink-soft)" }}>
            Legg til navn på forfattere du har lest mye eller kjenner deg beslektet med.
            De brukes som et svakt bakteppe i generering — aldri for å imitere direkte,
            men for å nikke til rytmen og tematikken du kjenner igjen i deg selv.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
          <form onSubmit={addInsp} className="lg:col-span-5">
            <div className="label-ui mb-2">Navn</div>
            <input
              data-testid={TID.inspirationNameInput}
              className="input-line"
              placeholder="F.eks. Karin Fossum"
              value={inspName}
              onChange={(e) => setInspName(e.target.value)}
            />
            <div className="label-ui mt-6 mb-2">Notat (valgfritt)</div>
            <input
              data-testid={TID.inspirationNoteInput}
              className="input-line"
              placeholder="Hva du gjenkjenner — f.eks. «psykologisk uro, korte kapitler»"
              value={inspNote}
              onChange={(e) => setInspNote(e.target.value)}
              maxLength={400}
            />
            <div className="mt-6">
              <button
                data-testid={TID.inspirationAddBtn}
                type="submit"
                className="btn-primary inline-flex items-center gap-2"
                disabled={addingInsp || !inspName.trim()}
              >
                <Plus size={16} strokeWidth={1.5} /> {addingInsp ? "Legger til…" : "Legg til"}
              </button>
            </div>
          </form>

          <div className="lg:col-span-7">
            <div className="hairline-b pb-3 flex items-center justify-between">
              <span className="label-ui">Dine slektninger</span>
              <span className="label-ui">{inspirations.length}</span>
            </div>
            {inspirations.length === 0 ? (
              <div className="mt-6 font-editor italic" style={{ color: "var(--ink-mute)" }}>
                Ingen lagt til ennå.
              </div>
            ) : (
              <ul className="mt-2">
                {inspirations.map((i) => (
                  <li
                    key={i.id}
                    data-testid={TID.inspirationItem(i.id)}
                    className="hairline-b py-4 flex items-start gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-serif-display text-xl" style={{ color: "var(--ink)" }}>
                        {i.name}
                      </div>
                      {i.note && (
                        <div className="font-editor text-sm mt-1" style={{ color: "var(--ink-soft)" }}>
                          {i.note}
                        </div>
                      )}
                    </div>
                    <button
                      data-testid={TID.inspirationDeleteBtn(i.id)}
                      onClick={() => removeInsp(i.id)}
                      aria-label="Fjern"
                      title="Fjern"
                      className="p-2"
                      style={{ color: "var(--ink-mute)" }}
                    >
                      <X size={16} strokeWidth={1.4} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* AI-hjelpere — bring-your-own-AI section */}
      <div className="mt-24">
        <div className="hairline-t pt-10">
          <div className="label-ui" style={{ color: "var(--sky)" }}>Din egen AI</div>
          <h2 className="font-serif-display text-4xl font-light mt-2" style={{ color: "var(--ink)" }}>
            AI-hjelpere du har trent opp
          </h2>
          <p className="font-editor mt-4 max-w-[65ch]" style={{ color: "var(--ink-soft)" }}>
            Koble på din egen ChatGPT, Claude eller Gemini — med API-nøkkelen din og persona-instruksene
            du har finpusset over tid. Bragarmål bruker din AI i stedet for standard-modellene, men bevarer
            fortsatt din egen stemme fra prøvetekstene som førsteprioritet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
          <form onSubmit={addHelper} className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="label-ui mb-2">Navn</div>
                <input
                  className="input-line"
                  placeholder="F.eks. Min ChatGPT"
                  value={helperName}
                  onChange={(e) => setHelperName(e.target.value)}
                />
              </div>
              <div>
                <div className="label-ui mb-2">Leverandør</div>
                <select
                  className="select-line w-full"
                  value={helperProvider}
                  onChange={(e) => setHelperProvider(e.target.value)}
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="gemini">Google Gemini</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <div className="label-ui mb-2">Modell-ID</div>
              <input
                className="input-line"
                placeholder={
                  helperProvider === "openai" ? "gpt-5.2 eller gpt-4o" :
                  helperProvider === "anthropic" ? "claude-sonnet-4-5-20250929" :
                  "gemini-3.1-pro-preview"
                }
                value={helperModelId}
                onChange={(e) => setHelperModelId(e.target.value)}
              />
            </div>
            <div className="mt-6">
              <div className="label-ui mb-2">API-nøkkel</div>
              <input
                className="input-line"
                type="password"
                placeholder="sk-…"
                value={helperApiKey}
                onChange={(e) => setHelperApiKey(e.target.value)}
              />
              <p className="label-ui mt-2" style={{ color: "var(--ink-mute)" }}>
                Lagres kun i din konto. Ingen andre ser den.
              </p>
            </div>
            <div className="mt-6">
              <div className="label-ui mb-2">Persona / systeminstruks (valgfritt)</div>
              <textarea
                className="textarea-editor paper p-4 min-h-[160px]"
                placeholder="Lim inn instruksjonene du har brukt over tid — f.eks. hvordan AI-en din svarer, hva den skal unngå, tonen…"
                value={helperPersona}
                onChange={(e) => setHelperPersona(e.target.value)}
                maxLength={3000}
              />
              <p className="label-ui mt-2" style={{ color: "var(--ink-mute)" }}>
                Din stemme fra prøvetekstene går alltid først. Denne instruksen legger seg på toppen.
              </p>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                disabled={addingHelper || !helperName.trim() || !helperApiKey.trim()}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus size={16} strokeWidth={1.5} />
                {addingHelper ? "Legger til…" : "Legg til AI-hjelper"}
              </button>
            </div>
          </form>

          <div className="lg:col-span-6">
            <div className="hairline-b pb-3 flex items-center justify-between">
              <span className="label-ui">Dine hjelpere</span>
              <span className="label-ui">{helpers.length}</span>
            </div>
            {helpers.length === 0 ? (
              <div className="mt-6 font-editor italic" style={{ color: "var(--ink-mute)" }}>
                Ingen hjelpere lagt til ennå. Du kan alltid bruke standard-modellene under Skriv.
              </div>
            ) : (
              <ul className="mt-2">
                {helpers.map((h) => (
                  <li key={h.id} className="hairline-b py-4 flex items-start gap-4">
                    <Key size={16} strokeWidth={1.3} className="mt-1" style={{ color: "var(--sky)" }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-serif-display text-lg" style={{ color: "var(--ink)" }}>
                        {h.name}
                      </div>
                      <div className="label-ui mt-1">
                        {h.provider} · {h.model_id} · nøkkel {h.api_key_preview}
                      </div>
                      {h.persona_addon && (
                        <div className="font-editor text-sm mt-2 line-clamp-2" style={{ color: "var(--ink-soft)" }}>
                          {h.persona_addon.slice(0, 160)}…
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeHelper(h.id)}
                      aria-label="Fjern"
                      className="p-2"
                      style={{ color: "var(--ink-mute)" }}
                    >
                      <X size={16} strokeWidth={1.4} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, b }) {
  return (
    <div className={`p-6 md:p-8 ${b ? "md:border-l" : ""}`} style={{ borderColor: "var(--line)" }}>
      <div className="label-ui">{label}</div>
      <div className="font-serif-display text-4xl mt-2" style={{ color: "var(--ink)" }}>{value ?? "—"}</div>
    </div>
  );
}
