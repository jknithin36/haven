// Sample legal text for a demo website. Haven is a fictional company, and
// this is not real legal advice.

export type LegalBlock = string | { list: string[] };

export type LegalSection = { id: string; title: string; body: LegalBlock[] };

export type LegalDocument = {
  title: string;
  metaTitle: string;
  description: string;
  updated: string;
  sections: LegalSection[];
};

export const legalPage = {
  updated: (date: string) => `Last updated: ${date}`,
  notice: "Sample text for a demo website. Haven is a fictional company.",
  contents: "Contents",
  backToTop: "Back to top",
};

export const privacy: LegalDocument = {
  title: "Privacy policy",
  metaTitle: "Privacy policy",
  description:
    "How Haven collects, uses, and protects your information. Sample text for a demo website.",
  updated: "October 1, 2026",
  sections: [
    {
      id: "information-we-collect",
      title: "Information we collect",
      body: [
        "We collect only what we need to help you find a home.",
        {
          list: [
            "Contact details you give us, such as your name, email, and phone number.",
            "Tour and message requests, including the home and times you choose.",
            "Homes you save.",
            "Basic site usage, such as which pages are visited.",
          ],
        },
      ],
    },
    {
      id: "how-we-use-it",
      title: "How we use it",
      body: [
        "We use your information to answer your requests, schedule tours, send listings you asked for, and improve the site.",
        "We don't use it for anything you haven't asked for.",
      ],
    },
    {
      id: "sharing",
      title: "Sharing",
      body: [
        "We share your information only with your Haven agent and with service providers who help us run the site. They may use it only to provide that service.",
        "We never sell your information.",
      ],
    },
    {
      id: "cookies-and-local-storage",
      title: "Cookies and local storage",
      body: [
        "This demo stores your saved homes and requests in your browser only. Nothing is sent to a server.",
        "You can clear this data at any time by clearing your browser's site data.",
      ],
    },
    {
      id: "your-choices",
      title: "Your choices",
      body: [
        {
          list: [
            "Unsubscribe from emails at any time using the link in each email.",
            "Ask us to show you, correct, or delete the information we hold about you.",
          ],
        },
      ],
    },
    {
      id: "data-security",
      title: "Data security",
      body: [
        "We use reasonable safeguards to protect your information. No system is perfectly secure, so please don't send us sensitive details such as bank or card numbers by email.",
      ],
    },
    {
      id: "childrens-privacy",
      title: "Children's privacy",
      body: [
        "This site is not for people under 18, and we don't knowingly collect information from them.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      body: ["Questions about this policy? Email privacy@haven.example.com."],
    },
  ],
};

export const terms: LegalDocument = {
  title: "Terms of use",
  metaTitle: "Terms of use",
  description:
    "The terms for using the Haven website. Sample text for a demo website.",
  updated: "October 1, 2026",
  sections: [
    {
      id: "using-this-website",
      title: "Using this website",
      body: [
        "By using this website, you agree to these terms. If you don't agree, please don't use the site.",
        "Please use the site only for lawful purposes, such as looking for a home or contacting an agent.",
      ],
    },
    {
      id: "listings-and-accuracy",
      title: "Listings and accuracy",
      body: [
        "We work to keep listings accurate, but details such as price, availability, and features can change. Always confirm important details with your agent before making a decision.",
      ],
    },
    {
      id: "tour-and-contact-requests",
      title: "Tour and contact requests",
      body: [
        "When you request a tour or send a message, you agree that a Haven agent may contact you about that request using the details you gave us.",
        "A request isn't confirmed until an agent confirms it with you.",
      ],
    },
    {
      id: "accounts-and-saved-homes",
      title: "Accounts and saved homes",
      body: [
        "Saved homes are stored in your browser. If you clear your browser data or switch devices, your saved homes won't be there.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      body: [
        "The site's text, design, and photos belong to Haven or its partners. Please don't copy them without permission.",
      ],
    },
    {
      id: "third-party-links",
      title: "Third-party links",
      body: [
        "The site may link to other websites. We don't control them and aren't responsible for their content or privacy practices.",
      ],
    },
    {
      id: "limitation-of-liability",
      title: "Limitation of liability",
      body: [
        "The site is provided as is. To the extent the law allows, Haven isn't liable for losses that come from using the site or relying on its content.",
      ],
    },
    {
      id: "changes-to-these-terms",
      title: "Changes to these terms",
      body: [
        "We may update these terms from time to time. The date at the top of this page shows when they last changed.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      body: ["Questions about these terms? Email hello@haven.example.com."],
    },
  ],
};
