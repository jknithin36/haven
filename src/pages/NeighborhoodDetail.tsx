import {
  Briefcase01Icon,
  Car01Icon,
  Coffee02Icon,
  GolfHoleIcon,
  PaintBoardIcon,
  SailboatOffshoreIcon,
  BeachIcon,
  Tree06Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { Link, useParams } from "react-router";

import ArrowLink from "@/components/arrow-link";
import ButtonLink from "@/components/button-link";
import DetailSection from "@/components/detail-section";
import ExpandingImage from "@/components/expanding-image";
import AlertSignup from "@/components/neighborhoods/alert-signup";
import AreaStats from "@/components/neighborhoods/area-stats";
import NotFoundView from "@/components/not-found-view";
import PageMeta from "@/components/page-meta";
import PropertyCard from "@/components/property/property-card";
import AgentCard from "@/components/property-detail/agent-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  getNeighborhood,
  neighborhoods,
  type HighlightIcon,
  type Neighborhood,
} from "@/data/neighborhoods";
import { neighborhoodDetailPage as copy } from "@/data/pages";
import { toSlug } from "@/lib/filter-properties";
import { formatPrice } from "@/lib/format";
import { fadeUpItem, revealList, revealOnView } from "@/lib/motion";
import { breadcrumbLd } from "@/lib/structured-data";
import { useAgent } from "@/store/agents";
import { usePublicProperties } from "@/store/properties";

const highlightIcons = {
  beach: BeachIcon,
  food: Coffee02Icon,
  outdoors: Tree06Icon,
  transit: Car01Icon,
  culture: PaintBoardIcon,
  boating: SailboatOffshoreIcon,
  golf: GolfHoleIcon,
  work: Briefcase01Icon,
} satisfies Record<HighlightIcon, unknown>;

function NeighborhoodNotFound() {
  return (
    <NotFoundView
      metaTitle={copy.notFound.title}
      heading={copy.notFound.heading}
      text={copy.notFound.text}
    />
  );
}

function NotesAccordion({
  items,
}: {
  items: { title: string; text: string }[];
}) {
  return (
    <Accordion className="border-t border-border">
      {items.map((item) => (
        <AccordionItem key={item.title} value={item.title}>
          <AccordionTrigger className="py-4 text-base">
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="text-base leading-relaxed text-muted-foreground">
            {item.text}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function NeighborhoodView({ area }: { area: Neighborhood }) {
  const reduceMotion = useReducedMotion();
  const homesId = useId();
  const othersId = useId();
  const agent = useAgent(area.agentId);
  const homes = usePublicProperties().filter(
    (p) => toSlug(p.city) === area.slug,
  );
  const others = neighborhoods.filter((n) => n.slug !== area.slug);
  const firstName = agent?.name.split(" ")[0] ?? "";

  return (
    <>
      <PageMeta
        title={copy.metaTitle(area.name)}
        description={area.about[0] ?? area.tagline}
        image={area.heroImage}
        imageAlt={area.heroAlt}
        jsonLd={breadcrumbLd([
          { name: copy.breadcrumbRoot, path: "/neighborhoods" },
          { name: area.name, path: `/neighborhoods/${area.slug}` },
        ])}
      />

      <div className="page-container pt-8">
        <Breadcrumb aria-label={copy.breadcrumbLabel}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/neighborhoods" />}>
                {copy.breadcrumbRoot}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{area.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <motion.div {...revealOnView(reduceMotion)}>
          <h1 className="mt-6 type-display">{area.name}</h1>
          <p className="mt-3 text-xl text-muted-foreground">{area.tagline}</p>
        </motion.div>
      </div>

      <div className="mt-10">
        <ExpandingImage
          desktop={{ src: area.heroImage }}
          alt={area.heroAlt}
          className="h-[50vh] max-h-200 md:h-[70vh]"
        />
      </div>

      <div className="page-container pb-24 md:pb-32">
        <div className="mt-12">
          <AreaStats stats={area.stats} />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="min-w-0">
            <DetailSection title={copy.sections.about}>
              <div className="flex max-w-prose flex-col gap-4 text-lg leading-relaxed">
                {area.about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </DetailSection>

            <DetailSection title={copy.sections.highlights}>
              <ul className="grid gap-4 sm:grid-cols-2">
                {area.highlights.map((item) => (
                  <li key={item.title} className="rounded-xl bg-muted p-5">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-background">
                      <HugeiconsIcon
                        icon={highlightIcons[item.icon]}
                        size={20}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </span>
                    <h3 className="mt-4 type-title">{item.title}</h3>
                    <p className="mt-2 text-muted-foreground">{item.text}</p>
                  </li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection title={copy.sections.goodFor}>
              <ul className="flex flex-wrap gap-2">
                {area.goodFor.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border px-4 py-2"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </DetailSection>

            <DetailSection title={copy.sections.livingHere}>
              <NotesAccordion items={area.livingNotes} />
            </DetailSection>

            <DetailSection title={copy.sections.faqs}>
              <NotesAccordion
                items={area.faqs.map((faq) => ({ title: faq.q, text: faq.a }))}
              />
            </DetailSection>
          </div>

          <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-6">
            {agent && (
              <AgentCard
                agent={agent}
                label={copy.expert.label}
                areas={copy.expert.areas(agent.areas)}
              >
                <ButtonLink
                  to={`/contact?agent=${agent.slug}&area=${area.slug}`}
                  className="w-full"
                >
                  {copy.expert.ask(firstName, area.name)}
                </ButtonLink>
              </AgentCard>
            )}
            <nav
              aria-label={copy.quickLinks.label}
              className="flex flex-col gap-3 rounded-xl border border-border p-5"
            >
              <ArrowLink to={`/properties?location=${area.slug}&status=sale`}>
                {copy.quickLinks.sale(area.name)}
              </ArrowLink>
              <ArrowLink to={`/properties?location=${area.slug}&status=rent`}>
                {copy.quickLinks.rent(area.name)}
              </ArrowLink>
            </nav>
          </aside>
        </div>

        <section aria-labelledby={homesId} className="mt-20">
          <div className="flex items-end justify-between gap-6">
            <h2 id={homesId} className="type-heading">
              {copy.sections.homes(area.name)}
            </h2>
            {homes.length > 0 && (
              <ArrowLink
                to={`/properties?location=${area.slug}`}
                className="shrink-0"
              >
                {copy.sections.viewAll}
              </ArrowLink>
            )}
          </div>
          <div className="mt-10">
            {homes.length > 0 ? (
              <motion.ul
                {...revealList(reduceMotion)}
                className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
              >
                {homes.map((home) => (
                  <motion.li
                    key={home.id}
                    variants={reduceMotion ? undefined : fadeUpItem}
                  >
                    <PropertyCard property={home} />
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <AlertSignup />
            )}
          </div>
        </section>

        <section aria-labelledby={othersId} className="mt-20">
          <h2 id={othersId} className="type-heading">
            {copy.sections.others}
          </h2>
          <motion.ul
            {...revealList(reduceMotion)}
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4"
          >
            {others.map((other) => (
              <motion.li
                key={other.slug}
                variants={reduceMotion ? undefined : fadeUpItem}
              >
                <Link
                  to={`/neighborhoods/${other.slug}`}
                  className="group block rounded-xl focus-ring"
                >
                  <div className="aspect-16/10 overflow-hidden rounded-xl bg-muted">
                    <img
                      src={other.heroImage}
                      alt={other.heroAlt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <h3 className="mt-4 type-title">{other.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                    {copy.otherMedian(
                      formatPrice(other.stats.medianPrice, "sale"),
                    )}
                  </p>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </section>
      </div>
    </>
  );
}

function NeighborhoodDetail() {
  const { slug } = useParams();
  const area = getNeighborhood(slug);

  if (!area) return <NeighborhoodNotFound />;

  return <NeighborhoodView key={area.slug} area={area} />;
}

export default NeighborhoodDetail;
