import { useMemo, useState } from "react";

import AdminPageHeader from "@/components/admin/admin-page-header";
import ConfirmDialog from "@/components/admin/confirm-dialog";
import EmptyState from "@/components/admin/empty-state";
import FilterMenu from "@/components/admin/filter-menu";
import PaginationBar from "@/components/admin/pagination-bar";
import SearchInput from "@/components/admin/search-input";
import TourPanel, {
  type TourPanelActions,
  type TourPanelMode,
} from "@/components/admin/tours/tour-panel";
import ToursList from "@/components/admin/tours/tours-list";
import ToursWeek from "@/components/admin/tours/tours-week";
import ButtonLink from "@/components/button-link";
import PageMeta from "@/components/page-meta";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { adminCommon, statusLabels } from "@/data/admin";
import { toursPage as copy } from "@/data/admin-tours";
import { useNow } from "@/hooks/use-now";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { useUrlState } from "@/hooks/use-url-state";
import { formatShortDate } from "@/lib/admin-format";
import { toIsoDate } from "@/lib/dates";
import { notify } from "@/lib/notify";
import {
  DATE_FILTERS,
  TOUR_TABS,
  countByStatus,
  filterTours,
  inTab,
  sortTours,
  weekDates,
  type TourTab,
} from "@/lib/tours";
import { cn } from "@/lib/utils";
import { useAgents } from "@/store/agents";
import { useAllProperties } from "@/store/properties";
import {
  addTourNote,
  assignTourAgent,
  cancelTour,
  completeTour,
  confirmTour,
  removeTour,
  rescheduleTour,
  restoreTour,
  useRequests,
  type TourRequest,
} from "@/store/requests";

const PER_PAGE = 10;
const ALL = "all";

const DEFAULTS = {
  tab: ALL,
  view: "list",
  q: "",
  agent: ALL,
  type: ALL,
  date: ALL,
  page: "1",
  week: "0",
  day: "",
  tour: "",
  reschedule: "",
};

function ListSkeleton() {
  return (
    <div aria-hidden="true" className="mt-6">
      {[4, 3, 3].map((rows, g) => (
        <div key={g}>
          <div className="flex h-10 items-end border-b border-border px-3 pb-2">
            <Skeleton className="h-4 w-24" />
          </div>
          {Array.from({ length: rows }, (_, i) => (
            <div
              key={i}
              className="flex h-14 items-center gap-4 border-b border-border px-3"
            >
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="size-10 max-lg:hidden" />
              <Skeleton className="h-4 w-36 max-lg:hidden" />
              <Skeleton className="ml-auto h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Tours() {
  const loading = useSimulatedLoading();
  const now = useNow();
  const tours = useRequests();
  const homes = useAllProperties();
  const agents = useAgents();
  const { values, set } = useUrlState(DEFAULTS);
  const [cancelMode, setCancelMode] = useState(false);
  const [toDelete, setToDelete] = useState<TourRequest | null>(null);
  // Keep showing the last tour while the panel slides closed.
  const [lastTourId, setLastTourId] = useState(values.tour);

  const tab: TourTab = (TOUR_TABS as readonly string[]).includes(values.tab)
    ? (values.tab as TourTab)
    : "all";
  const page = Math.max(1, Number(values.page) || 1);
  const weekOffset = Number(values.week) || 0;

  const filtered = useMemo(
    () =>
      filterTours(
        tours,
        {
          q: values.q,
          agent: values.agent,
          type: values.type,
          date: values.date,
        },
        homes,
        now,
      ),
    [tours, values.q, values.agent, values.type, values.date, homes, now],
  );
  const counts = countByStatus(filtered);
  const visible = sortTours(
    filtered.filter((t) => inTab(t, tab)),
    tab,
    now,
  );
  const pages = Math.max(1, Math.ceil(visible.length / PER_PAGE));
  const current = Math.min(page, pages);
  const rows = visible.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const dates = weekDates(now, weekOffset);
  const today = toIsoDate(now);
  const day = dates.includes(values.day)
    ? values.day
    : dates.includes(today)
      ? today
      : dates[0];
  const weekTours = visible.filter(
    (t) => t.status !== "cancelled" && dates.includes(t.date),
  );

  const filtersActive =
    !!values.q ||
    [values.agent, values.type, values.date].some((v) => v !== ALL);

  const panelId = values.tour || lastTourId;
  const panelTour = tours.find((t) => t.id === panelId);
  const panelHome = homes.find((h) => h.id === panelTour?.propertyId);
  const mode: TourPanelMode = cancelMode
    ? "cancel"
    : values.reschedule
      ? "reschedule"
      : "view";

  function openTour(id: string) {
    setLastTourId(id);
    setCancelMode(false);
    set({ tour: id, reschedule: "", page: values.page });
  }

  function closePanel() {
    setCancelMode(false);
    set({ tour: "", reschedule: "", page: values.page });
  }

  function setMode(next: TourPanelMode) {
    setCancelMode(next === "cancel");
    set({ reschedule: next === "reschedule" ? "1" : "", page: values.page });
  }

  function clearFilters() {
    set({ q: "", agent: ALL, type: ALL, date: ALL });
  }

  // Each change keeps a snapshot so the toast can undo it.
  function withUndo(tour: TourRequest, title: string, change: () => void) {
    change();
    notify(title, {
      undoLabel: copy.toasts.undo,
      undo: () => restoreTour(tour),
    });
  }

  const actions: TourPanelActions = {
    onConfirm: (t) =>
      withUndo(t, copy.toasts.confirmed(t.name), () => confirmTour(t.id)),
    onComplete: (t) =>
      withUndo(t, copy.toasts.completed, () => completeTour(t.id)),
    onCancel: (t, reason, note) =>
      withUndo(t, copy.toasts.cancelled, () => {
        cancelTour(t.id, reason);
        if (note) addTourNote(t.id, note);
        setCancelMode(false);
      }),
    onReschedule: (t, date, time) =>
      withUndo(
        t,
        copy.toasts.rescheduled(`${formatShortDate(date)}, ${time}`),
        () => {
          rescheduleTour(t.id, date, time);
          setMode("view");
        },
      ),
    onAssign: (t, agentId) => {
      const agent = agents.find((a) => a.id === agentId);
      if (agentId === t.agentId || !agent) return;
      withUndo(t, copy.toasts.reassigned(agent.name), () =>
        assignTourAgent(t.id, agentId),
      );
    },
    onNote: (t, text) => {
      addTourNote(t.id, text);
      notify(copy.toasts.noteAdded);
    },
    onDelete: (t) => setToDelete(t),
  };

  function confirmDelete(t: TourRequest) {
    closePanel();
    removeTour(t.id);
    notify(copy.toasts.deleted, {
      undoLabel: copy.toasts.undo,
      undo: () => restoreTour(t),
    });
  }

  const option = (value: string, label: string) => ({ value, label });
  const any = option(ALL, copy.filters.any);

  return (
    <>
      <PageMeta title={copy.meta.title} noindex />
      <AdminPageHeader
        title={copy.title}
        count={copy.count(visible.length)}
        actions={
          <ToggleGroup
            variant="outline"
            aria-label={copy.views.label}
            value={[values.view]}
            onValueChange={(v) => {
              if (v[0]) set({ view: v[0], page: values.page });
            }}
          >
            {(["list", "week"] as const).map((v) => (
              <ToggleGroupItem
                key={v}
                value={v}
                className="h-9 px-3 text-muted-foreground aria-pressed:bg-muted aria-pressed:text-foreground"
              >
                {copy.views[v]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        }
      />

      {/* Status tabs */}
      <div
        role="tablist"
        aria-label={copy.tabsLabel}
        className="mt-6 flex gap-6 overflow-x-auto border-b border-border"
      >
        {TOUR_TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => set({ tab: t })}
            className={cn(
              "admin-focus -mb-px flex h-10 shrink-0 items-center gap-2 border-b-2 transition-colors",
              tab === t
                ? "border-foreground font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {copy.tabs[t]}
            <span className="text-faint tabular-nums">{counts[t]}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <SearchInput
          label={copy.search}
          value={values.q}
          onChange={(q) => set({ q })}
          className="w-full sm:w-64"
        />
        <FilterMenu
          label={copy.filters.agent}
          value={values.agent}
          options={[any, ...agents.map((a) => option(a.id, a.name))]}
          onChange={(agent) => set({ agent })}
        />
        <FilterMenu
          label={copy.filters.type}
          value={values.type}
          options={[
            any,
            ...(["in-person", "video"] as const).map((t) =>
              option(t, statusLabels.tourType[t]),
            ),
          ]}
          onChange={(type) => set({ type })}
        />
        <FilterMenu
          label={copy.filters.date}
          value={values.date}
          options={DATE_FILTERS.map((d) => option(d, copy.filters.dates[d]))}
          onChange={(date) => set({ date })}
        />
        {filtersActive && (
          <button
            type="button"
            onClick={clearFilters}
            className="admin-focus h-9 rounded-lg px-2 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {copy.filters.clear}
          </button>
        )}
      </div>

      <div className="mt-6">
        {loading ? (
          <ListSkeleton />
        ) : values.view === "week" ? (
          <ToursWeek
            dates={dates}
            tours={weekTours}
            homes={homes}
            now={now}
            day={day}
            onDay={(d) => set({ day: d, page: values.page })}
            onWeek={(step) =>
              set({
                week: step === 0 ? "0" : String(weekOffset + step),
                day: "",
                page: values.page,
              })
            }
            onOpen={openTour}
          />
        ) : tours.length === 0 ? (
          <EmptyState
            text={copy.empty.text}
            action={
              <ButtonLink to="/properties" variant="outline" size="default">
                {copy.empty.action}
              </ButtonLink>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState
            text={copy.noResults.text}
            action={
              filtersActive ? (
                <Button variant="outline" onClick={clearFilters}>
                  {copy.noResults.action}
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <ToursList
              tours={rows}
              homes={homes}
              agents={agents}
              now={now}
              onOpen={openTour}
              onConfirm={actions.onConfirm}
            />
            <PaginationBar
              page={current}
              perPage={PER_PAGE}
              total={visible.length}
              onPage={(n) => set({ page: String(n) })}
              copy={copy.pagination}
            />
          </>
        )}
      </div>

      <TourPanel
        tour={panelTour}
        home={panelHome}
        agents={agents}
        now={now}
        open={!!values.tour && !loading}
        mode={mode}
        onMode={setMode}
        onOpenChange={(open) => !open && closePanel()}
        actions={actions}
      />

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={copy.deleteDialog.title}
        text={copy.deleteDialog.text}
        confirm={copy.deleteDialog.confirm}
        cancel={adminCommon.cancel}
        onConfirm={() => toDelete && confirmDelete(toDelete)}
      />
    </>
  );
}

export default Tours;
