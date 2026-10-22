import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useId, useMemo, useState } from "react";
import { Link } from "react-router";

import ButtonLink from "@/components/button-link";
import FaqItem from "@/components/faq/faq-item";
import PageHeader from "@/components/page-header";
import PageMeta from "@/components/page-meta";
import TocList from "@/components/toc-list";
import { buttonVariants } from "@/components/ui/button";
import { faqCategories, faqPage as copy } from "@/data/faq";
import { useActiveSection } from "@/hooks/use-active-section";
import { faqLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

function openFromHash(): Record<string, string | null> {
  const id = window.location.hash.slice(1);
  const category = faqCategories.find((c) =>
    c.items.some((item) => item.id === id),
  );
  return category ? { [category.id]: id } : {};
}

function categoryAnchor(id: string) {
  return `faq-${id}`;
}

function Faq() {
  const searchId = useId();
  const [query, setQuery] = useState("");
  // One open question per category, keyed by category id. A link like
  // /faq#flood-zone opens that question on first render.
  const [open, setOpen] = useState<Record<string, string | null>>(openFromHash);

  const term = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      faqCategories
        .map((category) => ({
          ...category,
          items: term
            ? category.items.filter(
                (item) =>
                  item.q.toLowerCase().includes(term) ||
                  item.a.toLowerCase().includes(term),
              )
            : category.items,
        }))
        .filter((category) => category.items.length > 0),
    [term],
  );
  const matchCount = visible.reduce((sum, c) => sum + c.items.length, 0);
  const active = useActiveSection(visible.map((c) => categoryAnchor(c.id)));

  // Scroll to the question named in the URL once it has rendered, and handle
  // hash changes while already on the page (e.g. a link to /faq#pets).
  useEffect(() => {
    function scrollToHash() {
      const id = window.location.hash.slice(1);
      if (!id) return;
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView({ block: "start" }),
      );
    }
    function onHashChange() {
      setOpen((prev) => ({ ...prev, ...openFromHash() }));
      scrollToHash();
    }
    scrollToHash();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function toggle(categoryId: string, itemId: string) {
    setOpen((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId] === itemId ? null : itemId,
    }));
  }

  return (
    <>
      <PageMeta
        title={copy.meta.title}
        description={copy.meta.description}
        jsonLd={faqLd(faqCategories)}
      />

      <PageHeader title={copy.heading} subtext={copy.subtext} />

      <div className="page-container pb-24 md:pb-32">
        <div role="search" className="relative max-w-120">
          <label htmlFor={searchId} className="sr-only">
            {copy.search.label}
          </label>
          <HugeiconsIcon
            icon={Search01Icon}
            size={18}
            strokeWidth={1.5}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.search.placeholder}
            className="h-12 w-full rounded-lg border border-border bg-background pr-11 pl-10 outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={copy.search.clear}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground focus-ring hover:text-foreground"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={16}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
        <p aria-live="polite" className="sr-only">
          {term ? copy.search.results(matchCount) : ""}
        </p>

        {/* Phones and tablets: category chips */}
        {visible.length > 0 && (
          <nav
            aria-label={copy.categoriesLabel}
            className="-mx-6 mt-8 overflow-x-auto px-6 lg:hidden"
          >
            <ul className="flex gap-2">
              {visible.map((category) => (
                <li key={category.id} className="shrink-0">
                  <a
                    href={`#${categoryAnchor(category.id)}`}
                    className="flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm whitespace-nowrap focus-ring hover:bg-muted"
                  >
                    {category.title}
                    <span className="text-muted-foreground tabular-nums">
                      {category.items.length}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_3fr] lg:gap-16">
          {/* Desktop: sticky category list */}
          <nav
            aria-label={copy.categoriesLabel}
            className="hidden self-start lg:sticky lg:top-6 lg:block"
          >
            <TocList
              items={visible.map((category) => ({
                id: categoryAnchor(category.id),
                label: category.title,
                count: category.items.length,
              }))}
              active={active}
            />
          </nav>

          <div className="min-w-0">
            {visible.length === 0 ? (
              <p className="rounded-xl bg-muted p-8 text-center text-muted-foreground">
                {copy.search.empty}{" "}
                <Link
                  to={copy.bottom.contact.to}
                  className="rounded-sm font-medium text-foreground underline underline-offset-4 focus-ring"
                >
                  {copy.search.emptyLink}
                </Link>
                .
              </p>
            ) : (
              visible.map((category, i) => (
                <section
                  key={category.id}
                  id={categoryAnchor(category.id)}
                  aria-labelledby={`${categoryAnchor(category.id)}-heading`}
                  className={cn("scroll-mt-6", i > 0 && "mt-14")}
                >
                  <h2
                    id={`${categoryAnchor(category.id)}-heading`}
                    className="type-subheading"
                  >
                    {category.title}
                  </h2>
                  <div className="mt-4 border-t border-border">
                    {category.items.map((item) => (
                      <FaqItem
                        key={item.id}
                        item={item}
                        query={query}
                        open={open[category.id] === item.id}
                        onToggle={() => toggle(category.id, item.id)}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}

            <section className="mt-16 flex flex-col items-start gap-6 rounded-2xl bg-muted p-8 md:flex-row md:items-center md:justify-between md:p-10">
              <div>
                <h2 className="type-subheading">{copy.bottom.heading}</h2>
                <p className="mt-2 text-muted-foreground">{copy.bottom.text}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ButtonLink to={copy.bottom.contact.to}>
                  {copy.bottom.contact.label}
                </ButtonLink>
                <a
                  href={`tel:${copy.bottom.call.phone}`}
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  {copy.bottom.call.label}
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default Faq;
