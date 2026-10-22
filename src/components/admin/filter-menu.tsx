import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

import Icon from "@/components/admin/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type MenuOption = { value: string; label: string };

// Compact filter button showing its current value, e.g. "City  Tampa ▾".
function FilterMenu({
  label,
  value,
  options,
  onChange,
  defaultValue = "all",
}: {
  label: string;
  value: string;
  options: MenuOption[];
  onChange: (value: string) => void;
  defaultValue?: string;
}) {
  const current = options.find((o) => o.value === value);
  const active = value !== defaultValue;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "admin-focus inline-flex h-9 items-center gap-1.5 rounded-[10px] border px-3 text-sm whitespace-nowrap transition-colors hover:bg-subtle",
          active ? "border-foreground" : "border-border",
        )}
      >
        <span className="text-muted-foreground">{label}</span>
        <span className={cn(active ? "font-medium" : "text-muted-foreground")}>
          {current?.label}
        </span>
        <Icon
          icon={ArrowDown01Icon}
          size={16}
          className="text-muted-foreground"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-44">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(v) => onChange(String(v))}
        >
          {options.map((o) => (
            <DropdownMenuRadioItem key={o.value} value={o.value} closeOnClick>
              {o.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default FilterMenu;
