export type SchematicId =
  | "cad"
  | "manufacturing"
  | "simulation"
  | "battery"
  | "telemetry"
  | "software"
  | "suspension"
  | "testing"
  | "electronics";

export interface EngineeringModule {
  id: string;
  code: string;
  name: string;
  tag: string;
  schematic: SchematicId;
  facts: { k: string; v: string }[];
  body: string;
  toolchain: string;
}

/**
 * The nine disciplines of the engineering lab. All copy is honest process
 * fact — what the team actually does — with no invented performance numbers.
 */
export const ENGINEERING_MODULES: EngineeringModule[] = [
  {
    id: "cad",
    code: "01",
    name: "CAD",
    tag: "Every part exists digitally before it exists physically.",
    schematic: "cad",
    facts: [
      { k: "Output", v: "Full-Vehicle Assembly" },
      { k: "Method", v: "Top-Down Master Model" },
      { k: "State", v: "Active — Concept Geometry" },
    ],
    body: "The whole motorcycle lives as one parametric assembly — frame, battery box, drivetrain, bodywork — so a change to any hardpoint propagates everywhere it matters. Packaging studies run here first: where the mass sits, where the cables route, what the rider actually touches.",
    toolchain: "Industry-standard parametric CAD with full-vehicle configuration control.",
  },
  {
    id: "manufacturing",
    code: "02",
    name: "Manufacturing",
    tag: "Designs that can't be built don't count.",
    schematic: "manufacturing",
    facts: [
      { k: "Processes", v: "CNC · Welding · Composites" },
      { k: "Rule", v: "Design for Manufacture" },
      { k: "State", v: "Planning — First Parts" },
    ],
    body: "Every component is designed against the processes we can actually run — machined billet, welded alloy, wet-laid and eventually pre-preg composite bodywork. Manufacturing reviews sit inside the design loop, not after it, so the first chassis goes together without heroics.",
    toolchain: "CAM programming, jig and fixture design, composite layup planning.",
  },
  {
    id: "simulation",
    code: "03",
    name: "Simulation",
    tag: "Break it in the solver before it breaks on track.",
    schematic: "simulation",
    facts: [
      { k: "Structural", v: "FEA — Frame & Swingarm" },
      { k: "Aero", v: "CFD — Fairing & Cooling" },
      { k: "State", v: "Active — Load Cases" },
    ],
    body: "Frame stiffness targets, swingarm load paths and crash cases run through finite-element analysis; fairing shapes and radiator ducting run through CFD. Simulation is how a student team affords a wind tunnel and a test rig it doesn't own.",
    toolchain: "FEA and CFD solvers with hand-calculated sanity checks on every result.",
  },
  {
    id: "battery",
    code: "04",
    name: "Battery Systems",
    tag: "The pack is the heart, the structure and the hazard — all at once.",
    schematic: "battery",
    facts: [
      { k: "Architecture", v: "High-Voltage Li-ion" },
      { k: "Safety", v: "BMS · Isolation · Venting" },
      { k: "State", v: "Active — Cell Selection" },
    ],
    body: "Cell chemistry, pack layout, busbar design and the battery-management system are being engineered together against MotoStudent's electric-class safety rules. Thermal behaviour under race load drives the design as hard as energy density does.",
    toolchain: "Pack modelling, BMS configuration, high-voltage safety procedure design.",
  },
  {
    id: "telemetry",
    code: "05",
    name: "Telemetry",
    tag: "If it isn't logged, it didn't happen.",
    schematic: "telemetry",
    facts: [
      { k: "Bus", v: "CAN Network" },
      { k: "Channels", v: "Powertrain · Dynamics · Rider" },
      { k: "State", v: "Architecture Defined" },
    ],
    body: "Every sensor on the bike reports onto a CAN network and into a logging pipeline, so each bench run and track session becomes data the team can argue about. Live dashboards for the pit wall are part of the plan from day one.",
    toolchain: "Data acquisition hardware, CAN tooling and custom analysis dashboards.",
  },
  {
    id: "software",
    code: "06",
    name: "Software",
    tag: "The invisible subsystem that touches every other one.",
    schematic: "software",
    facts: [
      { k: "Firmware", v: "Vehicle Control · BMS" },
      { k: "Tools", v: "Telemetry & Analysis Apps" },
      { k: "State", v: "Active — Foundations" },
    ],
    body: "Embedded firmware runs the vehicle control logic, throttle mapping and safety interlocks; higher up the stack, the team builds its own telemetry viewers and analysis tools. Code is reviewed and version-controlled like the safety-critical work it is.",
    toolchain: "Embedded C/C++, Python tooling, hardware-in-the-loop test rigs.",
  },
  {
    id: "suspension",
    code: "07",
    name: "Suspension",
    tag: "Grip is a control problem wearing mechanical clothes.",
    schematic: "suspension",
    facts: [
      { k: "Front", v: "Inverted Fork" },
      { k: "Rear", v: "Monoshock + Linkage" },
      { k: "State", v: "Kinematics In Progress" },
    ],
    body: "Geometry, spring rates and damping targets are being defined from vehicle-dynamics first principles, then packaged around the electric drivetrain's very different mass map. Once the prototype rolls, telemetry closes the loop on every setup decision.",
    toolchain: "Kinematics modelling, vehicle-dynamics simulation, setup data analysis.",
  },
  {
    id: "testing",
    code: "08",
    name: "Testing",
    tag: "The plan survives contact with the bench, or it isn't a plan.",
    schematic: "testing",
    facts: [
      { k: "Stages", v: "Bench · Rolling · Track" },
      { k: "First Rig", v: "Powertrain Dyno Bench" },
      { k: "State", v: "Procedures In Draft" },
    ],
    body: "The programme steps from subsystem bench tests, to a rolling chassis shakedown, to full track running — each stage with written procedures, safety sign-off and defined pass criteria before the next one unlocks. Test data feeds straight back into design.",
    toolchain: "Instrumented bench rigs, structured test procedures, post-session data review.",
  },
  {
    id: "electronics",
    code: "09",
    name: "Electronics",
    tag: "A race bike is a rolling wiring loom with opinions.",
    schematic: "electronics",
    facts: [
      { k: "Systems", v: "LV Loom · Sensors · Dash" },
      { k: "Design", v: "Custom PCBs" },
      { k: "State", v: "Active — Schematics" },
    ],
    body: "The low-voltage architecture — sensor networks, rider controls, dash, and the custom PCBs that tie them together — is being designed for a machine that vibrates, gets wet and must fail safe. Loom routing is planned in CAD alongside the mechanical package.",
    toolchain: "Schematic capture and PCB layout, loom design, bench bring-up tooling.",
  },
];
