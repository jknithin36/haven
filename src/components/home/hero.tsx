import { motion, useReducedMotion, type MotionProps } from "motion/react";
import { useId } from "react";

import ButtonLink from "@/components/button-link";
import HeroImage from "@/components/home/hero-image";
import LogoMark from "@/components/logo-mark";
import { hero } from "@/data/hero";
import { DURATION, EASE, STAGGER } from "@/lib/motion";

// Entrance timeline (seconds).
const LINE_STAGGER = STAGGER;
const HEADLINE_START = 0.05;
const AFTER_HEADLINE =
  HEADLINE_START + LINE_STAGGER * (hero.headlineLines.length - 1) + 0.2;
const IMAGE_START = 0.3;

function Hero() {
  const headingId = useId();
  const reduceMotion = useReducedMotion();

  function fadeUp(delay: number, y = 16): MotionProps {
    if (reduceMotion) return {};
    return {
      initial: { opacity: 0, y },
      animate: { opacity: 1, y: 0 },
      transition: { duration: DURATION.base, delay, ease: EASE },
    };
  }

  const fadeIn: MotionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: DURATION.base, delay: IMAGE_START, ease: EASE },
      };

  return (
    <section aria-labelledby={headingId}>
      <div className="page-container pt-12 pb-12 md:pt-20 md:pb-24">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[3fr_2fr] lg:gap-x-12 lg:gap-y-0">
          <motion.p
            {...fadeUp(0)}
            className="type-eyebrow lg:col-start-2 lg:row-start-1 lg:self-start lg:justify-self-end lg:text-right"
          >
            {hero.label}
          </motion.p>

          <h1
            id={headingId}
            className="type-display lg:col-start-1 lg:row-start-1"
          >
            {hero.headlineLines.map((line, i) => (
              // Lines flow and balance on small screens, and break exactly on desktop.
              <motion.span
                key={line}
                className="lg:block"
                {...fadeUp(HEADLINE_START + i * LINE_STAGGER)}
              >
                {line}{" "}
              </motion.span>
            ))}
          </h1>

          <motion.p
            {...fadeUp(AFTER_HEADLINE)}
            className="max-w-measure text-lg text-pretty text-muted-foreground lg:col-start-2 lg:row-start-2 lg:self-end lg:justify-self-end lg:text-right"
          >
            {hero.subtext}
          </motion.p>

          <motion.div
            {...fadeUp(AFTER_HEADLINE)}
            className="lg:col-start-1 lg:row-start-2 lg:mt-10"
          >
            <ButtonLink to={hero.primaryCta.to} className="w-full md:w-auto">
              {hero.primaryCta.label}
              <LogoMark aria-hidden="true" data-icon="inline-end" />
            </ButtonLink>
          </motion.div>
        </div>
      </div>

      <motion.div {...fadeIn}>
        <HeroImage />
      </motion.div>
    </section>
  );
}

export default Hero;
