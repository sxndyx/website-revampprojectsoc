// Shared circuit definition for the Events "race program" experience. The same
// normalized centre-line and checkpoints drive BOTH the 3D scene and the 2D
// fallback, so they stay perfectly in sync. The layout is inspired by the
// character of MotorLand Aragón (sweeping corners + one long back straight) —
// it is a stylised interpretation, not a reproduction. All content is honest:
// Lynx is building toward its first MotoStudent campaign.

export interface CheckpointContent {
  id: string;
  index: number;
  corner: string; // short mono marker label, e.g. "T01"
  kicker: string; // section eyebrow
  title: string;
  body: string;
  t: number; // position along the closed curve, 0..1
}

/**
 * Circuit centre-line control points in a normalized (x, z) space, roughly
 * within [-52, 52]. Consumed as a CLOSED, uniform Catmull-Rom curve. Build the
 * three curve with `new CatmullRomCurve3(pts, true, "catmullrom", 0.5)` so it
 * matches `sampleCircuit()` below exactly.
 */
export const CIRCUIT_POINTS: [number, number][] = [
  [40, 36], [46, 12], [44, -12], [34, -30], [12, -37],
  [-10, -31], [-24, -15], [-17, 1], [-31, 13], [-45, 20],
  [-51, 34], [-42, 47], [-21, 49], [-3, 42], [9, 30],
  [6, 15], [17, 7], [29, 16], [35, 28],
];

export const CHECKPOINTS: CheckpointContent[] = [
  {
    id: "cp-what", index: 1, corner: "T01", kicker: "The Competition",
    title: "What is MotoStudent",
    body: "An international university motorcycle-engineering competition, raced at MotorLand Aragón in Spain. Student teams from around the world design, build and race a prototype over a two-year cycle.",
    t: 0.0,
  },
  {
    id: "cp-ms1", index: 2, corner: "T04", kicker: "Phase MS1",
    title: "The Engineering Phase",
    body: "MS1 is judged off the track: the design project, technical reports, cost and manufacturing analysis, innovation and a full business plan are presented to a panel of industry engineers.",
    t: 0.17,
  },
  {
    id: "cp-ms2", index: 3, corner: "T07", kicker: "Phase MS2",
    title: "The Track Phase",
    body: "MS2 puts the prototype on circuit: dynamic scrutineering, braking and acceleration tests, a handling gymkhana, and the final race against every other university team.",
    t: 0.34,
  },
  {
    id: "cp-electric", index: 4, corner: "T10", kicker: "The Category",
    title: "The Electric Grid",
    body: "Lynx is building for MotoStudent Electric — the battery-electric prototype class. Fixed voltage limits, real energy management, and the same racetrack as the combustion grid.",
    t: 0.5,
  },
  {
    id: "cp-roadmap", index: 5, corner: "T13", kicker: "Our Roadmap",
    title: "The Lynx Roadmap",
    body: "Design, manufacture, test, race. We are currently in the design-and-engineering stage — developing the concept and the team toward our first MotoStudent campaign.",
    t: 0.66,
  },
  {
    id: "cp-follow", index: 6, corner: "T16", kicker: "Stay Close",
    title: "Follow the Journey",
    body: "Follow the build as it happens, and be there before the first lap. Join the mailing list and follow the team across social.",
    t: 0.83,
  },
];

/**
 * Pure uniform Catmull-Rom sampler for the CLOSED loop, so the 2D fallback can
 * place checkpoints and draw the ribbon identically to the 3D curve without
 * importing three. Matches three's ("catmullrom", tension 0.5) on getPoint(t).
 */
export function sampleCircuit(t: number): { x: number; z: number } {
  const pts = CIRCUIT_POINTS;
  const n = pts.length;
  const u = (((t % 1) + 1) % 1) * n;
  const i = Math.floor(u);
  const f = u - i;
  const p0 = pts[(i - 1 + n) % n];
  const p1 = pts[i % n];
  const p2 = pts[(i + 1) % n];
  const p3 = pts[(i + 2) % n];
  const cr = (a: number, b: number, c: number, d: number) => {
    const f2 = f * f;
    const f3 = f2 * f;
    return 0.5 * (2 * b + (-a + c) * f + (2 * a - 5 * b + 4 * c - d) * f2 + (-a + 3 * b - 3 * c + d) * f3);
  };
  return { x: cr(p0[0], p1[0], p2[0], p3[0]), z: cr(p0[1], p1[1], p2[1], p3[1]) };
}

/** Bounds of the sampled curve, for mapping into a 2D viewBox. */
export function circuitBounds(samples = 240) {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (let i = 0; i < samples; i++) {
    const { x, z } = sampleCircuit(i / samples);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }
  return { minX, maxX, minZ, maxZ };
}
