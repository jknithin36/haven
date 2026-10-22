import type { ReactNode } from "react";

// Small uppercase eyebrow with a dot, used above section headings.
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 type-eyebrow text-foreground/80">
      <span
        aria-hidden="true"
        className="size-2 rounded-full bg-muted-foreground/40 ring-3 ring-muted"
      />
      {children}
    </p>
  );
}

export default SectionLabel;
