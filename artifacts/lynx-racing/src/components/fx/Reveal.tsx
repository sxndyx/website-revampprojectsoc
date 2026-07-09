import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT_STRONG } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  /** Animate when scrolled into view instead of immediately on mount. */
  onView?: boolean;
  amount?: number;
}

/**
 * Entrance wrapper. Slides up + fades on a strong decelerating ease; collapses
 * to a plain fade (no travel) when the user prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  duration = 0.7,
  onView = false,
  amount = 0.35,
}: RevealProps) {
  const reduced = useReducedMotion();
  const from = reduced ? { opacity: 0 } : { opacity: 0, y };
  const to = { opacity: 1, y: 0 };
  const transition = {
    duration: reduced ? 0.3 : duration,
    ease: EASE_OUT_STRONG,
    delay: reduced ? 0 : delay,
  };

  if (onView) {
    return (
      <motion.div
        className={className}
        initial={from}
        whileInView={to}
        viewport={{ once: true, amount }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div className={className} initial={from} animate={to} transition={transition}>
      {children}
    </motion.div>
  );
}
