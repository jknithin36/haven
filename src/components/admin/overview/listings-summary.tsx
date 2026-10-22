import { Link } from "react-router";

import { overviewPage, statusLabels } from "@/data/admin";
import { cn } from "@/lib/utils";
import type { ListedProperty, PropertyStatus } from "@/store/properties";

const copy = overviewPage.listings;
const STATUSES: PropertyStatus[] = ["active", "draft", "sold", "rented"];

// Shades for the status bar, darkest for the most important.
const SHADES: Record<PropertyStatus, string> = {
  active: "bg-foreground",
  draft: "bg-muted-foreground",
  sold: "bg-faint",
  rented: "bg-border",
};

// Homes by status (one thin bar plus four counts) and by city.
function ListingsSummary({ homes }: { homes: ListedProperty[] }) {
  const byStatus = STATUSES.map((status) => ({
    status,
    n: homes.filter((h) => h.status === status).length,
  }));
  const cities = [...new Set(homes.map((h) => h.city))]
    .map((city) => ({ city, n: homes.filter((h) => h.city === city).length }))
    .sort((a, b) => b.n - a.n || a.city.localeCompare(b.city));
  const maxCity = Math.max(1, ...cities.map((c) => c.n));

  return (
    <div>
      <div
        role="img"
        aria-label={byStatus
          .map((s) => `${statusLabels.property[s.status]} ${s.n}`)
          .join(", ")}
        className="flex h-1.5 gap-0.5 overflow-hidden rounded-full"
      >
        {byStatus
          .filter((s) => s.n > 0)
          .map((s) => (
            <span
              key={s.status}
              className={SHADES[s.status]}
              style={{ flexGrow: s.n }}
            />
          ))}
      </div>

      <ul className="mt-4 grid grid-cols-4 border-y border-border">
        {byStatus.map((s, i) => (
          <li key={s.status} className={cn(i > 0 && "border-l border-border")}>
            <Link
              to={`/admin/properties?status=${s.status}`}
              className={cn(
                "admin-focus block px-3 py-3 transition-colors hover:bg-subtle",
                i === 0 && "pl-0",
              )}
            >
              <span className="block text-2xl font-medium tracking-tight tabular-nums">
                {s.n}
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  aria-hidden="true"
                  className={cn("size-1.5 rounded-full", SHADES[s.status])}
                />
                {statusLabels.property[s.status]}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <h3 className="admin-meta mt-6">{copy.byCity}</h3>
      <ol className="mt-2">
        {cities.map((c) => (
          <li key={c.city}>
            <Link
              to={`/admin/properties?city=${encodeURIComponent(c.city)}`}
              className="admin-focus grid grid-cols-[minmax(0,8rem)_1fr_auto] items-center gap-4 rounded-sm py-2 transition-colors hover:bg-subtle"
            >
              <span className="truncate">{c.city}</span>
              <span aria-hidden="true" className="h-1 rounded-full bg-muted">
                <span
                  className="block h-full rounded-full bg-foreground"
                  style={{ width: `${(c.n / maxCity) * 100}%` }}
                />
              </span>
              <span className="text-muted-foreground tabular-nums">
                {copy.homes(c.n)}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ListingsSummary;
