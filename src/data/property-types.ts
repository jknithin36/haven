// Fictional data for demo purposes only.

export type PropertyTypeIcon =
  | "beach"
  | "waves"
  | "building"
  | "home"
  | "houses"
  | "diamond"
  | "flag"
  | "key";

export type PropertyTypeItem = {
  slug: string;
  href?: string; // defaults to /properties?type=<slug>
  name: string;
  count: number;
  line: string;
  icon: PropertyTypeIcon;
};

export const propertyTypes: PropertyTypeItem[] = [
  {
    slug: "beach-home",
    name: "Beach homes",
    count: 38,
    line: "Steps from the sand",
    icon: "beach",
  },
  {
    slug: "waterfront-home",
    name: "Waterfront homes",
    count: 26,
    line: "Docks, bays, and canal views",
    icon: "waves",
  },
  {
    slug: "condo",
    name: "Condos",
    count: 72,
    line: "Easy living with great views",
    icon: "building",
  },
  {
    slug: "family-home",
    name: "Family homes",
    count: 64,
    line: "Space to grow, near good schools",
    icon: "home",
  },
  {
    slug: "townhome",
    name: "Townhomes",
    count: 31,
    line: "More room, less upkeep",
    icon: "houses",
  },
  {
    slug: "luxury-home",
    name: "Luxury homes",
    count: 19,
    line: "Pools, privacy, and premium finishes",
    icon: "diamond",
  },
  {
    slug: "golf-course-home",
    name: "Golf course homes",
    count: 14,
    line: "Fairway views and community living",
    icon: "flag",
  },
  {
    slug: "rental",
    href: "/properties?status=rent",
    name: "Rentals",
    count: 45,
    line: "Flexible leases across the coast",
    icon: "key",
  },
];

export const propertyTypesSection = {
  label: "Browse by type",
  heading: "Start with the kind of home you want",
  subtext:
    "From beach cottages to city condos, pick a type and see every home that fits.",
  countUnit: "homes",
};
