import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { MonoLabel } from "@/components/fx/MonoLabel";
import { Magnetic } from "@/components/fx/Magnetic";

interface ModulePlaceholderProps {
  code: string;
  title: string;
  blurb: string;
  items: string[];
}

/** Dark, on-brand "module initialising" screen for routes built out in Phase 3. */
export function ModulePlaceholder({ code, title, blurb, items }: ModulePlaceholderProps) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 carbon-weave" />
      <div aria-hidden className="pointer-events-none absolute inset-0 hairline-grid opacity-30" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[40rem] w-[40rem] -translate-x-1/2 bloom-violet-soft"
      />
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col items-center justify-center px-5 py-24 text-center lg:px-10">
        <Reveal>
          <MonoLabel text={`MODULE — ${code}`} className="text-ink-dim" />
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-6 font-display text-6xl font-bold uppercase tracking-tight md:text-8xl">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <span className="mt-6 inline-flex items-center gap-2 border border-acid/30 bg-acid/5 px-4 py-2">
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full rounded-full bg-acid animate-pulse-dot" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-acid" />
            </span>
            <span className="mono-label text-acid">Module Initialising</span>
          </span>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-8 max-w-xl text-ink-dim">{blurb}</p>
        </Reveal>
        <Reveal delay={0.2} className="w-full max-w-lg">
          <ul className="mt-10 divide-y divide-hairline border-y border-hairline text-left">
            {items.map((it, i) => (
              <li key={it} className="flex items-center gap-4 py-3">
                <span className="mono-label text-ink-dim">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm text-ink">{it}</span>
                <span className="ml-auto mono-label text-ink-dim">Queued</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Magnetic className="inline-flex">
              <Link
                to="/the-bike"
                className="inline-flex items-center gap-3 bg-acid px-6 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-[#0a0a0d] transition-colors hover:bg-acid/90"
              >
                Explore the Bike <ArrowRight size={16} aria-hidden />
              </Link>
            </Magnetic>
            <Magnetic className="inline-flex">
              <Link
                to="/"
                className="inline-flex items-center gap-3 border border-hairline px-6 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-ink transition-colors hover:border-acid/50 hover:text-acid"
              >
                Back to Home <ArrowUpRight size={16} aria-hidden />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
