// Fictional data for demo purposes only.

export type AboutIcon = "home" | "chart";

export type AboutFeature = {
  id: string;
  icon: AboutIcon;
  title: string;
  text: string;
};

export type AboutStat = {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
};

type AboutContent = {
  label: string;
  heading: string;
  subtext: string;
  features: AboutFeature[];
  mainImage: string;
  mainImageAlt: string;
  stats: AboutStat[];
};

// Placeholder photo until /images/about/about-main.webp exists. Alt text
// describes the placeholder.
export const about: AboutContent = {
  label: "About Haven",
  heading: "Local experts who make moving simple",
  subtext:
    "We're a small team of agents who live on this coast. We help you buy, sell, or rent without the guesswork.",
  features: [
    {
      id: "search",
      icon: "home",
      title: "Search that fits your life",
      text: "Filter by neighborhood, price, size, and must-haves like a pool, a dock, or a short walk to the beach.",
    },
    {
      id: "insight",
      icon: "chart",
      title: "Honest local insight",
      text: "Know the flood zones, school ratings, and true cost of each area before you visit, so there are no surprises.",
    },
  ],
  mainImage: "/images/hero-desktop.jpg",
  mainImageAlt: "Bright living room with large windows and water views",
  stats: [
    { value: 1200, suffix: "+", label: "Homes sold and rented" },
    { value: 4.9, suffix: "", label: "Average client rating", decimals: 1 },
    { value: 15, suffix: "+", label: "Years on the Gulf Coast" },
  ],
};
