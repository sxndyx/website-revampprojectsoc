import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { SectionHeader } from "@/components/SectionHeader";
import { DEPARTMENTS } from "@/data/site";

const STEPS = [
  { n: "01", title: "Pick a department", body: "Find the team that matches your skills — or the one you want to learn." },
  { n: "02", title: "Send an application", body: "Tell us who you are and where you'd like to contribute. Keep it short." },
  { n: "03", title: "Meet the team", body: "A quick, informal chat with the relevant lead to find your fit." },
  { n: "04", title: "Start building", body: "Get onboarded, pick up your first task, and help put Lynx on the grid." },
];

export default function Join() {
  useSeo({
    title: "Join",
    description:
      "Join UNSW Lynx Racing. We recruit across every department — engineering, software, aero and business — to build Australia's first student electric superbike concept.",
  });

  return (
    <div>
      <section className="container mx-auto px-6 py-16 md:py-24 lg:px-12">
        <SectionHeader
          code="JOIN"
          title="Build the Bike"
          subtitle="Lynx Racing is open to all UNSW students. Whether you weld, code, crunch CFD or close sponsorship deals, there's a place for you on the team."
        />
      </section>

      {/* Departments */}
      <section className="container mx-auto px-6 pb-20 lg:px-12">
        <div className="grid gap-px border border-border/40 bg-border/40 sm:grid-cols-2 lg:grid-cols-4">
          {DEPARTMENTS.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
              className="group flex flex-col bg-background p-7 transition-colors hover:bg-card/40"
            >
              <div className="mb-5 h-[2px] w-8 bg-primary transition-all duration-500 group-hover:w-16" />
              <h3 className="mb-3 font-display text-xl font-extrabold uppercase">{d.name}</h3>
              <p className="mb-6 flex-1 text-sm font-light leading-relaxed text-muted-foreground">
                {d.blurb}
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                {d.skills.map((s) => (
                  <span
                    key={s}
                    className="border border-border bg-card px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-primary/70">
                <Clock size={12} /> {d.commitment}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How to apply */}
      <section className="container mx-auto px-6 pb-20 lg:px-12">
        <SectionHeader code="PROCESS" title="How to Join" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative"
            >
              <span className="font-display text-5xl font-black text-primary/20">{s.n}</span>
              <h3 className="mb-2 mt-2 font-display text-lg font-bold uppercase">{s.title}</h3>
              <p className="text-sm font-light leading-relaxed text-muted-foreground">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-28 lg:px-12">
        <div className="relative overflow-hidden border border-primary/30 bg-gradient-to-br from-secondary/10 to-primary/5 p-10 text-center md:p-16">
          <div className="relative z-10">
            <h3 className="mb-4 font-display text-3xl font-black uppercase md:text-5xl">Ready to build?</h3>
            <p className="mx-auto mb-8 max-w-xl font-light text-muted-foreground">
              Applications are open year-round. Reach out and tell us where you want to build.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 bg-primary px-8 py-4 font-display font-bold uppercase tracking-widest text-background transition-colors hover:bg-primary/90"
            >
              Apply now
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
