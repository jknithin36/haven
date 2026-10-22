import {
  Add01Icon,
  Menu01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router";

import AdminSidebar from "@/components/admin/admin-sidebar";
import CommandPalette from "@/components/admin/command-palette";
import Icon from "@/components/admin/icon";
import ShortcutsDialog from "@/components/admin/shortcuts-dialog";
import ButtonLink from "@/components/button-link";
import ScrollToTop from "@/components/scroll-to-top";
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
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { adminLayout as copy } from "@/data/admin";
import { createLocalStore } from "@/lib/local-store";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { signOut, useAuthUser } from "@/store/auth";
import { resetDemoData } from "@/store/demo";
import { useAllProperties } from "@/store/properties";

const sidebarCollapsed = createLocalStore<boolean>(
  "haven-admin-sidebar-collapsed",
  false,
);

const GO_TO_KEYS: Record<string, string> = {
  o: "/admin",
  p: "/admin/properties",
  t: "/admin/tours",
  m: "/admin/messages",
  a: "/admin/agents",
};
const SEQUENCE_MS = 1000;

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return (
    !!el &&
    (el.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))
  );
}

// Breadcrumb from the URL: "Properties / The Seagrass House".
function useCrumbs() {
  const { pathname } = useLocation();
  const homes = useAllProperties();
  const [, , section, id, action] = pathname.split("/");
  const navItem = copy.nav.find((n) => n.to === `/admin/${section ?? ""}`);
  const crumbs: { label: string; to?: string }[] = [];
  if (!section) return [{ label: copy.nav[0].label }];
  if (navItem) crumbs.push({ label: navItem.label, to: navItem.to });
  if (section === "properties" && id === "new") {
    crumbs.push({ label: copy.newProperty });
  } else if (section === "properties" && id && action === "edit") {
    crumbs.push({ label: homes.find((h) => h.id === id)?.name ?? id });
  }
  return crumbs;
}

function AdminLayout() {
  const user = useAuthUser();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const collapsed = sidebarCollapsed.useValue();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [signedOut, setSignedOut] = useState(false);
  const goPending = useRef(0);
  const crumbs = useCrumbs();

  // Monochrome admin theme, also for dialogs and toasts rendered in portals.
  // Layout effect, so the first frame is already monochrome.
  useLayoutEffect(() => {
    document.documentElement.classList.add("admin-theme");
    return () => document.documentElement.classList.remove("admin-theme");
  }, []);

  // Keyboard shortcuts for the whole dashboard.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
        return;
      }
      if (mod && e.key.toLowerCase() === "b") {
        e.preventDefault();
        sidebarCollapsed.write(!sidebarCollapsed.read());
        return;
      }
      if (mod || e.altKey || isTyping(e.target)) return;
      // Toasts use role="dialog" too, so skip them when checking for overlays.
      const overlayOpen = document.querySelector(
        ":is([role=dialog],[role=alertdialog]):not([data-slot=toast])",
      );
      if (overlayOpen) return;

      const key = e.key.toLowerCase();
      if (goPending.current && GO_TO_KEYS[key]) {
        e.preventDefault();
        goPending.current = 0;
        navigate(GO_TO_KEYS[key]);
        return;
      }
      if (key === "g") {
        goPending.current = window.setTimeout(() => {
          goPending.current = 0;
        }, SEQUENCE_MS);
        return;
      }
      if (e.key === "?") {
        e.preventDefault();
        setShortcutsOpen(true);
      } else if (e.key === "/") {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (key === "n") {
        e.preventDefault();
        navigate("/admin/properties/new");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate]);

  // Not signed in: go to the login page and come back here afterwards. After
  // choosing Sign out, go to the plain login page instead.
  if (!user) {
    const back = encodeURIComponent(`${pathname}${search}`);
    const to = signedOut ? "/admin/login" : `/admin/login?redirect=${back}`;
    return <Navigate to={to} replace />;
  }

  function handleSignOut() {
    setSignedOut(true);
    signOut();
  }

  function handleReset() {
    resetDemoData();
    setResetOpen(false);
    notify(copy.resetDone);
  }

  const sidebarProps = {
    user,
    onReset: () => setResetOpen(true),
    onShortcuts: () => setShortcutsOpen(true),
    onSignOut: handleSignOut,
  };

  return (
    <div className="flex min-h-screen bg-background text-sm text-foreground">
      <ScrollToTop />

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-border transition-[width] duration-200 ease-out motion-reduce:transition-none lg:block",
          collapsed ? "w-16" : "w-62",
        )}
      >
        <AdminSidebar
          {...sidebarProps}
          collapsed={collapsed}
          onToggle={() => sidebarCollapsed.write(!collapsed)}
        />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-72 p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">{copy.navLabel}</SheetTitle>
          <AdminSidebar
            {...sidebarProps}
            collapsed={false}
            onNavigate={() => setDrawerOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm lg:px-8">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={copy.openMenu}
            className="admin-focus -ml-1 flex size-9 items-center justify-center rounded-lg hover:bg-muted lg:hidden"
          >
            <Icon icon={Menu01Icon} />
          </button>

          <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
            <ol className="flex items-center gap-2 truncate">
              {crumbs.map((crumb, i) => (
                <li
                  key={crumb.label}
                  className="flex min-w-0 items-center gap-2"
                >
                  {i > 0 && (
                    <span aria-hidden="true" className="text-faint">
                      /
                    </span>
                  )}
                  {crumb.to && i < crumbs.length - 1 ? (
                    <Link
                      to={crumb.to}
                      className="admin-focus rounded-sm text-muted-foreground hover:text-foreground"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="truncate font-medium">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            aria-keyshortcuts="Meta+K"
            className="admin-focus hidden h-9 w-72 items-center gap-2 rounded-[10px] border border-border px-3 text-muted-foreground transition-colors hover:bg-subtle md:flex"
          >
            <Icon icon={Search01Icon} size={16} />
            <span className="flex-1 truncate text-left">{copy.search}</span>
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </button>
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            aria-label={copy.search}
            className="admin-focus flex size-9 items-center justify-center rounded-lg hover:bg-muted md:hidden"
          >
            <Icon icon={Search01Icon} />
          </button>

          <ButtonLink
            to="/admin/properties/new"
            size="default"
            className="h-9 rounded-[10px]"
          >
            <Icon icon={Add01Icon} size={16} />
            <span className="hidden sm:inline">{copy.newProperty}</span>
          </ButtonLink>
        </header>

        <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-8 lg:px-8">
          <Outlet />
        </main>

        <footer className="mx-auto w-full max-w-[1280px] px-4 pb-6 text-xs text-faint lg:px-8">
          {copy.footer}
        </footer>
      </div>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onReset={() => setResetOpen(true)}
      />
      <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.resetConfirm.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {copy.resetConfirm.text}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{copy.resetConfirm.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>
              {copy.resetConfirm.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminLayout;
