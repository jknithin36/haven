import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

import ButtonLink from "@/components/button-link";
import PropertyCard from "@/components/property/property-card";
import SectionHeader from "@/components/section-header";
import { latestSection as copy } from "@/data/properties";
import { fadeUpItem, revealList } from "@/lib/motion";
import { usePublicProperties } from "@/store/properties";

function LatestProperties() {
  const newProperties = usePublicProperties().filter((p) => p.isNew);
  const headingId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <section aria-labelledby={headingId} className="section-y">
      <div className="page-container">
        <SectionHeader
          id={headingId}
          label={copy.label}
          heading={copy.heading}
        />

        <motion.ul
          {...revealList(reduceMotion)}
          className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
        >
          {newProperties.map((property) => (
            <motion.li
              key={property.id}
              variants={reduceMotion ? undefined : fadeUpItem}
            >
              <PropertyCard property={property} />
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-10 flex justify-center">
          <ButtonLink to={copy.viewAll.to}>
            {copy.viewAll.label}
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              strokeWidth={1.5}
              aria-hidden="true"
              data-icon="inline-end"
            />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export default LatestProperties;
