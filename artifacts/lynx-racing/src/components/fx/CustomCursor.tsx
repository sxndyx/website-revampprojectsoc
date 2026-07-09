import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const INTERACTIVE = "a,button,[role=button],input,textarea,select,label,[data-cursor]";

/**
 * Desktop-only custom cursor: an acid dot with a trailing ring that grows over
 * interactive elements. Returns null (native cursor) on touch/coarse pointers
 * and under reduced-motion.
 */
export function CustomCursor() {
  const reduced = useReducedMotion();
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );
  const [active, setActive] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 28, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 350, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (!enabled || reduced) return;
    document.documentElement.classList.add("has-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      setActive(!!t && !!t.closest(INTERACTIVE));
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", dn);
    window.addEventListener("mouseup", up);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", dn);
      window.removeEventListener("mouseup", up);
    };
  }, [enabled, reduced, x, y]);

  if (!enabled || reduced) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-acid"
        style={{ x, y }}
        animate={{ scale: down ? 0.6 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] -ml-3.5 -mt-3.5 h-7 w-7 rounded-full border border-acid/60"
        style={{ x: rx, y: ry }}
        animate={{
          scale: active ? 1.7 : 1,
          opacity: active ? 1 : 0.5,
          backgroundColor: active ? "rgba(166,255,62,0.06)" : "rgba(166,255,62,0)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      />
    </>
  );
}
