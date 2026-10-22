// Fictional data for demo purposes only.
// Filter and sort options for /properties. `value` is what appears in the URL.

import type { PriceType } from "@/data/properties";

export const ALL = "all";

export type Option = { value: string; label: string };

export type PriceRange = Option & {
  priceType: PriceType;
  min?: number;
  max?: number; // exclusive
};

export const locationOptions: Option[] = [
  { value: ALL, label: "All locations" },
  { value: "tampa", label: "Tampa" },
  { value: "st-petersburg", label: "St. Petersburg" },
  { value: "clearwater", label: "Clearwater" },
  { value: "sarasota", label: "Sarasota" },
  { value: "naples", label: "Naples" },
];

export const typeOptions: Option[] = [
  { value: ALL, label: "Any type" },
  { value: "beach-home", label: "Beach home" },
  { value: "waterfront-home", label: "Waterfront home" },
  { value: "condo", label: "Condo" },
  { value: "family-home", label: "Family home" },
  { value: "townhome", label: "Townhome" },
  { value: "luxury-home", label: "Luxury home" },
  { value: "golf-course-home", label: "Golf course home" },
];

export const anyPrice: Option = { value: ALL, label: "Any price" };

export const salePriceRanges: PriceRange[] = [
  {
    value: "under-500k",
    label: "Under $500K",
    priceType: "sale",
    max: 500_000,
  },
  {
    value: "500k-1m",
    label: "$500K–$1M",
    priceType: "sale",
    min: 500_000,
    max: 1_000_000,
  },
  {
    value: "1m-2m",
    label: "$1M–$2M",
    priceType: "sale",
    min: 1_000_000,
    max: 2_000_000,
  },
  { value: "2m-plus", label: "$2M+", priceType: "sale", min: 2_000_000 },
];

export const rentPriceRanges: PriceRange[] = [
  {
    value: "under-2500",
    label: "Under $2,500/mo",
    priceType: "rent",
    max: 2_500,
  },
  {
    value: "2500-3500",
    label: "$2,500–$3,500/mo",
    priceType: "rent",
    min: 2_500,
    max: 3_500,
  },
  { value: "3500-plus", label: "$3,500+/mo", priceType: "rent", min: 3_500 },
];

export const priceRanges: PriceRange[] = [
  ...salePriceRanges,
  ...rentPriceRanges,
];

export const bedOptions: Option[] = [
  { value: ALL, label: "Any" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];

export const statusOptions: Option[] = [
  { value: ALL, label: "All" },
  { value: "sale", label: "For sale" },
  { value: "rent", label: "For rent" },
];

export const sortOptions: Option[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "size-desc", label: "Size: largest first" },
];
