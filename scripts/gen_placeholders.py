"""
Generates elegant, on-brand SVG placeholder artwork for Soul Hues so the
site looks finished with zero external image dependencies. Every file is
meant to be swapped for real product photography later -- see
public/images/README.md.
"""
import os
import math

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")
os.makedirs(OUT, exist_ok=True)

CREAM = "#FAF8F3"
CREAM_ALT = "#F5F2EC"
CREAM_DEEP = "#EFE7D6"
FOREST = "#4F6B52"  # deep sage — main icon lines / deep illustration elements
FOREST_DARK = "#2E3B2F"  # ink — darkest text / shadow elements
GOLD = "#6F8F72"  # sage — accent icon color
GOLD_LIGHT = "#B8D6B4"  # sage-accent — lighter accent
BLUSH = "#E8E2D8"

def bg(w, h, seed=0, tone="cream"):
    tones = {
        "cream": (CREAM, CREAM_ALT),
        "deep": (CREAM_ALT, CREAM_DEEP),
        "forest": (FOREST, FOREST_DARK),
    }
    c1, c2 = tones[tone]
    angle = 45 + (seed * 17) % 90
    return f'''
  <defs>
    <linearGradient id="bgGrad{seed}" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate({angle} 0.5 0.5)">
      <stop offset="0%" stop-color="{c1}"/>
      <stop offset="100%" stop-color="{c2}"/>
    </linearGradient>
    <radialGradient id="vign{seed}" cx="50%" cy="40%" r="75%">
      <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.06"/>
    </radialGradient>
  </defs>
  <rect width="{w}" height="{h}" fill="url(#bgGrad{seed})"/>
  <rect width="{w}" height="{h}" fill="url(#vign{seed})"/>
'''

def corner_brackets(w, h, pad=28, size=30, color=GOLD, op=0.85):
    s = size
    return f'''
  <g stroke="{color}" stroke-width="1.4" fill="none" opacity="{op}" stroke-linecap="round">
    <path d="M{pad},{pad+s} V{pad+10} Q{pad},{pad} {pad+10},{pad} H{pad+s}"/>
    <path d="M{w-pad-s},{pad} H{w-pad-10} Q{w-pad},{pad} {w-pad},{pad+10} V{pad+s}"/>
    <path d="M{pad},{h-pad-s} V{h-pad-10} Q{pad},{h-pad} {pad+10},{h-pad} H{pad+s}"/>
    <path d="M{w-pad-s},{h-pad} H{w-pad-10} Q{w-pad},{h-pad} {w-pad},{h-pad-10} V{h-pad-s}"/>
  </g>
'''

def sparkle(cx, cy, scale=1.0, color=GOLD):
    return f'''
  <g transform="translate({cx},{cy}) scale({scale})" fill="{color}" opacity="0.9">
    <path d="M0,-16 C1,-5 5,-1 16,0 C5,1 1,5 0,16 C-1,5 -5,1 -16,0 C-5,-1 -1,-5 0,-16 Z"/>
  </g>
'''

def ring_icon(cx, cy, r, color):
    return f'''
  <g transform="translate({cx},{cy})" stroke="{color}" fill="none" stroke-width="3">
    <circle r="{r}" />
  </g>
  <path d="M{cx-9},{cy-r-2} L{cx},{cy-r-16} L{cx+9},{cy-r-2} Z" fill="{color}" opacity="0.9"/>
'''

def earring_icon(cx, cy, color):
    g = []
    for dx in (-34, 34):
        x = cx + dx
        g.append(f'<circle cx="{x}" cy="{cy-46}" r="5" fill="{color}"/>')
        g.append(f'<line x1="{x}" y1="{cy-41}" x2="{x}" y2="{cy-6}" stroke="{color}" stroke-width="2.5"/>')
        g.append(f'<path d="M{x-16},{cy-6} Q{x},{cy+40} {x+16},{cy-6} Q{x},{cy+18} {x-16},{cy-6} Z" fill="none" stroke="{color}" stroke-width="3"/>')
    return "\n".join(g)

def necklace_icon(cx, cy, color):
    pts = []
    n = 13
    for i in range(n):
        t = i / (n - 1)
        x = cx - 110 + t * 220
        y = cy - 40 + math.sin(t * math.pi) * 46
        pts.append((x, y))
    path = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts)
    bottom = pts[n // 2]
    return f'''
  <path d="{path}" fill="none" stroke="{color}" stroke-width="2.5"/>
  <path d="M{bottom[0]-14},{bottom[1]+6} L{bottom[0]},{bottom[1]+46} L{bottom[0]+14},{bottom[1]+6} Q{bottom[0]},{bottom[1]+22} {bottom[0]-14},{bottom[1]+6} Z" fill="{color}" opacity="0.9"/>
'''

def bracelet_icon(cx, cy, color):
    g = [f'<ellipse cx="{cx}" cy="{cy}" rx="86" ry="30" fill="none" stroke="{color}" stroke-width="3"/>']
    for i in range(6):
        a = (i / 6) * math.pi
        x = cx + 86 * math.cos(a)
        y = cy - 30 * math.sin(a) * -1 + 0
        y = cy + 30 * math.sin(a + math.pi)
    for i in range(-2, 3):
        x = cx + i * 26
        g.append(f'<circle cx="{x}" cy="{cy+28 - (26-abs(i)*4)}" r="3" fill="{color}" opacity="0.7"/>')
    return "\n".join(g)

def anklet_icon(cx, cy, color):
    g = [f'<ellipse cx="{cx}" cy="{cy}" rx="92" ry="22" fill="none" stroke="{color}" stroke-width="2.5"/>']
    x = cx
    y = cy + 22
    g.append(f'<line x1="{x}" y1="{y}" x2="{x}" y2="{y+20}" stroke="{color}" stroke-width="2"/>')
    g.append(f'<circle cx="{x}" cy="{y+28}" r="6" fill="{color}" opacity="0.85"/>')
    return "\n".join(g)

def hair_icon(cx, cy, color):
    return f'''
  <path d="M{cx-40},{cy} Q{cx-10},{cy-34} {cx},{cy} Q{cx+10},{cy-34} {cx+40},{cy} Q{cx+10},{cy-6} {cx},{cy-16} Q{cx-10},{cy-6} {cx-40},{cy} Z" fill="none" stroke="{color}" stroke-width="2.5"/>
  <circle cx="{cx}" cy="{cy-14}" r="6" fill="{color}"/>
'''

ICONS = {
    "rings": lambda cx, cy, c: ring_icon(cx, cy, 46, c),
    "earrings": earring_icon,
    "necklaces": necklace_icon,
    "bracelets": bracelet_icon,
    "anklets": anklet_icon,
    "hair-accessories": hair_icon,
}

def product_svg(path, category, seed, label, w=800, h=800):
    color = [FOREST, GOLD_LIGHT, FOREST][seed % 3]
    icon_color = FOREST if color != FOREST else GOLD
    icon_fn = ICONS.get(category, ring_icon)
    icon = icon_fn(w / 2, h / 2 + 10, FOREST)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">
{bg(w, h, seed, "cream" if seed % 2 == 0 else "deep")}
{corner_brackets(w, h, pad=26, size=28)}
{sparkle(w/2, 96, 0.85, GOLD)}
{icon}
  <text x="{w/2}" y="{h-58}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="26" fill="{FOREST_DARK}" letter-spacing="1">{label}</text>
</svg>'''
    with open(path, "w") as f:
        f.write(svg)

def flatlay_svg(path, w=1200, h=1400):
    items = [
        (w*0.28, h*0.30, "rings"),
        (w*0.68, h*0.24, "earrings"),
        (w*0.5, h*0.60, "necklaces"),
        (w*0.24, h*0.72, "bracelets"),
        (w*0.75, h*0.75, "hair-accessories"),
    ]
    body = []
    for i, (x, y, cat) in enumerate(items):
        fn = ICONS.get(cat, ring_icon)
        body.append(f'<g transform="scale(1.15) translate({x*0.15},{y*0.15})">{fn(x, y, FOREST if i % 2 == 0 else GOLD)}</g>')
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">
{bg(w, h, 9, "cream")}
{corner_brackets(w, h, pad=40, size=46)}
{sparkle(w*0.5, h*0.12, 1.4, GOLD)}
{''.join(body)}
</svg>'''
    with open(path, "w") as f:
        f.write(svg)

def portrait_svg(path, w=900, h=1100, label="Shivani"):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">
{bg(w, h, 3, "deep")}
{corner_brackets(w, h, pad=36, size=42)}
  <ellipse cx="{w/2}" cy="{h*0.42}" rx="150" ry="170" fill="{FOREST}" opacity="0.14"/>
  <path d="M{w/2-95},{h*0.62} Q{w/2},{h*0.30} {w/2+95},{h*0.62} L{w/2+120},{h*0.95} Q{w/2},{h*1.02} {w/2-120},{h*0.95} Z" fill="{FOREST}" opacity="0.16"/>
  <circle cx="{w/2}" cy="{h*0.34}" r="86" fill="{FOREST}" opacity="0.20"/>
{sparkle(w*0.5, h*0.14, 1.1, GOLD)}
  <text x="{w/2}" y="{h*0.90}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="40" fill="{FOREST_DARK}">{label}</text>
  <text x="{w/2}" y="{h*0.94}" text-anchor="middle" font-family="Georgia, serif" font-size="16" letter-spacing="3" fill="{GOLD}">FOUNDER, SOUL HUES</text>
</svg>'''
    with open(path, "w") as f:
        f.write(svg)

def gallery_svg(path, seed, w=700, h=700):
    color = [FOREST, GOLD, FOREST_DARK][seed % 3]
    cat = list(ICONS.keys())[seed % len(ICONS)]
    icon = ICONS[cat](w/2, h/2, color)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">
{bg(w, h, seed, ["cream", "deep", "forest"][seed % 3])}
{icon if seed % 3 != 2 else ""}
{sparkle(w*0.82, h*0.18, 0.7, GOLD_LIGHT if seed % 3 == 2 else GOLD)}
</svg>'''
    with open(path, "w") as f:
        f.write(svg)

def hero_svg(path, w=1400, h=1600):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">
{bg(w, h, 1, "deep")}
  <circle cx="{w*0.5}" cy="{h*0.42}" r="360" fill="{FOREST}" opacity="0.10"/>
  <circle cx="{w*0.5}" cy="{h*0.42}" r="280" fill="{GOLD}" opacity="0.08"/>
{corner_brackets(w, h, pad=48, size=56)}
{necklace_icon(w*0.5, h*0.40, FOREST)}
{sparkle(w*0.72, h*0.20, 1.6, GOLD)}
{sparkle(w*0.24, h*0.66, 1.1, GOLD_LIGHT)}
  <g transform="translate({w*0.30},{h*0.62})">{ring_icon(0,0,44,FOREST)}</g>
  <g transform="translate({w*0.68},{h*0.66})">{ring_icon(0,0,30,GOLD)}</g>
</svg>'''
    with open(path, "w") as f:
        f.write(svg)

def about_craft_svg(path, w=1200, h=900):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">
{bg(w, h, 5, "cream")}
{corner_brackets(w, h, pad=36, size=44)}
{bracelet_icon(w*0.30, h*0.5, FOREST)}
{earring_icon(w*0.68, h*0.48, GOLD)}
{sparkle(w*0.5, h*0.16, 1.2, GOLD)}
</svg>'''
    with open(path, "w") as f:
        f.write(svg)

def reel_thumb_svg(path, seed, category, w=720, h=1280):
    """Vertical (9:16) placeholder standing in for an Instagram Reel cover
    frame. The actual play-button overlay is rendered in React/CSS so it
    can animate on hover -- this file is just the static backdrop."""
    icon_fn = ICONS.get(category, ring_icon)
    icon = icon_fn(w / 2, h * 0.46, FOREST if seed % 2 == 0 else GOLD)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">
{bg(w, h, seed, "cream" if seed % 2 == 0 else "deep")}
{corner_brackets(w, h, pad=30, size=34)}
{sparkle(w*0.5, h*0.14, 1.0, GOLD)}
{icon}
</svg>'''
    with open(path, "w") as f:
        f.write(svg)


PRODUCTS = [
    ("gold-vine-hoops", "earrings", "Gold Vine Hoops"),
    ("ivory-bloom-studs", "earrings", "Ivory Bloom Studs"),
    ("whisper-drop-earrings", "earrings", "Whisper Drop Earrings"),
    ("forest-leaf-necklace", "necklaces", "Forest Leaf Necklace"),
    ("layered-pearl-necklace", "necklaces", "Layered Pearl Necklace"),
    ("sun-coin-pendant", "necklaces", "Sun Coin Pendant"),
    ("braided-thread-bracelet", "bracelets", "Braided Thread Bracelet"),
    ("gold-charm-bangle", "bracelets", "Gold Charm Bangle"),
    ("moonstone-cuff", "bracelets", "Moonstone Cuff"),
    ("botanical-band-ring", "rings", "Botanical Band Ring"),
    ("stacking-ring-set", "rings", "Stacking Ring Set"),
    ("dainty-anklet", "anklets", "Dainty Bell Anklet"),
    ("beaded-anklet-duo", "anklets", "Beaded Anklet Duo"),
    ("pearl-hair-pin-set", "hair-accessories", "Pearl Hair Pin Set"),
]

for i, (slug, cat, label) in enumerate(PRODUCTS):
    product_svg(os.path.join(OUT, f"product-{slug}.svg"), cat, i, label)

for i, cat in enumerate(ICONS.keys()):
    product_svg(os.path.join(OUT, f"category-{cat}.svg"), cat, i, cat.replace("-", " ").title(), w=700, h=700)

for i in range(8):
    gallery_svg(os.path.join(OUT, f"gallery-{i+1}.svg"), i)

flatlay_svg(os.path.join(OUT, "flatlay-collection.svg"))
portrait_svg(os.path.join(OUT, "founder-shivani.svg"))
hero_svg(os.path.join(OUT, "hero-jewellery.svg"))
about_craft_svg(os.path.join(OUT, "about-craftsmanship.svg"))
about_craft_svg(os.path.join(OUT, "about-why-handmade.svg"))

REEL_CATEGORIES = ["earrings", "necklaces", "rings", "bracelets"]
for i, cat in enumerate(REEL_CATEGORIES):
    reel_thumb_svg(os.path.join(OUT, f"reel-{i+1}.svg"), i, cat)

print("Generated", len(os.listdir(OUT)), "placeholder assets in", OUT)
