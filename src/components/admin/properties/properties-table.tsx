import { Link } from "react-router";

import AgentAvatar from "@/components/admin/agent-avatar";
import PropertyActions, {
  type PropertyActionHandlers,
} from "@/components/admin/properties/property-actions";
import { PropertyStatusPill } from "@/components/admin/status-pill";
import { Checkbox } from "@/components/ui/checkbox";
import { propertiesAdminPage } from "@/data/admin";
import { firstName, type Agent } from "@/data/agents";
import { relativeTime } from "@/lib/admin-format";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ListedProperty } from "@/store/properties";

const copy = propertiesAdminPage.columns;

const th =
  "sticky top-14 z-10 h-10 border-b border-border bg-background px-3 text-left text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase whitespace-nowrap";
const td = "h-13 border-b border-border px-3 whitespace-nowrap";

function PropertiesTable({
  rows,
  agents,
  selected,
  onToggle,
  onToggleAll,
  handlers,
}: {
  rows: ListedProperty[];
  agents: Agent[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  handlers: PropertyActionHandlers;
}) {
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const someChecked = rows.some((r) => selected.has(r.id)) && !allChecked;

  return (
    // Scrolls sideways on narrow screens; the Home column stays put.
    <div className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th className={cn(th, "w-10 pl-1")}>
              <Checkbox
                aria-label={copy.selectAll}
                checked={allChecked}
                indeterminate={someChecked}
                onCheckedChange={(checked) => onToggleAll(checked)}
              />
            </th>
            <th className={cn(th, "left-0 lg:static")}>{copy.home}</th>
            <th className={th}>{copy.city}</th>
            <th className={th}>{copy.type}</th>
            <th className={cn(th, "text-right")}>{copy.price}</th>
            <th className={th}>{copy.bedsBaths}</th>
            <th className={th}>{copy.status}</th>
            <th className={th}>{copy.agent}</th>
            <th className={th}>{copy.updated}</th>
            <th className={th}>
              <span className="sr-only">{copy.actions}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const agent = agents.find((a) => a.id === p.agentId);
            const isSelected = selected.has(p.id);
            return (
              <tr
                key={p.id}
                aria-selected={isSelected}
                className={cn(
                  "group transition-colors hover:bg-subtle",
                  isSelected && "bg-subtle",
                )}
              >
                <td className={cn(td, "pl-1")}>
                  <Checkbox
                    aria-label={copy.selectRow(p.name)}
                    checked={isSelected}
                    onCheckedChange={() => onToggle(p.id)}
                  />
                </td>
                <td
                  className={cn(
                    td,
                    "sticky left-0 z-[1] bg-background group-hover:bg-subtle lg:static lg:bg-transparent",
                    isSelected && "bg-subtle",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image || undefined}
                      alt=""
                      className="h-10 w-14 shrink-0 rounded-md bg-muted object-cover"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/admin/properties/${p.id}/edit`}
                        className="admin-focus block max-w-56 truncate rounded-sm font-medium"
                      >
                        {p.name}
                      </Link>
                      <span className="block max-w-56 truncate text-muted-foreground">
                        {p.address}
                      </span>
                    </div>
                  </div>
                </td>
                <td className={td}>{p.city}</td>
                <td className={cn(td, "text-muted-foreground")}>{p.type}</td>
                <td className={cn(td, "text-right tabular-nums")}>
                  {formatPrice(p.price, p.priceType)}
                </td>
                <td className={cn(td, "text-muted-foreground tabular-nums")}>
                  {propertiesAdminPage.bedsBaths(p.beds, p.baths)}
                </td>
                <td className={td}>
                  <PropertyStatusPill status={p.status} />
                </td>
                <td className={td}>
                  {agent && (
                    <span className="flex items-center gap-2">
                      <AgentAvatar agent={agent} />
                      {firstName(agent)}
                    </span>
                  )}
                </td>
                <td className={cn(td, "text-faint")}>
                  {relativeTime(p.updatedAt)}
                </td>
                <td className={cn(td, "w-28 pr-1")}>
                  <div className="opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 max-lg:opacity-100">
                    <PropertyActions property={p} handlers={handlers} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PropertiesTable;
