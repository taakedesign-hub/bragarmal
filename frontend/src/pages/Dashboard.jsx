import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ArrowRight, BookOpen, PenLine, WandSparkles } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [samples, setSamples] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [s, p] = await Promise.all([
          api.get("/samples"),
          api.get("/voice/profile"),
        ]);
        setSamples(s.data || []);
        setProfile(p.data || null);
      } catch {}
    })();
  }, []);

  const totalWords = samples.reduce((a, s) => a + (s.word_count || 0), 0);

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-16">
      <div className="fade-in">
        <div className="label-ui">Din arbeidsbenk</div>
        <h1 className="font-serif-display text-5xl md:text-6xl font-light mt-3" style={{ color: "var(--ink)" }}>
          Velkommen, <em className="italic" style={{ color: "var(--moss)" }}>{user?.name?.split(" ")[0] || "forfatter"}</em>.
        </h1>
        <p className="font-editor text-lg mt-4 max-w-[60ch]" style={{ color: "var(--ink-soft)" }}>
          {samples.length === 0
            ? "Start med å legge til noen tekstprøver. Det er slik jeg lærer stemmen din."
            : "Bygg videre på biblioteket ditt, oppdater stemmeprofilen, eller åpne skrivepulten."}
        </p>
      </div>

      {/* Stats — no cards, just a divider grid */}
      <div className="hairline-t hairline-b mt-12 grid grid-cols-2 md:grid-cols-4">
        <StatCell label="Prøver" value={samples.length} />
        <StatCell label="Totalt ord" value={totalWords.toLocaleString("nb-NO")} bordered />
        <StatCell label="Setningslengde" value={profile?.avg_sentence_length ?? "—"} bordered />
        <StatCell label="Stemme-oppdatert" value={profile?.updated_at ? formatDate(profile.updated_at) : "—"} bordered />
      </div>

      {/* Actions */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        <ActionTile
          n="01"
          icon={<BookOpen size={20} strokeWidth={1.4} />}
          title="Legg til prøver"
          body="Lim inn eller last opp .txt, .pdf, .docx"
          to="/prover"
          delay="stagger-1"
        />
        <ActionTile
          n="02"
          icon={<WandSparkles size={20} strokeWidth={1.4} />}
          title="Analyser stemmen"
          body="Se rytme, tone og signaturord"
          to="/stemme"
          delay="stagger-2"
        />
        <ActionTile
          n="03"
          icon={<PenLine size={20} strokeWidth={1.4} />}
          title="Skriv"
          body="Bryt sperren i din egen stemme"
          to="/skriv"
          delay="stagger-3"
        />
      </div>
    </div>
  );
}

function StatCell({ label, value, bordered }) {
  return (
    <div className={`p-6 md:p-8 ${bordered ? "md:border-l" : ""}`} style={{ borderColor: "var(--line)" }}>
      <div className="label-ui">{label}</div>
      <div className="font-serif-display text-4xl mt-2" style={{ color: "var(--ink)" }}>
        {value}
      </div>
    </div>
  );
}

function ActionTile({ n, icon, title, body, to, delay }) {
  return (
    <Link to={to} className={`paper p-8 group fade-in ${delay}`} style={{ borderColor: "var(--line)" }}>
      <div className="flex items-start justify-between">
        <div className="label-ui">{n}</div>
        <div style={{ color: "var(--moss)" }}>{icon}</div>
      </div>
      <h3 className="font-serif-display text-3xl mt-6" style={{ color: "var(--ink)" }}>
        {title}
      </h3>
      <p className="font-editor mt-3" style={{ color: "var(--ink-soft)" }}>{body}</p>
      <div className="mt-6 inline-flex items-center gap-2 label-ui" style={{ color: "var(--moss)" }}>
        Åpne <ArrowRight size={14} strokeWidth={1.6} />
      </div>
    </Link>
  );
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("nb-NO", { day: "2-digit", month: "short" });
  } catch { return "—"; }
}
