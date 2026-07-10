#!/usr/bin/env python3
"""
Connected-component cleanup for zone masks: keep only components whose area is
>= 20% of the largest component (drops stray recolour-drift blobs), then
re-emit the mask and an updated centroid/bbox report.

Usage: python3 cc_filter.py <zones_dir> <out_report.json> zoneid [zoneid ...]
"""
import json
import sys
from collections import deque

from PIL import Image

DS = 4  # label on a 4x-downsampled grid; plenty for blob-vs-panel decisions


def components(g, w, h):
    seen = [[False] * w for _ in range(h)]
    comps = []
    for y0 in range(h):
        for x0 in range(w):
            if g[y0][x0] and not seen[y0][x0]:
                q = deque([(x0, y0)])
                seen[y0][x0] = True
                cells = []
                while q:
                    x, y = q.popleft()
                    cells.append((x, y))
                    for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1),(x+1,y+1),(x-1,y-1),(x+1,y-1),(x-1,y+1)):
                        if 0 <= nx < w and 0 <= ny < h and g[ny][nx] and not seen[ny][nx]:
                            seen[ny][nx] = True
                            q.append((nx, ny))
                comps.append(cells)
    return comps


def main():
    zdir, out_p = sys.argv[1], sys.argv[2]
    report = {}
    for zid in sys.argv[3:]:
        p = f"{zdir}/{zid}.png"
        im = Image.open(p).convert("RGBA")
        W, H = im.size
        a = im.split()[3]
        small = a.resize((W // DS, H // DS), Image.BILINEAR)
        sw, sh = small.size
        sp = small.load()
        g = [[1 if sp[x, y] > 60 else 0 for x in range(sw)] for y in range(sh)]

        comps = components(g, sw, sh)
        if not comps:
            report[zid] = None
            print(f"!! {zid}: empty", file=sys.stderr)
            continue
        biggest = max(len(c) for c in comps)
        keep = [c for c in comps if len(c) >= 0.2 * biggest]

        keep_mask = Image.new("L", (sw, sh), 0)
        kp = keep_mask.load()
        for c in keep:
            for x, y in c:
                kp[x, y] = 255
        keep_big = keep_mask.resize((W, H), Image.BILINEAR).point(lambda v: 255 if v > 100 else 0)

        # Multiply original alpha by the keep mask
        ap = a.load()
        kbp = keep_big.load()
        for y in range(H):
            for x in range(W):
                if not kbp[x, y]:
                    ap[x, y] = 0

        im.putalpha(a)
        im.save(p, optimize=True)

        # Recompute centroid/bbox on the cleaned alpha
        bbox = a.getbbox()
        sx = sy = n = 0
        for y in range(bbox[1], bbox[3], 2):
            for x in range(bbox[0], bbox[2], 2):
                if ap[x, y] > 100:
                    sx += x; sy += y; n += 1
        cx, cy = (sx / n, sy / n) if n else ((bbox[0]+bbox[2])/2, (bbox[1]+bbox[3])/2)
        report[zid] = {
            "x": round(cx / W * 100, 1), "y": round(cy / H * 100, 1),
            "w": round((bbox[2]-bbox[0]) / W * 100, 1), "h": round((bbox[3]-bbox[1]) / H * 100, 1),
            "kept": len(keep), "dropped": len(comps) - len(keep),
        }

    json.dump(report, open(out_p, "w"), indent=1)
    print(json.dumps(report, indent=1))


if __name__ == "__main__":
    main()
