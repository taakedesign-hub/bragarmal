import { Helmet } from "react-helmet-async";

/**
 * Per-page SEO overrides.
 * Base tags live in /public/index.html — this component only overrides title/description/og
 * for pages that need distinct metadata.
 */
export default function Seo({ title, description, path = "/", image }) {
  const fullUrl = `https://bragrapp.no${path}`;
  const ogImage = image || "https://bragrapp.no/og-image.png";
  const fullTitle = title ? `${title} — Bragarmål` : "Bragarmål — vi finner din stemme";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={fullUrl} />

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
