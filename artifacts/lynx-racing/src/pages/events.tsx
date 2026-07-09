import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { SectionHeader } from "@/components/SectionHeader";
import { EVENTS, type RaceEvent } from "@/data/site";

function statusStyle(status: RaceEvent["status"]) {
  switch (status) {
    case "ACTIVE":
      return "text-primary border-primary/50 bg-primary/10";
    case "UPCOMING":
      return "text-foreground border-border bg-card";
    default:
      return "text-muted-foreground border-border bg-card";
  }
}

export default function Events() {
  useSeo({
    title: "Events",
    description:
      "The Lynx Racing roadmap — from build season at UNSW to the concept electric superbike's first competitive outing.",
  });

  return (
    <div>
      <section className="container mx-auto px-6 py-16 md:py-24 lg:px-12">
        <SectionHeader
          code="EVENTS"
          title="The Road Ahead"
          subtitle="Our roadmap from build season to the bike's first competitive outing. Dates firm up as milestones are hit — check back for updates."
        />
      </section>

      <section className="container mx-auto px-6 pb-28 lg:px-12">
        <div className="border border-border/40">
          {EVENTS.map((e, i) => (
            <motion.div
              key={e.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="group grid items-center gap-4 border-b border-border/40 bg-background p-6 transition-colors last:border-b-0 hover:bg-card/40 md:grid-cols-[140px_1fr_auto] md:gap-8 md:p-8"
            >
              <div className="font-display text-2xl font-black tabular-nums text-primary/80 transition-colors group-hover:text-primary md:text-3xl">
                {e.date}
              </div>

              <div>
                <h3 className="mb-2 font-display text-xl font-bold uppercase md:text-2xl">{e.name}</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} /> {e.type}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} /> {e.location}
                  </span>
                </div>
              </div>

              <span
                className={`justify-self-start border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] md:justify-self-end ${statusStyle(
                  e.status,
                )}`}
              >
                {e.status}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 font-mono text-xs tracking-wider text-muted-foreground/60">
          * Schedule is indicative and subject to change as the program develops.
        </p>
      </section>
    </div>
  );
}
