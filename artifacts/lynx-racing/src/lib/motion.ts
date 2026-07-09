// Shared motion language: a strong decelerating ease over 0.6-0.9s with small
// staggers. Decorative motion always defers to prefers-reduced-motion at the
// component level (see fx/* and the reduced-motion CSS reset in index.css).

export const EASE_OUT_STRONG: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const DUR = {
  fast: 0.4,
  base: 0.7,
  slow: 0.9,
} as const;
