import { useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { CHECKPOINTS, circuitBounds, sampleCircuit } from "@/data/circuit";
import { CheckpointCard } from "./CheckpointCard";

/* Static top-down projection of the shared circuit. Uses the SAME sampleCircuit
   sampler as the 3D curve, so the ribbon and checkpoints line up exactly. */
const B = circuitBounds();
const PAD = 7;
const RAW_W = B.maxX - B.minX;
const RAW_H = B.maxZ - B.minZ;
const SCALE = (100 - 2 * PAD) / Math.max(RAW_W, RAW_H);
const VB_W = RAW_W * SCALE + 2 * PAD;
const VB_H = RAW_H * SCALE + 2 * PAD;

function project(x: number, z: number): [number, number] {
  return [PAD + (x - B.minX) * SCALE, PAD + (z - B.minZ) * SCALE];
}

const PATH_D = (() => {
  const N = 180;
  let d = "";
  for (let i = 0; i <= N; i++) {
    const { x, z } = sampleCircuit(i / N);
    const [px, py] = project(x, z);
    d += `${i === 0 ? "M" : "L"}${px.toFixed(2)} ${py.toFixed(2)} `;
  }
  return `${d}Z`;
})();

const CP = CHECKPOINTS.map((cp) => {
  const { x, z } = sampleCircuit(cp.t);
  const [px, py] = project(x, z);
  return { px, py, xPct: (px / VB_W) * 100, yPct: (py / VB_H) * 100 };
});

const COMETS = [
  { color: "#a6ff3e", dur: 15, begin: 0 },
  { color: "#9b4dff", dur: 17.5, begin: -6 },
  { color: "#c9a4ff", dur: 20, begin: -12 },
];

/**
 * Graceful 2D fallback for no-WebGL / low-power / reduced-motion. Shows the same
 * circuit and the same six checkpoint cards as the 3D experience. Comet motion
 * is dropped under reduced motion; the map and cards stay fully usable.
 */
export function Circuit2DFallback() {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="absolute inset-0">
      <div aria-hidden className="pointer-events-none absolute inset-0 hairline-grid opacity-30" />

      <svg
        viewBox={`0 0 ${VB_W.toFixed(2)} ${VB_H.toFixed(2)}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
        role="img"
        aria-label="Top-down map of the concept circuit with six checkpoints"
      >
        <defs>
          <filter id="ckt-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.9" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* violet edge-light */}
        <path d={PATH_D} fill="none" stroke="#6a00ff" strokeWidth={7} strokeOpacity={0.26} strokeLinejoin="round" filter="url(#ckt-glow)" />
        <path d={PATH_D} fill="none" stroke="#9b4dff" strokeWidth={6} strokeOpacity={0.55} strokeLinejoin="round" />
        {/* dark track surface */}
        <path d={PATH_D} fill="none" stroke="#0c0c10" strokeWidth={4.2} strokeLinejoin="round" />
        {/* acid centreline dashes */}
        <path d={PATH_D} fill="none" stroke="#a6ff3e" strokeWidth={0.5} strokeOpacity={0.85} strokeDasharray="1.4 2.4" strokeLinecap="round" />

        {/* comet riders */}
        {!reduced &&
          COMETS.map((c, i) => (
            <circle key={i} r={0.85} fill={c.color} filter="url(#ckt-glow)">
              <animateMotion dur={`${c.dur}s`} begin={`${c.begin}s`} repeatCount="indefinite" rotate="auto" path={PATH_D} />
            </circle>
          ))}

        {/* checkpoint visuals */}
        {CP.map((c, i) => (
          <g key={i}>
            <circle
              cx={c.px}
              cy={c.py}
              r={selected === i ? 2.3 : 1.6}
              fill="none"
              stroke="#a6ff3e"
              strokeWidth={0.4}
              strokeOpacity={selected === i ? 1 : 0.7}
            >
              {!reduced && selected !== i && (
                <animate attributeName="r" values="1.4;2.2;1.4" dur="2.4s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
              )}
            </circle>
            <circle cx={c.px} cy={c.py} r={0.7} fill="#a6ff3e" />
          </g>
        ))}
      </svg>

      {/* Accessible checkpoint hit targets layered over the SVG */}
      {CP.map((c, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setSelected(i)}
          aria-pressed={selected === i}
          aria-label={`${CHECKPOINTS[i].corner} — ${CHECKPOINTS[i].title}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ left: `${c.xPct}%`, top: `${c.yPct}%`, width: "10%", height: "10%" }}
        />
      ))}

      {/* HUD labels */}
      <div aria-hidden className="pointer-events-none absolute left-5 top-5 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-ink-dim" />
        <span className="mono-label text-ink">Circuit Map // 2D</span>
      </div>
      <div aria-hidden className="pointer-events-none absolute right-5 top-5 mono-label text-ink-dim">
        MotorLand Aragón · Concept
      </div>
      {selected === null && (
        <div aria-hidden className="pointer-events-none absolute bottom-5 right-5 mono-label text-ink-dim">
          Select a checkpoint to read the program
        </div>
      )}

      <AnimatePresence>
        {selected !== null && (
          <CheckpointCard
            checkpoint={CHECKPOINTS[selected]}
            index={selected}
            total={CHECKPOINTS.length}
            reduced={!!reduced}
            onNext={() => setSelected((s) => (s === null ? 0 : (s + 1) % CHECKPOINTS.length))}
            onExit={() => setSelected(null)}
            exitLabel="Close"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
