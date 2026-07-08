import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Handshake, Users } from "lucide-react";
import { BikeViewer } from "@/three/BikeViewer";
import { SponsorStrip } from "@/components/SponsorStrip";
import { MailingList } from "@/components/MailingList";
import { useLiveTelemetry } from "@/lib/telemetry";

const LINK_CARDS = [
  {
    icon: Cpu,
    eyebrow: "01 / Engineering",
    title: "The Bike",
    body: "Explore every subsystem of our electric superbike in an interactive 3D breakdown.",
    to: "/the-bike",
    cta: "See the engineering",
  },
  {
    icon: Handshake,
    eyebrow: "02 / Partnership",
    title: "Partner With Us",
    body: "Back the next generation of electric motorsport engineers with your brand.",
    to: "/sponsors",
    cta: "View sponsorship",
  },
  {
    icon: Users,
    eyebrow: "03 / Recruitment",
    title: "Join the Team",
    body: "Design, build and race. Find your department and help put Lynx on the grid.",
    to: "/join",
    cta: "Find your role",
  },
];

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
        {label}
      </span>
      <span className="font-display font-bold text-lg md:text-xl text-primary tabular-nums">
        {value}
      </span>
    </div>
  );
}

export default function Home() {
  const tele = useLiveTelemetry();

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative min-h-screen overflow-hidden bg-[#05070d]">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.12]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] bg-secondary/10 rounded-full blur-[160px] pointer-events-none" />

        {/* Decorative auto-rotating 3D bike (no interaction) */}
        <BikeViewer variant="hero" className="absolute inset-0 z-0" />

        {/* Legibility gradients */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-background via-background/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-background/70 via-transparent to-transparent pointer-events-none" />

        {/* Scan line */}
        <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
          <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scanline" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 min-h-screen flex flex-col justify-end pb-14 pt-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs md:text-sm tracking-[0.35em] uppercase text-primary mb-5"
          >
            UNSW · Student-Built · Electric Racing
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-display font-black uppercase leading-[0.85] tracking-tighter text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
          >
            Lynx <span className="text-primary text-glow-green">Racing</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-xl text-muted-foreground text-lg md:text-xl font-light leading-relaxed"
          >
            A team of UNSW students designing and building an original high-performance electric superbike from the ground up.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-9"
          >
            <Link
              to="/the-bike"
              className="group inline-flex items-center gap-3 bg-primary text-background font-display font-bold uppercase tracking-widest px-8 py-4 hover:bg-primary/90 transition-colors box-glow-green"
            >
              Explore the Bike
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Live stat row — honest to current stage */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-wrap gap-x-12 gap-y-6 border-t border-border/60 pt-8"
          >
            <HeroStat label="Pack Voltage" value={tele.voltage} />
            <HeroStat label="Status" value={tele.status} />
            <HeroStat label="Mode" value={tele.mode} />
          </motion.div>
        </div>

        {/* Corner HUD marker */}
        <div className="absolute top-28 right-8 z-[2] hidden md:block font-mono text-[10px] tracking-[0.3em] text-muted-foreground/50 text-right pointer-events-none">
          <p>LX-CONCEPT / 2026</p>
          <p className="text-primary/60 mt-1">SYSTEM {tele.system}</p>
        </div>
      </section>

      {/* ---------------- LINK CARDS ---------------- */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-px bg-border/40 border border-border/40">
            {LINK_CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={card.to}
                  className="group relative flex flex-col h-full bg-background p-8 lg:p-10 overflow-hidden hover:bg-card/40 transition-colors"
                >
                  <div className="absolute top-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full transition-all duration-500" />
                  <card.icon
                    size={32}
                    className="text-primary mb-8 group-hover:drop-shadow-[0_0_10px_rgba(168,255,62,0.7)] transition-all"
                  />
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
                    {card.eyebrow}
                  </span>
                  <h3 className="font-display font-extrabold uppercase text-2xl md:text-3xl mb-4">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground font-light leading-relaxed mb-8 flex-1">
                    {card.body}
                  </p>
                  <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary">
                    {card.cta}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SponsorStrip />
      <MailingList />
    </>
  );
}
