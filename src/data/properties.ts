// Fictional data for demo purposes only. Addresses, neighborhoods, and zip
// codes are made up; only the city names are real.

export type PriceType = "sale" | "rent";

export type FloodZone = "X" | "AE" | "VE";

export type FeatureGroup = { group: string; items: string[] };

export type NearbyIcon =
  | "beach"
  | "grocery"
  | "school"
  | "airport"
  | "park"
  | "shopping"
  | "city"
  | "water"
  | "culture"
  | "golf";

export type NearbyPlace = { label: string; time: string; icon: NearbyIcon };

export type Property = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: "FL";
  price: number;
  priceType: PriceType; // rent prices are per month
  beds: number;
  baths: number;
  sqft: number;
  type:
    | "Beach home"
    | "Waterfront home"
    | "Condo"
    | "Family home"
    | "Townhome"
    | "Luxury home"
    | "Golf course home";
  image: string;
  imageAlt: string;
  // Wide photo for the top of the detail page.
  wideImage: { src: string; alt: string };
  featured: boolean;
  isNew?: boolean;
  listedAt: string; // ISO date, used for "Newest" sorting

  // Detail page
  address: string;
  neighborhood: string;
  zip: string;
  description: string[];
  yearBuilt: number;
  lotSqft?: number;
  garage?: number; // spaces
  hoaMonthly?: number;
  taxesYearly?: number; // sale homes only
  deposit?: number; // rent homes only
  leaseTerm?: string; // rent homes only
  availableFrom?: string; // rent homes only (ISO)
  floodZone: FloodZone;
  features: FeatureGroup[];
  nearby: NearbyPlace[];
  agentId: string;
  coordinates: { lat: number; lng: number }; // approximate city center only
  views: number;
  saves: number;
};

// Homes with their own photo use /images/properties/<slug>.jpg. The
// featured homes still use placeholder photos.
export const properties: Property[] = [
  {
    id: "p-001",
    slug: "the-seagrass-house",
    name: "The Seagrass House",
    city: "Sarasota",
    state: "FL",
    price: 1_850_000,
    priceType: "sale",
    beds: 4,
    baths: 3.5,
    sqft: 3150,
    type: "Beach home",
    image: "/images/hero-mobile.jpg",
    imageAlt:
      "Living room of The Seagrass House in Sarasota, with a linen armchair and sea views",
    wideImage: {
      src: "/images/hero-desktop.jpg",
      alt: "Open living room with white sofas and a deck facing the sea",
    },
    featured: true,
    listedAt: "2026-09-24",
    address: "214 Seagrass Lane",
    neighborhood: "Siesta Shores",
    zip: "34242",
    description: [
      "The main floor opens from the kitchen to the living room in one long, bright space, with sliding doors that disappear into the walls.",
      "Out back, a saltwater pool and covered lanai make the most of the Gulf breeze, with an outdoor shower for sandy feet.",
      "The beach is a 4-minute walk down a quiet path, and the village shops and cafés are an easy bike ride away.",
    ],
    yearBuilt: 2019,
    lotSqft: 9800,
    garage: 2,
    hoaMonthly: 85,
    taxesYearly: 21_400,
    floodZone: "AE",
    features: [
      {
        group: "Interior",
        items: [
          "Open-concept kitchen",
          "Quartz countertops",
          "Impact windows",
          "Wide-plank oak floors",
          "Walk-in closets",
        ],
      },
      {
        group: "Exterior",
        items: [
          "Saltwater pool",
          "Covered lanai",
          "Outdoor shower",
          "Hurricane shutters",
        ],
      },
      {
        group: "Systems",
        items: [
          "Central air",
          "Tankless water heater",
          "Smart thermostat",
          "Solar panels",
        ],
      },
      {
        group: "Community",
        items: ["Beach access path", "Bike trails", "Dog park"],
      },
    ],
    nearby: [
      { label: "Beach", time: "4 min walk", icon: "beach" },
      { label: "Grocery", time: "6 min drive", icon: "grocery" },
      { label: "Elementary school", time: "8 min drive", icon: "school" },
      { label: "Airport", time: "25 min drive", icon: "airport" },
    ],
    agentId: "a-daniel",
    coordinates: { lat: 27.34, lng: -82.53 },
    views: 312,
    saves: 24,
  },
  {
    id: "p-002",
    slug: "bayfront-condo",
    name: "Bayfront Condo",
    city: "St. Petersburg",
    state: "FL",
    price: 689_000,
    priceType: "sale",
    beds: 2,
    baths: 2,
    sqft: 1380,
    type: "Condo",
    image: "/images/hero-desktop.jpg",
    imageAlt:
      "Open living area of Bayfront Condo in St. Petersburg, opening onto a deck by the water",
    wideImage: {
      src: "/images/hero-desktop.jpg",
      alt: "Open living area opening onto a deck by the water",
    },
    featured: true,
    listedAt: "2026-09-29",
    address: "500 Harborview Drive, Unit 1104",
    neighborhood: "Harborview North",
    zip: "33701",
    description: [
      "An eleventh-floor corner unit with windows on two sides, so the bay is in view from the kitchen, the living room, and the main bedroom.",
      "The building has a pool deck, a fitness room, and a 24-hour front desk, and the waterfront park is just across the street.",
    ],
    yearBuilt: 2016,
    garage: 1,
    hoaMonthly: 720,
    taxesYearly: 9_800,
    floodZone: "X",
    features: [
      {
        group: "Interior",
        items: [
          "Floor-to-ceiling windows",
          "Chef's kitchen",
          "In-unit laundry",
          "Porcelain tile floors",
        ],
      },
      {
        group: "Exterior",
        items: ["Private balcony", "Bay views", "Reserved parking"],
      },
      {
        group: "Systems",
        items: ["Central air", "Fire sprinklers", "Backup generator"],
      },
      {
        group: "Community",
        items: ["Pool deck", "Fitness room", "24-hour front desk"],
      },
    ],
    nearby: [
      { label: "Waterfront park", time: "2 min walk", icon: "park" },
      { label: "Grocery", time: "5 min walk", icon: "grocery" },
      { label: "Museums", time: "8 min walk", icon: "culture" },
      { label: "Airport", time: "20 min drive", icon: "airport" },
    ],
    agentId: "a-emma",
    coordinates: { lat: 27.77, lng: -82.64 },
    views: 268,
    saves: 19,
  },
  {
    id: "p-003",
    slug: "palm-shore-villa",
    name: "Palm Shore Villa",
    city: "Naples",
    state: "FL",
    price: 3_200_000,
    priceType: "sale",
    beds: 5,
    baths: 5,
    sqft: 4600,
    type: "Luxury home",
    image: "/images/hero-mobile.jpg",
    imageAlt:
      "Sunlit lounge at Palm Shore Villa in Naples, looking out to the sea",
    wideImage: {
      src: "/images/hero-desktop.jpg",
      alt: "Sunlit lounge with tall windows looking out to the sea",
    },
    featured: true,
    listedAt: "2026-10-03",
    address: "88 Palm Shore Court",
    neighborhood: "Coquina Point",
    zip: "34102",
    description: [
      "Five suites, each with its own bath, wrap around a central courtyard and a heated pool lined with royal palms.",
      "The great room has 20-foot ceilings and pocket doors that open fully to the lanai and summer kitchen.",
      "A private gate leads to the beach, and the town's restaurants are five minutes away.",
    ],
    yearBuilt: 2021,
    lotSqft: 16_500,
    garage: 3,
    hoaMonthly: 210,
    taxesYearly: 38_900,
    floodZone: "AE",
    features: [
      {
        group: "Interior",
        items: [
          "Five en-suite bedrooms",
          "Wine room",
          "Home office",
          "Stone floors",
          "Elevator",
        ],
      },
      {
        group: "Exterior",
        items: [
          "Heated pool and spa",
          "Summer kitchen",
          "Courtyard garden",
          "Impact glass",
        ],
      },
      {
        group: "Systems",
        items: [
          "Whole-home generator",
          "Smart home system",
          "Zoned air conditioning",
        ],
      },
      {
        group: "Community",
        items: ["Private beach gate", "Gated entry", "Tennis courts"],
      },
    ],
    nearby: [
      { label: "Beach", time: "3 min walk", icon: "beach" },
      { label: "Downtown shops", time: "5 min drive", icon: "shopping" },
      { label: "Golf club", time: "10 min drive", icon: "golf" },
      { label: "Airport", time: "15 min drive", icon: "airport" },
    ],
    agentId: "a-daniel",
    coordinates: { lat: 26.14, lng: -81.79 },
    views: 455,
    saves: 41,
  },
  {
    id: "p-004",
    slug: "driftwood-beach-house",
    name: "Driftwood Beach House",
    city: "Clearwater",
    state: "FL",
    price: 1_240_000,
    priceType: "sale",
    beds: 4,
    baths: 3,
    sqft: 2680,
    type: "Beach home",
    image: "/images/properties/driftwood-beach-house.jpg",
    imageAlt:
      "Living room of Driftwood Beach House in Clearwater, with sliding doors onto a deck above the dunes and the Gulf",
    wideImage: {
      src: "/images/properties/driftwood-beach-house-wide.jpg",
      alt: "Bright living room with a driftwood coffee table and sliding doors onto a deck above the dunes and the Gulf",
    },
    featured: false,
    isNew: true,
    listedAt: "2026-10-19",
    address: "17 Dune Walk",
    neighborhood: "Dune Harbor",
    zip: "33767",
    description: [
      "Sliding doors run the full width of the living room and open straight onto a deck above the dunes.",
      "Two of the four bedrooms have Gulf views, and the main suite has its own reading nook and a walk-in shower.",
      "A boardwalk from the back gate takes you onto the sand in under a minute.",
    ],
    yearBuilt: 2017,
    lotSqft: 7200,
    garage: 2,
    hoaMonthly: 60,
    taxesYearly: 14_600,
    floodZone: "VE",
    features: [
      {
        group: "Interior",
        items: [
          "Gas fireplace",
          "Built-in shelving",
          "Wide-plank floors",
          "Walk-in shower",
        ],
      },
      {
        group: "Exterior",
        items: ["Dune-view deck", "Private boardwalk", "Outdoor shower"],
      },
      {
        group: "Systems",
        items: ["Impact windows", "Central air", "Elevated foundation"],
      },
      {
        group: "Community",
        items: ["Beach access", "Bike path", "Sunset pier"],
      },
    ],
    nearby: [
      { label: "Beach", time: "1 min walk", icon: "beach" },
      { label: "Grocery", time: "7 min drive", icon: "grocery" },
      { label: "Elementary school", time: "10 min drive", icon: "school" },
      { label: "Airport", time: "30 min drive", icon: "airport" },
    ],
    agentId: "a-emma",
    coordinates: { lat: 27.97, lng: -82.8 },
    views: 198,
    saves: 17,
  },
  {
    id: "p-005",
    slug: "harbor-lights-condo",
    name: "Harbor Lights Condo",
    city: "Tampa",
    state: "FL",
    price: 3100,
    priceType: "rent",
    beds: 2,
    baths: 2,
    sqft: 1210,
    type: "Condo",
    image: "/images/properties/harbor-lights-condo.jpg",
    imageAlt:
      "Living room of Harbor Lights Condo in Tampa, with floor-to-ceiling windows over the water and city skyline",
    wideImage: {
      src: "/images/properties/harbor-lights-condo-wide.jpg",
      alt: "High-rise living room with floor-to-ceiling windows over the river and downtown skyline",
    },
    featured: false,
    isNew: true,
    listedAt: "2026-10-18",
    address: "1200 Channel Walk, Unit 1508",
    neighborhood: "Channel Point",
    zip: "33602",
    description: [
      "A fifteenth-floor condo with a curved wall of glass looking over the river and the downtown skyline.",
      "The open kitchen has a breakfast bar, and both bedrooms have their own bath and a large closet.",
    ],
    yearBuilt: 2018,
    garage: 1,
    hoaMonthly: 0,
    deposit: 3100,
    leaseTerm: "12 months",
    availableFrom: "2026-11-01",
    floodZone: "X",
    features: [
      {
        group: "Interior",
        items: [
          "Floor-to-ceiling windows",
          "Breakfast bar",
          "In-unit laundry",
          "Walk-in closets",
        ],
      },
      {
        group: "Exterior",
        items: ["Wraparound balcony", "Skyline views", "Covered parking"],
      },
      {
        group: "Systems",
        items: ["Central air", "Keyless entry", "Fiber internet"],
      },
      {
        group: "Community",
        items: ["Rooftop pool", "Fitness center", "Riverwalk access"],
      },
    ],
    nearby: [
      { label: "Riverwalk", time: "3 min walk", icon: "water" },
      { label: "Grocery", time: "6 min walk", icon: "grocery" },
      { label: "Downtown offices", time: "5 min drive", icon: "city" },
      { label: "Airport", time: "15 min drive", icon: "airport" },
    ],
    agentId: "a-sofia",
    coordinates: { lat: 27.95, lng: -82.46 },
    views: 342,
    saves: 29,
  },
  {
    id: "p-006",
    slug: "mangrove-bay-retreat",
    name: "Mangrove Bay Retreat",
    city: "Sarasota",
    state: "FL",
    price: 975_000,
    priceType: "sale",
    beds: 3,
    baths: 2.5,
    sqft: 2240,
    type: "Waterfront home",
    image: "/images/properties/mangrove-bay-retreat.jpg",
    imageAlt:
      "Living room of Mangrove Bay Retreat in Sarasota, with wide windows facing a private dock and mangroves",
    wideImage: {
      src: "/images/properties/mangrove-bay-retreat-wide.jpg",
      alt: "Living room with wood ceiling beams and wide windows facing a private dock and mangroves",
    },
    featured: false,
    isNew: true,
    listedAt: "2026-10-16",
    address: "406 Heron Point Road",
    neighborhood: "Heron Bay",
    zip: "34231",
    description: [
      "Wood-beamed ceilings and a long picture window frame the private dock and the mangroves across the bay.",
      "The dock has a boat lift and power, and there's no bridge between you and open water.",
      "Inside, the kitchen and dining area open to a screened porch made for slow mornings.",
    ],
    yearBuilt: 2008,
    lotSqft: 11_200,
    garage: 2,
    hoaMonthly: 0,
    taxesYearly: 11_900,
    floodZone: "AE",
    features: [
      {
        group: "Interior",
        items: [
          "Wood ceiling beams",
          "Picture windows",
          "Wine fridge",
          "Hardwood floors",
        ],
      },
      {
        group: "Exterior",
        items: ["Private dock", "10,000 lb boat lift", "Screened porch"],
      },
      {
        group: "Systems",
        items: ["Impact windows", "New roof (2023)", "Central air"],
      },
      {
        group: "Community",
        items: ["No HOA", "Kayak launch", "Nature preserve"],
      },
    ],
    nearby: [
      { label: "Bay access", time: "On site", icon: "water" },
      { label: "Grocery", time: "8 min drive", icon: "grocery" },
      { label: "Elementary school", time: "9 min drive", icon: "school" },
      { label: "Airport", time: "25 min drive", icon: "airport" },
    ],
    agentId: "a-daniel",
    coordinates: { lat: 27.34, lng: -82.53 },
    views: 221,
    saves: 22,
  },
  {
    id: "p-007",
    slug: "coral-street-bungalow",
    name: "Coral Street Bungalow",
    city: "St. Petersburg",
    state: "FL",
    price: 2450,
    priceType: "rent",
    beds: 3,
    baths: 2,
    sqft: 1520,
    type: "Family home",
    image: "/images/properties/coral-street-bungalow.jpg",
    imageAlt:
      "Living room of Coral Street Bungalow in St. Petersburg, with a white brick fireplace and a green sofa",
    wideImage: {
      src: "/images/properties/coral-street-bungalow-wide.jpg",
      alt: "Cozy living room with a white brick fireplace, built-in bookshelves, and a green sofa",
    },
    featured: false,
    isNew: true,
    listedAt: "2026-10-14",
    address: "2318 Coral Street North",
    neighborhood: "Coral Heights",
    zip: "33704",
    description: [
      "A 1920s bungalow with original oak floors, a white brick fireplace, and built-in bookshelves.",
      "The fenced backyard has shade trees and room for a garden, and the streets nearby are lined with brick sidewalks.",
    ],
    yearBuilt: 1926,
    lotSqft: 6400,
    garage: 1,
    deposit: 2450,
    leaseTerm: "12 months",
    availableFrom: "2026-11-15",
    floodZone: "X",
    features: [
      {
        group: "Interior",
        items: [
          "Original oak floors",
          "Brick fireplace",
          "Built-in bookshelves",
          "Arched doorways",
        ],
      },
      {
        group: "Exterior",
        items: ["Fenced backyard", "Front porch", "Detached garage"],
      },
      {
        group: "Systems",
        items: ["Central air", "Washer and dryer", "Ceiling fans"],
      },
      {
        group: "Community",
        items: ["Walkable streets", "Parks nearby", "Pet friendly"],
      },
    ],
    nearby: [
      { label: "Park", time: "3 min walk", icon: "park" },
      { label: "Grocery", time: "5 min drive", icon: "grocery" },
      { label: "Elementary school", time: "6 min drive", icon: "school" },
      { label: "Downtown", time: "8 min drive", icon: "city" },
    ],
    agentId: "a-marcus",
    coordinates: { lat: 27.77, lng: -82.64 },
    views: 287,
    saves: 33,
  },
  {
    id: "p-008",
    slug: "sunset-key-villa",
    name: "Sunset Key Villa",
    city: "Naples",
    state: "FL",
    price: 2_650_000,
    priceType: "sale",
    beds: 5,
    baths: 4.5,
    sqft: 4100,
    type: "Luxury home",
    image: "/images/properties/sunset-key-villa.jpg",
    imageAlt:
      "Double-height living room of Sunset Key Villa in Naples, opening to an infinity pool at sunset",
    wideImage: {
      src: "/images/properties/sunset-key-villa-wide.jpg",
      alt: "Double-height living room opening to an infinity pool and the Gulf at sunset",
    },
    featured: false,
    isNew: true,
    listedAt: "2026-10-12",
    address: "9 Sunset Key Drive",
    neighborhood: "Sunset Estates",
    zip: "34103",
    description: [
      "A double-height great room opens to an infinity-edge pool that lines up with the sunset over the Gulf.",
      "The upstairs gallery leads to four guest suites, and the main suite has its own terrace.",
      "Travertine floors run from the kitchen out to the pool deck in one continuous surface.",
    ],
    yearBuilt: 2020,
    lotSqft: 14_800,
    garage: 3,
    hoaMonthly: 180,
    taxesYearly: 32_500,
    floodZone: "AE",
    features: [
      {
        group: "Interior",
        items: [
          "Double-height great room",
          "Travertine floors",
          "Glass-rail gallery",
          "Chef's kitchen",
        ],
      },
      {
        group: "Exterior",
        items: ["Infinity-edge pool", "Sunset terrace", "Outdoor kitchen"],
      },
      {
        group: "Systems",
        items: [
          "Whole-home generator",
          "Smart lighting",
          "Zoned air conditioning",
        ],
      },
      {
        group: "Community",
        items: ["Gated entry", "Beach club", "Marina nearby"],
      },
    ],
    nearby: [
      { label: "Beach", time: "5 min walk", icon: "beach" },
      { label: "Grocery", time: "7 min drive", icon: "grocery" },
      { label: "Private school", time: "10 min drive", icon: "school" },
      { label: "Airport", time: "18 min drive", icon: "airport" },
    ],
    agentId: "a-daniel",
    coordinates: { lat: 26.14, lng: -81.79 },
    views: 506,
    saves: 52,
  },
  {
    id: "p-009",
    slug: "pelican-point-townhome",
    name: "Pelican Point Townhome",
    city: "Tampa",
    state: "FL",
    price: 545_000,
    priceType: "sale",
    beds: 3,
    baths: 2.5,
    sqft: 1860,
    type: "Townhome",
    image: "/images/properties/pelican-point-townhome.jpg",
    imageAlt:
      "Open living room and kitchen of Pelican Point Townhome in Tampa, with doors to a small patio garden",
    wideImage: {
      src: "/images/properties/pelican-point-townhome-wide.jpg",
      alt: "Open living room and white kitchen with a navy sofa and glass doors to a patio garden",
    },
    featured: false,
    isNew: true,
    listedAt: "2026-10-10",
    address: "3402 Pelican Point Way",
    neighborhood: "Pelican Commons",
    zip: "33609",
    description: [
      "The main floor flows from a white kitchen with a long island into the living room and out to a private patio garden.",
      "Upstairs, three bedrooms include a main suite with a double vanity and a walk-in closet.",
    ],
    yearBuilt: 2022,
    lotSqft: 2100,
    garage: 2,
    hoaMonthly: 295,
    taxesYearly: 7_900,
    floodZone: "X",
    features: [
      {
        group: "Interior",
        items: [
          "Kitchen island",
          "Stainless appliances",
          "Luxury vinyl floors",
          "Double vanity",
        ],
      },
      {
        group: "Exterior",
        items: ["Patio garden", "Attached garage", "Low-maintenance yard"],
      },
      {
        group: "Systems",
        items: ["Central air", "Smart thermostat", "Energy Star windows"],
      },
      {
        group: "Community",
        items: ["Community pool", "Walking trails", "Playground"],
      },
    ],
    nearby: [
      { label: "Shopping center", time: "4 min drive", icon: "shopping" },
      { label: "Grocery", time: "5 min drive", icon: "grocery" },
      { label: "Elementary school", time: "7 min drive", icon: "school" },
      { label: "Airport", time: "10 min drive", icon: "airport" },
    ],
    agentId: "a-marcus",
    coordinates: { lat: 27.95, lng: -82.46 },
    views: 176,
    saves: 14,
  },
];

export const featuredProperties = properties.filter((p) => p.featured);
export const newProperties = properties.filter((p) => p.isNew);

export function getProperty(slug: string | undefined) {
  return properties.find((p) => p.slug === slug);
}

export const featuredHomesSection = {
  label: "Featured homes",
  heading: "Homes we love right now",
  viewAll: { label: "View all homes", to: "/properties" },
};

export const latestSection = {
  label: "Just listed",
  heading: "New homes this week",
  viewAll: { label: "View all homes", to: "/properties" },
};

// Shared wording for property cards and pages.
export const propertyLabels = {
  status: { sale: "For sale", rent: "For rent" } satisfies Record<
    PriceType,
    string
  >,
  facts: { beds: "bedrooms", baths: "bathrooms", sqft: "square feet" },
};
