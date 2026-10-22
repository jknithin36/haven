import type { MotionProps, Variants } from "motion/react";

// Motion tokens shared by every section.
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  quick: 0.2, // filtering results
  fast: 0.4, // switching content (carousel)
  base: 0.7, // fade-ups
  slow: 1, // large images
  count: 1.2, // count-up numbers
} as const;

export const STAGGER = 0.08;

export const IN_VIEW = { once: true, amount: 0.2 } as const;

// Parent list: children fade up one after another.
export const staggerList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER } },
};

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

// Props for a list that reveals its items once when scrolled into view.
export function revealList(reduceMotion: boolean | null): MotionProps {
  if (reduceMotion) return {};
  return {
    variants: staggerList,
    initial: "hidden",
    whileInView: "show",
    viewport: IN_VIEW,
  };
}

// Props for a single element that fades up once when scrolled into view.
export function revealOnView(
  reduceMotion: boolean | null,
  delay = 0,
): MotionProps {
  if (reduceMotion) return {};
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: IN_VIEW,
    transition: { duration: DURATION.base, delay, ease: EASE },
  };
}
