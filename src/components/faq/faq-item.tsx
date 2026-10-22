import { Add01Icon, Link01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { toast } from "@/components/ui/toast";
import { faqPage as copy, type FaqItem as FaqItemData } from "@/data/faq";
import { highlight } from "@/lib/highlight";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

// One question: a button that opens the answer, plus a copy-link button.
// The question's id doubles as the URL anchor, e.g. /faq#flood-zone.
function FaqItem({
  item,
  open,
  query,
  onToggle,
}: {
  item: FaqItemData;
  open: boolean;
  query: string;
  onToggle: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const buttonId = `${item.id}-question`;
  const panelId = `${item.id}-answer`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/faq#${item.id}`,
      );
      toast.add({ title: copy.linkCopied });
    } catch {
      toast.add({ title: copy.copyFailed, type: "error" });
    }
  }

  return (
    <div id={item.id} className="group scroll-mt-24 border-b border-border">
      <h3 className="flex items-start gap-2">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex flex-1 items-start justify-between gap-4 rounded-md py-5 text-left text-lg font-medium focus-ring"
        >
          <span>{highlight(item.q, query)}</span>
          <HugeiconsIcon
            icon={Add01Icon}
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            className={cn(
              "mt-1 shrink-0 transition-transform duration-300",
              open && "rotate-45",
            )}
          />
        </button>
        <button
          type="button"
          onClick={copyLink}
          aria-label={copy.copyLinkLabel(item.q)}
          title={copy.copyLink}
          className="mt-4 rounded-md p-1.5 text-muted-foreground transition-opacity focus-ring hover:bg-muted hover:text-foreground focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
        >
          <HugeiconsIcon
            icon={Link01Icon}
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-prose pb-5 leading-relaxed text-muted-foreground">
              {highlight(item.a, query)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FaqItem;
