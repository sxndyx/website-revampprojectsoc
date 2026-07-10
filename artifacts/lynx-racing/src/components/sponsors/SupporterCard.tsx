import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { SUPPORTER_CARD } from "@/data/sponsors";

const SUPPORTER_HREF = `/contact?${new URLSearchParams({
  intent: "sponsorship",
  subject: "Sponsorship",
  message:
    "I'd like to enquire about becoming a Supporter of Lynx Racing (off-bike partnership). Please share the details.",
}).toString()}`;

/**
 * Off-bike partnership card. Supporters take no livery zone, so this sits below
 * the configurator. It lifts to an acid-edged emphasis when the SUPPORTER tier
 * filter is active.
 */
export function SupporterCard({ emphasized = false }: { emphasized?: boolean }) {
  return (
    <div
      className={`grid gap-6 border p-6 transition-colors md:grid-cols-[1fr_auto] md:items-center md:p-8 ${
        emphasized ? "border-acid/50 bg-acid/5" : "border-hairline bg-surface/40"
      }`}
    >
      <div>
        <div className="flex items-center gap-3">
          <span className="mono-label text-acid">{SUPPORTER_CARD.tier}</span>
          <span aria-hidden className="h-px flex-1 bg-hairline sm:w-16 sm:flex-none" />
        </div>
        <h3 className="mt-3 font-display text-2xl font-bold uppercase leading-none">
          {SUPPORTER_CARD.title}
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-dim">{SUPPORTER_CARD.blurb}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-3">
          {SUPPORTER_CARD.points.map((p) => (
            <li key={p} className="flex items-start gap-2 text-sm text-ink">
              <Check size={15} className="mt-0.5 shrink-0 text-acid" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
      </div>

      <Link
        to={SUPPORTER_HREF}
        className="group inline-flex items-center justify-center gap-2 self-start border border-acid/40 px-5 py-3 font-display text-sm font-bold uppercase tracking-widest text-acid transition-colors hover:bg-acid hover:text-[#060607] md:self-center"
      >
        Enquire
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
      </Link>
    </div>
  );
}
