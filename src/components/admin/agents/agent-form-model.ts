// The agent form's model: Zod schema, and converters between a stored agent
// and the form's values.

import { z } from "zod";

import { agentsAdminPage } from "@/data/admin-agents";
import type { Agent, AgentFocus } from "@/data/agents";
import { isImageUrl } from "@/lib/image-file";
import { slugify } from "@/lib/property-form";
import { isAgentSlugTaken } from "@/store/agents";

const copy = agentsAdminPage;

export const SHORT_BIO_MAX = 220;
const MAX_YEARS = 60;
const PHONE_DIGITS = 10;

export type AgentFormValues = {
  photo: string;
  name: string;
  title: string;
  areas: string[];
  years: string;
  phone: string;
  email: string;
  languages: string[];
  specialties: string[];
  shortBio: string;
};

export function agentSchema(agents: Agent[], currentId?: string) {
  return z.object({
    photo: z
      .string()
      .refine((v) => !v.trim() || isImageUrl(v.trim()), copy.errors.photo),
    name: z.string().trim().min(3, copy.errors.name),
    title: z.string().trim().min(2, copy.errors.title),
    areas: z.array(z.string()).min(1, copy.errors.areas),
    years: z.string().refine((v) => {
      const n = Number(v);
      return /^\d+$/.test(v) && n <= MAX_YEARS;
    }, copy.errors.years),
    phone: z
      .string()
      .refine(
        (v) => v.replace(/\D/g, "").length === PHONE_DIGITS,
        copy.errors.phone,
      ),
    email: z
      .email(copy.errors.email)
      .refine(
        (v) =>
          !agents.some(
            (a) =>
              a.id !== currentId && a.email.toLowerCase() === v.toLowerCase(),
          ),
        copy.errors.emailTaken,
      ),
    languages: z.array(z.string()).min(1, copy.errors.languages),
    specialties: z.array(z.string()),
    shortBio: z
      .string()
      .trim()
      .min(20, copy.errors.shortBio)
      .max(SHORT_BIO_MAX, copy.errors.shortBioLong(SHORT_BIO_MAX)),
  });
}

export function emptyAgentValues(): AgentFormValues {
  return {
    photo: "",
    name: "",
    title: "",
    areas: [],
    years: "",
    phone: "",
    email: "",
    languages: [],
    specialties: [],
    shortBio: "",
  };
}

export function toAgentValues(agent: Agent): AgentFormValues {
  return {
    photo: agent.photo ?? "",
    name: agent.name,
    title: agent.title,
    areas: agent.areas,
    years: String(agent.years),
    phone: agent.phone,
    email: agent.email,
    languages: agent.languages,
    specialties: agent.specialties,
    shortBio: agent.shortBio,
  };
}

// Specialties that match a filter chip on /agents.
function focusFrom(specialties: string[]): AgentFocus[] {
  const text = specialties.join(" ").toLowerCase();
  const focus: AgentFocus[] = [];
  if (/buy/.test(text)) focus.push("buying");
  if (/sell|listing/.test(text)) focus.push("selling");
  if (/rent|lease/.test(text)) focus.push("renting");
  if (/water|beach|boat|coast/.test(text)) focus.push("waterfront");
  return focus.length > 0 ? focus : ["buying"];
}

function uniqueSlug(name: string, exceptId?: string) {
  const base = slugify(name) || "agent";
  let slug = base;
  for (let n = 2; isAgentSlugTaken(slug, exceptId); n++) slug = `${base}-${n}`;
  return slug;
}

// Changes from the form, merged into an existing agent.
export function agentPatch(
  values: AgentFormValues,
  agent: Agent,
): Partial<Agent> {
  const name = values.name.trim();
  const shortBio = values.shortBio.trim();
  return {
    photo: values.photo.trim() || undefined,
    photoAlt: copy.defaults.photoAlt(name),
    name,
    slug: name === agent.name ? agent.slug : uniqueSlug(name, agent.id),
    title: values.title.trim(),
    areas: values.areas,
    years: Number(values.years),
    phone: values.phone.trim(),
    email: values.email.trim(),
    languages: values.languages,
    specialties: values.specialties,
    focus: focusFrom(values.specialties),
    shortBio,
    // Profiles made here have a one-paragraph bio; keep longer ones intact.
    bio: agent.bio.length > 1 ? agent.bio : [shortBio],
  };
}

// A new agent with defaults for the profile fields the form doesn't cover.
export function newAgent(values: AgentFormValues): Agent {
  const d = copy.defaults;
  const base: Agent = {
    id: crypto.randomUUID(),
    slug: "",
    name: "",
    title: "",
    photoAlt: "",
    areas: [],
    years: 0,
    stat: d.stat,
    rating: d.rating,
    reviewCount: 0,
    phone: "",
    email: "",
    languages: [],
    specialties: [],
    focus: [],
    shortBio: "",
    bio: [],
    quote: d.quote,
    credentials: d.credentials,
    funFact: d.funFact,
  };
  return {
    ...base,
    ...agentPatch(values, base),
    slug: uniqueSlug(values.name),
  };
}
