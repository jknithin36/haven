import { propertyDetailPage as copy } from "@/data/pages";
import { propertyLabels, type Property } from "@/data/properties";
import { formatPrice, formatSqft } from "@/lib/format";
import { defaultMonthlyPayment } from "@/lib/mortgage";
import { cn } from "@/lib/utils";

// Top of the home page, above the photo: name and key facts on the left,
// location and price on the right.
function DetailHeader({ property }: { property: Property }) {
  const isSale = property.priceType === "sale";
  const monthly = isSale ? defaultMonthlyPayment(property) : undefined;

  const facts = [
    { label: copy.facts.area, value: formatSqft(property.sqft) },
    { label: copy.facts.bedrooms, value: copy.facts.beds(property.beds) },
    { label: copy.facts.bathrooms, value: copy.facts.baths(property.baths) },
    { label: copy.facts.yearBuilt, value: String(property.yearBuilt) },
  ];

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="flex items-center gap-3 text-sm">
          <span
            className={cn(
              "rounded-full px-3 py-1 font-medium",
              isSale
                ? "bg-primary text-primary-foreground"
                : "border border-foreground text-foreground",
            )}
          >
            {propertyLabels.status[property.priceType]}
          </span>
          <span className="text-muted-foreground">{property.type}</span>
        </div>

        <h1 className="mt-3 type-display">{property.name}</h1>

        <dl
          aria-label={copy.facts.label}
          className="mt-8 grid grid-cols-2 gap-y-6 sm:flex sm:flex-wrap sm:gap-y-4"
        >
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="border-border sm:border-l sm:px-8 sm:first:border-l-0 sm:first:pl-0"
            >
              <dt className="text-lg">{fact.label}</dt>
              <dd className="mt-1 text-muted-foreground tabular-nums">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="lg:text-right">
        <p className="text-lg">
          {copy.cityState(property.city, property.state)}
          <span aria-hidden="true" className="mx-2 text-muted-foreground">
            –
          </span>
          <span className="font-medium tabular-nums">
            {formatPrice(property.price, property.priceType)}
          </span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {copy.address(property.address, property.neighborhood)}
        </p>
        {monthly !== undefined && (
          <p className="mt-1 text-sm text-muted-foreground tabular-nums">
            {copy.estimatedMonthly(formatPrice(Math.round(monthly), "sale"))}
          </p>
        )}
      </div>
    </div>
  );
}

export default DetailHeader;
