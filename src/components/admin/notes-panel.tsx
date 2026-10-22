import { useId, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { adminCommon } from "@/data/admin";
import { formatDateTime, relativeTime } from "@/lib/admin-format";
import { useNow } from "@/hooks/use-now";
import type { Note } from "@/store/requests";

// Internal notes on a tour or message: oldest first, with a box to add one.
function NotesPanel({
  notes,
  onAdd,
}: {
  notes: Note[];
  onAdd: (text: string) => void;
}) {
  const id = useId();
  const now = useNow();
  const [text, setText] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const note = text.trim();
    if (!note) return;
    onAdd(note);
    setText("");
  }

  return (
    <section aria-labelledby={id}>
      <h3 id={id} className="admin-meta">
        {adminCommon.notes}
      </h3>
      {notes.length === 0 ? (
        <p className="mt-3 text-faint">{adminCommon.noNotes}</p>
      ) : (
        <ol className="mt-3 flex flex-col">
          {notes.map((note) => (
            <li
              key={note.id}
              className="border-b border-border py-3 first:pt-0 last:border-b-0"
            >
              <p className="whitespace-pre-line">{note.text}</p>
              <p className="mt-1 text-xs text-faint tabular-nums">
                {formatDateTime(note.createdAt)} ·{" "}
                {relativeTime(note.createdAt, now.getTime())}
              </p>
            </li>
          ))}
        </ol>
      )}
      <form onSubmit={submit} className="mt-4 flex flex-col gap-2">
        <label htmlFor={`${id}-text`} className="sr-only">
          {adminCommon.addNote}
        </label>
        <Textarea
          id={`${id}-text`}
          value={text}
          rows={3}
          placeholder={adminCommon.notePlaceholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit(e);
          }}
          className="rounded-[10px]"
        />
        <Button
          type="submit"
          variant="outline"
          disabled={!text.trim()}
          className="self-end"
        >
          {adminCommon.addNote}
        </Button>
      </form>
    </section>
  );
}

export default NotesPanel;
