export interface SystemSpec {
  k: string;
  v: string;
}

export interface BikeSystem {
  id: string;
  name: string;
  /** Hotspot centre as a percentage of the side-profile image box. */
  hotspot: { x: number; y: number };
  specs: SystemSpec[];
  objective: string;
  detail: string;
}

/**
 * The eight inspectable systems on The Bike page. Positions are tuned against
 * the master side-profile render (front wheel to the right, rear to the left).
 * All copy is honest: every system is in active development for MotoStudent.
 */
export const BIKE_SYSTEMS: BikeSystem[] = [
  {
    id: "battery",
    name: "Battery Pack",
    hotspot: { x: 56, y: 42 },
    specs: [
      { k: "Status", v: "In Development" },
      { k: "Architecture", v: "High-Voltage Li-ion" },
      { k: "Role", v: "Stressed Member" },
      { k: "Focus", v: "Thermal · BMS" },
    ],
    objective: "Pack the most usable energy into the smallest, safest structural unit.",
    detail:
      "The pack is being designed to double as a load-bearing part of the chassis. Cell layout, busbar routing and a bespoke battery-management system are all in active development ahead of MotoStudent scrutineering.",
  },
  {
    id: "motor",
    name: "Motor & Inverter",
    hotspot: { x: 49, y: 57 },
    specs: [
      { k: "Status", v: "In Development" },
      { k: "Type", v: "PMSM (target)" },
      { k: "Cooling", v: "Liquid" },
      { k: "Control", v: "Field-Oriented" },
    ],
    objective: "Deliver race-grade power density with predictable, controllable torque.",
    detail:
      "We are selecting a permanent-magnet motor and inverter package sized for the MotoStudent envelope, with a control strategy tuned for corner-exit traction rather than headline peak numbers.",
  },
  {
    id: "frame",
    name: "Chassis Frame",
    hotspot: { x: 52, y: 35 },
    specs: [
      { k: "Status", v: "In Development" },
      { k: "Concept", v: "Twin-Spar" },
      { k: "Material", v: "Alloy (under review)" },
      { k: "Method", v: "FEA-Driven" },
    ],
    objective: "Hit a target stiffness balance without carrying a gram of excess mass.",
    detail:
      "Frame geometry is being iterated in CAD and validated with finite-element analysis, wrapping tightly around the battery and motor package to keep the centre of mass low and central.",
  },
  {
    id: "swingarm",
    name: "Swingarm",
    hotspot: { x: 36, y: 62 },
    specs: [
      { k: "Status", v: "In Development" },
      { k: "Concept", v: "Braced Single-Sided" },
      { k: "Drive", v: "Chain (under review)" },
      { k: "Focus", v: "Rigidity · Mass" },
    ],
    objective: "Put the rear contact patch to work with a controlled, consistent load path.",
    detail:
      "The swingarm and rear-suspension linkage are being developed together so the drivetrain reaction and traction demands are handled predictably under acceleration.",
  },
  {
    id: "suspension",
    name: "Front Suspension",
    hotspot: { x: 72, y: 51 },
    specs: [
      { k: "Status", v: "In Development" },
      { k: "Front", v: "Inverted Fork" },
      { k: "Setup", v: "Data-Led" },
      { k: "Focus", v: "Kinematics" },
    ],
    objective: "Keep the front tyre planted and communicative from brake to apex.",
    detail:
      "Suspension kinematics, geometry and damping targets are being defined now and will be refined against telemetry once the rolling chassis reaches the track.",
  },
  {
    id: "electronics",
    name: "Cockpit Electronics",
    hotspot: { x: 65, y: 25 },
    specs: [
      { k: "Status", v: "In Development" },
      { k: "Network", v: "CAN Bus" },
      { k: "Display", v: "Race Dash" },
      { k: "Data", v: "Full Telemetry" },
    ],
    objective: "Give the rider clean, glanceable control and give engineers rich data.",
    detail:
      "A CAN-based low-voltage architecture, rider dash and telemetry pipeline are in development so every session on the prototype turns into usable engineering data.",
  },
  {
    id: "cooling",
    name: "Cooling System",
    hotspot: { x: 62, y: 50 },
    specs: [
      { k: "Status", v: "In Development" },
      { k: "Loops", v: "Battery · Drive" },
      { k: "Method", v: "Liquid-Cooled" },
      { k: "Focus", v: "Thermal Headroom" },
    ],
    objective: "Hold the pack and drivetrain in their happy window, lap after lap.",
    detail:
      "Cooling for the battery and powertrain is being packaged into the fairing airflow, sizing radiators and loops to protect performance across a full race distance.",
  },
  {
    id: "aero",
    name: "Aerodynamics",
    hotspot: { x: 71, y: 22 },
    specs: [
      { k: "Status", v: "In Development" },
      { k: "Tools", v: "CFD" },
      { k: "Bodywork", v: "Composite" },
      { k: "Focus", v: "Stability · Cooling" },
    ],
    objective: "Balance low drag against front-end stability and cooling airflow.",
    detail:
      "Fairing surfaces and winglets are being shaped in CFD, trading outright drag against the downforce and cooling airflow the electric package needs to stay stable at speed.",
  },
];
