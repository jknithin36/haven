import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { useRef, type ReactNode } from "react";

import Icon from "@/components/admin/icon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { adminCommon } from "@/data/admin";

// The dashboard's right-hand panel: 440px, slides in, traps focus, and
// closes on Escape. Body scrolls; the footer stays put.
function SidePanel({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  // Focus lands on the panel body, not the close button, when it opens.
  const bodyRef = useRef<HTMLDivElement>(null);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        initialFocus={bodyRef}
        className="w-full gap-0 border-border p-0 shadow-float sm:max-w-[440px] data-[side=right]:w-full data-[side=right]:sm:max-w-[440px]"
      >
        <div className="flex items-start gap-4 border-b border-border px-6 py-5">
          <div className="min-w-0 flex-1">
            <SheetTitle className="admin-section truncate text-base">
              {title}
            </SheetTitle>
            {description && (
              <SheetDescription className="mt-1 text-muted-foreground">
                {description}
              </SheetDescription>
            )}
          </div>
          <SheetClose
            aria-label={adminCommon.close}
            className="admin-focus -mt-1 -mr-2 flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Icon icon={Cancel01Icon} />
          </SheetClose>
        </div>
        <div
          ref={bodyRef}
          tabIndex={-1}
          className="min-h-0 flex-1 overflow-y-auto px-6 py-6 outline-none"
        >
          {children}
        </div>
        {footer && (
          <div className="flex flex-wrap items-center gap-2 border-t border-border px-6 py-4">
            {footer}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default SidePanel;
