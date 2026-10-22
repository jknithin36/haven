import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// Leading icon for every "Schedule a tour" button, matching the phone icon
// on "Book a call" (same size and stroke, placed before the text).
function TourIcon() {
  return (
    <HugeiconsIcon
      icon={Calendar03Icon}
      strokeWidth={1.5}
      aria-hidden="true"
      data-icon="inline-start"
    />
  );
}

export default TourIcon;
