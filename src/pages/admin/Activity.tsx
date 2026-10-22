import { useId, useMemo } from "react";

import ActivityRow from "@/components/admin/activity/activity-row";
import AdminPageHeader from "@/components/admin/admin-page-header";
import EmptyState from "@/components/admin/empty-state";
import PaginationBar from "@/components/admin/pagination-bar";
import PageMeta from "@/components/page-meta";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { activityPage as copy } from "@/data/admin-activity";
import { useNow } from "@/hooks/use-now";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { useUrlState } from "@/hooks/use-url-state";
import { dayLabel } from "@/lib/admin-format";
import { toIsoDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import {
  useActivity,
  type ActivityEvent,
  type EntityType,
} from "@/store/activity";

const PER_PAGE = 20;
const ALL = "all";
const TYPES = Object.keys(copy.types) as EntityType[];
const DEFAULTS = { type: ALL, page: "1" };

// Consecutive events on the same local day, newest day first.
function groupByDay(events: ActivityEvent[]) {
  const groups: { day: string; events: ActivityEvent[] }[] = [];
  for (const event of events) {
    const day = toIsoDate(new Date(event.createdAt));
    const last = groups.at(-1);
    if (last?.day === day) last.events.push(event);
    else groups.push({ day, events: [event] });
  }
  return groups;
}

function ActivitySkeleton() {
  return (
    <div aria-hidden="true">
      {[6, 8, 6].map((rows, g) => (
        <div key={g}>
          <div className="flex h-10 items-end border-b border-border pb-2">
            <Skeleton className="h-3 w-24" />
          </div>
          {Array.from({ length: rows }, (_, i) => (
            <div
              key={i}
              className="flex h-12.5 items-center gap-3 border-b border-border px-1"
            >
              <Skeleton className="size-4" />
              <Skeleton className="h-4 w-72 max-w-[60%]" />
              <Skeleton className="ml-auto h-4 w-32 max-sm:hidden" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Activity() {
  const loading = useSimulatedLoading();
  const events = useActivity();
  const now = useNow().getTime();
  const headingId = useId();
  const { values, set } = useUrlState(DEFAULTS);

  const type = TYPES.includes(values.type as EntityType) ? values.type : ALL;
  // Newest first, so each day forms one group.
  const filtered = useMemo(
    () =>
      events
        .filter((e) => type === ALL || e.entityType === type)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [events, type],
  );
  const counts = useMemo(() => {
    const result = { [ALL]: events.length } as Record<string, number>;
    for (const t of TYPES) {
      result[t] = events.filter((e) => e.entityType === t).length;
    }
    return result;
  }, [events]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(Math.max(1, Number(values.page) || 1), pages);
  const rows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const groups = groupByDay(rows);
  const today = toIsoDate(new Date(now));

  const filters = [
    { value: ALL, label: copy.all },
    ...TYPES.map((t) => ({ value: t, label: copy.types[t] })),
  ];

  return (
    <>
      <PageMeta title={copy.meta.title} noindex />
      <AdminPageHeader title={copy.title} count={copy.count(filtered.length)} />

      {/* Type filter */}
      <div
        role="group"
        aria-label={copy.filterLabel}
        className="-mx-4 mt-6 flex gap-1 overflow-x-auto border-b border-border px-4 lg:mx-0 lg:px-0"
      >
        {filters.map((f) => {
          const active = type === f.value;
          return (
            <button
              key={f.value}
              type="button"
              aria-pressed={active}
              onClick={() => set({ type: f.value })}
              className={cn(
                "admin-focus -mb-px flex h-10 shrink-0 items-center gap-2 rounded-t-md border-b-2 px-3 whitespace-nowrap transition-colors",
                active
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
              <span className="text-xs text-faint tabular-nums">
                {counts[f.value]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-2">
        {loading ? (
          <ActivitySkeleton />
        ) : events.length === 0 ? (
          <div className="mt-6">
            <EmptyState text={copy.empty.text} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              text={copy.noResults.text}
              action={
                <Button variant="outline" onClick={() => set({ type: ALL })}>
                  {copy.noResults.action}
                </Button>
              }
            />
          </div>
        ) : (
          <section aria-labelledby={headingId}>
            <h2 id={headingId} className="sr-only">
              {copy.title}
            </h2>
            {groups.map((group) => (
              <div key={group.day}>
                <h3 className="admin-meta sticky top-14 z-10 flex h-10 items-end border-b border-border bg-background pb-2">
                  {dayLabel(group.day, today)}
                </h3>
                <ul>
                  {group.events.map((event) => (
                    <ActivityRow key={event.id} event={event} now={now} />
                  ))}
                </ul>
              </div>
            ))}
            <PaginationBar
              page={page}
              perPage={PER_PAGE}
              total={filtered.length}
              onPage={(n) => set({ page: String(n) })}
              copy={copy.pagination}
            />
          </section>
        )}
      </div>
    </>
  );
}

export default Activity;
