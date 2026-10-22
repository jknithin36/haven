import {
  Agreement01Icon,
  CheckmarkBadge01Icon,
  Clock01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion } from "motion/react";
import { useId, type ReactNode } from "react";

import Milestones from "@/components/about/milestones";
import ProcessTabs from "@/components/about/process-tabs";
import TeamPreview from "@/components/about/team-preview";
import ArrowLink from "@/components/arrow-link";
import CountUp from "@/components/count-up";
import ExpandingImage from "@/components/expanding-image";
import PageMeta from "@/components/page-meta";
import ReviewQuote from "@/components/review-quote";
import SectionHeader from "@/components/section-header";
import { aboutPage as copy, type ValueIcon } from "@/data/about-page";
import { reviews } from "@/data/reviews";
import { fadeUpItem, revealList, revealOnView } from "@/lib/motion";
import { useAgents } from "@/store/agents";

const valueIcons = {
  honesty: CheckmarkBadge01Icon,
  local: Location01Icon,
  calm: Clock01Icon,
  after: Agreement01Icon,
} satisfies Record<ValueIcon, unknown>;

// A home section with the shared header and a fade-up on scroll.
function Section({
  label,
  heading,
  children,
  action,
}: {
  label: string;
  heading: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  const headingId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <section aria-labelledby={headingId} className="section-y">
      <div className="page-container">
        <motion.div {...revealOnView(reduceMotion)}>
          <SectionHeader
            id={headingId}
            label={label}
            heading={heading}
            action={action}
          />
        </motion.div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function About() {
  const agents = useAgents();
  const reduceMotion = useReducedMotion();
  const heroId = useId();
  const storyId = useId();
  const statsId = useId();
  const review = reviews.find((r) => r.id === copy.review.reviewId);

  return (
    <>
      <PageMeta
        fullTitle={copy.meta.title}
        description={copy.meta.description}
      />

      {/* Hero */}
      <section aria-labelledby={heroId}>
        {/* Headline left, short supporting line right (like the home hero) */}
        <motion.div
          {...revealOnView(reduceMotion)}
          className="page-container flex flex-col gap-6 pt-16 md:pt-20 lg:flex-row lg:items-end lg:justify-between lg:gap-16"
        >
          <h1 id={heroId} className="max-w-[14ch] type-display">
            {copy.hero.heading}
          </h1>
          <p className="max-w-[32ch] text-lg text-pretty text-muted-foreground lg:text-right">
            {copy.hero.text}
          </p>
        </motion.div>
        <div className="mt-12">
          <ExpandingImage
            desktop={{ src: copy.hero.image }}
            alt={copy.hero.imageAlt}
            className="h-[50vh] max-h-200 md:h-[70vh]"
          />
        </div>
      </section>

      {/* Story */}
      <section aria-labelledby={storyId} className="section-y">
        <div className="page-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            {...revealOnView(reduceMotion)}
            className="aspect-6/7 overflow-hidden rounded-2xl bg-muted"
          >
            <img
              src={copy.story.image}
              alt={copy.story.imageAlt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <motion.div {...revealOnView(reduceMotion, 0.1)}>
            <SectionHeader
              id={storyId}
              label={copy.story.label}
              heading={copy.story.heading}
            />
            <div className="mt-6 flex flex-col gap-4 text-lg leading-relaxed">
              {copy.story.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <figure className="mt-10 border-l-2 border-foreground pl-6">
              <blockquote className="type-quote">
                <p>“{copy.story.quote}”</p>
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {copy.story.quoteName}
                </span>{" "}
                · {copy.story.quoteRole}
              </figcaption>
            </figure>
          </motion.div>
        </div>
      </section>

      {/* Stats band */}
      <section aria-labelledby={statsId} className="bg-muted py-16 md:py-20">
        <h2 id={statsId} className="sr-only">
          {copy.stats.label}
        </h2>
        <dl className="page-container grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {copy.stats.items.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse border-l border-border pl-6"
            >
              <dt className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="type-stat">
                <CountUp
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Values */}
      <Section label={copy.values.label} heading={copy.values.heading}>
        <motion.ul
          {...revealList(reduceMotion)}
          className="grid gap-6 md:grid-cols-2"
        >
          {copy.values.items.map((value) => (
            <motion.li
              key={value.title}
              variants={reduceMotion ? undefined : fadeUpItem}
              className="rounded-2xl border border-border p-8"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <HugeiconsIcon
                  icon={valueIcons[value.icon]}
                  size={24}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>
              <h3 className="mt-6 type-title">{value.title}</h3>
              <p className="mt-2 max-w-measure text-muted-foreground">
                {value.text}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </Section>

      {/* Process */}
      <Section label={copy.process.label} heading={copy.process.heading}>
        <ProcessTabs />
      </Section>

      {/* Milestones */}
      <Section label={copy.milestones.label} heading={copy.milestones.heading}>
        <Milestones />
      </Section>

      {/* Team */}
      <Section
        label={copy.team.label}
        heading={copy.team.heading}
        action={
          <ArrowLink
            to={copy.team.cta.to}
            className="hidden shrink-0 md:inline-flex"
          >
            {copy.team.cta.label}
          </ArrowLink>
        }
      >
        <TeamPreview agents={agents} />
        <ArrowLink to={copy.team.cta.to} className="mt-10 md:hidden">
          {copy.team.cta.label}
        </ArrowLink>
      </Section>

      {/* Featured review */}
      {review && (
        <Section label={copy.review.label} heading={copy.review.heading}>
          <motion.div
            {...revealOnView(reduceMotion)}
            className="grid items-center gap-8 md:grid-cols-[7fr_5fr] md:gap-14"
          >
            <div className="aspect-4/3 overflow-hidden rounded-2xl bg-muted md:aspect-5/6">
              <img
                src={review.photo}
                alt={review.photoAlt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <figure>
              <ReviewQuote review={review} />
            </figure>
          </motion.div>
        </Section>
      )}
    </>
  );
}

export default About;
