import AgentAvatar from "@/components/admin/agent-avatar";
import { TourStatusPill } from "@/components/admin/status-pill";
import { statusLabels } from "@/data/admin";
import { toursPage } from "@/data/admin-tours";
import { firstName, type Agent } from "@/data/agents";
import { dayLabel, formatShortDate, relativeTime } from "@/lib/admin-format";
import { toIsoDate } from "@/lib/dates";
import { groupByDate } from "@/lib/tours";
import type { ListedProperty } from "@/store/properties";
import type { TourRequest } from "@/store/requests";

const copy = toursPage;

// The client's name; its click area stretches over the whole row.
function OpenButton({
  tour,
  onOpen,
}: {
  tour: TourRequest;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(tour.id)}
      aria-label={copy.row.open(tour.name)}
      className="admin-focus block max-w-full truncate rounded-sm text-left font-medium after:absolute after:inset-0 after:content-['']"
    >
      {tour.name}
    </button>
  );
}

// Tours grouped under sticky date headers. The client name is the row's
// main button and stretches over the whole row; Confirm sits above it.
function ToursList({
  tours,
  homes,
  agents,
  now,
  onOpen,
  onConfirm,
}: {
  tours: TourRequest[];
  homes: ListedProperty[];
  agents: Agent[];
  now: Date;
  onOpen: (id: string) => void;
  onConfirm: (tour: TourRequest) => void;
}) {
  const today = toIsoDate(now);
  return (
    <div>
      {/* Column labels, desktop only */}
      <div
        aria-hidden="true"
        className="hidden h-10 items-center gap-4 border-b border-border px-3 admin-meta lg:flex"
      >
        <span className="w-20">{copy.columns.time}</span>
        <span className="w-56">{copy.columns.client}</span>
        <span className="flex-1">{copy.columns.home}</span>
        <span className="w-20">{copy.columns.type}</span>
        <span className="w-28">{copy.columns.agent}</span>
        <span className="w-24">{copy.columns.status}</span>
        <span className="w-20">{copy.columns.requested}</span>
        <span className="w-20" />
      </div>

      {groupByDate(tours).map((group) => (
        <section key={group.date} aria-label={dayLabel(group.date, today)}>
          <h2 className="sticky top-14 z-10 flex h-10 items-baseline gap-2 border-b border-border bg-background px-3 pt-3 text-[13px] font-semibold">
            {dayLabel(group.date, today)}
            <span className="font-normal text-faint tabular-nums">
              {formatShortDate(group.date)}
            </span>
          </h2>
          <ul>
            {group.tours.map((tour) => {
              const home = homes.find((h) => h.id === tour.propertyId);
              const agent = agents.find((a) => a.id === tour.agentId);
              return (
                <li
                  key={tour.id}
                  className="group relative border-b border-border transition-colors hover:bg-subtle"
                >
                  {/* Phones and tablets: two compact lines */}
                  <div className="flex gap-4 px-3 py-3 lg:hidden">
                    <span className="w-18 shrink-0 font-medium whitespace-nowrap tabular-nums">
                      {tour.time}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <OpenButton tour={tour} onOpen={onOpen} />
                        <TourStatusPill status={tour.status} />
                      </div>
                      <p className="mt-0.5 truncate text-muted-foreground">
                        {home?.name ?? tour.propertySlug} ·{" "}
                        {statusLabels.tourType[tour.type]}
                      </p>
                    </div>
                  </div>

                  {/* Desktop: one row of columns */}
                  <div className="hidden h-14 items-center gap-4 px-3 lg:flex">
                    <span className="w-20 shrink-0 font-medium tabular-nums">
                      {tour.time}
                    </span>
                    <div className="w-56 min-w-0 shrink-0">
                      <OpenButton tour={tour} onOpen={onOpen} />
                      <span className="block truncate text-muted-foreground">
                        {tour.email}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <img
                        src={home?.image || undefined}
                        alt=""
                        className="size-10 shrink-0 rounded-lg bg-muted object-cover"
                      />
                      <span className="truncate">
                        {home?.name ?? tour.propertySlug}
                      </span>
                    </div>
                    <span className="w-20 shrink-0 text-muted-foreground">
                      {statusLabels.tourType[tour.type]}
                    </span>
                    <span className="flex w-28 shrink-0 items-center gap-2">
                      {agent && (
                        <>
                          <AgentAvatar agent={agent} />
                          <span className="truncate">{firstName(agent)}</span>
                        </>
                      )}
                    </span>
                    <span className="w-24 shrink-0">
                      <TourStatusPill status={tour.status} />
                    </span>
                    <span className="w-20 shrink-0 text-faint tabular-nums">
                      {relativeTime(tour.createdAt, now.getTime())}
                    </span>
                    <span className="relative z-[1] flex w-20 shrink-0 justify-end">
                      {tour.status === "new" && (
                        <button
                          type="button"
                          onClick={() => onConfirm(tour)}
                          className="admin-focus h-8 rounded-lg border border-border bg-background px-3 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-muted"
                        >
                          {copy.row.confirm}
                        </button>
                      )}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default ToursList;
