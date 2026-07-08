export interface Sponsor {
  name: string;
  tier: "Technical" | "Gold" | "Silver" | "Community";
}

export const SPONSORS: Sponsor[] = [
  { name: "VOLTCORE", tier: "Technical" },
  { name: "APEX COMPOSITES", tier: "Technical" },
  { name: "MERIDIAN EV", tier: "Gold" },
  { name: "NORTHWIND", tier: "Gold" },
  { name: "DRIVETRAIN LABS", tier: "Silver" },
  { name: "IONFLUX", tier: "Silver" },
  { name: "CARBON9", tier: "Silver" },
  { name: "CAMPUS MAKERS", tier: "Community" },
  { name: "GRID SUPPLY CO", tier: "Community" },
  { name: "UNSW ENGINEERING", tier: "Community" },
];

export const SPONSOR_TIERS: {
  tier: Sponsor["tier"];
  blurb: string;
}[] = [
  { tier: "Technical", blurb: "Core engineering partners supplying the hardware and expertise the bike is built on." },
  { tier: "Gold", blurb: "Major backers powering the build season from concept to track." },
  { tier: "Silver", blurb: "Supporting partners helping us close the gap between design and reality." },
  { tier: "Community", blurb: "Institutions and local partners championing student motorsport." },
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

export interface Member {
  name: string;
  role: string;
  dept: string;
}

export const TEAM: Member[] = [
  { name: "A. Nguyen", role: "Team Principal", dept: "Leadership" },
  { name: "M. Cho", role: "Technical Director", dept: "Leadership" },
  { name: "S. Patel", role: "Powertrain Lead", dept: "Powertrain" },
  { name: "J. Reyes", role: "Battery Lead", dept: "Battery" },
  { name: "K. O'Brien", role: "Chassis Lead", dept: "Chassis" },
  { name: "L. Zhang", role: "Suspension Lead", dept: "Suspension" },
  { name: "T. Kaur", role: "Aerodynamics Lead", dept: "Aerodynamics" },
  { name: "D. Martin", role: "Electronics Lead", dept: "Electronics" },
  { name: "R. Ali", role: "Software Lead", dept: "Software" },
  { name: "E. Costa", role: "Operations Lead", dept: "Business" },
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
    blurb: "Cell selection, pack architecture, BMS and thermal management for an 800V system.",
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
