import { useSyncExternalStore } from "react";

// A tiny typed store saved in localStorage. Components that read it re-render
// when it changes, including from another browser tab.
export function createLocalStore<T>(key: string, fallback: T) {
  let cache: T | undefined;
  const listeners = new Set<() => void>();

  function read(): T {
    if (cache !== undefined) return cache;
    try {
      const raw = window.localStorage.getItem(key);
      cache = raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      cache = fallback;
    }
    return cache;
  }

  function write(next: T) {
    cache = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Storage can be full or blocked (private mode); keep the in-memory copy.
    }
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) {
        cache = undefined;
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  function useValue() {
    return useSyncExternalStore(subscribe, read, () => fallback);
  }

  return { read, write, useValue };
}

// A store with demo seed data. The version is part of the storage key, so
// bumping it (when the data shape changes) starts fresh from the seed.
export function createSeededStore<T>(
  key: string,
  version: number,
  seed: () => T,
) {
  const store = createLocalStore<T>(`${key}-v${version}`, seed());

  // Save the seed on first visit so relative dates stay fixed afterwards.
  try {
    if (window.localStorage.getItem(`${key}-v${version}`) === null) {
      store.write(store.read());
    }
  } catch {
    // Storage blocked: the in-memory seed still works for this visit.
  }

  return { ...store, reset: () => store.write(seed()) };
}
