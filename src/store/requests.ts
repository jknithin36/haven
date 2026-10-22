import { requestsSeed } from "@/data/admin-seed";
import { createSeededStore } from "@/lib/local-store";
import { logActivity } from "@/store/activity";
import { getAgentFromStore } from "@/store/agents";
import { getPropertyById } from "@/store/properties";

export type TourType = "in-person" | "video";

export type TourStatus = "new" | "confirmed" | "completed" | "cancelled";

export type Note = { id: string; text: string; createdAt: string };

export type TourRequest = {
  id: string;
  propertyId: string;
  propertySlug: string;
  agentId: string;
  name: string;
  email: string;
  phone: string;
  date: string; // ISO date, e.g. "2026-10-22"
  time: string; // e.g. "10:00 AM"
  type: TourType;
  message?: string;
  status: TourStatus;
  cancelReason?: string;
  notes: Note[];
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  updatedAt: string;
};

// Saved in localStorage so the dashboard and the public site share them.
const store = createSeededStore<TourRequest[]>(
  "haven-requests",
  2,
  requestsSeed,
);

function now() {
  return new Date().toISOString();
}

function homeName(r: TourRequest) {
  return getPropertyById(r.propertyId)?.name ?? r.propertySlug;
}

function patch(id: string, change: (r: TourRequest) => Partial<TourRequest>) {
  let updated: TourRequest | undefined;
  store.write(
    store.read().map((r) => {
      if (r.id !== id) return r;
      updated = { ...r, ...change(r), updatedAt: now() };
      return updated;
    }),
  );
  return updated;
}

// From the public "Schedule a tour" form.
export function addTourRequest(
  request: Omit<
    TourRequest,
    "id" | "status" | "notes" | "createdAt" | "updatedAt"
  >,
): TourRequest {
  const saved: TourRequest = {
    ...request,
    id: crypto.randomUUID(),
    status: "new",
    notes: [],
    createdAt: now(),
    updatedAt: now(),
  };
  store.write([saved, ...store.read()]);
  logActivity(
    `Tour requested: ${saved.name} for ${homeName(saved)}`,
    "tour",
    saved.id,
  );
  return saved;
}

export function confirmTour(id: string) {
  const r = patch(id, () => ({ status: "confirmed", confirmedAt: now() }));
  if (r)
    logActivity(`Tour confirmed: ${r.name} for ${homeName(r)}`, "tour", id);
}

export function completeTour(id: string) {
  const r = patch(id, () => ({ status: "completed", completedAt: now() }));
  if (r) logActivity(`Tour completed: ${r.name} at ${homeName(r)}`, "tour", id);
}

export function cancelTour(id: string, reason: string) {
  const r = patch(id, () => ({
    status: "cancelled",
    cancelReason: reason,
    cancelledAt: now(),
  }));
  if (r) logActivity(`Tour cancelled: ${r.name} (${reason})`, "tour", id);
}

export function rescheduleTour(id: string, date: string, time: string) {
  const r = patch(id, () => ({ date, time }));
  if (r)
    logActivity(`Tour rescheduled: ${r.name} for ${homeName(r)}`, "tour", id);
}

export function assignTourAgent(id: string, agentId: string) {
  const r = patch(id, () => ({ agentId }));
  if (r) logActivity(`Tour reassigned: ${r.name}`, "tour", id);
}

export function addTourNote(id: string, text: string) {
  const r = patch(id, (t) => ({
    notes: [...t.notes, { id: crypto.randomUUID(), text, createdAt: now() }],
  }));
  if (r) logActivity(`Note added to ${r.name}'s tour`, "tour", id);
}

export function removeTour(id: string) {
  const r = store.read().find((t) => t.id === id);
  store.write(store.read().filter((t) => t.id !== id));
  if (r) logActivity(`Tour request deleted: ${r.name}`, "tour", id);
}

// Moves tours from one agent to another (all of theirs, or just `ids`).
// Returns the ids that moved, so the caller can move them back.
export function reassignTours(
  fromAgentId: string,
  toAgentId: string,
  ids?: string[],
) {
  const moved = store
    .read()
    .filter((r) => r.agentId === fromAgentId && (!ids || ids.includes(r.id)))
    .map((r) => r.id);
  if (moved.length === 0) return moved;
  store.write(
    store
      .read()
      .map((r) =>
        moved.includes(r.id)
          ? { ...r, agentId: toAgentId, updatedAt: now() }
          : r,
      ),
  );
  const to = getAgentFromStore(toAgentId)?.name ?? toAgentId;
  logActivity(
    `${moved.length} ${moved.length === 1 ? "tour" : "tours"} moved to ${to}`,
    "agent",
    toAgentId,
  );
  return moved;
}

export function useRequests() {
  return store.useValue();
}

export const resetRequests = store.reset;

// Undo: put a tour back exactly as it was (re-adding it if it was deleted).
export function restoreTour(snapshot: TourRequest) {
  const all = store.read();
  store.write(
    all.some((t) => t.id === snapshot.id)
      ? all.map((t) => (t.id === snapshot.id ? snapshot : t))
      : [snapshot, ...all],
  );
}
