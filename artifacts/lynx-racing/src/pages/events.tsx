import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { EVENTS, type RaceEvent } from "@/data/site";

function statusStyle(status: RaceEvent["status"]) {
  switch (status) {
    case "ACTIVE":
      return "text-primary border-primary/50 bg-primary/10";
    case "UPCOMING":
      return "text-secondary border-secondary/50 bg-secondary/10";
    default:
      return "text-muted-foreground border-border bg-card";
  }
}

export default function Events() {
  return (
    <div className="pt-20">
      <section className="container mx-auto px-6 lg:px-12 py-16 md:py-24">
        <SectionHeader
          code="EVENTS"
          title="The Season Ahead"
          subtitle="Our roadmap from build season to the bike's first competitive outing. Dates firm up as milestones are hit — check back for updates."
        />
      </section>

      <section className="container mx-auto px-6 lg:px-12 pb-28">
        <div className="border border-border/40">
          {EVENTS.map((e, i) => (
            <motion.div
              key={e.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="group grid md:grid-cols-[140px_1fr_auto] gap-4 md:gap-8 items-center p-6 md:p-8 border-b border-border/40 last:border-b-0 bg-background hover:bg-card/40 transition-colors"
            >
              <div className="font-display font-black text-2xl md:text-3xl text-primary/80 group-hover:text-primary transition-colors tabular-nums">
                {e.date}
              </div>

              <div>
                <h3 className="font-display font-bold uppercase text-xl md:text-2xl mb-2">{e.name}</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} /> {e.type}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} /> {e.location}
                  </span>
                </div>
              </div>

              <span
                className={`justify-self-start md:justify-self-end font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border ${statusStyle(
                  e.status,
                )}`}
              >
                {e.status}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 font-mono text-xs text-muted-foreground/60 tracking-wider">
          * Schedule is indicative and subject to change as the program develops.
        </p>
      </section>
    </div>
  );
}
