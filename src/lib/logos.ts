/**
 * Logos live in public/logos (white, trimmed, 160px tall WebP). Brands without a logo file show their name.
 * Width is set from each logo's shape so wide wordmarks and square marks look about the same size.
 */
export const logos: Record<string, { file: string; w: number; h: number }> = {
  'Epic Tales': { file: 'epictales', w: 597, h: 160 },
  'Expert Biotics': { file: 'expertbiotics', w: 570, h: 160 },
  'Hair Solution Nails and Spa': { file: 'hairsolution', w: 694, h: 160 },
  'Hyacinth Gadgets': { file: 'hyacinthgadgets', w: 207, h: 160 },
  'iLuxe Aesthetic Center': { file: 'iluxe', w: 128, h: 160 },
  'Proper Ecom': { file: 'properecom', w: 780, h: 160 },
  'Rabble': { file: 'rabble', w: 496, h: 160 },
  'Stacked Science': { file: 'stackedscience', w: 370, h: 160 },
  'Style State': { file: 'stylestate', w: 2063, h: 160 },
  'Suezicu': { file: 'suezicu', w: 1281, h: 160 },
  'T-James Sporty Bar': { file: 'tjamessportybar', w: 163, h: 160 },
  'Uncle Scientist': { file: 'unclescientist', w: 364, h: 160 },
  'Winnie & Co.': { file: 'winnieandco', w: 1254, h: 160 },
};
export const logoSize = (l: { w: number; h: number }, scale = 62, cap = 190) => {
  const ratio = l.w / l.h;
  const width = Math.round(Math.min(cap, scale * Math.sqrt(ratio))); // equal visual area, capped for long wordmarks
  return { width, height: Math.round(width / ratio) };
};
