import {
  Component,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { RootState } from "@react-three/fiber";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { CHECKPOINTS } from "@/data/circuit";
import { CheckpointCard } from "./CheckpointCard";
import { CircuitHud } from "./CircuitHud";
import { Circuit2DFallback } from "./Circuit2DFallback";
import type { SceneApi } from "./CircuitScene";

// Three.js + the scene are code-split: only fetched when the 3D path is taken.
const Scene3D = lazy(() => import("./Scene3D"));

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function isLowPower(): boolean {
  if (typeof navigator === "undefined") return false;
  const hc = navigator.hardwareConcurrency;
  return typeof hc === "number" && hc > 0 && hc <= 2;
}

/** Belt-and-suspenders: if the WebGL context is lost or the scene throws, drop to 2D. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function SceneLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="mono-label text-ink-dim">Initialising simulation…</span>
    </div>
  );
}

const AUTO_ADVANCE_MS = 7000;

export function CircuitExperience() {
  const reduced = useReducedMotion();
  // Decide WebGL capability synchronously, before the Canvas ever mounts.
  const [canWebGL] = useState(detectWebGL);
  const [lowPower] = useState(isLowPower);
  const [crashed, setCrashed] = useState(false);

  const use3D = canWebGL && !lowPower && !reduced && !crashed;

  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<SceneApi | null>(null);
  const [paused, setPaused] = useState(false);
  const [view, setView] = useState<"orbit" | "ride">("orbit");
  const [activeCp, setActiveCp] = useState<number | null>(null);

  // Pause rendering when the tab is hidden or the canvas is scrolled off-screen.
  useEffect(() => {
    if (!use3D) return;
    const el = containerRef.current;
    if (!el) return;
    let onscreen = true;
    let visible = !document.hidden;
    const apply = () => setPaused(!(onscreen && visible));
    const io = new IntersectionObserver(
      ([entry]) => {
        onscreen = entry.isIntersecting;
        apply();
      },
      { threshold: 0.04 },
    );
    io.observe(el);
    const onVis = () => {
      visible = !document.hidden;
      apply();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [use3D]);

  // Escape exits ride mode.
  useEffect(() => {
    if (!use3D) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && view === "ride") apiRef.current?.exit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [use3D, view]);

  // Gentle auto-advance through the program (stops at the final checkpoint).
  useEffect(() => {
    if (!use3D || view !== "ride" || activeCp === null) return;
    if (activeCp >= CHECKPOINTS.length - 1) return;
    const id = window.setTimeout(() => apiRef.current?.next(), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [use3D, view, activeCp]);

  const handleView = useCallback((v: "orbit" | "ride") => {
    setView(v);
    if (v === "orbit") setActiveCp(null);
  }, []);

  const onCreated = useCallback((state: RootState) => {
    state.gl.domElement.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      setCrashed(true);
    });
  }, []);

  const cardCheckpoint = useMemo(() => (activeCp !== null ? CHECKPOINTS[activeCp] : null), [activeCp]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/9] w-full overflow-hidden border border-hairline bg-[#07070a]"
    >
      {use3D ? (
        <>
          <SceneBoundary onError={() => setCrashed(true)}>
            <Suspense fallback={<SceneLoader />}>
              <Scene3D
                paused={paused}
                apiRef={apiRef}
                onView={handleView}
                onActiveCheckpoint={setActiveCp}
                onCreated={onCreated}
              />
            </Suspense>
          </SceneBoundary>

          <CircuitHud mode={view} />

          <AnimatePresence>
            {view === "ride" && cardCheckpoint && activeCp !== null && (
              <CheckpointCard
                checkpoint={cardCheckpoint}
                index={activeCp}
                total={CHECKPOINTS.length}
                reduced={!!reduced}
                onNext={() => apiRef.current?.next()}
                onExit={() => apiRef.current?.exit()}
              />
            )}
          </AnimatePresence>
        </>
      ) : (
        <Circuit2DFallback />
      )}
    </div>
  );
}
