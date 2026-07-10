// Sponsors livery configurator data — branding zones across the MACHINE (bike
// side profile) and the HELMET, each mapped to a partnership tier. There are NO
// dollar amounts anywhere: partnership detail is "available on request". The
// bike is a concept in development, so nothing here implies a confirmed sponsor.

export type Mode = "machine" | "helmet";

export type Tier = "TITLE" | "PLATINUM" | "GOLD" | "SILVER" | "BRONZE" | "SUPPORTER";
export type ZoneTier = Exclude<Tier, "SUPPORTER">;

// Ordered high → low. SUPPORTER has no physical zone (see SUPPORTER_CARD).
export const TIER_ORDER: Tier[] = ["TITLE", "PLATINUM", "GOLD", "SILVER", "BRONZE", "SUPPORTER"];

export interface TierMeta {
  tier: Tier;
  blurb: string;
}

export const TIERS: TierMeta[] = [
  { tier: "TITLE", blurb: "Naming partner — the most prominent real estate on the machine and the helmet." },
  { tier: "PLATINUM", blurb: "Hero side surfaces, seen in every trackside pan and profile shot." },
  { tier: "GOLD", blurb: "High-traffic panels with strong on-board and photography exposure." },
  { tier: "SILVER", blurb: "Dynamic detail placements that shine in cornering and braking shots." },
  { tier: "BRONZE", blurb: "Signature accents on the rotating and moving parts of the bike." },
  { tier: "SUPPORTER", blurb: "Off-bike recognition across the website, social and the garage." },
];

export interface Exposure {
  track: number; // ON-TRACK VISIBILITY
  tv: number; // TV & LIVESTREAM
  photo: number; // PHOTOGRAPHY
  social: number; // SOCIAL MEDIA
  web: number; // WEBSITE
}

export const EXPOSURE_ROWS: { key: keyof Exposure; label: string }[] = [
  { key: "track", label: "On-Track Visibility" },
  { key: "tv", label: "TV & Livestream" },
  { key: "photo", label: "Photography" },
  { key: "social", label: "Social Media" },
  { key: "web", label: "Website" },
];

/** Hit/label region over a body panel: centre (x,y), size (w,h), rotation — all % / deg. */
export interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
}

export interface LiveryZone {
  id: string;
  mode: Mode;
  name: string;
  tier: ZoneTier;
  placement: string;
  exposure: Exposure;
  region: Region;
}

export const ZONES: LiveryZone[] = [
  // ---------------------------------------------------------------- MACHINE
  {
    id: "m-nose", mode: "machine", name: "Front Fairing & Windscreen", tier: "TITLE",
    placement: "The nose and screen surround — the face of the bike, in shot on every front and three-quarter frame.",
    exposure: { track: 5, tv: 5, photo: 5, social: 5, web: 5 },
    region: { x: 71.1, y: 24.2, w: 14.0, h: 30.7, rot: -8 },
  },
  {
    id: "m-flank", mode: "machine", name: "Upper Fairing Flanks", tier: "PLATINUM",
    placement: "The large side panels — prime real estate for trackside pans and profile photography.",
    exposure: { track: 5, tv: 5, photo: 5, social: 4, web: 4 },
    region: { x: 61.2, y: 47.1, w: 22.7, h: 27.1, rot: -6 },
  },
  {
    id: "m-tail", mode: "machine", name: "Tail Unit Sides", tier: "PLATINUM",
    placement: "The rear seat unit — seen in trailing shots, on the grid and through every overtaking camera.",
    exposure: { track: 4, tv: 4, photo: 4, social: 4, web: 4 },
    region: { x: 30.6, y: 32.5, w: 15.4, h: 22.4, rot: -12 },
  },
  {
    id: "m-tank", mode: "machine", name: "Tank Cover", tier: "GOLD",
    placement: "The top tank — front and centre on rider on-board cameras and overhead shots.",
    exposure: { track: 4, tv: 3, photo: 4, social: 4, web: 3 },
    region: { x: 51.0, y: 29.0, w: 18.3, h: 13.5, rot: -6 },
  },
  {
    id: "m-belly", mode: "machine", name: "Belly Pan", tier: "GOLD",
    placement: "The lower fairing — a bold banner that fills low cornering and kerb-level shots.",
    exposure: { track: 4, tv: 4, photo: 4, social: 3, web: 3 },
    region: { x: 49.6, y: 70.9, w: 26.5, h: 16.5, rot: -4 },
  },
  {
    id: "m-fender", mode: "machine", name: "Front Fender", tier: "SILVER",
    placement: "The front mudguard — dead centre of every hard-braking and front-end photograph.",
    exposure: { track: 3, tv: 3, photo: 3, social: 3, web: 3 },
    region: { x: 76.1, y: 52.9, w: 9.6, h: 16.7, rot: 0 },
  },
  {
    id: "m-swingarm", mode: "machine", name: "Swingarm", tier: "SILVER",
    placement: "The rear swingarm — a clean technical surface for detail and cornering shots.",
    exposure: { track: 3, tv: 2, photo: 3, social: 3, web: 3 },
    region: { x: 32.1, y: 58.7, w: 16.9, h: 18.2, rot: -6 },
  },
  {
    id: "m-hugger", mode: "machine", name: "Rear Hugger", tier: "BRONZE",
    placement: "The rear wheel hugger — a signature accent that moves with the bike.",
    exposure: { track: 2, tv: 2, photo: 2, social: 2, web: 3 },
    region: { x: 31.7, y: 50.4, w: 8.6, h: 11.3, rot: 0 },
  },
  {
    id: "m-rim", mode: "machine", name: "Wheel Rim Decals", tier: "BRONZE",
    placement: "The wheel rims — a hypnotic rotating accent in dynamic and slow-motion footage.",
    exposure: { track: 3, tv: 2, photo: 3, social: 3, web: 2 },
    // Mask spans BOTH rims; the marker sits on the front rim so it isn't mid-air.
    region: { x: 75.5, y: 66.5, w: 13.0, h: 24.0, rot: 0 },
  },

  // ----------------------------------------------------------------- HELMET
  {
    id: "h-crown", mode: "helmet", name: "Crown", tier: "TITLE",
    placement: "The top of the helmet — the on-board and podium hero shot, straight to camera.",
    exposure: { track: 5, tv: 5, photo: 5, social: 5, web: 4 },
    region: { x: 48.9, y: 23.1, w: 62.1, h: 21.1, rot: -4 },
  },
  {
    id: "h-side", mode: "helmet", name: "Side Shells", tier: "PLATINUM",
    placement: "The helmet sides — front and centre in interviews, portraits and paddock shots.",
    exposure: { track: 5, tv: 5, photo: 5, social: 4, web: 4 },
    region: { x: 57.3, y: 52.1, w: 56.6, h: 50.8, rot: -4 },
  },
  {
    id: "h-visor", mode: "helmet", name: "Upper Visor Strip", tier: "GOLD",
    placement: "The brow above the visor — squarely in frame on every front-on rider shot.",
    exposure: { track: 4, tv: 4, photo: 4, social: 4, web: 3 },
    region: { x: 36.9, y: 40.0, w: 26.2, h: 22.7, rot: -18 },
  },
  {
    id: "h-chin", mode: "helmet", name: "Chin Flanks", tier: "SILVER",
    placement: "The chin bar — a tight, high-impact placement for close-up photography.",
    exposure: { track: 3, tv: 3, photo: 4, social: 3, web: 3 },
    region: { x: 27.6, y: 66.5, w: 29.3, h: 27.0, rot: -8 },
  },
  {
    id: "h-spoiler", mode: "helmet", name: "Rear Spoiler", tier: "BRONZE",
    placement: "The aero spoiler — a distinctive accent that reads in trailing and tucked shots.",
    exposure: { track: 2, tv: 3, photo: 3, social: 2, web: 2 },
    region: { x: 74.3, y: 45.4, w: 32.0, h: 25.8, rot: 8 },
  },
];

export const SUPPORTER_CARD = {
  tier: "SUPPORTER" as const,
  title: "Supporter",
  blurb:
    "No panel required. Supporters back the team and are recognised off the bike — across the website partners wall, our social channels, and the garage banner at every event and reveal.",
  points: [
    "Logo on the website partners wall",
    "Recognition across social channels",
    "Garage & pit banner presence",
  ],
};

export function zonesForMode(mode: Mode): LiveryZone[] {
  return ZONES.filter((z) => z.mode === mode);
}

/**
 * ENQUIRE routes to the contact form pre-filled with the zone + tier (there is
 * no public team inbox, so we keep the enquiry inside the existing contact flow
 * rather than a mailto to an address we do not have).
 */
export function enquireHref(zone: LiveryZone): string {
  const surface = zone.mode === "helmet" ? "rider helmet" : "machine";
  const message =
    `I'd like to enquire about the ${zone.name} placement (${zone.tier} tier) on the Lynx Racing concept ${surface}. ` +
    `Please share the partnership details.`;
  const qs = new URLSearchParams({ intent: "sponsorship", subject: "Sponsorship", message });
  return `/contact?${qs.toString()}`;
}
