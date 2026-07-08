import {
  Suspense,
  useEffect,
  useRef,
  useState,
  Component,
  type ReactNode,
  type MutableRefObject,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  Lightformer,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import { LynxBike, type Subsystem } from "./LynxBike";
import subsystemMap from "./subsystemMap.json";

// Drop a real model at `<public>/lynx-bike.glb` and set this to the base-prefixed
// path to switch from the procedural placeholder to the GLB (with automatic
// fallback to procedural if the file is missing or fails to load).
const MODEL_URL: string | null = null;

type Vec3 = [number, number, number];
type CameraPreset = { position: Vec3; target: Vec3 };

const toVec3 = (a: number[]): Vec3 => [a[0] ?? 0, a[1] ?? 0, a[2] ?? 0];

function preset(sub: Subsystem): CameraPreset {
  const systems = subsystemMap.systems as Record<
    string,
    { camera: { position: number[]; target: number[] } }
  >;
  const cam = (systems[sub] ?? systems.full).camera;
  return { position: toVec3(cam.position), target: toVec3(cam.target) };
}

// Generic error boundary: renders a fallback if anything below it throws — used
// both for the GLB load path and as a hard guard around Canvas/WebGL init.
class R3FErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function GLBBike({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function BikeModel({ subsystem }: { subsystem: Subsystem }) {
  const procedural = <LynxBike activeSubsystem={subsystem} />;
  if (!MODEL_URL) return procedural;
  return (
    <R3FErrorBoundary fallback={procedural}>
      <Suspense fallback={procedural}>
        <GLBBike url={MODEL_URL} />
      </Suspense>
    </R3FErrorBoundary>
  );
}

// ---- Scene: bike + studio lighting + brand "breathing" glow ----
function Scene({
  subsystem,
  autoRotate,
}: {
  subsystem: Subsystem;
  autoRotate: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const green = useRef<THREE.PointLight>(null);
  const purple = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    if (autoRotate && group.current) {
      group.current.rotation.y += delta * 0.28;
    }
    const t = state.clock.elapsedTime;
    if (green.current) green.current.intensity = 26 + Math.sin(t * 1.4) * 8;
    if (purple.current) purple.current.intensity = 30 + Math.sin(t * 1.1 + 1.5) * 10;
  });

  return (
    <>
      <hemisphereLight args={["#3a3f55", "#05070d", 0.6]} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-6, 4, -3]} intensity={0.6} color="#8a6bff" />
      <pointLight ref={green} position={[2.5, 1.2, 2.5]} color="#A8FF3E" intensity={26} distance={12} />
      <pointLight ref={purple} position={[-3, 0.4, -1.5]} color="#7B2CFF" intensity={30} distance={14} />

      <group ref={group}>
        <BikeModel subsystem={subsystem} />
      </group>

      <ContactShadows
        position={[0, -0.35, 0]}
        opacity={0.5}
        scale={12}
        blur={2.6}
        far={4}
        color="#000000"
      />

      {/* Local studio environment (no network fetch) for metal reflections */}
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2} position={[0, 5, 0]} scale={[8, 3, 1]} color="#ffffff" />
        <Lightformer intensity={3} position={[3, 1, 4]} scale={[4, 4, 1]} color="#A8FF3E" />
        <Lightformer intensity={3} position={[-4, 1, -3]} scale={[4, 4, 1]} color="#7B2CFF" />
        <Lightformer intensity={1.5} position={[0, -2, 2]} scale={[6, 2, 1]} color="#3a3f55" />
      </Environment>
    </>
  );
}

// ---- Fly the camera to a subsystem preset ONLY on change; yield to user orbit ----
function CameraRig({
  subsystem,
  controls,
  animatingRef,
}: {
  subsystem: Subsystem;
  controls: MutableRefObject<{ target: THREE.Vector3; update: () => void } | null>;
  animatingRef: MutableRefObject<boolean>;
}) {
  const wantPos = useRef(new THREE.Vector3());
  const wantTarget = useRef(new THREE.Vector3());

  useEffect(() => {
    const p = preset(subsystem);
    wantPos.current.set(...p.position);
    wantTarget.current.set(...p.target);
    animatingRef.current = true; // begin fly-to when the subsystem changes
  }, [subsystem, animatingRef]);

  useFrame((state, delta) => {
    if (!animatingRef.current) return; // idle once arrived / once the user grabs
    const k = 1 - Math.pow(0.0009, delta); // frame-rate independent smoothing
    state.camera.position.lerp(wantPos.current, k);
    if (controls.current) {
      controls.current.target.lerp(wantTarget.current, k);
      controls.current.update();
    }
    if (state.camera.position.distanceTo(wantPos.current) < 0.03) {
      animatingRef.current = false;
    }
  });
  return null;
}

// Detect WebGL synchronously (before first render) so we never mount <Canvas>
// on a device that can't create a GL context — R3F would otherwise throw during
// init, before any effect-based check could swap in the fallback.
function detectWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

function ViewerFallback({ interactive }: { interactive: boolean }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="w-16 h-16 border border-primary/40 flex items-center justify-center">
        <span className="font-display font-black text-2xl text-primary">LX</span>
      </div>
      {interactive && (
        <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground max-w-xs">
          The 3D viewer needs a WebGL-capable browser with hardware acceleration enabled.
        </p>
      )}
    </div>
  );
}

export interface BikeViewerProps {
  variant: "hero" | "interactive";
  subsystem?: Subsystem;
  className?: string;
}

export function BikeViewer({ variant, subsystem = "full", className }: BikeViewerProps) {
  const controls = useRef<{ target: THREE.Vector3; update: () => void } | null>(null);
  const animatingRef = useRef(false);
  const interactive = variant === "interactive";
  const initial = preset(interactive ? subsystem : "full");
  // Computed once, synchronously, before the first render.
  const [webgl] = useState<boolean>(detectWebGL);

  if (!webgl) {
    return (
      <div className={className} style={{ pointerEvents: "none" }}>
        <ViewerFallback interactive={interactive} />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ pointerEvents: interactive ? "auto" : "none", touchAction: interactive ? "none" : "auto" }}
    >
      <R3FErrorBoundary fallback={<ViewerFallback interactive={interactive} />}>
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: initial.position, fov: 38 }}
        >
          <Suspense fallback={null}>
            <Scene subsystem={subsystem} autoRotate={!interactive} />
            {interactive && (
              <>
                <OrbitControls
                  ref={controls as never}
                  enablePan={false}
                  enableZoom
                  enableDamping
                  dampingFactor={0.08}
                  minDistance={3}
                  maxDistance={11}
                  minPolarAngle={0.15}
                  maxPolarAngle={Math.PI / 2 - 0.04}
                  target={new THREE.Vector3(...initial.target)}
                  onStart={() => {
                    animatingRef.current = false; // user grabbed control → stop fly-to
                  }}
                />
                <CameraRig subsystem={subsystem} controls={controls} animatingRef={animatingRef} />
              </>
            )}
          </Suspense>
        </Canvas>
      </R3FErrorBoundary>
    </div>
  );
}

export default BikeViewer;
