import * as THREE from "three";

/**
 * Procedural canvas textures for the circuit world. Everything is generated at
 * runtime so the night-venue diorama ships zero image assets. Each factory is
 * called once per scene mount (memoised by callers).
 */

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return { c, g: c.getContext("2d")! };
}

function toTexture(c: HTMLCanvasElement, repeat = false): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Floodlit night grass: mowing stripes + speckle, vignetted to page-black. */
export function grassTexture(): THREE.CanvasTexture {
  const { c, g } = canvas(1024, 1024);
  g.fillStyle = "#0b2416";
  g.fillRect(0, 0, 1024, 1024);

  // Mowing stripes
  g.save();
  g.translate(512, 512);
  g.rotate(Math.PI / 7);
  for (let i = -14; i < 14; i++) {
    g.fillStyle = i % 2 ? "rgba(30,74,44,0.5)" : "rgba(10,30,18,0.55)";
    g.fillRect(-900, i * 64, 1800, 64);
  }
  g.restore();

  // Speckle noise so the green never reads flat
  for (let i = 0; i < 2600; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const a = Math.random() * 0.05;
    g.fillStyle = Math.random() > 0.5 ? `rgba(180,255,140,${a})` : `rgba(0,0,0,${a * 1.6})`;
    g.fillRect(x, y, 2, 2);
  }

  // Radial vignette out to the site's carbon black
  const v = g.createRadialGradient(512, 512, 240, 512, 512, 512);
  v.addColorStop(0, "rgba(6,6,7,0)");
  v.addColorStop(0.72, "rgba(6,6,7,0.42)");
  v.addColorStop(1, "rgba(6,6,7,1)");
  g.fillStyle = v;
  g.fillRect(0, 0, 1024, 1024);

  return toTexture(c);
}

/** Classic red/white kerb stripes, repeated along the ribbon's V axis. */
export function kerbTexture(): THREE.CanvasTexture {
  const { c, g } = canvas(32, 128);
  g.fillStyle = "#c3372b";
  g.fillRect(0, 0, 32, 128);
  g.fillStyle = "#ddd8cc";
  g.fillRect(0, 0, 32, 64);
  const t = toTexture(c, true);
  return t;
}

/** Start/finish checkerboard. */
export function checkerTexture(): THREE.CanvasTexture {
  const { c, g } = canvas(128, 32);
  const s = 16;
  for (let x = 0; x < 8; x++)
    for (let y = 0; y < 2; y++) {
      g.fillStyle = (x + y) % 2 ? "#dcdcd4" : "#0a0a0c";
      g.fillRect(x * s, y * s, s, s);
    }
  return toTexture(c);
}

/** Soft radial glow (light pools, headlights, smoke particles). */
export function glowTexture(): THREE.CanvasTexture {
  const { c, g } = canvas(256, 256);
  const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  r.addColorStop(0, "rgba(255,255,255,0.9)");
  r.addColorStop(0.35, "rgba(255,255,255,0.32)");
  r.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 256, 256);
  return toTexture(c);
}

export interface SignOptions {
  /** Dimmed "coming soon" treatment. */
  dim?: boolean;
  accent?: string;
}

/** HUD-style venue sign: title + small mono subtitle on a glass chip. */
export function signTexture(title: string, subtitle: string, opts: SignOptions = {}): THREE.CanvasTexture {
  const { dim = false, accent = "#a6ff3e" } = opts;
  const { c, g } = canvas(512, 168);

  g.fillStyle = dim ? "rgba(8,8,11,0.92)" : "rgba(10,10,14,0.9)";
  g.fillRect(0, 0, 512, 168);
  g.strokeStyle = dim ? "rgba(155,77,255,0.28)" : "rgba(245,245,242,0.22)";
  g.lineWidth = 3;
  g.strokeRect(4, 4, 504, 160);
  // Corner ticks
  g.strokeStyle = dim ? "rgba(155,77,255,0.5)" : accent;
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(4, 26); g.lineTo(4, 4); g.lineTo(26, 4);
  g.moveTo(486, 164); g.lineTo(508, 164); g.lineTo(508, 142);
  g.stroke();

  g.textAlign = "center";
  g.fillStyle = dim ? "rgba(245,245,242,0.38)" : "#f5f5f2";
  g.font = "700 52px 'Space Grotesk', sans-serif";
  g.fillText(title.toUpperCase(), 256, 78);
  g.fillStyle = dim ? "rgba(155,77,255,0.75)" : accent;
  g.font = "500 26px 'JetBrains Mono', monospace";
  const spaced = subtitle.toUpperCase().split("").join(" ");
  g.fillText(spaced, 256, 128);

  return toTexture(c);
}

/** Jumbotron screen face. */
export function screenTexture(): THREE.CanvasTexture {
  const { c, g } = canvas(512, 288);
  g.fillStyle = "#07070a";
  g.fillRect(0, 0, 512, 288);
  // Scan bands
  for (let y = 0; y < 288; y += 6) {
    g.fillStyle = "rgba(155,77,255,0.05)";
    g.fillRect(0, y, 512, 2);
  }
  g.textAlign = "center";
  g.fillStyle = "#a6ff3e";
  g.font = "700 84px 'Space Grotesk', sans-serif";
  g.fillText("LYNX GP", 256, 140);
  g.fillStyle = "rgba(245,245,242,0.75)";
  g.font = "500 30px 'JetBrains Mono', monospace";
  g.fillText("NIGHT RACE · CONCEPT", 256, 200);
  g.fillStyle = "rgba(155,77,255,0.9)";
  g.fillRect(96, 232, 320, 5);
  return toTexture(c);
}

/** Grandstand fascia banner strip. */
export function bannerTexture(): THREE.CanvasTexture {
  const { c, g } = canvas(1024, 64);
  g.fillStyle = "#0c0c11";
  g.fillRect(0, 0, 1024, 64);
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "700 30px 'JetBrains Mono', monospace";
  g.fillStyle = "#a6ff3e";
  g.fillText("LYNX RACING", 170, 34);
  g.fillStyle = "rgba(245,245,242,0.55)";
  g.fillText("MOTOSTUDENT ELECTRIC", 512, 34);
  g.fillStyle = "#9b4dff";
  g.fillText("UNSW SYDNEY", 856, 34);
  const t = toTexture(c, true);
  return t;
}
