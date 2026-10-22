import { useMemo } from "react";

import { propertiesSeed } from "@/data/admin-seed";
import type { Property } from "@/data/properties";
import { createSeededStore } from "@/lib/local-store";
import { logActivity } from "@/store/activity";
import { getAgentFromStore } from "@/store/agents";

export type PropertyStatus = "active" | "draft" | "sold" | "rented";

export type Photo = { id: string; src: string; alt: string };

// A home as managed in the dashboard. Only "active" homes are public.
export type ListedProperty = Property & {
  status: PropertyStatus;
  updatedAt: string; // ISO timestamp
  photos: Photo[]; // first photo is the cover
};

const store = createSeededStore<ListedProperty[]>(
  "haven-properties",
  1,
  propertiesSeed,
);

const STATUS_VERB: Record<PropertyStatus, string> = {
  active: "published",
  draft: "moved to draft",
  sold: "marked sold",
  rented: "marked rented",
};

function now() {
  return new Date().toISOString();
}

// The card and detail page read `image` and `wideImage`; keep them in sync
// with the photo list.
export function withPhotoFields(p: ListedProperty): ListedProperty {
  const cover = p.photos[0];
  const wide = p.photos[1] ?? cover;
  if (!cover) {
    return { ...p, image: "", imageAlt: "", wideImage: { src: "", alt: "" } };
  }
  return {
    ...p,
    image: cover.src,
    imageAlt: cover.alt,
    wideImage: { src: wide.src, alt: wide.alt },
  };
}

export function getPropertyById(id: string) {
  return store.read().find((p) => p.id === id);
}

export function isSlugTaken(slug: string, exceptId?: string) {
  return store.read().some((p) => p.slug === slug && p.id !== exceptId);
}

export function addProperty(input: ListedProperty) {
  const saved = withPhotoFields({ ...input, updatedAt: now() });
  store.write([saved, ...store.read()]);
  logActivity(
    `${saved.name} ${saved.status === "active" ? "published" : "saved as draft"}`,
    "property",
    saved.id,
  );
  return saved;
}

export function updateProperty(id: string, patch: Partial<ListedProperty>) {
  let updated: ListedProperty | undefined;
  store.write(
    store.read().map((p) => {
      if (p.id !== id) return p;
      updated = withPhotoFields({ ...p, ...patch, updatedAt: now() });
      return updated;
    }),
  );
  if (updated) logActivity(`${updated.name} updated`, "property", id);
  return updated;
}

export function setPropertyStatus(ids: string[], status: PropertyStatus) {
  const changed = store.read().filter((p) => ids.includes(p.id));
  store.write(
    store
      .read()
      .map((p) =>
        ids.includes(p.id) ? { ...p, status, updatedAt: now() } : p,
      ),
  );
  changed.forEach((p) =>
    logActivity(`${p.name} ${STATUS_VERB[status]}`, "property", p.id),
  );
}

// Returns what was removed (with positions) so the caller can undo.
export function removeProperties(ids: string[]) {
  const all = store.read();
  const removed = all
    .map((p, index) => ({ property: p, index }))
    .filter(({ property }) => ids.includes(property.id));
  store.write(all.filter((p) => !ids.includes(p.id)));
  removed.forEach(({ property }) =>
    logActivity(`${property.name} deleted`, "property", property.id),
  );
  return removed;
}

export function restoreProperties(
  removed: { property: ListedProperty; index: number }[],
) {
  const next = [...store.read()];
  [...removed]
    .sort((a, b) => a.index - b.index)
    .forEach(({ property, index }) => next.splice(index, 0, property));
  store.write(next);
  removed.forEach(({ property }) =>
    logActivity(`${property.name} restored`, "property", property.id),
  );
}

export function duplicateProperty(id: string) {
  const source = getPropertyById(id);
  if (!source) return undefined;
  let slug = `${source.slug}-copy`;
  for (let n = 2; isSlugTaken(slug); n++) slug = `${source.slug}-copy-${n}`;
  const copy: ListedProperty = {
    ...source,
    id: crypto.randomUUID(),
    slug,
    name: `${source.name} (copy)`,
    status: "draft",
    featured: false,
    isNew: false,
    views: 0,
    saves: 0,
    updatedAt: now(),
  };
  const all = store.read();
  const at = all.findIndex((p) => p.id === id);
  store.write([...all.slice(0, at + 1), copy, ...all.slice(at + 1)]);
  logActivity(`${source.name} duplicated`, "property", copy.id);
  return copy;
}

// Moves listings from one agent to another (all of theirs, or just `ids`).
// Returns the ids that moved, so the caller can move them back.
export function reassignProperties(
  fromAgentId: string,
  toAgentId: string,
  ids?: string[],
) {
  const moved = store
    .read()
    .filter((p) => p.agentId === fromAgentId && (!ids || ids.includes(p.id)))
    .map((p) => p.id);
  if (moved.length === 0) return moved;
  store.write(
    store
      .read()
      .map((p) =>
        moved.includes(p.id)
          ? { ...p, agentId: toAgentId, updatedAt: now() }
          : p,
      ),
  );
  const to = getAgentFromStore(toAgentId)?.name ?? toAgentId;
  logActivity(
    `${moved.length} ${moved.length === 1 ? "listing" : "listings"} moved to ${to}`,
    "agent",
    toAgentId,
  );
  return moved;
}

export function useAllProperties() {
  return store.useValue();
}

// Homes visitors can see: only active ones.
export function usePublicProperties(): ListedProperty[] {
  const all = store.useValue();
  return useMemo(() => all.filter((p) => p.status === "active"), [all]);
}

export function usePublicProperty(slug: string | undefined) {
  const homes = usePublicProperties();
  return homes.find((p) => p.slug === slug);
}

export const resetProperties = store.reset;
