#!/usr/bin/env python3
"""Genera logo optimizado, iconos de la PWA y favicon a partir de branding/logo-original.png.

Uso (desde la raíz del repo):
    pip install pillow
    python3 scripts/make-assets.py

Si algún día cambias el logo, sustituye branding/logo-original.png y vuelve a ejecutarlo.
"""
from pathlib import Path
from PIL import Image

Image.MAX_IMAGE_PIXELS = None  # el original mide 18734x5515 px

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "branding" / "logo-original.png"
ICONS = ROOT / "icons"
ICONS.mkdir(exist_ok=True)

BG = (248, 250, 252, 255)  # --color-bg-page de la web

logo = Image.open(SRC).convert("RGBA")
W, H = logo.size

# 1) Logo horizontal para la web (1200 px de ancho; 2x para pantallas retina a 600 px)
for width, name in ((1200, "logo.png"), (600, "logo-600.png")):
    h = round(H * width / W)
    logo.resize((width, h), Image.LANCZOS).save(ROOT / name, optimize=True)

# 2) La "A" del logo (marca) para los iconos cuadrados
#    Recorte medido sobre el original: la A ocupa aproximadamente x 45.7%-70.7%, y 0%-85%
mark = logo.crop((round(W * 0.455), 0, round(W * 0.712), round(H * 0.865)))
bbox = mark.getbbox()
mark = mark.crop(bbox)


def square_icon(size, safe, name, bg=BG):
    """Icono cuadrado con la A centrada. 'safe' = fracción del lado que ocupa la A."""
    canvas = Image.new("RGBA", (size, size), bg)
    target = int(size * safe)
    m = mark.copy()
    m.thumbnail((target, target), Image.LANCZOS)
    canvas.alpha_composite(m, ((size - m.width) // 2, (size - m.height) // 2))
    canvas.convert("RGB").save(ICONS / name, optimize=True)
    return canvas


square_icon(192, 0.70, "icon-192.png")
square_icon(512, 0.70, "icon-512.png")
square_icon(512, 0.52, "icon-maskable-512.png")  # zona segura del 80 % para iconos "maskable"
square_icon(180, 0.70, "apple-touch-icon.png")
square_icon(48, 0.80, "favicon-48.png")
fav = square_icon(32, 0.84, "favicon-32.png")

ico = Image.open(ICONS / "favicon-48.png").convert("RGBA")
ico.save(ROOT / "favicon.ico", sizes=[(48, 48), (32, 32), (16, 16)])
print("OK: logo.png, logo-600.png, favicon.ico e iconos en /icons")
