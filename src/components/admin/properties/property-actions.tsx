import {
  ArrowUpRight01Icon,
  Copy01Icon,
  Delete02Icon,
  Edit02Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { Link } from "react-router";

import Icon from "@/components/admin/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { propertiesAdminPage } from "@/data/admin";
import type { ListedProperty, PropertyStatus } from "@/store/properties";

const copy = propertiesAdminPage.actions;

export type PropertyActionHandlers = {
  onDuplicate: (p: ListedProperty) => void;
  onStatus: (ids: string[], status: PropertyStatus) => void;
  onDelete: (ids: string[]) => void;
};

const iconButton =
  "admin-focus flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

// View on site ↗, Edit, and a More menu. Revealed on row hover or focus.
function PropertyActions({
  property,
  handlers,
}: {
  property: ListedProperty;
  handlers: PropertyActionHandlers;
}) {
  const closed = property.priceType === "sale" ? "sold" : "rented";

  return (
    <div className="flex items-center justify-end gap-0.5">
      {property.status === "active" && (
        <a
          href={`/properties/${property.slug}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`${copy.viewOnSite}: ${property.name}`}
          title={copy.viewOnSite}
          className={iconButton}
        >
          <Icon icon={ArrowUpRight01Icon} size={16} />
        </a>
      )}
      <Link
        to={`/admin/properties/${property.id}/edit`}
        aria-label={`${copy.edit}: ${property.name}`}
        title={copy.edit}
        className={iconButton}
      >
        <Icon icon={Edit02Icon} size={16} />
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={copy.more(property.name)}
          className={iconButton}
        >
          <Icon icon={MoreHorizontalIcon} size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handlers.onDuplicate(property)}>
              <Icon icon={Copy01Icon} size={16} />
              {copy.duplicate}
            </DropdownMenuItem>
            {property.status !== closed && (
              <DropdownMenuItem
                onClick={() => handlers.onStatus([property.id], closed)}
              >
                {closed === "sold" ? copy.markSold : copy.markRented}
              </DropdownMenuItem>
            )}
            {property.status === "draft" ? (
              <DropdownMenuItem
                onClick={() => handlers.onStatus([property.id], "active")}
              >
                {copy.publish}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => handlers.onStatus([property.id], "draft")}
              >
                {copy.moveToDraft}
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => handlers.onDelete([property.id])}
            >
              <Icon icon={Delete02Icon} size={16} />
              {copy.delete}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default PropertyActions;
