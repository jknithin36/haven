import { motion, useReducedMotion } from "motion/react";
import { useId, type ReactNode } from "react";

import { revealOnView } from "@/lib/motion";
import { cn } from "@/lib/utils";

// One block of the main column: a top border, an h2, and its content.
function DetailSection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const headingId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      {...revealOnView(reduceMotion)}
      aria-labelledby={headingId}
      className={cn("border-t border-border py-10", className)}
    >
      <h2 id={headingId} className="type-subheading">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </motion.section>
  );
}

export default DetailSection;
