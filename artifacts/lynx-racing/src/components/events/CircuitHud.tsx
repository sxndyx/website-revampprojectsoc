/**
 * Decorative HUD frame drawn over the 3D circuit. Purely presentational
 * (pointer-events-none) — the checkpoint card sits above it at a higher z-index.
 */
export function CircuitHud({ mode }: { mode: "orbit" | "ride" }) {
  const ride = mode === "ride";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
      <span className="absolute left-3 top-3 h-5 w-5 border-l border-t border-acid/40" />
      <span className="absolute right-3 top-3 h-5 w-5 border-r border-t border-acid/40" />
      <span className="absolute bottom-3 left-3 h-5 w-5 border-b border-l border-acid/40" />
      <span className="absolute bottom-3 right-3 h-5 w-5 border-b border-r border-acid/40" />

      <div className="absolute left-6 top-5 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${ride ? "bg-acid animate-pulse-dot" : "bg-ink-dim"}`} />
        <span className="mono-label text-ink">{ride ? "Simulation // Active" : "Circuit Map // Orbit"}</span>
      </div>

      <div className="absolute right-6 top-5 mono-label text-ink-dim">Lynx GP Night Venue · Aragón Concept</div>

      <div className="absolute bottom-5 right-6 mono-label text-ink-dim">
        {ride ? "Esc to exit · following the racing line" : "Click a rider or checkpoint to dive in · explore the fan world"}
      </div>
    </div>
  );
}
