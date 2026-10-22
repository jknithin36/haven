// Fictional data for demo purposes only. Haven, its founders, agents, dates,
// and numbers are all made up.

export type ValueIcon = "honesty" | "local" | "calm" | "after";

export type ProcessTab = "buying" | "selling" | "renting";

export type ProcessStep = { title: string; text: string };

export type AboutStat = {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
};

// Placeholder photos until /images/about-page/hero.webp and story.webp exist.
// Alt text describes the placeholder.
export const aboutPage = {
  meta: {
    title: "About Haven | Local real estate on Florida's Gulf Coast",
    description:
      "Haven is a small team of local agents on Florida's Gulf Coast. Since 2011, we've helped more than 1,200 families buy, sell, and rent with honest advice and no pressure.",
  },

  hero: {
    heading: "Homes you love coming back to.",
    text: "A small team of local agents on Florida's Gulf Coast since 2011.",
    image: "/images/hero-desktop.jpg",
    imageAlt:
      "Bright living room with white sofas opening onto a deck by the sea",
  },

  story: {
    label: "Our story",
    heading: "Started on one street in St. Petersburg",
    paragraphs: [
      "Haven began in 2011 when two neighbors, Claire Bennett and Omar Hassan, noticed how stressful buying a home had become. Too much pressure, too little honesty, and too many surprises after closing.",
      "They opened a small office with one simple promise: tell people the truth about every home, every street, and every cost, even when it means losing a sale.",
      "Today, Haven has 18 agents across five Gulf Coast cities, but that promise hasn't changed.",
    ],
    image: "/images/hero-mobile.jpg",
    imageAlt:
      "Sunny corner with a linen armchair beside a tall window over the sea",
    quote:
      "The best compliment we get is when clients send their friends to us.",
    quoteName: "Claire Bennett",
    quoteRole: "Co-founder",
  },

  stats: {
    label: "Haven in numbers",
    items: [
      { value: 1200, suffix: "+", label: "Homes sold and rented" },
      { value: 15, suffix: "", label: "Years on the Gulf Coast" },
      { value: 18, suffix: "", label: "Local agents" },
      { value: 4.9, suffix: "", label: "Average client rating", decimals: 1 },
    ] satisfies AboutStat[],
  },

  values: {
    label: "What we believe",
    heading: "How we work, every day",
    items: [
      {
        icon: "honesty",
        title: "Honesty first",
        text: "We tell you about flood zones, repairs, and real costs upfront, even when it's not what you want to hear.",
      },
      {
        icon: "local",
        title: "Local, for real",
        text: "Our agents live in the neighborhoods they sell, so they know every street, school, and shortcut.",
      },
      {
        icon: "calm",
        title: "No pressure",
        text: "Take your time. We'll never push you into a home or a price that doesn't feel right.",
      },
      {
        icon: "after",
        title: "With you after closing",
        text: "Need a contractor, an insurance tip, or a moving checklist? We're still here.",
      },
    ] satisfies { icon: ValueIcon; title: string; text: string }[],
  },

  process: {
    label: "How it works",
    heading: "Simple steps, whatever your next move",
    tabsLabel: "Choose what you're planning",
    tabs: { buying: "Buying", selling: "Selling", renting: "Renting" },
    steps: {
      buying: [
        {
          title: "Tell us what you need",
          text: "Share your budget, must-haves, and the areas you're curious about.",
        },
        {
          title: "Tour homes that fit",
          text: "See a short list of homes that match, in person or by video.",
        },
        {
          title: "Make a confident offer",
          text: "We'll walk you through pricing, inspections, and insurance before you sign.",
        },
        {
          title: "Close and get your keys",
          text: "We handle the paperwork and stay with you until moving day.",
        },
      ],
      selling: [
        {
          title: "Free home value check",
          text: "Get an honest price range based on recent sales on your street.",
        },
        {
          title: "Prep, photos, and pricing",
          text: "Simple fixes, professional photos, and a price that brings in buyers.",
        },
        {
          title: "Showings and offers",
          text: "We schedule showings and help you compare every offer side by side.",
        },
        {
          title: "Close on your timeline",
          text: "Pick a closing date that works for your next move.",
        },
      ],
      renting: [
        {
          title: "Share your budget and move date",
          text: "Tell us when you need to move and what you can spend each month.",
        },
        {
          title: "Tour verified rentals",
          text: "Every rental we show is checked, so there are no fake listings.",
        },
        {
          title: "Apply with help",
          text: "We help you gather documents and send a strong application.",
        },
        {
          title: "Sign and move in",
          text: "Review the lease with us, sign, and get your keys.",
        },
      ],
    } satisfies Record<ProcessTab, ProcessStep[]>,
    stepNumber: (n: number) => String(n).padStart(2, "0"),
  },

  milestones: {
    label: "Our journey",
    heading: "From two agents to five cities",
    items: [
      { year: 2011, text: "Haven opens in St. Petersburg with 2 agents" },
      { year: 2014, text: "First 100 homes sold" },
      { year: 2017, text: "Opens offices in Clearwater and Tampa" },
      { year: 2020, text: "Launches virtual tours for out-of-state buyers" },
      { year: 2023, text: "Expands to Sarasota and Naples" },
      { year: 2026, text: "1,200+ homes sold and rented" },
    ],
  },

  team: {
    label: "Our team",
    heading: "Meet a few of our agents",
    cta: { label: "Meet the whole team", to: "/agents" },
    areas: (areas: string[]) => areas.join(" & "),
  },

  review: {
    label: "Client stories",
    heading: "In their words",
    reviewId: "shah",
  },
};
