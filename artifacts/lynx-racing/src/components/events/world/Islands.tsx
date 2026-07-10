import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { glowTexture, signTexture } from "./textures";

/* -------------------------------------------------------------------------- *
 * Fan-world "islands": themed zones dotted around the venue, world-map style.
 * Active islands glow and move; COMING SOON islands sit as darkened
 * silhouettes behind low fences, lit only by a faint violet rim.
 * -------------------------------------------------------------------------- */

function IslandPad({
  radius = 9,
  dim = false,
}: {
  radius?: number;
  dim?: boolean;
}) {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[radius, 40]} />
        <meshStandardMaterial color={dim ? "#0a0a0e" : "#111116"} roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[radius - 0.35, radius, 48]} />
        <meshBasicMaterial
          color={dim ? "#3a2560" : "#a6ff3e"}
          transparent
          opacity={dim ? 0.35 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

function SignBoard({
  title,
  subtitle,
  dim = false,
  y = 5,
}: {
  title: string;
  subtitle: string;
  dim?: boolean;
  y?: number;
}) {
  const tex = useMemo(() => signTexture(title, subtitle, { dim }), [title, subtitle, dim]);
  return (
    <group position={[0, y, 0]}>
      {[-2.6, 2.6].map((x, i) => (
        <mesh key={i} position={[x, -y / 2 + 0.2, 0]}>
          <cylinderGeometry args={[0.09, 0.12, y - 0.6, 6]} />
          <meshStandardMaterial color="#16161c" roughness={0.7} metalness={0.3} />
        </mesh>
      ))}
      {[0, Math.PI].map((ry, i) => (
        <mesh key={i} rotation={[0, ry, 0]} position={[0, 0, i === 0 ? 0.03 : -0.03]}>
          <planeGeometry args={[6.4, 2.1]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} opacity={dim ? 0.8 : 1} />
        </mesh>
      ))}
    </group>
  );
}

/** Low rope fence around COMING SOON islands. */
function Fence({ radius }: { radius: number }) {
  const posts = useMemo(() => {
    const arr: [number, number][] = [];
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      arr.push([Math.cos(a) * radius, Math.sin(a) * radius]);
    }
    return arr;
  }, [radius]);
  return (
    <group>
      {posts.map((p, i) => (
        <mesh key={i} position={[p[0], 0.55, p[1]]}>
          <cylinderGeometry args={[0.06, 0.06, 1.1, 5]} />
          <meshStandardMaterial color="#1a1a22" roughness={0.8} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.05, 0]}>
        <torusGeometry args={[radius, 0.035, 6, 48]} />
        <meshBasicMaterial color="#9b4dff" transparent opacity={0.32} />
      </mesh>
    </group>
  );
}

/* -------------------------------- BBQ Terrace ---------------------------- */

export function BbqTerrace({ position, rotationY }: { position: [number, number]; rotationY: number }) {
  const glow = useMemo(glowTexture, []);
  const smokeRefs = useRef<THREE.Mesh[]>([]);
  const emberRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    smokeRefs.current.forEach((m, i) => {
      if (!m) return;
      const p = ((t * 0.14 + i * 0.23) % 1 + 1) % 1;
      m.position.y = 1.4 + p * 5.5;
      m.position.x = 2.9 + Math.sin(t * 0.6 + i * 2.1) * (0.3 + p * 0.9);
      const s = 0.7 + p * 2.4;
      m.scale.set(s, s, s);
      (m.material as THREE.MeshBasicMaterial).opacity = 0.16 * (1 - p);
    });
    if (emberRef.current) emberRef.current.opacity = 0.75 + 0.25 * Math.sin(t * 5.7);
  });

  // Picnic tables: top + two benches, arranged around the pad.
  const tables: [number, number, number][] = [
    [-3.4, 0, 1.6], [-1.2, 0, -3.4], [2.2, 0, 3.6],
  ];

  return (
    <group position={[position[0], 0, position[1]]} rotation={[0, rotationY, 0]}>
      <IslandPad radius={9.5} />
      <SignBoard title="BBQ Terrace" subtitle="Open · Race Days" />

      {/* Grill station */}
      <group position={[2.9, 0, 0.2]}>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.7, 1.1, 1.0]} />
          <meshStandardMaterial color="#1a1a20" roughness={0.6} metalness={0.5} />
        </mesh>
        <mesh position={[0, 1.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.5, 0.85]} />
          <meshBasicMaterial ref={emberRef} color="#ff7a2f" transparent opacity={0.9} toneMapped={false} />
        </mesh>
        {/* Ember glow pool */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <planeGeometry args={[7, 7]} />
          <meshBasicMaterial map={glow} color="#ff8c3f" transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        {/* Smoke */}
        {Array.from({ length: 5 }, (_, i) => (
          <mesh
            key={i}
            ref={(el) => { if (el) smokeRefs.current[i] = el; }}
            position={[0, 1.4, 0]}
            rotation={[-Math.PI / 12, 0, 0]}
          >
            <planeGeometry args={[1.6, 1.6]} />
            <meshBasicMaterial map={glow} color="#9aa0ab" transparent opacity={0.14} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* Picnic tables */}
      {tables.map(([x, , z], i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, i * 1.1, 0]}>
          <mesh position={[0, 0.78, 0]}>
            <boxGeometry args={[2.3, 0.12, 1.1]} />
            <meshStandardMaterial color="#241a12" roughness={0.85} />
          </mesh>
          {[-0.75, 0.75].map((zz, j) => (
            <mesh key={j} position={[0, 0.45, zz]}>
              <boxGeometry args={[2.3, 0.09, 0.35]} />
              <meshStandardMaterial color="#1d1510" roughness={0.85} />
            </mesh>
          ))}
          {[-0.9, 0.9].map((xx, j) => (
            <mesh key={j} position={[xx, 0.4, 0]}>
              <boxGeometry args={[0.14, 0.8, 1.05]} />
              <meshStandardMaterial color="#17110c" roughness={0.85} />
            </mesh>
          ))}
        </group>
      ))}

      {/* String lights between two poles */}
      <StringLights from={[-6.5, 3.1, -2.5]} to={[5.6, 3.4, 4.4]} />
    </group>
  );
}

function StringLights({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const bulbs = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const out: THREE.Vector3[] = [];
    for (let i = 0; i <= 11; i++) {
      const t = i / 11;
      const p = a.clone().lerp(b, t);
      p.y -= Math.sin(t * Math.PI) * 0.9; // sag
      out.push(p);
    }
    return out;
  }, [from, to]);
  return (
    <group>
      {[from, to].map((p, i) => (
        <mesh key={i} position={[p[0], p[1] / 2, p[2]]}>
          <cylinderGeometry args={[0.07, 0.1, p[1], 6]} />
          <meshStandardMaterial color="#16161c" roughness={0.7} />
        </mesh>
      ))}
      {bulbs.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.09, 6, 6]} />
          <meshBasicMaterial color={i % 3 === 1 ? "#ffd9a0" : "#ffedbb"} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* --------------------------------- Paddock ------------------------------- */

export function Paddock({ position, rotationY }: { position: [number, number]; rotationY: number }) {
  return (
    <group position={[position[0], 0, position[1]]} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 2.4, -2]}>
        <boxGeometry args={[22, 4.8, 7]} />
        <meshStandardMaterial color="#101015" roughness={0.75} metalness={0.2} />
      </mesh>
      {/* Three open garage bays, interiors glowing acid */}
      {[-7, 0, 7].map((x, i) => (
        <group key={i} position={[x, 0, 1.55]}>
          <mesh position={[0, 1.75, 0]}>
            <planeGeometry args={[4.6, 3.5]} />
            <meshBasicMaterial color="#0c130a" toneMapped={false} />
          </mesh>
          <mesh position={[0, 1.75, 0.02]}>
            <planeGeometry args={[4.2, 3.1]} />
            <meshBasicMaterial color="#a6ff3e" transparent opacity={0.16 + i * 0.03} toneMapped={false} />
          </mesh>
          <mesh position={[0, 3.6, 0.05]}>
            <boxGeometry args={[4.6, 0.18, 0.1]} />
            <meshBasicMaterial color="#a6ff3e" transparent opacity={0.7} toneMapped={false} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 5.05, -2]} rotation={[0.06, 0, 0]}>
        <boxGeometry args={[23, 0.3, 8]} />
        <meshStandardMaterial color="#0d0d12" roughness={0.6} metalness={0.35} />
      </mesh>
      <SignBoard title="Lynx Paddock" subtitle="Garage 01–03" y={7} />
    </group>
  );
}

/* ------------------------------- Coming soon ------------------------------ */

type SilhouetteKind = "stage" | "karts" | "market";

const DIM_MAT_PROPS = {
  color: "#0b0b10",
  roughness: 0.9,
  metalness: 0.05,
  emissive: "#1c1030",
  emissiveIntensity: 0.5,
} as const;

function Silhouette({ kind }: { kind: SilhouetteKind }) {
  if (kind === "stage") {
    return (
      <group>
        <mesh position={[0, 0.5, -1.5]}>
          <boxGeometry args={[8.5, 1, 5]} />
          <meshStandardMaterial {...DIM_MAT_PROPS} />
        </mesh>
        {[-3.7, 3.7].map((x, i) => (
          <mesh key={i} position={[x, 2.8, -1.5]}>
            <boxGeometry args={[0.4, 4.6, 0.4]} />
            <meshStandardMaterial {...DIM_MAT_PROPS} />
          </mesh>
        ))}
        <mesh position={[0, 5, -1.5]}>
          <boxGeometry args={[8.9, 0.5, 1.2]} />
          <meshStandardMaterial {...DIM_MAT_PROPS} />
        </mesh>
      </group>
    );
  }
  if (kind === "karts") {
    return (
      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, -0.5]}>
          <torusGeometry args={[5.2, 0.55, 4, 40]} />
          <meshStandardMaterial {...DIM_MAT_PROPS} />
        </mesh>
        {[[-2, 2.2], [2.4, -1.4], [0.4, -3.6]].map((p, i) => (
          <mesh key={i} position={[p[0], 0.35, p[1] - 0.5]}>
            <boxGeometry args={[0.9, 0.5, 0.6]} />
            <meshStandardMaterial {...DIM_MAT_PROPS} />
          </mesh>
        ))}
      </group>
    );
  }
  // market
  return (
    <group>
      {[[-3, 0, 0], [0.4, 0, -2.4], [3.4, 0, 0.6]].map((p, i) => (
        <group key={i} position={[p[0], 0, p[2]]} rotation={[0, i * 0.9, 0]}>
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[2.4, 2, 1.9]} />
            <meshStandardMaterial {...DIM_MAT_PROPS} />
          </mesh>
          <mesh position={[0, 2.35, 0]} rotation={[0, 0, 0.06]}>
            <boxGeometry args={[2.9, 0.16, 2.3]} />
            <meshStandardMaterial {...DIM_MAT_PROPS} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function ComingSoonIsland({
  position,
  rotationY,
  title,
  kind,
}: {
  position: [number, number];
  rotationY: number;
  title: string;
  kind: SilhouetteKind;
}) {
  return (
    <group position={[position[0], 0, position[1]]} rotation={[0, rotationY, 0]}>
      <IslandPad radius={8.5} dim />
      <Fence radius={8.5} />
      <Silhouette kind={kind} />
      <SignBoard title={title} subtitle="Coming Soon" dim />
    </group>
  );
}
