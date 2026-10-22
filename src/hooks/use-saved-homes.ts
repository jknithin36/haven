import { createLocalStore } from "@/lib/local-store";

const store = createLocalStore<string[]>("haven-saved-homes", []);

// Homes the visitor has saved (hearted), by property id.
export function useSavedHome(propertyId: string) {
  const saved = store.useValue();
  const isSaved = saved.includes(propertyId);

  function toggle() {
    const current = store.read();
    store.write(
      current.includes(propertyId)
        ? current.filter((id) => id !== propertyId)
        : [...current, propertyId],
    );
  }

  return { isSaved, toggle };
}
