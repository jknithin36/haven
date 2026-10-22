// Fictional data for demo purposes only. All agents are made-up people.
// Certifications marked "fictional" below are invented for the demo.

export type AgentFocus = "buying" | "selling" | "renting" | "waterfront";

export type Agent = {
  id: string;
  slug: string;
  name: string;
  title: string;
  photo?: string; // initials show until a photo exists
  photoAlt: string;
  areas: string[];
  years: number;
  stat: { value: string; label: string }; // e.g. "140+", "homes sold"
  rating: number;
  reviewCount: number;
  phone: string;
  email: string;
  languages: string[];
  specialties: string[];
  focus: AgentFocus[]; // which /agents filter chips include this agent
  shortBio: string; // 1–2 sentences for cards
  bio: string[]; // paragraphs for the profile page
  quote: string;
  credentials: string[];
  funFact: string;
};

export const agents: Agent[] = [
  {
    id: "a-emma",
    slug: "emma-lawson",
    name: "Emma Lawson",
    title: "Senior agent",
    photoAlt: "Portrait of Emma Lawson",
    areas: ["Clearwater", "St. Petersburg"],
    years: 11,
    stat: { value: "140+", label: "homes sold" },
    rating: 4.9,
    reviewCount: 132,
    phone: "(727) 555-0161",
    email: "emma@haven.example.com",
    languages: ["English", "Spanish"],
    specialties: ["First-time buyers", "Family homes", "Relocation"],
    focus: ["buying"],
    shortBio:
      "Emma helps families and first-time buyers find homes near great schools and quiet streets, with clear advice at every step.",
    bio: [
      "Emma grew up in Clearwater and has spent more than a decade helping families find their first home on the Gulf Coast. She's known for explaining every step in plain language, from inspections to insurance.",
      "Many of her clients are moving from out of state. Emma runs video tours, sends honest notes about each street, and makes sure there are no surprises after closing.",
      "Outside of work, you'll find her paddleboarding at sunrise or cheering at her kids' soccer games.",
    ],
    quote:
      "Buying a home should feel exciting, not stressful. My job is to make sure you understand every choice.",
    credentials: [
      "Licensed Florida real estate agent",
      "Certified relocation specialist", // fictional
      "Haven Top Agent 2024 and 2025",
    ],
    funFact: "Has tried every taco spot between Clearwater and St. Petersburg.",
  },
  {
    id: "a-marcus",
    slug: "marcus-reid",
    name: "Marcus Reid",
    title: "Listing specialist",
    photoAlt: "Portrait of Marcus Reid",
    areas: ["St. Petersburg", "Tampa"],
    years: 9,
    stat: { value: "110+", label: "homes sold" },
    rating: 4.9,
    reviewCount: 98,
    phone: "(727) 555-0162",
    email: "marcus@haven.example.com",
    languages: ["English"],
    specialties: ["Selling homes", "Condos", "Pricing strategy"],
    focus: ["selling"],
    shortBio:
      "Marcus helps sellers price right, prepare well, and sell fast, often above asking.",
    bio: [
      "Marcus started his career in home staging before becoming an agent, so he knows exactly how to make a home shine. His listings sell in an average of 12 days.",
      "He builds a clear plan for every seller: a fair price based on real sales, simple updates that add value, and professional photos and video.",
      "On weekends, Marcus restores old furniture and plays pickup basketball.",
    ],
    quote:
      "The right price and the right first impression sell a home. I take care of both.",
    credentials: [
      "Licensed Florida real estate agent",
      "Certified pricing strategist", // fictional
      "Former home stager",
    ],
    funFact: "Can tell you the sunset time over the bay any day of the year.",
  },
  {
    id: "a-sofia",
    slug: "sofia-delgado",
    name: "Sofia Delgado",
    title: "Rentals specialist",
    photoAlt: "Portrait of Sofia Delgado",
    areas: ["Tampa"],
    years: 6,
    stat: { value: "300+", label: "leases signed" },
    rating: 5,
    reviewCount: 176,
    phone: "(813) 555-0163",
    email: "sofia@haven.example.com",
    languages: ["English", "Spanish", "Portuguese"],
    specialties: ["Rentals", "Young professionals", "Relocation for work"],
    focus: ["renting"],
    shortBio:
      "Sofia helps renters find great places in Tampa quickly, with clear leases and no hidden fees.",
    bio: [
      "Sofia has helped more than 300 renters find their next home in Tampa, from first apartments to family rentals. She checks every listing in person, so you never fall for a scam.",
      "She walks you through every lease line by line and helps your application stand out, especially if you're new to the area.",
      "When she's not showing rentals, Sofia teaches salsa classes and explores new coffee shops.",
    ],
    quote:
      "Renting should feel safe and simple. I'm on your side from the first tour to move-in day.",
    credentials: [
      "Licensed Florida real estate agent",
      "Certified rental specialist", // fictional
      "Fluent in three languages",
    ],
    funFact: "Knows the best happy hour in every Tampa neighborhood.",
  },
  {
    id: "a-daniel",
    slug: "daniel-brooks",
    name: "Daniel Brooks",
    title: "Waterfront specialist",
    photoAlt: "Portrait of Daniel Brooks",
    areas: ["Sarasota", "Naples"],
    years: 14,
    stat: { value: "180+", label: "homes sold" },
    rating: 4.8,
    reviewCount: 154,
    phone: "(941) 555-0164",
    email: "daniel@haven.example.com",
    languages: ["English", "German"],
    specialties: ["Waterfront homes", "Luxury homes", "Second homes"],
    focus: ["buying", "waterfront"],
    shortBio:
      "Daniel helps buyers find waterfront and luxury homes in Sarasota and Naples, with expert advice on docks, flood zones, and insurance.",
    bio: [
      "Daniel has spent 14 years selling homes on the water, from canal-front cottages to luxury estates. He knows which docks need work, which streets flood, and which homes are priced fairly.",
      "Many of his clients are buying second homes or retiring to the coast. Daniel coordinates inspections, insurance quotes, and closings, even when clients live far away.",
      "A lifelong boater, he spends his free time fishing and sailing with his family.",
    ],
    quote:
      "A waterfront home is a dream. I make sure it doesn't come with any surprises.",
    credentials: [
      "Licensed Florida real estate agent",
      "Certified luxury home specialist", // fictional
      "Coastal property and flood risk training",
    ],
    funFact: "Has sailed the entire Gulf Coast from Tampa to Naples.",
  },
];

export function getAgent(id: string) {
  return agents.find((agent) => agent.id === id);
}

export function getAgentBySlug(slug: string | undefined) {
  return agents.find((agent) => agent.slug === slug);
}

// "140+ homes sold"
export function agentStat(agent: Agent) {
  return `${agent.stat.value} ${agent.stat.label}`;
}

export function firstName(agent: Agent) {
  return agent.name.split(" ")[0];
}

// "Emma Lawson" → "EL", shown until an agent has a photo.
export function agentInitials(agent: Agent) {
  return agent.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}
