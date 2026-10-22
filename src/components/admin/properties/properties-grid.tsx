import { Link } from "react-router";

import PropertyActions, {
  type PropertyActionHandlers,
} from "@/components/admin/properties/property-actions";
import { PropertyStatusPill } from "@/components/admin/status-pill";
import { propertiesAdminPage } from "@/data/admin";
import { formatPrice } from "@/lib/format";
import type { ListedProperty } from "@/store/properties";

// The public card style, plus a status pill and a hover action bar.
function PropertiesGrid({
  rows,
  handlers,
}: {
  rows: ListedProperty[];
  handlers: PropertyActionHandlers;
}) {
  return (
    <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((p) => (
        <li key={p.id} className="group">
          <div className="relative aspect-7/5 overflow-hidden rounded-[14px] bg-muted">
            <img
              src={p.image || undefined}
              alt=""
              className="h-full w-full object-cover"
            />
            <span className="absolute top-3 left-3 rounded-full bg-background">
              <PropertyStatusPill status={p.status} />
            </span>
            <div className="absolute top-3 right-3 rounded-[10px] bg-background opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 max-lg:opacity-100">
              <PropertyActions property={p} handlers={handlers} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-4">
            <Link
              to={`/admin/properties/${p.id}/edit`}
              className="admin-focus truncate rounded-sm text-[15px] font-semibold"
            >
              {p.name}
            </Link>
            <span className="shrink-0 tabular-nums">
              {formatPrice(p.price, p.priceType)}
            </span>
          </div>
          <p className="mt-1 text-muted-foreground">
            {p.city} · {p.type} ·{" "}
            {propertiesAdminPage.bedsBaths(p.beds, p.baths)}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default PropertiesGrid;
