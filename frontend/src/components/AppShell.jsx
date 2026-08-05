import { Link, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/auth";
import { TID } from "@/lib/testIds";
import { Feather, LogOut } from "lucide-react";
import InfoMenu from "@/components/InfoMenu";
import Footer from "@/components/Footer";

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const loc = useLocation();

  const NavLink = ({ to, label, tid }) => {
    const active = loc.pathname === to;
    return (
      <Link
        to={to}
        data-testid={tid}
        className="label-ui px-3 py-2"
        style={{
          color: active ? "var(--ink)" : "var(--ink-mute)",
          borderBottom: active ? "1px solid var(--ink)" : "1px solid transparent",
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="hairline-b sticky top-0 z-30" style={{ background: "var(--bg)" }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between gap-4">
          <Link to="/" aria-label="Bragarmål — gå til forsiden" data-testid="header-logo-link" className="flex items-center transition-opacity hover:opacity-80 cursor-pointer">
            <Logo size={56} />
          </Link>
          <nav className="flex items-center gap-1 md:gap-2">
            <NavLink to="/dashboard" label="Hjem" tid={TID.navHome} />
            <NavLink to="/prover" label="Prøver" tid={TID.navSamples} />
            <NavLink to="/stemme" label="Stemme" tid={TID.navVoice} />
            <NavLink to="/skriv" label="Skriv" tid={TID.navWrite} />
            <NavLink to="/manuskript" label="Manuskript" tid="nav-manuscript" />
            <NavLink to="/karakterer" label="Karakterer" tid="nav-characters" />
            <NavLink to="/tips" label="Tips" tid="nav-tips" />
            <InfoMenu align="right" />
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/priser" className="label-ui hidden sm:inline" style={{ color: "var(--ink-mute)" }}>Priser</Link>
            {user?.picture && (
              <img
                src={user.picture}
                alt=""
                className="w-7 h-7 rounded-full"
                style={{ border: "1px solid var(--line)" }}
              />
            )}
            <span className="hidden md:inline label-ui">{user?.name}</span>
            <button
              data-testid={TID.navLogout}
              onClick={logout}
              className="label-ui inline-flex items-center gap-1.5"
              style={{ color: "var(--ink-mute)" }}
              title="Logg ut"
            >
              <LogOut size={14} strokeWidth={1.5} />
              Logg ut
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
