import { propertyDetailPage } from "@/data/pages";
import type { Property } from "@/data/properties";

const copy = propertyDetailPage.location;

// Google Maps' standard embed link: no API key needed.
function embedUrl(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
}

// A Google Map with a demo pin. Nearby places are in the sidebar.
function LocationSection({ property }: { property: Property }) {
  return (
    <>
      <div className="aspect-4/3 overflow-hidden rounded-xl bg-muted sm:aspect-video">
        <iframe
          src={embedUrl(copy.demoMapQuery)}
          title={copy.mapTitle(property.name)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{copy.demoNote}</p>
    </>
  );
}

export default LocationSection;
