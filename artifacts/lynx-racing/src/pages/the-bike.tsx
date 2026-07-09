import { useSeo } from "@/hooks/useSeo";
import { Reveal } from "@/components/fx/Reveal";
import { MonoLabel } from "@/components/fx/MonoLabel";
import { InspectionStage } from "@/components/bike/InspectionStage";

export default function TheBike() {
  useSeo({
    title: "The Bike — Prototype 01",
    description:
      "Inspect the Lynx Racing concept electric superbike system by system — battery, powertrain, chassis, suspension and more, all in active development for MotoStudent.",
  });

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 carbon-weave" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 bloom-violet-soft"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-14 lg:px-10 lg:py-20">
        <Reveal>
          <MonoLabel text="PROTOTYPE 01 — CLASSIFIED DEVELOPMENT BUILD" className="text-acid" />
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight md:text-7xl">
            Inspect the machine
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-ink-dim">
            Eight systems, each in active development. Select a marker to inspect it —{" "}
            <span className="text-ink">use the arrow keys to cycle</span> and{" "}
            <span className="text-ink">Esc</span> to exit. Nothing here is final; it's how the first
            Lynx is taking shape.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <InspectionStage />
        </Reveal>
      </div>
    </section>
  );
}
