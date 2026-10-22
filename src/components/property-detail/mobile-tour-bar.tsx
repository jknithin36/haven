import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import TourIcon from "@/components/tour-icon";
import { propertyDetailPage as copy } from "@/data/pages";
import type { Property } from "@/data/properties";
import { formatPrice } from "@/lib/format";
import { DURATION, EASE } from "@/lib/motion";

// Phones only: price and a button that opens the tour dialog.
function MobileTourBar({
  property,
  onSchedule,
  visible,
}: {
  property: Property;
  onSchedule: () => void;
  visible: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduceMotion ? false : { y: "100%" }}
          animate={{ y: 0 }}
          exit={reduceMotion ? undefined : { y: "100%" }}
          transition={{ duration: DURATION.quick, ease: EASE }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background lg:hidden"
        >
          <div className="page-container flex items-center justify-between gap-4 py-3">
            <p className="type-title tabular-nums">
              {formatPrice(property.price, property.priceType)}
            </p>
            <Button size="lg" onClick={onSchedule}>
              <TourIcon />
              {copy.mobileCta}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileTourBar;
