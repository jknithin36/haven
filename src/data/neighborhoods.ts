// Fictional data for demo purposes only. City names are real; every place is
// described generically, and all numbers are made up.

export type HighlightIcon =
  | "beach"
  | "food"
  | "outdoors"
  | "transit"
  | "culture"
  | "boating"
  | "golf"
  | "work";

export type Walkability = "High" | "Medium" | "Low";

export type NeighborhoodStats = {
  medianPrice: number;
  avgRent: number;
  homesListed: number;
  beachMinutes: number;
  airportMinutes: number;
  walkability: Walkability;
};

export type Neighborhood = {
  slug: string; // matches the `location` filter on /properties
  name: string;
  tagline: string;
  heroImage: string;
  heroAlt: string;
  vibe: string[];
  stats: NeighborhoodStats;
  about: string[];
  highlights: { title: string; text: string; icon: HighlightIcon }[];
  goodFor: string[];
  livingNotes: { title: string; text: string }[];
  agentId: string;
  faqs: { q: string; a: string }[];
};

// The same practical notes apply all along this coast.
const coastalNotes = {
  insurance: {
    title: "Insurance",
    text: "Homeowners and flood insurance usually cost more close to the water. Get quotes before you make an offer so there are no surprises.",
  },
  hurricanes: {
    title: "Hurricane season",
    text: "Hurricane season runs from June to November. Newer homes often have impact windows and roofs built to stricter codes.",
  },
  hoa: {
    title: "HOA and condo fees",
    text: "Monthly fees are common in condos and gated communities. They often cover insurance for the building, landscaping, and shared amenities.",
  },
};

// Placeholder photos until /images/neighborhoods/<slug>.webp exist.
export const neighborhoods: Neighborhood[] = [
  {
    slug: "tampa",
    name: "Tampa",
    tagline: "City energy with waterfront views",
    heroImage: "/images/properties/harbor-lights-condo-wide.jpg",
    heroAlt:
      "High-rise living room with tall windows over the river and the city skyline",
    vibe: [
      "Walkable downtown",
      "Waterfront dining",
      "Sports and nightlife",
      "Growing job market",
    ],
    stats: {
      medianPrice: 425_000,
      avgRent: 2450,
      homesListed: 18,
      beachMinutes: 35,
      airportMinutes: 15,
      walkability: "High",
    },
    about: [
      "Tampa is the busiest city on this stretch of coast, with a downtown riverwalk, high-rise condos, and neighborhoods of older bungalows a short drive away.",
      "It's a good fit if you want restaurants, live sports, and a growing job market close to home, with the beaches about half an hour west.",
    ],
    highlights: [
      {
        icon: "food",
        title: "Food and coffee",
        text: "Waterfront restaurants, food halls, and corner cafés in most neighborhoods.",
      },
      {
        icon: "work",
        title: "Jobs nearby",
        text: "A large share of the region's offices and hospitals are within a short commute.",
      },
      {
        icon: "outdoors",
        title: "Outdoors",
        text: "A long riverside path for running and biking, plus plenty of city parks.",
      },
      {
        icon: "transit",
        title: "Getting around",
        text: "Walkable downtown blocks, a streetcar line, and quick drives to the airport.",
      },
    ],
    goodFor: [
      "Young professionals",
      "First-time buyers",
      "Sports fans",
      "Renters",
    ],
    livingNotes: [
      {
        title: "Flood risk",
        text: "Much of the city sits outside high-risk flood zones, but areas along the bay and river are higher risk. Check the flood zone for each home.",
      },
      coastalNotes.insurance,
      coastalNotes.hurricanes,
      coastalNotes.hoa,
    ],
    agentId: "a-sofia",
    faqs: [
      {
        q: "Is it a good place for families?",
        a: "Yes. Many neighborhoods have parks and good schools, and suburbs just outside the city offer more space for the money.",
      },
      {
        q: "How far is the beach?",
        a: "About 35 minutes by car to the nearest Gulf beaches, depending on traffic.",
      },
      {
        q: "Do I need flood insurance?",
        a: "Lenders require it in high-risk zones. Outside those zones it's optional but often worth it, and it's usually cheaper.",
      },
    ],
  },
  {
    slug: "st-petersburg",
    name: "St. Petersburg",
    tagline: "Arts, sunshine, and a lively waterfront",
    heroImage: "/images/properties/coral-street-bungalow-wide.jpg",
    heroAlt:
      "Cozy living room with a white brick fireplace and built-in bookshelves",
    vibe: [
      "Murals and galleries",
      "Bayfront parks",
      "Café culture",
      "Easy beach trips",
    ],
    stats: {
      medianPrice: 445_000,
      avgRent: 2380,
      homesListed: 14,
      beachMinutes: 20,
      airportMinutes: 25,
      walkability: "High",
    },
    about: [
      "St. Petersburg mixes a walkable downtown with leafy streets of 1920s bungalows, colorful murals, and a long chain of bayfront parks.",
      "The beaches are a 20-minute drive, so many people live in town and spend weekends on the sand.",
    ],
    highlights: [
      {
        icon: "culture",
        title: "Arts and culture",
        text: "Galleries, street murals, and small music venues all over downtown.",
      },
      {
        icon: "food",
        title: "Food and coffee",
        text: "Independent cafés, breweries, and weekend markets.",
      },
      {
        icon: "outdoors",
        title: "Waterfront parks",
        text: "Miles of parks and paths along the bay for walking and biking.",
      },
      {
        icon: "beach",
        title: "Beaches",
        text: "Wide Gulf beaches about 20 minutes away by car.",
      },
    ],
    goodFor: ["Creatives", "Couples", "Remote workers", "Walkers and cyclists"],
    livingNotes: [
      {
        title: "Flood risk",
        text: "Low-lying blocks near the water are in higher-risk flood zones, while neighborhoods on higher ground are lower risk. Check each home's zone.",
      },
      coastalNotes.insurance,
      coastalNotes.hurricanes,
      coastalNotes.hoa,
    ],
    agentId: "a-marcus",
    faqs: [
      {
        q: "Is it a good place for families?",
        a: "Yes. Many neighborhoods have parks within walking distance, and the older areas have big shade trees and sidewalks.",
      },
      {
        q: "How far is the beach?",
        a: "Around 20 minutes by car to the Gulf beaches.",
      },
      {
        q: "Do I need flood insurance?",
        a: "It's required for most homes with a mortgage in high-risk zones, and a good idea near the bay even when it isn't.",
      },
    ],
  },
  {
    slug: "clearwater",
    name: "Clearwater",
    tagline: "Easygoing beach life every day",
    heroImage: "/images/properties/driftwood-beach-house-wide.jpg",
    heroAlt:
      "Bright living room with sliding doors onto a deck above the dunes and the Gulf",
    vibe: ["White-sand beaches", "Family friendly", "Sunset views", "Boating"],
    stats: {
      medianPrice: 395_000,
      avgRent: 2250,
      homesListed: 12,
      beachMinutes: 10,
      airportMinutes: 25,
      walkability: "Medium",
    },
    about: [
      "Clearwater is built around the beach: soft white sand, calm water, and sunsets you can watch from almost anywhere along the shore.",
      "Inland neighborhoods are quieter and more affordable, with the beach about 10 minutes away.",
    ],
    highlights: [
      {
        icon: "beach",
        title: "Beaches",
        text: "A quiet white-sand beach with calm, shallow water that suits kids.",
      },
      {
        icon: "boating",
        title: "Boating",
        text: "Marinas and boat ramps make it easy to get out on the water.",
      },
      {
        icon: "food",
        title: "Food and coffee",
        text: "Casual seafood spots and beachside cafés.",
      },
      {
        icon: "transit",
        title: "Getting around",
        text: "Easy drives to Tampa and St. Petersburg, and a beach trolley in season.",
      },
    ],
    goodFor: ["Families", "Beach lovers", "Boaters", "Retirees"],
    livingNotes: [
      {
        title: "Flood risk",
        text: "Homes on the barrier islands and right by the water are in high-risk or coastal zones. Inland areas are usually lower risk.",
      },
      coastalNotes.insurance,
      coastalNotes.hurricanes,
      coastalNotes.hoa,
    ],
    agentId: "a-emma",
    faqs: [
      {
        q: "Is it a good place for families?",
        a: "Very. Calm beaches, parks, and quieter inland neighborhoods make it popular with families.",
      },
      {
        q: "How far is the beach?",
        a: "About 10 minutes from most inland neighborhoods, and a short walk from the beachside ones.",
      },
      {
        q: "Do I need flood insurance?",
        a: "On the islands and near the water, almost always. Inland, it depends on the home's flood zone.",
      },
    ],
  },
  {
    slug: "sarasota",
    name: "Sarasota",
    tagline: "Quiet beaches and a cultural downtown",
    heroImage: "/images/properties/mangrove-bay-retreat-wide.jpg",
    heroAlt:
      "Living room with wood ceiling beams and wide windows facing a dock and mangroves",
    vibe: [
      "Calm beaches",
      "Theater and music",
      "Waterfront homes",
      "Great for retirees",
    ],
    stats: {
      medianPrice: 485_000,
      avgRent: 2600,
      homesListed: 16,
      beachMinutes: 12,
      airportMinutes: 15,
      walkability: "Medium",
    },
    about: [
      "Sarasota pairs some of the calmest beaches on the coast with a small, lively downtown full of theaters, galleries, and restaurants.",
      "Waterfront homes on the bay often have private docks, and the islands offer quiet streets a short bridge away from town.",
      "It's a favorite with retirees and families who want a slower pace without giving up culture.",
    ],
    highlights: [
      {
        icon: "beach",
        title: "Beaches",
        text: "Quiet white-sand beaches with soft, powdery sand.",
      },
      {
        icon: "culture",
        title: "Arts and culture",
        text: "Theaters, concert halls, and galleries in and around downtown.",
      },
      {
        icon: "boating",
        title: "On the water",
        text: "Bayfront homes with docks and easy access to open water.",
      },
      {
        icon: "outdoors",
        title: "Outdoors",
        text: "Nature preserves and kayak trails through the mangroves.",
      },
    ],
    goodFor: ["Retirees", "Families", "Boaters", "Arts lovers"],
    livingNotes: [
      {
        title: "Flood risk",
        text: "Homes on the islands and along the bay are often in high-risk flood zones. Ask for the elevation certificate when you make an offer.",
      },
      coastalNotes.insurance,
      coastalNotes.hurricanes,
      coastalNotes.hoa,
    ],
    agentId: "a-daniel",
    faqs: [
      {
        q: "Is it a good place for families?",
        a: "Yes. There are good schools, quiet neighborhoods, and lots to do outdoors.",
      },
      {
        q: "How far is the beach?",
        a: "About 12 minutes from downtown, and a short walk from homes on the islands.",
      },
      {
        q: "Do I need flood insurance?",
        a: "For waterfront and island homes, almost certainly. Inland it depends on the flood zone.",
      },
    ],
  },
  {
    slug: "naples",
    name: "Naples",
    tagline: "Polished, peaceful, and close to the water",
    heroImage: "/images/properties/sunset-key-villa-wide.jpg",
    heroAlt:
      "Double-height living room opening to an infinity pool and the Gulf at sunset",
    vibe: [
      "Luxury homes",
      "Golf communities",
      "Fine dining",
      "Nature preserves",
    ],
    stats: {
      medianPrice: 725_000,
      avgRent: 3400,
      homesListed: 10,
      beachMinutes: 10,
      airportMinutes: 30,
      walkability: "Medium",
    },
    about: [
      "Naples is calm and carefully kept, with tree-lined streets, golf communities, and a long, quiet shoreline.",
      "The town center has boutique shops and fine dining, while nature preserves and mangrove waterways are never far away.",
    ],
    highlights: [
      {
        icon: "beach",
        title: "Beaches",
        text: "A long, quiet shoreline with famously calm sunsets.",
      },
      {
        icon: "golf",
        title: "Golf",
        text: "Dozens of golf communities, many with clubhouses and pools.",
      },
      {
        icon: "food",
        title: "Dining",
        text: "Fine dining and boutique shops along walkable town streets.",
      },
      {
        icon: "outdoors",
        title: "Outdoors",
        text: "Nature preserves, boardwalks, and mangrove waterways.",
      },
    ],
    goodFor: ["Retirees", "Golfers", "Second-home buyers", "Nature lovers"],
    livingNotes: [
      {
        title: "Flood risk",
        text: "Coastal and low-lying areas are in high-risk flood zones. Many newer homes are built higher to lower that risk.",
      },
      coastalNotes.insurance,
      coastalNotes.hurricanes,
      coastalNotes.hoa,
    ],
    agentId: "a-daniel",
    faqs: [
      {
        q: "Is it a good place for families?",
        a: "Yes, especially in the suburbs east of town, where homes have more space and good schools are close by.",
      },
      {
        q: "How far is the beach?",
        a: "About 10 minutes from most neighborhoods, and walking distance from many near the coast.",
      },
      {
        q: "Do I need flood insurance?",
        a: "Near the coast, lenders usually require it. Even further inland, many owners choose to carry it.",
      },
    ],
  },
];

export function getNeighborhood(slug: string | undefined) {
  return neighborhoods.find((n) => n.slug === slug);
}
