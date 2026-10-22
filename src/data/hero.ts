// Fictional data for demo purposes only.

type HeroImageSource = {
  src: string;
  width: number;
  height: number;
};

type HeroContent = {
  label: string;
  headlineLines: string[];
  subtext: string;
  primaryCta: { label: string; to: string };
  image: {
    alt: string;
    desktop: HeroImageSource;
    mobile: HeroImageSource;
  };
};

export const hero: HeroContent = {
  label: "Homes across Florida's Gulf Coast",
  headlineLines: ["Find the home that fits", "the way you live."],
  subtext:
    "Beach homes, city condos, and family houses, with local agents who know every coastline.",
  primaryCta: { label: "Browse our properties", to: "/properties" },
  image: {
    alt: "Bright beach home living room with floor-to-ceiling windows and ocean views",
    desktop: { src: "/images/hero-desktop.jpg", width: 1920, height: 1088 },
    mobile: { src: "/images/hero-mobile.jpg", width: 1024, height: 1824 },
  },
};
