import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { SectionHeader } from "@/components/SectionHeader";
import { DEPARTMENTS } from "@/data/site";

export default function Team() {
  useSeo({
    title: "Team",
    description:
      "UNSW Lynx Racing is built by students across engineering, design and business — organised into specialist squads, recruiting every intake.",
  });

  return (
    <div>
      <section className="container mx-auto px-6 py-16 md:py-24 lg:px-12">
        <SectionHeader
          code="TEAM"
          title="Built by students"
          subtitle="Lynx Racing is a student team at UNSW, organised into specialist squads across engineering, design and business. Every squad is recruiting as we build toward MotoStudent."
        />
      </section>

      <section className="container mx-auto px-6 pb-20 lg:px-12">
        <div className="grid grid-cols-1 gap-px border border-border/40 bg-border/40 md:grid-cols-2 lg:grid-cols-4">
          {DEPARTMENTS.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
              className="group flex flex-col bg-background p-7 transition-colors hover:bg-card/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
                  Recruiting
                </span>
              </div>
              <h3 className="mb-3 mt-5 font-display text-xl font-extrabold uppercase">{d.name}</h3>
              <p className="flex-1 text-sm font-light leading-relaxed text-muted-foreground">
                {d.blurb}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {d.skills.map((s) => (
                  <span
                    key={s}
                    className="border border-border bg-card px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 pb-28 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-6 border border-border bg-card/30 p-8 md:flex-row md:p-12">
          <div>
            <h3 className="font-display text-2xl font-extrabold uppercase md:text-3xl">
              Want your name on this grid?
            </h3>
            <p className="mt-2 font-light text-muted-foreground">
              We recruit across every squad, every intake. Many roles need drive, not experience.
            </p>
          </div>
          <Link
            to="/join"
            className="group inline-flex shrink-0 items-center gap-3 bg-primary px-8 py-4 font-display font-bold uppercase tracking-widest text-background transition-colors hover:bg-primary/90"
          >
            Join the team
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
