export interface NavDestination {
  label: string;
  to: string;
  /** One-line description revealed on hover in the full-screen menu. */
  desc: string;
}

/** Compact primary links shown in the persistent top bar. */
export const PRIMARY_NAV: NavDestination[] = [
  { label: "The Bike", to: "/the-bike", desc: "Inspect Prototype 01, system by system." },
  { label: "Engineering", to: "/engineering", desc: "The technical program behind the build." },
  { label: "Sponsors", to: "/sponsors", desc: "Put your name on the first one." },
  { label: "Events", to: "/events", desc: "The road to MotorLand Aragón." },
];

/** Every destination, listed in the full-screen menu overlay. */
export const ALL_NAV: NavDestination[] = [
  { label: "Home", to: "/", desc: "The concept reveal." },
  { label: "The Bike", to: "/the-bike", desc: "Inspect Prototype 01, system by system." },
  { label: "Engineering", to: "/engineering", desc: "Battery, powertrain, chassis and controls." },
  { label: "Sponsors", to: "/sponsors", desc: "Back the first Lynx." },
  { label: "Events", to: "/events", desc: "The road to MotorLand Aragón, Spain." },
  { label: "Team", to: "/team", desc: "The students engineering it." },
  { label: "Gallery", to: "/gallery", desc: "Renders, concepts and build log." },
  { label: "Join", to: "/join", desc: "Build it with us — all departments." },
  { label: "Contact", to: "/contact", desc: "Reach the team." },
];
