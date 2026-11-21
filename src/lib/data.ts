/**
 * Loads and checks src/data/site.json.
 * A typo or missing field stops the build with a clear message instead of shipping a broken page.
 */
import { z } from 'astro/zod';
import siteJson from '../data/site.json';

/** True for empty values and anything still in [BRACKETS], like "[PLACEHOLDER: contact email]". */
export const isPlaceholder = (value: unknown): boolean =>
  typeof value !== 'string' || value.trim() === '' || /^\[.*\]$/.test(value.trim());

/** Keep a value only when it's real content. */
export const filled = (value: string | null | undefined): string | undefined =>
  value && !isPlaceholder(value) ? value : undefined;

const link = z.object({ label: z.string(), href: z.string() });

const siteSchema = z.object({
  name: z.string(),
  role: z.string(),
  domain: z.string(),
  email: z.string(),
  location: z.string(),
  /** Short status for the badge on the profile card. Hidden while it's a [PLACEHOLDER]. */
  availability: z.string(),
  resumeFile: z.string(),
  /** The resume download only appears on the live site once this is true. */
  resumeConfirmed: z.boolean(),
  /** Calendly (or other booking) link for "Schedule a call" and "Talk about a role". While it's a [PLACEHOLDER], the buttons go to the contact form. */
  bookingUrl: z.string().optional(),
  /** The numbers bar under the hero. */
  stats: z.array(z.object({ value: z.number(), suffix: z.string(), label: z.string() })),
  cloudName: z.string(),
  cloudFolder: z.string(),
  socials: z.array(z.object({ label: z.string(), url: z.string() })),
  seo: z.object({ title: z.string(), description: z.string().max(160), ogImage: z.string() }),
  hero: z.object({
    headline: z.string(),
    intro: z.string(),
    primaryCta: link,
    secondaryCta: link,
    portraitAlt: z.string(),
  }),
});

const result = siteSchema.safeParse(siteJson);
if (!result.success) {
  throw new Error(`\n\nsrc/data/site.json has a problem:\n${z.prettifyError(result.error)}\n`);
}

export const site = result.data;
export const publicEmail = filled(site.email);
export const resumeFile = site.resumeConfirmed || import.meta.env.DEV ? filled(site.resumeFile) : undefined;
export const bookingUrl = filled(site.bookingUrl);
export const publishedSocials = site.socials.filter((s) => !isPlaceholder(s.url));

/* ---------- about.json, experience.json, tools.json ---------- */
import aboutJson from '../data/about.json';
import experienceJson from '../data/experience.json';
import toolsJson from '../data/tools.json';

/**
 * Content marked confirmed: false shows while running `npm run dev` (with a "needs confirmation" tag)
 * and is left off the live site until it's confirmed.
 */
export const showUnconfirmed = import.meta.env.DEV;

function parse<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const r = schema.safeParse(data);
  if (!r.success) throw new Error(`\n\nsrc/data/${file} has a problem:\n${z.prettifyError(r.error)}\n`);
  return r.data;
}

export const about = parse(
  z.object({
    confirmed: z.boolean(),
    heading: z.string(),
    bio: z.array(z.string()),
    facts: z.array(z.object({ label: z.string(), value: z.string() })),
    portraitAlt: z.string(),
    skills: z.array(z.object({ title: z.string(), text: z.string(), help: z.string().optional(), category: z.string().optional() })),
  }),
  aboutJson,
  'about.json',
);

export const experience = parse(
  z.object({
    professional: z.array(
      z.object({
        company: z.string(), role: z.string(), dates: z.string(), type: z.string(), industry: z.string(),
        summary: z.string(), points: z.array(z.string()), brands: z.array(z.string()),
      }),
    ),
    additional: z.array(z.object({ company: z.string(), role: z.string(), note: z.string() })),
    businesses: z.object({
      intro: z.string(),
      skills: z.array(z.string()),
      list: z.array(z.object({ name: z.string(), industry: z.string(), dates: z.string(), highlight: z.string() })),
    }),
  }),
  experienceJson,
  'experience.json',
);
export const roles = experience.professional;

/** Sections with nothing confirmed yet are left off the live site, along with their menu links. */
export const showAbout = about.confirmed || showUnconfirmed;
export const showExperience = roles.length > 0;

const tool = z.union([z.string(), z.object({ name: z.string(), check: z.string().optional() })]);
export const tools = parse(
  z.object({
    confirmed: z.boolean(),
    groups: z.array(z.object({ name: z.string(), tools: z.array(tool) })),
  }),
  toolsJson,
  'tools.json',
);
export const showTools = tools.confirmed || showUnconfirmed;

/* ---------- showcase.json and proof.json ---------- */
import showcaseJson from '../data/showcase.json';
import proofJson from '../data/proof.json';

const showcaseData = parse(
  z.object({
    categories: z.array(z.object({ key: z.string(), label: z.string() })),
    grouped: z.array(z.string()),
    /** Ids for the Featured row above the gallery, in order. */
    spotlight: z.array(z.string()).optional(),
    roles: z.record(z.string(), z.string()),
    /** Brands I handled through an agency or client, shown together under that client (e.g. Proper Ecom). */
    groups: z.record(z.string(), z.object({ brands: z.array(z.string()), note: z.string() })).optional(),
    items: z.array(
      z.object({
        id: z.string(),
        category: z.string(),
        title: z.string(),
        alt: z.string(),
        kind: z.enum(['image', 'video']),
        media: z.string(),
        aspect: z.string(),
        brand: z.string().optional(),
        board: z.boolean().optional(),
        featured: z.boolean().optional(),
        hidden: z.boolean().optional(),
        /** Optional, shown in the viewer only when filled: what the brief was, and a verified outcome. */
        brief: z.string().optional(),
        outcome: z.string().optional(),
      }),
    ),
  }),
  showcaseJson,
  'showcase.json',
);
export type ShowcaseItem = (typeof showcaseData.items)[number];
/** Tabs that show one cover per brand, and the "my role" line for each brand. */
export const groupedTabs = new Set(showcaseData.grouped);
/** The client a brand belongs to, if I handled it through one (e.g. Expert Biotics through Proper Ecom). */
export const brandGroups = showcaseData.groups ?? {};
export const groupOf = (brand?: string) =>
  brand ? Object.keys(brandGroups).find((g) => brandGroups[g].brands.includes(brand)) : undefined;
export const roleFor = (brand?: string) =>
  brand ? showcaseData.roles[brand] ?? showcaseData.roles[groupOf(brand) ?? ''] : undefined;
/** The Featured row: items picked by id in showcase.json "spotlight", in that order. */
export const spotlight = (showcaseData.spotlight ?? [])
  .map((id) => showcaseData.items.find((i) => i.id === id && !i.hidden))
  .filter((i): i is ShowcaseItem => !!i);
/** Categories that have at least one visible item, each with its items (featured first). */
export const showcase = showcaseData.categories
  .map((c) => ({
    ...c,
    items: showcaseData.items
      .filter((i) => i.category === c.key && !i.hidden)
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured)),
  }))
  .filter((c) => c.items.length > 0);

export const proof = parse(
  z.object({
    caseStudies: z.array(
      z.object({
        id: z.string(),
        eyebrow: z.string(),
        title: z.string(),
        intro: z.string(),
        rows: z.array(z.object({ brand: z.string(), creator: z.string(), audience: z.string(), deal: z.string(), detail: z.string(), video: z.string().optional() })).optional(),
        points: z.array(z.string()).optional(),
        /** UGC and creator videos (Cloudinary public IDs). Shown only when someone selects "Watch the videos". */
        videos: z
          .array(z.object({ media: z.string(), title: z.string(), alt: z.string(), brand: z.string().optional() }))
          .optional(),
        reports: z
          .array(
            z.object({
              label: z.string(),
              stats: z.array(z.object({ value: z.string(), label: z.string(), change: z.string().optional() })),
              note: z.string(),
            }),
          )
          .optional(),
      }),
    ),
    /** Influencer platforms: ones I've used, and similar ones I can work in. */
    platforms: z.object({ used: z.array(z.string()), similar: z.array(z.string()) }),
    testimonials: z.array(z.object({ quote: z.string(), name: z.string(), role: z.string(), url: z.string().optional() })),
    certifications: z.array(z.object({ title: z.string(), issuer: z.string(), date: z.string(), image: z.string() })),
  }),
  proofJson,
  'proof.json',
);
