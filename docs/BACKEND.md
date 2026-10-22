# Connecting your backend

Haven ships without a server. Everything you see, including homes, tours, messages, agents, the activity log and the admin sign-in, is stored in the visitor's browser (`localStorage`). Changes made in the dashboard show up on the public site right away, and sync across open tabs.

That keeps the template easy to run. It also means **data is per browser and anyone can sign in to the demo**. Before you go live, connect a real backend. This guide shows where to plug it in.

## The one seam: `src/store/*`

Components never call `localStorage` or `fetch` themselves. Every read and write goes through a store module:

| Store | Holds | Reads (hooks) | Writes (actions) |
| --- | --- | --- | --- |
| `src/store/properties.ts` | `ListedProperty[]` | `useAllProperties`, `usePublicProperties`, `usePublicProperty(slug)` | `addProperty`, `updateProperty`, `setPropertyStatus`, `removeProperties`, `restoreProperties`, `duplicateProperty` |
| `src/store/requests.ts` | `TourRequest[]` | `useRequests` | `addTourRequest`, `confirmTour`, `completeTour`, `cancelTour`, `rescheduleTour`, `assignTourAgent`, `addTourNote`, `removeTour` |
| `src/store/messages.ts` | `Message[]` | `useMessages` | `addMessage`, `markMessageRead`, `setMessageArchived`, `addMessageNote`, `removeMessage`, `restoreMessage` |
| `src/store/agents.ts` | `Agent[]` | `useAgents`, `useAgent(id)`, `useAgentBySlug(slug)` | `addAgent`, `updateAgent`, `removeAgent` |
| `src/store/activity.ts` | `ActivityEvent[]` (latest 100) | `useActivity` | `logActivity` (called by the other stores) |
| `src/store/auth.ts` | `AdminUser \| null` | `useAuthUser` | `signIn`, `signOut` |
| `src/store/demo.ts` | — | — | `resetDemoData` (demo only, remove it with a backend) |

Each store has a few more helpers, such as undo (`restore…`), reassigning on delete, and slug checks. Open the file to see the full list; each export has a one-line comment.

The types are the contract between the UI and your API:

- `Property`: `src/data/properties.ts`
- `ListedProperty`, `PropertyStatus`, `Photo`: `src/store/properties.ts`
- `TourRequest`, `TourStatus`, `TourType`, `Note`: `src/store/requests.ts`
- `Message`, `MessageType`: `src/store/messages.ts`
- `Agent`: `src/data/agents.ts`
- `ActivityEvent`, `EntityType`: `src/store/activity.ts`
- `AdminUser`: `src/data/demo-auth.ts`

If you keep these function names and types, **no component has to change**.

## How the stores work today

`src/lib/local-store.ts` provides two helpers:

- `createLocalStore(key, fallback)` returns `{ read, write, useValue }`. `useValue` is a `useSyncExternalStore` hook, so every component re-renders when the data changes.
- `createSeededStore(key, version, seed)` does the same, starting from demo seed data (`src/data/admin-seed.ts`). Bumping `version` starts fresh when the data shape changes.

The store actions are synchronous: they update the cached array, save it, and notify subscribers.

## Swapping a store to your API

The simplest path is to keep the in-memory cache and its `useValue` hook for instant UI, but:

1. Load the initial data from your API instead of the seed.
2. Send every action to your API, update the cache optimistically, and roll back if the request fails.

Here is `properties.ts` moved to a REST API. Set `VITE_API_URL` in `.env`.

```ts
// src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL;

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include", // send the session cookie
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) throw new Error(`${init?.method ?? "GET"} ${path}: ${res.status}`);
  return res.status === 204 ? (undefined as T) : res.json();
}
```

```ts
// src/lib/remote-store.ts: same shape as createLocalStore, kept in memory.
import { useSyncExternalStore } from "react";

export function createRemoteStore<T>(fallback: T, load: () => Promise<T>) {
  let value = fallback;
  let loaded = false;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());

  function write(next: T) {
    value = next;
    emit();
  }

  function refresh() {
    return load().then(write).catch(console.error);
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    if (!loaded) {
      loaded = true;
      void refresh();
    }
    return () => listeners.delete(listener);
  }

  return {
    read: () => value,
    write,
    refresh,
    useValue: () => useSyncExternalStore(subscribe, () => value, () => fallback),
  };
}
```

```ts
// src/store/properties.ts (excerpt)
import { api } from "@/lib/api";
import { createRemoteStore } from "@/lib/remote-store";

const store = createRemoteStore<ListedProperty[]>([], () =>
  api<ListedProperty[]>("/properties"),
);

export function updateProperty(id: string, patch: Partial<ListedProperty>) {
  const before = store.read();
  // Optimistic: show the change now…
  store.write(before.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  // …then save it, and undo if the server says no.
  api<ListedProperty>(`/properties/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  })
    .then((saved) =>
      store.write(store.read().map((p) => (p.id === id ? saved : p))),
    )
    .catch(() => store.write(before));
}
```

Do the same for each action. Some notes:

- **Activity.** With a backend, write activity events on the server, inside the same request that changes the data, and drop the `logActivity` calls from the client.
- **Loading states.** Pages show skeletons through `useSimulatedLoading()` (`src/hooks/use-simulated-loading.ts`). Replace it with your store's real loading flag, or adopt a data library such as TanStack Query or SWR inside the store modules. Components still only see the hooks.
- **Public vs. admin reads.** `usePublicProperties` filters to `status === "active"` on the client. With an API, have the public endpoint return only active homes, so drafts never leave the server.
- **Photos.** The editor stores uploads as resized data URLs (`src/lib/image-file.ts`). With a backend, upload the file to your storage (S3, R2, Cloudinary…) and save the returned URL in `Photo.src`.
- **Seed data.** Delete `src/data/admin-seed.ts`, `src/store/demo.ts` and the "Reset demo data" menu items once you have real data.

## Suggested REST contract

Any backend works (Node, Laravel, Django, Rails, Supabase, Firebase…). This is one shape that maps 1:1 to the stores. All bodies are JSON with the TypeScript types above.

### Auth

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| `POST` | `/auth/sign-in` | `{ email, password }` | `AdminUser` and sets an HTTP-only session cookie |
| `POST` | `/auth/sign-out` | — | `204` |
| `GET` | `/auth/me` | — | `AdminUser` or `401` |

### Properties

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/public/properties` | Active homes only. No auth. |
| `GET` | `/public/properties/:slug` | One active home, or `404`. |
| `GET` | `/properties` | All homes, any status. Admin. |
| `POST` | `/properties` | Create. Server checks that `slug` is unique (`409` if taken). |
| `PATCH` | `/properties/:id` | Partial update. |
| `POST` | `/properties/status` | `{ ids, status }` for bulk status changes. |
| `DELETE` | `/properties/:id` | Supports undo through a soft delete, or `POST /properties/:id/restore`. |
| `POST` | `/properties/:id/duplicate` | Returns the new draft. |

### Tours (`TourRequest`)

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/public/tours` | From the public "Schedule a tour" form. No auth; add rate limiting and a captcha. |
| `GET` | `/tours` | Admin. |
| `POST` | `/tours/:id/confirm` | Sets `status` and `confirmedAt`. |
| `POST` | `/tours/:id/complete` | Sets `status` and `completedAt`. |
| `POST` | `/tours/:id/cancel` | `{ reason }` |
| `POST` | `/tours/:id/reschedule` | `{ date, time }` |
| `PATCH` | `/tours/:id` | `{ agentId }` to reassign. |
| `POST` | `/tours/:id/notes` | `{ text }` |
| `DELETE` | `/tours/:id` | |

### Messages

| Method | Path | Notes |
| --- | --- | --- |
| `POST` | `/public/messages` | From the contact form and agent pages. No auth; rate limit. |
| `GET` | `/messages` | Admin. |
| `PATCH` | `/messages/:id` | `{ read }` or `{ archived }` |
| `POST` | `/messages/:id/notes` | `{ text }` |
| `DELETE` | `/messages/:id` | |

### Agents

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/public/agents` | No auth. |
| `POST` | `/agents` | Admin. |
| `PATCH` | `/agents/:id` | Admin. |
| `DELETE` | `/agents/:id` | `{ reassignTo }`: move their listings and tours to another agent first. |

### Activity

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/activity?type=&page=` | Admin. Newest first, 20 per page. Written by the server. |

## Replacing the demo sign-in

The demo login is **client-side only**: `src/data/demo-auth.ts` holds the email and password, and anyone who reads the code can see them. It protects nothing. To use real auth:

1. Delete `src/data/demo-auth.ts`, but keep the `AdminUser` type (move it into `src/store/auth.ts`).
2. Rewrite `src/store/auth.ts`:
   - `signIn(email, password)` calls `POST /auth/sign-in`, stores the returned user, and resolves to `true` or `false`. Make it `async`, then `await` it in `src/pages/admin/AdminLogin.tsx`.
   - `signOut()` calls `POST /auth/sign-out`, then clears the user.
   - On startup, call `GET /auth/me` to restore the session.
   - Keep `useAuthUser()` as the hook; `AdminLayout` already redirects to `/admin/login` when it returns `null`.
3. Remove the pre-filled demo values and the demo note in `adminLoginPage` (`src/data/admin.ts`).
4. **Enforce access on the server.** Every `/properties`, `/tours`, `/messages`, `/agents` and `/activity` admin route must check the session. Hiding the dashboard in the browser is not security.

Hosted auth such as Clerk, Auth0, Supabase Auth or Firebase Auth also fits behind the same `useAuthUser` / `signIn` / `signOut` functions.

## Search engines and a backend

`sitemap.xml` is generated at build time from `src/data/*` (`scripts/seo-plugin.ts`). Homes created in the dashboard aren't in it. Once your homes live in an API, generate the sitemap from the API instead: either fetch it in the plugin at build time, or serve `/sitemap.xml` from your backend.
