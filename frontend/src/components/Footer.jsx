import { Link } from "react-router-dom";
import { TID } from "@/lib/testIds";

export default function Footer() {
  return (
    <footer className="hairline-t">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 flex items-center justify-between flex-wrap gap-4">
        <span className="label-ui">BRAGARMÅL <span className="marker-ornament" /> 2026</span>
        <div className="flex items-center gap-6 flex-wrap">
          <Link to="/manifest" className="label-ui" style={{ color: "var(--ink-mute)" }}>Manifest</Link>
          <Link to="/etikk" className="label-ui" style={{ color: "var(--ink-mute)" }}>Etikk</Link>
          <Link to="/priser" className="label-ui" style={{ color: "var(--ink-mute)" }}>Priser</Link>
          <a
            data-testid={TID.footerContactLink}
            href="mailto:hei@bragrapp.no?subject=Hilsen%20fra%20BRAGARMÅL"
            className="label-ui"
            style={{ color: "var(--ink-mute)" }}
          >
            Kontakt
          </a>
          <span className="label-ui">et verktøy for kreativ skriving</span>
        </div>
      </div>
    </footer>
  );
}
