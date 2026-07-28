"""Transparent PNG variants + favicons for the Bragarmål logo."""
from PIL import Image
import numpy as np

SRC = "/tmp/bragarmal_logo.jpg"
PUB = "/app/frontend/public"

img = Image.open(SRC).convert("RGBA")
arr = np.array(img)
r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
lum = 0.299 * r + 0.587 * g + 0.114 * b
lo, hi = 120.0, 200.0
new_alpha = np.clip((hi - lum) / (hi - lo) * 255.0, 0, 255).astype(np.uint8)
arr[..., 3] = new_alpha
ink = np.array([28, 27, 26], dtype=np.float32)
mask = new_alpha > 10
for i in range(3):
    arr[..., i] = np.where(mask, ink[i], arr[..., i])

out = Image.fromarray(arr, "RGBA")
bbox = out.getbbox()
if bbox:
    out = out.crop(bbox)
w, h = out.size
pad = int(max(w, h) * 0.04)
padded = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
padded.paste(out, (pad, pad), out)
padded.save(f"{PUB}/bragr-logo.png", "PNG", optimize=True)  # reuse filename
print(f"Saved logo: {padded.size}")

# Dark variant (white ink)
arr_d = np.array(padded)
mask_d = arr_d[..., 3] > 0
arr_d[..., 0] = np.where(mask_d, 245, arr_d[..., 0])
arr_d[..., 1] = np.where(mask_d, 240, arr_d[..., 1])
arr_d[..., 2] = np.where(mask_d, 232, arr_d[..., 2])
Image.fromarray(arr_d, "RGBA").save(f"{PUB}/bragr-logo-dark.png", "PNG", optimize=True)

# Square mark
sq_size = max(padded.size)
sq = Image.new("RGBA", (sq_size, sq_size), (0, 0, 0, 0))
sq.paste(padded, ((sq_size - padded.size[0]) // 2, (sq_size - padded.size[1]) // 2), padded)
sq.save(f"{PUB}/bragr-mark.png", "PNG", optimize=True)

# Favicons on papyrus bg
BG = (245, 240, 232, 255)
for size, path in [(32, f"{PUB}/favicon-32.png"), (16, f"{PUB}/favicon-16.png"), (180, f"{PUB}/apple-touch-icon.png")]:
    canvas = Image.new("RGBA", (size, size), BG)
    resized = sq.resize((int(size * 0.86), int(size * 0.86)), Image.LANCZOS)
    canvas.paste(resized, ((size - resized.size[0]) // 2, (size - resized.size[1]) // 2), resized)
    canvas.save(path, "PNG", optimize=True)

ico_sources = []
for s in (16, 32, 48, 64):
    c = Image.new("RGBA", (s, s), BG)
    r_img = sq.resize((int(s * 0.86), int(s * 0.86)), Image.LANCZOS)
    c.paste(r_img, ((s - r_img.size[0]) // 2, (s - r_img.size[1]) // 2), r_img)
    ico_sources.append(c)
ico_sources[0].save(f"{PUB}/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

# OG image (1200x630)
og = Image.new("RGB", (1200, 630), (245, 240, 232))
og_logo = padded.copy()
target_w = int(1200 * 0.6)
ratio = target_w / og_logo.size[0]
og_logo = og_logo.resize((target_w, int(og_logo.size[1] * ratio)), Image.LANCZOS)
og.paste(og_logo, ((1200 - og_logo.size[0]) // 2, (630 - og_logo.size[1]) // 2 - 30), og_logo)
og.save(f"{PUB}/og-image.png", "PNG", optimize=True)
print("All done")
