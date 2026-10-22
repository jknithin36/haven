import {
  Building03Icon,
  Calendar03Icon,
  Mail01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import type { HugeiconsIconProps } from "@hugeicons/react";
import { Link } from "react-router";

import Icon from "@/components/admin/icon";
import { activityPage as copy } from "@/data/admin-activity";
import { formatDateTime, relativeTime } from "@/lib/admin-format";
import { entityHref } from "@/lib/admin-links";
import type { ActivityEvent, EntityType } from "@/store/activity";

const icons: Record<EntityType, HugeiconsIconProps["icon"]> = {
  property: Building03Icon,
  tour: Calendar03Icon,
  message: Mail01Icon,
  agent: UserGroupIcon,
};

// One event: type icon, what happened, and when. The whole row links to
// the home, tour, message, or agent it's about.
function ActivityRow({ event, now }: { event: ActivityEvent; now: number }) {
  return (
    <li className="border-b border-border last:border-b-0">
      <Link
        to={entityHref(event)}
        className="admin-focus group flex items-start gap-3 rounded-sm px-1 py-3.5 transition-colors hover:bg-subtle sm:items-center"
      >
        <Icon
          icon={icons[event.entityType]}
          size={16}
          className="mt-0.5 shrink-0 text-muted-foreground sm:mt-0"
        />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-6">
          <span className="min-w-0 flex-1">
            <span className="sr-only">
              {copy.typeSingular[event.entityType]}:{" "}
            </span>
            {event.text}
          </span>
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums sm:text-sm">
            <time dateTime={event.createdAt}>
              {formatDateTime(event.createdAt)}
            </time>
            <span className="ml-2 text-faint">
              {relativeTime(event.createdAt, now)}
            </span>
          </span>
        </span>
      </Link>
    </li>
  );
}

export default ActivityRow;
