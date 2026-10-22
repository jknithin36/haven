import {
  Bathtub01Icon,
  BedDoubleIcon,
  RulerDimensionLineIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";
import { useId, type ReactNode } from "react";
import { Link } from "react-router";

import { propertyLabels as labels, type Property } from "@/data/properties";
import { formatPrice, formatSqft } from "@/lib/format";

export function FactChip({
  icon,
  children,
}: {
  icon: HugeiconsIconProps["icon"];
  children: ReactNode;
}) {
  return (
    <li className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 tabular-nums">
      <HugeiconsIcon
        icon={icon}
        size={18}
        strokeWidth={1.5}
        aria-hidden="true"
        className="text-muted-foreground"
      />
      {children}
    </li>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const factsId = useId();
  const price = formatPrice(property.price, property.priceType);
  const status = labels.status[property.priceType];
  const sqft = formatSqft(property.sqft);
  const sqftNumber = property.sqft.toLocaleString("en-US");

  return (
    <Link
      to={`/properties/${property.slug}`}
      aria-label={`${property.name}, ${property.city}, ${price}, ${status.toLowerCase()}`}
      aria-describedby={factsId}
      className="group block rounded-xl focus-ring"
    >
      <div className="relative aspect-7/5 overflow-hidden rounded-xl bg-muted">
        <img
          src={property.image}
          alt={property.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute top-4 right-4 rounded-lg bg-background px-3 py-1.5 text-sm text-foreground">
          {status}
        </span>
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="type-title">{property.name}</h3>
        <p className="shrink-0 type-title tabular-nums">{price}</p>
      </div>
      <p className="mt-2 text-muted-foreground">{property.type}</p>

      {/* Chips are visual; screen readers get the full sentence below. */}
      <ul aria-hidden="true" className="mt-4 flex flex-wrap gap-2">
        <FactChip icon={BedDoubleIcon}>{property.beds}</FactChip>
        <FactChip icon={Bathtub01Icon}>{property.baths}</FactChip>
        <FactChip icon={RulerDimensionLineIcon}>{sqft}</FactChip>
      </ul>
      <span id={factsId} className="sr-only">
        {property.beds} {labels.facts.beds}, {property.baths}{" "}
        {labels.facts.baths}, {sqftNumber} {labels.facts.sqft}
      </span>
    </Link>
  );
}

export default PropertyCard;
