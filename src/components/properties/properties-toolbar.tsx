import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import FilterSelect from "@/components/properties/filter-select";
import { Button } from "@/components/ui/button";
import { propertiesPage } from "@/data/pages";
import {
  ALL,
  bedOptions,
  locationOptions,
  priceRanges,
  sortOptions,
  statusOptions,
  typeOptions,
  type Option,
} from "@/data/property-filters";
import {
  DEFAULT_SORT,
  FILTER_KEYS,
  type FilterKey,
  type FilterParams,
  type SortValue,
} from "@/lib/filter-properties";

const optionsByKey: Record<FilterKey, Option[]> = {
  location: locationOptions,
  type: typeOptions,
  price: priceRanges,
  beds: bedOptions,
  status: statusOptions,
};

function labelFor(key: FilterKey, value: string) {
  const label =
    optionsByKey[key].find((o) => o.value === value)?.label ?? value;
  return key === "beds" ? propertiesPage.chips.beds(label) : label;
}

function PropertiesToolbar({
  filters,
  resultCount,
  onRemove,
  onSort,
}: {
  filters: FilterParams;
  resultCount: number;
  onRemove: (key: FilterKey) => void;
  onSort: (sort: SortValue) => void;
}) {
  const location =
    filters.location !== ALL
      ? labelFor("location", filters.location)
      : undefined;
  const active = FILTER_KEYS.filter((key) => filters[key] !== ALL);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p aria-live="polite" className="type-title tabular-nums">
          {propertiesPage.results(resultCount, location)}
        </p>
        <FilterSelect
          label={propertiesPage.filters.sort}
          value={filters.sort}
          options={sortOptions}
          active={filters.sort !== DEFAULT_SORT}
          onChange={(v) => onSort(v as SortValue)}
        />
      </div>

      {active.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {active.map((key) => {
            const label = labelFor(key, filters[key]);
            return (
              <li key={key}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemove(key)}
                  aria-label={propertiesPage.chips.remove(label)}
                >
                  {label}
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    data-icon="inline-end"
                  />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default PropertiesToolbar;
