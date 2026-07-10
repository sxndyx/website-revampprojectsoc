import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { Reveal } from "@/components/fx/Reveal";
import { MonoLabel } from "@/components/fx/MonoLabel";
import { Magnetic } from "@/components/fx/Magnetic";
import { DEPARTMENTS } from "@/data/site";
import { EASE_OUT_STRONG } from "@/lib/motion";

const SEATS = ["Squad Lead", "Core Engineer", "Core Engineer", "New Member"];

/**
 * Departments as garage bays: full-bleed rows with oversized indices, one bay
 * open at a time revealing the squad's remit, skills and honest recruiting
 * seat states. No fake names anywhere.
 */
export default function Team() {
  useSeo({
    title: "Team — The Squads",
    description:
      "UNSW Lynx Racing is built by student squads across powertrain, battery, chassis, suspension, aero, electronics, software and business — recruiting every intake.",
  });

  const reduced = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 carbon-weave" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 h-[42rem] w-[42rem] bloom-violet-soft"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-14 lg:px-10 lg:py-20">
        <Reveal>
          <MonoLabel text="THE SQUADS — RECRUITING EVERY INTAKE" className="text-acid" />
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight md:text-7xl">
            Built by students
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-ink-dim">
            Eight specialist squads share one garage and one goal: put the first Lynx on the
            MotoStudent grid. Open a bay to see what each squad owns.
          </p>
        </Reveal>

        {/* Bays */}
        <div className="mt-12 border-t border-hairline">
          {DEPARTMENTS.map((d, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={d.name} onView amount={0.2}>
                <div className="border-b border-hairline">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group grid w-full grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-5 text-left outline-none transition-colors md:grid-cols-[7rem_1fr_auto] md:gap-8"
                  >
                    <span
                      aria-hidden
                      className={`font-display text-4xl font-bold leading-none tracking-tight transition-colors duration-300 md:text-6xl ${
                        isOpen ? "text-acid" : "text-ink/10 group-hover:text-ink/30"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block font-display text-2xl font-bold uppercase tracking-tight md:text-3xl">
                        {d.name}
                      </span>
                      <span className="mt-1 hidden text-sm text-ink-dim sm:block">{d.blurb}</span>
                    </span>
                    <span
                      className={`mono-label transition-colors ${
                        isOpen ? "text-acid" : "text-ink-dim group-hover:text-ink"
                      }`}
                    >
                      {isOpen ? "CLOSE" : "OPEN BAY"}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                        exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: reduced ? 0.15 : 0.5, ease: EASE_OUT_STRONG }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-8 pb-8 pl-[3.5rem] pr-1 md:grid-cols-[1.3fr_1fr] md:gap-12 md:pl-[7rem]">
                          <div>
                            <p className="text-ink-dim sm:hidden">{d.blurb}</p>
                            <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
                              {d.skills.map((s) => (
                                <span
                                  key={s}
                                  className="border border-hairline bg-surface px-2.5 py-1.5 mono-label text-ink-dim"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                            <p className="mt-5 inline-flex items-center gap-2 mono-label text-ink-dim">
                              <Clock size={12} aria-hidden /> {d.commitment}
                            </p>
                          </div>

                          <div>
                            <p className="mono-label text-ink-dim">BAY ROSTER</p>
                            <ul className="mt-3 divide-y divide-hairline border-y border-hairline">
                              {SEATS.map((seat, si) => (
                                <li key={si} className="flex items-center justify-between py-2.5">
                                  <span className="text-sm text-ink">{seat}</span>
                                  <span className="mono-label inline-flex items-center gap-1.5 text-acid">
                                    <span aria-hidden className="h-1 w-1 rounded-full bg-acid animate-pulse-dot" />
                                    Recruiting
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* CTA */}
        <Reveal onView className="mt-14">
          <div className="relative overflow-hidden border border-hairline bg-surface/60 p-8 md:p-12">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 bloom-acid" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight md:text-3xl">
                  Every seat above is real
                </h2>
                <p className="mt-2 max-w-xl text-ink-dim">
                  No stock-photo team here — the roster fills as students join. Take a seat before
                  the first chassis is welded.
                </p>
              </div>
              <Magnetic className="inline-flex shrink-0">
                <Link
                  to="/join"
                  className="inline-flex items-center gap-3 bg-acid px-7 py-4 font-display text-sm font-bold uppercase tracking-widest text-[#0a0a0d] transition-colors hover:bg-acid/90"
                >
                  Join the team <ArrowRight size={16} aria-hidden />
                </Link>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
