import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useState } from "react";

import ButtonLink from "@/components/button-link";
import CompareTable from "@/components/neighborhoods/compare-table";
import NeighborhoodCard from "@/components/neighborhoods/neighborhood-card";
import PageHeader from "@/components/page-header";
import PageMeta from "@/components/page-meta";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { neighborhoods } from "@/data/neighborhoods";
import { neighborhoodsPage as copy } from "@/data/pages";
import {
  DURATION,
  EASE,
  IN_VIEW,
  STAGGER,
  fadeUpItem,
  revealOnView,
} from "@/lib/motion";
import { itemListLd } from "@/lib/structured-data";

type View = "cards" | "table";

// Cards stagger a little faster than the default (0.06s vs 0.08s).
const cardList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER * 0.75 } },
};

function Neighborhoods() {
  const reduceMotion = useReducedMotion();
  const [view, setView] = useState<View>("cards");

  const fade = reduceMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: DURATION.quick, ease: EASE },
      };

  return (
    <>
      <PageMeta
        title={copy.meta.title}
        description={copy.meta.description}
        jsonLd={itemListLd(
          neighborhoods.map((n) => ({
            name: n.name,
            path: `/neighborhoods/${n.slug}`,
          })),
        )}
      />
      <PageHeader title={copy.heading} subtext={copy.subtext} />

      <div className="page-container pb-24 md:pb-32">
        <ToggleGroup
          variant="outline"
          aria-label={copy.views.label}
          value={[view]}
          onValueChange={(next) => {
            if (next[0]) setView(next[0] as View);
          }}
        >
          {(["cards", "table"] as const).map((option) => (
            <ToggleGroupItem
              key={option}
              value={option}
              className="h-10 px-4 text-muted-foreground aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background"
            >
              {copy.views[option]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="mt-10">
          <AnimatePresence mode="wait" initial={false}>
            {view === "cards" ? (
              <motion.div key="cards" {...fade}>
                <motion.ul
                  {...(reduceMotion
                    ? {}
                    : {
                        variants: cardList,
                        initial: "hidden",
                        whileInView: "show",
                        viewport: IN_VIEW,
                      })}
                  className="grid gap-x-8 gap-y-14 md:grid-cols-2"
                >
                  {neighborhoods.map((n, i) => (
                    <motion.li
                      key={n.slug}
                      variants={reduceMotion ? undefined : fadeUpItem}
                      className={i === 0 ? "md:col-span-2" : undefined}
                    >
                      <NeighborhoodCard neighborhood={n} large={i === 0} />
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ) : (
              <motion.div key="table" {...fade}>
                <CompareTable neighborhoods={neighborhoods} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.section
          {...revealOnView(reduceMotion)}
          className="mt-24 flex flex-col items-start justify-between gap-6 rounded-2xl bg-muted p-8 md:flex-row md:items-center md:p-12"
        >
          <div>
            <h2 className="type-subheading">{copy.cta.heading}</h2>
            <p className="mt-2 text-muted-foreground">{copy.cta.text}</p>
          </div>
          <ButtonLink to={copy.cta.to} className="w-full md:w-auto">
            {copy.cta.button}
          </ButtonLink>
        </motion.section>
      </div>
    </>
  );
}

export default Neighborhoods;
