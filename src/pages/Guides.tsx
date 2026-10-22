import { motion, useReducedMotion } from "motion/react";

import ArticleCard from "@/components/article-card";
import PageHeader from "@/components/page-header";
import PageMeta from "@/components/page-meta";
import { articles } from "@/data/articles";
import { guidesPage as copy } from "@/data/pages";
import { fadeUpItem, revealList } from "@/lib/motion";
import { itemListLd } from "@/lib/structured-data";

function Guides() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <PageMeta
        title={copy.meta.title}
        description={copy.meta.description}
        jsonLd={itemListLd(
          articles.map((a) => ({ name: a.title, path: `/guides/${a.slug}` })),
        )}
      />
      <PageHeader title={copy.heading} subtext={copy.subtext} />

      <div className="page-container pb-24 md:pb-32">
        <motion.ul
          {...revealList(reduceMotion)}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
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
      </div>
    </>
  );
}

export default Guides;
