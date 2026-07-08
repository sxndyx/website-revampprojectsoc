import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import lynxMark from "@assets/lynx-mark.png";

/**
 * Boot / loading sequence: a small pulsing Lynx mark above a status line that
 * crossfades through several telemetry-flavoured messages, paired with a thin
 * progress bar filling 0 -> 100% across the total boot duration.
 */

const STATUS_LINES = [
  "Initializing Systems",
  "Calibrating Telemetry",
  "Loading Chassis Data",
  "Syncing Battery State",
  "Systems Ready",
];

const STEP_MS = 820; // each line visible ~700-900ms
const TOTAL_MS = STATUS_LINES.length * STEP_MS;

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    STATUS_LINES.forEach((_, i) => {
      if (i === 0) return; // first line is already shown
      timers.push(window.setTimeout(() => setIndex(i), i * STEP_MS));
    });
    timers.push(window.setTimeout(onComplete, TOTAL_MS));
    return () => timers.forEach((t) => clearTimeout(t));
  }, [onComplete]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6">
      {/* Pulsing Lynx mark */}
      <img
        src={lynxMark}
        alt=""
        aria-hidden="true"
        className="h-16 w-auto object-contain animate-pulse-glow md:h-20"
      />

      {/* Crossfading status line */}
      <div
        className="relative flex h-7 w-full items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <AnimatePresence>
          <motion.p
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center px-4 text-center font-rajdhani text-xs font-medium uppercase tracking-[0.35em] text-primary/90 sm:text-sm"
          >
            {STATUS_LINES[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] w-56 overflow-hidden rounded-full bg-border/60 md:w-64">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: TOTAL_MS / 1000, ease: "linear" }}
        />
      </div>
    </div>
  );
}
