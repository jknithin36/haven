import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { FeatureGroup } from "@/data/properties";

// Feature groups in two roomy columns: a heading, then a ticked list.
function FeaturesList({ groups }: { groups: FeatureGroup[] }) {
  return (
    <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
      {groups.map((group) => (
        <div key={group.group}>
          <h3 className="type-title">{group.group}</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {group.items.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={16}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="shrink-0 text-muted-foreground"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default FeaturesList;
