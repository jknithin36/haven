import {
  Airplane01Icon,
  BeachIcon,
  Building03Icon,
  GolfHoleIcon,
  PaintBoardIcon,
  School01Icon,
  ShoppingBag01Icon,
  ShoppingCart01Icon,
  Tree06Icon,
  WavesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useId } from "react";

import { propertyDetailPage } from "@/data/pages";
import type { NearbyIcon, NearbyPlace } from "@/data/properties";

const copy = propertyDetailPage.nearby;

const icons = {
  beach: BeachIcon,
  grocery: ShoppingCart01Icon,
  school: School01Icon,
  airport: Airplane01Icon,
  park: Tree06Icon,
  shopping: ShoppingBag01Icon,
  city: Building03Icon,
  water: WavesIcon,
  culture: PaintBoardIcon,
  golf: GolfHoleIcon,
} satisfies Record<NearbyIcon, unknown>;

// Sidebar card: nearby places with how long it takes to get there.
function NearbyCard({ places }: { places: NearbyPlace[] }) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-xl border border-border p-5"
    >
      <h2 id={headingId} className="type-title">
        {copy.title}
      </h2>
      <ul className="mt-2 divide-y divide-border">
        {places.map((place) => (
          <li key={place.label} className="flex items-center gap-3 py-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <HugeiconsIcon
                icon={icons[place.icon]}
                size={18}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </span>
            <span className="flex-1">{place.label}</span>
            <span className="text-sm text-muted-foreground tabular-nums">
              {place.time}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default NearbyCard;
