import { Link } from "react-router";

import LogoMark from "@/components/logo-mark";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

// Logo mark + name, linking home. Takes the surrounding text color.
function BrandLogo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label={site.homeLabel}
      className={cn("inline-flex items-center gap-2 rounded-sm", className)}
    >
      <LogoMark aria-hidden="true" className="size-8" />
      <span className="text-lg font-semibold tracking-tight">{site.name}</span>
    </Link>
  );
}

export default BrandLogo;
