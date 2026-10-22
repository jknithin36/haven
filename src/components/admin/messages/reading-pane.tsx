import {
  ArchiveIcon,
  ArrowLeft01Icon,
  Delete02Icon,
  MailOpen01Icon,
  Mail01Icon,
  MailReply01Icon,
  InboxIcon,
} from "@hugeicons/core-free-icons";
import type { HugeiconsIconProps } from "@hugeicons/react";
import { useId, type ReactNode } from "react";
import { Link } from "react-router";

import AgentAvatar from "@/components/admin/agent-avatar";
import CopyButton from "@/components/admin/copy-button";
import Icon from "@/components/admin/icon";
import NotesPanel from "@/components/admin/notes-panel";
import { Kbd } from "@/components/ui/kbd";
import { statusLabels } from "@/data/admin";
import { messagesPage as copy } from "@/data/admin-messages";
import type { Agent } from "@/data/agents";
import { formatDateTime, relativeTime } from "@/lib/admin-format";
import { cn } from "@/lib/utils";
import type { Message } from "@/store/messages";

const actionClass =
  "admin-focus inline-flex h-9 items-center gap-2 rounded-[10px] px-3 whitespace-nowrap text-sm transition-colors hover:bg-muted";

function ActionButton({
  icon,
  label,
  shortcut,
  onClick,
}: {
  icon: HugeiconsIconProps["icon"];
  label: string;
  shortcut?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-keyshortcuts={shortcut}
      className={actionClass}
    >
      <Icon icon={icon} size={16} />
      <span className="max-sm:sr-only">{label}</span>
      {shortcut && <Kbd className="max-md:hidden">{shortcut}</Kbd>}
    </button>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-9 items-center gap-4 border-b border-border py-1.5">
      <dt className="w-20 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="flex min-w-0 flex-1 items-center gap-1">{children}</dd>
    </div>
  );
}

// The open message: actions, sender details, the message, and notes.
function ReadingPane({
  message,
  agent,
  now,
  onBack,
  onToggleRead,
  onToggleArchive,
  onDelete,
  onAddNote,
}: {
  message: Message;
  agent?: Agent;
  now: number;
  onBack: () => void;
  onToggleRead: () => void;
  onToggleArchive: () => void;
  onDelete: () => void;
  onAddNote: (text: string) => void;
}) {
  const headingId = useId();
  const a = copy.actions;
  const r = copy.reading;
  const replyHref = `mailto:${message.email}?subject=${encodeURIComponent(
    a.replySubject(message.subject),
  )}`;

  return (
    <article aria-labelledby={headingId} className="flex flex-col">
      {/* Actions */}
      <div
        role="toolbar"
        aria-label={a.label}
        className="sticky top-0 z-[1] flex items-center gap-1 border-b border-border bg-background px-2 py-2 lg:px-6"
      >
        <button
          type="button"
          onClick={onBack}
          aria-label={copy.back}
          className={cn(actionClass, "px-2 lg:hidden")}
        >
          <Icon icon={ArrowLeft01Icon} />
        </button>
        <a href={replyHref} className={actionClass}>
          <Icon icon={MailReply01Icon} size={16} />
          <span className="max-sm:sr-only">{a.reply}</span>
        </a>
        <ActionButton
          icon={message.read ? Mail01Icon : MailOpen01Icon}
          label={message.read ? a.markUnread : a.markRead}
          shortcut={message.read ? "U" : undefined}
          onClick={onToggleRead}
        />
        <ActionButton
          icon={message.archived ? InboxIcon : ArchiveIcon}
          label={message.archived ? a.unarchive : a.archive}
          shortcut="E"
          onClick={onToggleArchive}
        />
        <span className="flex-1" />
        <ActionButton icon={Delete02Icon} label={a.delete} onClick={onDelete} />
      </div>

      <div className="px-4 py-8 lg:px-10">
        <div className="max-w-[65ch]">
          <p className="admin-meta">{statusLabels.messageType[message.type]}</p>
          <h2
            id={headingId}
            className="mt-2 text-xl leading-snug font-semibold tracking-tight"
          >
            {message.subject}
          </h2>

          <dl className="mt-6 border-t border-border">
            <Detail label={r.from}>
              <span className="font-medium">{message.name}</span>
            </Detail>
            <Detail label={r.email}>
              <a
                href={`mailto:${message.email}`}
                className="admin-focus truncate rounded-sm underline-offset-4 hover:underline"
              >
                {message.email}
              </a>
              <CopyButton value={message.email} what={r.email.toLowerCase()} />
            </Detail>
            {message.phone && (
              <Detail label={r.phone}>
                <a
                  href={`tel:${message.phone.replace(/[^\d+]/g, "")}`}
                  className="admin-focus rounded-sm tabular-nums underline-offset-4 hover:underline"
                >
                  {message.phone}
                </a>
                <CopyButton
                  value={message.phone}
                  what={r.phone.toLowerCase()}
                />
              </Detail>
            )}
            {agent && (
              <Detail label={r.agent}>
                <Link
                  to={`/admin/agents?edit=${agent.id}`}
                  className="admin-focus inline-flex items-center gap-2 rounded-sm underline-offset-4 hover:underline"
                >
                  <AgentAvatar agent={agent} />
                  {agent.name}
                </Link>
              </Detail>
            )}
            {message.area && <Detail label={r.area}>{message.area}</Detail>}
            <Detail label={r.received}>
              <span className="tabular-nums">
                {formatDateTime(message.createdAt)}
              </span>
              <span className="ml-2 text-faint">
                {relativeTime(message.createdAt, now)}
              </span>
            </Detail>
          </dl>

          <p className="mt-8 text-[15px] leading-relaxed whitespace-pre-line">
            {message.message}
          </p>

          <div className="mt-12 border-t border-border pt-8">
            <NotesPanel notes={message.notes} onAdd={onAddNote} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default ReadingPane;
