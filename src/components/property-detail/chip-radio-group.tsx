import type { UseFormRegisterReturn } from "react-hook-form";

import { FieldError, FieldLegend, FieldSet } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export type ChipOption = { value: string; label: string };

// Native radio buttons styled as chips. Arrow keys move between options, and
// screen readers announce it as a radio group with a legend.
function ChipRadioGroup({
  legend,
  options,
  registration,
  error,
  columns,
}: {
  legend: string;
  options: ChipOption[];
  registration: UseFormRegisterReturn;
  error?: string;
  columns?: "auto" | "fill";
}) {
  return (
    <FieldSet data-invalid={error ? true : undefined} className="gap-3">
      <FieldLegend variant="label">{legend}</FieldLegend>
      <div
        className={cn("flex flex-wrap gap-2", columns === "fill" && "*:flex-1")}
      >
        {options.map((option) => (
          <label key={option.value} className="relative">
            <input
              type="radio"
              value={option.value}
              aria-invalid={error ? true : undefined}
              className="peer sr-only"
              {...registration}
            />
            <span className="flex h-10 cursor-pointer items-center justify-center rounded-lg border border-border px-3 text-sm whitespace-nowrap text-muted-foreground transition-colors peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 hover:bg-muted peer-checked:hover:bg-foreground">
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {error && <FieldError>{error}</FieldError>}
    </FieldSet>
  );
}

export default ChipRadioGroup;
