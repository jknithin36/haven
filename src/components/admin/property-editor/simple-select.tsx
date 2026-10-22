import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = { value: string; label: string };

// A plain select for short option lists.
function SimpleSelect({
  id,
  value,
  options,
  onChange,
  placeholder,
  invalid,
}: {
  id: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder: string;
  invalid?: boolean;
}) {
  return (
    <Select
      value={value || null}
      onValueChange={(v) => v && onChange(v)}
      items={options}
    >
      <SelectTrigger
        id={id}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className="w-full rounded-[10px]"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default SimpleSelect;
