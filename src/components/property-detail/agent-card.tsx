import { Call02Icon, Mail01Icon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { agentInitials, agentStat, type Agent } from "@/data/agents";
import { propertyDetailPage } from "@/data/pages";
import { cn } from "@/lib/utils";

const copy = propertyDetailPage.agent;

// `areas` shows the cities the agent covers; `children` renders extra
// actions under the call and email buttons.
function AgentCard({
  agent,
  label = copy.label,
  areas,
  children,
}: {
  agent: Agent;
  label?: string;
  areas?: string;
  children?: ReactNode;
}) {
  return (
    <section aria-label={label} className="rounded-xl border border-border p-5">
      <div className="flex items-center gap-4">
        <Avatar className="size-14">
          {agent.photo && <AvatarImage src={agent.photo} alt="" />}
          <AvatarFallback>{agentInitials(agent)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="type-title">{agent.name}</p>
          <p className="text-sm text-muted-foreground">{agent.title}</p>
          {areas && <p className="text-sm text-muted-foreground">{areas}</p>}
          <p className="mt-1 flex items-center gap-1 text-sm tabular-nums">
            <HugeiconsIcon
              icon={StarIcon}
              size={14}
              strokeWidth={1.5}
              aria-hidden="true"
              className="fill-current"
            />
            <span className="sr-only">{copy.rating(agent.rating)}</span>
            <span aria-hidden="true">{agent.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">· {agentStat(agent)}</span>
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <a
          href={`tel:${agent.phone.replace(/[^\d+]/g, "")}`}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          <HugeiconsIcon
            icon={Call02Icon}
            strokeWidth={1.5}
            aria-hidden="true"
            data-icon="inline-start"
          />
          {copy.call}
        </a>
        <a
          href={`mailto:${agent.email}`}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          <HugeiconsIcon
            icon={Mail01Icon}
            strokeWidth={1.5}
            aria-hidden="true"
            data-icon="inline-start"
          />
          {copy.email}
        </a>
      </div>
      {children && <div className="mt-2">{children}</div>}
    </section>
  );
}

export default AgentCard;
