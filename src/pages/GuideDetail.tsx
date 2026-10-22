import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { Link, useParams } from "react-router";

import ArrowLink from "@/components/arrow-link";
import ArticleCard from "@/components/article-card";
import ButtonLink from "@/components/button-link";
import NotFoundView from "@/components/not-found-view";
import PageMeta from "@/components/page-meta";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { articles, type Article, type ArticleBlock } from "@/data/articles";
import { guideDetailPage as copy } from "@/data/pages";
import { formatDate } from "@/lib/format";
import { fadeUpItem, revealList, revealOnView } from "@/lib/motion";
import { articleLd, breadcrumbLd } from "@/lib/structured-data";

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mt-6 type-subheading">{block.text}</h2>;
    case "list":
      return (
        <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-muted-foreground">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "p":
      return <p>{block.text}</p>;
  }
}

function GuideView({ article }: { article: Article }) {
  const reduceMotion = useReducedMotion();
  const moreId = useId();
  const others = articles.filter((a) => a.id !== article.id);

  return (
    <>
      <PageMeta
        title={article.title}
        description={article.excerpt}
        type="article"
        image={article.image}
        imageAlt={article.imageAlt}
        jsonLd={[
          articleLd(article),
          breadcrumbLd([
            { name: copy.breadcrumbRoot, path: "/guides" },
            { name: article.title, path: `/guides/${article.slug}` },
          ]),
        ]}
      />

      <article className="page-container pt-8">
        <Breadcrumb aria-label={copy.breadcrumbLabel}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/guides" />}>
                {copy.breadcrumbRoot}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{article.category}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <motion.header
          {...revealOnView(reduceMotion)}
          className="mx-auto mt-12 max-w-3xl text-center"
        >
          <p className="text-sm text-muted-foreground">
            {article.category} ·{" "}
            <time dateTime={article.date}>{formatDate(article.date)}</time> ·{" "}
            {copy.readTime(article.readMinutes)}
          </p>
          <h1 className="mt-4 type-display">{article.title}</h1>
          <p className="mx-auto mt-6 max-w-measure text-lg text-pretty text-muted-foreground">
            {article.excerpt}
          </p>
        </motion.header>

        <div className="mt-12 aspect-4/3 overflow-hidden rounded-2xl bg-muted sm:aspect-21/9">
          <img
            src={article.image}
            alt={article.imageAlt}
            loading="eager"
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mx-auto mt-14 flex max-w-prose flex-col gap-5 text-lg leading-relaxed">
          {article.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        <div className="mx-auto mt-14 flex max-w-prose flex-col items-start gap-5 rounded-2xl bg-muted p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="type-title">{copy.help.heading}</p>
            <p className="mt-1 text-muted-foreground">{copy.help.text}</p>
          </div>
          <ButtonLink to={copy.help.button.to} className="shrink-0">
            {copy.help.button.label}
          </ButtonLink>
        </div>
      </article>

      <section
        aria-labelledby={moreId}
        className="page-container pt-24 pb-24 md:pb-32"
      >
        <div className="flex items-end justify-between gap-6">
          <h2 id={moreId} className="type-heading">
            {copy.more}
          </h2>
          <ArrowLink to="/guides" className="shrink-0">
            {copy.viewAll}
          </ArrowLink>
        </div>
        <motion.ul
          {...revealList(reduceMotion)}
          className="mt-10 grid gap-8 md:grid-cols-2"
        >
          {others.map((other) => (
            <motion.li
              key={other.id}
              variants={reduceMotion ? undefined : fadeUpItem}
            >
              <ArticleCard article={other} />
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </>
  );
}

function GuideDetail() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <NotFoundView
        metaTitle={copy.notFound.title}
        heading={copy.notFound.heading}
        text={copy.notFound.text}
      />
    );
  }

  return <GuideView key={article.id} article={article} />;
}

export default GuideDetail;
