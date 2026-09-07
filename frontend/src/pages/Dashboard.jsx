import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, BookOpen, PenLine, WandSparkles, FileText, ScanLine, Camera, Mic, ScrollText, UserRound, Search, Lightbulb } from "lucide-react";

export default function Dashboard() {
  const { t } = useI18n();
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
          {t("dashboard.welcome")} <em className="italic" style={{ color: "var(--moss)" }}>{t("dashboard.writingDesk")}</em>.
        </h1>
        <p className="font-editor text-lg mt-4 max-w-[60ch]" style={{ color: "var(--ink-soft)" }}>
          {samples.length === 0
            ? "Start med å legge til noen tekstprøver. Det er slik jeg lærer stemmen din."
            : "Bygg videre på biblioteket ditt, oppdater stemmeprofilen, eller åpne skrivepulten."}
        </p>
        <div
          className="mt-6 max-w-[60ch] px-4 py-3 font-editor text-sm"
          style={{ background: "#fafafa", border: "1px solid #e5e5e5", color: "var(--ink)" }}
        >
          Dine data — prøver, stemmeprofil, filer — er dine. Du kan slette dem når du selv
          ønsker det. Ved pause i abonnementet stopper arbeidet ditt, men fortsetter sømløst
          når du fornyer.
        </div>
      </div>

      {/* Stats — no cards, just a divider grid */}
      <div className="hairline-t hairline-b mt-12 grid grid-cols-2 md:grid-cols-4">
        <StatCell label="Prøver" value={samples.length} />
        <StatCell label="Totalt ord" value={totalWords.toLocaleString("nb-NO")} bordered />
        <StatCell label="Setningslengde" value={profile?.avg_sentence_length ?? "—"} bordered />
        <StatCell label="Stemme-oppdatert" value={profile?.updated_at ? formatDate(profile.updated_at) : "—"} bordered />
      </div>

      {/* Actions */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
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
        <ActionTile
          n="04"
          icon={<ScrollText size={20} strokeWidth={1.4} />}
          title="Manuskript"
          body="Sett scenene i rekkefølge, følg ordmålet"
          to="/manuskript"
          delay="stagger-4"
        />
        <ActionTile
          n="05"
          icon={<UserRound size={20} strokeWidth={1.4} />}
          title="Karakterer"
          body="Hold styr på personene i historien"
          to="/karakterer"
          delay="stagger-1"
        />
        <ActionTile
          n="06"
          icon={<Search size={20} strokeWidth={1.4} />}
          title="Undersøkelser"
          body="Research ved hånden — personer, steder, kilder"
          to="/undersokelser"
          delay="stagger-2"
        />
        <ActionTile
          n="07"
          icon={<Lightbulb size={20} strokeWidth={1.4} />}
          title="Tips"
          body="Gode råd for å komme videre"
          to="/tips"
          delay="stagger-3"
        />
      </div>

      {/* Tools — fire måter å mate inn */}
      <div className="mt-16 md:mt-20">
        <h2 className="font-serif-display text-3xl md:text-4xl font-light" style={{ color: "var(--ink)" }}>
          Alt du har, i din stemme.
        </h2>
        <p className="font-editor text-base md:text-lg mt-3 max-w-[62ch]" style={{ color: "var(--ink-soft)" }}>
          Jo mer materiale du mater inn, jo mer nøyaktig blir
          {" "}<em className="italic" style={{ color: "var(--moss)" }}>«din stemme»-lakmusen</em>.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <ToolBox icon={<FileText size={22} strokeWidth={1.4} />} title="Lim inn" body="Kladder, meldinger, avsnitt du har liggende — bare kopier og lim." to="/prover" />
          <ToolBox icon={<ScanLine size={22} strokeWidth={1.4} />} title="Last opp fil" body=".txt, .md, .pdf, .docx. Nedskrevet materiale du har fra før." to="/prover" />
          <ToolBox icon={<Camera size={22} strokeWidth={1.4} />} title="Foto av håndskrift" body="Fotografer gamle notatbøker og brev. Håndskriften blir tekst." to="/prover" />
          <ToolBox icon={<Mic size={22} strokeWidth={1.4} />} title="Høytlesning" body="Les direkte inn, eller last opp opptak. Muntlig fortellerstemme bevart." to="/prover" />
        </div>
      </div>
    </div>
  );
}

function ToolBox({ icon, title, body, to }) {
  return (
    <Link
      to={to}
      className="p-6 md:p-7 group transition-all hover:bg-neutral-50 flex flex-col"
      style={{ border: "1px solid var(--line)" }}
    >
      <div className="flex items-start justify-end">
        <div style={{ color: "var(--moss)" }}>{icon}</div>
      </div>
      <h3 className="font-serif-display text-xl md:text-2xl mt-6 leading-snug" style={{ color: "var(--ink)" }}>
        {title}
      </h3>
      <p className="font-editor text-sm md:text-base mt-3 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
        {body}
      </p>
      <div className="mt-6 inline-flex items-center gap-2 label-ui" style={{ color: "var(--moss)" }}>
        Åpne <ArrowRight size={14} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
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
