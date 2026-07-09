---
name: Lynx Racing design & content rules
description: Durable product/content constraints and the 2D bike-inspection zoom math for the Lynx Racing artifact.
---

# Lynx Racing — durable rules

## The bike does not exist yet — keep everything "concept / prototype"
Every page must frame the bike as a concept/prototype in active development for MotoStudent (MotorLand Aragón). Never present fabricated sponsors, team members, or finalized specs as if real.
**Why:** it is a UNSW student concept; overselling a non-existent product is dishonest and the user cares strongly about this. Fake sponsors/team/specs were stripped out once already — do not reintroduce them.
**How to apply:** sponsor tiers show "open slot" placeholders (no logos); team/join recruit into real departments (no named people); spec rows read as targets/"in development", not achievements.

## Palette discipline
Near-black base; off-white ink; acid green (#A6FF3E) is the single sparing accent; electric purple is atmospheric only. Never saturate green + purple together; red is reserved for errors.
**Why:** the premium-showroom look depends on restraint — mixing saturated green + purple cheapens it.

## Bike inspection is 2D (no 3D / WebGL)
The bike is a static side render (`public/renders/side-*.webp`) with absolutely-positioned percentage hotspots; selecting one CSS-zooms/pans a scaled wrapper so that hotspot lands at stage center. There is no React Three Fiber anymore.
**Why:** simpler, dependency-free, renders in headless screenshots, and fully art-directable.
**How to apply — zoom-coverage constraint:** the scaled wrapper must always cover the 16:9 stage, or an edge shows empty background. For scale `s` and a hotspot coord `c` (x or y, in %), coverage holds only if `s >= 0.5 / (0.5 - |c-50|/100)`. Current `s = 2.5` safely supports coords within ~[20, 80]. Push a hotspot nearer an edge and you must raise `s`, or the stage will show a gap.
