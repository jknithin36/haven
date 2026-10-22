import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "react-router";

import AgentListCard from "@/components/agents/agent-list-card";
import ButtonLink from "@/components/button-link";
import ChoiceChips from "@/components/choice-chips";
import PageHeader from "@/components/page-header";
import PageMeta from "@/components/page-meta";
import FilterSelect from "@/components/properties/filter-select";
import { Button } from "@/components/ui/button";
import type { AgentFocus } from "@/data/agents";
import { neighborhoods } from "@/data/neighborhoods";
import { agentsPage as copy } from "@/data/pages";
import { ALL } from "@/data/property-filters";
import { toSlug } from "@/lib/filter-properties";
import { DURATION, EASE, STAGGER, revealOnView } from "@/lib/motion";
import { useAgents } from "@/store/agents";

const FOCUS_VALUES: AgentFocus[] = [
  "buying",
  "selling",
  "renting",
  "waterfront",
];

const focusOptions = [
  { value: ALL, label: copy.filters.focus.all },
  ...FOCUS_VALUES.map((value) => ({ value, label: copy.filters.focus[value] })),
];

const cityOptions = [
  { value: ALL, label: copy.filters.allCities },
  ...neighborhoods.map((n) => ({ value: n.slug, label: n.name })),
];

function pick(value: string | null, options: { value: string }[]) {
  return options.some((o) => o.value === value) ? (value as string) : ALL;
}

function Agents() {
  const reduceMotion = useReducedMotion();
  const agents = useAgents();
  const [searchParams, setSearchParams] = useSearchParams();
  const specialty = pick(searchParams.get("specialty"), focusOptions);
  const city = pick(searchParams.get("city"), cityOptions);

  // Filters live in the URL (defaults left out), like /properties.
  function update(key: "specialty" | "city", value: string) {
    const next = new URLSearchParams(searchParams);
    if (value === ALL) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true, preventScrollReset: true });
  }

  const results = agents.filter(
    (agent) =>
      (specialty === ALL || agent.focus.includes(specialty as AgentFocus)) &&
      (city === ALL || agent.areas.some((area) => toSlug(area) === city)),
  );

  return (
    <>
      <PageMeta title={copy.meta.title} description={copy.meta.description} />
      <PageHeader title={copy.heading} subtext={copy.subtext} />

      <div className="page-container pb-24 md:pb-32">
        <div
          role="search"
          aria-label={copy.filters.label}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <ChoiceChips
            legend={copy.filters.focusLegend}
            options={focusOptions}
            value={specialty}
            onChange={(value) => update("specialty", value)}
          />
          <FilterSelect
            label={copy.filters.city}
            value={city}
            options={cityOptions}
            active={city !== ALL}
            onChange={(value) => update("city", value)}
          />
        </div>

        <p aria-live="polite" className="mt-8 text-sm text-muted-foreground">
          {copy.results(results.length)}
        </p>

        {results.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-2xl bg-muted px-6 py-20 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl bg-background">
              <HugeiconsIcon
                icon={UserGroupIcon}
                size={24}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </span>
            <p className="mt-6 type-title">{copy.empty.title}</p>
            <p className="mt-2 text-muted-foreground">{copy.empty.text}</p>
            <Button
              size="lg"
              className="mt-8"
              onClick={() =>
                setSearchParams(new URLSearchParams(), { replace: true })
              }
            >
              {copy.empty.clear}
            </Button>
          </div>
        ) : (
          <motion.ul
            layout={!reduceMotion}
            className="mt-6 grid gap-8 lg:grid-cols-2"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((agent, i) => (
                <motion.li
                  key={agent.id}
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
                  transition={{
                    duration: reduceMotion ? 0 : DURATION.base,
                    delay: reduceMotion ? 0 : i * STAGGER,
                    ease: EASE,
                  }}
                >
                  <AgentListCard agent={agent} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}

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

export default Agents;
