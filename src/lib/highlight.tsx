import type { ReactNode } from "react";

// Wraps every match of `term` in a <mark>, case-insensitively.
export function highlight(text: string, term: string): ReactNode {
  const query = term.trim();
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="rounded-sm bg-primary/15 text-foreground">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
