/**
 * Turns a showcase item into everything a tile and the viewer need: poster, srcset, hover preview,
 * full-size media and the "my role" line. Used by the work showcase and the preview strip in the hero.
 */
import { roleFor, type ShowcaseItem } from './data';
import { imageUrl, imageSrcset, videoUrl, posterFor, videoPreviewUrl, aspectToSize } from './cloudinary';

/** What the viewer needs to show one item (sent to the browser as data attributes or JSON). */
export type ViewerEntry = {
  kind: 'image' | 'video';
  full: string;
  poster?: string;
  title: string;
  brand?: string;
  alt: string;
  role?: string;
  /** Shape of the piece, e.g. "9:16", so the viewer opens at the right size before the file loads. */
  aspect?: string;
};

export function viewerEntry(i: ShowcaseItem): ViewerEntry {
  const isVideo = i.kind === 'video';
  return {
    kind: i.kind,
    full: isVideo ? videoUrl(i.media) : imageUrl(i.media, 1600),
    poster: isVideo ? posterFor({ id: i.media }, 720) : undefined,
    title: i.title,
    brand: i.brand,
    alt: i.alt,
    role: roleFor(i.brand),
    aspect: i.aspect,
  };
}

/** Tile image (cropped to the tile shape) plus the hover preview for videos. */
export function tileMedia(i: ShowcaseItem, aspect: string, widths = [320, 480, 720]) {
  const isVideo = i.kind === 'video';
  const { width, height } = aspectToSize(aspect, 480);
  return {
    width,
    height,
    src: isVideo ? posterFor({ id: i.media }, 480, aspect) : imageUrl(i.media, 480, aspect),
    srcset: isVideo
      ? widths.map((w) => `${posterFor({ id: i.media }, w, aspect)} ${w}w`).join(', ')
      : imageSrcset(i.media, aspect, widths),
    preview: isVideo ? videoPreviewUrl(i.media, 360, aspect) : undefined,
  };
}
