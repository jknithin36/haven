import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { Link } from "react-router";

import ArrowLink from "@/components/arrow-link";
import SectionHeader from "@/components/section-header";
import {
  featuredHomesSection as copy,
  type Property,
} from "@/data/properties";
import { fadeUpItem, revealList } from "@/lib/motion";
import { usePublicProperties } from "@/store/properties";

function FeaturedCard({ property }: { property: Property }) {
  return (
    <Link
      to={`/properties/${property.slug}`}
      aria-label={`${property.name}, ${property.city}`}
      className="group block rounded-xl focus-ring"
    >
      <div className="aspect-4/3 overflow-hidden rounded-xl bg-muted">
        <img
          src={property.image}
          alt={property.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <h3 className="mt-5 type-title">{property.name}</h3>
      <p className="mt-2 text-muted-foreground">
        {property.city}, {property.state}
      </p>
    </Link>
  );
}

function FeaturedHomes() {
  const homes = usePublicProperties();
  const featuredProperties = homes.filter((p) => p.featured);
  const headingId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <section aria-labelledby={headingId} className="section-y">
      <div className="page-container">
        <SectionHeader
          id={headingId}
          label={copy.label}
          heading={copy.heading}
          action={
            <ArrowLink
              to={copy.viewAll.to}
              className="hidden shrink-0 md:inline-flex"
            >
              {copy.viewAll.label}
            </ArrowLink>
          }
        />

        {/* The whole list triggers once, then cards stagger in. Triggering per
            card would leave off-screen cards in the mobile scroll row hidden. */}
        <motion.ul
          {...revealList(reduceMotion)}
          className="-mx-6 mt-10 flex snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3"
        >
          {featuredProperties.map((property) => (
            <motion.li
              key={property.id}
              variants={reduceMotion ? undefined : fadeUpItem}
              className="w-[80%] shrink-0 snap-start md:w-auto"
            >
              <FeaturedCard property={property} />
            </motion.li>
          ))}
        </motion.ul>

        <ArrowLink to={copy.viewAll.to} className="mt-10 md:hidden">
          {copy.viewAll.label}
        </ArrowLink>
      </div>
    </section>
  );
}

export default FeaturedHomes;
