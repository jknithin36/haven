import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { Link } from "react-router";

import ArrowLink from "@/components/arrow-link";
import SectionHeader from "@/components/section-header";
import { floridaMap } from "@/data/florida-map";
import {
  serviceAreaSection as copy,
  serviceCities,
  type ServiceCity,
} from "@/data/service-area";
import { fadeUpItem, revealList, revealOnView } from "@/lib/motion";
import { cn } from "@/lib/utils";

const servedCounties = new Set(serviceCities.map((city) => city.county));

function FloridaMap({ activeCounty }: { activeCounty: string | null }) {
  return (
    <svg
      viewBox={floridaMap.viewBox}
      role="img"
      aria-label={copy.mapLabel}
      className="h-auto w-full"
    >
      {floridaMap.counties.map((county) => {
        const served = servedCounties.has(county.name);
        const active = county.name === activeCounty;
        return (
          <path
            key={county.name}
            d={county.d}
            vectorEffect="non-scaling-stroke"
            className={cn(
              "stroke-background stroke-1 transition-colors duration-300",
              active
                ? "fill-primary"
                : served
                  ? "fill-primary/25"
                  : "fill-muted-foreground/15",
            )}
          />
        );
      })}
    </svg>
  );
}

function CityRow({
  city,
  onActivate,
}: {
  city: ServiceCity;
  onActivate: (county: string | null) => void;
}) {
  return (
    <Link
      to={`/neighborhoods/${city.slug}`}
      onMouseEnter={() => onActivate(city.county)}
      onMouseLeave={() => onActivate(null)}
      onFocus={() => onActivate(city.county)}
      onBlur={() => onActivate(null)}
      className="group flex items-center justify-between gap-4 border-b border-border py-5 focus-ring"
    >
      <div>
        <p className="type-title transition-colors group-hover:text-primary">
          {city.name}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {copy.countyLabel(city.county)}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-sm tabular-nums text-muted-foreground">
          {city.count} {copy.countUnit}
        </p>
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          size={20}
          strokeWidth={1.5}
          aria-hidden="true"
          className="text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
        />
      </div>
    </Link>
  );
}

function ServiceArea() {
  const headingId = useId();
  const reduceMotion = useReducedMotion();
  const [activeCounty, setActiveCounty] = useState<string | null>(null);

  return (
    <section aria-labelledby={headingId} className="section-y">
      <div className="page-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeader
            id={headingId}
            label={copy.label}
            heading={copy.heading}
            subtext={copy.subtext}
          />
          <motion.ul
            {...revealList(reduceMotion)}
            className="mt-10 border-t border-border"
          >
            {serviceCities.map((city) => (
              <motion.li
                key={city.slug}
                variants={reduceMotion ? undefined : fadeUpItem}
              >
                <CityRow city={city} onActivate={setActiveCounty} />
              </motion.li>
            ))}
          </motion.ul>
          <ArrowLink to={copy.allGuides.to} className="mt-6">
            {copy.allGuides.label}
          </ArrowLink>
        </div>

        <motion.div
          {...revealOnView(reduceMotion)}
          className="rounded-2xl bg-muted p-8 md:p-12"
        >
          <FloridaMap activeCounty={activeCounty} />
        </motion.div>
      </div>
    </section>
  );
}

export default ServiceArea;
