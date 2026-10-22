import type { NeighborhoodStats } from "@/data/neighborhoods";
import { neighborhoodDetailPage } from "@/data/pages";
import { formatPrice } from "@/lib/format";

const copy = neighborhoodDetailPage.stats;

// Six numbers in a 3 × 2 grid (2 × 3 on phones), each with a thin divider on
// its left. Six in one row is too tight for prices like "$2,600/mo".
function AreaStats({ stats }: { stats: NeighborhoodStats }) {
  const items = [
    { label: copy.medianPrice, value: formatPrice(stats.medianPrice, "sale") },
    {
      label: copy.avgRent,
      value: copy.perMonth(formatPrice(stats.avgRent, "sale")),
    },
    { label: copy.homesListed, value: String(stats.homesListed) },
    { label: copy.beach, value: copy.minutes(stats.beachMinutes) },
    { label: copy.airport, value: copy.minutes(stats.airportMinutes) },
    { label: copy.walkability, value: stats.walkability },
  ];

  return (
    <dl
      aria-label={copy.label}
      className="grid grid-cols-2 gap-y-8 md:grid-cols-3"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col-reverse border-l border-border pl-5"
        >
          <dt className="mt-2 text-sm text-muted-foreground">{item.label}</dt>
          <dd className="type-stat">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default AreaStats;
