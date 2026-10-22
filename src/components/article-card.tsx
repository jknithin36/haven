import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router";

import { articlesSection as copy, type Article } from "@/data/articles";
import { formatDate } from "@/lib/format";

// Guide card: date and category, title, "Read more", photo along the bottom.
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/guides/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background focus-ring"
    >
      <div className="flex flex-1 flex-col p-7">
        <div className="flex justify-between gap-4 text-sm text-muted-foreground">
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span>{article.category}</span>
        </div>
        <h3 className="mt-4 line-clamp-2 type-title">{article.title}</h3>
        <span className="mt-auto inline-flex items-center gap-1 pt-8 text-sm font-medium">
          {/* Underline grows from the left on hover. */}
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-size-[0%_1px] bg-bottom-left bg-no-repeat transition-[background-size] duration-300 group-hover:bg-size-[100%_1px]">
            {copy.readMore}
          </span>
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </span>
      </div>
      <div className="aspect-16/10 overflow-hidden bg-muted">
        <img
          src={article.image}
          alt={article.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
    </Link>
  );
}

export default ArticleCard;
