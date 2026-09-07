/**
 * Canonical production domain, punycode-encoded.
 * "bragarmål.no" contains a non-ASCII character — browsers auto-convert it
 * in the address bar, but raw <meta>/canonical/JSON-LD tags and mailto:
 * links must use the ASCII (punycode) form or crawlers and some mail
 * clients fail to resolve them. The backend already does this for Stripe
 * checkout URLs (see backend/server.py); this mirrors it for the frontend.
 */
export const SITE_HOST = "xn--bragarml-g0a.no";
export const SITE_URL = `https://${SITE_HOST}`;
export const CONTACT_EMAIL_ASCII = `hei@${SITE_HOST}`;
export const CONTACT_EMAIL_DISPLAY = "hei@bragarmål.no";

export function contactMailto(subject) {
  return `mailto:${CONTACT_EMAIL_ASCII}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
}
