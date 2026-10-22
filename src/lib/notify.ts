import { toast } from "@/components/ui/toast";

const UNDO_MS = 5000;

// Dashboard toast. Pass `undo` to show an Undo button for 5 seconds.
export function notify(
  title: string,
  options?: { undo?: () => void; undoLabel?: string },
) {
  const undo = options?.undo;
  const id = toast.add({
    title,
    timeout: undo ? UNDO_MS : undefined,
    actionProps: undo
      ? {
          children: options?.undoLabel ?? "Undo",
          onClick: () => {
            undo();
            toast.close(id);
          },
        }
      : undefined,
  });
}
