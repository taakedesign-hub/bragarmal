import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function PaymentStatusPage({ variant }) {
  const [params] = useSearchParams();
  const [status, setStatus] = useState(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (variant === "cancel") return;
    const sid = params.get("session_id");
    if (!sid) return;
    let mounted = true;
    const poll = async () => {
      try {
        const r = await api.get(`/billing/session/${sid}`);
        if (!mounted) return;
        setStatus(r.data);
        if (r.data.payment_status !== "paid" && attempts < 15) {
          setTimeout(() => setAttempts((a) => a + 1), 2000);
        }
      } catch {}
    };
    poll();
  }, [attempts, params, variant]);

  const paid = status?.payment_status === "paid";
  const isCancel = variant === "cancel";

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="hairline-b absolute top-0 left-0 right-0">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5">
          <Link to="/" className="flex items-center">
            <Logo size={56} />
          </Link>
        </div>
      </div>

      <div className="max-w-[560px] mx-auto px-6 text-center">
        {isCancel ? (
          <>
            <XCircle size={48} strokeWidth={1.2} className="mx-auto" style={{ color: "var(--rust)" }} />
            <h1 className="font-serif-display text-4xl mt-6" style={{ color: "var(--ink)" }}>Betaling avbrutt</h1>
            <p className="font-editor mt-4" style={{ color: "var(--ink-soft)" }}>
              Ingen bekymring. Du kan velge plan når du vil.
            </p>
            <Link to="/priser" className="btn-primary mt-8 inline-block">Se priser</Link>
          </>
        ) : paid ? (
          <>
            <CheckCircle2 size={48} strokeWidth={1.2} className="mx-auto" style={{ color: "var(--moss)" }} />
            <h1 className="font-serif-display text-4xl mt-6" style={{ color: "var(--ink)" }}>Velkommen inn.</h1>
            <p className="font-editor mt-4" style={{ color: "var(--ink-soft)" }}>
              Medlemskapet ditt er aktivt. All data og alle modeller er nå tilgjengelige.
            </p>
            <Link to="/dashboard" className="btn-primary mt-8 inline-block">Til arbeidsbenken</Link>
          </>
        ) : (
          <>
            <Loader2 size={48} strokeWidth={1.2} className="mx-auto animate-spin" style={{ color: "var(--ink-mute)" }} />
            <h1 className="font-serif-display text-4xl mt-6" style={{ color: "var(--ink)" }}>Bekrefter betaling…</h1>
            <p className="font-editor mt-4" style={{ color: "var(--ink-soft)" }}>
              Dette tar vanligvis noen sekunder. Ikke lukk fanen.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
