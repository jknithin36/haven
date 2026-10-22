import AgentAvatar from "@/components/admin/agent-avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Agent } from "@/data/agents";

// The listing agent, shown with their photo or initials.
function AgentSelect({
  id,
  agents,
  value,
  onChange,
  placeholder,
  invalid,
}: {
  id: string;
  agents: Agent[];
  value: string;
  onChange: (agentId: string) => void;
  placeholder: string;
  invalid?: boolean;
}) {
  const selected = agents.find((a) => a.id === value);
  return (
    <Select
      value={value || null}
      onValueChange={(v) => v && onChange(v)}
      items={agents.map((a) => ({ value: a.id, label: a.name }))}
    >
      <SelectTrigger
        id={id}
        aria-invalid={invalid}
        className="h-12 w-full max-w-sm rounded-[10px]"
      >
        <SelectValue>
          {selected ? (
            <span className="flex items-center gap-2.5">
              <AgentAvatar agent={selected} size={32} />
              <span className="flex flex-col leading-tight">
                <span className="font-medium">{selected.name}</span>
                <span className="text-xs text-muted-foreground">
                  {selected.title}
                </span>
              </span>
            </span>
          ) : (
            placeholder
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          {agents.map((agent) => (
            <SelectItem key={agent.id} value={agent.id} className="py-2">
              <AgentAvatar agent={agent} size={24} />
              {agent.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default AgentSelect;
