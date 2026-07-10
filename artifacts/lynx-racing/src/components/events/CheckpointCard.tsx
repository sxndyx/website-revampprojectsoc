import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Linkedin, UserPlus, X } from "lucide-react";
import type { CheckpointContent } from "@/data/circuit";
import { EASE_OUT_STRONG } from "@/lib/motion";

const INSTAGRAM = "https://instagram.com/unswlynxracing";
const LINKEDIN = "https://www.linkedin.com/company/unsw-lynx-racing";

interface CheckpointCardProps {
  checkpoint: CheckpointContent;
  index: number;
  total: number;
  reduced: boolean;
  onNext: () => void;
  onExit: () => void;
  /** Label for the dismiss control — "Exit to orbit" in 3D, "Close" in the 2D map. */
  exitLabel?: string;
}

/**
 * Shared glass checkpoint card. Drives both the 3D ride-mode overlay and the 2D
 * fallback map, so the program content is identical in both. The final
 * checkpoint (cp-follow) swaps its footer for follow / join actions.
 */
export function CheckpointCard({
  checkpoint,
  index,
  total,
  reduced,
  onNext,
  onExit,
  exitLabel = "Exit to orbit",
}: CheckpointCardProps) {
  const isFollow = checkpoint.id === "cp-follow";
  const isLast = index >= total - 1;

  return (
    <motion.section
      aria-label={`${checkpoint.title} — checkpoint ${index + 1} of ${total}`}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: 26 }}
      transition={{ duration: 0.5, ease: EASE_OUT_STRONG }}
      className="glass-strong pointer-events-auto absolute inset-x-3 bottom-3 z-30 border border-hairline p-5 md:inset-x-auto md:bottom-5 md:left-5 md:max-w-md md:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="mono-label text-acid">{checkpoint.corner}</span>
          <span aria-hidden className="h-3 w-px bg-hairline" />
          <span className="mono-label text-ink-dim">{checkpoint.kicker}</span>
        </div>
        <button
          type="button"
          onClick={onExit}
          aria-label={exitLabel}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center border border-hairline text-ink-dim transition-colors hover:border-acid/50 hover:text-acid"
        >
          <X size={14} aria-hidden />
        </button>
      </div>

      <h3 className="mt-3 font-display text-2xl font-bold uppercase leading-none">{checkpoint.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-dim">{checkpoint.body}</p>

      {isFollow && (
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Instagram — @unswlynxracing"
            className="inline-flex h-10 w-10 items-center justify-center border border-hairline text-ink-dim transition-colors hover:border-acid/60 hover:text-acid"
          >
            <Instagram size={16} aria-hidden />
          </a>
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn — UNSW Lynx Racing"
            className="inline-flex h-10 w-10 items-center justify-center border border-hairline text-ink-dim transition-colors hover:border-acid/60 hover:text-acid"
          >
            <Linkedin size={16} aria-hidden />
          </a>
          <Link
            to="/join"
            className="group inline-flex items-center gap-2 border border-acid/40 px-4 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-acid transition-colors hover:bg-acid hover:text-[#060607]"
          >
            <UserPlus size={14} aria-hidden /> Join the team
          </Link>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-hairline pt-4">
        <span className="mono-label text-ink-dim">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 mono-label text-ink-dim transition-colors hover:text-acid"
          >
            {exitLabel}
          </button>
          {!isLast && (
            <button
              type="button"
              onClick={onNext}
              className="group inline-flex items-center gap-2 bg-acid px-4 py-2.5 font-display text-xs font-bold uppercase tracking-widest text-[#060607] transition-colors hover:bg-acid/90"
            >
              Next <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden />
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
}
