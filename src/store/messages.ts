import { messagesSeed } from "@/data/admin-seed";
import { createSeededStore } from "@/lib/local-store";
import { logActivity } from "@/store/activity";
import type { Note } from "@/store/requests";

export type MessageType = "general" | "tour" | "agent-match" | "agent-contact";

export type Message = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: MessageType;
  agentId?: string;
  area?: string;
  subject: string;
  message: string;
  read: boolean;
  archived: boolean;
  notes: Note[];
  createdAt: string;
};

// Saved in localStorage so the dashboard and the public site share them.
const store = createSeededStore<Message[]>("haven-messages", 2, messagesSeed);

function update(id: string, change: Partial<Message>) {
  const current = store.read().find((m) => m.id === id);
  store.write(store.read().map((m) => (m.id === id ? { ...m, ...change } : m)));
  return current;
}

// From the contact form and the agent profile form.
export function addMessage(
  input: Omit<Message, "id" | "read" | "archived" | "notes" | "createdAt">,
) {
  const saved: Message = {
    ...input,
    id: crypto.randomUUID(),
    read: false,
    archived: false,
    notes: [],
    createdAt: new Date().toISOString(),
  };
  store.write([saved, ...store.read()]);
  logActivity(`New message from ${saved.name}`, "message", saved.id);
  return saved;
}

export function markMessageRead(id: string, read = true) {
  update(id, { read });
}

export function setMessageArchived(id: string, archived: boolean) {
  const m = update(id, { archived });
  if (m)
    logActivity(
      `Message from ${m.name} ${archived ? "archived" : "moved to inbox"}`,
      "message",
      id,
    );
}

export function addMessageNote(id: string, text: string) {
  const current = store.read().find((m) => m.id === id);
  if (!current) return;
  update(id, {
    notes: [
      ...current.notes,
      { id: crypto.randomUUID(), text, createdAt: new Date().toISOString() },
    ],
  });
  logActivity(`Note added to ${current.name}'s message`, "message", id);
}

export function removeMessage(id: string) {
  const m = store.read().find((x) => x.id === id);
  store.write(store.read().filter((x) => x.id !== id));
  if (m) logActivity(`Message from ${m.name} deleted`, "message", id);
  return m;
}

export function restoreMessage(message: Message) {
  store.write([message, ...store.read()]);
}

export function useMessages() {
  return store.useValue();
}

export const resetMessages = store.reset;
