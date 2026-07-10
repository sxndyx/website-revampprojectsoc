import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { ENGINEERING_MODULES } from "@/data/engineering";
import { Schematic } from "@/components/engineering/Schematic";
import { MonoLabel } from "@/components/fx/MonoLabel";
import { EASE_OUT_STRONG } from "@/lib/motion";

interface ModuleViewProps {
  /** Index into ENGINEERING_MODULES, or null when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}

/**
 * Full-screen module inspector for the engineering lab. Arrow keys move
 * between modules, Escape closes, focus is moved in on open and restored by
 * the caller on close.
 */
export function ModuleView({ index, onClose, onNavigate }: ModuleViewProps) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const mod = open ? ENGINEERING_MODULES[index] : null;

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        onNavigate(((index as number) + 1) % ENGINEERING_MODULES.length);
      if (e.key === "ArrowLeft")
        onNavigate(((index as number) - 1 + ENGINEERING_MODULES.length) % ENGINEERING_MODULES.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, index, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {open && mod && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.15 : 0.3 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${mod.name} — engineering module`}
        >
          {/* Backdrop */}
          <button
            aria-label="Close module"
            onClick={onClose}
            className="absolute inset-0 cursor-pointer bg-[#060607]/80 backdrop-blur-sm"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 32, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.99 }}
            transition={{ duration: reduced ? 0.15 : 0.45, ease: EASE_OUT_STRONG }}
            className="glass-strong relative flex max-h-full w-full max-w-5xl flex-col overflow-y-auto outline-none"
          >
            {/* HUD frame corners */}
            <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-5 w-5 border-l border-t border-acid/50" />
            <span aria-hidden className="pointer-events-none absolute right-0 top-0 h-5 w-5 border-r border-t border-acid/50" />
            <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-5 w-5 border-b border-l border-acid/50" />
            <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-5 w-5 border-b border-r border-acid/50" />

            <div className="flex items-center justify-between border-b border-hairline px-6 py-4 md:px-10">
              <MonoLabel text={`LAB MODULE // ${mod.code} — ${mod.name}`} className="text-acid" decode={false} />
              <button
                onClick={onClose}
                aria-label="Close (Esc)"
                className="flex h-9 w-9 items-center justify-center border border-hairline text-ink-dim transition-colors hover:border-acid/60 hover:text-acid"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-8 px-6 py-8 md:grid-cols-[1fr_1.2fr] md:gap-12 md:px-10 md:py-10">
              {/* Schematic side */}
              <div className="relative flex items-center justify-center border border-hairline bg-[#0a0a0d]/60 p-6">
                <div aria-hidden className="pointer-events-none absolute inset-0 hairline-grid opacity-40" />
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bloom-violet-soft"
                />
                <Schematic id={mod.schematic} className="relative w-full max-w-sm" key={mod.id} />
                <span className="mono-label absolute bottom-3 left-4 text-ink-dim">FIG. {mod.code}</span>
                <span className="mono-label absolute right-4 top-3 text-ink-dim">SCHEMATIC</span>
              </div>

              {/* Copy side */}
              <div>
                <h2 className="font-display text-4xl font-bold uppercase leading-none tracking-tight md:text-5xl">
                  {mod.name}
                </h2>
                <p className="mt-3 text-ink-dim">{mod.tag}</p>

                <dl className="mt-7 divide-y divide-hairline border-y border-hairline">
                  {mod.facts.map((f) => (
                    <div key={f.k} className="flex items-baseline justify-between gap-6 py-2.5">
                      <dt className="mono-label text-ink-dim">{f.k}</dt>
                      <dd className="mono-label text-right text-ink">{f.v}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-7 leading-relaxed text-ink-dim">{mod.body}</p>
                <p className="mt-4 border-l-2 border-acid/40 pl-4 text-sm text-ink-dim">{mod.toolchain}</p>

                <Link
                  to="/the-bike"
                  className="group mt-8 inline-flex items-center gap-2 mono-label-lg text-acid transition-colors hover:text-ink"
                >
                  See it on the prototype
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-hairline px-6 py-4 md:px-10">
              <button
                onClick={() => onNavigate(((index as number) - 1 + ENGINEERING_MODULES.length) % ENGINEERING_MODULES.length)}
                className="inline-flex items-center gap-2 mono-label text-ink-dim transition-colors hover:text-acid"
              >
                <ArrowLeft size={13} /> Prev
              </button>
              <span className="mono-label hidden text-ink-dim sm:block">← → NAVIGATE · ESC CLOSE</span>
              <button
                onClick={() => onNavigate(((index as number) + 1) % ENGINEERING_MODULES.length)}
                className="inline-flex items-center gap-2 mono-label text-ink-dim transition-colors hover:text-acid"
              >
                Next <ArrowRight size={13} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
