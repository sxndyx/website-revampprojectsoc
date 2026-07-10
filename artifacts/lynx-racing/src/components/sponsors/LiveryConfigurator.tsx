import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  EXPOSURE_ROWS,
  TIER_ORDER,
  TIERS,
  enquireHref,
  zonesForMode,
  type LiveryZone,
  type Mode,
  type Tier,
} from "@/data/sponsors";
import { EASE_OUT_STRONG } from "@/lib/motion";
import { ConceptCaption } from "@/components/fx/ConceptCaption";
import { ExposureMeter } from "./ExposureMeter";
import { SupporterCard } from "./SupporterCard";

const BASE = import.meta.env.BASE_URL;
const MACHINE_SRCSET = `${BASE}renders/side-960.webp 960w, ${BASE}renders/side-1440.webp 1440w, ${BASE}renders/side-2560.webp 2560w`;
const HELMET_SRCSET = `${BASE}renders/helmet-960.webp 960w, ${BASE}renders/helmet-1440.webp 1440w, ${BASE}renders/helmet-2048.webp 2048w`;

type Filter = Tier | "ALL";
const FILTERS: Filter[] = ["ALL", ...TIER_ORDER];

export function LiveryConfigurator() {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<Mode>("machine");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const zones = useMemo(() => zonesForMode(mode), [mode]);

  // Calibration aid: /sponsors?zones renders every panel outline at once so
  // the traced paths can be checked against the render.
  const debugZones = useMemo(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("zones"),
    [],
  );

  // Zones the current filter makes interactive (SUPPORTER is off-bike → none).
  const navZones = useMemo(() => {
    if (filter === "ALL") return zones;
    if (filter === "SUPPORTER") return [];
    return zones.filter((z) => z.tier === filter);
  }, [zones, filter]);

  const eligible = useMemo(() => new Set(navZones.map((z) => z.id)), [navZones]);
  const active = activeId ? zones.find((z) => z.id === activeId) ?? null : null;
  const navIndex = active ? navZones.findIndex((z) => z.id === active.id) : -1;
  const placementCount = filter === "SUPPORTER" ? null : navZones.length;

  // Reset selection when the surface changes (zone ids differ per mode).
  useEffect(() => {
    setActiveId(null);
    setHovered(null);
  }, [mode]);

  // Keyboard: Escape closes, arrows cycle within the interactive set.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveId(null);
        return;
      }
      if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && navZones.length) {
        e.preventDefault();
        setActiveId((cur) => {
          const idx = cur ? navZones.findIndex((z) => z.id === cur) : -1;
          if (idx === -1) return e.key === "ArrowRight" ? navZones[0].id : navZones[navZones.length - 1].id;
          const step = e.key === "ArrowRight" ? 1 : -1;
          return navZones[(idx + step + navZones.length) % navZones.length].id;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navZones]);

  // Move focus into the panel when a zone opens.
  useEffect(() => {
    if (active) closeRef.current?.focus({ preventScroll: true });
  }, [active]);

  const chooseFilter = (f: Filter) => {
    setFilter(f);
    setActiveId((cur) => {
      if (!cur) return null;
      if (f === "ALL") return cur;
      if (f === "SUPPORTER") return null;
      const z = zones.find((zz) => zz.id === cur);
      return z && z.tier === f ? cur : null;
    });
  };

  const select = (z: LiveryZone) => {
    setActiveId(z.id);
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      stageRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
  };

  return (
    <div>
      {/* Controls: mode toggle + live placement count */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ModeToggle mode={mode} onChange={setMode} />
        <p className="mono-label text-ink-dim" aria-live="polite">
          {placementCount === null ? (
            <span className="text-acid">Off-bike partnership</span>
          ) : (
            <>
              <span className="text-acid">{placementCount}</span> placement{placementCount === 1 ? "" : "s"} available
            </>
          )}
        </p>
      </div>

      {/* Tier filter chips */}
      <TierChips filter={filter} onChange={chooseFilter} />

      {/* Stage + panel wrapper (relative anchors the desktop panel) */}
      <div className="relative mt-5">
        <div
          ref={stageRef}
          className="relative aspect-[16/9] w-full overflow-hidden border border-hairline bg-[#0a0a0d]"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 hairline-grid opacity-40" />
          <div aria-hidden className="pointer-events-none absolute inset-0 carbon-weave" />

          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={mode}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.45, ease: EASE_OUT_STRONG }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="relative h-full"
                  style={{ aspectRatio: mode === "helmet" ? "1 / 1" : "16 / 9" }}
                >
                  <img
                    src={mode === "helmet" ? `${BASE}renders/helmet-1440.webp` : `${BASE}renders/side-1440.webp`}
                    srcSet={mode === "helmet" ? HELMET_SRCSET : MACHINE_SRCSET}
                    sizes="(max-width: 1152px) 100vw, 1152px"
                    alt={
                      mode === "helmet"
                        ? "Lynx Racing concept rider helmet, three-quarter view"
                        : "Lynx Racing concept electric superbike, side profile"
                    }
                    className="h-full w-full select-none object-contain"
                    draggable={false}
                    decoding="async"
                  />

                  {/* focus scrim when a zone is open */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-base/50 transition-opacity duration-500"
                    style={{ opacity: active ? 1 : 0 }}
                  />

                  {/* real-panel shading masks */}
                  <ZoneShades
                    zones={zones}
                    hoveredId={hovered}
                    activeId={activeId}
                    eligible={eligible}
                    debug={debugZones}
                  />

                  {/* zone markers */}
                  {zones.map((z) => (
                    <ZoneMarker
                      key={z.id}
                      zone={z}
                      interactive={eligible.has(z.id)}
                      active={active?.id === z.id}
                      hovered={hovered === z.id}
                      dimmed={!!active && active.id !== z.id}
                      onHover={setHovered}
                      onSelect={select}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* scanline sweep */}
          {!reduced && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-acid/10 to-transparent animate-scanline"
            />
          )}

          {/* corner HUD readouts */}
          <div aria-hidden className="pointer-events-none absolute left-3 top-3 mono-label text-ink-dim">
            {mode === "helmet" ? "LIVERY // HELMET" : "LIVERY // MACHINE"}
          </div>
          <div aria-hidden className="pointer-events-none absolute right-3 top-3 mono-label text-ink-dim">
            {active ? "ZONE: LOCKED" : "ZONE: STANDBY"}
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3">
            <ConceptCaption />
          </div>
        </div>

        {/* detail panel — bottom sheet in flow on mobile, floating over the stage on desktop */}
        <AnimatePresence>
          {active && (
            <ZonePanel
              zone={active}
              index={navIndex >= 0 ? navIndex : 0}
              total={navZones.length || 1}
              reduced={!!reduced}
              closeRef={closeRef}
              onClose={() => setActiveId(null)}
              onPrev={() =>
                navZones.length &&
                setActiveId(navZones[(navIndex - 1 + navZones.length) % navZones.length].id)
              }
              onNext={() =>
                navZones.length && setActiveId(navZones[(navIndex + 1) % navZones.length].id)
              }
            />
          )}
        </AnimatePresence>
      </div>

      {/* Hint line */}
      <p className="mt-3 mono-label text-ink-dim">
        {active
          ? "Esc to close · ← → to move between placements"
          : filter === "SUPPORTER"
            ? "Supporter is an off-bike partnership — see the card below"
            : "Select a glowing marker to explore that placement"}
      </p>

      {/* Off-bike supporter tier */}
      <div className="mt-10">
        <SupporterCard emphasized={filter === "SUPPORTER"} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const items: { id: Mode; label: string }[] = [
    { id: "machine", label: "Machine" },
    { id: "helmet", label: "Helmet" },
  ];
  return (
    <div role="group" aria-label="Livery surface" className="inline-flex border border-hairline bg-surface/40 p-1">
      {items.map((it) => {
        const isActive = mode === it.id;
        return (
          <button
            key={it.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(it.id)}
            className={`relative px-6 py-2 mono-label transition-colors ${
              isActive ? "text-[#060607]" : "text-ink-dim hover:text-ink"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 bg-acid"
                transition={{ duration: 0.3, ease: EASE_OUT_STRONG }}
              />
            )}
            <span className="relative z-10">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function TierChips({ filter, onChange }: { filter: Filter; onChange: (f: Filter) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter placements by tier">
      {FILTERS.map((f) => {
        const isActive = filter === f;
        return (
          <button
            key={f}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(f)}
            className={`border px-3 py-1.5 mono-label transition-colors ${
              isActive
                ? "border-acid/60 bg-acid/10 text-acid"
                : "border-hairline text-ink-dim hover:border-acid/40 hover:text-ink"
            }`}
          >
            {f === "ALL" ? "All" : f}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Panel shading: each zone has a raster mask extracted from a recoloured
 * render of the actual bodywork, so the highlight IS the panel's real pixels
 * tinted acid green. Mask images share the photo's exact aspect ratio and use
 * the same object-contain sizing, so they letterbox identically and align
 * pixel-for-pixel.
 */
function ZoneShades({
  zones,
  hoveredId,
  activeId,
  eligible,
  debug,
}: {
  zones: LiveryZone[];
  hoveredId: string | null;
  activeId: string | null;
  eligible: Set<string>;
  debug: boolean;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {zones.map((z) => {
        const interactive = eligible.has(z.id);
        const lit = activeId === z.id || hoveredId === z.id;
        const show = (debug && interactive) || lit;
        const dimmed = !!activeId && activeId !== z.id;
        return (
          <img
            key={z.id}
            src={`${BASE}world/zones/${z.id}.png`}
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full select-none object-contain"
            style={{
              opacity: show ? (dimmed ? 0.3 : 1) : 0,
              transition: "opacity 300ms",
              filter: lit && !dimmed ? "drop-shadow(0 0 10px rgba(166,255,62,0.35))" : "none",
            }}
          />
        );
      })}
    </div>
  );
}

interface ZoneMarkerProps {
  zone: LiveryZone;
  interactive: boolean;
  active: boolean;
  hovered: boolean;
  dimmed: boolean;
  onHover: (id: string | null) => void;
  onSelect: (z: LiveryZone) => void;
}

function ZoneMarker({ zone, interactive, active, hovered, dimmed, onHover, onSelect }: ZoneMarkerProps) {
  const { region } = zone;
  const show = active || hovered;
  const labelBelow = region.y < 24;

  return (
    <button
      type="button"
      disabled={!interactive}
      aria-hidden={!interactive}
      tabIndex={interactive ? 0 : -1}
      aria-pressed={active}
      aria-label={`${zone.name} — ${zone.tier} tier`}
      onClick={() => onSelect(zone)}
      onMouseEnter={() => interactive && onHover(zone.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => interactive && onHover(zone.id)}
      onBlur={() => onHover(null)}
      className="absolute"
      style={{
        left: `${region.x}%`,
        top: `${region.y}%`,
        width: `${region.w}%`,
        height: `${region.h}%`,
        transform: "translate(-50%, -50%)",
        opacity: interactive ? (dimmed ? 0.35 : 1) : 0.12,
        pointerEvents: interactive ? "auto" : "none",
        zIndex: active ? 30 : hovered ? 20 : 10,
        transition: "opacity 300ms",
      }}
    >
      {/* pulsing centre marker */}
      <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <span
          aria-hidden
          className={`absolute h-4 w-4 rounded-full border border-acid/70 ${active ? "" : "animate-pulse-dot"}`}
        />
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-acid" />
      </span>

      {/* name + tier chip */}
      <span
        className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap border border-hairline bg-base/90 px-2 py-1 transition-opacity duration-200"
        style={{ opacity: show ? 1 : 0, ...(labelBelow ? { top: "calc(100% + 8px)" } : { bottom: "calc(100% + 8px)" }) }}
      >
        <span className="mono-label text-ink">{zone.name}</span>
        <span className="mono-label text-acid">{zone.tier}</span>
      </span>
    </button>
  );
}

interface ZonePanelProps {
  zone: LiveryZone;
  index: number;
  total: number;
  reduced: boolean;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function ZonePanel({ zone, index, total, reduced, closeRef, onClose, onPrev, onNext }: ZonePanelProps) {
  const meta = TIERS.find((t) => t.tier === zone.tier);
  return (
    <motion.section
      key="panel"
      aria-label={`${zone.name} placement details`}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.45, ease: EASE_OUT_STRONG }}
      className="glass-strong relative z-40 mt-3 border border-hairline p-5 md:absolute md:right-4 md:top-4 md:mt-0 md:max-h-[calc(100%-2rem)] md:w-[340px] md:overflow-auto"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="mono-label text-ink-dim">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <h3 className="mt-2 font-display text-xl font-bold uppercase leading-tight">{zone.name}</h3>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close placement details"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center border border-hairline text-ink-dim transition-colors hover:border-acid/50 hover:text-acid"
        >
          <X size={15} aria-hidden />
        </button>
      </div>

      <span className="mt-3 inline-flex items-center gap-2 border border-acid/30 bg-acid/5 px-2.5 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-acid" aria-hidden />
        <span className="mono-label text-acid">{zone.tier} tier</span>
      </span>
      {meta && <p className="mt-3 text-sm leading-relaxed text-ink-dim">{meta.blurb}</p>}

      <div className="mt-4 border-t border-hairline pt-4">
        <span className="mono-label text-ink-dim">Exposure profile</span>
        <div className="mt-3 space-y-2.5">
          {EXPOSURE_ROWS.map((row) => (
            <ExposureMeter key={row.key} label={row.label} value={zone.exposure[row.key]} />
          ))}
        </div>
      </div>

      <p className="mt-4 border-t border-hairline pt-4 text-sm leading-relaxed text-ink">{zone.placement}</p>

      <Link
        to={enquireHref(zone)}
        className="group mt-5 inline-flex w-full items-center justify-center gap-2 bg-acid px-5 py-3 font-display text-sm font-bold uppercase tracking-widest text-[#060607] transition-colors hover:bg-acid/90"
      >
        Enquire about this zone
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
      </Link>

      {total > 1 && (
        <div className="mt-4 flex items-center justify-between border-t border-hairline pt-4">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center gap-1.5 mono-label text-ink-dim transition-colors hover:text-acid"
            aria-label="Previous placement"
          >
            <ChevronLeft size={14} aria-hidden /> Prev
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-1.5 mono-label text-ink-dim transition-colors hover:text-acid"
            aria-label="Next placement"
          >
            Next <ChevronRight size={14} aria-hidden />
          </button>
        </div>
      )}
    </motion.section>
  );
}
