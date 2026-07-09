import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { Reveal } from "@/components/fx/Reveal";
import { MonoLabel } from "@/components/fx/MonoLabel";
import { ConceptCaption } from "@/components/fx/ConceptCaption";
import { Magnetic } from "@/components/fx/Magnetic";
import { EASE_OUT_STRONG } from "@/lib/motion";
import { DEPARTMENTS } from "@/data/site";

const BASE = import.meta.env.BASE_URL;
const HERO_SRCSET = `${BASE}renders/hero-960.webp 960w, ${BASE}renders/hero-1280.webp 1280w, ${BASE}renders/hero-1920.webp 1920w`;

const TICKER = [
  "PROTOTYPE 01",
  "FULL ELECTRIC",
  "MOTOSTUDENT",
  "MOTORLAND ARAGÓN",
  "UNSW · SYDNEY",
  "PHASE: CONCEPT",
  "ENGINEERED FROM ZERO",
];

const PROGRAM: { no: string; title: string; line: string }[] = [
  {
    no: "01",
    title: "Design",
    line: "Concept, CAD and simulation. Every system is modelled, analysed and iterated long before a single part is cut.",
  },
  {
    no: "02",
    title: "Build",
    line: "Fabrication, assembly and bench testing of the battery pack, powertrain and chassis — turning files into hardware.",
  },
  {
    no: "03",
    title: "Race",
    line: "Shakedown, data and setup — the road from a rolling prototype to the grid at MotorLand Aragón.",
  },
];

const SYSTEMS: { name: string; specs: [string, string][] }[] = [
  { name: "Battery", specs: [["Architecture", "High-Voltage"], ["Role", "Structural"], ["Status", "In Dev"]] },
  { name: "Powertrain", specs: [["Motor", "PMSM (target)"], ["Cooling", "Liquid"], ["Status", "In Dev"]] },
  { name: "Chassis", specs: [["Concept", "Twin-Spar"], ["Method", "FEA-Driven"], ["Status", "In Dev"]] },
];

export default function Home() {
  useSeo({
    title: "Lynx Racing — Concept Electric Superbike | UNSW",
    description:
      "UNSW Lynx Racing is engineering Australia's next-generation electric racing superbike — a student-built prototype bound for MotoStudent at MotorLand Aragón, Spain.",
  });

  return (
    <div>
      <Hero />
      <Ticker />

      <div className="mx-auto max-w-[1600px] px-5 lg:px-10">
        {/* THE PROGRAM */}
        <section className="py-24 md:py-32" aria-labelledby="program-title">
          <SectionIntro
            code="THE PROGRAM"
            id="program-title"
            title="Design. Build. Race."
            desc="One student team, one build season, one goal — put Australia's first electric racing superbike concept on track."
          />
          <ProgramList />
        </section>

        {/* SYSTEMS */}
        <section className="border-t border-hairline py-24 md:py-32" aria-labelledby="systems-title">
          <SectionIntro
            code="SYSTEMS"
            id="systems-title"
            title="Under the fairing"
            desc="Three systems define the machine. Every one is in active development for MotoStudent scrutineering."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {SYSTEMS.map((s, i) => (
              <Reveal onView delay={i * 0.08} key={s.name}>
                <Link
                  to="/engineering"
                  className="group flex h-full flex-col border border-hairline bg-surface/40 p-6 transition-colors hover:border-acid/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="mono-label text-ink-dim">{String(i + 1).padStart(2, "0")}</span>
                    <ArrowUpRight
                      className="text-ink-dim transition-colors group-hover:text-acid"
                      size={18}
                      aria-hidden
                    />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold uppercase">{s.name}</h3>
                  <dl className="mt-5 space-y-2 border-t border-hairline pt-4">
                    {s.specs.map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between">
                        <dt className="mono-label text-ink-dim">{k}</dt>
                        <dd className="mono-label text-ink">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* DEPARTMENTS */}
        <section className="border-t border-hairline py-24 md:py-32" aria-labelledby="depts-title">
          <SectionIntro
            code="THE TEAM"
            id="depts-title"
            title="Built by students"
            desc="Engineers, fabricators, coders and business students across every discipline it takes to build a race bike."
          />
          <Reveal onView>
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map((d) => (
                <Link
                  key={d.name}
                  to="/team"
                  className="border border-hairline px-4 py-2 mono-label text-ink-dim transition-colors hover:border-acid/40 hover:text-acid"
                >
                  {d.name}
                </Link>
              ))}
            </div>
          </Reveal>
        </section>
      </div>

      <SponsorBand />
    </div>
  );
}

function Hero() {
  const reduced = useReducedMotion();
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 carbon-weave" />
      <div aria-hidden className="pointer-events-none absolute inset-0 hairline-grid opacity-25 animate-grid-pan" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] max-w-[92vw] -translate-x-1/2 -translate-y-[38%] bloom-violet"
      />
      <Dust />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center px-5 py-12 text-center lg:px-10">
        <Reveal>
          <MonoLabel text="UNSW LYNX RACING — SYDNEY, AUSTRALIA" className="text-ink-dim" />
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-5 font-display text-6xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl xl:text-9xl">
            The First <span className="text-acid text-acid-glow">Lynx</span>
          </h1>
        </Reveal>

        <Reveal delay={0.1} className="relative mt-6 w-full">
          <div className={`relative mx-auto w-full max-w-5xl ${reduced ? "" : "animate-bob"}`}>
            <img
              src={`${BASE}renders/hero-1920.webp`}
              srcSet={HERO_SRCSET}
              sizes="(max-width: 1024px) 100vw, 1024px"
              width={2752}
              height={1536}
              alt="Lynx Racing concept electric superbike, front three-quarter view"
              loading="eager"
              decoding="async"
              className="h-auto w-full select-none object-contain"
              draggable={false}
            />
            {/* sweeping sheen */}
            {!reduced && (
              <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-md animate-sheen" />
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-dim md:text-lg">
            A concept electric superbike, engineered from zero by students at UNSW — bound for
            MotoStudent at MotorLand Aragón, Spain. It doesn't exist yet. We're building it in the open.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Magnetic className="inline-flex">
              <Link
                to="/the-bike"
                className="inline-flex items-center gap-3 bg-acid px-7 py-4 font-display text-sm font-bold uppercase tracking-widest text-[#0a0a0d] transition-colors hover:bg-acid/90"
              >
                Explore the Prototype <ArrowRight size={16} aria-hidden />
              </Link>
            </Magnetic>
            <Magnetic className="inline-flex">
              <Link
                to="/sponsors"
                className="inline-flex items-center gap-3 border border-hairline px-7 py-4 font-display text-sm font-bold uppercase tracking-widest text-ink transition-colors hover:border-acid/50 hover:text-acid"
              >
                Back the Build <ArrowUpRight size={16} aria-hidden />
              </Link>
            </Magnetic>
          </div>
        </Reveal>

        <div className="mt-8">
          <ConceptCaption />
        </div>
      </div>
    </section>
  );
}

function Dust() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  const dots = Array.from({ length: 14 });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((_, i) => {
        const left = (i * 37) % 100;
        const top = (i * 23) % 100;
        const size = 1 + (i % 3);
        const dur = 8 + (i % 6);
        const delay = i % 5;
        const drift = 20 + (i % 4) * 10;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
            animate={{ y: [0, -drift, 0], opacity: [0, 0.5, 0] }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      })}
    </div>
  );
}

function Ticker() {
  const reduced = useReducedMotion();
  const items = [...TICKER, ...TICKER];
  return (
    <div className="relative overflow-hidden border-y border-hairline bg-surface/40 py-3">
      <motion.div
        className="flex w-max items-center gap-8 whitespace-nowrap"
        animate={reduced ? undefined : { x: ["0%", "-50%"] }}
        transition={reduced ? undefined : { duration: 32, ease: "linear", repeat: Infinity }}
      >
        {items.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-8 mono-label text-ink-dim">
            {t}
            <span className="h-1 w-1 rounded-full bg-acid/60" aria-hidden />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function SectionIntro({
  code,
  title,
  desc,
  id,
}: {
  code: string;
  title: string;
  desc?: string;
  id?: string;
}) {
  return (
    <Reveal onView className="mb-10 md:mb-14">
      <MonoLabel text={code} className="text-acid" />
      <h2
        id={id}
        className="mt-4 max-w-3xl font-display text-4xl font-bold uppercase tracking-tight md:text-6xl"
      >
        {title}
      </h2>
      {desc && <p className="mt-4 max-w-2xl text-ink-dim">{desc}</p>}
    </Reveal>
  );
}

function ProgramList() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t border-hairline">
      {PROGRAM.map((p, i) => {
        const isOpen = open === i;
        return (
          <div key={p.no} className="border-b border-hairline">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              onMouseEnter={() => setOpen(i)}
              className="group flex w-full items-center gap-5 py-6 text-left md:gap-8"
              aria-expanded={isOpen}
            >
              <span className="mono-label text-ink-dim transition-colors group-hover:text-acid">
                {p.no}
              </span>
              <span className="font-display text-3xl font-bold uppercase text-ink transition-colors group-hover:text-acid md:text-5xl">
                {p.title}
              </span>
              <ArrowUpRight
                className={`ml-auto shrink-0 text-ink-dim transition-all group-hover:text-acid ${
                  isOpen ? "rotate-90" : ""
                }`}
                size={22}
                aria-hidden
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT_STRONG }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 text-ink-dim">{p.line}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function SponsorBand() {
  return (
    <section className="relative overflow-hidden border-t border-hairline" aria-labelledby="sponsor-title">
      <div aria-hidden className="pointer-events-none absolute inset-0 carbon-weave" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 bloom-violet-soft"
      />
      <div className="relative mx-auto max-w-4xl px-5 py-28 text-center lg:px-10">
        <Reveal onView>
          <MonoLabel text="SPONSORSHIP" className="text-acid" />
        </Reveal>
        <Reveal onView delay={0.05}>
          <h2
            id="sponsor-title"
            className="mt-4 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight md:text-7xl"
          >
            Put your name on the first one
          </h2>
        </Reveal>
        <Reveal onView delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-ink-dim">
            Founding partners get in before the first Lynx exists — on the bike, in the garage and
            across every render as a student team builds something Australia hasn't built before.
          </p>
        </Reveal>
        <Reveal onView delay={0.15}>
          <div className="mt-9 flex justify-center">
            <Magnetic className="inline-flex">
              <Link
                to="/sponsors"
                className="inline-flex items-center gap-3 bg-acid px-7 py-4 font-display text-sm font-bold uppercase tracking-widest text-[#0a0a0d] transition-colors hover:bg-acid/90"
              >
                Back the Build <ArrowRight size={16} aria-hidden />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
