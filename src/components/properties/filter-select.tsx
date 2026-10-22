import { Select as SelectPrimitive } from "@base-ui/react/select";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import type { Option } from "@/data/property-filters";
import { cn } from "@/lib/utils";

export type OptionGroup = { label: string; options: Option[] };

// Compact dropdown that shows its label and current value, e.g.
// "Location  Tampa ▾". The value is dark when a filter is set, muted when not.
function FilterSelect({
  label,
  value,
  options,
  groups,
  active,
  onChange,
  className,
}: {
  label: string;
  value: string;
  options: Option[];
  groups?: OptionGroup[];
  active: boolean;
  onChange: (value: string) => void;
  className?: string;
}) {
  const items = groups
    ? [...options, ...groups.flatMap((g) => g.options)]
    : options;

  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => {
        if (next !== null) onChange(next);
      }}
    >
      <SelectPrimitive.Trigger
        type="button"
        className={cn(
          "inline-flex h-10 items-center justify-between gap-2 rounded-lg border border-border px-3 text-sm transition-colors focus-ring hover:bg-muted",
          className,
        )}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="text-muted-foreground">{label}</span>
          <SelectValue
            className={cn(
              "truncate",
              active ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          />
        </span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={16}
          strokeWidth={1.5}
          aria-hidden="true"
          className="shrink-0 text-muted-foreground"
        />
      </SelectPrimitive.Trigger>
      <SelectContent alignItemWithTrigger={false} align="start">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
        {groups?.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}

export default FilterSelect;
