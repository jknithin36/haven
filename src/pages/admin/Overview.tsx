import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useId, type ReactNode } from "react";
import { Link } from "react-router";

import ActivityRow from "@/components/admin/activity/activity-row";
import Icon from "@/components/admin/icon";
import AttentionList from "@/components/admin/overview/attention-list";
import ListingsSummary from "@/components/admin/overview/listings-summary";
import NextTour from "@/components/admin/overview/next-tour";
import WeekAgenda from "@/components/admin/overview/week-agenda";
import CountUp from "@/components/count-up";
import PageMeta from "@/components/page-meta";
import { Skeleton } from "@/components/ui/skeleton";
import { overviewPage as copy } from "@/data/admin";
import { useNow } from "@/hooks/use-now";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import {
  addDays,
  formatToday,
  greeting,
  startOfWeek,
  tourDate,
} from "@/lib/admin-format";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { useActivity } from "@/store/activity";
import { useAuthUser } from "@/store/auth";
import { markMessageRead, useMessages } from "@/store/messages";
import { useAllProperties } from "@/store/properties";
import {
  confirmTour,
  restoreTour,
  useRequests,
  type TourRequest,
} from "@/store/requests";

const ACTIVITY_COUNT = 6;
const DAY = 86_400_000;

function between(iso: string, from: number, to: number) {
  const t = new Date(iso).getTime();
  return t >= from && t < to;
}

// A titled part of the page: title row with an optional link, then content.
function Section({
  title,
  link,
  className,
  children,
}: {
  title: string;
  link?: { to: string; label: string };
  className?: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={cn("min-w-0", className)}>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 id={id} className="admin-section">
          {title}
        </h2>
        {link && (
          <Link
            to={link.to}
            className="admin-focus inline-flex items-center gap-1 rounded-sm text-muted-foreground hover:text-foreground"
          >
            {link.label}
            <Icon icon={ArrowRight01Icon} size={16} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function OverviewSkeleton() {
  return (
    <div aria-hidden="true">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-3 h-8 w-72" />
      <Skeleton className="mt-3 h-4 w-full max-w-xl" />
      <div className="mt-10 grid grid-cols-2 border-y border-border lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="border-border px-6 py-6 first:pl-0 lg:border-l lg:first:border-l-0"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-4 h-12 w-16" />
            <Skeleton className="mt-3 h-3 w-28" />
          </div>
        ))}
      </div>
      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-60 w-full rounded-[14px]" />
          <Skeleton className="mt-12 h-4 w-28" />
          <Skeleton className="mt-4 h-16 w-full" />
          {[0, 1].map((i) => (
            <Skeleton key={i} className="mt-4 h-10 w-full" />
          ))}
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-4 w-32" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="mt-5 h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

function Overview() {
  const loading = useSimulatedLoading();
  const user = useAuthUser();
  const homes = useAllProperties();
  const tours = useRequests();
  const messages = useMessages();
  const activity = useActivity();
  const metricsId = useId();

  const nowDate = useNow();
  const now = nowDate.getTime();
  const weekStart = startOfWeek(nowDate);
  const weekEnd = addDays(weekStart, 7);
  const lastWeekStart = addDays(weekStart, -7);

  const active = homes.filter((h) => h.status === "active");
  const newTours = tours.filter((t) => t.status === "new");
  const inbox = messages.filter((m) => !m.archived);
  const unread = inbox.filter((m) => !m.read);
  const scheduled = tours.filter((t) => t.status !== "cancelled");
  const inWeek = (t: TourRequest, from: Date, to: Date) => {
    const d = tourDate(t.date, t.time);
    return d >= from && d < to;
  };
  const thisWeek = scheduled.filter((t) => inWeek(t, weekStart, weekEnd));
  const lastWeek = scheduled.filter((t) => inWeek(t, lastWeekStart, weekStart));

  // Change vs the previous 7 days.
  const wk = (list: { createdAt: string }[], weeksBack: number) =>
    list.filter((x) =>
      between(
        x.createdAt,
        now - (weeksBack + 1) * 7 * DAY,
        now - weeksBack * 7 * DAY,
      ),
    ).length;
  const activeDelta =
    active.filter((h) => between(`${h.listedAt}T12:00:00`, now - 7 * DAY, now))
      .length -
    active.filter((h) =>
      between(`${h.listedAt}T12:00:00`, now - 14 * DAY, now - 7 * DAY),
    ).length;

  const metrics = [
    {
      label: copy.metrics.active,
      value: active.length,
      delta: activeDelta,
      to: "/admin/properties?status=active",
    },
    {
      label: copy.metrics.newTours,
      value: newTours.length,
      delta: wk(tours, 0) - wk(tours, 1),
      to: "/admin/tours?tab=new",
    },
    {
      label: copy.metrics.unread,
      value: unread.length,
      delta: wk(messages, 0) - wk(messages, 1),
      to: "/admin/messages?tab=unread",
    },
    {
      label: copy.metrics.thisWeek,
      value: thisWeek.length,
      delta: thisWeek.length - lastWeek.length,
      to: "/admin/tours?view=week",
    },
  ];

  // New and confirmed tours from now on, soonest first.
  const upcoming = scheduled
    .filter(
      (t) =>
        (t.status === "new" || t.status === "confirmed") &&
        tourDate(t.date, t.time) >= nowDate,
    )
    .sort(
      (a, b) =>
        tourDate(a.date, a.time).getTime() - tourDate(b.date, b.time).getTime(),
    );
  const next = upcoming[0];
  const toConfirm = upcoming.filter((t) => t.status === "new");
  const unreadNewest = [...unread].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  function confirm(tour: TourRequest) {
    confirmTour(tour.id);
    notify(copy.toasts.confirmed(tour.name), {
      undoLabel: copy.toasts.undo,
      undo: () => restoreTour(tour),
    });
  }

  return (
    <>
      <PageMeta title={copy.meta.title} noindex />
      {loading ? (
        <OverviewSkeleton />
      ) : (
        <div>
          <header>
            <p className="admin-meta">{formatToday(nowDate)}</p>
            <h1 className="admin-title mt-2">
              {copy.greeting(greeting(nowDate), user?.name ?? "")}
            </h1>
            <p className="mt-2 max-w-2xl text-[15px] text-muted-foreground">
              {copy.summary(newTours.length, unread.length, thisWeek.length)}
            </p>
          </header>

          {/* Key numbers: one strip divided by hairlines */}
          <section aria-labelledby={metricsId} className="mt-10">
            <h2 id={metricsId} className="sr-only">
              {copy.metricsLabel}
            </h2>
            <ul className="grid grid-cols-2 border-y border-border lg:grid-cols-4">
              {metrics.map((m, i) => (
                <li
                  key={m.label}
                  className={cn(
                    "border-border",
                    i % 2 === 1 && "border-l",
                    i >= 2 && "border-t lg:border-t-0",
                    i > 0 && "lg:border-l",
                  )}
                >
                  <Link
                    to={m.to}
                    className="admin-focus group block h-full px-5 py-6 transition-colors hover:bg-subtle lg:px-6"
                  >
                    <span className="admin-meta">{m.label}</span>
                    <span className="admin-number mt-4 block">
                      <CountUp value={m.value} />
                    </span>
                    <span className="mt-3 block text-xs text-faint">
                      {copy.trend(m.delta)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="flex min-w-0 flex-col gap-12 lg:col-span-8">
              <Section
                title={copy.nextUp.title}
                link={{ to: "/admin/tours", label: copy.nextUp.emptyAction }}
              >
                <NextTour
                  tour={next}
                  home={homes.find((h) => h.id === next?.propertyId)}
                  now={nowDate}
                  onConfirm={confirm}
                />
              </Section>
              <Section
                title={copy.week.title}
                link={{
                  to: "/admin/tours?view=week",
                  label: copy.week.viewWeek,
                }}
              >
                <WeekAgenda tours={upcoming} homes={homes} now={nowDate} />
              </Section>
            </div>

            <Section title={copy.attention.title} className="lg:col-span-4">
              <AttentionList
                tours={toConfirm}
                messages={unreadNewest}
                homes={homes}
                now={nowDate}
                onConfirm={confirm}
                onReply={(m) => markMessageRead(m.id)}
              />
            </Section>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-12 border-t border-border pt-10 lg:grid-cols-12">
            <Section
              title={copy.listings.title}
              link={{ to: "/admin/properties", label: copy.listings.manage }}
              className="lg:col-span-5"
            >
              <ListingsSummary homes={homes} />
            </Section>
            <Section
              title={copy.activity.title}
              link={{ to: "/admin/activity", label: copy.activity.viewAll }}
              className="lg:col-span-7"
            >
              {activity.length === 0 ? (
                <p className="text-muted-foreground">{copy.activity.empty}</p>
              ) : (
                <ul className="border-t border-border">
                  {[...activity]
                    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                    .slice(0, ACTIVITY_COUNT)
                    .map((event) => (
                      <ActivityRow key={event.id} event={event} now={now} />
                    ))}
                </ul>
              )}
            </Section>
          </div>
        </div>
      )}
    </>
  );
}

export default Overview;
