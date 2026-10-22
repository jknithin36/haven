import { statusLabels } from "@/data/admin";
import { cn } from "@/lib/utils";
import type { PropertyStatus } from "@/store/properties";
import type { TourStatus } from "@/store/requests";

type Look = "dot" | "hollow" | "solid" | "faint" | "struck";

// Monochrome status styles: a 6px dot, a filled pill, or faint text.
const looks: Record<Look, { pill: string; dot?: string }> = {
  dot: { pill: "border-border text-foreground", dot: "bg-foreground" },
  hollow: {
    pill: "border-border text-muted-foreground",
    dot: "border border-muted-foreground",
  },
  solid: { pill: "border-foreground bg-foreground text-background" },
  faint: { pill: "border-transparent bg-muted text-muted-foreground" },
  struck: { pill: "border-transparent text-faint line-through" },
};

const propertyLook: Record<PropertyStatus, Look> = {
  active: "dot",
  draft: "hollow",
  sold: "faint",
  rented: "faint",
};

const tourLook: Record<TourStatus, Look> = {
  new: "dot",
  confirmed: "solid",
  completed: "faint",
  cancelled: "struck",
};

function Pill({ look, children }: { look: Look; children: string }) {
  const style = looks[look];
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium whitespace-nowrap",
        style.pill,
      )}
    >
      {style.dot && (
        <span
          aria-hidden="true"
          className={cn("size-1.5 rounded-full", style.dot)}
        />
      )}
      {children}
    </span>
  );
}

export function PropertyStatusPill({ status }: { status: PropertyStatus }) {
  return (
    <Pill look={propertyLook[status]}>{statusLabels.property[status]}</Pill>
  );
}

export function TourStatusPill({ status }: { status: TourStatus }) {
  return <Pill look={tourLook[status]}>{statusLabels.tour[status]}</Pill>;
}
