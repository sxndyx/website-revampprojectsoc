import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BootSequence } from "./BootSequence";
import { TitleScreen } from "./TitleScreen";

/**
 * App-entry intro gate. Overlays the whole site with a boot sequence that
 * crossfades into a title-screen main menu. Lives inside the router so its menu
 * can navigate. Mounts once per full page load (not persisted across reloads).
 */

type Phase = "boot" | "title" | "done";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function IntroSequence() {
  const navigate = useNavigate();
  const reduced = prefersReducedMotion();
  // Reduced motion skips the timed boot animation and lands on the menu.
  const [phase, setPhase] = useState<Phase>(() => (reduced ? "title" : "boot"));
  const overlayRef = useRef<HTMLDivElement>(null);

  const active = phase !== "done";

  // While the intro is on screen: lock page scroll and make the rest of the
  // page inert (not focusable / hidden from assistive tech), so the overlay's
  // aria-modal semantics actually hold. Everything is restored on dismiss.
  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const node = overlayRef.current;
    const parent = node?.parentElement ?? null;
    const siblings = parent
      ? (Array.from(parent.children).filter((c) => c !== node) as HTMLElement[])
      : [];
    siblings.forEach((el) => {
      el.setAttribute("inert", "");
      el.setAttribute("aria-hidden", "true");
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      siblings.forEach((el) => {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      });
    };
  }, [active]);

  // Stable identities so BootSequence's timers aren't reset by re-renders.
  const handleBootComplete = useCallback(() => setPhase("title"), []);
  const handleNavigate = useCallback(
    (to: string) => {
      navigate(to);
      setPhase("done");
    },
    [navigate],
  );

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="intro"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Lynx Racing intro"
          className="fixed inset-0 z-[100] overflow-hidden bg-[#05070d]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.5, ease: "easeInOut" }}
        >
          {/* Constant textured backdrop shared by both phases */}
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.05]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/5 blur-[140px]" />

          <AnimatePresence>
            {phase === "boot" ? (
              <motion.div
                key="boot"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <BootSequence onComplete={handleBootComplete} />
              </motion.div>
            ) : (
              <motion.div
                key="title"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <TitleScreen onNavigate={handleNavigate} reduced={reduced} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
