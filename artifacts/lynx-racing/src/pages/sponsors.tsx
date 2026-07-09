import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Eye, GraduationCap, FlaskConical, HeartHandshake } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { SectionHeader } from "@/components/SectionHeader";
import { SPONSOR_TIERS } from "@/data/site";

const VALUE_PROPS = [
  { icon: Eye, title: "Brand Exposure", body: "Your mark on the bike, our kit, and every event, reveal and social channel we run." },
  { icon: GraduationCap, title: "Talent Pipeline", body: "First access to a pool of driven UNSW engineers before they hit the job market." },
  { icon: FlaskConical, title: "R&D Collaboration", body: "A real-world proving ground for your products, materials and technology." },
  { icon: HeartHandshake, title: "Community Impact", body: "Champion hands-on STEM and the future of sustainable motorsport." },
];

export default function Sponsors() {
  useSeo({
    title: "Sponsors",
    description:
      "Back UNSW Lynx Racing — founding sponsorship of Australia's first student-built electric superbike concept, bound for MotoStudent at MotorLand Aragón.",
  });

  return (
    <div>
      <section className="container mx-auto px-6 py-16 md:py-24 lg:px-12">
        <SectionHeader
          code="PARTNER WITH US"
          title="Back the Build"
          subtitle="Lynx Racing runs on partners who believe in student engineering and the future of electric motorsport. Here's how a partnership works — and where your brand fits in before the first bike even exists."
        />
      </section>

      {/* Value props */}
      <section className="container mx-auto px-6 pb-20 lg:px-12">
        <div className="grid gap-px border border-border/40 bg-border/40 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-background p-8 transition-colors hover:bg-card/40"
            >
              <v.icon size={28} className="mb-6 text-primary" />
              <h3 className="mb-3 font-display text-lg font-bold uppercase">{v.title}</h3>
              <p className="text-sm font-light leading-relaxed text-muted-foreground">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section className="container mx-auto px-6 pb-20 lg:px-12">
        <SectionHeader code="TIERS" title="Partnership Levels" />
        <div className="mt-10 space-y-px border border-border/40 bg-border/40">
          {SPONSOR_TIERS.map((t) => (
            <div
              key={t.tier}
              className="grid items-center gap-6 bg-background p-6 md:grid-cols-[220px_1fr] md:p-8"
            >
              <div>
                <h3 className="font-display text-2xl font-extrabold uppercase text-primary">{t.tier}</h3>
                <p className="mt-2 text-sm font-light text-muted-foreground">{t.blurb}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {[0, 1, 2].map((n) => (
                  <span
                    key={n}
                    className="border border-dashed border-border px-5 py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground/60"
                  >
                    Open Slot
                  </span>
                ))}
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary/70">
                  {t.slots}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-28 lg:px-12">
        <div className="relative overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/5 p-10 text-center md:p-16">
          <div className="relative z-10">
            <h3 className="mb-4 font-display text-3xl font-black uppercase md:text-5xl">
              Put your name on the first one
            </h3>
            <p className="mx-auto mb-8 max-w-xl font-light text-muted-foreground">
              Request our sponsorship prospectus and we'll find the right fit for your brand.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 bg-primary px-8 py-4 font-display font-bold uppercase tracking-widest text-background transition-colors hover:bg-primary/90"
            >
              Get in touch
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
