// Fictional data for demo purposes only.

import { DEFAULT_SITE_URL } from "@/data/site-url";

export type NavItem = { label: string; to: string };

// Where the site is deployed, without a trailing slash. Set VITE_SITE_URL in
// .env (see .env.example); canonical links, social cards, and the sitemap
// use it.
const siteUrl = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(
  /\/+$/,
  "",
);

// Brand and navigation shared by the navbar and footer.
export const site = {
  name: "Haven",
  url: siteUrl,
  tagline: "Find the home that fits the way you live.",
  description:
    "Haven helps you buy, sell, and rent beach homes, condos, and family houses across Florida's Gulf Coast.",
  homeLabel: "Haven home",
  // Search engines and social cards.
  seo: {
    homeTitle: "Haven | Homes for sale and rent on Florida's Gulf Coast",
    locale: "en_US",
    ogImage: "/og-image.png",
    ogImageAlt: "Haven, homes on Florida's Gulf Coast",
    logo: "/icon-1024.png",
    themeColor: "#ffffff",
    email: "hello@haven.example.com",
    phone: "+1-727-555-0148",
    region: "FL",
    country: "US",
  },
  announcement: {
    label: "Announcement",
    text: "New: see tour requests and messages in one place.",
    link: { label: "Explore the admin dashboard", to: "/admin" },
    dismiss: "Dismiss announcement",
  },
  skipLink: "Skip to content",
  nav: {
    label: "Main",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuTitle: "Menu",
    contactTitle: "Talk to us",
    primary: [
      { label: "Properties", to: "/properties" },
      { label: "Neighborhoods", to: "/neighborhoods" },
      { label: "About", to: "/about" },
      { label: "Agents", to: "/agents" },
    ] satisfies NavItem[],
    secondary: [{ label: "Contact", to: "/contact" }] satisfies NavItem[],
    cta: { label: "Book a call", to: "/contact" } satisfies NavItem,
  },
};

// "/properties" → "https://haven.example.com/properties"
export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

// "Homes for sale and rent" → "Homes for sale and rent | Haven"
export function pageTitle(title?: string) {
  return title ? `${title} | ${site.name}` : site.name;
}
