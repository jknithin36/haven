// Fictional data for demo purposes only. Seed data for the admin dashboard.
// Dates are relative to "now", so the demo always looks current. Names,
// emails (@example.com), and 555 phone numbers are made up.

import { properties, type Property } from "@/data/properties";
import type { ActivityEvent } from "@/store/activity";
import type { Message } from "@/store/messages";
import type { ListedProperty } from "@/store/properties";
import type { TourRequest } from "@/store/requests";

// ---------- Date helpers ----------

function isoDate(daysFromToday: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function timestamp(daysFromToday: number, hour = 10, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

// ---------- Properties ----------

function listed(
  property: Property,
  status: ListedProperty["status"],
  updatedDaysAgo: number,
): ListedProperty {
  const photos = [
    { id: `${property.id}-1`, src: property.image, alt: property.imageAlt },
  ];
  if (property.wideImage.src !== property.image) {
    photos.push({
      id: `${property.id}-2`,
      src: property.wideImage.src,
      alt: property.wideImage.alt,
    });
  }
  return {
    ...property,
    status,
    updatedAt: timestamp(-updatedDaysAgo, 9 + (updatedDaysAgo % 8)),
    photos,
  };
}

// Three extra homes that aren't public, so every status has an example.
function variant(
  base: Property,
  overrides: Partial<Property> & Pick<Property, "id" | "slug" | "name">,
): Property {
  return { ...base, featured: false, isNew: false, ...overrides };
}

export function propertiesSeed(): ListedProperty[] {
  const byId = (id: string) => properties.find((p) => p.id === id) as Property;

  const extras: ListedProperty[] = [
    listed(
      variant(byId("p-006"), {
        id: "p-010",
        slug: "osprey-cove-cottage",
        name: "Osprey Cove Cottage",
        address: "52 Osprey Cove Lane",
        neighborhood: "Heron Bay",
        price: 735_000,
        beds: 3,
        baths: 2,
        sqft: 1780,
        type: "Waterfront home",
        listedAt: isoDate(-2),
        views: 0,
        saves: 0,
      }),
      "draft",
      1,
    ),
    listed(
      variant(byId("p-002"), {
        id: "p-011",
        slug: "lighthouse-row-condo",
        name: "Lighthouse Row Condo",
        address: "800 Lighthouse Row, Unit 604",
        neighborhood: "Harborview North",
        price: 512_000,
        sqft: 1190,
        listedAt: isoDate(-40),
        views: 610,
        saves: 48,
      }),
      "sold",
      6,
    ),
    listed(
      variant(byId("p-007"), {
        id: "p-012",
        slug: "magnolia-lane-house",
        name: "Magnolia Lane House",
        address: "1144 Magnolia Lane",
        neighborhood: "Coral Heights",
        price: 2_850,
        listedAt: isoDate(-32),
        views: 402,
        saves: 37,
      }),
      "rented",
      9,
    ),
  ];

  return [
    ...properties.map((p, i) => listed(p, "active", 2 + i * 2)),
    ...extras,
  ];
}

// ---------- Tour requests ----------

type RequestSeed = {
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  day: number; // days from today
  time: string;
  type: TourRequest["type"];
  status: TourRequest["status"];
  message?: string;
  cancelReason?: string;
  requestedDaysBefore: number;
};

const requestSeeds: RequestSeed[] = [
  // New (upcoming)
  { propertyId: "p-004", name: "Hannah Ortiz", email: "hannah.ortiz@example.com", phone: "(727) 555-0114", day: 1, time: "10:00 AM", type: "in-person", status: "new", message: "Is the boardwalk shared with the neighbors?", requestedDaysBefore: 2 },
  { propertyId: "p-008", name: "Graham Whitfield", email: "graham.w@example.com", phone: "(941) 555-0187", day: 2, time: "2:30 PM", type: "video", status: "new", message: "We're relocating from Chicago. A video walkthrough would be great.", requestedDaysBefore: 1 },
  { propertyId: "p-005", name: "Priya Raman", email: "priya.raman@example.com", phone: "(813) 555-0122", day: 3, time: "11:30 AM", type: "in-person", status: "new", requestedDaysBefore: 1 },
  { propertyId: "p-009", name: "Marcus Bell", email: "marcus.bell@example.com", phone: "(813) 555-0149", day: 5, time: "4:00 PM", type: "in-person", status: "new", message: "Can we see the garage too?", requestedDaysBefore: 3 },
  { propertyId: "p-006", name: "Leah Kowalski", email: "leah.k@example.com", phone: "(941) 555-0131", day: 8, time: "1:00 PM", type: "in-person", status: "new", requestedDaysBefore: 2 },
  { propertyId: "p-001", name: "Tomás Rivera", email: "tomas.rivera@example.com", phone: "(941) 555-0176", day: 12, time: "10:00 AM", type: "video", status: "new", message: "Interested in the flood history before we visit.", requestedDaysBefore: 1 },
  // Confirmed (upcoming)
  { propertyId: "p-003", name: "Evelyn Park", email: "evelyn.park@example.com", phone: "(239) 555-0158", day: 0, time: "2:30 PM", type: "in-person", status: "confirmed", requestedDaysBefore: 4 },
  { propertyId: "p-007", name: "Owen Brooks", email: "owen.brooks@example.com", phone: "(727) 555-0163", day: 1, time: "4:00 PM", type: "in-person", status: "confirmed", message: "Pets allowed? We have one small dog.", requestedDaysBefore: 3 },
  { propertyId: "p-002", name: "Sara Lindqvist", email: "sara.l@example.com", phone: "(727) 555-0109", day: 2, time: "11:30 AM", type: "video", status: "confirmed", requestedDaysBefore: 5 },
  { propertyId: "p-004", name: "Daniel Okoye", email: "d.okoye@example.com", phone: "(727) 555-0192", day: 4, time: "1:00 PM", type: "in-person", status: "confirmed", requestedDaysBefore: 2 },
  { propertyId: "p-008", name: "Ruth Calloway", email: "ruth.calloway@example.com", phone: "(239) 555-0137", day: 6, time: "10:00 AM", type: "in-person", status: "confirmed", requestedDaysBefore: 6 },
  { propertyId: "p-005", name: "Ivan Petrov", email: "ivan.petrov@example.com", phone: "(813) 555-0171", day: 10, time: "2:30 PM", type: "video", status: "confirmed", requestedDaysBefore: 4 },
  // Completed (past)
  { propertyId: "p-006", name: "Grace Holloway", email: "grace.h@example.com", phone: "(941) 555-0126", day: -14, time: "11:30 AM", type: "in-person", status: "completed", requestedDaysBefore: 3 },
  { propertyId: "p-001", name: "Noah Fischer", email: "noah.fischer@example.com", phone: "(941) 555-0144", day: -9, time: "10:00 AM", type: "in-person", status: "completed", requestedDaysBefore: 2 },
  { propertyId: "p-009", name: "Amara Nwosu", email: "amara.n@example.com", phone: "(813) 555-0118", day: -5, time: "4:00 PM", type: "video", status: "completed", requestedDaysBefore: 4 },
  { propertyId: "p-003", name: "Felix Moreau", email: "felix.moreau@example.com", phone: "(239) 555-0195", day: -2, time: "1:00 PM", type: "in-person", status: "completed", requestedDaysBefore: 3 },
  // Cancelled
  { propertyId: "p-002", name: "Yuki Tanaka", email: "yuki.tanaka@example.com", phone: "(727) 555-0168", day: -7, time: "2:30 PM", type: "in-person", status: "cancelled", cancelReason: "Client found another home", requestedDaysBefore: 3 },
  { propertyId: "p-007", name: "Isabel Duarte", email: "isabel.d@example.com", phone: "(727) 555-0153", day: 3, time: "11:30 AM", type: "video", status: "cancelled", cancelReason: "Schedule conflict", requestedDaysBefore: 4 },
];

export function requestsSeed(): TourRequest[] {
  return requestSeeds.map((r, i) => {
    const home = properties.find((p) => p.id === r.propertyId) as Property;
    const createdAt = timestamp(r.day - r.requestedDaysBefore, 9 + (i % 9), (i * 7) % 60);
    const confirmedAt =
      r.status === "confirmed" || r.status === "completed"
        ? timestamp(r.day - r.requestedDaysBefore + 1, 11)
        : undefined;
    return {
      id: `t-${String(i + 1).padStart(3, "0")}`,
      propertyId: home.id,
      propertySlug: home.slug,
      agentId: home.agentId,
      name: r.name,
      email: r.email,
      phone: r.phone,
      date: isoDate(r.day),
      time: r.time,
      type: r.type,
      message: r.message,
      status: r.status,
      cancelReason: r.cancelReason,
      notes: [],
      createdAt,
      confirmedAt,
      completedAt: r.status === "completed" ? timestamp(r.day, 17) : undefined,
      cancelledAt:
        r.status === "cancelled"
          ? timestamp(r.day - r.requestedDaysBefore + 2, 15)
          : undefined,
      updatedAt: createdAt,
    };
  });
}

// ---------- Messages ----------

type MessageSeed = Omit<Message, "id" | "createdAt" | "notes"> & {
  daysAgo: number;
  hour: number;
};

const messageSeeds: MessageSeed[] = [
  { name: "Claire Donovan", email: "claire.donovan@example.com", phone: "(941) 555-0102", type: "general", subject: "Question about flood insurance on Mangrove Bay Retreat", message: "Hi, we love Mangrove Bay Retreat but we're new to Florida. Could someone explain roughly what flood insurance would cost for a home in zone AE, and whether the current owner has a policy we could take over?", read: false, archived: false, daysAgo: 0, hour: 9 },
  { name: "Jamal Pierce", email: "jamal.pierce@example.com", phone: "(813) 555-0117", type: "agent-match", area: "tampa", subject: "Looking for a 3-bed rental in Tampa by January", message: "My partner and I are moving to Tampa for work and need a 3-bedroom rental by early January. Ideally walkable, under $3,200 a month, and okay with a medium-sized dog.", read: false, archived: false, daysAgo: 1, hour: 14 },
  { name: "Margaret Ellis", email: "m.ellis@example.com", phone: "(727) 555-0125", type: "general", subject: "Selling my condo in St. Petersburg", message: "I'm thinking of selling my 2-bed condo near the waterfront park next spring. Could I get a rough idea of what similar units have sold for, and what I should fix first?", read: false, archived: false, daysAgo: 2, hour: 11 },
  { name: "Ben Hartley", email: "ben.hartley@example.com", type: "agent-contact", agentId: "a-daniel", subject: "Dock condition at Sunset Key Villa", message: "Daniel, before we book a second visit, do you know when the dock and seawall at Sunset Key Villa were last inspected?", read: false, archived: false, daysAgo: 3, hour: 16 },
  { name: "Olivia Grant", email: "olivia.grant@example.com", phone: "(239) 555-0141", type: "tour", subject: "Weekend tour of Palm Shore Villa", message: "Are tours available on Saturday mornings? We're driving down from Orlando and can only make weekends.", read: false, archived: false, daysAgo: 4, hour: 10 },
  { name: "Ravi Menon", email: "ravi.menon@example.com", type: "agent-contact", agentId: "a-sofia", subject: "Lease length for Harbor Lights Condo", message: "Sofia, is the owner open to a 6-month lease to start? I'm on a short work contract.", read: true, archived: false, daysAgo: 5, hour: 13 },
  { name: "Lucy Chen", email: "lucy.chen@example.com", phone: "(727) 555-0179", type: "general", subject: "School options near Coral Street Bungalow", message: "We have two kids, 7 and 10. Which elementary schools would Coral Street Bungalow be zoned for, roughly?", read: true, archived: false, daysAgo: 7, hour: 9 },
  { name: "Henry Albright", email: "henry.albright@example.com", type: "agent-match", area: "naples", subject: "Second home in Naples, ideally near golf", message: "We're looking for a winter home in Naples, 3 to 4 bedrooms, close to a golf community. Budget around $1.5M.", read: true, archived: false, daysAgo: 8, hour: 15 },
  { name: "Sofia Marín", email: "sofia.marin@example.com", type: "general", subject: "Do you help with relocation from Spain?", message: "We're moving from Valencia next year. Do your agents help with remote paperwork and video tours?", read: true, archived: false, daysAgo: 10, hour: 12 },
  { name: "Derek Simmons", email: "derek.s@example.com", phone: "(813) 555-0135", type: "agent-contact", agentId: "a-marcus", subject: "Pricing my townhome", message: "Marcus, I own a townhome near Pelican Commons. What would you suggest as a listing price range?", read: true, archived: false, daysAgo: 12, hour: 10 },
  { name: "Nadia Hassan", email: "nadia.hassan@example.com", type: "tour", subject: "Rescheduling my tour", message: "I need to move my tour of Bayfront Condo to later in the week. Is Thursday afternoon possible?", read: true, archived: false, daysAgo: 14, hour: 17 },
  { name: "Peter Lund", email: "peter.lund@example.com", type: "general", subject: "Hurricane shutters on older homes", message: "For homes built before 2000, is it common to have impact windows, or should we budget for shutters?", read: true, archived: false, daysAgo: 16, hour: 11 },
  { name: "Ava Brennan", email: "ava.brennan@example.com", type: "general", subject: "Newsletter frequency", message: "Thanks for the listings email. Could I get it weekly instead of every few days?", read: true, archived: true, daysAgo: 19, hour: 8 },
  { name: "Carl Jensen", email: "carl.jensen@example.com", phone: "(941) 555-0188", type: "general", subject: "Found a home, thank you", message: "Just wanted to say thanks. We closed on a home in Sarasota last week, and your flood guide helped a lot.", read: true, archived: true, daysAgo: 21, hour: 14 },
];

export function messagesSeed(): Message[] {
  return messageSeeds.map(({ daysAgo, hour, ...m }, i) => ({
    ...m,
    id: `m-${String(i + 1).padStart(3, "0")}`,
    notes: [],
    createdAt: timestamp(-daysAgo, hour, (i * 11) % 60),
  }));
}

// ---------- Activity ----------

type ActivitySeed = Omit<ActivityEvent, "id" | "createdAt"> & {
  daysAgo: number;
  hour: number;
};

const activitySeeds: ActivitySeed[] = [
  { text: "New message from Claire Donovan", entityType: "message", entityId: "m-001", daysAgo: 0, hour: 9 },
  { text: "Tour requested: Tomás Rivera for The Seagrass House", entityType: "tour", entityId: "t-006", daysAgo: 1, hour: 15 },
  { text: "Tour requested: Graham Whitfield for Sunset Key Villa", entityType: "tour", entityId: "t-002", daysAgo: 1, hour: 11 },
  { text: "New message from Jamal Pierce", entityType: "message", entityId: "m-002", daysAgo: 1, hour: 14 },
  { text: "Osprey Cove Cottage saved as draft", entityType: "property", entityId: "p-010", daysAgo: 1, hour: 10 },
  { text: "Tour completed: Felix Moreau at Palm Shore Villa", entityType: "tour", entityId: "t-016", daysAgo: 2, hour: 17 },
  { text: "New message from Margaret Ellis", entityType: "message", entityId: "m-003", daysAgo: 2, hour: 11 },
  { text: "Tour confirmed: Daniel Okoye for Driftwood Beach House", entityType: "tour", entityId: "t-010", daysAgo: 2, hour: 9 },
  { text: "Driftwood Beach House updated", entityType: "property", entityId: "p-004", daysAgo: 2, hour: 8 },
  { text: "New message from Ben Hartley", entityType: "message", entityId: "m-004", daysAgo: 3, hour: 16 },
  { text: "Tour confirmed: Owen Brooks for Coral Street Bungalow", entityType: "tour", entityId: "t-008", daysAgo: 3, hour: 12 },
  { text: "Tour completed: Amara Nwosu at Pelican Point Townhome", entityType: "tour", entityId: "t-015", daysAgo: 5, hour: 17 },
  { text: "Tour cancelled: Isabel Duarte (Schedule conflict)", entityType: "tour", entityId: "t-018", daysAgo: 5, hour: 15 },
  { text: "Lighthouse Row Condo marked sold", entityType: "property", entityId: "p-011", daysAgo: 6, hour: 13 },
  { text: "Emma Lawson's profile updated", entityType: "agent", entityId: "a-emma", daysAgo: 7, hour: 10 },
  { text: "Tour completed: Noah Fischer at The Seagrass House", entityType: "tour", entityId: "t-014", daysAgo: 9, hour: 17 },
  { text: "Magnolia Lane House marked rented", entityType: "property", entityId: "p-012", daysAgo: 9, hour: 11 },
  { text: "Tour cancelled: Yuki Tanaka (Client found another home)", entityType: "tour", entityId: "t-017", daysAgo: 10, hour: 15 },
  { text: "Pelican Point Townhome published", entityType: "property", entityId: "p-009", daysAgo: 11, hour: 9 },
  { text: "Tour completed: Grace Holloway at Mangrove Bay Retreat", entityType: "tour", entityId: "t-013", daysAgo: 14, hour: 17 },
];

export function activitySeed(): ActivityEvent[] {
  return activitySeeds.map(({ daysAgo, hour, ...e }, i) => ({
    ...e,
    id: `e-${String(i + 1).padStart(3, "0")}`,
    createdAt: timestamp(-daysAgo, hour, (i * 13) % 60),
  }));
}
