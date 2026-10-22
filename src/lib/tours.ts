// Filtering, sorting, and grouping for the Tours page.

import { addDays, startOfWeek, tourDate } from "@/lib/admin-format";
import { toIsoDate } from "@/lib/dates";
import type { ListedProperty } from "@/store/properties";
import type { TourRequest, TourStatus } from "@/store/requests";

export const TOUR_TABS = [
  "new",
  "confirmed",
  "completed",
  "cancelled",
  "all",
] as const;
export type TourTab = (typeof TOUR_TABS)[number];

export const DATE_FILTERS = [
  "all",
  "today",
  "upcoming",
  "week",
  "past",
] as const;
export type DateFilter = (typeof DATE_FILTERS)[number];

export type TourFilters = {
  q: string;
  agent: string;
  type: string;
  date: string;
};

const ALL = "all";

function matchesDate(tour: TourRequest, filter: string, now: Date) {
  const today = toIsoDate(now);
  switch (filter as DateFilter) {
    case "today":
      return tour.date === today;
    case "upcoming":
      return tourDate(tour.date, tour.time) >= now;
    case "past":
      return tourDate(tour.date, tour.time) < now;
    case "week": {
      const start = startOfWeek(now);
      const when = tourDate(tour.date, tour.time);
      return when >= start && when < addDays(start, 7);
    }
    default:
      return true;
  }
}

// Everything but the status tab, so tab counts reflect the other filters.
export function filterTours(
  tours: TourRequest[],
  filters: TourFilters,
  homes: ListedProperty[],
  now: Date,
) {
  const q = filters.q.trim().toLowerCase();
  return tours.filter((t) => {
    if (filters.agent !== ALL && t.agentId !== filters.agent) return false;
    if (filters.type !== ALL && t.type !== filters.type) return false;
    if (!matchesDate(t, filters.date, now)) return false;
    if (!q) return true;
    const home = homes.find((h) => h.id === t.propertyId)?.name ?? "";
    return `${t.name} ${t.email} ${home}`.toLowerCase().includes(q);
  });
}

export function countByStatus(tours: TourRequest[]) {
  const counts: Record<TourTab, number> = {
    new: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    all: tours.length,
  };
  tours.forEach((t) => counts[t.status]++);
  return counts;
}

const time = (t: TourRequest) => tourDate(t.date, t.time).getTime();

// Finished work reads newest first. Everything else reads upcoming tours
// soonest first, then past ones, most recent first.
export function sortTours(tours: TourRequest[], tab: TourTab, now: Date) {
  if (tab === "completed" || tab === "cancelled") {
    return [...tours].sort((a, b) => time(b) - time(a));
  }
  const cutoff = now.getTime();
  const upcoming = tours.filter((t) => time(t) >= cutoff);
  const past = tours.filter((t) => time(t) < cutoff);
  return [
    ...upcoming.sort((a, b) => time(a) - time(b)),
    ...past.sort((a, b) => time(b) - time(a)),
  ];
}

export function inTab(tour: TourRequest, tab: TourTab) {
  return tab === "all" || tour.status === (tab as TourStatus);
}

// Consecutive tours on the same day share one date header.
export function groupByDate(tours: TourRequest[]) {
  const groups: { date: string; tours: TourRequest[] }[] = [];
  for (const tour of tours) {
    const last = groups.at(-1);
    if (last?.date === tour.date) last.tours.push(tour);
    else groups.push({ date: tour.date, tours: [tour] });
  }
  return groups;
}

// The seven ISO dates of the week that is `offset` weeks from this one.
export function weekDates(now: Date, offset: number) {
  const start = addDays(startOfWeek(now), offset * 7);
  return Array.from({ length: 7 }, (_, i) => toIsoDate(addDays(start, i)));
}
