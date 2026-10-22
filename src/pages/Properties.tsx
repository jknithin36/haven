import { Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import PageHeader from "@/components/page-header";
import PageMeta from "@/components/page-meta";
import PropertiesFilters from "@/components/properties/properties-filters";
import PropertiesToolbar from "@/components/properties/properties-toolbar";
import PropertyCard from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { propertiesPage as copy } from "@/data/pages";
import { ALL } from "@/data/property-filters";
import { usePropertyFilters } from "@/hooks/use-property-filters";
import { DURATION, EASE } from "@/lib/motion";

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-muted px-6 py-20 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-background">
        <HugeiconsIcon
          icon={Home01Icon}
          size={24}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </span>
      <h2 className="mt-6 type-title">{copy.empty.title}</h2>
      <p className="mt-2 text-muted-foreground">{copy.empty.text}</p>
      <Button size="lg" className="mt-8" onClick={onClear}>
        {copy.empty.clear}
      </Button>
    </div>
  );
}

function Properties() {
  const reduceMotion = useReducedMotion();
  const { filters, results, setFilter, setSort, clearAll } =
    usePropertyFilters();

  const transition = {
    duration: reduceMotion ? 0 : DURATION.quick,
    ease: EASE,
  };

  return (
    <>
      <PageMeta title={copy.meta.title} description={copy.meta.description} />
      <PageHeader title={copy.heading} subtext={copy.subtext} />

      <PropertiesFilters
        filters={filters}
        resultCount={results.length}
        onChange={setFilter}
        onClear={clearAll}
      />

      <div className="page-container pt-8 pb-24 md:pb-32">
        <PropertiesToolbar
          filters={filters}
          resultCount={results.length}
          onRemove={(key) => setFilter(key, ALL)}
          onSort={setSort}
        />

        {results.length === 0 ? (
          <div className="mt-8">
            <EmptyState onClear={clearAll} />
          </div>
        ) : (
          <motion.ul
            layout={!reduceMotion}
            className="mt-8 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((property) => (
                <motion.li
                  key={property.id}
                  layout={!reduceMotion}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={transition}
                >
                  <PropertyCard property={property} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>
    </>
  );
}

export default Properties;
