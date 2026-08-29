import { Link, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { TID } from "@/lib/testIds";
import { LogOut } from "lucide-react";
import InfoMenu from "@/components/InfoMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";

const TOOLS = [
  { to: "/dashboard", tid: "toolnav-dashboard", key: "info.yourPage" },
  { to: "/prover", tid: "toolnav-prover", key: "info.samples" },
  { to: "/stemme", tid: "toolnav-stemme", key: "info.voice" },
  { to: "/skriv", tid: "toolnav-skriv", key: "info.write" },
  { to: "/manuskript", tid: "toolnav-manuskript", key: "info.manuscript" },
  { to: "/karakterer", tid: "toolnav-karakterer", key: "info.characters" },
  { to: "/tips", tid: "toolnav-tips", key: "info.tips" },
];

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const location = useLocation();

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

        {/* Verktøylinje — alltid synlig, direkte lenke til hvert verktøy fra hver side i skrivepulten */}
        <div className="hairline-t overflow-x-auto">
          <div className="max-w-[1400px] mx-auto px-4 md:px-10 flex items-center gap-1 md:gap-2">
            {TOOLS.map((tool) => {
              const active = location.pathname === tool.to;
              return (
                <Link
                  key={tool.to}
                  to={tool.to}
                  data-testid={tool.tid}
                  className="label-ui px-2.5 md:px-3 py-2.5 whitespace-nowrap shrink-0"
                  style={{
                    color: active ? "var(--moss)" : "var(--ink-mute)",
                    borderBottom: active ? "2px solid var(--moss)" : "2px solid transparent",
                  }}
                >
                  {t(tool.key)}
                </Link>
              );
            })}
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
