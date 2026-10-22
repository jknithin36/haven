import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  ArrowUpDownIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Link } from "react-router";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Neighborhood, NeighborhoodStats } from "@/data/neighborhoods";
import { neighborhoodsPage } from "@/data/pages";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const copy = neighborhoodsPage.table;

type NumericKey = Exclude<keyof NeighborhoodStats, "walkability">;
type SortKey = "name" | keyof NeighborhoodStats;
type Sort = { key: SortKey; direction: "ascending" | "descending" };

const WALKABILITY_RANK = { Low: 0, Medium: 1, High: 2 } as const;

const columns: { key: keyof NeighborhoodStats; label: string }[] = [
  { key: "medianPrice", label: copy.medianPrice },
  { key: "avgRent", label: copy.avgRent },
  { key: "homesListed", label: copy.homesListed },
  { key: "beachMinutes", label: copy.beachMinutes },
  { key: "airportMinutes", label: copy.airportMinutes },
  { key: "walkability", label: copy.walkability },
];

const numericKeys: NumericKey[] = [
  "medianPrice",
  "avgRent",
  "homesListed",
  "beachMinutes",
  "airportMinutes",
];

function formatStat(key: keyof NeighborhoodStats, stats: NeighborhoodStats) {
  switch (key) {
    case "medianPrice":
      return formatPrice(stats.medianPrice, "sale");
    case "avgRent":
      return formatPrice(stats.avgRent, "rent");
    case "homesListed":
      return String(stats.homesListed);
    case "beachMinutes":
      return copy.minutes(stats.beachMinutes);
    case "airportMinutes":
      return copy.minutes(stats.airportMinutes);
    case "walkability":
      return stats.walkability;
  }
}

function sortValue(n: Neighborhood, key: SortKey): number | string {
  if (key === "name") return n.name;
  if (key === "walkability") return WALKABILITY_RANK[n.stats.walkability];
  return n.stats[key];
}

// Lowest and highest value per numeric column, shown in bold.
function extremes(rows: Neighborhood[]) {
  const result = {} as Record<NumericKey, { min: number; max: number }>;
  for (const key of numericKeys) {
    const values = rows.map((n) => n.stats[key]);
    result[key] = { min: Math.min(...values), max: Math.max(...values) };
  }
  return result;
}

function SortButton({
  label,
  active,
  direction,
  onClick,
  align = "left",
}: {
  label: string;
  active: boolean;
  direction: Sort["direction"];
  onClick: () => void;
  align?: "left" | "right";
}) {
  const icon = !active
    ? ArrowUpDownIcon
    : direction === "ascending"
      ? ArrowUp01Icon
      : ArrowDown01Icon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={copy.sortBy(label)}
      className={cn(
        "inline-flex items-center gap-1 rounded-sm font-medium focus-ring",
        align === "right" && "flex-row-reverse",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {label}
      <HugeiconsIcon
        icon={icon}
        size={14}
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </button>
  );
}

function CompareTable({ neighborhoods }: { neighborhoods: Neighborhood[] }) {
  const [sort, setSort] = useState<Sort | null>(null);
  const bounds = extremes(neighborhoods);

  const rows = sort
    ? [...neighborhoods].sort((a, b) => {
        const av = sortValue(a, sort.key);
        const bv = sortValue(b, sort.key);
        const diff =
          typeof av === "string" && typeof bv === "string"
            ? av.localeCompare(bv)
            : Number(av) - Number(bv);
        return sort.direction === "ascending" ? diff : -diff;
      })
    : neighborhoods;

  function toggle(key: SortKey) {
    setSort((current) =>
      current?.key === key
        ? {
            key,
            direction:
              current.direction === "ascending" ? "descending" : "ascending",
          }
        : { key, direction: "ascending" },
    );
  }

  function ariaSort(key: SortKey) {
    return sort?.key === key ? sort.direction : "none";
  }

  function isExtreme(key: keyof NeighborhoodStats, n: Neighborhood) {
    if (key === "walkability") return false;
    const value = n.stats[key];
    return value === bounds[key].min || value === bounds[key].max;
  }

  return (
    <>
      {/* Desktop and tablet: a sortable table */}
      <div className="hidden md:block">
        <Table>
          <TableCaption className="text-left">{copy.extremesNote}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead aria-sort={ariaSort("name")}>
                <SortButton
                  label={copy.city}
                  active={sort?.key === "name"}
                  direction={sort?.direction ?? "ascending"}
                  onClick={() => toggle("name")}
                />
              </TableHead>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  aria-sort={ariaSort(column.key)}
                  className="text-right"
                >
                  <SortButton
                    label={column.label}
                    active={sort?.key === column.key}
                    direction={sort?.direction ?? "ascending"}
                    onClick={() => toggle(column.key)}
                    align="right"
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((n) => (
              <TableRow key={n.slug}>
                <TableCell>
                  <Link
                    to={`/neighborhoods/${n.slug}`}
                    className="rounded-sm font-medium underline-offset-4 focus-ring hover:underline"
                  >
                    {n.name}
                  </Link>
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      "text-right tabular-nums",
                      isExtreme(column.key, n) && "font-semibold",
                    )}
                  >
                    {formatStat(column.key, n.stats)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Phones: one card per city */}
      <ul className="flex flex-col gap-4 md:hidden">
        {neighborhoods.map((n) => (
          <li key={n.slug} className="rounded-xl border border-border p-5">
            <Link
              to={`/neighborhoods/${n.slug}`}
              className="rounded-sm type-title focus-ring"
            >
              {n.name}
            </Link>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {columns.map((column) => (
                <div key={column.key} className="flex flex-col">
                  <dt className="text-muted-foreground">{column.label}</dt>
                  <dd
                    className={cn(
                      "tabular-nums",
                      isExtreme(column.key, n) && "font-semibold",
                    )}
                  >
                    {formatStat(column.key, n.stats)}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}

export default CompareTable;
