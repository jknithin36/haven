import { agentInitials, type Agent } from "@/data/agents";
import { cn } from "@/lib/utils";

// Round agent photo, or initials on a light circle.
function AgentAvatar({
  agent,
  size = 24,
  className,
}: {
  agent: Agent;
  size?: 24 | 32 | 48;
  className?: string;
}) {
  const dimension = {
    24: "size-6 text-[10px]",
    32: "size-8 text-xs",
    48: "size-12 text-sm",
  }[size];
  return agent.photo ? (
    <img
      src={agent.photo}
      alt=""
      className={cn(
        "shrink-0 rounded-full bg-muted object-cover",
        dimension,
        className,
      )}
    />
  ) : (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
        dimension,
        className,
      )}
    >
      {agentInitials(agent)}
    </span>
  );
}

export default AgentAvatar;
