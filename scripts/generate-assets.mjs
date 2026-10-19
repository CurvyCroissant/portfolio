import fs from 'node:fs/promises';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
const publicDir = new URL('../public/', import.meta.url);
await Promise.all([
  sharp(await fs.readFile(new URL('favicon.svg', publicDir))).resize(180, 180).png().toFile(fileURLToPath(new URL('apple-touch-icon.png', publicDir))),
  sharp(await fs.readFile(new URL('social-preview.svg', publicDir))).png().toFile(fileURLToPath(new URL('social-preview.png', publicDir))),
]);
