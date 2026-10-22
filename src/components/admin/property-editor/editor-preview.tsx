import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

import Icon from "@/components/admin/icon";
import { PropertyStatusPill } from "@/components/admin/status-pill";
import PropertyCard from "@/components/property/property-card";
import { propertyEditorPage } from "@/data/admin";
import type { ListedProperty } from "@/store/properties";

const copy = propertyEditorPage.preview;

// A plain gray picture until the home has a photo.
const EMPTY_PHOTO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 7 5'%3E%3Crect width='7' height='5' fill='%23f2f2f2'/%3E%3C/svg%3E";

// The public card exactly as visitors will see it. It's inert, so clicks and
// Tab skip it.
function EditorPreview({
  property,
  savedSlug,
}: {
  property: ListedProperty;
  savedSlug?: string; // set when the saved home is public
}) {
  const card = { ...property, image: property.image || EMPTY_PHOTO };
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="admin-meta">{copy.label}</p>
        <PropertyStatusPill status={property.status} />
      </div>
      <div inert className="mt-4">
        <PropertyCard property={card} />
      </div>
      <div className="mt-6 border-t border-border pt-4">
        {savedSlug ? (
          <a
            href={`/properties/${savedSlug}`}
            target="_blank"
            rel="noreferrer"
            className="admin-focus inline-flex items-center gap-1.5 rounded-sm font-medium underline-offset-4 hover:underline"
          >
            {copy.onSite}
            <Icon icon={ArrowUpRight01Icon} size={16} />
          </a>
        ) : (
          <p className="text-faint">{copy.hidden}</p>
        )}
      </div>
    </div>
  );
}

export default EditorPreview;
