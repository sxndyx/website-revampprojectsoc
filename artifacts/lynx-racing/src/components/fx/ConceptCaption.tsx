interface ConceptCaptionProps {
  className?: string;
}

/**
 * Mandatory honesty marker shown wherever a bike visual appears — the machine
 * is a concept, not a finished product.
 */
export function ConceptCaption({ className = "" }: ConceptCaptionProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase leading-none tracking-[0.18em] text-[10px] text-ink-dim ${className}`}
    >
      <span className="h-1 w-1 rounded-full bg-acid/70" aria-hidden />
      Concept Visualisation — Prototype in Development
    </span>
  );
}
