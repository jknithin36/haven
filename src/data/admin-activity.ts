// Copy for the dashboard's Activity page.

import type { EntityType } from "@/store/activity";

export const activityPage = {
  meta: { title: "Activity" },
  title: "Activity",
  count: (n: number) => `${n} ${n === 1 ? "event" : "events"}`,
  filterLabel: "Filter by type",
  all: "All",
  types: {
    property: "Properties",
    tour: "Tours",
    message: "Messages",
    agent: "Agents",
  } satisfies Record<EntityType, string>,
  // Spoken before each event so the icon has a text equivalent.
  typeSingular: {
    property: "Property",
    tour: "Tour",
    message: "Message",
    agent: "Agent",
  } satisfies Record<EntityType, string>,
  empty: { text: "Nothing has happened yet." },
  noResults: { text: "No activity of this type.", action: "Show all" },
  pagination: {
    label: "Pagination",
    range: (from: number, to: number, total: number) =>
      `${from}–${to} of ${total}`,
    previous: "Previous page",
    next: "Next page",
    page: (n: number) => `Page ${n}`,
    perPage: "Rows per page",
  },
};
