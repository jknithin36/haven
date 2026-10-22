import {
  ArrowUpRight01Icon,
  BeachIcon,
  Building03Icon,
  DiamondIcon,
  GolfHoleIcon,
  Home01Icon,
  Key01Icon,
  RealEstate01Icon,
  WavesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { Link } from "react-router";

import SectionHeader from "@/components/section-header";
import {
  propertyTypes,
  propertyTypesSection as copy,
  type PropertyTypeIcon,
  type PropertyTypeItem,
} from "@/data/property-types";
import { fadeUpItem, revealList } from "@/lib/motion";

const icons = {
  beach: BeachIcon,
  waves: WavesIcon,
  building: Building03Icon,
  home: Home01Icon,
  houses: RealEstate01Icon,
  diamond: DiamondIcon,
  flag: GolfHoleIcon,
  key: Key01Icon,
} satisfies Record<PropertyTypeIcon, unknown>;

function TypeCard({ type }: { type: PropertyTypeItem }) {
  const count = `${type.count} ${copy.countUnit}`;

  return (
    <Link
      to={type.href ?? `/properties?type=${type.slug}`}
      aria-label={`${type.name}, ${count}`}
      className="group flex h-full min-h-45 flex-col justify-between rounded-xl border border-border bg-background p-5 transition-colors duration-300 focus-ring hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-offset-muted md:p-6"
    >
      <div className="flex items-start justify-between">
        <HugeiconsIcon
          icon={icons[type.icon]}
          size={32}
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          size={20}
          strokeWidth={1.5}
          aria-hidden="true"
          className="text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary-foreground"
        />
      </div>

      <div className="mt-8">
        <h3 className="type-title">{type.name}</h3>
        <p className="mt-1 text-sm tabular-nums text-muted-foreground transition-colors duration-300 group-hover:text-primary-foreground/80">
          {count}
        </p>
        <p className="mt-1 hidden text-sm text-muted-foreground transition-colors duration-300 group-hover:text-primary-foreground/80 md:block">
          {type.line}
        </p>
      </div>
    </Link>
  );
}

function PropertyTypes() {
  const headingId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <section aria-labelledby={headingId} className="section-y bg-muted">
      <div className="page-container">
        <SectionHeader
          id={headingId}
          label={copy.label}
          heading={copy.heading}
          subtext={copy.subtext}
        />

        <motion.ul
          {...revealList(reduceMotion)}
          className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {propertyTypes.map((type) => (
            <motion.li
              key={type.slug}
              variants={reduceMotion ? undefined : fadeUpItem}
            >
              <TypeCard type={type} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

export default PropertyTypes;
