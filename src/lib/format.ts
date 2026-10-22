import type { PriceType } from "@/data/properties";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-US");

// "$1,850,000" for sale, "$2,400/mo" for rent.
export function formatPrice(price: number, priceType: PriceType) {
  const formatted = currency.format(price);
  return priceType === "rent" ? `${formatted}/mo` : formatted;
}

// "3,150 sq ft"
export function formatSqft(sqft: number) {
  return `${number.format(sqft)} sq ft`;
}

const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

// "2026-10-14" → "Oct 14, 2026"
export function formatDate(iso: string) {
  return date.format(new Date(iso));
}
