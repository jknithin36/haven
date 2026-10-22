import { ChartIncreaseIcon, Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion, type MotionProps } from "motion/react";
import { useId } from "react";

import CountUp from "@/components/count-up";
import SectionHeader from "@/components/section-header";
import {
  about,
  type AboutFeature,
  type AboutIcon,
  type AboutStat,
} from "@/data/about";
import { DURATION, EASE, IN_VIEW, fadeUpItem, revealList } from "@/lib/motion";

const icons = {
  home: Home01Icon,
  chart: ChartIncreaseIcon,
} satisfies Record<AboutIcon, unknown>;

function Stat({ stat }: { stat: AboutStat }) {
  return (
    // Label comes first in the markup (dt before dd); flex-col-reverse puts
    // the number on top visually.
    <div className="flex flex-col-reverse border-t border-border pt-5">
      <dt className="mt-2 text-sm text-muted-foreground">{stat.label}</dt>
      <dd className="type-stat">
        <CountUp
          value={stat.value}
          suffix={stat.suffix}
          decimals={stat.decimals}
        />
      </dd>
    </div>
  );
}

function Feature({
  feature,
  animate,
}: {
  feature: AboutFeature;
  animate: boolean;
}) {
  return (
    <motion.li
      variants={animate ? fadeUpItem : undefined}
      className="flex gap-5"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted">
        <HugeiconsIcon
          icon={icons[feature.icon]}
          size={24}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </span>
      <div>
        <h3 className="type-title">{feature.title}</h3>
        <p className="mt-2 max-w-measure leading-relaxed text-muted-foreground">
          {feature.text}
        </p>
      </div>
    </motion.li>
  );
}

function AboutSection() {
  const headingId = useId();
  const reduceMotion = useReducedMotion();

  const imageMotion: MotionProps = reduceMotion
    ? {}
    : {
        initial: { scale: 1.05 },
        whileInView: { scale: 1 },
        viewport: IN_VIEW,
        transition: { duration: DURATION.slow, ease: EASE },
      };

  return (
    <section aria-labelledby={headingId} className="section-y">
      <div className="page-container">
        <div className="grid items-end gap-10 lg:grid-cols-2 lg:gap-16">
          <SectionHeader
            id={headingId}
            label={about.label}
            heading={about.heading}
            subtext={about.subtext}
          />
          <dl className="grid grid-cols-3 gap-6">
            {about.stats.map((stat) => (
              <Stat key={stat.label} stat={stat} />
            ))}
          </dl>
        </div>

        <div className="mt-10 aspect-4/3 overflow-hidden rounded-2xl bg-muted md:aspect-21/9">
          <motion.img
            {...imageMotion}
            src={about.mainImage}
            alt={about.mainImageAlt}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>

        <motion.ul
          {...revealList(reduceMotion)}
          className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16"
        >
          {about.features.map((feature) => (
            <Feature
              key={feature.id}
              feature={feature}
              animate={!reduceMotion}
            />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

export default AboutSection;
