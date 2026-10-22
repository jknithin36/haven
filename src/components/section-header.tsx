import type { ReactNode } from "react";

import SectionLabel from "@/components/section-label";

// Label + heading (+ optional subtext) on the left, optional action on the
// right. Every home section uses this, so headings line up the same way.
function SectionHeader({
  id,
  label,
  heading,
  subtext,
  action,
}: {
  id: string;
  label: string;
  heading: string;
  subtext?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <SectionLabel>{label}</SectionLabel>
        <h2 id={id} className="mt-3 type-heading">
          {heading}
        </h2>
        {subtext && (
          <p className="mt-4 max-w-measure text-lg text-pretty text-muted-foreground">
            {subtext}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export default SectionHeader;
