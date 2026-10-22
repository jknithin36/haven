import {
  motion,
  useInView,
  useReducedMotion,
  type MotionProps,
} from "motion/react";
import { useId, useRef, useState } from "react";
import { useParams } from "react-router";

import ArrowLink from "@/components/arrow-link";
import NotFoundView from "@/components/not-found-view";
import PageMeta from "@/components/page-meta";
import PropertyCard from "@/components/property/property-card";
import AgentCard from "@/components/property-detail/agent-card";
import DetailHeader from "@/components/property-detail/detail-header";
import DetailSection from "@/components/detail-section";
import DetailTopBar from "@/components/property-detail/detail-top-bar";
import FeaturesList from "@/components/property-detail/features-list";
import KeyDetails from "@/components/property-detail/key-details";
import LocationSection from "@/components/property-detail/location-section";
import MobileTourBar from "@/components/property-detail/mobile-tour-bar";
import MortgageBanner from "@/components/property-detail/mortgage-banner";
import MoveInCosts from "@/components/property-detail/move-in-costs";
import NearbyCard from "@/components/property-detail/nearby-card";
import TourDialog from "@/components/property-detail/tour-dialog";
import { Button } from "@/components/ui/button";
import TourIcon from "@/components/tour-icon";
import { propertyDetailPage as copy } from "@/data/pages";
import type { Property } from "@/data/properties";
import { formatPrice } from "@/lib/format";
import { DURATION, EASE, fadeUpItem, revealList } from "@/lib/motion";
import { breadcrumbLd, propertyLd } from "@/lib/structured-data";
import { useAgent } from "@/store/agents";
import { usePublicProperties, usePublicProperty } from "@/store/properties";

const SIMILAR_COUNT = 3;

// Same city scores highest, then same type. Ties keep the newest first.
function similarHomes(property: Property, homes: Property[]) {
  return homes
    .filter((p) => p.id !== property.id)
    .map((p) => ({
      home: p,
      score:
        (p.city === property.city ? 2 : 0) + (p.type === property.type ? 1 : 0),
    }))
    .sort(
      (a, b) =>
        b.score - a.score || b.home.listedAt.localeCompare(a.home.listedAt),
    )
    .slice(0, SIMILAR_COUNT)
    .map(({ home }) => home);
}

function HomeNotFound() {
  return (
    <NotFoundView
      metaTitle={copy.notFound.title}
      heading={copy.notFound.heading}
      text={copy.notFound.text}
    />
  );
}

function PropertyDetailView({ property }: { property: Property }) {
  const reduceMotion = useReducedMotion();
  const similarId = useId();
  const agent = useAgent(property.agentId);
  const homes = usePublicProperties();
  const price = formatPrice(property.price, property.priceType);

  const [tourOpen, setTourOpen] = useState(false);

  // The phone bar hides at the end of the page, above the footer.
  const endRef = useRef<HTMLDivElement>(null);
  const endInView = useInView(endRef);

  const imageMotion: MotionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: DURATION.base, ease: EASE },
      };

  return (
    <>
      <PageMeta
        title={copy.metaTitle(
          property.name,
          property.city,
          property.state,
          price,
        )}
        description={property.description[0]}
        image={property.image}
        imageAlt={property.imageAlt}
        jsonLd={[
          propertyLd(property, agent),
          breadcrumbLd([
            { name: copy.breadcrumbRoot, path: "/properties" },
            { name: property.name, path: `/properties/${property.slug}` },
          ]),
        ]}
      />

      <div className="page-container pt-8 pb-24 md:pb-32">
        <DetailTopBar property={property} />

        <div className="mt-8">
          <DetailHeader property={property} />
        </div>

        <div className="mt-10 aspect-4/3 overflow-hidden rounded-2xl bg-muted sm:aspect-21/9">
          <motion.img
            {...imageMotion}
            key={property.id}
            src={property.wideImage.src}
            alt={property.wideImage.alt}
            loading="eager"
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="min-w-0">
            <div>
              <DetailSection
                title={copy.sections.about}
                className="border-t-0 pt-0"
              >
                <div className="flex max-w-prose flex-col gap-4 text-lg leading-relaxed">
                  {property.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </DetailSection>
              <DetailSection title={copy.sections.details}>
                <KeyDetails property={property} />
              </DetailSection>
              {property.features.length > 0 && (
                <DetailSection title={copy.sections.features}>
                  <FeaturesList groups={property.features} />
                </DetailSection>
              )}
              <DetailSection title={copy.sections.location}>
                <LocationSection property={property} />
              </DetailSection>
              {property.priceType === "rent" && (
                <DetailSection title={copy.sections.moveIn}>
                  <MoveInCosts property={property} />
                </DetailSection>
              )}
            </div>
          </div>

          {/* Pinned on desktop. If it's taller than the screen, it scrolls on its
              own so the bottom card is never cut off. The padding keeps focus
              rings from being clipped. */}
          <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-6 lg:-m-1 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:p-1">
            {agent && (
              <AgentCard agent={agent}>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => setTourOpen(true)}
                >
                  <TourIcon />
                  {copy.tour.open}
                </Button>
              </AgentCard>
            )}
            {property.nearby.length > 0 && (
              <NearbyCard places={property.nearby} />
            )}
            {property.priceType === "sale" && (
              <MortgageBanner property={property} />
            )}
          </aside>
        </div>

        <section aria-labelledby={similarId} className="mt-20">
          <div className="flex items-end justify-between gap-6">
            <h2 id={similarId} className="type-heading">
              {copy.sections.similar}
            </h2>
            <ArrowLink to="/properties" className="shrink-0">
              {copy.sections.viewAll}
            </ArrowLink>
          </div>
          <motion.ul
            {...revealList(reduceMotion)}
            className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3"
          >
            {similarHomes(property, homes).map((home) => (
              <motion.li
                key={home.id}
                variants={reduceMotion ? undefined : fadeUpItem}
              >
                <PropertyCard property={home} />
              </motion.li>
            ))}
          </motion.ul>
        </section>
        <div ref={endRef} aria-hidden="true" />
      </div>

      {agent && (
        <>
          <MobileTourBar
            property={property}
            onSchedule={() => setTourOpen(true)}
            visible={!endInView && !tourOpen}
          />
          <TourDialog
            open={tourOpen}
            onOpenChange={setTourOpen}
            property={property}
            agent={agent}
          />
        </>
      )}
    </>
  );
}

function PropertyDetail() {
  const { slug } = useParams();
  const property = usePublicProperty(slug);

  if (!property) return <HomeNotFound />;

  // `key` resets state (form, calculator, motion) when moving between homes.
  return <PropertyDetailView key={property.id} property={property} />;
}

export default PropertyDetail;
