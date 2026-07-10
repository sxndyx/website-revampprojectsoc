#!/usr/bin/env python3
"""
Apply mask-extraction reports to sponsors.ts:
 - update each zone's region {x, y, w, h} to the mask centroid/bbox
 - strip the now-dead `outline` field (interface + data)

Usage: python3 apply_zone_report.py <report.json> [<report2.json> ...]
"""
import json
import re
import sys

DATA = "src/data/sponsors.ts"

report = {}
for p in sys.argv[1:]:
    report.update({k: v for k, v in json.load(open(p)).items() if v})

s = open(DATA).read()

# 1) Update regions from mask centroids/bboxes (labels sit near the centroid).
for zid, r in report.items():
    pat = re.compile(r'(id: "' + zid + r'",.*?region: \{ x: )[0-9.]+(, y: )[0-9.]+(, w: )[0-9.]+(, h: )[0-9.]+', re.S)
    s = pat.sub(lambda m: f"{m.group(1)}{r['x']}{m.group(2)}{r['y']}{m.group(3)}{r['w']}{m.group(4)}{r['h']}", s)

# 2) Remove outline entries from data.
s = re.sub(r'\n\s*outline:\s*\n?\s*"[^"]*",', "", s)

# 3) Remove the interface field + its doc comment.
s = re.sub(
    r"\n  /\*\*\n(?:   \*[^\n]*\n)*   \*/\n  outline: string;",
    "",
    s,
)

open(DATA, "w").write(s)
print("regions updated:", ", ".join(sorted(report)))
