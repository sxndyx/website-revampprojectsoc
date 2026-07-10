interface ExposureMeterProps {
  label: string;
  /** 1–5 */
  value: number;
}

/**
 * A 5-tick exposure meter. Filled ticks read as acid signal; empties are faint
 * ink. The whole row is announced as "label: N out of 5" to screen readers.
 */
export function ExposureMeter({ label, value }: ExposureMeterProps) {
  const v = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="mono-label text-ink-dim">{label}</span>
      <span className="flex items-center gap-1" role="img" aria-label={`${label}: ${v} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            aria-hidden
            className={`h-3 w-[3px] ${n <= v ? "bg-acid" : "bg-ink/15"}`}
          />
        ))}
      </span>
    </div>
  );
}
