import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth";

const GROUPS = [
  {
    heading: "Om appen",
    items: [
      { to: "/manifest",   label: "Manifest",  desc: "Original + AI-redigert side om side" },
      { to: "/eksempler",  label: "Eksempler", desc: "Når hjelper Bragarmål deg — seks scenarier" },
      { to: "/etikk",      label: "Etikk",     desc: "Etisk AI-skriving. Regler, arbeidsflyt, selvsjekk" },
      { to: "/priser",     label: "Priser",    desc: "Månedlig, 3, 6, 12 mnd — alt i NOK" },
    ],
  },
  {
    heading: "Dine verktøy",
    requiresAuth: true,
    items: [
      { to: "/dashboard",  label: "Din side",     desc: "Alle verktøy og hjelpemidler samlet" },
      { to: "/prover",     label: "Prøver",       desc: "Lim inn, last opp fil, foto, høytlesning" },
      { to: "/stemme",     label: "Stemmeprofil", desc: "Analyser rytme, tone og signaturord" },
      { to: "/skriv",      label: "Skriv",        desc: "Skrivepulten — sparr med Bragarmål i din stemme" },
      { to: "/manuskript", label: "Manuskript",   desc: "Oversikt over scener, POV, status og ordantall" },
      { to: "/karakterer", label: "Karakterer",   desc: "Psykologiske profiler — bygg selv eller hent fra manuskript" },
      { to: "/tips",       label: "Tips",         desc: "Praktiske råd for forfattere" },
    ],
  },
  {
    heading: "Kontakt",
    items: [
      { href: "mailto:hei@bragarmål.no?subject=Hilsen%20fra%20BRAGARMÅL", label: "Send e-post", desc: "hei@bragarmål.no" },
    ],
  },
];

export default function InfoMenu({ align = "right" }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const visibleGroups = GROUPS.filter(g => !g.requiresAuth || !!user);

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
          className="paper absolute mt-2 z-40 w-[90vw] sm:w-80"
          style={{
            [align]: 0,
            background: "var(--surface)",
            boxShadow: "0 12px 40px var(--paper-shadow)",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
          data-testid="info-menu-panel"
        >
          {visibleGroups.map((group, gi) => (
            <div key={group.heading} className={gi > 0 ? "hairline-t" : ""}>
              <div
                className="px-4 pt-4 pb-2 label-ui"
                style={{ color: "var(--rust)" }}
              >
                {group.heading}
              </div>
              {group.items.map((it, i) => {
                const isLast = i === group.items.length - 1;
                const cls = `block px-4 py-3 ${!isLast ? "hairline-b" : ""}`;
                const content = (
                  <>
                    <div className="font-serif-display text-lg leading-tight">{it.label}</div>
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
          ))}
        </div>
      )}
    </div>
  );
}
