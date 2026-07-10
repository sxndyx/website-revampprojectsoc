import { Canvas, type RootState } from "@react-three/fiber";
import { CircuitScene, type SceneApi } from "./CircuitScene";

/**
 * Thin Canvas wrapper, code-split via React.lazy so Three.js only downloads when
 * the 3D experience is actually used (never for the 2D / reduced-motion fallback).
 */
export default function Scene3D({
  paused,
  apiRef,
  onView,
  onActiveCheckpoint,
  onCreated,
}: {
  paused: boolean;
  apiRef: { current: SceneApi | null };
  onView: (v: "orbit" | "ride") => void;
  onActiveCheckpoint: (idx: number | null) => void;
  onCreated: (state: RootState) => void;
}) {
  return (
    <Canvas
      frameloop={paused ? "never" : "always"}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [4, 74, 98], fov: 42, near: 0.1, far: 420 }}
      onCreated={onCreated}
    >
      <CircuitScene apiRef={apiRef} onView={onView} onActiveCheckpoint={onActiveCheckpoint} />
    </Canvas>
  );
}
