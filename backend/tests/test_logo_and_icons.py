"""
Tests for iteration 13 bug fixes:

1. Transparent PWA icons — apple-touch-icon, bragarmal-mark-192, -512, -.png,
   favicon-16, favicon-32 must be valid RGBA PNGs with at least SOME
   fully-transparent pixels (alpha=0). Verifies the background was NOT filled
   with white.

2. Logo component (frontend/src/components/Logo.jsx) renders <img> only —
   no internal <a> / <Link> wrapper. External pages/Footer/AppShell provide the
   Link, so a wrapping <a href="/"> in the page source has NO nested <a>.

3. Every public page source imports Logo and wraps it in <Link to="/">.
   Footer includes data-testid="footer-logo-link".

4. site.webmanifest still has white bg/theme (regression from iter 12).
"""

import io
import json
import os
import re
from pathlib import Path

import pytest
import requests
from PIL import Image


def _resolve_base_url() -> str:
    val = os.environ.get("REACT_APP_BACKEND_URL")
    if not val:
        fe = Path("/app/frontend/.env").read_text()
        for line in fe.splitlines():
            if line.startswith("REACT_APP_BACKEND_URL="):
                val = line.split("=", 1)[1].strip()
                break
    if not val:
        raise RuntimeError("REACT_APP_BACKEND_URL not configured")
    return val.rstrip("/")


BASE_URL = _resolve_base_url()
FE_PUBLIC = Path("/app/frontend/public")
FE_SRC = Path("/app/frontend/src")


# ---------- (1) Transparent PWA icons ----------

TRANSPARENT_ICONS = [
    "/apple-touch-icon.png",
    "/bragarmal-mark-192.png",
    "/bragarmal-mark-512.png",
    "/bragarmal-mark.png",
    "/favicon-16.png",
    "/favicon-32.png",
]


class TestTransparentIcons:
    """All PWA icons must be RGBA with alpha=0 pixels (transparent background)."""

    @pytest.mark.parametrize("path", TRANSPARENT_ICONS)
    def test_icon_file_has_transparent_pixels(self, path):
        """Local file: RGBA mode, alpha min = 0."""
        p = FE_PUBLIC / path.lstrip("/")
        assert p.exists(), f"{p} missing on disk"

        img = Image.open(p)
        assert img.mode == "RGBA", (
            f"{path} mode={img.mode!r} — expected RGBA "
            f"(icon should have alpha channel)"
        )
        alpha = img.split()[-1]
        mn, mx = alpha.getextrema()
        assert mn == 0, (
            f"{path} alpha min={mn} — expected 0 "
            f"(no fully transparent pixels means bg is filled)"
        )
        assert mx == 255, (
            f"{path} alpha max={mx} — expected 255 "
            f"(icon has no opaque ink pixels)"
        )

    @pytest.mark.parametrize("path", TRANSPARENT_ICONS)
    def test_icon_served_has_transparent_pixels(self, path):
        """Served over HTTP: also RGBA with alpha=0 pixels."""
        r = requests.get(f"{BASE_URL}{path}", timeout=30)
        assert r.status_code == 200, f"{path} HTTP {r.status_code}"
        assert "image/png" in r.headers.get("content-type", "").lower(), (
            f"{path} content-type={r.headers.get('content-type')!r}"
        )
        img = Image.open(io.BytesIO(r.content))
        # Some encoders serve as 'P' with tRNS — normalise to RGBA and re-check
        rgba = img.convert("RGBA") if img.mode != "RGBA" else img
        assert img.mode == "RGBA", (
            f"{path} served mode={img.mode!r} — expected RGBA"
        )
        mn, mx = rgba.split()[-1].getextrema()
        assert mn == 0, f"{path} served alpha min={mn} — expected 0"
        assert mx == 255, f"{path} served alpha max={mx} — expected 255"

    @pytest.mark.parametrize(
        "path,max_kb",
        [
            ("/apple-touch-icon.png", 15),        # 180x180, mostly transparent
            ("/bragarmal-mark-192.png", 15),      # 192x192, mostly transparent
            ("/bragarmal-mark-512.png", 30),      # 512x512, mostly transparent
        ],
    )
    def test_transparent_icon_size_bound(self, path, max_kb):
        """Since icons now have transparent bg, byte size is smaller."""
        r = requests.get(f"{BASE_URL}{path}", timeout=30)
        assert r.status_code == 200
        kb = len(r.content) / 1024
        assert kb <= max_kb, (
            f"{path} is {kb:.1f}KB — should be <= {max_kb}KB with transparent bg"
        )


# ---------- (2) Logo.jsx has no internal <a>/<Link> ----------

class TestLogoComponentSource:
    """Logo.jsx must render only <img>, never wrap itself in <a> or <Link>."""

    def test_logo_has_no_internal_link_wrapper(self):
        src = (FE_SRC / "components" / "Logo.jsx").read_text()
        # Must NOT import Link
        assert "react-router-dom" not in src, (
            "Logo.jsx imports react-router-dom — it should not wrap itself in Link"
        )
        assert "<Link" not in src, (
            "Logo.jsx contains a <Link — component should be plain <img> only"
        )
        # There should be an <img
        assert "<img" in src, "Logo.jsx has no <img element"

    def test_logo_has_alt_bragarmal(self):
        src = (FE_SRC / "components" / "Logo.jsx").read_text()
        assert re.search(r'alt=["\']Bragarmål["\']', src), (
            "Logo.jsx <img> missing alt=\"Bragarmål\""
        )


# ---------- (3) Every public page wraps Logo in <Link to="/"> ----------

PAGES_WITH_LOGO_LINK = [
    "pages/Landing.jsx",
    "pages/LoginPage.jsx",
    "pages/ExamplesPage.jsx",
    "pages/ManifestPage.jsx",
    "pages/EthicsPage.jsx",
    "pages/PricingPage.jsx",
    "pages/PaymentStatusPage.jsx",
    "components/AppShell.jsx",
]


class TestPagesWrapLogoInLink:
    @pytest.mark.parametrize("rel_path", PAGES_WITH_LOGO_LINK)
    def test_page_wraps_logo_in_link_to_root(self, rel_path):
        src = (FE_SRC / rel_path).read_text()
        # Look for <Link to="/" ...>...<Logo .../></Link>
        pattern = re.compile(
            r'<Link\s+to=["\']/["\'][^>]*>\s*(?:\{[^}]*\}\s*)?<Logo\b',
            re.DOTALL,
        )
        assert pattern.search(src), (
            f"{rel_path} does not wrap <Logo> in <Link to=\"/\">"
        )


class TestFooterLogoLink:
    def test_footer_has_logo_link_with_testid(self):
        src = (FE_SRC / "components" / "Footer.jsx").read_text()
        # Look for data-testid="footer-logo-link" and Link to="/"
        assert 'data-testid="footer-logo-link"' in src, (
            "Footer.jsx missing data-testid=\"footer-logo-link\""
        )
        pattern = re.compile(
            r'<Link[^>]*to=["\']/["\'][^>]*data-testid=["\']footer-logo-link["\'][^>]*>'
            r'\s*<Logo',
            re.DOTALL,
        )
        alt = re.compile(
            r'<Link[^>]*data-testid=["\']footer-logo-link["\'][^>]*to=["\']/["\'][^>]*>'
            r'\s*<Logo',
            re.DOTALL,
        )
        assert pattern.search(src) or alt.search(src), (
            "Footer.jsx does not have <Link to=\"/\" data-testid=\"footer-logo-link\">"
            " wrapping <Logo>"
        )


# ---------- (4) Manifest regression check ----------

class TestManifestWhiteBg:
    def test_manifest_bg_and_theme_white(self):
        r = requests.get(f"{BASE_URL}/site.webmanifest", timeout=30)
        assert r.status_code == 200
        data = json.loads(r.text)
        assert data.get("background_color", "").lower() == "#ffffff"
        assert data.get("theme_color", "").lower() == "#ffffff"
