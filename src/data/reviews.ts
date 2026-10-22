// Fictional data for demo purposes only.

export type Review = {
  id: string;
  quote: string;
  name: string;
  action: "Bought" | "Sold" | "Rented";
  city: string;
  homeType: string;
  photo: string;
  photoAlt: string;
  rating: 5;
};

export type ReviewStat = {
  value: number;
  suffix: string;
  label: string;
};

// Placeholder photos until the client photos exist (planned paths:
// /images/reviews/<surname>.webp). Alt text describes the placeholder.
export const reviews: Review[] = [
  {
    id: "shah",
    quote:
      "We told Haven what mattered, a yard for the kids and a short drive to the beach, and they found it in two weekends. No pressure, just honest advice.",
    name: "Jordan and Priya Shah",
    action: "Bought",
    city: "Clearwater",
    homeType: "Family home",
    photo: "/images/hero-desktop.jpg",
    photoAlt: "Bright open living room leading onto a sunny deck by the sea",
    rating: 5,
  },
  {
    id: "ellison",
    quote:
      "They priced my condo right from day one. Three showings, two offers, and closed a week early. I didn't have to chase anyone for updates.",
    name: "Mark Ellison",
    action: "Sold",
    city: "St. Petersburg",
    homeType: "Condo",
    photo: "/images/hero-mobile.jpg",
    photoAlt: "Linen armchair beside a tall window overlooking the bay",
    rating: 5,
  },
  {
    id: "moreno",
    quote:
      "Moving from out of state felt huge. My agent did video tours, explained every neighborhood, and had keys ready the day I landed.",
    name: "Alyssa Moreno",
    action: "Rented",
    city: "Tampa",
    homeType: "Condo",
    photo: "/images/hero-desktop.jpg",
    photoAlt: "Sunlit living room with white sofas and ocean views",
    rating: 5,
  },
  {
    id: "hayes",
    quote:
      "We'd looked at flood maps for months and still felt lost. Haven walked us through insurance, elevation, and docks until we were sure.",
    name: "Robert and Linda Hayes",
    action: "Bought",
    city: "Sarasota",
    homeType: "Waterfront home",
    photo: "/images/hero-mobile.jpg",
    photoAlt: "Quiet corner with an armchair and a view of the water",
    rating: 5,
  },
  {
    id: "okafor",
    quote:
      "I wanted something walkable without giving up space. They showed me three townhomes that actually fit, not thirty that didn't.",
    name: "Nina Okafor",
    action: "Rented",
    city: "Naples",
    homeType: "Townhome",
    photo: "/images/hero-desktop.jpg",
    photoAlt: "Open-plan living area with doors opening to the sea",
    rating: 5,
  },
];

export const reviewStats: ReviewStat[] = [
  { value: 98, suffix: "%", label: "of clients would recommend Haven" },
  { value: 21, suffix: " days", label: "average time to find a home" },
  { value: 600, suffix: "+", label: "five-star reviews" },
];

export const reviewsSection = {
  label: "Client stories",
  heading: "What our clients say",
  carouselLabel: "Client reviews",
  slideLabel: (index: number, total: number) => `${index} of ${total}`,
  previous: "Previous review",
  next: "Next review",
  rating: (stars: number) => `Rated ${stars} out of 5`,
  meta: (review: Review) =>
    `${review.action} in ${review.city} · ${review.homeType}`,
};
