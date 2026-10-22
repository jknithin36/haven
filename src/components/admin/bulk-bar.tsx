import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { EASE } from "@/lib/motion";

// Slides up from the bottom when rows are selected.
function BulkBar({ open, children }: { open: boolean; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="toolbar"
          initial={reduceMotion ? false : { y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? undefined : { y: 16, opacity: 0 }}
          transition={{ duration: 0.18, ease: EASE }}
          className="fixed inset-x-0 bottom-6 z-30 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-1 rounded-xl bg-foreground p-1.5 pl-4 text-sm text-background shadow-float"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function BulkButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-8 rounded-lg px-3 whitespace-nowrap transition-colors outline-none hover:bg-background/15 focus-visible:ring-2 focus-visible:ring-background"
    >
      {children}
    </button>
  );
}

export default BulkBar;
