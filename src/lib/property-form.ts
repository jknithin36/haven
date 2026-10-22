// The property editor's form model: Zod schemas, and converters between a
// stored home and the form's values. Number fields stay strings while the
// user types, and become numbers on save.

import { z } from "zod";

import { propertyEditorPage } from "@/data/admin";
import type { FloodZone, PriceType, Property } from "@/data/properties";
import {
  isSlugTaken,
  type ListedProperty,
  type Photo,
} from "@/store/properties";

const copy = propertyEditorPage;

export const DESCRIPTION_MAX = 1200;
export const PARAGRAPHS_MAX = 3;
const YEAR_MIN = 1850;
const MAX_ROOMS = 20;

export const FEATURE_GROUPS = copy.features.groups;
export const FLOOD_ZONES: FloodZone[] = ["X", "AE", "VE"];
export const EDITABLE_STATUSES = ["draft", "active", "sold", "rented"] as const;

export type PropertyFormValues = {
  name: string;
  slug: string;
  status: ListedProperty["status"];
  priceType: PriceType;
  price: string;
  type: Property["type"] | "";
  city: string;
  neighborhood: string;
  address: string;
  zip: string;
  beds: string;
  baths: string;
  sqft: string;
  lotSqft: string;
  yearBuilt: string;
  garage: string;
  hoaMonthly: string;
  taxesYearly: string;
  deposit: string;
  leaseTerm: string;
  availableFrom: string;
  floodZone: FloodZone;
  description: string;
  photos: Photo[];
  features: Record<string, string[]>;
  agentId: string;
};

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

const toNumber = (value: string) => Number(value.replace(/,/g, ""));
const isBlank = (value: string) => value.trim() === "";
const isWhole = (value: string) => /^\d+$/.test(value.replace(/,/g, ""));

// Optional whole number: empty, or digits.
const optionalWhole = z
  .string()
  .refine((v) => isBlank(v) || isWhole(v), copy.errors.number);

// Saving a draft only needs a name and a free URL; publishing needs the rest.
export function propertySchemas(currentId?: string) {
  const slug = z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, copy.errors.slug)
    .refine((s) => !isSlugTaken(s, currentId), copy.errors.slugTaken);

  const base = {
    name: z.string().trim().min(2, copy.errors.name),
    slug,
    lotSqft: optionalWhole,
    garage: optionalWhole,
    hoaMonthly: optionalWhole,
    taxesYearly: optionalWhole,
    deposit: optionalWhole,
    description: z
      .string()
      .max(DESCRIPTION_MAX, copy.errors.descriptionLong(DESCRIPTION_MAX))
      .refine(
        (v) => paragraphs(v).length <= PARAGRAPHS_MAX,
        copy.errors.paragraphs,
      ),
  };

  const draft = z.looseObject(base);

  const maxYear = new Date().getFullYear() + 2;
  const publish = z.looseObject({
    ...base,
    price: z
      .string()
      .refine((v) => isWhole(v) && toNumber(v) > 0, copy.errors.price),
    type: z.string().min(1, copy.errors.type),
    city: z.string().min(1, copy.errors.city),
    neighborhood: z.string().trim().min(1, copy.errors.neighborhood),
    address: z.string().trim().min(3, copy.errors.address),
    zip: z.string().regex(/^\d{5}$/, copy.errors.zip),
    beds: z
      .string()
      .refine((v) => isWhole(v) && toNumber(v) <= MAX_ROOMS, copy.errors.beds),
    baths: z.string().refine((v) => {
      const n = Number(v);
      return !isBlank(v) && n >= 0 && n <= MAX_ROOMS && Number.isInteger(n * 2);
    }, copy.errors.baths),
    sqft: z
      .string()
      .refine((v) => isWhole(v) && toNumber(v) > 0, copy.errors.sqft),
    yearBuilt: z.string().refine((v) => {
      const n = Number(v);
      return isWhole(v) && n >= YEAR_MIN && n <= maxYear;
    }, copy.errors.yearBuilt(maxYear)),
    description: base.description.refine(
      (v) => paragraphs(v).length > 0,
      copy.errors.description,
    ),
    photos: z.array(z.unknown()).min(1, copy.errors.photos),
    agentId: z.string().min(1, copy.errors.agent),
  });

  return { draft, publish };
}

function str(value: number | string | undefined) {
  return value === undefined ? "" : String(value);
}

export function emptyFormValues(agentId: string): PropertyFormValues {
  return {
    name: "",
    slug: "",
    status: "draft",
    priceType: "sale",
    price: "",
    type: "",
    city: "",
    neighborhood: "",
    address: "",
    zip: "",
    beds: "",
    baths: "",
    sqft: "",
    lotSqft: "",
    yearBuilt: "",
    garage: "",
    hoaMonthly: "",
    taxesYearly: "",
    deposit: "",
    leaseTerm: "",
    availableFrom: "",
    floodZone: "X",
    description: "",
    photos: [],
    features: Object.fromEntries(FEATURE_GROUPS.map((g) => [g, []])),
    agentId,
  };
}

export function toFormValues(p: ListedProperty): PropertyFormValues {
  const features = Object.fromEntries(
    FEATURE_GROUPS.map((group) => [
      group,
      p.features.find((f) => f.group === group)?.items ?? [],
    ]),
  );
  return {
    name: p.name,
    slug: p.slug,
    status: p.status,
    priceType: p.priceType,
    price: str(p.price),
    type: p.type,
    city: p.city,
    neighborhood: p.neighborhood,
    address: p.address,
    zip: p.zip,
    beds: str(p.beds),
    baths: str(p.baths),
    sqft: str(p.sqft),
    lotSqft: str(p.lotSqft),
    yearBuilt: str(p.yearBuilt),
    garage: str(p.garage),
    hoaMonthly: str(p.hoaMonthly),
    taxesYearly: str(p.taxesYearly),
    deposit: str(p.deposit),
    leaseTerm: p.leaseTerm ?? "",
    availableFrom: p.availableFrom ?? "",
    floodZone: p.floodZone,
    description: p.description.join("\n\n"),
    photos: p.photos,
    features,
    agentId: p.agentId,
  };
}

const optionalNumber = (v: string) => (isBlank(v) ? undefined : toNumber(v));

// Photos without alt text get one from the home's name.
function withAlt(photos: Photo[], name: string) {
  return photos.map((photo, i) =>
    photo.alt ? photo : { ...photo, alt: copy.photos.alt(name, i + 1) },
  );
}

// Merge form values into a home. `base` carries the fields the form doesn't
// edit (nearby places, map position, views, and so on).
export function fromFormValues(
  v: PropertyFormValues,
  base: ListedProperty,
): ListedProperty {
  const rent = v.priceType === "rent";
  const name = v.name.trim() || copy.untitled;
  return {
    ...base,
    name,
    slug: v.slug,
    status: v.status,
    priceType: v.priceType,
    price: toNumber(v.price) || 0,
    type: v.type || base.type,
    city: v.city || base.city,
    neighborhood: v.neighborhood.trim(),
    address: v.address.trim(),
    zip: v.zip,
    beds: toNumber(v.beds) || 0,
    baths: Number(v.baths) || 0,
    sqft: toNumber(v.sqft) || 0,
    lotSqft: optionalNumber(v.lotSqft),
    yearBuilt: toNumber(v.yearBuilt) || base.yearBuilt,
    garage: optionalNumber(v.garage),
    hoaMonthly: optionalNumber(v.hoaMonthly),
    taxesYearly: rent ? undefined : optionalNumber(v.taxesYearly),
    deposit: rent ? optionalNumber(v.deposit) : undefined,
    leaseTerm: rent && v.leaseTerm.trim() ? v.leaseTerm.trim() : undefined,
    availableFrom: rent && v.availableFrom ? v.availableFrom : undefined,
    floodZone: v.floodZone,
    description: paragraphs(v.description),
    photos: withAlt(v.photos, name),
    features: FEATURE_GROUPS.map((group) => ({
      group,
      items: v.features[group] ?? [],
    })).filter((f) => f.items.length > 0),
    agentId: v.agentId,
  };
}

// A blank home for the "New property" page. The form fills in the rest.
export function newPropertyBase(
  agentId: string,
  coordinates: Property["coordinates"],
): ListedProperty {
  const now = new Date();
  return {
    id: crypto.randomUUID(),
    slug: "",
    name: "",
    city: "",
    state: "FL",
    price: 0,
    priceType: "sale",
    beds: 0,
    baths: 0,
    sqft: 0,
    type: "Family home",
    image: "",
    imageAlt: "",
    wideImage: { src: "", alt: "" },
    featured: false,
    isNew: true,
    listedAt: now.toISOString().slice(0, 10),
    address: "",
    neighborhood: "",
    zip: "",
    description: [],
    yearBuilt: now.getFullYear(),
    floodZone: "X",
    features: [],
    nearby: [],
    agentId,
    coordinates,
    views: 0,
    saves: 0,
    status: "draft",
    updatedAt: now.toISOString(),
    photos: [],
  };
}
