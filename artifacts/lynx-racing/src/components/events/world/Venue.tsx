import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { bannerTexture, glowTexture, grassTexture, screenTexture, signTexture } from "./textures";

/* -------------------------------------------------------------------------- *
 * Night-venue dressing: ground, floodlights, grandstands with living crowds,
 * jumbotron and the start gantry. Everything is primitive geometry + canvas
 * textures + instancing — no model files, no shadow maps, no real lights
 * beyond the scene's two directionals (glow is faked with additive sprites).
 * -------------------------------------------------------------------------- */

/** Night-sky panorama wrapped around the venue on an inward-facing cylinder. */
export function SkyDome() {
  const tex = useMemo(() => {
    const t = new THREE.TextureLoader().load("/world/sky.png", (loaded) => {
      loaded.colorSpace = THREE.SRGBColorSpace;
    });
    t.wrapS = THREE.MirroredRepeatWrapping;
    t.repeat.set(2, 1);
    return t;
  }, []);
  return (
    <mesh position={[0, 52, 0]}>
      <cylinderGeometry args={[300, 300, 150, 48, 1, true]} />
      {/* fog=false keeps the horizon crisp beyond the scene fog falloff */}
      <meshBasicMaterial map={tex} side={THREE.BackSide} fog={false} />
    </mesh>
  );
}

export function VenueGround() {
  const grass = useMemo(grassTexture, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.14, 0]}>
      <circleGeometry args={[210, 72]} />
      <meshStandardMaterial map={grass} roughness={1} metalness={0} />
    </mesh>
  );
}

/* ------------------------------- Floodlight ------------------------------ */

export function Floodlight({ position }: { position: [number, number] }) {
  const glow = useMemo(glowTexture, []);
  const H = 26;
  return (
    <group position={[position[0], 0, position[1]]}>
      <mesh position={[0, H / 2, 0]}>
        <cylinderGeometry args={[0.28, 0.5, H, 8]} />
        <meshStandardMaterial color="#15151b" roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Head + lamp panel */}
      <mesh position={[0, H + 0.8, 0]}>
        <boxGeometry args={[4.6, 1.8, 0.8]} />
        <meshStandardMaterial color="#101015" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0, H + 0.8, 0.45]}>
        <planeGeometry args={[4.1, 1.3]} />
        <meshBasicMaterial color="#fff7df" toneMapped={false} />
      </mesh>
      {/* Faked beam + pool */}
      <mesh position={[0, H / 2 - 1, 3.2]} rotation={[0.22, 0, 0]}>
        <coneGeometry args={[7.5, H, 24, 1, true]} />
        <meshBasicMaterial
          color="#fff3cf"
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 6]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial
          map={glow}
          color="#ffedbb"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------- Grandstand ------------------------------ */

interface GrandstandProps {
  position: [number, number];
  rotationY: number;
  width?: number;
  tiers?: number;
  /** Stable seed so phone-light layouts differ between stands. */
  seed?: number;
}

/** Shared crowd photo — loaded once, reused by every stand. */
let crowdTex: THREE.Texture | null = null;
function getCrowdTexture(): THREE.Texture {
  if (!crowdTex) {
    crowdTex = new THREE.TextureLoader().load("/world/crowd.png", (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = THREE.RepeatWrapping;
      t.anisotropy = 4;
    });
  }
  return crowdTex;
}

export function Grandstand({ position, rotationY, width = 46, tiers = 7, seed = 1 }: GrandstandProps) {
  const banner = useMemo(() => {
    const t = bannerTexture();
    t.repeat.set(Math.max(1, Math.round(width / 34)), 1);
    return t;
  }, [width]);

  const phonesRef = useRef<THREE.Group>(null);

  // Tier slope the crowd photo lies on.
  const stepD = 1.7;
  const stepH = 0.92;
  const rise = tiers * stepH;
  const run = tiers * stepD;
  const slopeLen = Math.hypot(rise, run);
  const slopeTilt = -Math.atan2(run, rise); // tip the top of the plane away from the track
  const depth = run + 2.5;
  const height = 1.5 + rise + 1.2;

  const crowd = useMemo(() => {
    const t = getCrowdTexture().clone();
    t.needsUpdate = true;
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.set(Math.max(1, width / 26), 1);
    return t;
  }, [width]);

  // Deterministic phone-light spots on the slope.
  const phones = useMemo(() => {
    let s = seed * 748573;
    const rnd = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
    const out: [number, number, number][] = [];
    const n = Math.round(width / 3.2);
    for (let i = 0; i < n; i++) {
      const u = rnd(); // along width
      const v = rnd(); // up the slope
      out.push([
        -width / 2 + 1 + u * (width - 2),
        1.5 + v * rise + 0.3,
        -v * run - 0.1,
      ]);
    }
    return out;
  }, [width, rise, run, seed]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (phonesRef.current) {
      phonesRef.current.children.forEach((m, i) => {
        const mat = (m as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.4 + i * 2.4 + seed * 5));
      });
    }
  });

  return (
    <group position={[position[0], 0, position[1]]} rotation={[0, rotationY, 0]}>
      {/* Solid slope slab under the crowd photo */}
      <mesh position={[0, 1.5 + rise / 2 - 0.35, -run / 2 - 0.2]} rotation={[slopeTilt, 0, 0]}>
        <boxGeometry args={[width, slopeLen, 0.5]} />
        <meshStandardMaterial color="#0d0d12" roughness={0.9} />
      </mesh>
      {/* The crowd itself — photographic texture on the tier slope */}
      <mesh position={[0, 1.5 + rise / 2, -run / 2 + 0.12]} rotation={[slopeTilt, 0, 0]}>
        <planeGeometry args={[width - 0.6, slopeLen]} />
        <meshBasicMaterial map={crowd} color="#d6d6de" />
      </mesh>
      {/* Side walls close the structure */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (width / 2 + 0.2), height / 2 - 0.6, -run / 2]}>
          <boxGeometry args={[0.5, height - 1.2, depth]} />
          <meshStandardMaterial color="#0c0c11" roughness={0.85} />
        </mesh>
      ))}
      {/* Base wall + fascia banner facing the track */}
      <mesh position={[0, 0.75, 0.35]}>
        <boxGeometry args={[width, 1.5, 0.7]} />
        <meshStandardMaterial color="#0e0e13" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.28, 0.72]}>
        <planeGeometry args={[width - 1, 0.85]} />
        <meshBasicMaterial map={banner} toneMapped={false} />
      </mesh>
      {/* Live phone flashlights sprinkled over the photo crowd */}
      <group ref={phonesRef}>
        {phones.map((p, i) => (
          <mesh key={i} position={p}>
            <planeGeometry args={[0.16, 0.16]} />
            <meshBasicMaterial
              color="#cfe4ff"
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
      {/* Roof canopy with violet under-edge */}
      <mesh position={[0, height + 0.6, -depth / 2 + 0.6]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[width + 2, 0.35, depth + 1.5]} />
        <meshStandardMaterial color="#101016" roughness={0.6} metalness={0.35} />
      </mesh>
      <mesh position={[0, height + 0.38, 0.9]}>
        <boxGeometry args={[width + 2, 0.1, 0.1]} />
        <meshBasicMaterial color="#9b4dff" toneMapped={false} />
      </mesh>
      {/* Roof support columns */}
      {[-width / 2 + 1.5, 0, width / 2 - 1.5].map((x, i) => (
        <mesh key={i} position={[x, height / 2 + 0.3, -depth + 1.6]}>
          <cylinderGeometry args={[0.22, 0.28, height + 0.6, 6]} />
          <meshStandardMaterial color="#15151b" roughness={0.7} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------- Jumbotron ------------------------------ */

export function Jumbotron({ position, rotationY }: { position: [number, number]; rotationY: number }) {
  const screen = useMemo(screenTexture, []);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    // Broadcast flicker — barely perceptible, keeps the screen alive.
    if (matRef.current) matRef.current.opacity = 0.92 + 0.08 * Math.sin(clock.elapsedTime * 9.3);
  });
  return (
    <group position={[position[0], 0, position[1]]} rotation={[0, rotationY, 0]}>
      {[-5.4, 5.4].map((x, i) => (
        <mesh key={i} position={[x, 5, 0]}>
          <cylinderGeometry args={[0.3, 0.42, 10, 8]} />
          <meshStandardMaterial color="#14141a" roughness={0.7} metalness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 10.6, 0]}>
        <boxGeometry args={[13.4, 7.6, 0.7]} />
        <meshStandardMaterial color="#0b0b10" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, 10.6, 0.4]}>
        <planeGeometry args={[12.4, 6.6]} />
        <meshBasicMaterial ref={matRef} map={screen} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ------------------------------ Start gantry ----------------------------- */

export function StartGantry({
  point,
  side,
  trackWidth,
}: {
  point: THREE.Vector3;
  side: THREE.Vector3;
  trackWidth: number;
}) {
  const sign = useMemo(() => signTexture("Lynx GP", "Aragón · Concept"), []);
  const half = trackWidth / 2 + 2.4;
  const a = new THREE.Vector3().copy(point).addScaledVector(side, half);
  const b = new THREE.Vector3().copy(point).addScaledVector(side, -half);
  const angle = Math.atan2(side.x, side.z);
  return (
    <group>
      {[a, b].map((p, i) => (
        <mesh key={i} position={[p.x, 4.5, p.z]}>
          <boxGeometry args={[0.55, 9, 0.55]} />
          <meshStandardMaterial color="#131318" roughness={0.65} metalness={0.4} />
        </mesh>
      ))}
      <group position={[point.x, 8.6, point.z]} rotation={[0, angle + Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[half * 2 + 0.6, 1.9, 0.5]} />
          <meshStandardMaterial color="#0d0d12" roughness={0.6} metalness={0.35} />
        </mesh>
        {[0.29, -0.29].map((z, i) => (
          <mesh key={i} position={[0, 0, z]} rotation={[0, i === 1 ? Math.PI : 0, 0]}>
            <planeGeometry args={[6.2, 1.55]} />
            <meshBasicMaterial map={sign} transparent toneMapped={false} />
          </mesh>
        ))}
        {/* Start-light pods */}
        {[-2.6, -1.6, 1.6, 2.6].map((x, i) => (
          <mesh key={i} position={[x * (half / 3.2), -1.15, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshBasicMaterial color={i % 2 ? "#a6ff3e" : "#41414d"} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
