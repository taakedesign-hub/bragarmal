"""Regenerate favicons from current bragr-logo.png"""
from PIL import Image
import os

PUB = "/app/frontend/public"
SRC = f"{PUB}/bragr-logo.png"

logo = Image.open(SRC).convert("RGBA")
# Crop to square focussing on the 'B' with pen nib
w, h = logo.size
# Take the left portion where the B is (roughly first 20% is decorated B)
crop_w = min(w, int(h * 1.2))
mark = logo.crop((0, 0, crop_w, h))

# Center on square canvas
size = max(mark.size)
sq = Image.new("RGBA", (size, size), (0, 0, 0, 0))
sq.paste(mark, ((size - mark.size[0]) // 2, (size - mark.size[1]) // 2), mark)
sq.save(f"{PUB}/bragr-mark.png", "PNG", optimize=True)

# Favicons on white bg (matching new site bg)
BG = (255, 255, 255, 255)
for size, path in [(32, f"{PUB}/favicon-32.png"), (16, f"{PUB}/favicon-16.png"), (180, f"{PUB}/apple-touch-icon.png")]:
    canvas = Image.new("RGBA", (size, size), BG)
    resized = sq.resize((int(size * 0.9), int(size * 0.9)), Image.LANCZOS)
    canvas.paste(resized, ((size - resized.size[0]) // 2, (size - resized.size[1]) // 2), resized)
    canvas.save(path, "PNG", optimize=True)
    print(f"Saved {path}")

ico_sources = []
for s in (16, 32, 48, 64):
    c = Image.new("RGBA", (s, s), BG)
    r_img = sq.resize((int(s * 0.9), int(s * 0.9)), Image.LANCZOS)
    c.paste(r_img, ((s - r_img.size[0]) // 2, (s - r_img.size[1]) // 2), r_img)
    ico_sources.append(c)
ico_sources[0].save(f"{PUB}/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print("Saved favicon.ico")
