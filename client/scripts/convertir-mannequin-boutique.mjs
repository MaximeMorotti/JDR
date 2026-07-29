// Script ponctuel : convertit le mannequin détouré (docs/img/boutique/manequin.png, fond
// transparent) en WebP optimisé pour la page boutique. Sharp retiré après usage.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const RACINE = path.resolve(import.meta.dirname, "..", "..");
const SRC = path.join(RACINE, "docs/img/boutique/manequin.png");
const DEST_DIR = path.join(RACINE, "client/public/img/boutique");

await mkdir(DEST_DIR, { recursive: true });
await sharp(SRC).resize({ width: 1000 }).webp({ quality: 92 }).toFile(path.join(DEST_DIR, "manequin.webp"));
console.log("✔ manequin.png -> manequin.webp (1000px)");
