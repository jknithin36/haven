import { useState } from "react";

// The current time, captured once when the component mounts. Keeps renders
// pure (reading the clock during render gives different results each time).
export function useNow() {
  const [now] = useState(() => new Date());
  return now;
}
