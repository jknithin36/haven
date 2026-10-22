import { motion, useReducedMotion, type Variants } from "motion/react";

import { aboutPage } from "@/data/about-page";
import { DURATION, EASE, IN_VIEW, STAGGER } from "@/lib/motion";

const copy = aboutPage.milestones;

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER * 2 } },
};

// Each dot fills in turn: its blue center grows from nothing.
const fill: Variants = {
  hidden: { scale: 0 },
  show: { scale: 1, transition: { duration: DURATION.base, ease: EASE } },
};

// A vertical timeline on phones and a horizontal one on desktop.
function Milestones() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.ol
      {...(reduceMotion
        ? {}
        : {
            variants: list,
            initial: "hidden",
            whileInView: "show",
            viewport: IN_VIEW,
          })}
      className="relative grid gap-8 lg:grid-cols-6 lg:gap-6"
    >
      {/* Connecting line: down the left on phones, across the top on desktop */}
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[7px] w-px bg-border lg:top-[7px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto"
      />
      {copy.items.map((item) => (
        <li key={item.year} className="relative pl-10 lg:pt-10 lg:pl-0">
          <span
            aria-hidden="true"
            className="absolute top-0 left-0 flex size-[15px] items-center justify-center rounded-full border-2 border-primary bg-background"
          >
            <motion.span
              variants={reduceMotion ? undefined : fill}
              className="size-full rounded-full bg-primary"
            />
          </span>
          <p className="type-title tabular-nums">{item.year}</p>
          <p className="mt-2 text-muted-foreground">{item.text}</p>
        </li>
      ))}
    </motion.ol>
  );
}

export default Milestones;
