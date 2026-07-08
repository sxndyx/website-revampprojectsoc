import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Eye, GraduationCap, FlaskConical, HeartHandshake } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { SPONSORS, SPONSOR_TIERS } from "@/data/site";

const VALUE_PROPS = [
  { icon: Eye, title: "Brand Exposure", body: "Your mark on the bike, our kit, and every event, reveal and social channel we run." },
  { icon: GraduationCap, title: "Talent Pipeline", body: "First access to a pool of driven UNSW engineers before they hit the job market." },
  { icon: FlaskConical, title: "R&D Collaboration", body: "Real-world proving ground for your products, materials and technology." },
  { icon: HeartHandshake, title: "Community Impact", body: "Champion hands-on STEM and the future of sustainable motorsport." },
];

export default function Sponsors() {
  return (
    <div className="pt-20">
      <section className="container mx-auto px-6 lg:px-12 py-16 md:py-24">
        <SectionHeader
          code="PARTNER WITH US"
          title="Power the Grid"
          subtitle="Lynx Racing runs on the support of partners who believe in student engineering and the future of electric motorsport. Here's how a partnership works — and where your brand fits in."
        />
      </section>

      {/* Value props */}
      <section className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border/40 border border-border/40">
          {VALUE_PROPS.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-background p-8 group hover:bg-card/40 transition-colors"
            >
              <v.icon size={28} className="text-primary mb-6" />
              <h3 className="font-display font-bold uppercase text-lg mb-3">{v.title}</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tiers */}
      <section className="container mx-auto px-6 lg:px-12 pb-20">
        <SectionHeader code="TIERS" title="Partnership Levels" />
        <div className="mt-10 space-y-px bg-border/40 border border-border/40">
          {SPONSOR_TIERS.map((t) => {
            const brands = SPONSORS.filter((s) => s.tier === t.tier);
            return (
              <div key={t.tier} className="bg-background p-6 md:p-8 grid md:grid-cols-[220px_1fr] gap-6 items-center">
                <div>
                  <h3 className="font-display font-extrabold uppercase text-2xl text-primary">{t.tier}</h3>
                  <p className="text-muted-foreground text-sm font-light mt-2">{t.blurb}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {brands.map((b) => (
                    <span
                      key={b.name}
                      className="font-display font-bold tracking-widest text-sm text-muted-foreground/50 border border-border px-5 py-3 hover:text-primary hover:border-primary/50 transition-colors"
                    >
                      {b.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 lg:px-12 pb-28">
        <div className="border border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/5 p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="font-display font-black uppercase text-3xl md:text-5xl mb-4">
              Let's build something fast
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 font-light">
              Request our sponsorship prospectus and we'll find the right fit for your brand.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 bg-primary text-background font-display font-bold uppercase tracking-widest px-8 py-4 hover:bg-primary/90 transition-colors box-glow-green"
            >
              Get in touch
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
