import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";
import { AuthProvider, useAuth } from "@/lib/auth";
import Landing from "@/pages/Landing";
import ManifestPage from "@/pages/ManifestPage";
import EthicsPage from "@/pages/EthicsPage";
import AuthCallback from "@/pages/AuthCallback";
import Dashboard from "@/pages/Dashboard";
import SamplesPage from "@/pages/SamplesPage";
import VoicePage from "@/pages/VoicePage";
import WritePage from "@/pages/WritePage";
import AppShell from "@/components/AppShell";

function AppRouter() {
  const location = useLocation();
  // Synchronous check — must run before other routing decisions
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/manifest" element={<ManifestPage />} />
      <Route path="/etikk" element={<EthicsPage />} />
      <Route path="/dashboard" element={<Protected><AppShell><Dashboard /></AppShell></Protected>} />
      <Route path="/prover" element={<Protected><AppShell><SamplesPage /></AppShell></Protected>} />
      <Route path="/stemme" element={<Protected><AppShell><VoicePage /></AppShell></Protected>} />
      <Route path="/skriv" element={<Protected><AppShell><WritePage /></AppShell></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="label-ui">Laster…</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <Toaster position="bottom-center" richColors={false} />
      </AuthProvider>
    </BrowserRouter>
  );
}
