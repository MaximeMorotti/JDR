// Script ponctuel : détoure le fond blanc de docs/img/transition/porte.png (panneau de porte de
// taverne, vue de face) et l'exporte en WebP transparent dans client/public/img/transition/.
// Sharp retiré après usage. Même technique de seuillage que detourer-cadres.mjs.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const RACINE = path.resolve(import.meta.dirname, "..", "..");
const SRC = path.join(RACINE, "docs/img/transition/porte.png");
const DEST_DIR = path.join(RACINE, "client/public/img/transition");
const DEST = path.join(DEST_DIR, "porte.webp");

const SEUIL_BAS = 222;
const SEUIL_HAUT = 250;

function alphaPourPixel(r, g, b) {
  const minChannel = Math.min(r, g, b);
  if (minChannel <= SEUIL_BAS) return 255;
  if (minChannel >= SEUIL_HAUT) return 0;
  const t = (minChannel - SEUIL_BAS) / (SEUIL_HAUT - SEUIL_BAS);
  return Math.round(255 * (1 - t));
}

const image = sharp(SRC).ensureAlpha();
const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  data[i + 3] = alphaPourPixel(r, g, b);
}

await mkdir(DEST_DIR, { recursive: true });
await sharp(data, { raw: { width, height, channels } })
  .resize({ width: 900, withoutEnlargement: true })
  .webp({ quality: 92 })
  .toFile(DEST);
console.log(`✔ porte.png -> ${DEST}`);
