import { ArrowRight01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Link } from "react-router";

import { site } from "@/data/site";

const copy = site.announcement;

// Slim bar above the navbar on every page. The × hides it until the page is
// reloaded. (It lives in the layout, so it stays hidden while you browse.)
function AnnouncementBar() {
  const [isDismissed, setDismissed] = useState(false);
  if (isDismissed) return null;

  return (
    <aside
      aria-label={copy.label}
      className="relative isolate overflow-hidden bg-primary text-sm text-primary-foreground"
    >
      {/* Two soft glows, lighter and deeper blue, drifting slowly. Kept subtle
          enough for white text to stay easy to read. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 motion-reduce:hidden"
      >
        <span className="absolute top-1/2 left-0 h-[400%] w-[35%] -translate-y-1/2 animate-glow-a rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary),white_18%),transparent)]" />
        <span className="absolute top-1/2 left-0 h-[400%] w-[40%] -translate-y-1/2 animate-glow-b rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary),black_35%),transparent)]" />
      </span>
      <div className="page-container relative flex min-h-10 items-center justify-center py-2 pr-10 text-center">
        <p>
          <span className="hidden sm:inline">{copy.text} </span>
          <Link
            to={copy.link.to}
            className="inline-flex items-center gap-1 rounded-sm font-medium underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
          >
            {copy.link.label}
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={14}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </Link>
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={copy.dismiss}
          className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-md opacity-80 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-primary-foreground sm:right-4"
        >
          <HugeiconsIcon
            icon={Cancel01Icon}
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>
      </div>
    </aside>
  );
}

export default AnnouncementBar;
