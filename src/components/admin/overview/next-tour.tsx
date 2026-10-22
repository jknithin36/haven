import {
  ArrowRight01Icon,
  Call02Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { Link } from "react-router";

import Icon from "@/components/admin/icon";
import { TourStatusPill } from "@/components/admin/status-pill";
import ButtonLink from "@/components/button-link";
import { Button } from "@/components/ui/button";
import { overviewPage, statusLabels } from "@/data/admin";
import { toursPage } from "@/data/admin-tours";
import { dayLabel, relativeTime, tourDate } from "@/lib/admin-format";
import { toIsoDate } from "@/lib/dates";
import type { ListedProperty } from "@/store/properties";
import type { TourRequest } from "@/store/requests";

const copy = overviewPage.nextUp;

const iconLink =
  "admin-focus flex size-9 items-center justify-center rounded-[10px] border border-border text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground";

// The very next tour, big enough to act on without opening anything.
function NextTour({
  tour,
  home,
  now,
  onConfirm,
}: {
  tour: TourRequest | undefined;
  home: ListedProperty | undefined;
  now: Date;
  onConfirm: (tour: TourRequest) => void;
}) {
  if (!tour) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-[14px] border border-border p-6">
        <p className="text-muted-foreground">{copy.empty}</p>
        <ButtonLink to="/admin/tours" variant="outline" size="default">
          {copy.emptyAction}
        </ButtonLink>
      </div>
    );
  }

  const homeName = home?.name ?? tour.propertySlug;
  const startsIn = relativeTime(
    tourDate(tour.date, tour.time).toISOString(),
    now.getTime(),
  );
  const mailto = `mailto:${tour.email}?subject=${encodeURIComponent(
    toursPage.actions.emailSubject(homeName),
  )}`;

  return (
    <article className="grid overflow-hidden rounded-[14px] border border-border sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <img
        src={home?.image || undefined}
        alt=""
        className="aspect-16/10 h-full w-full bg-muted object-cover sm:aspect-auto"
      />
      <div className="flex min-w-0 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="admin-meta">
            {copy.when(dayLabel(tour.date, toIsoDate(now)), startsIn)}
          </p>
          <TourStatusPill status={tour.status} />
        </div>
        <p className="mt-3 text-[2rem] leading-none font-medium tracking-tight tabular-nums">
          {tour.time}
        </p>
        <h3 className="mt-4 truncate text-[15px] font-semibold">{homeName}</h3>
        {home && (
          <p className="truncate text-muted-foreground">
            {home.address}, {home.city}
          </p>
        )}
        <p className="mt-3">
          {tour.name}
          <span className="text-muted-foreground">
            {" "}
            · {statusLabels.tourType[tour.type]}
          </span>
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          {tour.status === "new" && (
            <Button onClick={() => onConfirm(tour)}>{copy.confirm}</Button>
          )}
          <Link
            to={`/admin/tours?tour=${tour.id}`}
            className="admin-focus inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-border px-3 transition-colors hover:bg-subtle"
          >
            {copy.open}
            <Icon icon={ArrowRight01Icon} size={16} />
          </Link>
          <span className="ml-auto flex gap-2">
            <a
              href={mailto}
              aria-label={copy.email}
              title={copy.email}
              className={iconLink}
            >
              <Icon icon={Mail01Icon} size={16} />
            </a>
            <a
              href={`tel:${tour.phone.replace(/[^\d+]/g, "")}`}
              aria-label={copy.call}
              title={copy.call}
              className={iconLink}
            >
              <Icon icon={Call02Icon} size={16} />
            </a>
          </span>
        </div>
      </div>
    </article>
  );
}

export default NextTour;
