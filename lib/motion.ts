/**
 * Motion tokens for Motion (Framer Motion). Keep in step with the
 * --dur-* and --ease-zox values in app/globals.css.
 * The whole motion vocabulary is in DESIGN.md section 9.
 */
export const ease = [0.22, 1, 0.36, 1] as const;

export const duration = {
  fast: 0.14,
  base: 0.24,
  slow: 0.42,
} as const;

/** Page enter: fade plus an 8px rise. */
export const pageEnter = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: duration.base, ease },
} as const;

/** List stagger, 50ms between rows. */
export const listStagger = 0.05;

/**
 * For people who ask for reduced motion: no movement, and a fade short
 * enough (under 100ms) that it reads as instant.
 */
export const reducedFade = { duration: 0.08 } as const;
