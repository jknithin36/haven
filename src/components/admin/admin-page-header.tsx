import type { ReactNode } from "react";

// Title row for a dashboard page: title, faint count, and actions on the right.
function AdminPageHeader({
  title,
  count,
  meta,
  actions,
}: {
  title: string;
  count?: string;
  meta?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {meta && <p className="admin-meta">{meta}</p>}
        <h1 className="admin-title mt-1 flex items-baseline gap-3">
          {title}
          {count && (
            <span
              aria-live="polite"
              className="text-sm font-normal tracking-normal text-faint tabular-nums"
            >
              {count}
            </span>
          )}
        </h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export default AdminPageHeader;
