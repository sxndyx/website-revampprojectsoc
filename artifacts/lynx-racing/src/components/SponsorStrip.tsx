import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SPONSORS } from "@/data/site";

export function SponsorStrip() {
  const logos = SPONSORS.slice(0, 6);
  return (
    <section className="py-20 border-y border-border/60 bg-[#07070c]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.4em] text-primary">[ OUR SPONSORS ]</span>
          </div>
          <Link
            to="/sponsors"
            className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            View All
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-border/40 border border-border/40">
          {logos.map((s) => (
            <div
              key={s.name}
              className="group bg-background aspect-[3/2] flex items-center justify-center px-4"
            >
              <span className="font-display font-bold tracking-widest text-sm md:text-base text-muted-foreground/40 grayscale group-hover:text-primary group-hover:grayscale-0 transition-all duration-300 text-center">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
