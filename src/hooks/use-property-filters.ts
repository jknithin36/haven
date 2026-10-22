import { useMemo } from "react";
import { useSearchParams } from "react-router";

import { ALL } from "@/data/property-filters";
import {
  filterProperties,
  parseFilters,
  priceOptionsFor,
  toSearchParams,
  type FilterKey,
  type FilterParams,
  type SortValue,
} from "@/lib/filter-properties";
import { usePublicProperties } from "@/store/properties";

// Filters live in the URL, so links like /properties?location=naples work and
// the back button restores the previous filters.
export function usePropertyFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const properties = usePublicProperties();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const results = useMemo(
    () => filterProperties(properties, filters),
    [properties, filters],
  );

  function commit(next: FilterParams) {
    setSearchParams(toSearchParams(next), {
      replace: true,
      preventScrollReset: true,
    });
  }

  function setFilter(key: FilterKey, value: string) {
    const next = { ...filters, [key]: value };
    // A sale price range doesn't apply to rentals, and the other way round.
    if (
      key === "status" &&
      !priceOptionsFor(value).some((r) => r.value === next.price)
    ) {
      next.price = ALL;
    }
    commit(next);
  }

  function setSort(sort: SortValue) {
    commit({ ...filters, sort });
  }

  function clearAll() {
    commit({
      location: ALL,
      type: ALL,
      price: ALL,
      beds: ALL,
      status: ALL,
      sort: filters.sort,
    });
  }

  return { filters, results, setFilter, setSort, clearAll };
}
