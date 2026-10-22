import { Add01Icon } from "@hugeicons/core-free-icons";
import { useMemo, useState } from "react";

import AdminPageHeader from "@/components/admin/admin-page-header";
import BulkBar, { BulkButton } from "@/components/admin/bulk-bar";
import ConfirmDialog from "@/components/admin/confirm-dialog";
import EmptyState from "@/components/admin/empty-state";
import FilterMenu from "@/components/admin/filter-menu";
import Icon from "@/components/admin/icon";
import PaginationBar from "@/components/admin/pagination-bar";
import PropertiesGrid from "@/components/admin/properties/properties-grid";
import PropertiesTable from "@/components/admin/properties/properties-table";
import type { PropertyActionHandlers } from "@/components/admin/properties/property-actions";
import SearchInput from "@/components/admin/search-input";
import ButtonLink from "@/components/button-link";
import PageMeta from "@/components/page-meta";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  adminCommon,
  propertiesAdminPage as copy,
  statusLabels,
} from "@/data/admin";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { useUrlState } from "@/hooks/use-url-state";
import { notify } from "@/lib/notify";
import { useAgents } from "@/store/agents";
import {
  duplicateProperty,
  removeProperties,
  restoreProperties,
  setPropertyStatus,
  useAllProperties,
  type ListedProperty,
  type PropertyStatus,
} from "@/store/properties";

const PER_PAGE_OPTIONS = [10, 25, 50];
const ALL = "all";

const DEFAULTS = {
  q: "",
  city: ALL,
  type: ALL,
  status: ALL,
  deal: ALL,
  sort: "updated",
  view: "table",
  page: "1",
  per: "10",
};

type SortKey = keyof typeof copy.sort.options;

function sortRows(rows: ListedProperty[], sort: string) {
  const sorted = [...rows];
  switch (sort as SortKey) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    default:
      return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}

function TableSkeleton() {
  return (
    <div aria-hidden="true" className="mt-6">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className="flex h-13 items-center gap-3 border-b border-border px-1"
        >
          <Skeleton className="size-4" />
          <Skeleton className="h-10 w-14" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="ml-auto h-4 w-24" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function AdminProperties() {
  const loading = useSimulatedLoading();
  const homes = useAllProperties();
  const agents = useAgents();
  const { values, set } = useUrlState(DEFAULTS);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toDelete, setToDelete] = useState<string[] | null>(null);

  const page = Math.max(1, Number(values.page) || 1);
  const perPage = PER_PAGE_OPTIONS.includes(Number(values.per))
    ? Number(values.per)
    : 10;

  const filtered = useMemo(() => {
    const q = values.q.trim().toLowerCase();
    return sortRows(
      homes.filter(
        (h) =>
          (!q ||
            `${h.name} ${h.address} ${h.city}`.toLowerCase().includes(q)) &&
          (values.city === ALL || h.city === values.city) &&
          (values.type === ALL || h.type === values.type) &&
          (values.status === ALL || h.status === values.status) &&
          (values.deal === ALL || h.priceType === values.deal),
      ),
      values.sort,
    );
  }, [
    homes,
    values.q,
    values.city,
    values.type,
    values.status,
    values.deal,
    values.sort,
  ]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * perPage, current * perPage);
  const filtersActive =
    !!values.q ||
    [values.city, values.type, values.status, values.deal].some(
      (v) => v !== ALL,
    );

  const cities = [...new Set(homes.map((h) => h.city))].sort();
  const types = [...new Set(homes.map((h) => h.type))].sort();
  const option = (v: string) => ({ value: v, label: v });
  const any = { value: ALL, label: copy.filters.any };

  function clearFilters() {
    set({ q: "", city: ALL, type: ALL, status: ALL, deal: ALL });
  }

  function changeStatus(ids: string[], status: PropertyStatus) {
    const before = homes
      .filter((h) => ids.includes(h.id))
      .map((h) => [h.id, h.status] as const);
    setPropertyStatus(ids, status);
    setSelected(new Set());
    const label = statusLabels.property[status];
    const title =
      status === "draft"
        ? copy.toasts.drafted(ids.length)
        : status === "active"
          ? copy.toasts.published
          : copy.toasts.status(ids.length, label);
    notify(title, {
      undoLabel: copy.toasts.undo,
      undo: () => before.forEach(([id, s]) => setPropertyStatus([id], s)),
    });
  }

  function confirmDelete(ids: string[]) {
    const removed = removeProperties(ids);
    setSelected(new Set());
    notify(copy.toasts.deleted(ids.length), {
      undoLabel: copy.toasts.undo,
      undo: () => restoreProperties(removed),
    });
  }

  const handlers: PropertyActionHandlers = {
    onDuplicate: (p) => {
      duplicateProperty(p.id);
      notify(copy.toasts.duplicated(p.name));
    },
    onStatus: changeStatus,
    onDelete: (ids) => setToDelete(ids),
  };

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll(checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      rows.forEach((r) => (checked ? next.add(r.id) : next.delete(r.id)));
      return next;
    });
  }

  const selectedIds = [...selected];

  return (
    <>
      <PageMeta title={copy.meta.title} noindex />
      <AdminPageHeader
        title={copy.title}
        count={copy.count(filtered.length)}
        actions={
          <>
            <ToggleGroup
              variant="outline"
              aria-label={copy.views.label}
              value={[values.view]}
              onValueChange={(v) => {
                if (v[0]) set({ view: v[0], page: values.page });
              }}
            >
              {(["table", "grid"] as const).map((v) => (
                <ToggleGroupItem
                  key={v}
                  value={v}
                  className="h-9 px-3 text-muted-foreground aria-pressed:bg-muted aria-pressed:text-foreground"
                >
                  {copy.views[v]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <ButtonLink
              to="/admin/properties/new"
              size="default"
              className="h-9 rounded-[10px]"
            >
              <Icon icon={Add01Icon} size={16} />
              {copy.empty.action}
            </ButtonLink>
          </>
        }
      />

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <SearchInput
          label={copy.search}
          value={values.q}
          onChange={(q) => set({ q })}
          className="w-full sm:w-64"
        />
        <FilterMenu
          label={copy.filters.city}
          value={values.city}
          options={[any, ...cities.map(option)]}
          onChange={(city) => set({ city })}
        />
        <FilterMenu
          label={copy.filters.type}
          value={values.type}
          options={[any, ...types.map(option)]}
          onChange={(type) => set({ type })}
        />
        <FilterMenu
          label={copy.filters.status}
          value={values.status}
          options={[
            any,
            ...(["active", "draft", "sold", "rented"] as const).map((s) => ({
              value: s,
              label: statusLabels.property[s],
            })),
          ]}
          onChange={(status) => set({ status })}
        />
        <FilterMenu
          label={copy.filters.deal}
          value={values.deal}
          options={[
            any,
            { value: "sale", label: copy.filters.sale },
            { value: "rent", label: copy.filters.rent },
          ]}
          onChange={(deal) => set({ deal })}
        />
        <FilterMenu
          label={copy.sort.label}
          value={values.sort}
          defaultValue="updated"
          options={Object.entries(copy.sort.options).map(([value, label]) => ({
            value,
            label,
          }))}
          onChange={(sort) => set({ sort })}
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

      {loading ? (
        <TableSkeleton />
      ) : homes.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            text={copy.empty.text}
            action={
              <ButtonLink to="/admin/properties/new" size="default">
                {copy.empty.action}
              </ButtonLink>
            }
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            text={copy.noResults.text}
            action={
              <Button variant="outline" onClick={clearFilters}>
                {copy.noResults.action}
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-6">
          {values.view === "grid" ? (
            <PropertiesGrid rows={rows} handlers={handlers} />
          ) : (
            <PropertiesTable
              rows={rows}
              agents={agents}
              selected={selected}
              onToggle={toggle}
              onToggleAll={toggleAll}
              handlers={handlers}
            />
          )}
          <PaginationBar
            page={current}
            perPage={perPage}
            total={filtered.length}
            onPage={(n) => set({ page: String(n) })}
            onPerPage={(n) => set({ per: String(n) })}
            perPageOptions={PER_PAGE_OPTIONS}
            copy={copy.pagination}
          />
        </div>
      )}

      <BulkBar open={selected.size > 0}>
        <span className="pr-2 tabular-nums">
          {copy.bulk.selected(selected.size)}
        </span>
        <BulkButton onClick={() => changeStatus(selectedIds, "sold")}>
          {copy.bulk.markSold}
        </BulkButton>
        <BulkButton onClick={() => changeStatus(selectedIds, "draft")}>
          {copy.bulk.moveToDraft}
        </BulkButton>
        <BulkButton onClick={() => setToDelete(selectedIds)}>
          {copy.bulk.delete}
        </BulkButton>
        <BulkButton onClick={() => setSelected(new Set())}>
          {copy.bulk.clear}
        </BulkButton>
      </BulkBar>

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={copy.deleteDialog.title(toDelete?.length ?? 1)}
        text={copy.deleteDialog.text}
        confirm={copy.deleteDialog.confirm}
        cancel={adminCommon.cancel}
        onConfirm={() => toDelete && confirmDelete(toDelete)}
      />
    </>
  );
}

export default AdminProperties;
