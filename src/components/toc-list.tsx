import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; label: string; count?: number };

// A table of contents: a thin rail down the left, with a short blue marker
// that slides to the active section. Used by the FAQ and legal pages.
function TocList({
  items,
  active,
}: {
  items: TocItem[];
  active: string | null;
}) {
  const reduceMotion = useReducedMotion();
  const markerId = useId();

  return (
    <ol className="flex flex-col border-l border-border">
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <li key={item.id} className="relative">
            {isActive && (
              <motion.span
                layoutId={markerId}
                aria-hidden="true"
                transition={{
                  duration: reduceMotion ? 0 : DURATION.fast,
                  ease: EASE,
                }}
                className="absolute inset-y-1 -left-px w-0.5 rounded-full bg-primary"
              />
            )}
            <a
              href={`#${item.id}`}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "flex items-center justify-between gap-4 rounded-sm py-2 pl-4 text-sm transition-colors focus-ring",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
              {item.count !== undefined && (
                <span className="text-muted-foreground tabular-nums">
                  {item.count}
                </span>
              )}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export default TocList;
