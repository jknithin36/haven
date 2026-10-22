import { Link } from "react-router";

import { neighborhoodsPage as copy } from "@/data/pages";
import type { Neighborhood } from "@/data/neighborhoods";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

function NeighborhoodCard({
  neighborhood,
  large = false,
}: {
  neighborhood: Neighborhood;
  large?: boolean;
}) {
  const { stats } = neighborhood;

  return (
    <Link
      to={`/neighborhoods/${neighborhood.slug}`}
      className="group block rounded-2xl focus-ring"
    >
      <div
        className={cn(
          "overflow-hidden rounded-2xl bg-muted",
          large ? "aspect-16/10 md:aspect-21/9" : "aspect-16/10",
        )}
      >
        <img
          src={neighborhood.heroImage}
          alt={neighborhood.heroAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <h2 className="mt-5 type-subheading">{neighborhood.name}</h2>
      <p className="mt-1 text-muted-foreground">{neighborhood.tagline}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {neighborhood.vibe.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-border px-3 py-1 text-sm"
          >
            {tag}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-muted-foreground tabular-nums">
        {copy.cardStats(
          formatPrice(stats.medianPrice, "sale"),
          stats.beachMinutes,
          stats.homesListed,
        )}
      </p>
    </Link>
  );
}

export default NeighborhoodCard;
