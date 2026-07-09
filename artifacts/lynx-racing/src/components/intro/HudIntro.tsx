import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import lynxMark from "@assets/lynx-mark.png";
import { EASE_OUT_STRONG } from "@/lib/motion";

const SEEN_KEY = "lynx_intro_seen";

/**
 * Brief "INITIALISING" HUD flash on the first load of a browsing session only.
 * Skippable by click, session-gated via sessionStorage so returning feels
 * instant, and reduced to a near-instant fade under prefers-reduced-motion.
 */
export function HudIntro() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    // Allow deep links / shared URLs (and automated captures) to bypass the
    // boot animation with ?nointro.
    if (new URLSearchParams(window.location.search).has("nointro")) return false;
    try {
      return !sessionStorage.getItem(SEEN_KEY);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => setShow(false), reduced ? 350 : 1200);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [show, reduced]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-base"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => setShow(false)}
          role="status"
          aria-label="Initialising"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 carbon-weave opacity-60" />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 bloom-violet-soft"
          />
          <motion.img
            src={lynxMark}
            alt="Lynx Racing"
            className="relative h-16 w-auto object-contain"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT_STRONG }}
          />
          <div className="relative mt-6 mono-label-lg text-ink">
            LYNX RACING <span className="text-ink-dim">//</span>{" "}
            <span className="text-acid">INITIALISING</span>
          </div>
          <div className="relative mt-5 h-px w-56 overflow-hidden bg-hairline">
            <motion.div
              className="h-full bg-acid"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: reduced ? 0.3 : 1.0, ease: "easeInOut" }}
            />
          </div>
          <div className="relative mt-4 mono-label text-white/40">Click to skip</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
