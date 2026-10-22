import { FilterHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useInView } from "motion/react";
import { useRef } from "react";

import FilterSelect from "@/components/properties/filter-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { propertiesPage } from "@/data/pages";
import {
  ALL,
  anyPrice,
  bedOptions,
  locationOptions,
  rentPriceRanges,
  salePriceRanges,
  statusOptions,
  typeOptions,
} from "@/data/property-filters";
import {
  activeFilterCount,
  priceOptionsFor,
  type FilterKey,
  type FilterParams,
} from "@/lib/filter-properties";
import { cn } from "@/lib/utils";

const copy = propertiesPage.filters;

type FiltersProps = {
  filters: FilterParams;
  resultCount: number;
  onChange: (key: FilterKey, value: string) => void;
  onClear: () => void;
};

function StatusToggle({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <ToggleGroup
      variant="outline"
      aria-label={copy.status}
      value={[value]}
      // Single choice: ignore clicks that would leave nothing selected.
      onValueChange={(next) => {
        if (next[0]) onChange(next[0]);
      }}
      className={className}
    >
      {statusOptions.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          className="h-10 flex-1 px-4 text-muted-foreground aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

// The same controls render in the desktop bar and the mobile sheet.
function FilterControls({
  filters,
  onChange,
  stacked,
}: Pick<FiltersProps, "filters" | "onChange"> & { stacked: boolean }) {
  const controlClass = stacked ? "w-full" : undefined;
  const priceGroups =
    filters.status === ALL
      ? [
          { label: copy.priceGroups.sale, options: salePriceRanges },
          { label: copy.priceGroups.rent, options: rentPriceRanges },
        ]
      : undefined;
  const priceOptions =
    filters.status === ALL
      ? [anyPrice]
      : [anyPrice, ...priceOptionsFor(filters.status)];

  return (
    <>
      <FilterSelect
        label={copy.location}
        value={filters.location}
        options={locationOptions}
        active={filters.location !== ALL}
        onChange={(v) => onChange("location", v)}
        className={controlClass}
      />
      <FilterSelect
        label={copy.type}
        value={filters.type}
        options={typeOptions}
        active={filters.type !== ALL}
        onChange={(v) => onChange("type", v)}
        className={controlClass}
      />
      <FilterSelect
        label={copy.price}
        value={filters.price}
        options={priceOptions}
        groups={priceGroups}
        active={filters.price !== ALL}
        onChange={(v) => onChange("price", v)}
        className={controlClass}
      />
      <FilterSelect
        label={copy.beds}
        value={filters.beds}
        options={bedOptions}
        active={filters.beds !== ALL}
        onChange={(v) => onChange("beds", v)}
        className={controlClass}
      />
      {stacked && (
        <StatusToggle
          value={filters.status}
          onChange={(v) => onChange("status", v)}
          className="w-full"
        />
      )}
    </>
  );
}

function PropertiesFilters({
  filters,
  resultCount,
  onChange,
  onClear,
}: FiltersProps) {
  const count = activeFilterCount(filters);

  // A 1px marker just above the bar. Once it scrolls out of view, the bar is
  // stuck to the top, so a light line and soft shadow fade in under it.
  const markerRef = useRef<HTMLDivElement>(null);
  const atRest = useInView(markerRef);
  const stuck = !atRest;

  return (
    <>
      <div ref={markerRef} aria-hidden="true" className="h-px" />
      <div
        role="search"
        aria-label={copy.label}
        data-stuck={stuck || undefined}
        className={cn(
          "sticky top-0 z-30 border-b bg-background py-4 transition-[border-color,box-shadow] duration-300",
          stuck
            ? "border-border shadow-[0_6px_16px_-12px_rgb(0_0_0/0.25)]"
            : "border-transparent",
        )}
      >
        <div className="page-container flex items-center gap-3">
          {/* Desktop: dropdowns on the left, sale/rent switch on the right */}
          <div className="hidden flex-1 flex-wrap items-center gap-3 lg:flex">
            <FilterControls
              filters={filters}
              onChange={onChange}
              stacked={false}
            />
            {count > 0 && (
              <Button variant="ghost" size="lg" onClick={onClear}>
                {copy.clearAll}
              </Button>
            )}
            <StatusToggle
              value={filters.status}
              onChange={(v) => onChange("status", v)}
              className="ml-auto"
            />
          </div>

          {/* Mobile and tablet: one button that opens a bottom sheet */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="lg"
                  className="lg:hidden"
                  aria-label={
                    count > 0
                      ? `${copy.open}, ${copy.activeCount(count)}`
                      : undefined
                  }
                />
              }
            >
              <HugeiconsIcon
                icon={FilterHorizontalIcon}
                strokeWidth={1.5}
                aria-hidden="true"
                data-icon="inline-start"
              />
              {copy.open}
              {count > 0 && <Badge>{count}</Badge>}
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="max-h-[85vh] overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle className="type-title">
                  {copy.sheetTitle}
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-3 px-4">
                <FilterControls filters={filters} onChange={onChange} stacked />
              </div>
              <SheetFooter>
                <SheetClose render={<Button size="lg" className="w-full" />}>
                  {copy.show(resultCount)}
                </SheetClose>
                {count > 0 && (
                  <Button variant="ghost" size="lg" onClick={onClear}>
                    {copy.clearAll}
                  </Button>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}

export default PropertiesFilters;
