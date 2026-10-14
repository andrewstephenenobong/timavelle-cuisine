// Cloudinary serves resized/optimised variants straight from the stored URL, so the public gallery can load
// small thumbnails in the grid and a tuned high-quality version in the viewer without any extra uploads.
// Non-Cloudinary or local URLs are returned unchanged.
export function cloudinaryVariant(url: string, transformation: string) {
  const marker = '/image/upload/';
  const index = url.indexOf(marker);
  if (!url.includes('res.cloudinary.com') || index === -1) return url;
  const head = url.slice(0, index + marker.length);
  const tail = url.slice(index + marker.length);
  if (/^[a-z]{1,3}_[^/]+(,[a-z]{1,3}_[^/]+)*\//.test(tail)) return url;
  return `${head}${transformation}/${tail}`;
}

export const galleryThumb = (url: string) => cloudinaryVariant(url, 'f_auto,q_auto,c_fill,g_auto,w_480,h_480');
export const galleryCover = (url: string) => cloudinaryVariant(url, 'f_auto,q_auto,c_fill,g_auto,w_720,h_540');
export const galleryFull = (url: string) => cloudinaryVariant(url, 'f_auto,q_auto:good,c_limit,w_2000');
