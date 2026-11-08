/**
 * Cloudinary URL helpers. Nothing here calls the Cloudinary API, it only builds
 * delivery URLs, so it needs no keys.
 *
 * Media IDs in project files are Cloudinary public IDs, e.g. "hyacinth portfolio/rabble/flatlay-01".
 * - IDs in [BRACKETS] are placeholders and render as a labeled striped block.
 * - IDs starting with "demo:" load from Cloudinary's public sample account. Only used to test
 *   video playback on placeholder projects; never use it for real work.
 */
import { site, isPlaceholder } from './data';

export const isMissing = (id: string | undefined) => !id || isPlaceholder(id);

function resolve(id: string): { base: string; path: string } {
  const demo = id.startsWith('demo:');
  const cloud = demo ? 'demo' : site.cloudName;
  const publicId = demo ? id.slice(5) : id;
  return {
    base: `https://res.cloudinary.com/${cloud}`,
    path: publicId.split('/').map(encodeURIComponent).join('/'),
  };
}

const crop = (width: number, aspect?: string) =>
  aspect ? [`w_${width}`, `ar_${aspect}`, 'c_fill', 'g_auto'] : [`w_${width}`, 'c_limit'];

/** Optimized image, cropped to the given aspect ratio. */
export function imageUrl(id: string, width: number, aspect?: string): string {
  const { base, path } = resolve(id);
  return `${base}/image/upload/${['f_auto', 'q_auto', ...crop(width, aspect)].join(',')}/${path}`;
}

/** Image as JPG, for files stored as PDFs (some certificates). */
export function jpgUrl(id: string, width: number): string {
  const { base, path } = resolve(id);
  return `${base}/image/upload/${['q_auto', ...crop(width)].join(',')}/${path}.jpg`;
}

/** Short silent loop for hover previews: first 6 seconds, no audio, small and light. */
export function videoPreviewUrl(id: string, width: number, aspect: string): string {
  const { base, path } = resolve(id);
  // Center crop: Cloudinary's g_auto works on video posters but not on video files
  return `${base}/video/upload/${['du_6', 'ac_none', 'q_auto:low', `w_${width}`, `ar_${aspect}`, 'c_fill'].join(',')}/${path}.mp4`;
}

export const imageSrcset = (id: string, aspect?: string, widths = [400, 800, 1200]) =>
  widths.map((w) => `${imageUrl(id, w, aspect)} ${w}w`).join(', ');

/** Full video for click-to-play. Capped at 1080px wide; Cloudinary picks the best format per browser. */
export function videoUrl(id: string): string {
  const { base, path } = resolve(id);
  return `${base}/video/upload/f_auto:video,q_auto,w_1080,c_limit/${path}`;
}

/** Poster frame taken 1 second in (many edits open on a blank or title frame). */
export function videoPosterUrl(id: string, width: number, aspect?: string): string {
  const { base, path } = resolve(id);
  return `${base}/video/upload/${['so_1', 'f_auto', 'q_auto', ...crop(width, aspect)].join(',')}/${path}.jpg`;
}

/** Poster for a video: its custom poster image if set, otherwise a frame from the video. */
export function posterFor(item: { id: string; poster?: string }, width: number, aspect?: string): string {
  return item.poster && !isMissing(item.poster)
    ? imageUrl(item.poster, width, aspect)
    : videoPosterUrl(item.id, width, aspect);
}

/** "9:16" -> { width, height } so the browser reserves the right space before media loads. */
export function aspectToSize(aspect: string, width: number) {
  const [w, h] = aspect.split(':').map(Number);
  return { width, height: Math.round((width * h) / w) };
}
