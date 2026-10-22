import {
  Add01Icon,
  Building03Icon,
  Calendar03Icon,
  Mail01Icon,
  Refresh01Icon,
} from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router";

import Icon from "@/components/admin/icon";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { adminLayout, commandPalette as copy } from "@/data/admin";
import { useMessages } from "@/store/messages";
import { useAllProperties } from "@/store/properties";
import { useRequests } from "@/store/requests";

// ⌘K: jump to any home, tour, or message, or run an action.
function CommandPalette({
  open,
  onOpenChange,
  onReset,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
}) {
  const navigate = useNavigate();
  const homes = useAllProperties();
  const tours = useRequests();
  const messages = useMessages();
  const homeName = (id: string) => homes.find((h) => h.id === id)?.name ?? "";

  function go(to: string) {
    onOpenChange(false);
    navigate(to);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title={copy.label}
      description={copy.placeholder}
      className="sm:max-w-xl"
    >
      <Command>
        <CommandInput placeholder={copy.placeholder} />
        <CommandList className="max-h-96">
          <CommandEmpty>{copy.empty}</CommandEmpty>

          <CommandGroup heading={copy.groups.actions}>
            <CommandItem onSelect={() => go("/admin/properties/new")}>
              <Icon icon={Add01Icon} />
              {copy.actions.newProperty}
            </CommandItem>
            <CommandItem onSelect={() => go("/admin/tours")}>
              <Icon icon={Calendar03Icon} />
              {copy.actions.goTours}
            </CommandItem>
            <CommandItem
              onSelect={() => {
                onOpenChange(false);
                onReset();
              }}
            >
              <Icon icon={Refresh01Icon} />
              {copy.actions.reset}
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading={copy.groups.pages}>
            {adminLayout.nav.map((item) => (
              <CommandItem
                key={item.key}
                value={`page ${item.label}`}
                onSelect={() => go(item.to)}
              >
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading={copy.groups.homes}>
            {homes.map((home) => (
              <CommandItem
                key={home.id}
                value={`home ${home.name} ${home.city} ${home.address}`}
                onSelect={() => go(`/admin/properties/${home.id}/edit`)}
              >
                <Icon icon={Building03Icon} />
                <span className="flex-1 truncate">{home.name}</span>
                <span className="text-xs text-muted-foreground">
                  {home.city}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading={copy.groups.tours}>
            {tours.map((tour) => (
              <CommandItem
                key={tour.id}
                value={`tour ${tour.name} ${homeName(tour.propertyId)}`}
                onSelect={() => go(`/admin/tours?tour=${tour.id}`)}
              >
                <Icon icon={Calendar03Icon} />
                <span className="flex-1 truncate">{tour.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {homeName(tour.propertyId)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading={copy.groups.messages}>
            {messages.map((m) => (
              <CommandItem
                key={m.id}
                value={`message ${m.name} ${m.subject}`}
                onSelect={() => go(`/admin/messages?id=${m.id}`)}
              >
                <Icon icon={Mail01Icon} />
                <span className="flex-1 truncate">{m.subject}</span>
                <span className="text-xs text-muted-foreground">{m.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

export default CommandPalette;
