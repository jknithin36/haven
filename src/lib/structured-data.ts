// schema.org JSON-LD builders. PageMeta renders them, so search engines can
// show rich results (listings, breadcrumbs, FAQs, articles, agents).

import type { Agent } from "@/data/agents";
import type { Article } from "@/data/articles";
import type { FaqCategory } from "@/data/faq";
import { neighborhoods } from "@/data/neighborhoods";
import type { Property } from "@/data/properties";
import { absoluteUrl, site } from "@/data/site";

export type JsonLd = { "@context"?: string; "@type": string } & Record<
  string,
  unknown
>;

const CONTEXT = "https://schema.org";
const CURRENCY = "USD";
const SQFT_UNIT = "FTK"; // UN/CEFACT code for square feet

const orgId = () => absoluteUrl("/#organization");

function areaServed() {
  return neighborhoods.map((n) => ({
    "@type": "City",
    name: n.name,
    containedInPlace: { "@type": "State", name: site.seo.region },
  }));
}

// The company: a real estate agency serving the Gulf Coast cities.
export function organizationLd(): JsonLd {
  return {
    "@context": CONTEXT,
    "@type": "RealEstateAgent",
    "@id": orgId(),
    name: site.name,
    description: site.description,
    url: absoluteUrl("/"),
    logo: absoluteUrl(site.seo.logo),
    image: absoluteUrl(site.seo.ogImage),
    email: site.seo.email,
    telephone: site.seo.phone,
    address: {
      "@type": "PostalAddress",
      addressRegion: site.seo.region,
      addressCountry: site.seo.country,
    },
    areaServed: areaServed(),
  };
}

export function websiteLd(): JsonLd {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    name: site.name,
    url: absoluteUrl("/"),
    publisher: { "@id": orgId() },
  };
}

// [{ name: "Properties", path: "/properties" }, { name: "Seagrass", path }]
export function breadcrumbLd(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function propertyLd(property: Property, agent?: Agent): JsonLd {
  const url = absoluteUrl(`/properties/${property.slug}`);
  const rent = property.priceType === "rent";
  return {
    "@context": CONTEXT,
    "@type": "RealEstateListing",
    name: property.name,
    description: property.description.join(" "),
    url,
    image: [property.image, property.wideImage.src].map(absoluteUrl),
    datePosted: property.listedAt,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: CURRENCY,
      businessFunction: rent
        ? "http://purl.org/goodrelations/v1#LeaseOut"
        : "http://purl.org/goodrelations/v1#Sell",
      availability: "https://schema.org/InStock",
      ...(rent && {
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: property.price,
          priceCurrency: CURRENCY,
          unitCode: "MON",
        },
      }),
      offeredBy: agent
        ? { "@type": "RealEstateAgent", name: agent.name }
        : { "@id": orgId() },
    },
    mainEntity: {
      "@type":
        property.type === "Condo" ? "Apartment" : "SingleFamilyResidence",
      name: property.name,
      numberOfBedrooms: property.beds,
      numberOfBathroomsTotal: property.baths,
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.sqft,
        unitCode: SQFT_UNIT,
      },
      yearBuilt: property.yearBuilt,
      address: {
        "@type": "PostalAddress",
        streetAddress: property.address,
        addressLocality: property.city,
        addressRegion: property.state,
        postalCode: property.zip,
        addressCountry: site.seo.country,
      },
    },
  };
}

export function agentLd(agent: Agent): JsonLd {
  return {
    "@context": CONTEXT,
    "@type": "Person",
    name: agent.name,
    jobTitle: agent.title,
    description: agent.shortBio,
    url: absoluteUrl(`/agents/${agent.slug}`),
    ...(agent.photo && { image: absoluteUrl(agent.photo) }),
    email: agent.email,
    telephone: agent.phone,
    knowsLanguage: agent.languages,
    knowsAbout: agent.specialties,
    worksFor: { "@id": orgId(), "@type": "RealEstateAgent", name: site.name },
    areaServed: agent.areas.map((name) => ({ "@type": "City", name })),
  };
}

export function articleLd(article: Article): JsonLd {
  return {
    "@context": CONTEXT,
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: absoluteUrl(article.image),
    datePublished: article.date,
    dateModified: article.date,
    articleSection: article.category,
    mainEntityOfPage: absoluteUrl(`/guides/${article.slug}`),
    author: { "@type": "Organization", name: site.name, url: absoluteUrl("/") },
    publisher: { "@id": orgId() },
  };
}

export function faqLd(categories: FaqCategory[]): JsonLd {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: categories.flatMap((c) =>
      c.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };
}

// A list of links, e.g. the homes or agents on an index page.
export function itemListLd(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": CONTEXT,
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}
