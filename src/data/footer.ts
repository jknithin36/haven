// Fictional data for demo purposes only.

export type FooterLink = { label: string; href: string };

export type FooterColumn = { title: string; links: FooterLink[] };

// Placeholder photo until /images/cta/cta-home.webp exists. Alt text
// describes the placeholder.
export const cta = {
  heading: "Find a home you'll love coming back to",
  text: "Tell us what you're looking for, and a local agent will reach out.",
  button: { label: "Schedule a tour", href: "/contact?type=tour" },
  image: "/images/hero-desktop.jpg",
  imageAlt: "Bright living room opening onto a deck with sea views",
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Pages",
    links: [
      { label: "About", href: "/about" },
      { label: "Properties", href: "/properties" },
      { label: "Neighborhoods", href: "/neighborhoods" },
      { label: "Agents", href: "/agents" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Guides", href: "/guides" },
      { label: "Reviews", href: "/#reviews" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export const newsletter = {
  title: "Get new listings first",
  label: "Email address",
  placeholder: "Enter your email",
  button: "Subscribe",
  error: "Enter a valid email address",
  success: "You're in! Watch your inbox for new listings.",
};

export const footerBottom = {
  copyright: "© 2026 Haven. All rights reserved.",
  contact: "hello@haven.example.com · (727) 555-0148",
  disclaimer:
    "Haven is a fictional company. All listings are for demonstration only.",
  socialLabel: "Social media",
  social: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "YouTube", href: "#" },
  ] satisfies FooterLink[],
};
