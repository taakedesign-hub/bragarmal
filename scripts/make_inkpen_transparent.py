"""Make the ink-pen image background transparent."""
from PIL import Image
import numpy as np
import os

SRC = "/tmp/ink_pen.jpg"
DST = "/app/frontend/public/ink-pen.png"

img = Image.open(SRC).convert("RGBA")
arr = np.array(img).astype(np.float32)

r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
# The background is a light gray/beige. Compute luminance.
lum = 0.299 * r + 0.587 * g + 0.114 * b

# Tighter threshold since the inkwell is glass (transparent-looking) and shouldn't be removed
# Keep pixels that are darker OR have color (not neutral gray)
gray_delta = np.max(arr[..., :3], axis=-1) - np.min(arr[..., :3], axis=-1)

# Alpha:
#   - Fully opaque where luminance < 180 (dark: pen, ink shadow, gold)
#   - Fully opaque where color saturation > 20 (gold pen accents)
#   - Fade between 180-235
#   - Transparent above 235
lo, hi = 180.0, 235.0
alpha_from_lum = np.clip((hi - lum) / (hi - lo) * 255.0, 0, 255)
alpha_from_sat = np.clip(gray_delta * 4, 0, 255)  # boost saturated pixels
new_alpha = np.maximum(alpha_from_lum, alpha_from_sat).astype(np.uint8)

arr[..., 3] = new_alpha
out = Image.fromarray(arr.astype(np.uint8), "RGBA")

# Trim transparent border
bbox = out.getbbox()
if bbox:
    out = out.crop(bbox)

out.save(DST, "PNG", optimize=True)
print(f"Saved {DST} ({os.path.getsize(DST)} bytes, size {out.size})")
