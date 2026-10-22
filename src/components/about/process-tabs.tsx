import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aboutPage, type ProcessTab } from "@/data/about-page";
import { DURATION, EASE } from "@/lib/motion";

const copy = aboutPage.process;
const TABS = Object.keys(copy.tabs) as ProcessTab[];

// Buying / Selling / Renting tabs, each with four numbered steps. Arrow keys
// move between tabs (built into the Tabs component).
function ProcessTabs() {
  const reduceMotion = useReducedMotion();
  const [tab, setTab] = useState<ProcessTab>("buying");

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value as ProcessTab)}
      className="gap-10"
    >
      <TabsList
        aria-label={copy.tabsLabel}
        activateOnFocus
        className="h-auto gap-1 p-1"
      >
        {TABS.map((key) => (
          <TabsTrigger
            key={key}
            value={key}
            className="h-9 px-4 data-active:bg-foreground data-active:text-background data-active:shadow-none"
          >
            {copy.tabs[key]}
          </TabsTrigger>
        ))}
      </TabsList>

      {TABS.map((key) => (
        <TabsContent key={key} value={key}>
          <motion.ol
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: DURATION.quick, ease: EASE }}
            className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          >
            {/* Thin line connecting the steps on desktop */}
            <span
              aria-hidden="true"
              className="absolute top-6 right-0 left-0 hidden h-px bg-border lg:block"
            />
            {copy.steps[key].map((step, i) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden="true"
                  className="relative inline-block bg-background pr-4 type-heading text-muted-foreground tabular-nums"
                >
                  {copy.stepNumber(i + 1)}
                </span>
                <h3 className="mt-4 type-title">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </motion.ol>
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default ProcessTabs;
