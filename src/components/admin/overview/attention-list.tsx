import { Link } from "react-router";

import { overviewPage } from "@/data/admin";
import { dayLabel, relativeTime } from "@/lib/admin-format";
import { toIsoDate } from "@/lib/dates";
import type { Message } from "@/store/messages";
import type { ListedProperty } from "@/store/properties";
import type { TourRequest } from "@/store/requests";

const copy = overviewPage.attention;
const PER_GROUP = 3;

const actionButton =
  "admin-focus relative z-[1] h-8 shrink-0 rounded-lg border border-border bg-background px-3 text-[13px] font-medium transition-colors hover:bg-muted";

function Group({
  title,
  count,
  more,
  children,
}: {
  title: string;
  count: number;
  more: { to: string; n: number };
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="flex items-baseline justify-between gap-3 pb-2">
        <span className="admin-meta">{title}</span>
        <span className="text-xs text-faint tabular-nums">{count}</span>
      </h3>
      <ul className="border-t border-border">{children}</ul>
      {more.n > 0 && (
        <Link
          to={more.to}
          className="admin-focus mt-2 inline-block rounded-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {copy.more(more.n)}
        </Link>
      )}
    </div>
  );
}

// One queue for everything waiting on you: tours to confirm and messages
// to answer, each with its action right there.
function AttentionList({
  tours,
  messages,
  homes,
  now,
  onConfirm,
  onReply,
}: {
  tours: TourRequest[]; // new requests, soonest first
  messages: Message[]; // unread, newest first
  homes: ListedProperty[];
  now: Date;
  onConfirm: (tour: TourRequest) => void;
  onReply: (message: Message) => void;
}) {
  if (tours.length === 0 && messages.length === 0) {
    return (
      <div className="border-t border-border py-8">
        <p className="font-medium">{copy.allClear}</p>
        <p className="mt-1 text-muted-foreground">{copy.allClearText}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {tours.length > 0 && (
        <Group
          title={copy.tours}
          count={tours.length}
          more={{ to: "/admin/tours?tab=new", n: tours.length - PER_GROUP }}
        >
          {tours.slice(0, PER_GROUP).map((tour) => {
            const home = homes.find((h) => h.id === tour.propertyId);
            return (
              <li
                key={tour.id}
                className="relative flex items-center gap-3 border-b border-border py-3 transition-colors hover:bg-subtle"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/admin/tours?tour=${tour.id}`}
                    className="admin-focus block truncate rounded-sm font-medium after:absolute after:inset-0"
                  >
                    {tour.name}
                  </Link>
                  <p className="truncate text-muted-foreground">
                    {home?.name ?? tour.propertySlug}
                  </p>
                  <p className="truncate text-xs text-faint tabular-nums">
                    {copy.tourWhen(
                      dayLabel(tour.date, toIsoDate(now)),
                      tour.time,
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onConfirm(tour)}
                  className={actionButton}
                >
                  {copy.confirm}
                </button>
              </li>
            );
          })}
        </Group>
      )}

      {messages.length > 0 && (
        <Group
          title={copy.messages}
          count={messages.length}
          more={{
            to: "/admin/messages?tab=unread",
            n: messages.length - PER_GROUP,
          }}
        >
          {messages.slice(0, PER_GROUP).map((m) => (
            <li
              key={m.id}
              className="relative flex items-center gap-3 border-b border-border py-3 transition-colors hover:bg-subtle"
            >
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-attention"
              />
              <div className="min-w-0 flex-1">
                <p className="flex items-baseline gap-2">
                  <Link
                    to={`/admin/messages?id=${m.id}`}
                    className="admin-focus min-w-0 flex-1 truncate rounded-sm font-medium after:absolute after:inset-0"
                  >
                    {m.name}
                  </Link>
                  <span className="shrink-0 text-xs text-faint tabular-nums">
                    {relativeTime(m.createdAt, now.getTime())}
                  </span>
                </p>
                <p className="truncate text-muted-foreground">{m.subject}</p>
              </div>
              <a
                href={`mailto:${m.email}?subject=${encodeURIComponent(
                  copy.replySubject(m.subject),
                )}`}
                onClick={() => onReply(m)}
                className={`${actionButton} inline-flex items-center`}
              >
                {copy.reply}
              </a>
            </li>
          ))}
        </Group>
      )}
    </div>
  );
}

export default AttentionList;
