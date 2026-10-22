import { Call02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { NavLink } from "react-router";

import BrandLogo from "@/components/brand-logo";
import ButtonLink from "@/components/button-link";
import { site, type NavItem } from "@/data/site";
import { cn } from "@/lib/utils";

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

function Navbar() {
  const { nav } = site;

  return (
    <header className="border-b">
      <nav
        aria-label={nav.label}
        className="page-container grid h-16 grid-cols-3 items-center"
      >
        <div className="flex items-center gap-6">
          {nav.primary.map((item) => (
            <NavItemLink key={item.to} item={item} />
          ))}
        </div>

        <BrandLogo className="justify-self-center focus-ring" />

        <div className="flex items-center justify-end gap-6">
          {nav.secondary.map((item) => (
            <NavItemLink key={item.to} item={item} />
          ))}
          <ButtonLink to={nav.cta.to}>
            <HugeiconsIcon
              icon={Call02Icon}
              strokeWidth={1.5}
              aria-hidden="true"
              data-icon="inline-start"
            />
            {nav.cta.label}
          </ButtonLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
