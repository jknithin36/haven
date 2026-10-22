import { activitySeed } from "@/data/admin-seed";
import { createSeededStore } from "@/lib/local-store";

export type EntityType = "property" | "tour" | "message" | "agent";

export type ActivityEvent = {
  id: string;
  text: string;
  entityType: EntityType;
  entityId: string;
  createdAt: string; // ISO timestamp
};

const MAX_EVENTS = 100;

const store = createSeededStore<ActivityEvent[]>(
  "haven-activity",
  1,
  activitySeed,
);

// Newest first; keeps the latest 100.
export function logActivity(
  text: string,
  entityType: EntityType,
  entityId: string,
) {
  const event: ActivityEvent = {
    id: crypto.randomUUID(),
    text,
    entityType,
    entityId,
    createdAt: new Date().toISOString(),
  };
  store.write([event, ...store.read()].slice(0, MAX_EVENTS));
}

export function useActivity() {
  return store.useValue();
}

export const resetActivity = store.reset;
