import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { TID } from "@/lib/testIds";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Sparkles, RefreshCcw } from "lucide-react";

export default function VoicePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [samplesCount, setSamplesCount] = useState(0);

  const load = async () => {
    try {
      const [p, s] = await Promise.all([
        api.get("/voice/profile"),
        api.get("/samples"),
      ]);
      setProfile(p.data || null);
      setSamplesCount((s.data || []).length);
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
