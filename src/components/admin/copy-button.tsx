import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";

import Icon from "@/components/admin/icon";
import { adminCommon } from "@/data/admin";

const RESET_MS = 1500;

// A small icon button that copies `value` and briefly shows a check.
function CopyButton({ value, what }: { value: string; what: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), RESET_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the value is still visible to select.
    }
  }

  const label = copied ? adminCommon.copied : adminCommon.copy(what);
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      title={label}
      className="admin-focus flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Icon icon={copied ? Tick02Icon : Copy01Icon} size={16} />
      <span className="sr-only" aria-live="polite">
        {copied ? adminCommon.copied : ""}
      </span>
    </button>
  );
}

export default CopyButton;
