---
name: Lynx brand logo assets
description: Which Lynx logo asset to use — full lockup vs head-only mark
---

- `attached_assets/lynx-logo.png` is the FULL brand lockup: the lime lynx head **plus** the words "LYNX RACING" baked into the image, all lime-green, on a transparent background. At small sizes (e.g. the site header ~h-8) the baked text is illegible, so the header pairs this image with its own separate text wordmark.
- `attached_assets/lynx-mark.png` is the **head-only** mark, cropped from lynx-logo.png (top ~70%, then trimmed), transparent background. Use it when you need the mark with a separately-styled / differently-coloured wordmark.

**Why:** using lynx-logo.png at a large size shows the lime baked-in "LYNX RACING" text, which conflicts with any "light wordmark" or custom-font (e.g. Orbitron) requirement.

**How to apply:** for a lockup where the wordmark must be a real, restylable text element (like the intro title screen — lime mark + light Orbitron wordmark), use `lynx-mark.png` for the icon and render the wordmark as text. Only use `lynx-logo.png` where the whole lime lockup (with its baked text) is acceptable.
