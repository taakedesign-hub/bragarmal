"""
PWA static assets & manifest tests.

Bug context: PWA splash showed 'BRAG' cut off on beige background. Fix:
manifest bg/theme -> #ffffff, added 192/512 maskable icons, theme-color meta ->
#ffffff. These tests verify that:
  1. The manifest is served with correct JSON + colors + icon entries.
  2. All declared icons are served with correct MIME type + status 200.
  3. The icon files are actual valid PNGs of the declared dimensions.
  4. index.html contains <meta name="theme-color" content="#ffffff">.
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


# ---------- helpers ----------

def _get(path: str) -> requests.Response:
    return requests.get(f"{BASE_URL}{path}", timeout=30)


# ---------- manifest ----------

class TestManifest:
    def test_manifest_served_200(self):
        r = _get("/site.webmanifest")
        assert r.status_code == 200, f"manifest status={r.status_code}"

    def test_manifest_is_valid_json_with_white_colors(self):
        r = _get("/site.webmanifest")
        assert r.status_code == 200
        data = json.loads(r.text)  # will raise if not JSON
        assert data.get("background_color", "").lower() == "#ffffff", (
            f"background_color={data.get('background_color')!r} — expected #ffffff"
        )
        assert data.get("theme_color", "").lower() == "#ffffff", (
            f"theme_color={data.get('theme_color')!r} — expected #ffffff"
        )

    def test_manifest_has_192_and_512_maskable_icons(self):
        r = _get("/site.webmanifest")
        data = json.loads(r.text)
        icons = data.get("icons", [])
        by_src = {i["src"]: i for i in icons}

        assert "/bragarmal-mark-192.png" in by_src, "192 icon missing from manifest"
        assert "/bragarmal-mark-512.png" in by_src, "512 icon missing from manifest"

        i192 = by_src["/bragarmal-mark-192.png"]
        i512 = by_src["/bragarmal-mark-512.png"]

        assert i192.get("sizes") == "192x192"
        assert i512.get("sizes") == "512x512"

        for icon in (i192, i512):
            purpose = icon.get("purpose", "")
            assert "any" in purpose and "maskable" in purpose, (
                f"icon {icon.get('src')} purpose={purpose!r} — expected 'any maskable'"
            )


# ---------- icon files served ----------

ICONS = [
    ("/bragarmal-mark-192.png", (192, 192)),
    ("/bragarmal-mark-512.png", (512, 512)),
    ("/bragarmal-mark.png", (512, 512)),
    ("/apple-touch-icon.png", (180, 180)),
    ("/favicon-16.png", (16, 16)),
    ("/favicon-32.png", (32, 32)),
]


class TestIconAssets:
    @pytest.mark.parametrize("path,expected_size", ICONS)
    def test_icon_served_200_png(self, path, expected_size):
        r = _get(path)
        assert r.status_code == 200, f"{path} status={r.status_code}"
        ctype = r.headers.get("content-type", "").lower()
        assert "image/png" in ctype, f"{path} content-type={ctype!r}"

        # Validate it's a real PNG of the expected dimensions.
        im = Image.open(io.BytesIO(r.content))
        assert im.format == "PNG", f"{path} format={im.format}"
        assert im.size == expected_size, (
            f"{path} size={im.size} — expected {expected_size}"
        )

    def test_favicon_ico_served(self):
        r = _get("/favicon.ico")
        assert r.status_code == 200, f"favicon.ico status={r.status_code}"
        # content-type varies (image/x-icon, image/vnd.microsoft.icon, image/ico)
        ctype = r.headers.get("content-type", "").lower()
        assert "icon" in ctype or "image" in ctype, (
            f"favicon.ico unexpected content-type={ctype!r}"
        )
        assert len(r.content) > 0, "favicon.ico is empty"

    # --- Visible pixel data / minimum byte-size sanity checks (per re-test spec) ---
    # If an icon file is only alpha-transparent (or truncated), the wordmark would
    # not be visible on the Android splash. Verify the image actually contains
    # non-transparent, non-white pixels AND meets a minimum file size floor.

    _WORDMARK_ICONS = [
        # (path, min_bytes_expected)
        ("/apple-touch-icon.png", 3 * 1024),      # 180px -> >3KB
        ("/bragarmal-mark-192.png", 5 * 1024),    # 192px -> >5KB
        ("/bragarmal-mark-512.png", 15 * 1024),   # 512px -> >15KB
        ("/bragarmal-mark.png", 15 * 1024),       # legacy 512 -> >15KB
    ]

    @pytest.mark.parametrize("path,min_bytes", _WORDMARK_ICONS)
    def test_wordmark_icon_has_visible_pixels(self, path, min_bytes):
        r = _get(path)
        assert r.status_code == 200, f"{path} status={r.status_code}"
        assert len(r.content) >= min_bytes, (
            f"{path} size={len(r.content)}B below threshold {min_bytes}B — "
            f"likely truncated or empty"
        )

        im = Image.open(io.BytesIO(r.content))
        im.load()  # forces full decode; raises on truncated file
        rgba = im.convert("RGBA")
        w, h = rgba.size
        pixels = rgba.getdata()

        # Count pixels that are visible (alpha > 0) AND not pure white.
        # Wordmark = dark ink strokes on white/transparent background.
        visible_dark = 0
        for r_, g_, b_, a_ in pixels:
            if a_ > 0 and not (r_ > 240 and g_ > 240 and b_ > 240):
                visible_dark += 1

        total = w * h
        # Expect the wordmark to occupy at least ~2% of the canvas — enough to
        # confirm real ink is drawn (not a blank/alpha-only image). Real files
        # observed are ~10-20%+ coverage.
        min_required = int(total * 0.02)
        assert visible_dark >= min_required, (
            f"{path} has only {visible_dark}/{total} visible non-white pixels — "
            f"expected >= {min_required}. Icon may be blank/alpha-only."
        )


# ---------- html theme-color meta ----------

class TestIndexHtml:
    def test_index_has_white_theme_color_meta(self):
        r = _get("/")
        assert r.status_code == 200
        html = r.text
        # Look for <meta name="theme-color" content="#ffffff">, tolerant to
        # attribute order + quotes.
        pattern = re.compile(
            r'<meta[^>]*name=["\']theme-color["\'][^>]*content=["\']#ffffff["\']',
            re.IGNORECASE,
        )
        alt = re.compile(
            r'<meta[^>]*content=["\']#ffffff["\'][^>]*name=["\']theme-color["\']',
            re.IGNORECASE,
        )
        assert pattern.search(html) or alt.search(html), (
            "index.html is missing <meta name='theme-color' content='#ffffff'>"
        )

        # And explicitly ensure the old beige color is gone.
        assert "#f5f0e8" not in html.lower(), (
            "index.html still contains the old beige color #f5f0e8"
        )

    def test_index_links_manifest(self):
        r = _get("/")
        assert r.status_code == 200
        assert re.search(
            r'<link[^>]*rel=["\']manifest["\'][^>]*href=["\'][^"\']*site\.webmanifest',
            r.text,
            re.IGNORECASE,
        ), "index.html does not link to site.webmanifest"
