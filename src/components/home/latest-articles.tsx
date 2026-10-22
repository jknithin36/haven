import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";

import ArticleCard from "@/components/article-card";
import ArrowLink from "@/components/arrow-link";
import SectionHeader from "@/components/section-header";
import { articles, articlesSection as copy } from "@/data/articles";
import { fadeUpItem, revealList } from "@/lib/motion";

function LatestArticles() {
  const headingId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <section aria-labelledby={headingId} className="section-y">
      <div className="page-container">
        <SectionHeader
          id={headingId}
          label={copy.label}
          heading={copy.heading}
          action={
            <ArrowLink
              to={copy.viewAll.to}
              className="hidden shrink-0 md:inline-flex"
            >
              {copy.viewAll.label}
            </ArrowLink>
          }
        />

        <motion.ul
          {...revealList(reduceMotion)}
          className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {articles.map((article) => (
            <motion.li
              key={article.id}
              variants={reduceMotion ? undefined : fadeUpItem}
            >
              <ArticleCard article={article} />
            </motion.li>
          ))}
        </motion.ul>

        <ArrowLink to={copy.viewAll.to} className="mt-10 md:hidden">
          {copy.viewAll.label}
        </ArrowLink>
      </div>
    </section>
  );
}

export default LatestArticles;
