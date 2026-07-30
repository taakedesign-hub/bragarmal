import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const ITEMS = [
  { to: "/manifest", label: "Manifest", desc: "Original + AI-redigert side om side" },
  { to: "/eksempler", label: "Eksempler", desc: "Når hjelper Bragarmål deg — seks scenarier" },
  { to: "/etikk", label: "Etikk", desc: "Etisk AI-skriving. Regler, arbeidsflyt, selvsjekk" },
  { to: "/priser", label: "Priser", desc: "Beta, Grunnlegger, Ordinær — alt i NOK" },
  { to: "/prover", label: "Prøver", desc: "Lim inn, last opp fil, foto av håndskrift, høytlesning" },
  { to: "/stemme", label: "Stemmeprofil", desc: "Analyser rytme, tone og signaturord" },
  { to: "/skriv", label: "Skriv", desc: "Skrivepulten — sparr med Bragarmål i din stemme" },
  { to: "/manuskript", label: "Manuskript", desc: "Oversikt over scener, POV, status og ordantall" },
  { to: "/dashboard", label: "Din side", desc: "Alle verktøy og hjelpemidler samlet" },
  { href: "mailto:hei@bragarmål.no?subject=Hilsen%20fra%20BRAGARMÅL", label: "Kontakt", desc: "Send oss en e-post — hei@bragarmål.no" },
];

export default function InfoMenu({ align = "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        data-testid="info-menu-btn"
        onClick={() => setOpen((v) => !v)}
        className="label-ui inline-flex items-center gap-1.5 px-3 py-2"
        style={{ color: open ? "var(--ink)" : "var(--ink-mute)" }}
      >
        Informasjon
        <ChevronDown size={14} strokeWidth={1.5} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms" }} />
      </button>
      {open && (
        <div
          className="paper absolute mt-2 w-72 z-40"
          style={{
            [align]: 0,
            background: "var(--surface)",
            boxShadow: "0 12px 40px var(--paper-shadow)",
          }}
        >
          {ITEMS.map((it, i) => {
            const cls = `block p-4 ${i < ITEMS.length - 1 ? "hairline-b" : ""}`;
            const content = (
              <>
                <div className="font-serif-display text-lg">{it.label}</div>
                <div className="font-editor text-xs mt-1" style={{ color: "var(--ink-soft)" }}>{it.desc}</div>
              </>
            );
            if (it.href) {
              return (
                <a
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className={cls}
                  style={{ color: "var(--ink)" }}
                >
                  {content}
                </a>
              );
            }
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className={cls}
                style={{ color: "var(--ink)" }}
              >
                {content}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
