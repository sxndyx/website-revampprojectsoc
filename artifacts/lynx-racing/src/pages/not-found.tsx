import { Link } from "react-router-dom";
import { useSeo } from "@/hooks/useSeo";
import { MonoLabel } from "@/components/fx/MonoLabel";

export default function NotFound() {
  useSeo({ title: "404 — Signal Lost" });

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 carbon-weave" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 bloom-violet-soft"
      />
      <div className="relative">
        <MonoLabel text="ERROR — SIGNAL LOST" className="text-acid" />
        <h1 className="mt-6 font-display text-7xl font-bold uppercase tracking-tight md:text-9xl">404</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-dim">
          This route isn't on the grid. The page you're after doesn't exist — or hasn't been built yet.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-3 bg-acid px-7 py-4 font-display text-sm font-bold uppercase tracking-widest text-[#0a0a0d] transition-colors hover:bg-acid/90"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
