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
  resumeFile: z.string(),
  /** The resume download only appears on the live site once this is true. */
  resumeConfirmed: z.boolean(),
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
    skills: z.array(z.object({ title: z.string(), text: z.string(), category: z.string().optional() })),
  }),
  aboutJson,
  'about.json',
);

const experience = parse(
  z.object({
    roles: z.array(
      z.object({
        confirmed: z.boolean(),
        role: z.string(),
        company: z.string(),
        type: z.string().optional(),
        dates: z.string(),
        points: z.array(z.string()),
      }),
    ),
  }),
  experienceJson,
  'experience.json',
);
export const roles = experience.roles.filter((r) => r.confirmed || showUnconfirmed);

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
