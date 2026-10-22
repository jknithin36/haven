// Fictional data for demo purposes only. Copy for /admin/agents.

export const agentsAdminPage = {
  meta: { title: "Agents" },
  title: "Agents",
  count: (n: number) => `${n} ${n === 1 ? "agent" : "agents"}`,
  newAgent: "New agent",
  listLabel: "Team",
  stats: {
    listings: (n: number) => `${n} ${n === 1 ? "listing" : "listings"}`,
    tours: (n: number) => `${n} ${n === 1 ? "tour" : "tours"} this month`,
    rating: (rating: number, reviews: number) =>
      `${rating.toFixed(1)} · ${reviews} ${reviews === 1 ? "review" : "reviews"}`,
    years: (n: number) => `${n} ${n === 1 ? "year" : "years"}`,
  },
  actions: {
    edit: "Edit",
    viewProfile: "View profile",
    delete: "Delete",
    label: (action: string, name: string) => `${action}: ${name}`,
  },
  empty: { text: "No agents yet.", action: "New agent" },
  form: {
    newTitle: "New agent",
    editTitle: (name: string) => `Edit ${name}`,
    description: "Shown on the agents page and the agent's profile.",
    photo: "Photo URL",
    photoHelp: "Leave empty to show initials.",
    photoPlaceholder: "https://…",
    name: "Full name",
    title: "Title",
    titlePlaceholder: "Buyer's agent",
    areas: "Areas",
    areasHelp: "Pick every city this agent covers.",
    years: "Years of experience",
    phone: "Phone",
    email: "Email",
    languages: "Languages",
    languagesPlaceholder: "Add a language",
    specialties: "Specialties",
    specialtiesPlaceholder: "Add a specialty",
    removeTag: (tag: string) => `Remove ${tag}`,
    shortBio: "Short bio",
    shortBioHelp: (n: number, max: number) => `${n} / ${max}`,
    cancel: "Cancel",
    save: "Save changes",
    create: "Add agent",
  },
  errors: {
    photo: "Enter a full link that starts with https://",
    name: "Enter the agent's full name",
    title: "Enter a title",
    areas: "Pick at least one area",
    years: "Enter a number from 0 to 60",
    phone: "Enter a 10-digit phone number",
    email: "Enter a valid email",
    emailTaken: "Another agent already uses this email",
    languages: "Add at least one language",
    shortBio: "Write one or two sentences",
    shortBioLong: (max: number) => `Keep it under ${max} characters`,
  },
  deleteDialog: {
    title: (name: string) => `Delete ${name}?`,
    text: "They'll be removed from the website and the dashboard. You can undo this for a few seconds.",
    reassignText: (listings: number, tours: number) => {
      const parts = [
        listings > 0 &&
          `${listings} ${listings === 1 ? "listing" : "listings"}`,
        tours > 0 && `${tours} ${tours === 1 ? "tour" : "tours"}`,
      ].filter(Boolean);
      return `They have ${parts.join(" and ")}. Choose who takes them over first.`;
    },
    reassignLabel: "Move to",
    reassignPlaceholder: "Choose an agent…",
    confirm: "Delete",
    confirmReassign: "Move and delete",
    cancel: "Cancel",
  },
  toasts: {
    saved: "Saved",
    added: (name: string) => `${name} added`,
    deleted: (name: string) => `${name} deleted`,
    undo: "Undo",
  },
  // Filled in for new agents so the public profile has something to show.
  // Edit these later in src/data/agents.ts or a real backend.
  defaults: {
    stat: { value: "New", label: "to Haven" },
    rating: 5,
    credentials: ["Licensed Florida real estate agent"],
    quote: "I'm here to make your move simple, honest, and calm.",
    funFact: "Ask me about my favorite beach on the Gulf Coast.",
    photoAlt: (name: string) => `Portrait of ${name}`,
  },
};
