import { Call02Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router";

import AgentPhoto from "@/components/agent-photo";
import { buttonVariants } from "@/components/ui/button";
import { agentStat, type Agent } from "@/data/agents";
import { agentsPage as copy } from "@/data/pages";
import { cn } from "@/lib/utils";

// The name is the card's main link and stretches over the whole card, so the
// Call link can sit inside without nesting one link in another.
function AgentListCard({ agent }: { agent: Agent }) {
  const profile = `/agents/${agent.slug}`;

  return (
    <article className="group relative flex h-full flex-col gap-6 rounded-2xl border border-border p-4 transition-colors focus-within:border-foreground hover:border-foreground/30 sm:flex-row sm:p-5">
      <AgentPhoto
        agent={agent}
        hoverZoom
        className="aspect-4/5 w-full shrink-0 rounded-xl sm:w-[40%]"
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className="type-subheading">
          <Link
            to={profile}
            aria-label={copy.cardLabel(agent.name, agent.title, agent.areas)}
            className="rounded-sm outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-offset-2"
          >
            {agent.name}
          </Link>
        </h2>
        <p className="text-muted-foreground">{agent.title}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <HugeiconsIcon
            icon={Location01Icon}
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
            className="shrink-0"
          />
          {agent.areas.join(", ")}
        </p>
        <p className="mt-3 text-sm tabular-nums">
          {copy.stats(agent.years, agentStat(agent), agent.rating)}
        </p>

        <p className="mt-4 text-muted-foreground">{agent.shortBio}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {agent.specialties.map((specialty) => (
            <li
              key={specialty}
              className="rounded-full border border-border px-3 py-1 text-sm"
            >
              {specialty}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          {copy.languages(agent.languages)}
        </p>

        {/* Sits above the stretched link so it stays clickable. */}
        <div className="relative z-10 mt-auto flex gap-2 pt-6">
          <Link
            to={profile}
            tabIndex={-1}
            aria-hidden="true"
            className={cn(buttonVariants({ size: "lg" }), "flex-1")}
          >
            {copy.viewProfile}
          </Link>
          <a
            href={`tel:${agent.phone.replace(/[^\d+]/g, "")}`}
            aria-label={copy.callLabel(agent.name)}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "flex-1",
            )}
          >
            <HugeiconsIcon
              icon={Call02Icon}
              strokeWidth={1.5}
              aria-hidden="true"
              data-icon="inline-start"
            />
            {copy.call}
          </a>
        </div>
      </div>
    </article>
  );
}

export default AgentListCard;
