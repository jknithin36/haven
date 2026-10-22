import { useEffect, useRef } from "react";

import { messagesPage as copy } from "@/data/admin-messages";
import { relativeTime } from "@/lib/admin-format";
import { cn } from "@/lib/utils";
import type { Message } from "@/store/messages";

// One row per message: name, time, subject (bold while unread), and a
// one-line preview. The red dot marks unread messages.
function MessageList({
  id,
  messages,
  selectedId,
  now,
  onOpen,
}: {
  id: string;
  messages: Message[];
  selectedId: string;
  now: number;
  onOpen: (id: string) => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);

  // Keep the selected row in view when J/K moves past the edge.
  useEffect(() => {
    if (!selectedId) return;
    listRef.current
      ?.querySelector(`[data-id="${CSS.escape(selectedId)}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  return (
    <ul id={id} ref={listRef} aria-label={copy.listLabel}>
      {messages.map((m) => {
        const selected = m.id === selectedId;
        return (
          <li key={m.id} data-id={m.id} className="border-b border-border">
            <button
              type="button"
              onClick={() => onOpen(m.id)}
              aria-current={selected ? "true" : undefined}
              className={cn(
                "admin-focus flex w-full flex-col gap-0.5 px-4 py-3 text-left transition-colors focus-visible:ring-inset focus-visible:ring-offset-0",
                selected ? "bg-muted" : "hover:bg-subtle",
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    m.read ? "bg-transparent" : "bg-attention",
                  )}
                />
                <span
                  className={cn(
                    "min-w-0 flex-1 truncate",
                    m.read ? "text-muted-foreground" : "font-medium",
                  )}
                >
                  {m.name}
                  {!m.read && <span className="sr-only">, {copy.unread}</span>}
                </span>
                <span className="shrink-0 text-xs text-faint tabular-nums">
                  {relativeTime(m.createdAt, now)}
                </span>
              </span>
              <span
                className={cn(
                  "truncate pl-3.5",
                  m.read ? "text-foreground" : "font-semibold",
                )}
              >
                {m.subject}
              </span>
              <span className="truncate pl-3.5 text-muted-foreground">
                {m.message}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default MessageList;
