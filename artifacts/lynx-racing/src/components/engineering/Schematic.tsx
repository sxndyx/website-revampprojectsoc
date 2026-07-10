import { motion, useReducedMotion } from "framer-motion";
import type { SchematicId } from "@/data/engineering";

interface SchematicProps {
  id: SchematicId;
  /** Play the line-draw animation (in view / hovered). */
  active?: boolean;
  className?: string;
}

/**
 * Blueprint-style line-draw schematics, one motif per engineering module.
 * Strokes animate via pathLength when `active`; reduced-motion renders the
 * finished drawing immediately. Purely decorative — hidden from readers.
 */
export function Schematic({ id, active = true, className = "" }: SchematicProps) {
  const reduced = useReducedMotion();
  const drawn = reduced || !active ? (reduced ? 1 : 0) : 1;

  const stroke = (i: number, accent = false) => ({
    fill: "none",
    stroke: accent ? "var(--color-acid)" : "rgba(245,245,242,0.38)",
    strokeWidth: accent ? 1.4 : 1,
    vectorEffect: "non-scaling-stroke" as const,
    initial: reduced ? { pathLength: 1 } : { pathLength: 0 },
    animate: { pathLength: drawn },
    transition: { duration: 1.1, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] as const },
  });

  const paths: Record<SchematicId, React.ReactNode> = {
    cad: (
      <>
        <motion.path d="M40 34 76 16l36 18-36 18-36-18Z" {...stroke(0)} />
        <motion.path d="M40 34v34l36 18V52" {...stroke(1)} />
        <motion.path d="M112 34v34L76 86V52" {...stroke(2)} />
        <motion.path d="M40 34 76 52l36-18" {...stroke(3, true)} />
        <motion.path d="M24 92h104" {...stroke(4)} strokeDasharray="3 5" />
        <motion.path d="M24 86v12M128 86v12" {...stroke(5)} />
      </>
    ),
    manufacturing: (
      <>
        <motion.path d="M76 14v26" {...stroke(0)} />
        <motion.path d="M66 40h20l-4 14h-12l-4-14Z" {...stroke(1, true)} />
        <motion.path d="M76 54c-14 8-14 22 0 30s14 22 0 30" {...stroke(2)} />
        <motion.path d="M30 96h36M86 96h36" {...stroke(3)} />
        <motion.path d="M30 108h92" {...stroke(4)} strokeDasharray="4 5" />
      </>
    ),
    simulation: (
      <>
        <motion.path d="M76 60a10 10 0 1 0 .01 0" {...stroke(0, true)} />
        <motion.path d="M76 42a28 28 0 1 0 .01 0" {...stroke(1)} />
        <motion.path d="M76 26a44 44 0 1 0 .01 0" {...stroke(2)} />
        <motion.path d="M20 60h24M108 60h24M76 4v20M76 96v20" {...stroke(3)} strokeDasharray="2 5" />
      </>
    ),
    battery: (
      <>
        <motion.path d="M28 34h96v56H28z" {...stroke(0)} />
        <motion.path d="M124 48h10v28h-10" {...stroke(1)} />
        <motion.path d="M42 34v56M62 34v56M82 34v56M102 34v56" {...stroke(2)} />
        <motion.path d="M28 62h96" {...stroke(3)} />
        <motion.path d="M36 20l8 8M56 20l8 8M76 20l8 8M96 20l8 8" {...stroke(4, true)} />
      </>
    ),
    telemetry: (
      <>
        <motion.path d="M16 64h22l8-28 12 52 10-38 8 14h44" {...stroke(0, true)} />
        <motion.path d="M16 96h120" {...stroke(1)} />
        <motion.path d="M28 92v8M52 92v8M76 92v8M100 92v8M124 92v8" {...stroke(2)} />
        <motion.path d="M16 24h120" {...stroke(3)} strokeDasharray="2 6" />
      </>
    ),
    software: (
      <>
        <motion.path d="M30 30h28v20H30zM94 30h28v20H94zM62 78h28v20H62z" {...stroke(0)} />
        <motion.path d="M58 40h36" {...stroke(1, true)} />
        <motion.path d="M44 50v18h32v10M108 50v18H76" {...stroke(2)} />
        <motion.path d="M104 40l8-6v12l-8-6Z" {...stroke(3, true)} />
      </>
    ),
    suspension: (
      <>
        <motion.path d="M40 18 96 96" {...stroke(0)} />
        <motion.path d="M52 14 108 92" {...stroke(1)} />
        <motion.path d="M96 96a12 12 0 1 0 .01 0" {...stroke(2, true)} />
        <motion.path d="M40 18a8 8 0 1 0 .01 0" {...stroke(3)} />
        <motion.path d="M58 44c8-6 16-6 24 0M50 60c10-8 22-8 32 0" {...stroke(4)} strokeDasharray="3 4" />
      </>
    ),
    testing: (
      <>
        <motion.path d="M20 108V20M20 108h116" {...stroke(0)} />
        <motion.path d="M20 92c30-4 52-18 64-44" {...stroke(1, true)} />
        <motion.path d="M20 100c40 0 78-10 108-56" {...stroke(2)} />
        <motion.path d="M84 48v60M84 48h-8M84 60h-8" {...stroke(3)} strokeDasharray="2 5" />
      </>
    ),
    electronics: (
      <>
        <motion.path d="M56 46h40v40H56z" {...stroke(0, true)} />
        <motion.path d="M20 56h36M20 76h36M96 56h36M96 76h36M66 46V16M86 46V16M66 86v30M86 86v30" {...stroke(1)} />
        <motion.path d="M20 56v-20h26M132 76v22h-26" {...stroke(2)} />
        <motion.circle cx="20" cy="36" r="3" {...stroke(3, true)} />
        <motion.circle cx="132" cy="98" r="3" {...stroke(4, true)} />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 152 124" aria-hidden className={className}>
      {paths[id]}
    </svg>
  );
}
