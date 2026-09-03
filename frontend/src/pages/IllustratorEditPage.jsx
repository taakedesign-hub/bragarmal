import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Logo from "@/components/Logo";
import InfoMenu from "@/components/InfoMenu";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { api, API } from "@/lib/api";
import { toast } from "sonner";
import { Palette, CheckCircle2, ImagePlus, Upload, Loader2, Save } from "lucide-react";

export default function IllustratorEditPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", portfolio_url: "", style: "", services: "" });
  const [publicId, setPublicId] = useState(null);
  const [hasImage, setHasImage] = useState(false);
  const [imgVersion, setImgVersion] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/illustrators/edit/${token}`);
        setForm({
          name: data.name || "",
          email: data.email || "",
          portfolio_url: data.portfolio_url || "",
          style: data.style || "",
          services: data.services || "",
        });
        setHasImage(!!data.has_image);
        setPublicId(data.id || null);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await api.patch(`/illustrators/edit/${token}`, form);
      toast("Lagret");
    } catch (err) {
      toast(err?.response?.data?.detail || "Kunne ikke lagre — prøv igjen");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async () => {
    if (!imageFile || imageUploading) return;
    setImageUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", imageFile);
      await api.post(`/illustrators/edit/${token}/image`, fd);
      setHasImage(true);
      setImgVersion((v) => v + 1);
      setImageFile(null);
      toast("Bilde lastet opp");
    } catch (err) {
      toast(err?.response?.data?.detail || "Kunne ikke laste opp bildet — prøv igjen");
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Seo title="Rediger oppføring — Bragarmål" description="Rediger din illustratør-oppføring." path="/illustratorer/rediger" />

      <div className="hairline-b">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo size={56} />
          </Link>
          <InfoMenu align="right" />
        </div>
      </div>

      <section className="max-w-[700px] mx-auto px-6 md:px-10 py-14 md:py-20">
        <div className="label-ui inline-flex items-center gap-2">
          <Palette size={14} strokeWidth={1.5} />
          Illustratører
        </div>
        <h1 className="font-serif-display text-4xl md:text-5xl font-light mt-3 leading-[1.05]" style={{ color: "var(--ink)" }}>
          Rediger oppføringen din.
        </h1>

        {loading ? (
          <div className="mt-10 flex items-center gap-2 font-editor" style={{ color: "var(--ink-mute)" }}>
            <Loader2 size={16} className="animate-spin" /> Laster…
          </div>
        ) : notFound ? (
          <div className="mt-10 p-6 font-editor" style={{ background: "#fdfcf9", border: "1px solid var(--line)", color: "var(--ink-soft)" }}>
            Fant ikke oppføringen. Sjekk at du limte inn hele lenken du fikk da du meldte deg på.
          </div>
        ) : (
          <>
            <div className="mt-8 p-4" style={{ border: "1px solid var(--line)", background: "white" }}>
              <div className="flex items-center gap-2">
                <ImagePlus size={14} strokeWidth={1.5} style={{ color: "var(--rust)" }} />
                <span className="label-ui" style={{ color: "var(--rust)" }}>Bilde av arbeidet ditt</span>
              </div>
              {hasImage && publicId && (
                <img
                  src={`${API}/illustrators/${publicId}/image?v=${imgVersion}`}
                  alt=""
                  className="mt-3 w-28 h-28 object-cover"
                  style={{ border: "1px solid var(--line)" }}
                />
              )}
              <p className="mt-2 font-editor text-sm" style={{ color: "var(--ink)" }}>
                {hasImage ? "Last opp et nytt bilde for å bytte det ut." : "Ingen bilde lagt til ennå."}
              </p>
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <label className="btn-ghost inline-flex items-center gap-2 cursor-pointer" style={{ borderColor: "var(--line)" }}>
                  {imageFile ? imageFile.name : "Velg bilde"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </label>
                <button
                  onClick={uploadImage}
                  disabled={!imageFile || imageUploading}
                  className="btn-primary inline-flex items-center gap-2 disabled:opacity-60"
                >
                  <Upload size={14} strokeWidth={1.6} />
                  {imageUploading ? "Laster opp…" : "Last opp"}
                </button>
              </div>
            </div>

            <form onSubmit={save} className="mt-8 space-y-6">
              <Field label="Navn" htmlFor="edit-name">
                <input id="edit-name" className="ill-input" value={form.name} onChange={update("name")} />
              </Field>
              <Field label="E-post" htmlFor="edit-email" hint="Vises ikke offentlig.">
                <input id="edit-email" type="email" className="ill-input" value={form.email} onChange={update("email")} />
              </Field>
              <Field label="Portfolio-lenke" htmlFor="edit-portfolio">
                <input id="edit-portfolio" type="url" className="ill-input" value={form.portfolio_url} onChange={update("portfolio_url")} />
              </Field>
              <Field label="Kort om stil" htmlFor="edit-style">
                <textarea id="edit-style" rows={3} className="ill-input resize-none" value={form.style} onChange={update("style")} maxLength={600} />
              </Field>
              <Field label="Type arbeid du tilbyr" htmlFor="edit-services">
                <textarea id="edit-services" rows={2} className="ill-input resize-none" value={form.services} onChange={update("services")} maxLength={600} />
              </Field>
              <button type="submit" disabled={saving} className="btn-primary inline-flex items-center gap-2 disabled:opacity-60">
                {saving ? "Lagrer…" : (<><Save size={14} strokeWidth={1.6} /> Lagre endringer</>)}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-2 font-editor text-sm" style={{ color: "var(--ink-mute)" }}>
              <CheckCircle2 size={14} strokeWidth={1.5} /> Endringene vises umiddelbart i den åpne katalogen.
            </div>
          </>
        )}
      </section>

      <Footer />

      <style>{`
        .ill-input {
          width: 100%;
          background: #fdfcf9;
          border: 1px solid var(--line);
          padding: 12px 14px;
          font-family: var(--font-editor, "Newsreader", serif);
          font-size: 16px;
          color: var(--ink);
          transition: border-color 150ms, background 150ms;
          border-radius: 0;
          outline: none;
        }
        .ill-input:focus {
          border-color: var(--rust);
          background: #ffffff;
        }
      `}</style>
    </div>
  );
}

function Field({ label, htmlFor, hint, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label-ui" style={{ color: "var(--ink)" }}>{label}</label>
      <div className="mt-2">{children}</div>
      {hint && (
        <div className="mt-1.5 font-editor text-xs italic" style={{ color: "var(--ink-mute)" }}>{hint}</div>
      )}
    </div>
  );
}
