"""Generate transparent PNG variants of the Bragr logo, plus favicons."""
from PIL import Image
import numpy as np

SRC = "/tmp/bragr_logo_v2.jpg"
PUBLIC = "/app/frontend/public"
OUT_MAIN = f"{PUBLIC}/bragr-logo.png"
OUT_DARK = f"{PUBLIC}/bragr-logo-dark.png"
OUT_MARK = f"{PUBLIC}/bragr-mark.png"        # square symbol only, for OG & favicon
OUT_FAV_32 = f"{PUBLIC}/favicon-32.png"
OUT_FAV_16 = f"{PUBLIC}/favicon-16.png"
OUT_APPLE = f"{PUBLIC}/apple-touch-icon.png"
OUT_OG = f"{PUBLIC}/og-image.png"
OUT_FAV_ICO = f"{PUBLIC}/favicon.ico"

img = Image.open(SRC).convert("RGBA")
arr = np.array(img)

r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
lum = 0.299 * r + 0.587 * g + 0.114 * b

# Tight threshold to remove near-white bg cleanly
lo, hi = 120.0, 200.0
new_alpha = np.clip((hi - lum) / (hi - lo) * 255.0, 0, 255).astype(np.uint8)
arr[..., 3] = new_alpha

# Snap RGB toward pure ink to remove halo
ink = np.array([28, 27, 26], dtype=np.float32)
mask = new_alpha > 10
for i in range(3):
    arr[..., i] = np.where(mask, ink[i], arr[..., i])

out = Image.fromarray(arr, "RGBA")
bbox = out.getbbox()
if bbox:
    out = out.crop(bbox)

# Small transparent padding
w, h = out.size
pad = int(max(w, h) * 0.04)
padded = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
padded.paste(out, (pad, pad), out)
padded.save(OUT_MAIN, "PNG", optimize=True)
print(f"Saved: {OUT_MAIN} — {padded.size}")

# Dark variant (light ink for dark backgrounds)
arr_d = np.array(padded)
mask_d = arr_d[..., 3] > 0
arr_d[..., 0] = np.where(mask_d, 245, arr_d[..., 0])
arr_d[..., 1] = np.where(mask_d, 240, arr_d[..., 1])
arr_d[..., 2] = np.where(mask_d, 232, arr_d[..., 2])
Image.fromarray(arr_d, "RGBA").save(OUT_DARK, "PNG", optimize=True)
print(f"Saved: {OUT_DARK}")

# Square "mark" for favicon/OG — just the pen icon on the left, roughly first 22% of width
# Since it's a wordmark, safer to embed the whole logo in a square canvas
sq_size = max(padded.size)
sq = Image.new("RGBA", (sq_size, sq_size), (0, 0, 0, 0))
sq.paste(padded, ((sq_size - padded.size[0]) // 2, (sq_size - padded.size[1]) // 2), padded)
sq.save(OUT_MARK, "PNG", optimize=True)
print(f"Saved: {OUT_MARK} — {sq.size}")

# Favicons on papyrus background so it shows up in browser tabs
BG = (245, 240, 232, 255)  # papyrus / linen
for size, path in [(32, OUT_FAV_32), (16, OUT_FAV_16), (180, OUT_APPLE)]:
    canvas = Image.new("RGBA", (size, size), BG)
    resized = sq.resize((int(size * 0.86), int(size * 0.86)), Image.LANCZOS)
    canvas.paste(resized, ((size - resized.size[0]) // 2, (size - resized.size[1]) // 2), resized)
    canvas.save(path, "PNG", optimize=True)
    print(f"Saved: {path}")

# Multi-resolution .ico
ico_sources = []
for s in (16, 32, 48, 64):
    c = Image.new("RGBA", (s, s), BG)
    r_img = sq.resize((int(s * 0.86), int(s * 0.86)), Image.LANCZOS)
    c.paste(r_img, ((s - r_img.size[0]) // 2, (s - r_img.size[1]) // 2), r_img)
    ico_sources.append(c)
ico_sources[0].save(OUT_FAV_ICO, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print(f"Saved: {OUT_FAV_ICO}")

# Open Graph image — 1200x630 with logo centred on papyrus bg
og = Image.new("RGB", (1200, 630), (245, 240, 232))
og_logo = padded.copy()
# Scale logo to ~60% of canvas width
target_w = int(1200 * 0.6)
ratio = target_w / og_logo.size[0]
og_logo = og_logo.resize((target_w, int(og_logo.size[1] * ratio)), Image.LANCZOS)
og.paste(og_logo, ((1200 - og_logo.size[0]) // 2, (630 - og_logo.size[1]) // 2 - 30), og_logo)
og.save(OUT_OG, "PNG", optimize=True)
print(f"Saved: {OUT_OG}")
