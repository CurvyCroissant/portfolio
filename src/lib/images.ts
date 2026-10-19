import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>('../assets/img/**/*.jpg', { eager: true });

export function imageFor(path: string): ImageMetadata {
  const image = images[`../assets/img/${path}`]?.default;
  if (!image) throw new Error(`Unknown portfolio image: ${path}`);
  return image;
}
