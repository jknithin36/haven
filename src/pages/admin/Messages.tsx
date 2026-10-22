import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import AdminPageHeader from "@/components/admin/admin-page-header";
import ConfirmDialog from "@/components/admin/confirm-dialog";
import FilterMenu from "@/components/admin/filter-menu";
import MessageList from "@/components/admin/messages/message-list";
import MessagesSkeleton from "@/components/admin/messages/messages-skeleton";
import ReadingPane from "@/components/admin/messages/reading-pane";
import { useMediaQuery } from "@/components/admin/messages/use-media-query";
import SearchInput from "@/components/admin/search-input";
import PageMeta from "@/components/page-meta";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { adminCommon, statusLabels } from "@/data/admin";
import { messagesPage as copy } from "@/data/admin-messages";
import { useNow } from "@/hooks/use-now";
import { useSimulatedLoading } from "@/hooks/use-simulated-loading";
import { useUrlState } from "@/hooks/use-url-state";
import { EASE } from "@/lib/motion";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { useAgents } from "@/store/agents";
import {
  addMessageNote,
  markMessageRead,
  removeMessage,
  restoreMessage,
  setMessageArchived,
  useMessages,
  type Message,
  type MessageType,
} from "@/store/messages";

const PAGE_SIZE = 10;
const ALL = "all";
const NARROW = "(max-width: 1023px)";
const TABS = ["inbox", "unread", "archived"] as const;
type Tab = (typeof TABS)[number];

const MODAL = ":is([role=dialog],[role=alertdialog]):not([data-slot=toast])";

const DEFAULTS = { id: "", tab: "inbox", type: ALL, q: "" };

const inTab: Record<Tab, (m: Message) => boolean> = {
  inbox: (m) => !m.archived,
  unread: (m) => !m.archived && !m.read,
  archived: (m) => m.archived,
};

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return (
    !!el &&
    (el.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))
  );
}

function Messages() {
  const loading = useSimulatedLoading();
  const messages = useMessages();
  const agents = useAgents();
  const now = useNow().getTime();
  const reduceMotion = useReducedMotion();
  const narrow = useMediaQuery(NARROW);
  const { values, set } = useUrlState(DEFAULTS);
  const listId = useId();
  const paneRef = useRef<HTMLElement>(null);
  const autoRead = useRef("");
  const [toDelete, setToDelete] = useState<Message | null>(null);

  const tab: Tab = (TABS as readonly string[]).includes(values.tab)
    ? (values.tab as Tab)
    : "inbox";
  const selectedId = values.id;
  const selected = messages.find((m) => m.id === selectedId);

  const sorted = useMemo(
    () => [...messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [messages],
  );
  const counts = {
    inbox: messages.filter(inTab.inbox).length,
    unread: messages.filter(inTab.unread).length,
    archived: messages.filter(inTab.archived).length,
  };

  // In Unread, the open message stays listed after it's read, so the list
  // doesn't jump under the cursor.
  const keepOpen = (m: Message) =>
    tab === "unread" && m.id === selectedId && !m.archived;
  const folder = sorted.filter((m) => inTab[tab](m) || keepOpen(m));
  const q = values.q.trim().toLowerCase();
  const visible = folder.filter(
    (m) =>
      (values.type === ALL || m.type === values.type) &&
      (!q ||
        `${m.name} ${m.email} ${m.subject} ${m.message}`
          .toLowerCase()
          .includes(q)),
  );

  // "Load more" adds 10 at a time; it starts over when the list changes.
  const listKey = `${tab}|${values.type}|${q}`;
  const [more, setMore] = useState({ key: listKey, count: PAGE_SIZE });
  const baseCount = more.key === listKey ? more.count : PAGE_SIZE;
  const selectedIndex = visible.findIndex((m) => m.id === selectedId);
  const shownCount = Math.max(baseCount, selectedIndex + 1);
  const shown = visible.slice(0, shownCount);

  // Opening a message marks it read, once. Mark unread then sticks.
  useEffect(() => {
    if (!selectedId || autoRead.current === selectedId) return;
    autoRead.current = selectedId;
    if (messages.find((m) => m.id === selectedId)?.read === false) {
      markMessageRead(selectedId);
    }
  }, [selectedId, messages]);

  // On small screens the reading pane covers the list; move focus into it.
  useEffect(() => {
    if (narrow && selectedId) paneRef.current?.focus({ preventScroll: true });
  }, [narrow, selectedId]);

  function open(id: string) {
    set({ id });
  }

  // The message to show after this one leaves the list.
  function neighbor(id: string) {
    const i = visible.findIndex((m) => m.id === id);
    return visible[i + 1]?.id ?? visible[i - 1]?.id ?? "";
  }

  function move(step: 1 | -1) {
    if (visible.length === 0) return;
    const next =
      selectedIndex === -1
        ? 0
        : Math.min(visible.length - 1, Math.max(0, selectedIndex + step));
    if (next + 1 > shownCount) {
      setMore({ key: listKey, count: shownCount + PAGE_SIZE });
    }
    open(visible[next].id);
  }

  function toggleRead(m: Message) {
    markMessageRead(m.id, !m.read);
    notify(m.read ? copy.toasts.unread : copy.toasts.read);
  }

  function toggleArchive(m: Message) {
    const archived = !m.archived;
    const next = neighbor(m.id);
    setMessageArchived(m.id, archived);
    set({ id: next });
    notify(archived ? copy.toasts.archived : copy.toasts.unarchived, {
      undoLabel: copy.toasts.undo,
      undo: () => {
        setMessageArchived(m.id, !archived);
        set({ id: m.id });
      },
    });
  }

  function confirmDelete(m: Message) {
    const next = neighbor(m.id);
    const removed = removeMessage(m.id);
    set({ id: next });
    if (!removed) return;
    notify(copy.toasts.deleted, {
      undoLabel: copy.toasts.undo,
      undo: () => restoreMessage(removed),
    });
  }

  // J/K move, E archives, U marks unread, Escape closes on small screens.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      // Toasts use role="dialog" too, so skip them.
      if (document.querySelector(MODAL)) return;
      const key = e.key.toLowerCase();
      if (key === "j" || key === "k") {
        e.preventDefault();
        move(key === "j" ? 1 : -1);
      } else if (key === "e" && selected) {
        e.preventDefault();
        toggleArchive(selected);
      } else if (key === "u" && selected?.read) {
        e.preventDefault();
        toggleRead(selected);
      } else if (e.key === "Escape" && narrow && selectedId) {
        set({ id: "" });
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const typeOptions = [
    { value: ALL, label: copy.filters.any },
    ...(Object.keys(statusLabels.messageType) as MessageType[]).map((t) => ({
      value: t,
      label: statusLabels.messageType[t],
    })),
  ];

  const pane = selectedId ? (
    <motion.section
      key={selectedId}
      ref={paneRef}
      tabIndex={-1}
      initial={
        reduceMotion ? false : narrow ? { x: 24, opacity: 0 } : { opacity: 0 }
      }
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: EASE }}
      className="bg-background outline-none max-lg:fixed max-lg:inset-x-0 max-lg:top-14 max-lg:bottom-0 max-lg:z-10 max-lg:overflow-y-auto lg:min-w-0 lg:flex-1 lg:overflow-y-auto"
    >
      {selected ? (
        <ReadingPane
          message={selected}
          agent={agents.find((a) => a.id === selected.agentId)}
          now={now}
          onBack={() => set({ id: "" })}
          onToggleRead={() => toggleRead(selected)}
          onToggleArchive={() => toggleArchive(selected)}
          onDelete={() => setToDelete(selected)}
          onAddNote={(text) => {
            addMessageNote(selected.id, text);
            notify(copy.toasts.note);
          }}
        />
      ) : (
        <div className="flex flex-col items-start gap-4 px-4 py-10 lg:px-10">
          <p className="text-muted-foreground">{copy.notFound}</p>
          <Button variant="outline" onClick={() => set({ id: "" })}>
            {copy.back}
          </Button>
        </div>
      )}
    </motion.section>
  ) : (
    <div className="hidden flex-1 items-center justify-center lg:flex">
      <p className="text-faint">{copy.select}</p>
    </div>
  );

  return (
    <>
      <PageMeta title={copy.meta.title} noindex />
      <AdminPageHeader
        title={copy.title}
        count={loading ? undefined : copy.count(counts.unread)}
      />

      {loading ? (
        <MessagesSkeleton />
      ) : (
        <div className="mt-6 border-y border-border lg:flex lg:h-[calc(100dvh-14rem)] lg:min-h-130">
          {/* List */}
          <div className="flex flex-col lg:w-95 lg:shrink-0 lg:border-r lg:border-border">
            <div
              role="tablist"
              aria-label={copy.tabsLabel}
              className="flex gap-5 border-b border-border px-4"
            >
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  aria-controls={listId}
                  onClick={() => set({ tab: t })}
                  className={cn(
                    "admin-focus -mb-px flex h-11 items-center gap-1.5 border-b-2 text-sm transition-colors",
                    tab === t
                      ? "border-foreground font-medium text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {copy.tabs[t]}
                  <span className="text-xs text-faint tabular-nums">
                    {counts[t]}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-2 border-b border-border p-3">
              <SearchInput
                label={copy.search}
                value={values.q}
                onChange={(v) => set({ q: v })}
                className="min-w-0 flex-1"
              />
              <FilterMenu
                label={copy.filters.type}
                value={values.type}
                options={typeOptions}
                onChange={(type) => set({ type })}
              />
            </div>

            <div
              role="tabpanel"
              className="min-h-0 flex-1 lg:overflow-y-auto"
              aria-live="polite"
            >
              {folder.length === 0 ? (
                <p className="px-4 py-16 text-center text-muted-foreground">
                  {copy.empty[tab]}
                </p>
              ) : visible.length === 0 ? (
                <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
                  <p className="text-muted-foreground">{copy.noResults.text}</p>
                  <Button
                    variant="outline"
                    onClick={() => set({ q: "", type: ALL })}
                  >
                    {copy.noResults.action}
                  </Button>
                </div>
              ) : (
                <>
                  <MessageList
                    id={listId}
                    messages={shown}
                    selectedId={selectedId}
                    now={now}
                    onOpen={open}
                  />
                  <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-faint">
                    <span className="tabular-nums">
                      {copy.showing(shown.length, visible.length)}
                    </span>
                    {shown.length < visible.length ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setMore({
                            key: listKey,
                            count: shownCount + PAGE_SIZE,
                          })
                        }
                      >
                        {copy.loadMore}
                      </Button>
                    ) : (
                      <span className="hidden items-center gap-1.5 lg:flex">
                        <KbdGroup>
                          <Kbd>J</Kbd>
                          <Kbd>K</Kbd>
                        </KbdGroup>
                        {copy.keyHint}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Reading pane */}
          {pane}
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(o) => !o && setToDelete(null)}
        title={copy.deleteDialog.title}
        text={copy.deleteDialog.text}
        confirm={copy.deleteDialog.confirm}
        cancel={adminCommon.cancel}
        onConfirm={() => toDelete && confirmDelete(toDelete)}
      />
    </>
  );
}

export default Messages;
