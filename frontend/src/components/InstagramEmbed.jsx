import { useEffect, useRef } from "react";

const SCRIPT_SRC = "https://www.instagram.com/embed.js";

function loadEmbedScript(onReady) {
  if (window.instgrm) {
    onReady();
    return;
  }
  const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
  if (existing) {
    existing.addEventListener("load", onReady, { once: true });
    return;
  }
  const script = document.createElement("script");
  script.src = SCRIPT_SRC;
  script.async = true;
  script.addEventListener("load", onReady, { once: true });
  document.body.appendChild(script);
}

/**
 * Renders a single Instagram post via Instagram's own oEmbed script —
 * static per permalink, no API keys or app review needed. Swap `permalink`
 * to a new post's link whenever there's something newer to show.
 */
export default function InstagramEmbed({ permalink }) {
  const containerRef = useRef(null);

  useEffect(() => {
    loadEmbedScript(() => {
      window.instgrm?.Embeds?.process();
    });
  }, [permalink]);

  return (
    <div ref={containerRef} className="flex justify-center">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
        style={{ background: "#FFF", border: 0, margin: 0, maxWidth: 540, width: "100%" }}
      >
        <a href={permalink} target="_blank" rel="noopener noreferrer">
          Se innlegget på Instagram
        </a>
      </blockquote>
    </div>
  );
}
