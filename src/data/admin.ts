// Fictional data for demo purposes only.

export const adminLoginPage = {
  meta: { title: "Sign in" },
  heading: "Welcome back",
  subtext: "Sign in to manage listings, tours, and messages.",
  email: "Email",
  password: "Password",
  showPassword: "Show password",
  hidePassword: "Hide password",
  submit: "Continue",
  submitting: "Signing in…",
  note: "Demo details are filled in for you. Just click Continue.",
  errors: {
    email: "Please enter your email",
    password: "Please enter your password",
    incorrect:
      "Incorrect email or password. Please refresh the page to restore the demo details.",
  },
  restore: "Restore demo details",
};

// ---------- Dashboard ----------

export type AdminNavKey =
  "overview" | "properties" | "tours" | "messages" | "agents" | "activity";

export const adminLayout = {
  brand: "Haven",
  brandMeta: "Admin",
  navLabel: "Dashboard",
  nav: [
    { key: "overview", label: "Overview", to: "/admin", shortcut: "O" },
    {
      key: "properties",
      label: "Properties",
      to: "/admin/properties",
      shortcut: "P",
    },
    { key: "tours", label: "Tours", to: "/admin/tours", shortcut: "T" },
    {
      key: "messages",
      label: "Messages",
      to: "/admin/messages",
      shortcut: "M",
    },
    { key: "agents", label: "Agents", to: "/admin/agents", shortcut: "A" },
    { key: "activity", label: "Activity", to: "/admin/activity", shortcut: "" },
  ] satisfies {
    key: AdminNavKey;
    label: string;
    to: string;
    shortcut: string;
  }[],
  unreadLabel: (n: number) => `${n} unread`,
  newLabel: (n: number) => `${n} new`,
  viewWebsite: "View website",
  collapse: "Collapse sidebar",
  expand: "Expand sidebar",
  openMenu: "Open menu",
  userMenu: "Account menu",
  resetDemo: "Reset demo data",
  resetConfirm: {
    title: "Reset demo data?",
    text: "Homes, tours, messages, agents, and activity go back to the original demo data. Your changes will be lost.",
    confirm: "Reset",
    cancel: "Cancel",
  },
  resetDone: "Demo data restored",
  shortcuts: "Keyboard shortcuts",
  signOut: "Sign out",
  search: "Search homes, tours, messages…",
  newProperty: "New property",
  footer: "Demo data · Haven is a fictional company.",
  notFound: {
    title: "Page not found",
    text: "This dashboard page doesn't exist.",
    back: "Back to overview",
  },
};

export const commandPalette = {
  label: "Command palette",
  placeholder: "Search homes, tours, messages, or type a command…",
  empty: "No results.",
  groups: {
    actions: "Actions",
    pages: "Go to",
    homes: "Homes",
    tours: "Tours",
    messages: "Messages",
  },
  actions: {
    newProperty: "New property",
    goTours: "Go to Tours",
    reset: "Reset demo data",
  },
};

export const shortcutsDialog = {
  title: "Keyboard shortcuts",
  description: "Move around the dashboard without the mouse.",
  groups: [
    {
      title: "General",
      items: [
        { keys: ["⌘", "K"], label: "Open command palette" },
        { keys: ["/"], label: "Search" },
        { keys: ["N"], label: "New property" },
        { keys: ["⌘", "B"], label: "Collapse or expand the sidebar" },
        { keys: ["?"], label: "Show keyboard shortcuts" },
      ],
    },
    {
      title: "Go to",
      items: [
        { keys: ["G", "O"], label: "Overview" },
        { keys: ["G", "P"], label: "Properties" },
        { keys: ["G", "T"], label: "Tours" },
        { keys: ["G", "M"], label: "Messages" },
        { keys: ["G", "A"], label: "Agents" },
      ],
    },
    {
      title: "Messages",
      items: [
        { keys: ["J"], label: "Next message" },
        { keys: ["K"], label: "Previous message" },
        { keys: ["E"], label: "Archive" },
        { keys: ["U"], label: "Mark unread" },
      ],
    },
  ],
};

export const statusLabels = {
  property: {
    active: "Active",
    draft: "Draft",
    sold: "Sold",
    rented: "Rented",
  },
  tour: {
    new: "New",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
  },
  tourType: { "in-person": "In person", video: "Video" },
  messageType: {
    general: "General",
    tour: "Tour",
    "agent-match": "Agent match",
    "agent-contact": "Agent contact",
  },
};

export const overviewPage = {
  meta: { title: "Overview" },
  greeting: (hello: string, name: string) => `${hello}, ${name}`,
  summary: (newTours: number, unread: number, thisWeek: number) => {
    const plural = (n: number, one: string, many: string) =>
      `${n} ${n === 1 ? one : many}`;
    return `You have ${plural(newTours, "new tour request", "new tour requests")} and ${plural(unread, "unread message", "unread messages")}. ${plural(thisWeek, "tour is", "tours are")} scheduled this week.`;
  },
  metricsLabel: "Key numbers",
  metrics: {
    active: "Active listings",
    newTours: "New tours",
    unread: "Unread messages",
    thisWeek: "Tours this week",
  },
  trend: (delta: number) =>
    delta === 0
      ? "Same as last week"
      : `${delta > 0 ? "+" : "−"}${Math.abs(delta)} vs last week`,
  nextUp: {
    title: "Next up",
    when: (day: string, inTime: string) => `${day} · ${inTime}`,
    empty: "No tours coming up.",
    emptyAction: "View all tours",
    open: "Open tour",
    email: "Email client",
    call: "Call client",
    confirm: "Confirm",
  },
  week: {
    title: "Next 7 days",
    viewWeek: "Week view",
    daysLabel: "Pick a day",
    tours: (n: number) => `${n} ${n === 1 ? "tour" : "tours"}`,
    empty: (day: string) => `No tours ${day.toLowerCase()}.`,
    emptyOn: (day: string) => `No tours on ${day}.`,
  },
  attention: {
    title: "Needs attention",
    tours: "Tour requests to confirm",
    messages: "Unread messages",
    allClear: "You're all caught up.",
    allClearText: "New tour requests and messages will show up here.",
    confirm: "Confirm",
    reply: "Reply",
    replySubject: (subject: string) => `Re: ${subject}`,
    more: (n: number) => `${n} more`,
    tourWhen: (day: string, time: string) => `${day}, ${time}`,
  },
  toasts: {
    confirmed: (name: string) => `Tour confirmed for ${name}`,
    undo: "Undo",
  },
  listings: {
    title: "Listings",
    total: (n: number) => `${n} ${n === 1 ? "home" : "homes"}`,
    byCity: "By city",
    homes: (n: number) => `${n} ${n === 1 ? "home" : "homes"}`,
    manage: "Manage listings",
  },
  activity: {
    title: "Recent activity",
    empty: "Nothing has happened yet.",
    viewAll: "View all",
  },
};

export const propertiesAdminPage = {
  meta: { title: "Properties" },
  title: "Properties",
  count: (n: number) => `${n} ${n === 1 ? "home" : "homes"}`,
  views: { label: "View", table: "Table", grid: "Grid" },
  search: "Search name, address, or city",
  filters: {
    city: "City",
    type: "Type",
    status: "Status",
    deal: "Sale/Rent",
    any: "Any",
    sale: "For sale",
    rent: "For rent",
    clear: "Clear",
  },
  sort: {
    label: "Sort",
    options: {
      updated: "Recently updated",
      name: "Name",
      "price-desc": "Price: high to low",
      "price-asc": "Price: low to high",
    },
  },
  columns: {
    select: "Select",
    selectAll: "Select all on this page",
    selectRow: (name: string) => `Select ${name}`,
    home: "Home",
    city: "City",
    type: "Type",
    price: "Price",
    bedsBaths: "Beds/Baths",
    status: "Status",
    agent: "Agent",
    updated: "Updated",
    actions: "Actions",
  },
  bedsBaths: (beds: number, baths: number) => `${beds} bd · ${baths} ba`,
  actions: {
    viewOnSite: "View on site",
    edit: "Edit",
    more: (name: string) => `More actions for ${name}`,
    duplicate: "Duplicate",
    markSold: "Mark sold",
    markRented: "Mark rented",
    moveToDraft: "Move to draft",
    publish: "Publish",
    delete: "Delete",
  },
  bulk: {
    selected: (n: number) => `${n} selected`,
    markSold: "Mark sold",
    moveToDraft: "Move to draft",
    delete: "Delete",
    clear: "Clear",
  },
  pagination: {
    label: "Pagination",
    range: (from: number, to: number, total: number) =>
      `${from}–${to} of ${total}`,
    previous: "Previous page",
    next: "Next page",
    page: (n: number) => `Page ${n}`,
    perPage: "Rows per page",
  },
  deleteDialog: {
    title: (n: number) =>
      n === 1 ? "Delete this home?" : `Delete ${n} homes?`,
    text: "It will be removed from the website and the dashboard. You can undo this for a few seconds.",
    confirm: "Delete",
    cancel: "Cancel",
  },
  toasts: {
    deleted: (n: number) => (n === 1 ? "Home deleted" : `${n} homes deleted`),
    duplicated: (name: string) => `${name} duplicated`,
    status: (n: number, label: string) =>
      n === 1
        ? `Marked ${label.toLowerCase()}`
        : `${n} homes marked ${label.toLowerCase()}`,
    published: "Published",
    drafted: (n: number) =>
      n === 1 ? "Moved to draft" : `${n} homes moved to draft`,
    undo: "Undo",
  },
  empty: { text: "No homes yet.", action: "New property" },
  noResults: { text: "No homes match these filters.", action: "Clear filters" },
};

export const propertyEditorPage = {
  meta: { newTitle: "New property", editTitle: (name: string) => name },
  newTitle: "New property",
  untitled: "Untitled home",
  notFound: { text: "This home doesn't exist.", action: "Back to properties" },
  sections: {
    basics: {
      title: "Basics",
      help: "What the home is called, where it is, and what it costs.",
    },
    details: {
      title: "Details",
      help: "The numbers buyers compare. Leave optional ones empty.",
    },
    description: {
      title: "Description",
      help: "One to three short paragraphs. Leave a blank line between them.",
    },
    photos: {
      title: "Photos",
      help: "The first photo is the cover. Drag to reorder.",
    },
    features: {
      title: "Features",
      help: "Press Enter to add a feature. Backspace removes the last one.",
    },
    agent: {
      title: "Agent",
      help: "Tour requests and messages about this home go to this agent.",
    },
  },
  fields: {
    name: "Name",
    slug: "URL",
    slugPrefix: "/properties/",
    status: "Status",
    priceType: "Listing",
    sale: "For sale",
    rent: "For rent",
    price: "Price",
    pricePerMonth: "Rent per month",
    currency: "$",
    type: "Type",
    city: "City",
    neighborhood: "Neighborhood",
    address: "Street address",
    zip: "ZIP code",
    beds: "Bedrooms",
    baths: "Bathrooms",
    sqft: "Living area (sq ft)",
    lotSqft: "Lot size (sq ft)",
    yearBuilt: "Year built",
    garage: "Garage spaces",
    hoaMonthly: "HOA per month",
    taxesYearly: "Property taxes per year",
    deposit: "Deposit",
    leaseTerm: "Lease term",
    leaseTermPlaceholder: "12 months",
    availableFrom: "Available from",
    floodZone: "Flood zone",
    description: "Description",
    characters: (n: number, max: number) => `${n} / ${max}`,
    paragraphs: (n: number) => `${n} ${n === 1 ? "paragraph" : "paragraphs"}`,
    agent: "Listing agent",
    optional: "Optional",
    select: "Select…",
  },
  photos: {
    drop: "Drop photos here, or",
    browse: "browse",
    types: "JPG, PNG, or WebP. Large photos are resized.",
    urlLabel: "Photo URL",
    urlPlaceholder: "https://…",
    addUrl: "Add by URL",
    cover: "Cover",
    setCover: "Set as cover",
    moveUp: "Move earlier",
    moveDown: "Move later",
    remove: "Remove photo",
    alt: (name: string, n: number) => `${name}, photo ${n}`,
    count: (n: number) => `${n} ${n === 1 ? "photo" : "photos"}`,
    reading: "Adding photos…",
    badUrl: "Enter a full link that starts with https://",
    unreadable: "That file couldn't be read as an image.",
  },
  features: {
    groups: ["Interior", "Exterior", "Systems", "Community"],
    placeholder: (group: string) => `Add ${group.toLowerCase()} feature`,
    remove: (tag: string) => `Remove ${tag}`,
  },
  preview: {
    label: "Preview",
    onSite: "Preview on site",
    hidden: "Only active homes are visible on the site.",
  },
  footer: {
    unsaved: "Unsaved changes",
    saved: "All changes saved",
    cancel: "Cancel",
    saveDraft: "Save as draft",
    publish: "Publish",
    saveChanges: "Save changes",
    shortcut: "Save",
  },
  summary: {
    title: (n: number) =>
      n === 1
        ? "Fix 1 field before publishing"
        : `Fix ${n} fields before publishing`,
  },
  leave: {
    title: "Leave without saving?",
    text: "Your changes to this home will be lost.",
    stay: "Keep editing",
    leave: "Leave",
  },
  toasts: { saved: "Saved", published: "Published" },
  errors: {
    name: "Enter a name for this home",
    slug: "Use lowercase letters, numbers, and dashes",
    slugTaken: "Another home already uses this URL",
    price: "Enter a price",
    type: "Choose a type",
    city: "Choose a city",
    neighborhood: "Enter the neighborhood",
    address: "Enter the street address",
    zip: "Enter a 5-digit ZIP code",
    beds: "Enter 0 to 20 bedrooms",
    baths: "Use steps of 0.5, up to 20",
    sqft: "Enter the living area",
    yearBuilt: (max: number) => `Enter a year between 1850 and ${max}`,
    number: "Enter a whole number",
    description: "Write at least one paragraph",
    descriptionLong: (max: number) => `Keep it under ${max} characters`,
    paragraphs: "Use at most three paragraphs",
    photos: "Add at least one photo",
    agent: "Choose an agent",
  },
};

// Words shared by several dashboard pages.
export const adminCommon = {
  clearSearch: "Clear search",
  close: "Close",
  copy: (what: string) => `Copy ${what}`,
  copied: "Copied",
  save: "Save",
  cancel: "Cancel",
  addNote: "Add note",
  notePlaceholder: "Write a note for your team…",
  notes: "Internal notes",
  noNotes: "No notes yet.",
  all: "All",
};
