import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Link } from "react-router";

import Icon from "@/components/admin/icon";
import { TourStatusPill } from "@/components/admin/status-pill";
import { overviewPage, statusLabels } from "@/data/admin";
import { addDays, dayLabel } from "@/lib/admin-format";
import { fromIsoDate, toIsoDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { ListedProperty } from "@/store/properties";
import type { TourRequest } from "@/store/requests";

const copy = overviewPage.week;
const DAYS = 7;
const MAX_DOTS = 4;

const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" });

// The next seven days as a strip; pick one to see its tours.
function WeekAgenda({
  tours,
  homes,
  now,
}: {
  tours: TourRequest[]; // upcoming, sorted by time
  homes: ListedProperty[];
  now: Date;
}) {
  const today = toIsoDate(now);
  const days = Array.from({ length: DAYS }, (_, i) =>
    toIsoDate(addDays(now, i)),
  );
  const byDay = new Map(
    days.map((d) => [d, tours.filter((t) => t.date === d)]),
  );
  // Start on the first day that has something on it.
  const [selected, setSelected] = useState(
    () => days.find((d) => (byDay.get(d)?.length ?? 0) > 0) ?? today,
  );
  const dayTours = byDay.get(selected) ?? [];
  const label = dayLabel(selected, today);

  return (
    <div>
      <div
        role="group"
        aria-label={copy.daysLabel}
        className="grid grid-cols-7 gap-1"
      >
        {days.map((d) => {
          const n = byDay.get(d)?.length ?? 0;
          const isSelected = d === selected;
          return (
            <button
              key={d}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${dayLabel(d, today)}, ${copy.tours(n)}`}
              onClick={() => setSelected(d)}
              className={cn(
                "admin-focus flex flex-col items-center gap-1 rounded-[10px] py-2.5 transition-colors",
                isSelected ? "bg-foreground text-background" : "hover:bg-muted",
              )}
            >
              <span
                className={cn(
                  "text-xs",
                  !isSelected && "text-muted-foreground",
                )}
              >
                {weekday.format(fromIsoDate(d))}
              </span>
              <span className="text-[15px] font-medium tabular-nums">
                {fromIsoDate(d).getDate()}
              </span>
              <span aria-hidden="true" className="flex h-1 gap-0.5">
                {Array.from({ length: Math.min(n, MAX_DOTS) }, (_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "size-1 rounded-full",
                      isSelected ? "bg-background" : "bg-foreground",
                    )}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4" aria-live="polite">
        {dayTours.length === 0 ? (
          <p className="border-t border-border py-6 text-muted-foreground">
            {/* "No tours today." / "No tours on Fri, Oct 23." */}
            {selected === days[0] || selected === days[1]
              ? copy.empty(label)
              : copy.emptyOn(label)}
          </p>
        ) : (
          <ul className="border-t border-border">
            {dayTours.map((tour) => {
              const home = homes.find((h) => h.id === tour.propertyId);
              return (
                <li key={tour.id} className="border-b border-border">
                  <Link
                    to={`/admin/tours?tour=${tour.id}`}
                    className="admin-focus group flex items-center gap-4 rounded-sm py-3 transition-colors hover:bg-subtle"
                  >
                    <span className="w-18 shrink-0 font-medium whitespace-nowrap tabular-nums">
                      {tour.time}
                    </span>
                    <img
                      src={home?.image || undefined}
                      alt=""
                      className="size-10 shrink-0 rounded-lg bg-muted object-cover max-sm:hidden"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        {home?.name ?? tour.propertySlug}
                      </span>
                      <span className="block truncate text-muted-foreground">
                        {tour.name} · {statusLabels.tourType[tour.type]}
                      </span>
                    </span>
                    <TourStatusPill status={tour.status} />
                    <Icon
                      icon={ArrowRight01Icon}
                      size={16}
                      className="shrink-0 text-faint transition-colors group-hover:text-foreground max-sm:hidden"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default WeekAgenda;
