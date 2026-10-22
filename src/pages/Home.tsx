import AboutSection from "@/components/home/about-section";
import ClientReviews from "@/components/home/client-reviews";
import FeaturedHomes from "@/components/home/featured-homes";
import Hero from "@/components/home/hero";
import LatestArticles from "@/components/home/latest-articles";
import LatestProperties from "@/components/home/latest-properties";
import PropertyTypes from "@/components/home/property-types";
import ServiceArea from "@/components/home/service-area";
import PageMeta from "@/components/page-meta";
import { site } from "@/data/site";
import { organizationLd, websiteLd } from "@/lib/structured-data";

function Home() {
  return (
    <>
      <PageMeta
        fullTitle={site.seo.homeTitle}
        jsonLd={[organizationLd(), websiteLd()]}
      />
      <Hero />
      <FeaturedHomes />
      <AboutSection />
      <PropertyTypes />
      <ServiceArea />
      <LatestProperties />
      <ClientReviews />
      <LatestArticles />
    </>
  );
}

export default Home;
