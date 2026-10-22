// Fictional data for demo purposes only.

export type Article = {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string; // ISO
  readMinutes: number;
  excerpt: string;
  image: string;
  imageAlt: string;
  body: ArticleBlock[];
};

// Article content: paragraphs, section headings, and bullet lists.
export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] };

// Placeholder photos until the article images exist (planned paths:
// /images/articles/flood-zone.webp, home-value.webp, renting-gulf-coast.webp).
// Alt text describes the placeholder.
export const articles: Article[] = [
  {
    id: "a-001",
    slug: "buying-a-home-in-a-flood-zone",
    title: "What to know before buying a home in a flood zone",
    category: "Home Buying",
    date: "2026-10-14",
    readMinutes: 6,
    excerpt:
      "Flood maps, insurance costs, and the questions to ask before you make an offer.",
    image: "/images/hero-desktop.jpg",
    imageAlt: "Open living room leading onto a deck by the sea",
    body: [
      {
        type: "p",
        text: "Flood risk is part of life on the Gulf Coast. That doesn't mean you should avoid the water, but it does mean you should know exactly what you're buying before you make an offer.",
      },
      { type: "h2", text: "What a flood zone tells you" },
      {
        type: "p",
        text: "Flood maps sort land into zones by how likely it is to flood. They're a starting point, not a guarantee, and they can change as maps are updated.",
      },
      {
        type: "list",
        items: [
          "Zone X: lower risk. Flood insurance is usually optional.",
          "Zone AE: higher risk. Lenders usually require flood insurance.",
          "Zone VE: coastal high-risk area with storm waves. Insurance is required and costs more.",
        ],
      },
      { type: "h2", text: "Ask for the elevation certificate" },
      {
        type: "p",
        text: "An elevation certificate shows how high the home sits compared with expected flood levels. Homes built higher often cost less to insure, so this one document can change your monthly budget.",
      },
      { type: "h2", text: "Get insurance quotes early" },
      {
        type: "p",
        text: "Don't wait until closing. Ask for flood and homeowners quotes as soon as you're serious about a home, and add them to your monthly cost before you decide what to offer.",
      },
      { type: "h2", text: "Questions to ask before you offer" },
      {
        type: "list",
        items: [
          "Has the home ever flooded, and was a claim filed?",
          "When was the roof replaced, and are the windows impact rated?",
          "Is there a current flood insurance policy that can be transferred?",
          "How did the street handle the last big storm?",
        ],
      },
      {
        type: "p",
        text: "Your Haven agent can pull the flood zone, past claims, and elevation details for any home we show you, so you can decide with the full picture.",
      },
    ],
  },
  {
    id: "a-002",
    slug: "raise-your-home-value-before-selling",
    title: "5 easy ways to raise your home's value before selling",
    category: "Selling",
    date: "2026-10-07",
    readMinutes: 4,
    excerpt:
      "Small, affordable updates that help homes sell faster and for more.",
    image: "/images/hero-mobile.jpg",
    imageAlt: "Bright, freshly styled corner with a linen armchair",
    body: [
      {
        type: "p",
        text: "You don't need a full renovation to sell well. A few small, affordable updates can help your home stand out online and sell faster.",
      },
      { type: "h2", text: "1. Freshen the paint" },
      {
        type: "p",
        text: "Neutral, light colors make rooms look bigger and brighter in photos. Start with the rooms buyers see first: the entry, living room, and kitchen.",
      },
      { type: "h2", text: "2. Fix the little things" },
      {
        type: "p",
        text: "Loose handles, dripping taps, and stuck doors make buyers wonder what else has been missed. A weekend of small repairs builds confidence.",
      },
      { type: "h2", text: "3. Boost curb appeal" },
      {
        type: "list",
        items: [
          "Trim plants and clear the walkway.",
          "Wash the front door and add a new doormat.",
          "Replace tired outdoor lights and house numbers.",
        ],
      },
      { type: "h2", text: "4. Clear the clutter" },
      {
        type: "p",
        text: "Pack away personal photos and extra furniture. Buyers want to picture their own life in the space, and clear rooms photograph better.",
      },
      { type: "h2", text: "5. Let in the light" },
      {
        type: "p",
        text: "Clean the windows, open every blind, and swap dim bulbs for brighter ones. Light is one of the first things buyers notice in a coastal home.",
      },
      {
        type: "p",
        text: "Not sure where to start? Ask for a free home value check, and your agent will tell you which updates are worth it for your home.",
      },
    ],
  },
  {
    id: "a-003",
    slug: "first-year-renting-on-the-gulf-coast",
    title: "Your first year renting on the Gulf Coast",
    category: "Renting",
    date: "2026-09-30",
    readMinutes: 5,
    excerpt: "Hurricane season, leases, and choosing the right neighborhood.",
    image: "/images/hero-desktop.jpg",
    imageAlt: "Sunlit living room with white sofas and water views",
    body: [
      {
        type: "p",
        text: "Renting on the Gulf Coast is a great way to learn the area before you buy. Here's what to know so your first year goes smoothly.",
      },
      { type: "h2", text: "Pick the right neighborhood" },
      {
        type: "p",
        text: "Think about your commute, how close you want to be to the beach, and how lively you like your street. Visit at different times of day before you sign.",
      },
      { type: "h2", text: "Read the lease carefully" },
      {
        type: "list",
        items: [
          "How long is the lease, and what happens if you need to leave early?",
          "Who handles repairs, and how do you report them?",
          "Are pets allowed, and is there an extra deposit?",
          "Which utilities are included in the rent?",
        ],
      },
      { type: "h2", text: "Be ready for hurricane season" },
      {
        type: "p",
        text: "Hurricane season runs from June to November. Ask your landlord how the home is protected, who installs shutters, and what the plan is if you need to leave.",
      },
      {
        type: "p",
        text: "Renters insurance is usually affordable and protects your belongings. Most policies don't cover flooding, so ask about flood coverage too.",
      },
      { type: "h2", text: "Protect yourself from scams" },
      {
        type: "p",
        text: "Never pay a deposit before you've toured the home and signed a lease. Every Haven rental is checked in person by an agent before it's listed.",
      },
    ],
  },
];

export const articlesSection = {
  label: "Guides",
  heading: "Tips for buying, selling, and renting",
  viewAll: { label: "View all guides", to: "/guides" },
  readMore: "Read more",
};
