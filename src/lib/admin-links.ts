import type { ActivityEvent } from "@/store/activity";

// Where an activity event links to in the dashboard.
export function entityHref(
  event: Pick<ActivityEvent, "entityType" | "entityId">,
) {
  switch (event.entityType) {
    case "property":
      return `/admin/properties/${event.entityId}/edit`;
    case "tour":
      return `/admin/tours?tour=${event.entityId}`;
    case "message":
      return `/admin/messages?id=${event.entityId}`;
    case "agent":
      return `/admin/agents?edit=${event.entityId}`;
  }
}
