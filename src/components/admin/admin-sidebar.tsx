import {
  Activity01Icon,
  ArrowUpRight01Icon,
  Building03Icon,
  Calendar03Icon,
  DashboardSquare01Icon,
  KeyboardIcon,
  Logout01Icon,
  Mail01Icon,
  Refresh01Icon,
  SidebarLeft01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import type { HugeiconsIconProps } from "@hugeicons/react";
import { NavLink } from "react-router";

import Icon from "@/components/admin/icon";
import LogoMark from "@/components/logo-mark";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { adminLayout as copy, type AdminNavKey } from "@/data/admin";
import type { AdminUser } from "@/data/demo-auth";
import { useAdminCounts } from "@/hooks/use-admin-counts";
import { cn } from "@/lib/utils";

const icons: Record<AdminNavKey, HugeiconsIconProps["icon"]> = {
  overview: DashboardSquare01Icon,
  properties: Building03Icon,
  tours: Calendar03Icon,
  messages: Mail01Icon,
  agents: UserGroupIcon,
  activity: Activity01Icon,
};

// Wraps a row in a tooltip only when the sidebar is collapsed to icons.
function WithTooltip({
  label,
  enabled,
  children,
}: {
  label: string;
  enabled: boolean;
  children: React.ReactElement;
}) {
  if (!enabled) return children;
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function AdminSidebar({
  user,
  collapsed,
  onToggle,
  onNavigate,
  onReset,
  onShortcuts,
  onSignOut,
}: {
  user: AdminUser;
  collapsed: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
  onReset: () => void;
  onShortcuts: () => void;
  onSignOut: () => void;
}) {
  const { newTours, unread } = useAdminCounts();
  const counts: Partial<Record<AdminNavKey, { n: number; label: string }>> = {
    tours: { n: newTours, label: copy.newLabel(newTours) },
    messages: { n: unread, label: copy.unreadLabel(unread) },
  };

  return (
    <div className="flex h-full flex-col">
      {/* Wordmark */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-border",
          collapsed ? "justify-center px-2" : "justify-between px-4",
        )}
      >
        {!collapsed && (
          <span className="flex items-center gap-2">
            <LogoMark aria-hidden="true" className="size-6" />
            <span className="font-semibold tracking-tight">{copy.brand}</span>
            <span className="admin-meta">{copy.brandMeta}</span>
          </span>
        )}
        {onToggle && (
          <WithTooltip label={copy.expand} enabled={collapsed}>
            <button
              type="button"
              onClick={onToggle}
              aria-label={collapsed ? copy.expand : copy.collapse}
              aria-keyshortcuts="Meta+B"
              className="admin-focus flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon icon={SidebarLeft01Icon} />
            </button>
          </WithTooltip>
        )}
      </div>

      {/* Navigation */}
      <nav aria-label={copy.navLabel} className="flex-1 overflow-y-auto p-2">
        <ul className="flex flex-col gap-0.5">
          {copy.nav.map((item) => {
            const count = counts[item.key];
            return (
              <li key={item.key}>
                <WithTooltip label={item.label} enabled={collapsed}>
                  <NavLink
                    to={item.to}
                    end={item.key === "overview"}
                    onClick={onNavigate}
                    aria-label={
                      collapsed && count?.n
                        ? `${item.label}, ${count.label}`
                        : undefined
                    }
                    className={({ isActive }) =>
                      cn(
                        "admin-focus relative flex h-9 items-center gap-3 rounded-lg text-sm transition-colors",
                        collapsed ? "justify-center" : "px-3",
                        isActive
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-subtle hover:text-foreground",
                      )
                    }
                  >
                    <Icon icon={icons[item.key]} />
                    {!collapsed && <span className="flex-1">{item.label}</span>}
                    {count && count.n > 0 && (
                      <span
                        className={cn(
                          "flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums",
                          collapsed && "absolute top-1.5 right-1.5",
                        )}
                      >
                        {item.key === "messages" && (
                          <span
                            aria-hidden="true"
                            className="size-1.5 rounded-full bg-attention"
                          />
                        )}
                        {!collapsed && (
                          <>
                            <span aria-hidden="true">{count.n}</span>
                            <span className="sr-only">{count.label}</span>
                          </>
                        )}
                      </span>
                    )}
                  </NavLink>
                </WithTooltip>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Website link and account */}
      <div className="flex flex-col gap-1 border-t border-border p-2">
        <WithTooltip label={copy.viewWebsite} enabled={collapsed}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className={cn(
              "admin-focus flex h-9 items-center gap-3 rounded-lg text-sm text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground",
              collapsed ? "justify-center" : "px-3",
            )}
          >
            <Icon icon={ArrowUpRight01Icon} />
            {!collapsed && copy.viewWebsite}
          </a>
        </WithTooltip>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={copy.userMenu}
            className={cn(
              "admin-focus flex h-12 w-full items-center gap-3 rounded-lg text-left transition-colors hover:bg-subtle",
              collapsed ? "justify-center" : "px-2",
            )}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background">
              {user.name[0]}
            </span>
            {!collapsed && (
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-sm font-medium">
                  {user.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {user.role}
                </span>
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onReset}>
                <Icon icon={Refresh01Icon} />
                {copy.resetDemo}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShortcuts}>
                <Icon icon={KeyboardIcon} />
                {copy.shortcuts}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onSignOut}>
                <Icon icon={Logout01Icon} />
                {copy.signOut}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default AdminSidebar;
