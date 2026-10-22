import type { ReactNode } from "react";

// One line of copy and one action, quietly centered in the content area.
function EmptyState({ text, action }: { text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 border-y border-border py-20 text-center">
      <p className="text-muted-foreground">{text}</p>
      {action}
    </div>
  );
}

export default EmptyState;
