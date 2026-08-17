import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { TID } from "@/lib/testIds";
import { LogOut } from "lucide-react";
import InfoMenu from "@/components/InfoMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const { t } = useI18n();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="hairline-b sticky top-0 z-30" style={{ background: "var(--bg)" }}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-3 md:py-4 flex items-center justify-between gap-3">
          {/* Logo — alltid synlig, alltid link til forsiden */}
          <Link
            to="/"
            aria-label={t("nav.home")}
            data-testid="header-logo-link"
            className="flex items-center shrink-0 transition-opacity hover:opacity-80 cursor-pointer"
          >
            <Logo size={56} />
          </Link>

          {/* Kompakt nav */}
          <nav className="flex items-center gap-0.5 md:gap-2 shrink min-w-0">
            <InfoMenu align="right" />
            <Link to="/dashboard" data-testid="nav-skrivepult" className="label-ui px-1.5 md:px-3 py-2 whitespace-nowrap" style={{ color: "var(--ink-mute)" }}>
              {t("nav.tools")}
            </Link>
            <Link to="/dashboard" data-testid="nav-forfattere" className="label-ui px-1.5 md:px-3 py-2 whitespace-nowrap" style={{ color: "var(--ink-mute)" }}>
              {t("nav.author")}
            </Link>
            <Link to="/illustratorer" data-testid="nav-illustrators" className="label-ui px-1.5 md:px-3 py-2 whitespace-nowrap" style={{ color: "var(--ink-mute)" }}>
              {t("nav.illustrator")}
            </Link>
          </nav>

          {/* Språk + bruker + logg ut */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <LanguageSwitcher />
            {user?.picture && (
              <img
                src={user.picture}
                alt=""
                className="hidden md:inline-block w-7 h-7 rounded-full"
                style={{ border: "1px solid var(--line)" }}
              />
            )}
            <button
              data-testid={TID.navLogout}
              onClick={logout}
              className="label-ui inline-flex items-center gap-1.5"
              style={{ color: "var(--ink-mute)" }}
              title={t("nav.logout")}
              aria-label={t("nav.logout")}
            >
              <LogOut size={14} strokeWidth={1.5} />
              <span className="hidden sm:inline">{t("nav.logout")}</span>
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
