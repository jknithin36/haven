import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

import FilterMenu from "@/components/admin/filter-menu";
import Icon from "@/components/admin/icon";
import { cn } from "@/lib/utils";

type Copy = {
  label: string;
  range: (from: number, to: number, total: number) => string;
  previous: string;
  next: string;
  page: (n: number) => string;
  perPage: string;
};

// "1–10 of 12", page numbers, prev/next, and an optional rows-per-page menu.
function PaginationBar({
  page,
  perPage,
  total,
  onPage,
  onPerPage,
  perPageOptions,
  copy,
}: {
  page: number;
  perPage: number;
  total: number;
  onPage: (page: number) => void;
  onPerPage?: (perPage: number) => void;
  perPageOptions?: number[];
  copy: Copy;
}) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const button =
    "admin-focus flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm tabular-nums transition-colors disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav
      aria-label={copy.label}
      className="flex flex-wrap items-center justify-between gap-4 pt-4"
    >
      <p className="text-muted-foreground tabular-nums" aria-live="polite">
        {copy.range(from, to, total)}
      </p>
      <div className="flex items-center gap-4">
        {onPerPage && perPageOptions && (
          <FilterMenu
            label={copy.perPage}
            value={String(perPage)}
            defaultValue={String(perPageOptions[0])}
            options={perPageOptions.map((n) => ({
              value: String(n),
              label: String(n),
            }))}
            onChange={(v) => onPerPage(Number(v))}
          />
        )}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPage(page - 1)}
            disabled={page <= 1}
            aria-label={copy.previous}
            className={cn(button, "hover:bg-muted")}
          >
            <Icon icon={ArrowLeft01Icon} size={16} />
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onPage(n)}
              aria-label={copy.page(n)}
              aria-current={n === page ? "page" : undefined}
              className={cn(
                button,
                n === page ? "bg-foreground text-background" : "hover:bg-muted",
              )}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPage(page + 1)}
            disabled={page >= pages}
            aria-label={copy.next}
            className={cn(button, "hover:bg-muted")}
          >
            <Icon icon={ArrowRight01Icon} size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default PaginationBar;
