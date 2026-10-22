import {
  ArrowRight01Icon,
  Call02Icon,
  Cancel01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router";

import BrandLogo from "@/components/brand-logo";
import ButtonLink from "@/components/button-link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { site, type NavItem } from "@/data/site";
import { cn } from "@/lib/utils";

const { nav } = site;
const allLinks = [...nav.primary, ...nav.secondary];

function NavItemLink({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          "rounded-sm text-sm leading-none transition-colors focus-ring hover:text-primary",
          isActive && "text-primary",
        )
      }
    >
      {item.label}
    </NavLink>
  );
}

function CallIcon() {
  return (
    <HugeiconsIcon
      icon={Call02Icon}
      strokeWidth={1.5}
      aria-hidden="true"
      data-icon="inline-start"
    />
  );
}

// Phones and tablets: every link in a panel that slides in from the right,
// with large tap targets and the call button at the bottom.
function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the panel whenever the page changes (adjusting state while
  // rendering, so there's no flash of the old page behind it).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={nav.openMenu}
        aria-expanded={open}
        className="-mr-2 flex size-11 items-center justify-center rounded-lg transition-colors focus-ring hover:bg-muted"
      >
        <HugeiconsIcon
          icon={Menu01Icon}
          size={22}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-0 overscroll-contain p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-sm"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-6">
          <SheetTitle className="text-sm font-medium text-muted-foreground">
            {nav.menuTitle}
          </SheetTitle>
          <SheetClose
            aria-label={nav.closeMenu}
            className="-mr-2 flex size-11 items-center justify-center rounded-lg transition-colors focus-ring hover:bg-muted"
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={22}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </SheetClose>
        </div>

        <nav
          aria-label={nav.label}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6"
        >
          <ul>
            {allLinks.map((item) => (
              <li key={item.to} className="border-b">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "group flex min-h-16 items-center justify-between gap-4 text-2xl font-medium tracking-tight transition-colors focus-ring",
                      isActive ? "text-primary" : "hover:text-primary",
                    )
                  }
                >
                  {item.label}
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={20}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 border-t px-6 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <p className="text-sm text-muted-foreground">{nav.contactTitle}</p>
          <ButtonLink to={nav.cta.to} size="lg" className="mt-3 w-full">
            <CallIcon />
            {nav.cta.label}
          </ButtonLink>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Navbar() {
  return (
    <header className="border-b">
      {/* Desktop: links left, logo centered, contact and call right */}
      <nav
        aria-label={nav.label}
        className="page-container hidden h-16 grid-cols-[1fr_auto_1fr] items-center gap-8 lg:grid"
      >
        <div className="flex items-center gap-6">
          {nav.primary.map((item) => (
            <NavItemLink key={item.to} item={item} />
          ))}
        </div>

        <BrandLogo className="focus-ring" />

        <div className="flex items-center justify-end gap-6">
          {nav.secondary.map((item) => (
            <NavItemLink key={item.to} item={item} />
          ))}
          <ButtonLink to={nav.cta.to}>
            <CallIcon />
            {nav.cta.label}
          </ButtonLink>
        </div>
      </nav>

      {/* Phones and tablets: logo, call button, and the menu */}
      <div className="page-container flex h-16 items-center justify-between gap-3 lg:hidden">
        <BrandLogo className="focus-ring" />
        <div className="flex items-center gap-2">
          <ButtonLink to={nav.cta.to} className="max-[359px]:hidden">
            <CallIcon />
            {nav.cta.label}
          </ButtonLink>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
