import { FavouriteIcon, Share08Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { propertyDetailPage as copy } from "@/data/pages";
import type { Property } from "@/data/properties";
import { useSavedHome } from "@/hooks/use-saved-homes";
import { toSlug } from "@/lib/filter-properties";
import { cn } from "@/lib/utils";

function DetailTopBar({ property }: { property: Property }) {
  const { isSaved, toggle } = useSavedHome(property.id);

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.add({ title: copy.linkCopied });
    } catch {
      toast.add({ title: copy.copyFailed, type: "error" });
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Breadcrumb aria-label={copy.breadcrumbLabel}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/properties" />}>
              {copy.breadcrumbRoot}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              render={
                <Link to={`/properties?location=${toSlug(property.city)}`} />
              }
            >
              {property.city}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{property.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex gap-2">
        <Button variant="outline" size="lg" onClick={share}>
          <HugeiconsIcon
            icon={Share08Icon}
            strokeWidth={1.5}
            aria-hidden="true"
            data-icon="inline-start"
          />
          {copy.share}
        </Button>
        <Button
          variant="outline"
          size="lg"
          aria-pressed={isSaved}
          onClick={toggle}
        >
          <HugeiconsIcon
            icon={FavouriteIcon}
            strokeWidth={1.5}
            aria-hidden="true"
            data-icon="inline-start"
            className={cn(isSaved && "fill-primary text-primary")}
          />
          {isSaved ? copy.saved : copy.save}
        </Button>
      </div>
    </div>
  );
}

export default DetailTopBar;
