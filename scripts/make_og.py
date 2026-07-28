"""OG image showing a stylised front-page preview (grid of boxes)."""
from PIL import Image, ImageDraw, ImageFont
import os

PUB = "/app/frontend/public"
OUT = f"{PUB}/og-image.png"

W, H = 1200, 630
BG = (255, 255, 255)
INK = (15, 14, 13)
RED = (200, 67, 44)

img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)

# 6-box grid — mini preview
box_w, box_h = 200, 150
gap = 12
grid_w = 3 * box_w + 2 * gap
grid_h = 2 * box_h + gap
grid_x = 60
grid_y = (H - grid_h) // 2 - 30

# Layout: [black, white, red] / [image, black, white]
layout = [
    ("black", "01"),
    ("white", "02"),
    ("red", "03"),
    ("img", "04"),
    ("black", "05"),
    ("white", "06"),
]

def draw_box(x, y, kind, label):
    if kind == "black":
        draw.rectangle([x, y, x + box_w, y + box_h], fill=INK)
        draw.text((x + 14, y + 12), label, fill=(255, 255, 255), font=None)
    elif kind == "red":
        draw.rectangle([x, y, x + box_w, y + box_h], fill=RED)
        draw.text((x + 14, y + 12), label, fill=(255, 255, 255), font=None)
    elif kind == "white":
        draw.rectangle([x, y, x + box_w, y + box_h], fill=(250, 250, 250))
        draw.text((x + 14, y + 12), label, fill=INK, font=None)
    elif kind == "img":
        # Try to embed the ink-pen image
        try:
            src = Image.open(f"{PUB}/ink-pen.jpg").convert("RGB")
            src = src.resize((box_w, box_h), Image.LANCZOS)
            img.paste(src, (x, y))
        except Exception:
            draw.rectangle([x, y, x + box_w, y + box_h], fill=(240, 240, 240))

for i, (kind, label) in enumerate(layout):
    col = i % 3
    row = i // 3
    x = grid_x + col * (box_w + gap)
    y = grid_y + row * (box_h + gap)
    draw_box(x, y, kind, label)

# Logo on right
try:
    logo = Image.open(f"{PUB}/bragr-logo.png").convert("RGBA")
    max_w = 500
    scale = max_w / logo.width
    lw, lh = int(logo.width * scale), int(logo.height * scale)
    logo_r = logo.resize((lw, lh), Image.LANCZOS)
    logo_x = 700
    logo_y = (H - lh) // 2 - 30
    img.paste(logo_r, (logo_x, logo_y), logo_r)
except Exception as e:
    print(f"Logo paste failed: {e}")

# Tagline underneath
try:
    # Try to find a serif font
    font_path = None
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
              "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"]:
        if os.path.exists(p):
            font_path = p
            break
    if font_path:
        f_big = ImageFont.truetype(font_path, 26)
        f_small = ImageFont.truetype(font_path, 18)
        draw.text((60, H - 120), "Vi genererer ikke ord.", fill=INK, font=f_big)
        draw.text((60, H - 88), "Vi finner din stemme.", fill=RED, font=f_big)
        draw.text((60, H - 44), "bragarmål.no · norrønt for skaldens språk", fill=(120, 120, 120), font=f_small)
except Exception as e:
    print(f"Font failed: {e}")

img.save(OUT, "PNG", optimize=True)
print(f"Saved {OUT} ({os.path.getsize(OUT)} bytes)")
