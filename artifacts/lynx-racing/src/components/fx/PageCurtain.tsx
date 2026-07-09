import { motion } from "framer-motion";
import { EASE_OUT_STRONG } from "@/lib/motion";

export type CurtainStage = "idle" | "cover" | "reveal";

interface PageCurtainProps {
  stage: CurtainStage;
  onCovered?: () => void;
  onRevealed?: () => void;
}

const COVER = 0.26;
const REVEAL = 0.34;

/**
 * Cinematic page-transition curtain: two carbon panels close to centre (cover),
 * the route swaps behind them, then they open again (reveal) while a thin acid
 * scanline sweeps across. Driven by the AnimatedRoutes state machine in App.
 */
export function PageCurtain({ stage, onCovered, onRevealed }: PageCurtainProps) {
  const target = stage === "cover" ? 1 : 0;
  const duration = stage === "cover" ? COVER : REVEAL;
  const show = stage !== "idle";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80]"
      style={{ visibility: show ? "visible" : "hidden" }}
    >
      <motion.div
        className="absolute inset-y-0 left-0 w-[51%] origin-left bg-[#0a0a0d] carbon-weave"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: target }}
        transition={{ duration, ease: EASE_OUT_STRONG }}
        onAnimationComplete={() => {
          if (stage === "cover") onCovered?.();
          else if (stage === "reveal") onRevealed?.();
        }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-[51%] origin-right bg-[#0a0a0d] carbon-weave"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: target }}
        transition={{ duration, ease: EASE_OUT_STRONG }}
      />
      {show && (
        <motion.div
          key={stage}
          className="absolute inset-y-0 w-px bg-acid shadow-[0_0_20px_2px_rgba(166,255,62,0.7)]"
          initial={{ left: "-2%" }}
          animate={{ left: "102%" }}
          transition={{ duration: COVER + REVEAL, ease: "linear" }}
        />
      )}
    </div>
  );
}
