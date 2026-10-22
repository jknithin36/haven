import { agents as agentSeed, type Agent } from "@/data/agents";
import { createSeededStore } from "@/lib/local-store";
import { logActivity } from "@/store/activity";

const store = createSeededStore<Agent[]>("haven-agents", 1, () => agentSeed);

export function getAgentFromStore(id: string) {
  return store.read().find((a) => a.id === id);
}

export function addAgent(agent: Agent) {
  store.write([...store.read(), agent]);
  logActivity(`${agent.name} added to the team`, "agent", agent.id);
}

export function updateAgent(id: string, patch: Partial<Agent>) {
  const current = getAgentFromStore(id);
  store.write(store.read().map((a) => (a.id === id ? { ...a, ...patch } : a)));
  if (current) logActivity(`${current.name}'s profile updated`, "agent", id);
}

export function isAgentSlugTaken(slug: string, exceptId?: string) {
  return store.read().some((a) => a.slug === slug && a.id !== exceptId);
}

// Returns the removed agent and its position so the caller can undo.
export function removeAgent(id: string) {
  const all = store.read();
  const index = all.findIndex((a) => a.id === id);
  if (index === -1) return undefined;
  const agent = all[index];
  store.write(all.filter((a) => a.id !== id));
  logActivity(`${agent.name} removed from the team`, "agent", id);
  return { agent, index };
}

export function restoreAgent(removed: { agent: Agent; index: number }) {
  const next = [...store.read()];
  next.splice(removed.index, 0, removed.agent);
  store.write(next);
  logActivity(
    `${removed.agent.name} restored to the team`,
    "agent",
    removed.agent.id,
  );
}

export function useAgents() {
  return store.useValue();
}

export function useAgent(id: string | undefined) {
  return store.useValue().find((a) => a.id === id);
}

export function useAgentBySlug(slug: string | undefined) {
  return store.useValue().find((a) => a.slug === slug);
}

export const resetAgents = store.reset;
