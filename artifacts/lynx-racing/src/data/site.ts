export type SponsorTier = "Technical" | "Gold" | "Silver" | "Community";

export const SPONSOR_TIERS: {
  tier: SponsorTier;
  blurb: string;
  slots: string;
}[] = [
  {
    tier: "Technical",
    blurb: "Core engineering partners supplying the hardware and expertise the bike is built on.",
    slots: "Founding slots open",
  },
  {
    tier: "Gold",
    blurb: "Major backers powering the build season from concept to track.",
    slots: "Founding slots open",
  },
  {
    tier: "Silver",
    blurb: "Supporting partners helping us close the gap between design and reality.",
    slots: "Founding slots open",
  },
  {
    tier: "Community",
    blurb: "Institutions and local partners championing student motorsport.",
    slots: "Welcoming partners",
  },
];

export interface RaceEvent {
  name: string;
  location: string;
  date: string;
  type: string;
  status: "ACTIVE" | "UPCOMING" | "TBC";
}

export const EVENTS: RaceEvent[] = [
  { name: "Build Season Kickoff", location: "UNSW, Sydney", date: "Q1 2026", type: "Internal Milestone", status: "ACTIVE" },
  { name: "Powertrain Bench Testing", location: "UNSW Willis Annexe", date: "Q2 2026", type: "Development", status: "UPCOMING" },
  { name: "Rolling Chassis Shakedown", location: "Sydney Motorsport Park", date: "Q3 2026", type: "Track Test", status: "UPCOMING" },
  { name: "Public Reveal", location: "Sydney", date: "Q4 2026", type: "Showcase", status: "TBC" },
  { name: "Electric Race Debut", location: "To Be Confirmed", date: "2027", type: "Competition", status: "TBC" },
];

export interface Department {
  name: string;
  blurb: string;
  skills: string[];
  commitment: string;
}

export const DEPARTMENTS: Department[] = [
  {
    name: "Powertrain",
    blurb: "Motor selection, inverter integration and final drive for a high-voltage electric package.",
    skills: ["Mech Eng", "Power Electronics", "CAD"],
    commitment: "8–12 hrs / week",
  },
  {
    name: "Battery",
    blurb: "Cell selection, pack architecture, BMS and thermal management for a high-voltage system.",
    skills: ["Elec Eng", "Thermal", "Embedded"],
    commitment: "8–12 hrs / week",
  },
  {
    name: "Chassis",
    blurb: "Frame design, geometry and manufacturing of the twin-spar structure.",
    skills: ["Mech Eng", "FEA", "Fabrication"],
    commitment: "6–10 hrs / week",
  },
  {
    name: "Suspension",
    blurb: "Kinematics, damping and setup of the front fork and rear monoshock.",
    skills: ["Mech Eng", "Dynamics", "Testing"],
    commitment: "6–10 hrs / week",
  },
  {
    name: "Aerodynamics",
    blurb: "Bodywork, winglets and CFD to shape an aggressive, stable aero package.",
    skills: ["Aero", "CFD", "Composites"],
    commitment: "6–10 hrs / week",
  },
  {
    name: "Electronics",
    blurb: "Low-voltage systems, wiring looms, sensors and the CAN-bus network.",
    skills: ["Elec Eng", "PCB Design", "CAN"],
    commitment: "6–10 hrs / week",
  },
  {
    name: "Software",
    blurb: "Firmware, telemetry pipeline, dashboards and data analysis tools.",
    skills: ["C / C++", "Python", "Embedded"],
    commitment: "6–10 hrs / week",
  },
  {
    name: "Business",
    blurb: "Sponsorship, finance, marketing and everything that keeps the team on track.",
    skills: ["Marketing", "Finance", "Comms"],
    commitment: "4–8 hrs / week",
  },
];
