import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { TEAM } from "@/data/site";

function monogram(name: string) {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Team() {
  return (
    <div className="pt-20">
      <section className="container mx-auto px-6 lg:px-12 py-16 md:py-24">
        <SectionHeader
          code="TEAM"
          title="The People Behind Lynx"
          subtitle="Students from across UNSW engineering, design and business — turning an ambitious idea into a bike on the grid. Our roster grows every intake."
        />
      </section>

      <section className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-border/40 border border-border/40">
          {TEAM.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 5) * 0.06 }}
              className="group bg-background p-6 flex flex-col items-center text-center hover:bg-card/40 transition-colors"
            >
              <div className="relative w-20 h-20 mb-5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 border border-border group-hover:border-primary/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center font-display font-black text-2xl text-primary group-hover:text-glow-green transition-all">
                  {monogram(m.name)}
                </div>
              </div>
              <h3 className="font-display font-bold uppercase text-sm">{m.name}</h3>
              <p className="text-muted-foreground text-xs font-mono mt-1">{m.role}</p>
              <span className="mt-3 font-mono text-[10px] tracking-widest uppercase text-primary/60 border-t border-border pt-2 w-full">
                {m.dept}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-12 pb-28">
        <div className="border border-border p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-card/30">
          <div>
            <h3 className="font-display font-extrabold uppercase text-2xl md:text-3xl">
              Want your name on this grid?
            </h3>
            <p className="text-muted-foreground font-light mt-2">
              We recruit across every department, every intake. No experience required for many roles.
            </p>
          </div>
          <Link
            to="/join"
            className="group shrink-0 inline-flex items-center gap-3 bg-primary text-background font-display font-bold uppercase tracking-widest px-8 py-4 hover:bg-primary/90 transition-colors box-glow-green"
          >
            Join the team
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
