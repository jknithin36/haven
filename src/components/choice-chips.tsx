import { useId } from "react";

import { cn } from "@/lib/utils";

export type Choice = { value: string; label: string };

// Controlled radio buttons styled as chips. Arrow keys move between options;
// screen readers announce a radio group named by `legend`.
function ChoiceChips({
  legend,
  options,
  value,
  onChange,
  className,
}: {
  legend: string;
  options: Choice[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const name = useId();

  return (
    <fieldset className={className}>
      <legend className="sr-only">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="relative">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "flex h-10 cursor-pointer items-center rounded-lg border border-border px-4 text-sm whitespace-nowrap text-muted-foreground transition-colors hover:bg-muted",
                "peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-checked:hover:bg-foreground",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
              )}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default ChoiceChips;
