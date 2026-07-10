import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { CHECKPOINTS, CIRCUIT_POINTS } from "@/data/circuit";
import { checkerTexture, kerbTexture } from "./world/textures";
import { Floodlight, Grandstand, Jumbotron, SkyDome, StartGantry, VenueGround } from "./world/Venue";
import { BbqTerrace, ComingSoonIsland, Paddock } from "./world/Islands";
import { RaceBike } from "./world/RaceBike";

/* -------------------------------------------------------------------------- *
 * Circuit geometry. The curve MUST be built as a closed, uniform Catmull-Rom
 * with tension 0.5 so curve.getPoint(t) matches the pure sampleCircuit(t) used
 * by the 2D fallback — keeping ribbon + checkpoints identical across both.
 * -------------------------------------------------------------------------- */
const CURVE = new THREE.CatmullRomCurve3(
  CIRCUIT_POINTS.map(([x, z]) => new THREE.Vector3(x, 0, z)),
  true,
  "catmullrom",
  0.5,
);

const TRACK_WIDTH = 7;
const RIDER_H = 2.4;
const DIVE_DUR = 1.5;
const EXIT_DUR = 1.2;

/** Track ribbon extruded along the curve; `offset` shifts it sideways (kerbs). */
function buildRibbon(width: number, segments: number, offset = 0): THREE.BufferGeometry {
  const half = width / 2;
  const pos = new Float32Array((segments + 1) * 2 * 3);
  const uv = new Float32Array((segments + 1) * 2 * 2);
  const idx: number[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  const p = new THREE.Vector3();
  const tan = new THREE.Vector3();
  const side = new THREE.Vector3();

  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) % 1;
    CURVE.getPoint(t, p);
    CURVE.getTangent(t, tan).normalize();
    side.crossVectors(tan, up).normalize();
    p.addScaledVector(side, offset);
    const o = i * 6;
    pos[o] = p.x + side.x * half;
    pos[o + 1] = 0;
    pos[o + 2] = p.z + side.z * half;
    pos[o + 3] = p.x - side.x * half;
    pos[o + 4] = 0;
    pos[o + 5] = p.z - side.z * half;
    const uo = i * 4;
    uv[uo] = 0;
    uv[uo + 1] = i;
    uv[uo + 2] = 1;
    uv[uo + 3] = i;
    if (i < segments) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

const RIBBON_SURFACE = buildRibbon(TRACK_WIDTH, 420);
const RIBBON_GLOW = buildRibbon(TRACK_WIDTH + 1.8, 420);
const KERB_L = buildRibbon(1.05, 420, TRACK_WIDTH / 2 + 0.5);
const KERB_R = buildRibbon(1.05, 420, -(TRACK_WIDTH / 2 + 0.5));
const CENTER_LINE = CURVE.getPoints(260).map((v) => [v.x, 0.06, v.z] as [number, number, number]);

/** Start/finish transform (t = 0). */
const START = (() => {
  const p = CURVE.getPoint(0);
  const tan = CURVE.getTangent(0).normalize();
  const side = new THREE.Vector3().crossVectors(tan, new THREE.Vector3(0, 1, 0)).normalize();
  return { p, tan, side, angle: Math.atan2(tan.x, tan.z) };
})();

const CP_POSITIONS = CHECKPOINTS.map((cp) => {
  const v = new THREE.Vector3();
  CURVE.getPoint(cp.t, v);
  return v;
});

/* Reusable temporaries for the camera rig (no per-frame allocation). */
const _p = new THREE.Vector3();
const _look = new THREE.Vector3();
const _tan = new THREE.Vector3();
const _tan2 = new THREE.Vector3();
const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _qBank = new THREE.Quaternion();
const _pos = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);
const FWD = new THREE.Vector3(0, 0, 1);

function easeInOut(p: number) {
  return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
}

function ridePose(u: number): { pos: THREE.Vector3; quat: THREE.Quaternion } {
  CURVE.getPoint(u % 1, _p);
  CURVE.getTangent(u % 1, _tan).normalize();
  _pos.copy(_p);
  _pos.y = RIDER_H;
  _pos.addScaledVector(_tan, -1.7);
  _pos.y += 0.5;
  CURVE.getPoint((u + 0.02) % 1, _look);
  _look.y = RIDER_H * 0.72;
  _m.lookAt(_pos, _look, UP);
  _q.setFromRotationMatrix(_m);
  CURVE.getTangent((u + 0.03) % 1, _tan2).normalize();
  const turn = _tan.x * _tan2.z - _tan.z * _tan2.x;
  const bank = THREE.MathUtils.clamp(turn * 7, -0.55, 0.55);
  _qBank.setFromAxisAngle(FWD, bank);
  _q.multiply(_qBank);
  return { pos: _pos, quat: _q };
}

function nextCheckpointAfter(u: number): number {
  const uu = ((u % 1) + 1) % 1;
  for (let i = 0; i < CHECKPOINTS.length; i++) {
    if (CHECKPOINTS[i].t > uu + 0.001) return i;
  }
  return 0;
}

export interface SceneApi {
  next: () => void;
  exit: () => void;
}

type Phase = "orbit" | "diving" | "ride" | "exiting";

interface CircuitSceneProps {
  apiRef: { current: SceneApi | null };
  onView: (v: "orbit" | "ride") => void;
  onActiveCheckpoint: (idx: number | null) => void;
}

export function CircuitScene({ apiRef, onView, onActiveCheckpoint }: CircuitSceneProps) {
  const camera = useThree((s) => s.camera);
  // drei forwards the underlying three OrbitControls instance here; typed loosely
  // because its impl type isn't exported from the artifact's dependency surface.
  const controlsRef = useRef<any>(null);

  const phase = useRef<Phase>("orbit");
  const rideU = useRef(0);
  const targetIdx = useRef(0);
  const arrived = useRef(false);
  const transStart = useRef(0);
  const now = useRef(0);
  const fromPos = useRef(new THREE.Vector3());
  const fromQuat = useRef(new THREE.Quaternion());
  const savedPos = useRef(new THREE.Vector3());
  const savedTarget = useRef(new THREE.Vector3());

  const kerb = useMemo(() => {
    const t = kerbTexture();
    t.repeat.set(1, 0.5); // one red/white pair every two ribbon segments
    return t;
  }, []);
  const checker = useMemo(checkerTexture, []);

  const beginDive = (u: number, cpIndex: number | null) => {
    if (phase.current !== "orbit") return;
    savedPos.current.copy(camera.position);
    if (controlsRef.current) savedTarget.current.copy(controlsRef.current.target);
    fromPos.current.copy(camera.position);
    fromQuat.current.copy(camera.quaternion);
    rideU.current = ((u % 1) + 1) % 1;
    if (cpIndex !== null) {
      targetIdx.current = cpIndex;
      arrived.current = true;
    } else {
      arrived.current = false;
      targetIdx.current = nextCheckpointAfter(rideU.current);
    }
    transStart.current = now.current;
    phase.current = "diving";
    onActiveCheckpoint(null);
    onView("ride");
  };

  // Expose next / exit to the DOM overlay controls.
  useEffect(() => {
    apiRef.current = {
      next: () => {
        if (phase.current !== "ride") return;
        targetIdx.current = (targetIdx.current + 1) % CHECKPOINTS.length;
        arrived.current = false;
        onActiveCheckpoint(null);
      },
      exit: () => {
        if (phase.current === "orbit" || phase.current === "exiting") return;
        fromPos.current.copy(camera.position);
        fromQuat.current.copy(camera.quaternion);
        transStart.current = now.current;
        phase.current = "exiting";
        onActiveCheckpoint(null);
      },
    };
    return () => {
      apiRef.current = null;
    };
  }, [apiRef, camera, onActiveCheckpoint]);

  useFrame((state, delta) => {
    now.current = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const ph = phase.current;
    const controls = controlsRef.current;
    if (controls) {
      controls.enabled = ph === "orbit";
      controls.autoRotate = ph === "orbit";
    }

    if (ph === "orbit") return;

    if (ph === "diving") {
      const p = Math.min(1, (now.current - transStart.current) / DIVE_DUR);
      const e = easeInOut(p);
      const pose = ridePose(rideU.current);
      camera.position.lerpVectors(fromPos.current, pose.pos, e);
      camera.quaternion.copy(fromQuat.current).slerp(pose.quat, e);
      if (p >= 1) {
        phase.current = "ride";
        if (arrived.current) onActiveCheckpoint(targetIdx.current);
      }
      return;
    }

    if (ph === "exiting") {
      const p = Math.min(1, (now.current - transStart.current) / EXIT_DUR);
      const e = easeInOut(p);
      camera.position.lerpVectors(fromPos.current, savedPos.current, e);
      _m.lookAt(savedPos.current, savedTarget.current, UP);
      _q.setFromRotationMatrix(_m);
      camera.quaternion.copy(fromQuat.current).slerp(_q, e);
      if (p >= 1) {
        phase.current = "orbit";
        if (controls) {
          controls.target.copy(savedTarget.current);
          controls.enabled = true;
          controls.update();
        }
        onView("orbit");
      }
      return;
    }

    // ph === "ride"
    if (!arrived.current) {
      const targetT = CHECKPOINTS[targetIdx.current].t;
      let dist = (((targetT - rideU.current) % 1) + 1) % 1;
      if (dist < 0.0009) {
        rideU.current = targetT;
        arrived.current = true;
        onActiveCheckpoint(targetIdx.current);
      } else {
        const approach = Math.min(1, dist / 0.06);
        const speed = 0.012 + 0.075 * approach;
        let step = speed * dt;
        if (step > dist) step = dist;
        rideU.current = (rideU.current + step) % 1;
      }
    }
    const pose = ridePose(rideU.current);
    camera.position.copy(pose.pos);
    camera.quaternion.copy(pose.quat);
  });

  return (
    <>
      <color attach="background" args={["#060607"]} />
      <fogExp2 attach="fog" args={["#060607", 0.006]} />

      {/* Night-race light rig: cool violet sky bounce + warm floodlight wash. */}
      <ambientLight intensity={0.4} />
      <hemisphereLight args={["#241b3d", "#0c1a10", 0.55]} />
      <directionalLight position={[0, 90, 10]} intensity={0.55} color="#ffe9c0" />
      <directionalLight position={[40, 60, 20]} intensity={0.35} color="#cbb8ff" />
      <directionalLight position={[-30, 30, -40]} intensity={0.15} color="#a6ff3e" />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate
        autoRotateSpeed={0.35}
        minDistance={40}
        maxDistance={175}
        minPolarAngle={0.15}
        maxPolarAngle={1.15}
      />

      {/* Venue ground + track */}
      <SkyDome />
      <VenueGround />
      <mesh geometry={RIBBON_GLOW} position={[0, 0.005, 0]}>
        <meshBasicMaterial color="#7b34ff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={KERB_L} position={[0, 0.025, 0]}>
        <meshBasicMaterial map={kerb} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh geometry={KERB_R} position={[0, 0.025, 0]}>
        <meshBasicMaterial map={kerb} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh geometry={RIBBON_SURFACE} position={[0, 0.035, 0]}>
        <meshStandardMaterial color="#15151b" roughness={0.7} metalness={0.15} side={THREE.DoubleSide} />
      </mesh>
      <Line points={CENTER_LINE} color="#a6ff3e" lineWidth={1.2} dashed dashSize={2} gapSize={2.6} transparent opacity={0.4} />

      {/* Start/finish */}
      <mesh
        rotation={[-Math.PI / 2, 0, -START.angle]}
        position={[START.p.x, 0.045, START.p.z]}
      >
        <planeGeometry args={[TRACK_WIDTH, 2.1]} />
        <meshBasicMaterial map={checker} toneMapped={false} />
      </mesh>
      <StartGantry point={START.p} side={START.side} trackWidth={TRACK_WIDTH} />

      {/* Grandstands, lights, screen */}
      <Grandstand position={[62, 14]} rotationY={-Math.PI / 2} width={50} seed={1} />
      <Grandstand position={[8, -48]} rotationY={0} width={40} seed={2} />
      <Grandstand position={[-64, 28]} rotationY={Math.PI / 2} width={36} tiers={6} seed={3} />
      <Jumbotron position={[20, 60]} rotationY={Math.PI} />
      {([[66, 36], [62, -26], [32, -50], [-26, -46], [-66, 6], [-52, 54], [16, 64]] as [number, number][]).map(
        (p, i) => <Floodlight key={i} position={p} />,
      )}

      {/* Fan-world islands */}
      <BbqTerrace position={[38, 54]} rotationY={-0.6} />
      <Paddock position={[58, -14]} rotationY={-Math.PI / 2} />
      <ComingSoonIsland position={[-44, -32]} rotationY={0.7} title="Fan Zone" kind="stage" />
      <ComingSoonIsland position={[-60, 46]} rotationY={1.2} title="E-Kart Circuit" kind="karts" />
      <ComingSoonIsland position={[4, -54]} rotationY={0.1} title="Night Market" kind="market" />

      {/* Checkpoint markers */}
      {CHECKPOINTS.map((_, i) => (
        <CheckpointMarker key={i} index={i} onPick={(idx) => beginDive(CHECKPOINTS[idx].t, idx)} />
      ))}

      {/* The grid */}
      <RaceBike curve={CURVE} color="#a6ff3e" u0={0.0} speed={0.05} onPick={(u) => beginDive(u, null)} />
      <RaceBike curve={CURVE} color="#9b4dff" u0={0.3} speed={0.046} onPick={(u) => beginDive(u, null)} />
      <RaceBike curve={CURVE} color="#e8e8f0" u0={0.55} speed={0.054} onPick={(u) => beginDive(u, null)} />
      <RaceBike curve={CURVE} color="#ff5a3c" u0={0.78} speed={0.049} onPick={(u) => beginDive(u, null)} />
    </>
  );
}

/* -------------------------------------------------------------------------- */

function CheckpointMarker({ index, onPick }: { index: number; onPick: (idx: number) => void }) {
  const pos = CP_POSITIONS[index];
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ring.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.16;
      ring.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[pos.x, 0, pos.z]}>
      <mesh position={[0, 6, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 12, 8]} />
        <meshBasicMaterial color="#a6ff3e" transparent opacity={0.22} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <ringGeometry args={[1.5, 2, 40]} />
        <meshBasicMaterial color="#a6ff3e" transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh
        position={[0, 2, 0]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onPick(index);
        }}
      >
        <cylinderGeometry args={[2.2, 2.2, 5, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
