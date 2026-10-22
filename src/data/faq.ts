// Fictional data for demo purposes only.

export type FaqItem = { id: string; q: string; a: string };

export type FaqCategory = { id: string; title: string; items: FaqItem[] };

export const faqCategories: FaqCategory[] = [
  {
    id: "buying",
    title: "Buying",
    items: [
      {
        id: "start-looking",
        q: "How do I start looking for a home with Haven?",
        a: "Browse homes on our site, then schedule a tour or talk to an agent. We'll ask about your budget, timing, and must-haves, then send homes that fit.",
      },
      {
        id: "down-payment",
        q: "How much do I need for a down payment?",
        a: "It depends on your loan. Many buyers put down 3–20%. Our agents can connect you with lenders to see what fits you.",
      },
      {
        id: "buyer-fees",
        q: "Do I pay Haven to help me buy?",
        a: "In most cases, our fee is agreed on before you start and is often paid at closing. We'll explain all costs upfront.",
      },
      {
        id: "out-of-state",
        q: "Can I buy a home if I live out of state?",
        a: "Yes. We offer video tours, digital paperwork, and remote closings for out-of-state buyers.",
      },
      {
        id: "how-long-to-buy",
        q: "How long does it take to buy a home?",
        a: "Most purchases take 30–45 days from accepted offer to closing.",
      },
    ],
  },
  {
    id: "selling",
    title: "Selling",
    items: [
      {
        id: "home-value",
        q: "How do I know what my home is worth?",
        a: "Request a free home value check. An agent will compare recent sales nearby and visit your home if you'd like.",
      },
      {
        id: "how-fast-to-sell",
        q: "How fast can Haven sell my home?",
        a: "Our listings sell in about 21 days on average, depending on price, condition, and the market.",
      },
      {
        id: "repairs-before-selling",
        q: "Do I need to make repairs before selling?",
        a: "Not always. We'll suggest simple, affordable updates that are most likely to raise your sale price.",
      },
      {
        id: "marketing",
        q: "What does Haven do to market my home?",
        a: "Professional photos and video, online listings, social media, open houses, and outreach to local buyers' agents.",
      },
    ],
  },
  {
    id: "renting",
    title: "Renting",
    items: [
      {
        id: "rental-fees",
        q: "Are there fees to rent through Haven?",
        a: "Touring is always free. Any application or lease fees are shown clearly on each listing before you apply.",
      },
      {
        id: "rental-application",
        q: "What do I need to apply for a rental?",
        a: "Usually a photo ID, proof of income, rental history, and a credit check. Your agent will tell you exactly what's needed.",
      },
      {
        id: "rental-scams",
        q: "How do I avoid rental scams?",
        a: "Every Haven rental is checked by an agent in person. Never pay a deposit before touring and signing a lease.",
      },
      {
        id: "pets",
        q: "Can I rent with pets?",
        a: "Many homes are pet friendly. Use the filters or ask your agent about pet policies and deposits.",
      },
    ],
  },
  {
    id: "gulf-coast",
    title: "Living on the Gulf Coast",
    items: [
      {
        id: "flood-zone",
        q: "What does a flood zone mean?",
        a: "Flood zones show an area's flood risk. Homes in higher-risk zones often need flood insurance. We show the zone on every listing.",
      },
      {
        id: "insurance-cost",
        q: "Is home insurance expensive in Florida?",
        a: "It can be higher near the coast. Newer homes with impact windows and updated roofs often cost less to insure.",
      },
      {
        id: "hurricane-season",
        q: "When is hurricane season?",
        a: "June 1 to November 30. Many homes have shutters or impact windows, and we'll share tips on getting ready.",
      },
      {
        id: "best-for-families",
        q: "Which area is best for families?",
        a: "It depends on what you value. Our neighborhood guides compare schools, commutes, and lifestyle for each city.",
      },
    ],
  },
  {
    id: "about-haven",
    title: "About Haven",
    items: [
      {
        id: "areas-served",
        q: "Which areas do you serve?",
        a: "Tampa, St. Petersburg, Clearwater, Sarasota, and Naples.",
      },
      {
        id: "contact-an-agent",
        q: "How do I contact an agent?",
        a: "Call (727) 555-0148, email hello@haven.example.com, or use the contact form, and an agent will get back to you.",
      },
      {
        id: "licensed-agents",
        q: "Are your agents licensed?",
        a: "Yes. Every Haven agent is a licensed Florida real estate agent.",
      },
    ],
  },
];

export const faqPage = {
  meta: {
    title: "FAQ",
    description:
      "Answers to common questions about buying, selling, and renting a home on Florida's Gulf Coast with Haven.",
  },
  heading: "Questions? We've got answers.",
  subtext:
    "Everything you need to know about buying, selling, and renting with Haven.",
  search: {
    label: "Search questions",
    placeholder: "Search questions",
    clear: "Clear search",
    results: (count: number) =>
      `${count} ${count === 1 ? "question" : "questions"} found`,
    empty: "No results. Try another word, or",
    emptyLink: "contact us",
  },
  categoriesLabel: "Categories",
  copyLink: "Copy link",
  copyLinkLabel: (question: string) => `Copy link to "${question}"`,
  linkCopied: "Link copied",
  copyFailed: "Couldn't copy the link",
  bottom: {
    heading: "Still have a question?",
    text: "Our team is happy to help with anything not covered here.",
    contact: { label: "Contact us", to: "/contact" },
    call: { label: "Call (727) 555-0148", phone: "+17275550148" },
  },
};
