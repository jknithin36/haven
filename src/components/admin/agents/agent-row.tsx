import {
  ArrowUpRight01Icon,
  Delete02Icon,
  Edit02Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";

import AgentAvatar from "@/components/admin/agent-avatar";
import Icon from "@/components/admin/icon";
import { agentsAdminPage } from "@/data/admin-agents";
import type { Agent } from "@/data/agents";

const copy = agentsAdminPage;

const iconButton =
  "admin-focus flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

// One agent: portrait, name and title, areas, numbers, and hover actions.
function AgentRow({
  agent,
  listings,
  toursThisMonth,
  onEdit,
  onDelete,
}: {
  agent: Agent;
  listings: number;
  toursThisMonth: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const label = (action: string) => copy.actions.label(action, agent.name);
  return (
    <li className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 border-b border-border px-1 py-4 transition-colors hover:bg-subtle md:grid-cols-[auto_minmax(0,2fr)_minmax(0,1.5fr)_8rem_10rem_8rem_auto]">
      <AgentAvatar
        agent={agent}
        size={48}
        className="row-span-2 md:row-span-1"
      />
      <div className="min-w-0">
        <button
          type="button"
          onClick={onEdit}
          className="admin-focus block max-w-full truncate rounded-sm text-left font-medium"
        >
          {agent.name}
        </button>
        <p className="truncate text-muted-foreground">
          {agent.title}
          <span className="hidden md:inline">
            {" "}
            · {copy.stats.years(agent.years)}
          </span>
        </p>
      </div>
      <p className="col-start-2 truncate text-muted-foreground md:col-start-auto md:text-foreground">
        {agent.areas.join(", ")}
      </p>
      <p className="hidden tabular-nums md:block">
        {copy.stats.listings(listings)}
      </p>
      <p className="hidden text-muted-foreground tabular-nums md:block">
        {copy.stats.tours(toursThisMonth)}
      </p>
      <p className="hidden items-center gap-1.5 tabular-nums md:flex">
        <Icon icon={StarIcon} size={16} className="text-muted-foreground" />
        {agent.rating.toFixed(1)}
        <span className="text-faint">({agent.reviewCount})</span>
      </p>
      <div className="col-start-3 row-span-2 row-start-1 flex items-center justify-end gap-0.5 transition-opacity md:col-start-auto md:row-span-1 md:row-start-auto lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
        <button
          type="button"
          onClick={onEdit}
          aria-label={label(copy.actions.edit)}
          title={copy.actions.edit}
          className={iconButton}
        >
          <Icon icon={Edit02Icon} size={16} />
        </button>
        <a
          href={`/agents/${agent.slug}`}
          target="_blank"
          rel="noreferrer"
          aria-label={label(copy.actions.viewProfile)}
          title={copy.actions.viewProfile}
          className={iconButton}
        >
          <Icon icon={ArrowUpRight01Icon} size={16} />
        </a>
        <button
          type="button"
          onClick={onDelete}
          aria-label={label(copy.actions.delete)}
          title={copy.actions.delete}
          className={iconButton}
        >
          <Icon icon={Delete02Icon} size={16} />
        </button>
      </div>
    </li>
  );
}

export default AgentRow;
