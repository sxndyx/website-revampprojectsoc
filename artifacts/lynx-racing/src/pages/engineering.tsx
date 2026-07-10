import { useRef, useState } from "react";
import { useSeo } from "@/hooks/useSeo";
import { Reveal } from "@/components/fx/Reveal";
import { MonoLabel } from "@/components/fx/MonoLabel";
import { Schematic } from "@/components/engineering/Schematic";
import { ModuleView } from "@/components/engineering/ModuleView";
import { ENGINEERING_MODULES } from "@/data/engineering";

/**
 * The digital engineering lab — an explorable blueprint workspace. Each tile
 * is a discipline; opening one expands a full-screen module inspector.
 */
export default function Engineering() {
  useSeo({
    title: "Engineering — The Lab",
    description:
      "Inside the Lynx Racing engineering programme: CAD, manufacturing, simulation, battery systems, telemetry, software, suspension, testing and electronics.",
  });

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const close = () => {
    const idx = openIndex;
    setOpenIndex(null);
    if (idx !== null) tileRefs.current[idx]?.focus();
  };

  return (
    <section className="relative overflow-hidden">
      {/* Blueprint atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 carbon-weave" />
      <div aria-hidden className="pointer-events-none absolute inset-0 hairline-grid opacity-40 animate-grid-pan" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/3 h-[44rem] w-[44rem] -translate-x-1/2 bloom-violet-soft"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-14 lg:px-10 lg:py-20">
        <Reveal>
          <MonoLabel text="THE LAB — NINE DISCIPLINES, ONE MACHINE" className="text-acid" />
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight md:text-7xl">
            The engineering floor
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-ink-dim">
            This is where the first Lynx is actually being built — as models, meshes, schematics
            and procedures. Open a discipline to see what the team is working on right now.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {ENGINEERING_MODULES.map((m, i) => (
            <Reveal key={m.id} delay={0.06 * (i % 3)} onView className="bg-[#0a0a0d]">
              <button
                ref={(el) => {
                  tileRefs.current[i] = el;
                }}
                onClick={() => setOpenIndex(i)}
                aria-haspopup="dialog"
                className="group relative flex h-full w-full flex-col p-7 text-left outline-none transition-colors duration-300 hover:bg-surface focus-visible:bg-surface"
              >
                {/* Hover corner brackets */}
                <span aria-hidden className="absolute left-2 top-2 h-3 w-3 border-l border-t border-transparent transition-colors duration-300 group-hover:border-acid/60 group-focus-visible:border-acid/60" />
                <span aria-hidden className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-transparent transition-colors duration-300 group-hover:border-acid/60 group-focus-visible:border-acid/60" />

                <div className="flex items-baseline justify-between">
                  <span className="font-display text-3xl font-bold text-ink/10 transition-colors duration-300 group-hover:text-acid/70">
                    {m.code}
                  </span>
                  <span className="mono-label text-ink-dim opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    OPEN
                  </span>
                </div>

                <Schematic
                  id={m.schematic}
                  className="mt-5 h-28 w-auto self-start opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                />

                <h2 className="mt-5 font-display text-xl font-bold uppercase tracking-tight">
                  {m.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-dim">{m.tag}</p>

                <span className="mono-label mt-5 inline-flex items-center gap-2 text-ink-dim">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-acid/70" />
                  {m.facts[m.facts.length - 1]?.v}
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal onView className="mt-8">
          <p className="mono-label text-ink-dim">
            ALL SYSTEMS IN ACTIVE DEVELOPMENT FOR MOTOSTUDENT — NOTHING HERE IS FINAL
          </p>
        </Reveal>
      </div>

      <ModuleView index={openIndex} onClose={close} onNavigate={setOpenIndex} />
    </section>
  );
}
