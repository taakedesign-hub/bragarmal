"""
PWA static assets & manifest tests.

Bug context: PWA splash showed 'BRAG' cut off on beige background. Fix:
manifest bg/theme -> #ffffff, added 192/512 maskable icons, theme-color meta ->
#ffffff. These tests verify that:
  1. The manifest is valid JSON with the right colors + icon entries.
  2. Every icon the manifest declares exists.
  3. The icon files are actual valid PNGs of the declared dimensions.
  4. index.html contains <meta name="theme-color" content="#ffffff">.

Kildene leses fra `frontend/public` i repoet, ikke over HTTP: frontend og
backend ligger på hver sin origin nå, så backend-URL-en serverer ingen av
disse filene.
"""

import io
import json
import re

import pytest
from PIL import Image

from .repo import public_bytes, public_text


# ---------- manifest ----------

class TestManifest:
    def test_manifest_exists(self):
        assert public_bytes("/site.webmanifest"), "site.webmanifest er tom"

    def test_manifest_is_valid_json_with_white_colors(self):
        data = json.loads(public_text("/site.webmanifest"))  # will raise if not JSON
        assert data.get("background_color", "").lower() == "#ffffff", (
            f"background_color={data.get('background_color')!r} — expected #ffffff"
        )
        assert data.get("theme_color", "").lower() == "#ffffff", (
            f"theme_color={data.get('theme_color')!r} — expected #ffffff"
        )

    def test_manifest_has_192_and_512_maskable_icons(self):
        data = json.loads(public_text("/site.webmanifest"))
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


# ---------- icon files present ----------

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
    def test_icon_is_png_of_declared_size(self, path, expected_size):
        data = public_bytes(path)

        # Validate it's a real PNG of the expected dimensions.
        im = Image.open(io.BytesIO(data))
        assert im.format == "PNG", f"{path} format={im.format}"
        assert im.size == expected_size, (
            f"{path} size={im.size} — expected {expected_size}"
        )

    def test_favicon_ico_present(self):
        data = public_bytes("/favicon.ico")
        assert len(data) > 0, "favicon.ico is empty"

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
        data = public_bytes(path)
        assert len(data) >= min_bytes, (
            f"{path} size={len(data)}B below threshold {min_bytes}B — "
            f"likely truncated or empty"
        )

        im = Image.open(io.BytesIO(data))
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
        html = public_text("/index.html")
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
        assert re.search(
            r'<link[^>]*rel=["\']manifest["\'][^>]*href=["\'][^"\']*site\.webmanifest',
            public_text("/index.html"),
            re.IGNORECASE,
        ), "index.html does not link to site.webmanifest"
