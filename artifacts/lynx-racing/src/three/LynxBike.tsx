import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export type Subsystem =
  | "full"
  | "battery"
  | "motor"
  | "chassis"
  | "suspension"
  | "aero"
  | "telemetry";

// Lynx palette
const GREEN = "#A8FF3E";
const PURPLE = "#7B2CFF";
const BODY_DARK = "#0d0d15";
const BODY_MID = "#16161f";
const METAL = "#3a3d4a";
const TIRE = "#08080b";

interface Base {
  color?: string;
  emissive?: string;
  metalness?: number;
  roughness?: number;
  transparent?: boolean;
  opacity?: number;
}

// Material props that react to the active subsystem: the active part glows green,
// every other part dims back so the highlighted system reads clearly.
function hl(part: Subsystem, active: Subsystem, base: Base = {}) {
  const isActive = active === part;
  const dimmed = active !== "full" && !isActive;
  return {
    color: base.color ?? BODY_DARK,
    metalness: base.metalness ?? 0.55,
    roughness: base.roughness ?? 0.42,
    emissive: isActive ? GREEN : base.emissive ?? "#000000",
    emissiveIntensity: isActive ? (base.emissive ? 1.8 : 0.65) : base.emissive ? 0.9 : 0,
    transparent: dimmed || base.transparent || false,
    opacity: dimmed ? 0.13 : base.opacity ?? 1,
  };
}

// Parts that are never "the subject" of a subsystem (wheels, pegs) — they only dim.
function dimOnly(active: Subsystem, keep: Subsystem[] = []) {
  const dimmed = active !== "full" && !keep.includes(active);
  return { transparent: dimmed, opacity: dimmed ? 0.13 : 1 };
}

// A cylindrical strut between two 3D points (forks, swingarm, frame spars, bars).
function Strut({
  from,
  to,
  radius = 0.045,
  mat,
}: {
  from: [number, number, number];
  to: [number, number, number];
  radius?: number;
  mat: Record<string, unknown>;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = new THREE.Vector3().subVectors(b, a);
    const length = dir.length();
    const position = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    );
    return { position, quaternion, length };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[radius, radius, length, 18]} />
      <meshStandardMaterial {...mat} />
    </mesh>
  );
}

// A rounded bodywork panel with clamped corner radius (RoundedBox errors if radius
// exceeds half the smallest dimension).
function Panel({
  args,
  radius = 0.04,
  position,
  rotation,
  mat,
}: {
  args: [number, number, number];
  radius?: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  mat: Record<string, unknown>;
}) {
  const r = Math.max(0.004, Math.min(radius, Math.min(...args) / 2 - 0.003));
  return (
    <RoundedBox
      args={args}
      radius={r}
      smoothness={3}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial {...mat} />
    </RoundedBox>
  );
}

const R = 0.46; // wheel radius
const HW = 0.17; // half width for paired parts

function Wheel({ x, active }: { x: number; active: Subsystem }) {
  const spokes = useMemo(
    () => [0, 1, 2, 3, 4].map((i) => (i / 5) * Math.PI * 2),
    [],
  );
  const dim = dimOnly(active, ["chassis"]);
  return (
    <group position={[x, R, 0]}>
      {/* tyre */}
      <mesh castShadow>
        <torusGeometry args={[R, 0.12, 22, 52]} />
        <meshStandardMaterial color={TIRE} roughness={0.85} metalness={0.1} {...dim} />
      </mesh>
      {/* illuminated rim */}
      <mesh>
        <torusGeometry args={[R * 0.62, 0.03, 14, 44]} />
        <meshStandardMaterial
          color={GREEN}
          emissive={GREEN}
          emissiveIntensity={active === "full" || active === "chassis" ? 1.3 : 0.5}
          {...dim}
        />
      </mesh>
      {/* hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.18, 20]} />
        <meshStandardMaterial color={METAL} metalness={0.9} roughness={0.3} {...dim} />
      </mesh>
      {/* spokes */}
      {spokes.map((a, i) => (
        <mesh key={i} rotation={[0, 0, a]}>
          <boxGeometry args={[0.05, R * 1.16, 0.035]} />
          <meshStandardMaterial color={METAL} metalness={0.85} roughness={0.35} {...dim} />
        </mesh>
      ))}
      {/* brake disc */}
      <mesh position={[0, 0, 0.14]}>
        <torusGeometry args={[R * 0.52, 0.014, 8, 44]} />
        <meshStandardMaterial color="#6a6d78" metalness={0.9} roughness={0.4} {...dim} />
      </mesh>
    </group>
  );
}

export function LynxBike({ activeSubsystem = "full" }: { activeSubsystem?: Subsystem }) {
  const a = activeSubsystem;

  return (
    <group position={[0, -0.35, 0]}>
      {/* ---------- WHEELS ---------- */}
      <Wheel x={1.3} active={a} />
      <Wheel x={-1.3} active={a} />

      {/* ---------- SUSPENSION ---------- */}
      {/* triple clamp */}
      <Panel
        args={[0.16, 0.2, 0.36]}
        position={[0.95, 1.05, 0]}
        rotation={[0, 0, -0.28]}
        mat={hl("suspension", a, { color: METAL, metalness: 0.85, roughness: 0.3 })}
      />
      {[HW, -HW].map((z) => (
        <group key={`fork-${z}`}>
          {/* upper fork tube */}
          <Strut
            from={[0.98, 1.02, z]}
            to={[1.18, 0.72, z]}
            radius={0.045}
            mat={hl("suspension", a, { color: "#b8bcc8", metalness: 0.95, roughness: 0.2 })}
          />
          {/* lower fork slider */}
          <Strut
            from={[1.16, 0.78, z]}
            to={[1.3, 0.46, z]}
            radius={0.062}
            mat={hl("suspension", a, { color: METAL, metalness: 0.8, roughness: 0.35 })}
          />
        </group>
      ))}
      {/* swingarm */}
      {[HW, -HW].map((z) => (
        <Strut
          key={`swing-${z}`}
          from={[-0.3, 0.6, z]}
          to={[-1.3, 0.46, z]}
          radius={0.055}
          mat={hl("suspension", a, { color: METAL, metalness: 0.85, roughness: 0.3 })}
        />
      ))}
      {/* rear monoshock */}
      <Strut
        from={[-0.32, 0.62, 0]}
        to={[-0.08, 1.06, 0]}
        radius={0.05}
        mat={hl("suspension", a, { color: PURPLE, emissive: PURPLE, metalness: 0.5, roughness: 0.4 })}
      />

      {/* ---------- MOTOR / DRIVE ---------- */}
      <Panel
        args={[0.44, 0.44, 0.36]}
        radius={0.1}
        position={[-0.32, 0.66, 0]}
        mat={hl("motor", a, { color: "#20222c", metalness: 0.8, roughness: 0.3 })}
      />
      {/* motor cooling fins */}
      {[0, 1, 2].map((i) => (
        <mesh key={`fin-${i}`} position={[-0.32, 0.55 + i * 0.09, 0.19]}>
          <boxGeometry args={[0.4, 0.02, 0.02]} />
          <meshStandardMaterial
            color={GREEN}
            emissive={GREEN}
            emissiveIntensity={a === "motor" ? 1.8 : 0.7}
            {...dimOnly(a, ["motor"])}
          />
        </mesh>
      ))}
      {/* rear sprocket */}
      <mesh position={[-1.3, 0.46, 0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.03, 24]} />
        <meshStandardMaterial
          color={METAL}
          metalness={0.9}
          roughness={0.35}
          {...dimOnly(a, ["motor"])}
        />
      </mesh>

      {/* ---------- BATTERY ---------- */}
      <Panel
        args={[0.98, 0.5, 0.42]}
        radius={0.06}
        position={[0.12, 0.66, 0]}
        mat={hl("battery", a, { color: "#101018", metalness: 0.5, roughness: 0.45 })}
      />
      {/* battery cell ribs */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={`cell-${i}`} position={[-0.24 + i * 0.24, 0.66, 0.215]}>
          <boxGeometry args={[0.03, 0.42, 0.02]} />
          <meshStandardMaterial
            color={GREEN}
            emissive={GREEN}
            emissiveIntensity={a === "battery" ? 2 : 0.85}
            {...dimOnly(a, ["battery"])}
          />
        </mesh>
      ))}

      {/* ---------- CHASSIS ---------- */}
      {/* steering head */}
      <Strut
        from={[0.9, 1.14, 0]}
        to={[1.0, 0.88, 0]}
        radius={0.085}
        mat={hl("chassis", a, { color: METAL, metalness: 0.8, roughness: 0.35 })}
      />
      {/* twin spar frame */}
      {[HW, -HW].map((z) => (
        <Strut
          key={`spar-${z}`}
          from={[0.9, 1.08, z]}
          to={[-0.28, 0.82, z]}
          radius={0.07}
          mat={hl("chassis", a, { color: "#2b2e3a", metalness: 0.75, roughness: 0.35 })}
        />
      ))}
      {/* subframe / tail support */}
      {[0.12, -0.12].map((z) => (
        <Strut
          key={`sub-${z}`}
          from={[-0.28, 0.9, z]}
          to={[-0.98, 1.08, z]}
          radius={0.035}
          mat={hl("chassis", a, { color: METAL, metalness: 0.8, roughness: 0.35 })}
        />
      ))}

      {/* ---------- AERO / BODYWORK ---------- */}
      {/* fuel-cell / tank cover */}
      <Panel
        args={[0.8, 0.28, 0.46]}
        radius={0.12}
        position={[0.36, 1.15, 0]}
        rotation={[0, 0, -0.07]}
        mat={hl("aero", a, { color: BODY_DARK, metalness: 0.6, roughness: 0.32 })}
      />
      {/* seat */}
      <Panel
        args={[0.62, 0.1, 0.34]}
        radius={0.045}
        position={[-0.52, 1.06, 0]}
        mat={hl("aero", a, { color: "#0a0a0f", roughness: 0.8, metalness: 0.2 })}
      />
      {/* tail unit (kicks up at the rear) */}
      <Panel
        args={[0.52, 0.2, 0.3]}
        radius={0.06}
        position={[-0.94, 1.17, 0]}
        rotation={[0, 0, 0.24]}
        mat={hl("aero", a, { color: BODY_MID, metalness: 0.6, roughness: 0.35 })}
      />
      {/* nose fairing / front cowl */}
      <Panel
        args={[0.36, 0.62, 0.5]}
        radius={0.14}
        position={[1.07, 1.02, 0]}
        rotation={[0, 0, -0.32]}
        mat={hl("aero", a, { color: BODY_DARK, metalness: 0.62, roughness: 0.3 })}
      />
      {/* windscreen */}
      <Panel
        args={[0.28, 0.32, 0.36]}
        radius={0.05}
        position={[0.86, 1.35, 0]}
        rotation={[0, 0, -0.62]}
        mat={hl("aero", a, {
          color: "#0b1a10",
          metalness: 0.3,
          roughness: 0.1,
          transparent: true,
          opacity: 0.4,
        })}
      />
      {/* belly pan */}
      <Panel
        args={[1.16, 0.3, 0.42]}
        radius={0.1}
        position={[0.16, 0.36, 0]}
        rotation={[0, 0, 0.03]}
        mat={hl("aero", a, { color: BODY_MID, metalness: 0.6, roughness: 0.35 })}
      />
      {/* side fairing panels + Lynx claw slashes */}
      {[0.2, -0.2].map((z) => (
        <group key={`side-${z}`}>
          <Panel
            args={[1.26, 0.74, 0.05]}
            radius={0.02}
            position={[0.46, 0.74, z]}
            rotation={[0, 0, -0.05]}
            mat={hl("aero", a, { color: BODY_DARK, metalness: 0.62, roughness: 0.3 })}
          />
          {/* three claw slashes */}
          {[0, 1, 2].map((i) => (
            <mesh
              key={`claw-${z}-${i}`}
              position={[0.62 - i * 0.12, 0.92 - i * 0.14, z + (z > 0 ? 0.03 : -0.03)]}
              rotation={[0, 0, -0.7]}
            >
              <boxGeometry args={[0.03, 0.34 - i * 0.05, 0.012]} />
              <meshStandardMaterial
                color={GREEN}
                emissive={GREEN}
                emissiveIntensity={a === "aero" ? 2 : 1}
                {...dimOnly(a, ["aero"])}
              />
            </mesh>
          ))}
        </group>
      ))}
      {/* winglets */}
      {[0.34, -0.34].map((z) => (
        <Panel
          key={`wing-${z}`}
          args={[0.36, 0.04, 0.18]}
          radius={0.02}
          position={[1.0, 0.92, z]}
          rotation={[0, z > 0 ? -0.2 : 0.2, -0.1]}
          mat={hl("aero", a, { color: "#1a1a24", metalness: 0.6, roughness: 0.35 })}
        />
      ))}
      {/* split headlight + DRL */}
      {[0.11, -0.11].map((z) => (
        <mesh key={`hl-${z}`} position={[1.26, 1.04, z]} rotation={[0, 0, -0.32]}>
          <boxGeometry args={[0.05, 0.12, 0.06]} />
          <meshStandardMaterial
            color={GREEN}
            emissive={GREEN}
            emissiveIntensity={a === "aero" ? 2.4 : 1.6}
            {...dimOnly(a, ["aero"])}
          />
        </mesh>
      ))}
      {/* tail light */}
      <mesh position={[-1.16, 1.2, 0]}>
        <boxGeometry args={[0.04, 0.05, 0.24]} />
        <meshStandardMaterial
          color={GREEN}
          emissive={GREEN}
          emissiveIntensity={a === "aero" ? 2.4 : 1.5}
          {...dimOnly(a, ["aero"])}
        />
      </mesh>

      {/* ---------- TELEMETRY / COCKPIT ---------- */}
      <Panel
        args={[0.24, 0.06, 0.3]}
        radius={0.02}
        position={[0.72, 1.32, 0]}
        rotation={[0, 0, -0.42]}
        mat={hl("telemetry", a, {
          color: "#04140a",
          emissive: GREEN,
          metalness: 0.2,
          roughness: 0.2,
        })}
      />
      {/* clip-on bars */}
      {[0.04, -0.04].map((z) => (
        <Strut
          key={`bar-${z}`}
          from={[0.86, 1.2, z]}
          to={[0.7, 1.26, z > 0 ? 0.27 : -0.27]}
          radius={0.026}
          mat={hl("telemetry", a, { color: METAL, metalness: 0.85, roughness: 0.3 })}
        />
      ))}

      {/* rider pegs (neutral) */}
      {[0.26, -0.26].map((z) => (
        <mesh key={`peg-${z}`} position={[-0.32, 0.56, z]}>
          <boxGeometry args={[0.14, 0.03, 0.08]} />
          <meshStandardMaterial color={METAL} metalness={0.8} roughness={0.4} {...dimOnly(a)} />
        </mesh>
      ))}
    </group>
  );
}
