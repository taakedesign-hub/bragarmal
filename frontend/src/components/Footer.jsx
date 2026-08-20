import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { TID } from "@/lib/testIds";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="hairline-t">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" aria-label={t("nav.home")} className="inline-flex" data-testid="footer-logo-link">
            <Logo size={22} />
          </Link>
          <span className="label-ui" style={{ color: "var(--ink-mute)" }}>2026</span>
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          <Link to="/manifest" className="label-ui" style={{ color: "var(--ink-mute)" }}>{t("info.manifest")}</Link>
          <Link to="/etikk" className="label-ui" style={{ color: "var(--ink-mute)" }}>{t("info.ethics")}</Link>
          <Link to="/priser" className="label-ui" style={{ color: "var(--ink-mute)" }}>{t("info.pricing")}</Link>
          <a
            data-testid={TID.footerContactLink}
            href="mailto:hei@Bragarmål.no?subject=Hilsen%20fra%20BRAGARMÅL"
            className="label-ui"
            style={{ color: "var(--ink-mute)" }}
          >
            {t("footer.contact")}
          </a>
          <span className="label-ui">{t("footer.tagline")}</span>
        </div>
      </div>
    </footer>
  );
}
