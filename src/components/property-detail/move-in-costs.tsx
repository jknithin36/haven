import { propertyDetailPage } from "@/data/pages";
import type { Property } from "@/data/properties";
import { formatPrice } from "@/lib/format";

const copy = propertyDetailPage.moveIn;

// For rentals: what's due when the lease is signed.
function MoveInCosts({ property }: { property: Property }) {
  const deposit = property.deposit ?? 0;
  const rows = [
    { label: copy.firstMonth, amount: property.price },
    { label: copy.deposit, amount: deposit },
  ];
  const total = property.price + deposit;

  return (
    <dl className="max-w-md rounded-xl bg-muted p-6">
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between gap-4 py-2">
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd className="tabular-nums">{formatPrice(row.amount, "sale")}</dd>
        </div>
      ))}
      <div className="mt-2 flex justify-between gap-4 border-t border-border pt-4">
        <dt className="font-medium">{copy.total}</dt>
        <dd className="type-title tabular-nums">
          {formatPrice(total, "sale")}
        </dd>
      </div>
    </dl>
  );
}

export default MoveInCosts;
