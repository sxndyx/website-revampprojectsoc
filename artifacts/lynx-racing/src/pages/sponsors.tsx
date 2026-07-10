import { Link } from "react-router-dom";
import { ArrowRight, Eye, FlaskConical, GraduationCap } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/fx/Reveal";
import { LiveryConfigurator } from "@/components/sponsors/LiveryConfigurator";

const VALUE_PROPS = [
  {
    icon: Eye,
    title: "Brand Exposure",
    body: "Your mark on the machine, the helmet, our kit and every reveal, race and social post the team runs.",
  },
  {
    icon: GraduationCap,
    title: "Talent Pipeline",
    body: "First access to a pool of driven UNSW engineers, designers and marketers before they hit the job market.",
  },
  {
    icon: FlaskConical,
    title: "R&D Collaboration",
    body: "A real-world proving ground for your products, materials and technology under genuine race conditions.",
  },
];

const FOUNDING_HREF = `/contact?${new URLSearchParams({
  intent: "sponsorship",
  subject: "Sponsorship",
  message: "I'd like to talk about becoming a founding partner of Lynx Racing.",
}).toString()}`;

export default function Sponsors() {
  useSeo({
    title: "Sponsors",
    description:
      "Back UNSW Lynx Racing — configure your brand across the concept electric superbike's livery and helmet, and claim a founding partner placement before the first lap.",
  });

  return (
    <div>
      <section className="container mx-auto px-6 py-16 md:py-24 lg:px-12">
        <SectionHeader
          code="PARTNER WITH US"
          title="Own a Piece of the Machine"
          subtitle="The bike is a concept in development — which means every surface is still open. Explore the livery, see exactly what each placement puts your brand in front of, and enquire about the ones that fit."
        />
      </section>

      {/* Interactive livery configurator */}
      <section className="container mx-auto px-6 pb-20 lg:px-12">
        <LiveryConfigurator />
      </section>

      {/* Why partner */}
      <section className="container mx-auto px-6 pb-20 lg:px-12">
        <SectionHeader code="WHY PARTNER" title="More Than a Logo" />
        <div className="mt-10 grid gap-px border border-hairline bg-hairline sm:grid-cols-3">
          {VALUE_PROPS.map((v, i) => (
            <Reveal key={v.title} onView delay={i * 0.08} className="bg-base p-8">
              <v.icon size={26} className="mb-6 text-acid" aria-hidden />
              <h3 className="mb-3 font-display text-lg font-bold uppercase">{v.title}</h3>
              <p className="text-sm leading-relaxed text-ink-dim">{v.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Founding partner strip — honest, no fake logos */}
      <section className="container mx-auto px-6 pb-28 lg:px-12">
        <div className="relative overflow-hidden border border-acid/25 bg-surface/40 p-8 md:p-12">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 bloom-acid" />
          <div className="relative">
            <span className="mono-label text-acid">Founding partner slots open</span>
            <h2 className="mt-4 font-display text-3xl font-black uppercase leading-none md:text-5xl">
              Be the first name on it
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-dim">
              No logos here yet — that's the point. Founding partners shape the livery from a blank
              canvas and grow with the team from its very first season.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {["Title", "Platinum", "Gold", "Silver"].map((t) => (
                <div
                  key={t}
                  className="flex flex-col items-center justify-center gap-2 border border-dashed border-hairline py-6"
                >
                  <span className="mono-label text-ink-dim">{t}</span>
                  <span className="mono-label text-acid/70">Open</span>
                </div>
              ))}
            </div>

            <Link
              to={FOUNDING_HREF}
              className="group mt-8 inline-flex items-center gap-3 bg-acid px-8 py-4 font-display font-bold uppercase tracking-widest text-[#060607] transition-colors hover:bg-acid/90"
            >
              Start the conversation
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
