import {
  ArrowUpRight01Icon,
  Call02Icon,
  Delete02Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { useState, type ReactNode } from "react";

import CopyButton from "@/components/admin/copy-button";
import Icon from "@/components/admin/icon";
import NotesPanel from "@/components/admin/notes-panel";
import AgentSelect from "@/components/admin/property-editor/agent-select";
import SimpleSelect from "@/components/admin/property-editor/simple-select";
import SidePanel from "@/components/admin/side-panel";
import { TourStatusPill } from "@/components/admin/status-pill";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { statusLabels } from "@/data/admin";
import { toursPage } from "@/data/admin-tours";
import type { Agent } from "@/data/agents";
import { propertyDetailPage } from "@/data/pages";
import { formatDateTime, relativeTime } from "@/lib/admin-format";
import { formatChipDate, formatLongDate, upcomingTourDays } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { ListedProperty } from "@/store/properties";
import type { TourRequest } from "@/store/requests";

const copy = toursPage;
const TIMES = propertyDetailPage.tour.times;

export type TourPanelMode = "view" | "reschedule" | "cancel";

export type TourPanelActions = {
  onConfirm: (tour: TourRequest) => void;
  onComplete: (tour: TourRequest) => void;
  onCancel: (tour: TourRequest, reason: string, note: string) => void;
  onReschedule: (tour: TourRequest, date: string, time: string) => void;
  onAssign: (tour: TourRequest, agentId: string) => void;
  onNote: (tour: TourRequest, text: string) => void;
  onDelete: (tour: TourRequest) => void;
};

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-border py-5 first:pt-0">
      <h3 className="admin-meta">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ButtonAnchor({
  href,
  icon,
  children,
}: {
  href: string;
  icon: typeof Mail01Icon;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="admin-focus inline-flex h-9 items-center gap-2 rounded-[10px] border border-border px-3 transition-colors hover:bg-subtle"
    >
      <Icon icon={icon} size={16} />
      {children}
    </a>
  );
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "admin-focus h-9 rounded-[10px] border px-3 tabular-nums transition-colors",
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-border hover:bg-subtle",
      )}
    >
      {children}
    </button>
  );
}

// Requested → Confirmed → Completed, or Requested → Cancelled.
function Timeline({ tour }: { tour: TourRequest }) {
  const steps =
    tour.status === "cancelled"
      ? [
          { label: copy.panel.steps.requested, at: tour.createdAt },
          { label: copy.panel.steps.cancelled, at: tour.cancelledAt },
        ]
      : [
          { label: copy.panel.steps.requested, at: tour.createdAt },
          { label: copy.panel.steps.confirmed, at: tour.confirmedAt },
          { label: copy.panel.steps.completed, at: tour.completedAt },
        ];
  return (
    <ol className="flex flex-col">
      {steps.map((step, i) => (
        <li key={step.label} className="relative flex gap-3 pb-4 last:pb-0">
          {i < steps.length - 1 && (
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-4 left-[4px] h-[calc(100%-12px)] w-px",
                steps[i + 1].at ? "bg-foreground" : "bg-border",
              )}
            />
          )}
          <span
            aria-hidden="true"
            className={cn(
              "mt-1.5 size-[9px] shrink-0 rounded-full border",
              step.at
                ? "border-foreground bg-foreground"
                : "border-faint bg-background",
            )}
          />
          <div>
            <p className={cn(!step.at && "text-faint")}>{step.label}</p>
            <p className="text-xs text-faint tabular-nums">
              {step.at ? formatDateTime(step.at) : copy.panel.pending}
            </p>
          </div>
        </li>
      ))}
      {tour.status === "cancelled" && tour.cancelReason && (
        <li className="mt-3 text-muted-foreground">
          {copy.panel.cancelReason(tour.cancelReason)}
        </li>
      )}
    </ol>
  );
}

function ReschedulePicker({
  tour,
  now,
  onSave,
  onBack,
}: {
  tour: TourRequest;
  now: Date;
  onSave: (date: string, time: string) => void;
  onBack: () => void;
}) {
  const [days] = useState(() => upcomingTourDays(copy.reschedule.days, now));
  const [date, setDate] = useState(
    days.includes(tour.date) ? tour.date : days[0],
  );
  const [time, setTime] = useState(tour.time);
  return (
    <div>
      <p className="admin-section">{copy.reschedule.title}</p>
      <fieldset className="mt-5">
        <legend className="admin-meta">{copy.reschedule.date}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {days.map((d) => (
            <Chip key={d} selected={d === date} onClick={() => setDate(d)}>
              {formatChipDate(d)}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="admin-meta">{copy.reschedule.time}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TIMES.map((t) => (
            <Chip key={t} selected={t === time} onClick={() => setTime(t)}>
              {t}
            </Chip>
          ))}
        </div>
      </fieldset>
      <div className="mt-8 flex gap-2">
        <Button onClick={() => onSave(date, time)}>
          {copy.reschedule.save}
        </Button>
        <Button variant="ghost" onClick={onBack}>
          {copy.reschedule.back}
        </Button>
      </div>
    </div>
  );
}

function CancelForm({
  onConfirm,
  onBack,
}: {
  onConfirm: (reason: string, note: string) => void;
  onBack: () => void;
}) {
  const [reason, setReason] = useState<string>(copy.cancel.reasons[0]);
  const [note, setNote] = useState("");
  return (
    <div>
      <p className="admin-section">{copy.cancel.title}</p>
      <div className="mt-5 flex flex-col gap-2">
        <label htmlFor="tour-cancel-reason" className="font-medium">
          {copy.cancel.reason}
        </label>
        <SimpleSelect
          id="tour-cancel-reason"
          value={reason}
          options={copy.cancel.reasons.map((r) => ({ value: r, label: r }))}
          onChange={setReason}
          placeholder={copy.cancel.reason}
        />
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <label htmlFor="tour-cancel-note" className="font-medium">
          {copy.cancel.note}
        </label>
        <Textarea
          id="tour-cancel-note"
          rows={3}
          value={note}
          placeholder={copy.cancel.notePlaceholder}
          onChange={(e) => setNote(e.target.value)}
          className="rounded-[10px]"
        />
      </div>
      <div className="mt-8 flex gap-2">
        <Button onClick={() => onConfirm(reason, note.trim())}>
          {copy.cancel.confirm}
        </Button>
        <Button variant="ghost" onClick={onBack}>
          {copy.cancel.back}
        </Button>
      </div>
    </div>
  );
}

// Everything about one tour request, with the next sensible actions.
function TourPanel({
  tour,
  home,
  agents,
  now,
  open,
  mode,
  onMode,
  onOpenChange,
  actions,
}: {
  tour: TourRequest | undefined;
  home: ListedProperty | undefined;
  agents: Agent[];
  now: Date;
  open: boolean;
  mode: TourPanelMode;
  onMode: (mode: TourPanelMode) => void;
  onOpenChange: (open: boolean) => void;
  actions: TourPanelActions;
}) {
  if (!tour) {
    return (
      <SidePanel
        open={open}
        onOpenChange={onOpenChange}
        title={copy.panel.notFound}
      >
        {null}
      </SidePanel>
    );
  }

  const homeName = home?.name ?? tour.propertySlug;
  const mailto = `mailto:${tour.email}?subject=${encodeURIComponent(
    copy.actions.emailSubject(homeName),
  )}`;
  const open_ = tour.status === "new" || tour.status === "confirmed";

  const footer =
    mode !== "view" ? undefined : (
      <>
        {tour.status === "new" && (
          <Button onClick={() => actions.onConfirm(tour)}>
            {copy.actions.confirm}
          </Button>
        )}
        {tour.status === "confirmed" && (
          <Button onClick={() => actions.onComplete(tour)}>
            {copy.actions.complete}
          </Button>
        )}
        {open_ && (
          <>
            <Button variant="outline" onClick={() => onMode("reschedule")}>
              {copy.actions.reschedule}
            </Button>
            <Button variant="ghost" onClick={() => onMode("cancel")}>
              {copy.actions.cancel}
            </Button>
          </>
        )}
        <span className="ml-auto flex">
          <button
            type="button"
            onClick={() => actions.onDelete(tour)}
            aria-label={copy.actions.delete}
            title={copy.actions.delete}
            className="admin-focus flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Icon icon={Delete02Icon} />
          </button>
        </span>
      </>
    );

  return (
    <SidePanel
      open={open}
      onOpenChange={onOpenChange}
      title={tour.name}
      description={
        <span className="flex items-center gap-2">
          <TourStatusPill status={tour.status} />
          <span className="text-faint">
            {copy.panel.requested(relativeTime(tour.createdAt, now.getTime()))}
          </span>
        </span>
      }
      footer={footer}
    >
      {mode === "reschedule" ? (
        <ReschedulePicker
          tour={tour}
          now={now}
          onSave={(date, time) => actions.onReschedule(tour, date, time)}
          onBack={() => onMode("view")}
        />
      ) : mode === "cancel" ? (
        <CancelForm
          onConfirm={(reason, note) => actions.onCancel(tour, reason, note)}
          onBack={() => onMode("view")}
        />
      ) : (
        <>
          <Block title={copy.panel.client}>
            <dl className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <dt className="sr-only">{copy.panel.email}</dt>
                <dd className="min-w-0 truncate">
                  <a
                    href={mailto}
                    className="admin-focus rounded-sm underline-offset-4 hover:underline"
                  >
                    {tour.email}
                  </a>
                </dd>
                <CopyButton value={tour.email} what={copy.panel.email} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="sr-only">{copy.panel.phone}</dt>
                <dd className="tabular-nums">{tour.phone}</dd>
                <CopyButton value={tour.phone} what={copy.panel.phone} />
              </div>
            </dl>
            <div className="mt-3 flex gap-2">
              <ButtonAnchor href={mailto} icon={Mail01Icon}>
                {copy.actions.email}
              </ButtonAnchor>
              <ButtonAnchor
                href={`tel:${tour.phone.replace(/[^\d+]/g, "")}`}
                icon={Call02Icon}
              >
                {copy.actions.call}
              </ButtonAnchor>
            </div>
          </Block>

          <Block title={copy.panel.home}>
            <div className="flex items-center gap-3">
              <img
                src={home?.image || undefined}
                alt=""
                className="h-12 w-16 shrink-0 rounded-lg bg-muted object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-medium">{homeName}</p>
                {home && (
                  <p className="truncate text-muted-foreground">
                    {home.address}, {home.city}
                  </p>
                )}
              </div>
            </div>
            {home?.status === "active" && (
              <a
                href={`/properties/${home.slug}`}
                target="_blank"
                rel="noreferrer"
                className="admin-focus mt-3 inline-flex items-center gap-1 rounded-sm font-medium underline-offset-4 hover:underline"
              >
                {copy.panel.viewOnSite}
                <Icon icon={ArrowUpRight01Icon} size={16} />
              </a>
            )}
          </Block>

          <Block title={copy.panel.when}>
            <p className="tabular-nums">
              {formatLongDate(tour.date)} · {tour.time}
            </p>
            <p className="mt-1 text-muted-foreground">
              {statusLabels.tourType[tour.type]}
            </p>
          </Block>

          <Block title={copy.panel.agent}>
            <AgentSelect
              id="tour-agent"
              agents={agents}
              value={tour.agentId}
              onChange={(agentId) => actions.onAssign(tour, agentId)}
              placeholder={copy.panel.agent}
            />
          </Block>

          {tour.message && (
            <Block title={copy.panel.message}>
              <p className="max-w-[65ch] text-[15px] leading-relaxed whitespace-pre-line">
                {tour.message}
              </p>
            </Block>
          )}

          <Block title={copy.panel.timeline}>
            <Timeline tour={tour} />
          </Block>

          <div className="pt-5">
            <NotesPanel
              notes={tour.notes}
              onAdd={(text) => actions.onNote(tour, text)}
            />
          </div>
        </>
      )}
    </SidePanel>
  );
}

export default TourPanel;
