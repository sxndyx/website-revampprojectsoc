import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Trail } from "@react-three/drei";
import { glowTexture } from "./textures";

/* -------------------------------------------------------------------------- *
 * A small stylised race bike + leaning rider, built from primitives. Follows
 * the closed circuit curve, banks through corners, varies pace down the lap,
 * and is clickable to trigger the dive-to-ride transition.
 * -------------------------------------------------------------------------- */

const UP = new THREE.Vector3(0, 1, 0);
const FWD = new THREE.Vector3(0, 0, 1);
const _p = new THREE.Vector3();
const _look = new THREE.Vector3();
const _tan = new THREE.Vector3();
const _tan2 = new THREE.Vector3();
const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _qBank = new THREE.Quaternion();

interface RaceBikeProps {
  curve: THREE.CatmullRomCurve3;
  color: string;
  u0: number;
  speed: number;
  onPick: (u: number) => void;
}

export function RaceBike({ curve, color, u0, speed, onPick }: RaceBikeProps) {
  const group = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Mesh>(null);
  const u = useRef(u0);
  const glow = useMemo(glowTexture, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    // Pace varies along the lap — braking zones and straights, not a metronome.
    const pace = speed * (1 + 0.28 * Math.sin(u.current * Math.PI * 2 * 3 + u0 * 19));
    u.current = (u.current + pace * dt) % 1;

    const g = group.current;
    if (!g) return;
    curve.getPoint(u.current, _p);
    curve.getTangent(u.current, _tan).normalize();
    curve.getPoint((u.current + 0.012) % 1, _look);
    _m.lookAt(_p, _look, UP);
    _q.setFromRotationMatrix(_m);

    // Bank into corners from tangent change (same convention as the ride cam).
    curve.getTangent((u.current + 0.02) % 1, _tan2).normalize();
    const turn = _tan.x * _tan2.z - _tan.z * _tan2.x;
    const bank = THREE.MathUtils.clamp(turn * 16, -0.62, 0.62);
    _qBank.setFromAxisAngle(FWD, bank);
    _q.multiply(_qBank);

    g.position.set(_p.x, 0.02 + Math.sin(state.clock.elapsedTime * 17 + u0 * 40) * 0.012, _p.z);
    g.quaternion.copy(_q);
  });

  return (
    <group>
      <group
        ref={group}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onPick(u.current);
        }}
        onPointerOver={() => { document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = ""; }}
      >
        {/* Wheels */}
        <mesh position={[0, 0.34, 0.78]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.3, 0.11, 8, 18]} />
          <meshStandardMaterial color="#0c0c0f" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.36, -0.72]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.32, 0.13, 8, 18]} />
          <meshStandardMaterial color="#0c0c0f" roughness={0.9} />
        </mesh>
        {/* Body + tank + tail */}
        <mesh position={[0, 0.62, 0.05]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[0.34, 0.34, 1.5]} />
          <meshStandardMaterial color="#17171d" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.84, 0.12]}>
          <boxGeometry args={[0.3, 0.2, 0.55]} />
          <meshStandardMaterial color="#101014" roughness={0.35} metalness={0.55} />
        </mesh>
        <mesh position={[0, 0.88, -0.62]} rotation={[0.32, 0, 0]}>
          <boxGeometry args={[0.24, 0.14, 0.5]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Windscreen */}
        <mesh position={[0, 0.94, 0.62]} rotation={[-0.62, 0, 0]}>
          <planeGeometry args={[0.26, 0.24]} />
          <meshStandardMaterial color="#2a2a36" roughness={0.15} metalness={0.7} transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
        {/* Rider tucked in */}
        <mesh position={[0, 0.98, -0.18]} rotation={[0.9, 0, 0]}>
          <capsuleGeometry args={[0.16, 0.42, 3, 8]} />
          <meshStandardMaterial color="#121217" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.12, 0.22]}>
          <sphereGeometry args={[0.15, 10, 10]} />
          <meshStandardMaterial color={color} roughness={0.25} metalness={0.4} />
        </mesh>
        {/* Headlight */}
        <mesh position={[0, 0.66, 0.86]}>
          <planeGeometry args={[0.75, 0.75]} />
          <meshBasicMaterial map={glow} color="#eef3ff" transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
        {/* Headlight cast on tarmac */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 2.6]}>
          <planeGeometry args={[3.2, 5]} />
          <meshBasicMaterial map={glow} color="#dfe9ff" transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        {/* Tail-light — the Trail anchor (Trail tracks world position, so
            nesting inside the moving group is fine) */}
        <Trail width={1.9} length={6.5} color={color} attenuation={(t) => t * t} decay={1}>
          <mesh ref={tail} position={[0, 0.72, -0.88]}>
            <sphereGeometry args={[0.07, 6, 6]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        </Trail>
      </group>
    </group>
  );
}
