import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { propertyDetailPage } from "@/data/pages";
import type { Property } from "@/data/properties";
import { daysSince, formatLongDate } from "@/lib/dates";
import { formatPrice, formatSqft } from "@/lib/format";

const copy = propertyDetailPage.details;

type Row = { label: string; value: ReactNode };

function money(amount: number) {
  return formatPrice(amount, "sale");
}

function FloodZone({ zone }: { zone: Property["floodZone"] }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {copy.zone(zone)}
      <Tooltip>
        <TooltipTrigger
          aria-label={copy.floodInfo}
          className="inline-flex rounded-full text-muted-foreground focus-ring"
        >
          <HugeiconsIcon
            icon={InformationCircleIcon}
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </TooltipTrigger>
        <TooltipContent>{copy.floodZones[zone]}</TooltipContent>
      </Tooltip>
      <span className="sr-only">{copy.floodZones[zone]}</span>
    </span>
  );
}

function KeyDetails({ property }: { property: Property }) {
  const rows: Row[] = [
    { label: copy.type, value: property.type },
    { label: copy.yearBuilt, value: property.yearBuilt },
  ];
  if (property.lotSqft !== undefined) {
    rows.push({ label: copy.lot, value: formatSqft(property.lotSqft) });
  }
  if (property.garage !== undefined) {
    rows.push({ label: copy.garage, value: copy.spaces(property.garage) });
  }
  rows.push({
    label: copy.hoa,
    value: property.hoaMonthly
      ? copy.perMonth(money(property.hoaMonthly))
      : copy.none,
  });

  if (property.priceType === "sale") {
    if (property.taxesYearly !== undefined) {
      rows.push({
        label: copy.taxes,
        value: copy.perYear(money(property.taxesYearly)),
      });
    }
  } else {
    if (property.deposit !== undefined) {
      rows.push({ label: copy.deposit, value: money(property.deposit) });
    }
    if (property.leaseTerm) {
      rows.push({ label: copy.leaseTerm, value: property.leaseTerm });
    }
    if (property.availableFrom) {
      rows.push({
        label: copy.availableFrom,
        value: formatLongDate(property.availableFrom),
      });
    }
  }

  rows.push(
    {
      label: copy.floodZone,
      value: <FloodZone zone={property.floodZone} />,
    },
    { label: copy.listed, value: copy.listedAgo(daysSince(property.listedAt)) },
    { label: copy.activity, value: copy.views(property.views, property.saves) },
  );

  return (
    <dl className="grid gap-x-10 sm:grid-cols-2">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex justify-between gap-4 border-b border-border py-3"
        >
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd className="text-right tabular-nums">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default KeyDetails;
