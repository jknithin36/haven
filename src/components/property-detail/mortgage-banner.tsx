import { Calculator01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import MortgageCalculator from "@/components/property-detail/mortgage-calculator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { propertyDetailPage } from "@/data/pages";
import type { Property } from "@/data/properties";
import { formatPrice } from "@/lib/format";
import { defaultMonthlyPayment } from "@/lib/mortgage";

const copy = propertyDetailPage.mortgage;

// Sidebar card with the estimated payment. Its button opens the full
// calculator in a wide dialog.
function MortgageBanner({ property }: { property: Property }) {
  const [open, setOpen] = useState(false);
  const monthly = formatPrice(
    Math.round(defaultMonthlyPayment(property)),
    "sale",
  );

  return (
    <section aria-label={copy.bannerTitle} className="rounded-xl bg-muted p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-background">
          <HugeiconsIcon
            icon={Calculator01Icon}
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </span>
        <p className="type-title">{copy.bannerTitle}</p>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{copy.bannerText}</p>
      <p className="mt-1 type-stat">{copy.perMonth(monthly)}</p>
      <Button
        variant="outline"
        size="lg"
        className="mt-4 w-full bg-background"
        onClick={() => setOpen(true)}
      >
        {copy.bannerButton}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="type-subheading">
              {copy.bannerTitle}
            </DialogTitle>
            <DialogDescription>
              {copy.dialogDescription(property.name)}
            </DialogDescription>
          </DialogHeader>
          <MortgageCalculator property={property} />
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default MortgageBanner;
