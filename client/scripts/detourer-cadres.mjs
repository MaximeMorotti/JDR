// Script ponctuel : détoure le fond blanc des 4 images de cadre (docs/img/cadre/) et les
// exporte en WebP transparent dans client/public/img/cadres/. Sharp retiré après usage.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const RACINE = path.resolve(import.meta.dirname, "..", "..");
const SRC = path.join(RACINE, "docs/img/cadre");
const DEST = path.join(RACINE, "client/public/img/cadres");

const fichiers = [
  ["cadre_elf.png", "elfe.webp"],
  ["cadre_nain.png", "nain.webp"],
  ["cadre mage.png", "mage.webp"],
  ["cadre_demi-orc.png", "demi-orc.webp"],
];

// Seuils de détourage : blanc pur -> transparent, dégradé doux entre les deux pour l'anti-aliasing.
const SEUIL_BAS = 222; // en dessous : opaque
const SEUIL_HAUT = 250; // au dessus : transparent

function alphaPourPixel(r, g, b) {
  const minChannel = Math.min(r, g, b);
  if (minChannel <= SEUIL_BAS) return 255;
  if (minChannel >= SEUIL_HAUT) return 0;
  const t = (minChannel - SEUIL_BAS) / (SEUIL_HAUT - SEUIL_BAS);
  return Math.round(255 * (1 - t));
}

async function detourerEtExporter(src, dest) {
  const image = sharp(src).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    data[i + 3] = alphaPourPixel(r, g, b);
  }

  await mkdir(DEST, { recursive: true });
  await sharp(data, { raw: { width, height, channels } })
    .resize({ width: 700, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(path.join(DEST, dest));
  console.log(`✔ ${src} -> ${dest}`);
}

for (const [srcNom, destNom] of fichiers) {
  await detourerEtExporter(path.join(SRC, srcNom), destNom);
}
console.log("Terminé.");
