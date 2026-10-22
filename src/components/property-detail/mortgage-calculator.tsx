import { useId, useState } from "react";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { propertyDetailPage } from "@/data/pages";
import type { Property } from "@/data/properties";
import { formatPrice } from "@/lib/format";
import { MORTGAGE_DEFAULTS, estimateMortgage } from "@/lib/mortgage";
import { cn } from "@/lib/utils";

const copy = propertyDetailPage.mortgage;
const TERMS = [15, 30] as const;
const DOWN_RANGE = { min: 3, max: 50 } as const;

// Shades of the brand blue, darkest for the largest part of the payment.
const PART_STYLES = {
  principalAndInterest: "bg-primary",
  tax: "bg-primary/60",
  insurance: "bg-primary/35",
  hoa: "bg-primary/15",
} as const;

type Part = keyof typeof PART_STYLES;

function money(amount: number) {
  return formatPrice(Math.round(amount), "sale");
}

function MortgageCalculator({ property }: { property: Property }) {
  const priceId = useId();
  const rateId = useId();
  const downId = useId();
  const [price, setPrice] = useState(property.price);
  const [downPercent, setDownPercent] = useState<number>(
    MORTGAGE_DEFAULTS.downPercent,
  );
  const [ratePercent, setRatePercent] = useState<number>(
    MORTGAGE_DEFAULTS.ratePercent,
  );
  const [termYears, setTermYears] = useState<number>(
    MORTGAGE_DEFAULTS.termYears,
  );

  const result = estimateMortgage({
    price,
    downPercent,
    ratePercent,
    termYears,
    taxesYearly: property.taxesYearly,
    hoaMonthly: property.hoaMonthly,
  });

  const parts: { key: Part; amount: number }[] = (
    [
      { key: "principalAndInterest", amount: result.principalAndInterest },
      { key: "tax", amount: result.tax },
      { key: "insurance", amount: result.insurance },
      { key: "hoa", amount: result.hoa },
    ] satisfies { key: Part; amount: number }[]
  ).filter((part) => part.amount > 0);

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={priceId}>{copy.price}</FieldLabel>
          <Input
            id={priceId}
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={price}
            onChange={(e) => setPrice(Math.max(Number(e.target.value) || 0, 0))}
          />
        </Field>

        <Field>
          <div className="flex justify-between gap-4">
            <FieldLabel id={downId}>{copy.down}</FieldLabel>
            <span className="text-sm tabular-nums text-muted-foreground">
              {downPercent}% · {money(result.downPayment)}
            </span>
          </div>
          <Slider
            aria-labelledby={downId}
            min={DOWN_RANGE.min}
            max={DOWN_RANGE.max}
            step={1}
            value={[downPercent]}
            onValueChange={(value) =>
              setDownPercent(Array.isArray(value) ? value[0] : value)
            }
          />
        </Field>

        <Field>
          <FieldLabel htmlFor={rateId}>{copy.rate}</FieldLabel>
          <Input
            id={rateId}
            type="number"
            inputMode="decimal"
            min={0}
            max={20}
            step={0.125}
            value={ratePercent}
            onChange={(e) =>
              setRatePercent(Math.max(Number(e.target.value) || 0, 0))
            }
          />
        </Field>

        <Field>
          <FieldLabel>{copy.term}</FieldLabel>
          <ToggleGroup
            variant="outline"
            aria-label={copy.term}
            value={[String(termYears)]}
            onValueChange={(next) => {
              if (next[0]) setTermYears(Number(next[0]));
            }}
          >
            {TERMS.map((term) => (
              <ToggleGroupItem
                key={term}
                value={String(term)}
                className="h-10 flex-1 px-4 text-muted-foreground aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background"
              >
                {copy.years(term)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Field>
      </FieldGroup>

      <div className="rounded-xl bg-muted p-6">
        <p className="text-sm text-muted-foreground">{copy.monthly}</p>
        <p aria-live="polite" className="mt-1 type-stat">
          {money(result.total)}
        </p>

        <div
          role="img"
          aria-label={copy.breakdown}
          className="mt-6 flex h-3 overflow-hidden rounded-full bg-background"
        >
          {parts.map((part) => (
            <div
              key={part.key}
              className={PART_STYLES[part.key]}
              style={{ width: `${(part.amount / result.total) * 100}%` }}
            />
          ))}
        </div>

        <dl className="mt-6 flex flex-col gap-3">
          {parts.map((part) => (
            <div key={part.key} className="flex items-center gap-3 text-sm">
              <span
                aria-hidden="true"
                className={cn(
                  "size-3 shrink-0 rounded-full",
                  PART_STYLES[part.key],
                )}
              />
              <dt className="flex-1 text-muted-foreground">
                {copy.parts[part.key]}
              </dt>
              <dd className="tabular-nums">{money(part.amount)}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-xs text-muted-foreground">{copy.disclaimer}</p>
      </div>
    </div>
  );
}

export default MortgageCalculator;
