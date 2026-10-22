// Fictional data for demo purposes only.

export const propertiesPage = {
  meta: {
    title: "Homes for sale and rent",
    description:
      "Browse beach homes, waterfront retreats, condos, and family houses for sale and rent across Florida's Gulf Coast, from Tampa to Naples.",
  },
  heading: "Homes across Florida's Gulf Coast",
  subtext:
    "Browse beach homes, waterfront retreats, condos, and family houses.",
  filters: {
    label: "Filter homes",
    location: "Location",
    type: "Type",
    price: "Price",
    beds: "Beds",
    status: "Status",
    sort: "Sort",
    priceGroups: { sale: "For sale", rent: "For rent" },
    clearAll: "Clear all",
    open: "Filters",
    sheetTitle: "Filter homes",
    activeCount: (n: number) => `${n} active`,
    show: (n: number) => `Show ${n} ${n === 1 ? "home" : "homes"}`,
  },
  results: (count: number, location?: string) =>
    `${count} ${count === 1 ? "home" : "homes"}${location ? ` in ${location}` : ""}`,
  chips: {
    beds: (label: string) => `${label} beds`,
    remove: (label: string) => `Remove filter: ${label}`,
  },
  empty: {
    title: "No homes match your filters",
    text: "Try a different price range or location.",
    clear: "Clear all filters",
  },
};

export const propertyDetailPage = {
  metaTitle: (name: string, city: string, state: string, price: string) =>
    `${name} · ${city}, ${state} · ${price}`,
  breadcrumbLabel: "Breadcrumb",
  breadcrumbRoot: "Properties",
  share: "Share",
  linkCopied: "Link copied",
  copyFailed: "Couldn't copy the link",
  save: "Save",
  saved: "Saved",
  estimatedMonthly: (amount: string) => `Est. ${amount}/mo`,
  facts: {
    label: "Key facts",
    area: "Area",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    yearBuilt: "Year built",
    beds: (n: number) => `${n} ${n === 1 ? "bed" : "beds"}`,
    baths: (n: number) => `${n} ${n === 1 ? "bath" : "baths"}`,
  },
  cityState: (city: string, state: string) => `${city}, ${state}`,
  address: (street: string, neighborhood: string) =>
    `${street}, ${neighborhood}`,
  sections: {
    about: "About this home",
    details: "Key details",
    features: "Features",
    location: "Location",
    moveIn: "Move-in costs",
    similar: "Similar homes",
    viewAll: "View all",
  },
  details: {
    type: "Type",
    yearBuilt: "Year built",
    lot: "Lot size",
    garage: "Garage",
    hoa: "HOA",
    taxes: "Property taxes",
    deposit: "Deposit",
    leaseTerm: "Lease term",
    availableFrom: "Available from",
    floodZone: "Flood zone",
    listed: "Listed",
    activity: "Activity",
    none: "None",
    perMonth: (amount: string) => `${amount}/mo`,
    perYear: (amount: string) => `${amount}/yr`,
    spaces: (n: number) => `${n} ${n === 1 ? "space" : "spaces"}`,
    listedAgo: (days: number) =>
      days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`,
    views: (views: number, saves: number) => `${views} views · ${saves} saves`,
    zone: (zone: string) => `Zone ${zone}`,
    floodInfo: "What this flood zone means",
    floodZones: {
      X: "Lower flood risk",
      AE: "Higher flood risk; flood insurance usually required",
      VE: "Coastal high-risk area",
    },
  },
  location: {
    // Every home shows the same demo pin: a public place, not the home's
    // (fictional) address.
    demoMapQuery: "Kent State University, Kent, OH",
    mapTitle: (home: string) => `Map for ${home} (demo location)`,
    demoNote:
      "Demo map. The pin shows a sample location, not this home's address.",
  },
  nearby: {
    title: "Nearby",
  },
  mortgage: {
    bannerTitle: "Mortgage calculator",
    bannerText: "Estimated monthly payment",
    bannerButton: "Calculate your payment",
    dialogDescription: (home: string) =>
      `Change the numbers to see what ${home} could cost each month.`,
    perMonth: (amount: string) => `${amount}/mo`,
    price: "Home price",
    down: "Down payment",
    rate: "Interest rate",
    term: "Loan term",
    years: (n: number) => `${n} years`,
    monthly: "Estimated monthly payment",
    breakdown: "Payment breakdown",
    parts: {
      principalAndInterest: "Principal & interest",
      tax: "Property tax",
      hoa: "HOA",
      insurance: "Home insurance",
    },
    disclaimer: "Estimate only. Your actual payment will vary.",
  },
  moveIn: {
    firstMonth: "First month's rent",
    deposit: "Security deposit",
    total: "Total due at signing",
  },
  agent: {
    label: "Listing agent",
    call: "Call",
    email: "Email",
    rating: (rating: number) => `${rating.toFixed(1)} rating`,
  },
  tour: {
    heading: "Schedule a tour",
    description: (home: string, agent: string) =>
      `Pick a time to see ${home} with ${agent}.`,
    open: "Schedule a tour",
    type: "Tour type",
    types: { "in-person": "In person", video: "Video" },
    date: "Date",
    time: "Time",
    times: ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"],
    name: "Full name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    optional: "Optional",
    messagePlaceholder: "Any questions about this home?",
    submit: "Request a tour",
    note: "No pressure, no fees to tour.",
    errors: {
      date: "Choose a date",
      time: "Choose a time",
      name: "Enter your name",
      email: "Enter a valid email address",
      phone: "Enter a valid phone number",
      message: "Keep your message under 500 characters",
    },
    successTitle: "Tour requested!",
    success: (agent: string, date: string, time: string) =>
      `${agent} will confirm your ${date} at ${time} tour within a few hours.`,
    addToCalendar: "Add to calendar",
    calendarTitle: (home: string) => `Home tour: ${home}`,
    calendarDescription: (agent: string) => `Tour with ${agent} from Haven.`,
  },
  mobileCta: "Schedule a tour",
  notFound: {
    title: "Home not found",
    heading: "This home is no longer listed.",
    text: "It may have sold, or the link may be wrong. Take a look at what's available now.",
  },
};

export const neighborhoodsPage = {
  meta: {
    title: "Neighborhoods on Florida's Gulf Coast",
    description:
      "Compare Tampa, St. Petersburg, Clearwater, Sarasota, and Naples by price, lifestyle, and distance to the beach.",
  },
  heading: "Find your place on the Gulf Coast",
  subtext:
    "Compare five coastal cities by price, lifestyle, and distance to the beach.",
  views: {
    label: "View",
    cards: "Cards",
    table: "Compare table",
  },
  cardStats: (median: string, beach: number, homes: number) =>
    `Median ${median} · Beach ${beach} min · ${homes} homes`,
  table: {
    caption: "Gulf Coast cities compared",
    city: "City",
    medianPrice: "Median price",
    avgRent: "Avg rent",
    homesListed: "Homes listed",
    beachMinutes: "Beach",
    airportMinutes: "Airport",
    walkability: "Walkability",
    sortBy: (column: string) => `Sort by ${column}`,
    minutes: (n: number) => `${n} min`,
    extremesNote: "Bold values are the lowest and highest in each column.",
  },
  cta: {
    heading: "Not sure which area fits you?",
    text: "Talk to a local agent who lives there.",
    button: "Talk to an agent",
    to: "/contact",
  },
};

export const neighborhoodDetailPage = {
  metaTitle: (city: string) => `Living in ${city}, FL`,
  breadcrumbLabel: "Breadcrumb",
  breadcrumbRoot: "Neighborhoods",
  stats: {
    label: "Area at a glance",
    medianPrice: "Median price",
    avgRent: "Avg rent",
    homesListed: "Homes listed",
    beach: "To the beach",
    airport: "To the airport",
    walkability: "Walkability",
    minutes: (n: number) => `${n} min`,
    perMonth: (amount: string) => `${amount}/mo`,
  },
  sections: {
    about: "About",
    highlights: "Highlights",
    goodFor: "Good for",
    livingHere: "Living here",
    faqs: "Questions people ask",
    homes: (city: string) => `Homes in ${city}`,
    viewAll: "View all",
    others: "Other neighborhoods",
  },
  otherMedian: (median: string) => `Median ${median}`,
  expert: {
    label: "Local expert",
    areas: (areas: string[]) => `Covers ${areas.join(" & ")}`,
    ask: (agent: string, city: string) => `Ask ${agent} about ${city}`,
  },
  quickLinks: {
    label: "Quick links",
    sale: (city: string) => `Homes for sale in ${city}`,
    rent: (city: string) => `Rentals in ${city}`,
  },
  alerts: {
    title: "No homes listed here right now",
    text: "Get an email when a new home comes up in this area.",
    label: "Email address",
    placeholder: "Enter your email",
    button: "Get alerts for new homes",
    error: "Enter a valid email address",
    success: "You're on the list. We'll email you when a home is listed.",
  },
  notFound: {
    title: "Neighborhood not found",
    heading: "We don't have a guide for this area yet.",
    text: "Explore the five Gulf Coast cities we cover instead.",
  },
};

export const contactPage = {
  meta: {
    title: "Contact us",
    description: "Send Haven a message and a local agent will get back to you.",
  },
  heading: "Get in touch",
  subtext: "Send us a message and a local agent will get back to you.",
  fields: {
    name: "Full name",
    email: "Email",
    phone: "Phone number",
    address: "Address",
    message: "Message",
    optional: "Optional",
    addressPlaceholder: "Street, city, ZIP",
    messagePlaceholder: "How can we help?",
  },
  errors: {
    name: "Enter your name",
    email: "Enter a valid email address",
    phone: "Enter a valid phone number",
    message: "Enter a message",
    messageTooLong: "Keep your message under 1,000 characters",
  },
  submit: "Send message",
  // The inbox subject: the start of the message.
  subject: (message: string) => {
    const text = message.trim().replace(/\s+/g, " ");
    return text.length > 60 ? `${text.slice(0, 57).trimEnd()}…` : text;
  },
  success: {
    title: "Message sent!",
    text: (name: string) =>
      `Thanks, ${name}. A local agent will get back to you soon.`,
    again: "Send another message",
  },
};

export const agentsPage = {
  meta: {
    title: "Our agents",
    description:
      "Meet Haven's local real estate agents in Tampa, St. Petersburg, Clearwater, Sarasota, and Naples.",
  },
  heading: "Local experts who know every coastline",
  subtext:
    "Each Haven agent lives and works in the areas they serve. Find the right expert for your move.",
  filters: {
    label: "Filter agents",
    focusLegend: "Help with",
    focus: {
      all: "All",
      buying: "Buying",
      selling: "Selling",
      renting: "Renting",
      waterfront: "Waterfront",
    },
    city: "City",
    allCities: "All cities",
  },
  cardLabel: (name: string, title: string, areas: string[]) =>
    `${name}, ${title}, ${areas.join(" and ")}`,
  stats: (years: number, stat: string, rating: number) =>
    `${years} years · ${stat} · ★ ${rating.toFixed(1)}`,
  languages: (languages: string[]) => `Speaks ${languages.join(", ")}`,
  viewProfile: "View profile",
  call: "Call",
  callLabel: (name: string) => `Call ${name}`,
  results: (count: number) => `${count} ${count === 1 ? "agent" : "agents"}`,
  empty: {
    title: "No agents match these filters",
    text: "Try another city or type of help.",
    clear: "Show all agents",
  },
  cta: {
    heading: "Not sure who to talk to?",
    text: "We'll match you with the right agent.",
    button: "Get matched",
    to: "/contact?type=agent-match",
  },
};

export const agentDetailPage = {
  metaTitle: (name: string, title: string) => `${name}, ${title}`,
  breadcrumbLabel: "Breadcrumb",
  breadcrumbRoot: "Agents",
  stats: {
    label: "At a glance",
    years: "Years with Haven",
    rating: (count: number) => `Rating from ${count} reviews`,
  },
  call: "Call",
  email: "Email",
  scheduleCall: "Schedule a call",
  sections: {
    about: "About",
    details: "Details",
    listings: (name: string) => `${name}'s homes`,
    reviews: "What clients say",
  },
  details: {
    specialties: "Specialties",
    languages: "Languages",
    credentials: "Credentials",
    funFact: "Fun fact",
  },
  noListings: {
    text: (name: string) => `${name} has no homes listed right now.`,
    link: "Browse all homes",
  },
  noReviews: "No reviews yet.",
  form: {
    heading: (name: string) => `Contact ${name}`,
    interest: "I'm interested in",
    interests: { buying: "Buying", selling: "Selling", renting: "Renting" },
    subject: (interest: string, agent: string) =>
      `${interest} inquiry for ${agent}`,
    name: "Full name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    optional: "Optional",
    submit: "Send message",
    errors: {
      interest: "Choose one",
      name: "Enter your name",
      email: "Enter a valid email address",
      phone: "Enter a valid phone number",
      message: "Enter a message",
    },
    success: (name: string) => `Thanks! ${name} will reach out soon.`,
  },
  notFound: {
    title: "Agent not found",
    heading: "This agent isn't on our team.",
    text: "They may have moved on, or the link may be wrong. Meet the rest of our agents.",
  },
};

export const notFoundPage = {
  metaTitle: "Page not found",
  code: "404",
  heading: "This page has moved out.",
  text: "The page you're looking for doesn't exist or may have been moved. Let's get you back home.",
  home: { label: "Back to home", to: "/" },
  browse: { label: "Browse homes", to: "/properties" },
  quickLinksLabel: "Popular pages",
  quickLinks: [
    { label: "Neighborhoods", to: "/neighborhoods" },
    { label: "Agents", to: "/agents" },
    { label: "Contact", to: "/contact" },
  ],
};

export const guidesPage = {
  meta: {
    title: "Guides",
    description:
      "Plain-language guides to buying, selling, and renting a home on Florida's Gulf Coast.",
  },
  heading: "Guides",
  subtext:
    "Plain-language tips for buying, selling, and renting on the Gulf Coast.",
};

export const guideDetailPage = {
  breadcrumbLabel: "Breadcrumb",
  breadcrumbRoot: "Guides",
  readTime: (minutes: number) => `${minutes} min read`,
  more: "More guides",
  viewAll: "View all guides",
  help: {
    heading: "Have a question about your move?",
    text: "A local agent can walk you through it.",
    button: { label: "Talk to an agent", to: "/contact" },
  },
  notFound: {
    title: "Guide not found",
    heading: "We couldn't find that guide.",
    text: "It may have moved, or the link may be wrong. Take a look at our other guides.",
  },
};
