import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { useState, type KeyboardEvent } from "react";

import Icon from "@/components/admin/icon";

// Tags in a box. Enter adds the typed text; Backspace on an empty field
// removes the last tag.
function TagInput({
  id,
  value,
  onChange,
  placeholder,
  removeLabel,
}: {
  id: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
  removeLabel: (tag: string) => string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const tag = draft.trim();
    if (!tag) return;
    if (!value.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      onChange([...value, tag]);
    }
    setDraft("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-[10px] border border-input px-2 py-1.5 transition-colors focus-within:border-foreground">
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex h-7 items-center gap-1 rounded-full bg-muted pr-1 pl-2.5 text-[13px]"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            aria-label={removeLabel(tag)}
            className="admin-focus flex size-5 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
          >
            <Icon icon={Cancel01Icon} size={16} />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={add}
        placeholder={placeholder}
        className="h-7 min-w-40 flex-1 bg-transparent px-1 outline-none placeholder:text-faint"
      />
    </div>
  );
}

export default TagInput;
