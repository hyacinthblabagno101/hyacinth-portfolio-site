import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/** While running `npm run dev`, drafts and unconfirmed projects show (marked) so you can check layouts. */
export const showUnpublished = import.meta.env.DEV;

export const isPublished = (p: Project) => !p.data.draft && p.data.permissionConfirmed;

/** Projects on this build, in order (lowest "order" first, then title). */
export async function visibleProjects(): Promise<Project[]> {
  const all = await getCollection('projects', (p) => isPublished(p) || showUnpublished);
  return all.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

/** Category order used for the filter buttons. Only categories with projects are shown. */
export const CATEGORY_ORDER = [
  'Short-Form Video',
  'Social Media & Design',
  'UGC & Influencer',
  'E-commerce',
  'Digital Workflows',
] as const;
