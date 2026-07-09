import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { BIKE_SYSTEMS } from "@/data/systems";
import { ConceptCaption } from "@/components/fx/ConceptCaption";
import { EASE_OUT_STRONG } from "@/lib/motion";

const BASE = import.meta.env.BASE_URL;
const SIDE_SRCSET = `${BASE}renders/side-960.webp 960w, ${BASE}renders/side-1440.webp 1440w, ${BASE}renders/side-2560.webp 2560w`;
const ZOOM = 2.5;
const N = BIKE_SYSTEMS.length;

export function InspectionStage() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const sys = active === null ? null : BIKE_SYSTEMS[active];

  // Keyboard: arrows cycle systems, Escape exits. Bound once via functional updates.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActive(null);
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        setActive((cur) => {
          if (cur === null) return e.key === "ArrowRight" ? 0 : N - 1;
          return e.key === "ArrowRight" ? (cur + 1) % N : (cur - 1 + N) % N;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Move focus to the panel's close control when a system opens.
  useEffect(() => {
    if (active !== null) closeRef.current?.focus({ preventScroll: true });
  }, [active]);

  const select = (i: number) => {
    setActive(i);
    stageRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  };

  const wrapperTarget =
    sys === null
      ? { scale: 1, x: "0%", y: "0%" }
      : {
          scale: ZOOM,
          x: `${-ZOOM * (sys.hotspot.x - 50)}%`,
          y: `${-ZOOM * (sys.hotspot.y - 50)}%`,
        };

  return (
    <div>
      {/* Stage */}
      <div
        ref={stageRef}
        className="relative mx-auto aspect-[16/9] w-full max-w-6xl overflow-hidden border border-hairline bg-[#0a0a0d]"
      >
        {/* static backdrop */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hairline-grid opacity-40" />
        <div aria-hidden className="pointer-events-none absolute inset-0 carbon-weave" />

        {/* scaling wrapper: bike + hotspots */}
        <motion.div
          className="absolute inset-0"
          animate={wrapperTarget}
          transition={{ duration: reduced ? 0 : 0.8, ease: EASE_OUT_STRONG }}
        >
          <img
            src={`${BASE}renders/side-1440.webp`}
            srcSet={SIDE_SRCSET}
            sizes="(max-width: 1152px) 100vw, 1152px"
            width={2560}
            height={1440}
            alt="Lynx Racing concept electric superbike, master side profile"
            loading="lazy"
            decoding="async"
            className="h-full w-full select-none object-cover"
            draggable={false}
          />

          {/* hotspots — visible only when nothing is selected */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              opacity: active === null ? 1 : 0,
              pointerEvents: active === null ? "auto" : "none",
            }}
          >
            {BIKE_SYSTEMS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => select(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                aria-label={`Inspect ${s.name}`}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${s.hotspot.x}%`, top: `${s.hotspot.y}%` }}
              >
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span
                    aria-hidden
                    className="absolute h-4 w-4 rounded-full border border-acid/70 animate-pulse-dot"
                  />
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-acid" />
                </span>
                <span
                  className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap border border-hairline bg-base/90 px-2 py-1 mono-label text-ink transition-opacity"
                  style={{ opacity: hovered === i ? 1 : 0 }}
                >
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* scanline sweep */}
        {!reduced && (
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-acid/10 to-transparent animate-scanline" />
        )}

        {/* vignette — dims everything but the focused region; click to exit */}
        <AnimatePresence>
          {sys && (
            <motion.button
              type="button"
              aria-label="Close inspection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setActive(null)}
              className="absolute inset-0 cursor-default"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(6,6,7,0) 16%, rgba(6,6,7,0.82) 62%)",
              }}
            />
          )}
        </AnimatePresence>

        {/* centre reticle over the focused region */}
        <AnimatePresence>{sys && <Reticle key="reticle" />}</AnimatePresence>

        {/* callout line to the panel (desktop) */}
        <AnimatePresence>
          {sys && (
            <motion.div
              key="line"
              aria-hidden
              className="absolute left-1/2 top-1/2 hidden h-px origin-left bg-acid/60 md:block"
              style={{ right: "384px" }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT_STRONG, delay: 0.15 }}
            />
          )}
        </AnimatePresence>

        {/* detail panel */}
        <AnimatePresence>
          {sys && (
            <motion.section
              key="panel"
              aria-label={`${sys.name} details`}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.5, ease: EASE_OUT_STRONG }}
              className="glass-strong absolute inset-x-3 bottom-3 border border-hairline p-5 md:inset-x-auto md:bottom-auto md:right-6 md:top-1/2 md:w-[360px] md:-translate-y-1/2"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="mono-label text-ink-dim">
                    {String((active ?? 0) + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-none">
                    {sys.name}
                  </h3>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setActive(null)}
                  aria-label="Close inspection"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-hairline text-ink-dim transition-colors hover:border-acid/50 hover:text-acid"
                >
                  <X size={15} aria-hidden />
                </button>
              </div>

              <span className="mt-3 inline-flex items-center gap-2 border border-acid/30 bg-acid/5 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-acid" aria-hidden />
                <span className="mono-label text-acid">In Development</span>
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={sys.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <dl className="mt-4 space-y-2 border-t border-hairline pt-4">
                    {sys.specs
                      .filter((sp) => sp.k !== "Status")
                      .map((sp) => (
                        <div key={sp.k} className="flex items-center justify-between gap-4">
                          <dt className="mono-label text-ink-dim">{sp.k}</dt>
                          <dd className="mono-label text-ink">{sp.v}</dd>
                        </div>
                      ))}
                  </dl>

                  <p className="mt-4 text-sm font-medium text-acid">{sys.objective}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-dim">{sys.detail}</p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4">
                <button
                  type="button"
                  onClick={() => setActive((cur) => ((cur ?? 0) - 1 + N) % N)}
                  className="inline-flex items-center gap-1.5 mono-label text-ink-dim transition-colors hover:text-acid"
                  aria-label="Previous system"
                >
                  <ChevronLeft size={14} aria-hidden /> Prev
                </button>
                <ConceptCaption />
                <button
                  type="button"
                  onClick={() => setActive((cur) => ((cur ?? 0) + 1) % N)}
                  className="inline-flex items-center gap-1.5 mono-label text-ink-dim transition-colors hover:text-acid"
                  aria-label="Next system"
                >
                  Next <ChevronRight size={14} aria-hidden />
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* corner HUD readouts */}
        <div aria-hidden className="pointer-events-none absolute left-3 top-3 mono-label text-ink-dim">
          SIDE PROFILE // PROTO-01
        </div>
        <div aria-hidden className="pointer-events-none absolute right-3 top-3 mono-label text-ink-dim">
          {active === null ? "SCAN: STANDBY" : "SCAN: LOCKED"}
        </div>
        {active === null && (
          <div className="pointer-events-none absolute bottom-3 left-3">
            <ConceptCaption />
          </div>
        )}
      </div>

      {/* System index — discoverable, mobile-friendly, keyboard-accessible */}
      <div className="mx-auto mt-4 grid max-w-6xl grid-cols-2 gap-2 sm:grid-cols-4">
        {BIKE_SYSTEMS.map((s, i) => {
          const isActive = active === i;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => select(i)}
              aria-pressed={isActive}
              className={`group flex items-center gap-3 border p-3 text-left transition-colors ${
                isActive
                  ? "border-acid/60 bg-acid/5"
                  : "border-hairline bg-surface/40 hover:border-acid/40"
              }`}
            >
              <span className={`mono-label ${isActive ? "text-acid" : "text-ink-dim"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`text-sm font-medium ${isActive ? "text-ink" : "text-ink-dim group-hover:text-ink"}`}>
                {s.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Reticle() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      initial={{ opacity: 0, scale: 1.3 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT_STRONG }}
    >
      <div className="relative h-28 w-28">
        {/* corner brackets */}
        <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-acid/80" />
        <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-acid/80" />
        <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-acid/80" />
        <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-acid/80" />
        {/* pulsing ring */}
        <span className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-acid/60 animate-pulse-dot" />
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-acid" />
      </div>
    </motion.div>
  );
}
