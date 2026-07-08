import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2, ZoomIn } from "lucide-react";
import { BikeViewer } from "@/three/BikeViewer";
import type { Subsystem } from "@/three/LynxBike";
import { useLiveTelemetry } from "@/lib/telemetry";
import subsystemMap from "@/three/subsystemMap.json";

interface SystemInfo {
  label: string;
  code: string;
  status: string;
  description: string;
  tags: string[];
  specs: { label: string; value: string }[];
  signal: number[];
  camera: { position: number[]; target: number[] };
}

const ORDER = subsystemMap.order as Subsystem[];
const SYSTEMS = subsystemMap.systems as Record<Subsystem, SystemInfo>;

function Sparkline({ data }: { data: number[] }) {
  const w = 260;
  const h = 60;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return [x, y] as const;
  });
  const line = pts.map((p) => p.join(",")).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;
  const last = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A8FF3E" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#A8FF3E" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#spark)" />
      <polyline points={line} fill="none" stroke="#A8FF3E" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle cx={last[0]} cy={last[1]} r="3" fill="#A8FF3E" />
    </svg>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 px-5 py-3">
      <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
        {label}
      </span>
      <span className="font-display font-bold text-primary tabular-nums">{value}</span>
    </div>
  );
}

export default function TheBike() {
  const [active, setActive] = useState<Subsystem>("full");
  const info = SYSTEMS[active];
  const tele = useLiveTelemetry();

  return (
    <div className="pt-20">
      {/* Header + tab bar */}
      <section className="container mx-auto px-6 lg:px-12 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs tracking-[0.4em] text-primary">[ THE BIKE ]</span>
          <span className="h-px w-12 bg-primary/40" />
        </div>
        <h1 className="font-display font-black uppercase tracking-tighter text-4xl md:text-6xl leading-[0.9]">
          Systems Breakdown
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground font-light">
          Orbit the bike, zoom in, and select a subsystem to isolate it. Every readout below reflects our current development stage — targets are marked as such.
        </p>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
          {ORDER.map((key) => {
            const isActive = key === active;
            return (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`shrink-0 font-mono text-xs uppercase tracking-widest px-4 py-2.5 border transition-all ${
                  isActive
                    ? "border-primary text-primary bg-primary/10 box-glow-green"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {SYSTEMS[key].label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Info panel + viewer */}
      <section className="container mx-auto px-6 lg:px-12 pb-6">
        <div className="grid lg:grid-cols-[360px_1fr] gap-px bg-border/40 border border-border/40">
          {/* Info panel */}
          <aside className="bg-background p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-xs text-muted-foreground tracking-widest">
                    {info.code}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase px-2.5 py-1 border border-primary/40 text-primary">
                    {info.status}
                  </span>
                </div>

                <h2 className="font-display font-extrabold uppercase text-3xl mb-4">{info.label}</h2>
                <p className="text-muted-foreground font-light leading-relaxed mb-6">
                  {info.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {info.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 bg-card border border-border text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mb-8">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                    Signal
                  </span>
                  <Sparkline data={info.signal} />
                </div>

                <div className="border-t border-border pt-5 space-y-3">
                  {info.specs.map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-sm">
                      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        {s.label}
                      </span>
                      <span className="font-display font-semibold">{s.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </aside>

          {/* Viewer */}
          <div className="relative bg-[#05070d] min-h-[52vh] lg:min-h-[68vh]">
            <BikeViewer variant="interactive" subsystem={active} className="absolute inset-0" />

            {/* HUD corners */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-primary/40" />
              <div className="absolute top-4 right-4 w-6 h-6 border-r border-t border-primary/40" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-l border-b border-primary/40" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-r border-b border-primary/40" />
            </div>

            {/* Interaction hint */}
            <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-5 font-mono text-[10px] tracking-widest uppercase text-muted-foreground/70 bg-background/40 backdrop-blur-sm px-4 py-2 border border-border/40">
              <span className="flex items-center gap-1.5">
                <MousePointer2 size={12} /> Drag to orbit
              </span>
              <span className="flex items-center gap-1.5">
                <ZoomIn size={12} /> Scroll to zoom
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Live stats bar */}
      <section className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="flex flex-wrap items-center divide-x divide-border border border-border bg-card/30 backdrop-blur-sm">
          <StatCell label="Pack Voltage" value={tele.voltage} />
          <StatCell label="Active System" value={info.code} />
          <StatCell label="Status" value={tele.status} />
          <StatCell label="Mode" value={tele.mode} />
          <div className="flex items-center gap-2 px-5 py-3 ml-auto">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-primary/80">
              Telemetry {tele.system}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
