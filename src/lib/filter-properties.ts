import {
  ALL,
  bedOptions,
  locationOptions,
  priceRanges,
  rentPriceRanges,
  salePriceRanges,
  sortOptions,
  statusOptions,
  typeOptions,
  type Option,
} from "@/data/property-filters";
import type { Property } from "@/data/properties";

export type FilterKey = "location" | "type" | "price" | "status" | "beds";
export type SortValue = "newest" | "price-asc" | "price-desc" | "size-desc";

export type FilterParams = Record<FilterKey, string> & { sort: SortValue };

export const DEFAULT_SORT: SortValue = "newest";

export const FILTER_KEYS: FilterKey[] = [
  "location",
  "type",
  "price",
  "beds",
  "status",
];

// "St. Petersburg" → "st-petersburg", "Beach home" → "beach-home"
export function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function pick(value: string | null, options: Option[]) {
  return options.some((o) => o.value === value) ? (value as string) : ALL;
}

// Price options available for a status. "All" shows sale and rent ranges.
export function priceOptionsFor(status: string) {
  if (status === "sale") return salePriceRanges;
  if (status === "rent") return rentPriceRanges;
  return priceRanges;
}

// Reads the URL, falling back to defaults for missing or unknown values.
export function parseFilters(search: URLSearchParams): FilterParams {
  const status = pick(search.get("status"), statusOptions);
  const price = priceOptionsFor(status).some(
    (r) => r.value === search.get("price"),
  )
    ? (search.get("price") as string)
    : ALL;
  const sort = sortOptions.some((o) => o.value === search.get("sort"))
    ? (search.get("sort") as SortValue)
    : DEFAULT_SORT;

  return {
    location: pick(search.get("location"), locationOptions),
    type: pick(search.get("type"), typeOptions),
    price,
    beds: pick(search.get("beds"), bedOptions),
    status,
    sort,
  };
}

// Writes filters back to the URL, leaving out defaults.
export function toSearchParams(filters: FilterParams) {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    if (filters[key] !== ALL) params.set(key, filters[key]);
  }
  if (filters.sort !== DEFAULT_SORT) params.set("sort", filters.sort);
  return params;
}

export function activeFilterCount(filters: FilterParams) {
  return FILTER_KEYS.filter((key) => filters[key] !== ALL).length;
}

function matches(property: Property, filters: FilterParams) {
  if (filters.location !== ALL && toSlug(property.city) !== filters.location) {
    return false;
  }
  if (filters.type !== ALL && toSlug(property.type) !== filters.type) {
    return false;
  }
  if (filters.status !== ALL && property.priceType !== filters.status) {
    return false;
  }
  if (filters.beds !== ALL && property.beds < Number(filters.beds)) {
    return false;
  }
  if (filters.price !== ALL) {
    const range = priceRanges.find((r) => r.value === filters.price);
    if (!range || range.priceType !== property.priceType) return false;
    if (range.min !== undefined && property.price < range.min) return false;
    if (range.max !== undefined && property.price >= range.max) return false;
  }
  return true;
}

// Sale and rent prices aren't comparable, so price sorts keep sale homes
// first, then sort within each group.
function compare(a: Property, b: Property, sort: SortValue) {
  switch (sort) {
    case "price-asc":
    case "price-desc": {
      if (a.priceType !== b.priceType) return a.priceType === "sale" ? -1 : 1;
      return sort === "price-asc" ? a.price - b.price : b.price - a.price;
    }
    case "size-desc":
      return b.sqft - a.sqft;
    case "newest":
      return b.listedAt.localeCompare(a.listedAt);
  }
}

export function filterProperties(
  properties: Property[],
  filters: FilterParams,
): Property[] {
  return properties
    .filter((p) => matches(p, filters))
    .sort((a, b) => compare(a, b, filters.sort));
}
