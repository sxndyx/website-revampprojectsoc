import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/#*·";

interface MonoLabelProps {
  text: string;
  className?: string;
  /** Play the scramble "decode" effect on mount. */
  decode?: boolean;
  /** Seconds before the decode begins. */
  delay?: number;
}

/**
 * HUD-style mono label. On mount it briefly scrambles then "decodes" into the
 * real text. Screen readers always get the final string via aria-label; the
 * effect is skipped entirely under prefers-reduced-motion.
 */
export function MonoLabel({ text, className = "", decode = true, delay = 0 }: MonoLabelProps) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(() => (decode && !reduced ? "" : text));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!decode || reduced) {
      setDisplay(text);
      return;
    }

    const duration = Math.min(900, 240 + text.length * 42);
    let start: number | null = null;
    let stopped = false;

    const step = (ts: number) => {
      if (stopped) return;
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const revealed = Math.floor(p * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        out += i < revealed || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setDisplay(out);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(text);
      }
    };

    const timeoutId = window.setTimeout(() => {
      rafRef.current = requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      stopped = true;
      window.clearTimeout(timeoutId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, decode, reduced, delay]);

  return (
    <span className={`mono-label ${className}`} aria-label={text}>
      {display || "\u00a0"}
    </span>
  );
}
