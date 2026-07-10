#!/usr/bin/env python3
"""
Extract per-zone panel masks from Higgsfield colour-coded recolour edits.

Each edit repaints up to three panels of the base render in pure RED / BLUE /
YELLOW. A pixel belongs to a zone when (a) it changed materially vs the base
image and (b) its colour in the edit is dominated by that zone's key colour.
Outputs one acid-green translucent RGBA PNG per zone (for the hover shading in
the livery configurator) plus each mask's centroid/bbox for marker placement.

Usage: python3 extract_masks.py <base.png> <edit.png> <outdir> zoneid:red zoneid:blue [zoneid:yellow]
"""
import json
import sys

from PIL import Image, ImageFilter

ACID = (166, 255, 62)
DIFF_T = 60  # min per-pixel change vs base (sum of abs channel deltas)


def classify(px):
    r, g, b = px
    # Pure-hue dominance tests, generous to lighting falloff on the paint.
    if r > 120 and r > g * 1.8 and r > b * 1.8:
        return "red"
    if b > 110 and b > r * 1.6 and b > g * 1.6:
        return "blue"
    if r > 120 and g > 120 and b < min(r, g) * 0.55:
        return "yellow"
    return None


def main():
    base_p, edit_p, outdir = sys.argv[1], sys.argv[2], sys.argv[3]
    zones = dict(a.split(":")[::-1] for a in sys.argv[4:])  # color -> zoneid

    base = Image.open(base_p).convert("RGB")
    edit = Image.open(edit_p).convert("RGB")
    if edit.size != base.size:
        edit = edit.resize(base.size, Image.LANCZOS)
    W, H = base.size

    bp, ep = base.load(), edit.load()
    masks = {z: Image.new("L", (W, H), 0) for z in zones.values()}
    mp = {z: masks[z].load() for z in masks}

    for y in range(H):
        for x in range(W):
            eb = ep[x, y]
            bb = bp[x, y]
            d = abs(eb[0] - bb[0]) + abs(eb[1] - bb[1]) + abs(eb[2] - bb[2])
            if d < DIFF_T:
                continue
            c = classify(eb)
            if c and c in zones:
                mp[zones[c]][x, y] = 255

    report = {}
    for zid, m in masks.items():
        # Despeckle + close small holes, then soften the edge slightly.
        m = m.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
        m = m.filter(ImageFilter.GaussianBlur(1.2))

        bbox = m.getbbox()
        if not bbox:
            report[zid] = None
            print(f"!! {zid}: EMPTY MASK", file=sys.stderr)
            continue

        # Centroid of mask weight
        sx = sy = n = 0
        lp = m.load()
        for y in range(bbox[1], bbox[3], 2):
            for x in range(bbox[0], bbox[2], 2):
                v = lp[x, y]
                if v > 128:
                    sx += x
                    sy += y
                    n += 1
        cx, cy = (sx / n, sy / n) if n else ((bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2)

        out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        acid = Image.new("RGBA", (W, H), (*ACID, 255))
        # Alpha = mask scaled to a soft shade (max ~150/255)
        alpha = m.point(lambda v: int(v * 0.59))
        out = Image.composite(acid, out, alpha)
        out.putalpha(alpha)
        half = out.resize((W // 2, H // 2), Image.LANCZOS)
        half.save(f"{outdir}/{zid}.png", optimize=True)

        report[zid] = {
            "x": round(cx / W * 100, 1),
            "y": round(cy / H * 100, 1),
            "w": round((bbox[2] - bbox[0]) / W * 100, 1),
            "h": round((bbox[3] - bbox[1]) / H * 100, 1),
            "px": n * 4,
        }

    print(json.dumps(report, indent=1))


if __name__ == "__main__":
    main()
