import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { shortcutsDialog as copy } from "@/data/admin";

function ShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="admin-section">{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          {copy.groups.map((group) => (
            <section key={group.title}>
              <h3 className="admin-meta">{group.title}</h3>
              <dl className="mt-2 divide-y divide-border">
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 text-sm"
                  >
                    <dt>{item.label}</dt>
                    <dd>
                      <KbdGroup>
                        {item.keys.map((key) => (
                          <Kbd key={key}>{key}</Kbd>
                        ))}
                      </KbdGroup>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShortcutsDialog;
