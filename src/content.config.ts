/**
 * Projects: one Markdown file per project in src/content/projects.
 * The README explains every field. Files starting with "_" are ignored (use that for templates).
 *
 * A project only reaches the live site when draft is false AND permissionConfirmed is true.
 * While you run `npm run dev`, everything shows so you can check the layout.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const mediaItem = z.object({
  kind: z.enum(['image', 'video']),
  /** Cloudinary public ID, e.g. "hyacinth portfolio/rabble/flatlay-01". Use [PLACEHOLDER: ...] until uploaded. */
  id: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  /** Shape of the media, e.g. "9:16" for Reels/TikTok, "4:5" for feed posts, "1:1", "16:9". */
  aspect: z.string().default('4:5'),
  /** Optional custom poster image (Cloudinary image ID) for a video. */
  poster: z.string().optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** One or two sentences for the work card. */
    summary: z.string().max(180),
    category: z.enum([
      'Short-Form Video',
      'Social Media & Design',
      'UGC & Influencer',
      'E-commerce',
      'Digital Workflows',
    ]),
    /** Shown as a label so nobody assumes more than what I did. */
    type: z.enum(['Client work', 'Team project', 'Concept', 'Personal project']),
    client: z.string().optional(),
    /** e.g. "2025" or "Mar to Jun 2025". Leave out if not confirmed. */
    date: z.string().optional(),
    context: z.string(),
    role: z.string(),
    delivered: z.array(z.string()),
    tools: z.array(z.string()).default([]),
    /** Only results I have verified. Leave empty if none. */
    outcomes: z.array(z.string()).default([]),
    cover: mediaItem,
    media: z.array(mediaItem).default([]),
    /** Lower numbers show first. */
    order: z.number().default(100),
    featured: z.boolean().default(true),
    permissionConfirmed: z.boolean().default(false),
    draft: z.boolean().default(true),
  }),
});

export const collections = { projects };
