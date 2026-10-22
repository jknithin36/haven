// Fictional data for demo purposes only. City and county names are real.

import { neighborhoods } from "@/data/neighborhoods";

export type ServiceCity = {
  name: string;
  slug: string; // matches a neighborhood guide and the /properties filter
  county: string; // must match a county name in florida-map.ts
  count: number;
};

const counties: Record<string, string> = {
  clearwater: "Pinellas",
  "st-petersburg": "Pinellas",
  tampa: "Hillsborough",
  sarasota: "Sarasota",
  naples: "Collier",
};

// Names and home counts come from the neighborhood guides, so the home page
// and /neighborhoods always agree.
export const serviceCities: ServiceCity[] = neighborhoods.map((n) => ({
  name: n.name,
  slug: n.slug,
  county: counties[n.slug],
  count: n.stats.homesListed,
}));

export const serviceAreaSection = {
  label: "Where we work",
  heading: "Five cities along the Gulf Coast",
  subtext:
    "Our agents live where they sell, from the beaches of Clearwater to the quiet canals of Naples.",
  countyLabel: (county: string) => `${county} County`,
  countUnit: "homes",
  allGuides: { label: "Neighborhood guides", to: "/neighborhoods" },
  mapLabel:
    "Map of Florida highlighting Pinellas, Hillsborough, Sarasota, and Collier counties",
};
