import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { cn } from "@/lib/utils";

// Small text link with an up-right arrow, e.g. "View all homes".
function ArrowLink({
  to,
  children,
  className,
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-1 rounded-sm text-sm font-medium underline-offset-4 focus-ring hover:underline",
        className,
      )}
    >
      {children}
      <HugeiconsIcon
        icon={ArrowUpRight01Icon}
        size={16}
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </Link>
  );
}

export default ArrowLink;
