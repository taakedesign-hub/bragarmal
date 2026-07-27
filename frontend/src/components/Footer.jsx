import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="hairline-t">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 flex items-center justify-between flex-wrap gap-4">
        <span className="label-ui">ECHO <span className="marker-ornament" /> 2026</span>
        <div className="flex items-center gap-6">
          <Link to="/manifest" className="label-ui" style={{ color: "var(--ink-mute)" }}>Manifest</Link>
          <Link to="/etikk" className="label-ui" style={{ color: "var(--ink-mute)" }}>Etikk</Link>
          <Link to="/priser" className="label-ui" style={{ color: "var(--ink-mute)" }}>Priser</Link>
          <span className="label-ui">et verktøy for forfattere</span>
        </div>
      </div>
    </footer>
  );
}
