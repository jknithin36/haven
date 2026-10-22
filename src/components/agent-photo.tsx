import { agentInitials, type Agent } from "@/data/agents";
import { cn } from "@/lib/utils";

// The agent's photo, or their initials on a soft gray tile until a photo
// exists. Size and shape come from `className` (e.g. "aspect-4/5 rounded-xl").
function AgentPhoto({
  agent,
  className,
  hoverZoom = false,
  eager = false,
}: {
  agent: Agent;
  className?: string;
  hoverZoom?: boolean;
  eager?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden bg-muted",
        className,
      )}
    >
      {agent.photo ? (
        <img
          src={agent.photo}
          alt={agent.photoAlt}
          loading={eager ? "eager" : "lazy"}
          className={cn(
            "h-full w-full object-cover",
            hoverZoom &&
              "transition-transform duration-500 group-hover:scale-[1.03]",
          )}
        />
      ) : (
        <span
          aria-hidden="true"
          className="type-display text-muted-foreground/60"
        >
          {agentInitials(agent)}
        </span>
      )}
    </div>
  );
}

export default AgentPhoto;
