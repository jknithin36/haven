import TourForm from "@/components/property-detail/tour-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { firstName, type Agent } from "@/data/agents";
import { propertyDetailPage } from "@/data/pages";
import type { Property } from "@/data/properties";

const copy = propertyDetailPage.tour;

// The tour form in a dialog, opened from the agent card or the phone bar.
function TourDialog({
  open,
  onOpenChange,
  property,
  agent,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property;
  agent: Agent;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="type-subheading">{copy.heading}</DialogTitle>
          <DialogDescription>
            {copy.description(property.name, firstName(agent))}
          </DialogDescription>
        </DialogHeader>
        <TourForm property={property} agent={agent} />
      </DialogContent>
    </Dialog>
  );
}

export default TourDialog;
