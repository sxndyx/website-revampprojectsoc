import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { ALL_NAV } from "@/data/nav";
import { EASE_OUT_STRONG } from "@/lib/motion";

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
}

/** Full-screen destination index — doubles as the mobile menu. */
export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus management: on open, remember the opener and move focus to the close
  // control; on close, restore focus to the opener. Keyed off `open` only so
  // parent re-renders never steal focus.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    return () => opener?.focus?.({ preventScroll: true });
  }, [open]);

  // Escape to close, Tab trapped within the overlay, background scroll locked.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          className="fixed inset-0 z-[70] glass-strong"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div aria-hidden className="pointer-events-none absolute -right-40 top-1/4 h-[42rem] w-[42rem] bloom-violet-soft" />
          <div aria-hidden className="pointer-events-none absolute inset-0 carbon-weave opacity-60" />

          <div className="relative mx-auto flex h-full max-w-[1600px] flex-col px-5 lg:px-10">
            <div className="flex h-16 items-center justify-between">
              <span className="mono-label text-ink-dim">Index — 09 Destinations</span>
              <button
                ref={closeRef}
                onClick={onClose}
                className="inline-flex items-center gap-2 border border-hairline bg-surface/60 px-3.5 py-2 mono-label text-ink transition-colors hover:border-acid/50 hover:text-acid"
                aria-label="Close menu"
              >
                <X size={14} aria-hidden /> Close
              </button>
            </div>

            <nav
              className="flex flex-1 flex-col justify-center overflow-y-auto py-8"
              aria-label="All pages"
              onMouseLeave={() => setHovered(null)}
            >
              {ALL_NAV.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: EASE_OUT_STRONG, delay: 0.06 + i * 0.04 }}
                >
                  <Link
                    to={item.to}
                    onClick={onClose}
                    onMouseEnter={() => setHovered(i)}
                    className="group flex items-baseline gap-4 border-b border-hairline py-3 md:py-3.5"
                    style={{
                      opacity: hovered === null || hovered === i ? 1 : 0.32,
                      transition: "opacity 0.25s ease",
                    }}
                  >
                    <span className="mono-label w-8 shrink-0 text-ink-dim group-hover:text-acid">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-3xl font-bold uppercase leading-none tracking-tight text-ink transition-colors group-hover:text-acid sm:text-4xl md:text-5xl">
                      {item.label}
                    </span>
                    <span className="ml-auto hidden max-w-xs text-right text-sm text-ink-dim md:block">
                      {item.desc}
                    </span>
                    <ArrowUpRight
                      className="hidden shrink-0 text-ink-dim transition-colors group-hover:text-acid md:block"
                      size={20}
                      aria-hidden
                    />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="flex h-16 items-center justify-between">
              <span className="mono-label text-ink-dim">UNSW · Sydney</span>
              <span className="mono-label text-ink-dim">-33.9173 / 151.2313</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
