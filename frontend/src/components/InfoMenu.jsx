import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export default function InfoMenu({ align = "right" }) {
  const { user } = useAuth();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const groups = [
    {
      heading: t("info.aboutApp"),
      items: [
        { to: "/manifest",  label: t("info.manifest"),  desc: t("info.manifestDesc") },
        { to: "/eksempler", label: t("info.examples"),  desc: t("info.examplesDesc") },
        { to: "/etikk",     label: t("info.ethics"),    desc: t("info.ethicsDesc") },
        { to: "/priser",    label: t("info.pricing"),   desc: t("info.pricingDesc") },
      ],
    },
    user ? {
      heading: t("info.yourTools"),
      items: [
        { to: "/dashboard",  label: t("info.yourPage"),    desc: t("info.yourPageDesc") },
        { to: "/prover",     label: t("info.samples"),     desc: t("info.samplesDesc") },
        { to: "/stemme",     label: t("info.voice"),       desc: t("info.voiceDesc") },
        { to: "/skriv",      label: t("info.write"),       desc: t("info.writeDesc") },
        { to: "/manuskript", label: t("info.manuscript"),  desc: t("info.manuscriptDesc") },
        { to: "/karakterer", label: t("info.characters"),  desc: t("info.charactersDesc") },
        { to: "/tips",       label: t("info.tips"),        desc: t("info.tipsDesc") },
      ],
    } : null,
    {
      heading: t("info.contact"),
      items: [
        { href: "mailto:hei@bragarmål.no?subject=Hilsen%20fra%20BRAGARMÅL", label: t("info.sendEmail"), desc: "hei@bragarmål.no" },
      ],
    },
  ].filter(Boolean);

  return (
    <div className="relative" ref={ref}>
      <button
        data-testid="info-menu-btn"
        onClick={() => setOpen((v) => !v)}
        className="label-ui inline-flex items-center gap-1.5 px-3 py-2"
        style={{ color: open ? "var(--ink)" : "var(--ink-mute)" }}
      >
        {t("nav.information")}
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
          {groups.map((group, gi) => (
            <div key={group.heading} className={gi > 0 ? "hairline-t" : ""}>
              <div className="px-4 pt-4 pb-2 label-ui" style={{ color: "var(--rust)" }}>
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
                    <a key={it.href} href={it.href} onClick={() => setOpen(false)} className={cls} style={{ color: "var(--ink)" }}>
                      {content}
                    </a>
                  );
                }
                return (
                  <Link key={it.to} to={it.to} onClick={() => setOpen(false)} className={cls} style={{ color: "var(--ink)" }}>
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
