import { useSearchParams } from "react-router";

// Read and write search params for list pages. Values equal to their default
// are left out of the URL; changing anything but the page resets to page 1.
export function useUrlState<K extends string>(defaults: Record<K, string>) {
  const [params, setParams] = useSearchParams();

  const values = Object.fromEntries(
    (Object.keys(defaults) as K[]).map((key) => [
      key,
      params.get(key) ?? defaults[key],
    ]),
  ) as Record<K, string>;

  function set(patch: Partial<Record<K, string>>) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(patch) as [K, string][]) {
      if (value === undefined || value === defaults[key]) next.delete(key);
      else next.set(key, value);
    }
    if (!("page" in patch)) next.delete("page");
    setParams(next, { replace: true, preventScrollReset: true });
  }

  return { values, set, params, setParams };
}
