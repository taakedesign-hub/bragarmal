import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/auth";
import { TID } from "@/lib/testIds";
import { LogOut } from "lucide-react";
import InfoMenu from "@/components/InfoMenu";
import Footer from "@/components/Footer";

export default function AppShell({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="hairline-b sticky top-0 z-30" style={{ background: "var(--bg)" }}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-3 md:py-4 flex items-center justify-between gap-3">
          {/* Logo — alltid synlig, alltid link til forsiden */}
          <Link
            to="/"
            aria-label="Bragarmål — gå til forsiden"
            data-testid="header-logo-link"
            className="flex items-center shrink-0 transition-opacity hover:opacity-80 cursor-pointer"
          >
            <Logo size={56} />
          </Link>

          {/* Kompakt nav — bare 4 elementer, får plass på mobil */}
          <nav className="flex items-center gap-0.5 md:gap-2 shrink min-w-0">
            <InfoMenu align="right" />
            <Link to="/dashboard" data-testid="nav-skrivepult" className="label-ui px-1.5 md:px-3 py-2 whitespace-nowrap" style={{ color: "var(--ink-mute)" }}>
              Skrivepult
            </Link>
            <Link to="/dashboard" data-testid="nav-forfattere" className="label-ui px-1.5 md:px-3 py-2 whitespace-nowrap" style={{ color: "var(--ink-mute)" }}>
              Forfatter
            </Link>
            <Link to="/illustratorer" data-testid="nav-illustrators" className="label-ui px-1.5 md:px-3 py-2 whitespace-nowrap" style={{ color: "var(--ink-mute)" }}>
              Illustratør
            </Link>
          </nav>

          {/* Bruker + logg ut */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
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
              title="Logg ut"
              aria-label="Logg ut"
            >
              <LogOut size={14} strokeWidth={1.5} />
              <span className="hidden sm:inline">Logg ut</span>
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
