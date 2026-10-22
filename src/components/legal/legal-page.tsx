import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useId, useRef } from "react";

import PageMeta from "@/components/page-meta";
import TocList from "@/components/toc-list";
import { Button } from "@/components/ui/button";
import { legalPage, type LegalDocument } from "@/data/legal";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

function TableOfContents({
  doc,
  active,
}: {
  doc: LegalDocument;
  active: string | null;
}) {
  return (
    <TocList
      items={doc.sections.map((section) => ({
        id: section.id,
        label: section.title,
      }))}
      active={active}
    />
  );
}

// Shared layout for the privacy policy and terms of use.
function LegalPage({ doc }: { doc: LegalDocument }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tocId = useId();
  const active = useActiveSection(doc.sections.map((s) => s.id));

  function backToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    headingRef.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <PageMeta title={doc.metaTitle} description={doc.description} />

      <div className="page-container pt-16 pb-24 md:pt-20 md:pb-32">
        <header>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="type-display outline-none"
          >
            {doc.title}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {legalPage.updated(doc.updated)}
          </p>
          <p className="mt-6 flex max-w-measure items-start gap-3 rounded-xl bg-muted p-4 text-sm">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              size={20}
              strokeWidth={1.5}
              aria-hidden="true"
              className="shrink-0"
            />
            {legalPage.notice}
          </p>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_3fr] lg:gap-16">
          {/* Phones and tablets: collapsible contents */}
          <details className="group rounded-xl border border-border lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-4 py-3 font-medium focus-ring [&::-webkit-details-marker]:hidden">
              {legalPage.contents}
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={18}
                strokeWidth={1.5}
                aria-hidden="true"
                className="transition-transform group-open:rotate-180"
              />
            </summary>
            <nav aria-label={legalPage.contents} className="px-2 pb-3">
              <TableOfContents doc={doc} active={active} />
            </nav>
          </details>

          {/* Desktop: sticky contents */}
          <nav
            aria-labelledby={tocId}
            className="hidden self-start lg:sticky lg:top-6 lg:block"
          >
            <p id={tocId} className="mb-3 type-eyebrow text-muted-foreground">
              {legalPage.contents}
            </p>
            <TableOfContents doc={doc} active={active} />
          </nav>

          <article className="max-w-[70ch] leading-relaxed">
            {doc.sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-heading`}
                className={cn(
                  "scroll-mt-6",
                  i > 0 && "mt-10 border-t border-border pt-10",
                )}
              >
                <h2 id={`${section.id}-heading`} className="type-subheading">
                  {section.title}
                </h2>
                <div className="mt-4 flex flex-col gap-4">
                  {section.body.map((block, j) =>
                    typeof block === "string" ? (
                      <p key={j}>{block}</p>
                    ) : (
                      <ul
                        key={j}
                        className="flex list-disc flex-col gap-2 pl-5 marker:text-muted-foreground"
                      >
                        {block.list.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ),
                  )}
                </div>
              </section>
            ))}

            <Button
              variant="outline"
              size="lg"
              className="mt-12"
              onClick={backToTop}
            >
              <HugeiconsIcon
                icon={ArrowUp01Icon}
                strokeWidth={1.5}
                aria-hidden="true"
                data-icon="inline-start"
              />
              {legalPage.backToTop}
            </Button>
          </article>
        </div>
      </div>
    </>
  );
}

export default LegalPage;
