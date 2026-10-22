import { useEffect, useState } from "react";

const MIN_MS = 300;
const MAX_MS = 450;

// A short fake load when a dashboard page opens, so skeletons show like they
// would with a real server.
export function useSimulatedLoading() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ms = MIN_MS + Math.random() * (MAX_MS - MIN_MS);
    const timer = window.setTimeout(() => setLoading(false), ms);
    return () => window.clearTimeout(timer);
  }, []);

  return loading;
}
