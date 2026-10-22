import { Add01Icon } from "@hugeicons/core-free-icons";
import { useId, useMemo, useState } from "react";

import AdminPageHeader from "@/components/admin/admin-page-header";
import AgentForm, {
  AgentFormButtons,
} from "@/components/admin/agents/agent-form";
import AgentRow from "@/components/admin/agents/agent-row";
import DeleteAgentDialog from "@/components/admin/agents/delete-agent-dialog";
import EmptyState from "@/components/admin/empty-state";
import Icon from "@/components/admin/icon";
import SidePanel from "@/components/admin/side-panel";
import PageMeta from "@/components/page-meta";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { agentsAdminPage as copy } from "@/data/admin-agents";
import type { Agent } from "@/data/agents";
import { useNow } from "@/hooks/use-now";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { useUrlState } from "@/hooks/use-url-state";
import { notify } from "@/lib/notify";
import { removeAgent, restoreAgent, useAgents } from "@/store/agents";
import { reassignProperties, useAllProperties } from "@/store/properties";
import { reassignTours, useRequests } from "@/store/requests";

const DEFAULTS = { edit: "", new: "" };

function RowsSkeleton({ rows }: { rows: number }) {
  return (
    <ul aria-hidden="true" className="mt-8 border-t border-border">
      {Array.from({ length: rows }, (_, i) => (
        <li
          key={i}
          className="flex items-center gap-4 border-b border-border px-1 py-4"
        >
          <Skeleton className="size-12 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="hidden h-4 w-32 md:block" />
          <Skeleton className="hidden h-4 w-20 md:block" />
          <Skeleton className="hidden h-4 w-28 md:block" />
        </li>
      ))}
    </ul>
  );
}

function AdminAgents() {
  const loading = useSimulatedLoading();
  const formId = useId();
  const now = useNow();
  const agents = useAgents();
  const homes = useAllProperties();
  const tours = useRequests();
  const { values, set } = useUrlState(DEFAULTS);
  const [toDelete, setToDelete] = useState<Agent | null>(null);

  // Listings and this month's tours per agent.
  const counts = useMemo(() => {
    const month = now.toISOString().slice(0, 7);
    const map = new Map<
      string,
      { listings: number; tours: number; monthTours: number }
    >();
    for (const a of agents)
      map.set(a.id, { listings: 0, tours: 0, monthTours: 0 });
    for (const h of homes) {
      const c = map.get(h.agentId);
      if (c) c.listings++;
    }
    for (const t of tours) {
      const c = map.get(t.agentId);
      if (!c) continue;
      c.tours++;
      if (t.date.startsWith(month) && t.status !== "cancelled") c.monthTours++;
    }
    return map;
  }, [agents, homes, tours, now]);

  const editing = agents.find((a) => a.id === values.edit);
  const creating = values.new === "1";
  const panelOpen = creating || !!editing;

  // Keep showing the last form while the panel slides closed.
  const [shown, setShown] = useState<Agent | "new" | null>(null);
  const current = creating ? "new" : (editing ?? null);
  if (current && current !== shown) setShown(current);
  const panelAgent = shown === "new" ? undefined : (shown ?? undefined);

  function closePanel() {
    set({ edit: "", new: "" });
  }

  function onSaved(agent: Agent, created: boolean) {
    closePanel();
    notify(created ? copy.toasts.added(agent.name) : copy.toasts.saved);
  }

  function confirmDelete(agent: Agent, reassignTo?: string) {
    const movedHomes = reassignTo
      ? reassignProperties(agent.id, reassignTo)
      : [];
    const movedTours = reassignTo ? reassignTours(agent.id, reassignTo) : [];
    const removed = removeAgent(agent.id);
    if (!removed) return;
    if (values.edit === agent.id) closePanel();
    notify(copy.toasts.deleted(agent.name), {
      undoLabel: copy.toasts.undo,
      undo: () => {
        restoreAgent(removed);
        if (reassignTo) {
          reassignProperties(reassignTo, agent.id, movedHomes);
          reassignTours(reassignTo, agent.id, movedTours);
        }
      },
    });
  }

  const deleteCounts = toDelete ? counts.get(toDelete.id) : undefined;

  return (
    <>
      <PageMeta title={copy.meta.title} noindex />
      <AdminPageHeader
        title={copy.title}
        count={copy.count(agents.length)}
        actions={
          <Button
            onClick={() => set({ new: "1", edit: "" })}
            className="h-9 rounded-[10px]"
          >
            <Icon icon={Add01Icon} size={16} />
            {copy.newAgent}
          </Button>
        }
      />

      {loading ? (
        <RowsSkeleton rows={Math.max(agents.length, 3)} />
      ) : agents.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            text={copy.empty.text}
            action={
              <Button onClick={() => set({ new: "1" })}>
                {copy.empty.action}
              </Button>
            }
          />
        </div>
      ) : (
        <ul aria-label={copy.listLabel} className="mt-8 border-t border-border">
          {agents.map((agent) => {
            const c = counts.get(agent.id);
            return (
              <AgentRow
                key={agent.id}
                agent={agent}
                listings={c?.listings ?? 0}
                toursThisMonth={c?.monthTours ?? 0}
                onEdit={() => set({ edit: agent.id, new: "" })}
                onDelete={() => setToDelete(agent)}
              />
            );
          })}
        </ul>
      )}

      <SidePanel
        open={panelOpen}
        onOpenChange={(open) => !open && closePanel()}
        title={
          panelAgent ? copy.form.editTitle(panelAgent.name) : copy.form.newTitle
        }
        description={copy.form.description}
        footer={
          <AgentFormButtons
            formId={formId}
            isNew={!panelAgent}
            onCancel={closePanel}
          />
        }
      >
        {shown && (
          <AgentForm
            key={panelAgent?.id ?? "new"}
            formId={formId}
            agent={panelAgent}
            agents={agents}
            onSaved={onSaved}
          />
        )}
      </SidePanel>

      <DeleteAgentDialog
        agent={toDelete}
        others={agents.filter((a) => a.id !== toDelete?.id)}
        listings={deleteCounts?.listings ?? 0}
        tours={deleteCounts?.tours ?? 0}
        onOpenChange={(open) => !open && setToDelete(null)}
        onConfirm={(reassignTo) =>
          toDelete && confirmDelete(toDelete, reassignTo)
        }
      />
    </>
  );
}

export default AdminAgents;
