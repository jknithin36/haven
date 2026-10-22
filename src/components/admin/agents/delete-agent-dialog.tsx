import { useId, useState } from "react";

import SimpleSelect from "@/components/admin/property-editor/simple-select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { agentsAdminPage } from "@/data/admin-agents";
import type { Agent } from "@/data/agents";

const copy = agentsAdminPage.deleteDialog;

// Confirms deleting an agent. If they still have listings or tours, someone
// else has to take those over first.
function DeleteAgentDialog({
  agent,
  others,
  listings,
  tours,
  onOpenChange,
  onConfirm,
}: {
  agent: Agent | null;
  others: Agent[];
  listings: number;
  tours: number;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reassignTo?: string) => void;
}) {
  const id = useId();
  const [target, setTarget] = useState("");
  const needsReassign = listings + tours > 0;
  const canConfirm = !needsReassign || !!target;

  return (
    <AlertDialog
      open={agent !== null}
      onOpenChange={(open) => {
        if (!open) setTarget("");
        onOpenChange(open);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{agent && copy.title(agent.name)}</AlertDialogTitle>
          <AlertDialogDescription>
            {needsReassign ? copy.reassignText(listings, tours) : copy.text}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {needsReassign && (
          <div className="flex flex-col gap-2">
            <label htmlFor={id} className="font-medium">
              {copy.reassignLabel}
            </label>
            <SimpleSelect
              id={id}
              value={target}
              options={others.map((a) => ({ value: a.id, label: a.name }))}
              onChange={setTarget}
              placeholder={copy.reassignPlaceholder}
            />
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>{copy.cancel}</AlertDialogCancel>
          <AlertDialogAction
            disabled={!canConfirm}
            onClick={() => {
              onConfirm(needsReassign ? target : undefined);
              setTarget("");
              onOpenChange(false);
            }}
          >
            {needsReassign ? copy.confirmReassign : copy.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteAgentDialog;
