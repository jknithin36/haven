import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

import Icon from "@/components/admin/icon";
import { toursPage } from "@/data/admin-tours";
import { formatShortDate } from "@/lib/admin-format";
import { fromIsoDate, parseTime, toIsoDate } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { ListedProperty } from "@/store/properties";
import type { TourRequest } from "@/store/requests";

const copy = toursPage.week;

const FIRST_HOUR = 9;
const LAST_HOUR = 18; // 6 PM, the bottom line
const HOUR_PX = 64;
const BLOCK_PX = 52; // a tour block, a little under an hour

const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const hourLabel = new Intl.DateTimeFormat("en-US", { hour: "numeric" });

const HOURS = Array.from(
  { length: LAST_HOUR - FIRST_HOUR + 1 },
  (_, i) => FIRST_HOUR + i,
);

function blockTop(time: string) {
  const { hours, minutes } = parseTime(time);
  const offset = hours - FIRST_HOUR + minutes / 60;
  const max = LAST_HOUR - FIRST_HOUR - BLOCK_PX / HOUR_PX;
  return Math.min(Math.max(offset, 0), max) * HOUR_PX;
}

// Mon–Sun with hairline hour lines. Confirmed tours are solid black, new
// ones outlined, completed ones faint. Phones show one day at a time.
function ToursWeek({
  dates,
  tours,
  homes,
  now,
  day,
  onDay,
  onWeek,
  onOpen,
}: {
  dates: string[];
  tours: TourRequest[];
  homes: ListedProperty[];
  now: Date;
  day: string; // the day shown on phones
  onDay: (date: string) => void;
  onWeek: (step: -1 | 0 | 1) => void;
  onOpen: (id: string) => void;
}) {
  const today = toIsoDate(now);
  const range = copy.range(
    formatShortDate(dates[0]),
    formatShortDate(dates[6]),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <p aria-live="polite" className="mr-auto font-medium tabular-nums">
          {range}
        </p>
        <button
          type="button"
          onClick={() => onWeek(0)}
          className="admin-focus h-9 rounded-[10px] border border-border px-3 hover:bg-subtle"
        >
          {copy.today}
        </button>
        <button
          type="button"
          onClick={() => onWeek(-1)}
          aria-label={copy.previous}
          className="admin-focus flex size-9 items-center justify-center rounded-[10px] border border-border hover:bg-subtle"
        >
          <Icon icon={ArrowLeft01Icon} size={16} />
        </button>
        <button
          type="button"
          onClick={() => onWeek(1)}
          aria-label={copy.next}
          className="admin-focus flex size-9 items-center justify-center rounded-[10px] border border-border hover:bg-subtle"
        >
          <Icon icon={ArrowRight01Icon} size={16} />
        </button>
      </div>

      {/* Phones: pick a day */}
      <div
        role="group"
        aria-label={copy.days}
        className="mt-4 grid grid-cols-7 gap-1 md:hidden"
      >
        {dates.map((date) => (
          <button
            key={date}
            type="button"
            onClick={() => onDay(date)}
            aria-pressed={date === day}
            className={cn(
              "admin-focus flex flex-col items-center rounded-[10px] py-2 text-xs",
              date === day ? "bg-foreground text-background" : "hover:bg-muted",
            )}
          >
            <span>{weekday.format(fromIsoDate(date))}</span>
            <span className="text-sm font-medium tabular-nums">
              {fromIsoDate(date).getDate()}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex border-t border-border">
        {/* Hour labels */}
        <div aria-hidden="true" className="w-14 shrink-0 pt-12">
          {HOURS.map((h) => (
            <div
              key={h}
              className="relative text-right text-xs text-faint tabular-nums"
              style={{ height: h === LAST_HOUR ? 0 : HOUR_PX }}
            >
              <span className="absolute -top-2 right-3">
                {hourLabel.format(new Date(2000, 0, 1, h))}
              </span>
            </div>
          ))}
        </div>

        <div className="grid flex-1 grid-cols-1 md:grid-cols-7">
          {dates.map((date) => {
            const dayTours = tours.filter((t) => t.date === date);
            const isToday = date === today;
            return (
              <section
                key={date}
                aria-label={`${weekday.format(fromIsoDate(date))} ${formatShortDate(date)}`}
                className={cn(
                  "border-l border-border",
                  date !== day && "max-md:hidden",
                  isToday && "bg-subtle",
                )}
              >
                <h3
                  className={cn(
                    "flex h-12 items-center justify-center gap-1.5 border-b border-border text-[13px]",
                    isToday ? "font-semibold" : "text-muted-foreground",
                  )}
                >
                  {weekday.format(fromIsoDate(date))}
                  <span className="tabular-nums">
                    {fromIsoDate(date).getDate()}
                  </span>
                </h3>
                <div
                  className="relative"
                  style={{ height: (LAST_HOUR - FIRST_HOUR) * HOUR_PX }}
                >
                  {HOURS.slice(1, -1).map((h) => (
                    <div
                      key={h}
                      aria-hidden="true"
                      className="absolute inset-x-0 border-t border-border/70"
                      style={{ top: (h - FIRST_HOUR) * HOUR_PX }}
                    />
                  ))}
                  {dayTours.length === 0 && (
                    <p className="sr-only">{copy.noTours}</p>
                  )}
                  <ul>
                    {dayTours.map((tour) => {
                      const home = homes.find((h) => h.id === tour.propertyId);
                      return (
                        <li
                          key={tour.id}
                          className="absolute inset-x-1"
                          style={{
                            top: blockTop(tour.time) + 2,
                            height: BLOCK_PX,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => onOpen(tour.id)}
                            className={cn(
                              "admin-focus flex h-full w-full flex-col overflow-hidden rounded-lg border px-2 py-1.5 text-left text-xs leading-snug transition-colors",
                              tour.status === "confirmed" &&
                                "border-foreground bg-foreground text-background hover:bg-foreground/85",
                              tour.status === "new" &&
                                "border-foreground bg-background hover:bg-muted",
                              tour.status === "completed" &&
                                "border-border bg-muted text-muted-foreground hover:bg-border",
                            )}
                          >
                            <span className="font-medium tabular-nums">
                              {tour.time}
                            </span>
                            <span className="truncate">
                              {home?.name ?? tour.propertySlug}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ToursWeek;
