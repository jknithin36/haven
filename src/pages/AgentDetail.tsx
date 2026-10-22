import { Call02Icon, Mail01Icon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion } from "motion/react";
import { Link, useParams } from "react-router";

import AgentContactForm from "@/components/agents/agent-contact-form";
import AgentPhoto from "@/components/agent-photo";
import ArrowLink from "@/components/arrow-link";
import ButtonLink from "@/components/button-link";
import DetailSection from "@/components/detail-section";
import NotFoundView from "@/components/not-found-view";
import PageMeta from "@/components/page-meta";
import PropertyCard from "@/components/property/property-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { firstName, type Agent } from "@/data/agents";
import { agentDetailPage as copy } from "@/data/pages";
import { reviews, reviewsSection, type Review } from "@/data/reviews";
import { fadeUpItem, revealList, revealOnView } from "@/lib/motion";
import { agentLd, breadcrumbLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import { useAgentBySlug } from "@/store/agents";
import { usePublicProperties } from "@/store/properties";

const CONTACT_FORM_ID = "contact-agent";
const MAX_REVIEWS = 3;

function AgentNotFound() {
  return (
    <NotFoundView
      metaTitle={copy.notFound.title}
      heading={copy.notFound.heading}
      text={copy.notFound.text}
    />
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-xl border border-border p-6">
      <div className="flex gap-1">
        {Array.from({ length: review.rating }, (_, i) => (
          <HugeiconsIcon
            key={i}
            icon={StarIcon}
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
            className="fill-current"
          />
        ))}
        <span className="sr-only">{reviewsSection.rating(review.rating)}</span>
      </div>
      <blockquote className="mt-4 flex-1 leading-relaxed">
        <p>“{review.quote}”</p>
      </blockquote>
      <figcaption className="mt-6">
        <p className="font-medium">{review.name}</p>
        <p className="text-sm text-muted-foreground">
          {reviewsSection.meta(review)}
        </p>
      </figcaption>
    </figure>
  );
}

function AgentView({ agent }: { agent: Agent }) {
  const reduceMotion = useReducedMotion();
  const name = firstName(agent);
  const listings = usePublicProperties().filter((p) => p.agentId === agent.id);
  const agentReviews = reviews
    .filter((r) => agent.areas.includes(r.city))
    .slice(0, MAX_REVIEWS);
  const tel = `tel:${agent.phone.replace(/[^\d+]/g, "")}`;

  const details = [
    { label: copy.details.specialties, items: agent.specialties },
    { label: copy.details.languages, items: agent.languages },
    { label: copy.details.credentials, items: agent.credentials },
    { label: copy.details.funFact, items: [agent.funFact] },
  ];

  return (
    <>
      <PageMeta
        title={copy.metaTitle(agent.name, agent.title)}
        description={agent.shortBio}
        type="profile"
        {...(agent.photo && { image: agent.photo, imageAlt: agent.photoAlt })}
        jsonLd={[
          agentLd(agent),
          breadcrumbLd([
            { name: copy.breadcrumbRoot, path: "/agents" },
            { name: agent.name, path: `/agents/${agent.slug}` },
          ]),
        ]}
      />

      <div className="page-container pt-8 pb-24 md:pb-32">
        <Breadcrumb aria-label={copy.breadcrumbLabel}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/agents" />}>
                {copy.breadcrumbRoot}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{agent.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Top: photo and summary */}
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <motion.div {...revealOnView(reduceMotion)}>
            <AgentPhoto
              agent={agent}
              eager
              className="aspect-4/5 rounded-2xl"
            />
          </motion.div>
          <motion.div {...revealOnView(reduceMotion, 0.1)}>
            <h1 className="type-display">{agent.name}</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {agent.title} · {agent.areas.join(", ")}
            </p>

            <dl
              aria-label={copy.stats.label}
              className="mt-8 grid grid-cols-3 gap-4"
            >
              {[
                { value: String(agent.years), label: copy.stats.years },
                { value: agent.stat.value, label: agent.stat.label },
                {
                  value: agent.rating.toFixed(1),
                  label: copy.stats.rating(agent.reviewCount),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col-reverse border-l border-border pl-4"
                >
                  <dt className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd className="type-stat">{stat.value}</dd>
                </div>
              ))}
            </dl>

            <figure className="mt-8 border-l-2 border-foreground pl-6">
              <blockquote className="type-quote">
                <p>“{agent.quote}”</p>
              </blockquote>
            </figure>

            <div className="mt-8 flex flex-wrap gap-2">
              <a
                href={tel}
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                <HugeiconsIcon
                  icon={Call02Icon}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  data-icon="inline-start"
                />
                {copy.call}
              </a>
              <a
                href={`mailto:${agent.email}`}
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                <HugeiconsIcon
                  icon={Mail01Icon}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  data-icon="inline-start"
                />
                {copy.email}
              </a>
              <ButtonLink to={`/contact?agent=${agent.slug}`}>
                {copy.scheduleCall}
              </ButtonLink>
            </div>
          </motion.div>
        </div>

        {/* Main column + sticky contact form */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="min-w-0">
            <DetailSection title={copy.sections.about}>
              <div className="flex max-w-prose flex-col gap-4 text-lg leading-relaxed">
                {agent.bio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </DetailSection>

            <DetailSection title={copy.sections.details}>
              <dl className="grid gap-8 sm:grid-cols-2">
                {details.map((detail) => (
                  <div key={detail.label}>
                    <dt className="type-title">{detail.label}</dt>
                    {detail.items.map((item) => (
                      <dd key={item} className="mt-2 text-muted-foreground">
                        {item}
                      </dd>
                    ))}
                  </div>
                ))}
              </dl>
            </DetailSection>

            <DetailSection title={copy.sections.listings(name)}>
              {listings.length > 0 ? (
                <motion.ul
                  {...revealList(reduceMotion)}
                  className="grid gap-x-8 gap-y-12 md:grid-cols-2"
                >
                  {listings.map((home) => (
                    <motion.li
                      key={home.id}
                      variants={reduceMotion ? undefined : fadeUpItem}
                    >
                      <PropertyCard property={home} />
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <div className="flex flex-col items-start gap-3">
                  <p className="text-muted-foreground">
                    {copy.noListings.text(name)}
                  </p>
                  <ArrowLink to="/properties">{copy.noListings.link}</ArrowLink>
                </div>
              )}
            </DetailSection>

            <DetailSection title={copy.sections.reviews}>
              {agentReviews.length > 0 ? (
                <ul
                  className={cn(
                    "grid gap-4",
                    agentReviews.length > 1 && "md:grid-cols-2",
                  )}
                >
                  {agentReviews.map((review) => (
                    <li key={review.id}>
                      <ReviewCard review={review} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">{copy.noReviews}</p>
              )}
            </DetailSection>
          </div>

          <aside className="self-start lg:sticky lg:top-6">
            <AgentContactForm agent={agent} id={CONTACT_FORM_ID} />
          </aside>
        </div>
      </div>
    </>
  );
}

function AgentDetail() {
  const { slug } = useParams();
  const agent = useAgentBySlug(slug);

  if (!agent) return <AgentNotFound />;

  return <AgentView key={agent.id} agent={agent} />;
}

export default AgentDetail;
