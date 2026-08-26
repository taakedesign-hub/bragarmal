import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { TID } from "@/lib/testIds";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Sparkles, RefreshCcw, Plus, X, User, AlertTriangle, Eye } from "lucide-react";

export default function VoicePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [samplesCount, setSamplesCount] = useState(0);
  const [inspirations, setInspirations] = useState([]);
  const [inspName, setInspName] = useState("");
  const [inspNote, setInspNote] = useState("");
  const [addingInsp, setAddingInsp] = useState(false);

  const load = async () => {
    try {
      const [p, s, i] = await Promise.all([
        api.get("/voice/profile"),
        api.get("/samples"),
        api.get("/inspirations"),
      ]);
      setProfile(p.data || null);
      setSamplesCount((s.data || []).length);
      setInspirations(i.data || []);
    } catch (e) { console.debug("voice load failed", e); }
  };
  useEffect(() => { load(); }, []);

  const run = async () => {
    setLoading(true);
    try {
      try {
        const s = await api.get("/samples");
        setSamplesCount((s.data || []).length);
      } catch (e) { console.debug("samples refresh failed", e); }
      const r = await api.post("/voice/analyze");
      setProfile(r.data);
      if (r.data?.total_samples != null) setSamplesCount(r.data.total_samples);
      toast(`Stemmeprofil oppdatert · ${r.data?.total_samples ?? "?"} prøver`);
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

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12">
      {/* Hero */}
      <div className="fade-in">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div>
            <div className="label-ui">Stemmeprofil</div>
            <h1 className="font-serif-display text-5xl font-light mt-3" style={{ color: "var(--ink)" }}>
              Slik <em className="italic" style={{ color: "var(--moss)" }}>ser Bragarmål</em> stemmen din.
            </h1>
          </div>
        </div>
        <p className="font-editor mt-4 max-w-[62ch]" style={{ color: "var(--ink-soft)" }}>
          Ikke bare tall — også hva som gjør skriften din <em>din</em>. Kjør analysen på nytt hver gang du legger til nye prøver, så holder profilen tritt med hvordan du utvikler deg.
        </p>
      </div>

      {/* Action row */}
      <div className="mt-8 flex items-center gap-4 flex-wrap">
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
            ? "Legg til prøver først under «Prøver»."
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

          {/* Section 01 — Slik skriver jeg */}
          <Section
            n="01"
            icon={<User size={16} strokeWidth={1.4} />}
            kicker="Slik skriver jeg"
            title="Din stemme, slik den er nå"
            subtitle="Tonen, stilen og signaturuttrykkene som gjør skriften din gjenkjennelig."
            tid="voice-section-slik"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7">
                <div className="label-ui mb-3">Tone</div>
                <p className="font-editor text-xl leading-relaxed" style={{ color: "var(--ink)" }}>
                  {profile.tone_description || <span className="italic" style={{ color: "var(--ink-mute)" }}>—</span>}
                </p>
                <div className="rule my-8" />
                <div className="label-ui mb-3">Stil</div>
                <p className="font-editor text-lg leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  {profile.style_summary || <span className="italic" style={{ color: "var(--ink-mute)" }}>—</span>}
                </p>
                <div className="rule my-8" />
                <div className="label-ui mb-3">Signaturuttrykk</div>
                <div className="flex flex-wrap gap-2">
                  {(profile.signature_phrases || []).length === 0 ? (
                    <span className="font-editor italic" style={{ color: "var(--ink-mute)" }}>—</span>
                  ) : (
                    profile.signature_phrases.map((p, i) => (
                      <span key={p + i} className="chip">{p}</span>
                    ))
                  )}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="label-ui mb-3">Setningslengde-fordeling</div>
                <div style={{ width: "100%", height: 260 }}>
                  <ResponsiveContainer>
                    <BarChart data={profile.sentence_length_distribution || []} margin={{ top: 10, right: 0, left: 0, bottom: 10 }}>
                      <XAxis dataKey="range" tick={{ fill: "#7A7772", fontSize: 11, fontFamily: "IBM Plex Sans" }} axisLine={{ stroke: "#D9D4C7" }} tickLine={false} />
                      <YAxis tick={{ fill: "#7A7772", fontSize: 11, fontFamily: "IBM Plex Sans" }} axisLine={{ stroke: "#D9D4C7" }} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #D9D4C7", borderRadius: 2, fontFamily: "IBM Plex Sans", fontSize: 12 }} cursor={{ fill: "rgba(74,93,78,0.08)" }} />
                      <Bar dataKey="count" fill="#4A5D4E" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="label-ui mt-8 mb-3">Ord du bruker ofte</div>
                <ul>
                  {(profile.top_words || []).slice(0, 10).map((w, i) => (
                    <li key={w.word + i} className="flex items-center justify-between py-1.5 hairline-b">
                      <span className="font-editor" style={{ color: "var(--ink)" }}>{w.word}</span>
                      <span className="label-ui">{w.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* Section 02 — Dette avviker */}
          <Section
            n="02"
            icon={<Eye size={16} strokeWidth={1.4} />}
            kicker="Dette avviker"
            title="Der stemmen din glir bort fra seg selv"
            subtitle="Mønstre Bragarmål har lagt merke til — ikke feil, bare observasjoner. Du bestemmer om det er verdt å endre."
            tid="voice-section-avviker"
          >
            {(profile.deviations || []).length === 0 ? (
              <div className="font-editor italic" style={{ color: "var(--ink-mute)" }}>
                Ingen tydelige avvik ennå. Legg til flere prøver — særlig fra ulike sjangre og perioder — så blir mønstrene skarpere.
              </div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.deviations.map((d, i) => (
                  <li
                    key={d.slice(0, 30) + i}
                    className="p-5 md:p-6"
                    style={{ background: "var(--linen)", borderLeft: "2px solid var(--rust)" }}
                    data-testid={`voice-deviation-${i + 1}`}
                  >
                    <div className="font-mono-ui text-[10px] tracking-widest" style={{ color: "var(--rust)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <p className="mt-2 font-editor text-base md:text-lg leading-relaxed" style={{ color: "var(--ink)" }}>
                      {d}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {/* Section 03 — Dette bør jeg passe på */}
          <Section
            n="03"
            icon={<AlertTriangle size={16} strokeWidth={1.4} />}
            kicker="Dette bør jeg passe på"
            title="Vennlige merknader"
            subtitle="Konkrete ting å være oppmerksom på. Ikke pekefinger — bare påminnelser fra en som har lest deg tett."
            tid="voice-section-passe-paa"
          >
            {(profile.watch_out_for || []).length === 0 ? (
              <div className="font-editor italic" style={{ color: "var(--ink-mute)" }}>
                Ingen påminnelser ennå. Kjør analysen på nytt når du har lagt til flere prøver.
              </div>
            ) : (
              <ul className="space-y-3">
                {profile.watch_out_for.map((w, i) => (
                  <li
                    key={w.slice(0, 30) + i}
                    className="p-4 md:p-5 flex items-start gap-4"
                    style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
                    data-testid={`voice-watch-${i + 1}`}
                  >
                    <span
                      className="mt-1 shrink-0 inline-flex items-center justify-center font-mono-ui text-[10px] tracking-widest"
                      style={{ background: "var(--moss)", color: "white", width: 22, height: 22 }}
                    >
                      !
                    </span>
                    <p className="font-editor text-base md:text-lg leading-relaxed" style={{ color: "var(--ink)" }}>
                      {w}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 label-ui" style={{ color: "var(--ink-mute)" }}>
              Vil du sjekke en konkret tekst mot dette?{" "}
              <Link to="/skriv" data-testid="voice-goto-compare" className="underline underline-offset-4" style={{ color: "var(--moss)" }}>
                Bruk «Sammenlign med min stemme» i Skrivepulten →
              </Link>
            </div>
          </Section>
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

function Section({ n, icon, kicker, title, subtitle, children, tid }) {
  return (
    <section className="mt-16 md:mt-20" data-testid={tid}>
      <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
        <div className="col-span-12 md:col-span-3">
          <div className="flex items-center gap-2" style={{ color: "var(--moss)" }}>
            <span className="font-mono-ui text-xs tracking-widest" style={{ color: "var(--rust)" }}>{n}</span>
            {icon}
            <span className="label-ui">{kicker}</span>
          </div>
          <h2 className="font-serif-display text-2xl md:text-3xl font-light mt-3 leading-tight" style={{ color: "var(--ink)" }}>
            {title}
          </h2>
          <p className="font-editor text-sm mt-4" style={{ color: "var(--ink-soft)" }}>
            {subtitle}
          </p>
        </div>
        <div className="col-span-12 md:col-span-9 md:pl-4">
          {children}
        </div>
      </div>
    </section>
  );
}
