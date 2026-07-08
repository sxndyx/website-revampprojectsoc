import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { DEPARTMENTS } from "@/data/site";

const STEPS = [
  { n: "01", title: "Pick a department", body: "Find the team that matches your skills — or the one you want to learn." },
  { n: "02", title: "Send an application", body: "Tell us who you are and where you'd like to contribute. Keep it short." },
  { n: "03", title: "Meet the team", body: "A quick, informal chat with the relevant lead to find your fit." },
  { n: "04", title: "Start building", body: "Get onboarded, pick up your first task, and help put Lynx on the grid." },
];

export default function Join() {
  return (
    <div className="pt-20">
      <section className="container mx-auto px-6 lg:px-12 py-16 md:py-24">
        <SectionHeader
          code="JOIN"
          title="Build the Bike"
          subtitle="Lynx Racing is open to all UNSW students. Whether you weld, code, crunch CFD or close sponsorship deals, there's a place for you on the team."
        />
      </section>

      {/* Departments */}
      <section className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/40 border border-border/40">
          {DEPARTMENTS.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
              className="group bg-background p-7 flex flex-col hover:bg-card/40 transition-colors"
            >
              <div className="h-[2px] w-8 bg-primary mb-5 group-hover:w-16 transition-all duration-500" />
              <h3 className="font-display font-extrabold uppercase text-xl mb-3">{d.name}</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed mb-6 flex-1">
                {d.blurb}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {d.skills.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-[10px] tracking-wider uppercase px-2 py-1 bg-card border border-border text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase text-primary/70">
                <Clock size={12} /> {d.commitment}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How to apply */}
      <section className="container mx-auto px-6 lg:px-12 pb-20">
        <SectionHeader code="PROCESS" title="How to Join" />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative"
            >
              <span className="font-display font-black text-5xl text-primary/20">{s.n}</span>
              <h3 className="font-display font-bold uppercase text-lg mt-2 mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 lg:px-12 pb-28">
        <div className="border border-primary/30 bg-gradient-to-br from-secondary/10 to-primary/5 p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="font-display font-black uppercase text-3xl md:text-5xl mb-4">Ready to race?</h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 font-light">
              Applications are open year-round. Reach out and tell us where you want to build.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 bg-primary text-background font-display font-bold uppercase tracking-widest px-8 py-4 hover:bg-primary/90 transition-colors box-glow-green"
            >
              Apply now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
