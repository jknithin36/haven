import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { useId } from "react";

import Icon from "@/components/admin/icon";
import { adminCommon } from "@/data/admin";
import { cn } from "@/lib/utils";

function SearchInput({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Icon
        icon={Search01Icon}
        size={16}
        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
      />
      <input
        id={id}
        type="search"
        value={value}
        placeholder={label}
        onChange={(e) => onChange(e.target.value)}
        className="admin-focus h-9 w-full rounded-[10px] border border-border bg-background pr-8 pl-9 text-sm placeholder:text-faint [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label={adminCommon.clearSearch}
          onClick={() => onChange("")}
          className="admin-focus absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
        >
          <Icon icon={Cancel01Icon} size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
