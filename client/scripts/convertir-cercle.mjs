// Script ponctuel : convertit en WebP le cercle runique déjà détouré fourni par l'utilisateur
// (docs/img/transition/cercle magique.png — fond déjà transparent). Simple conversion, pas de
// seuillage alpha. Sharp retiré après usage.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const RACINE = path.resolve(import.meta.dirname, "..", "..");
const SRC = path.join(RACINE, "docs/img/transition/cercle magique.png");
const DEST_DIR = path.join(RACINE, "client/public/img/transition");
const DEST = path.join(DEST_DIR, "cercle.webp");

await mkdir(DEST_DIR, { recursive: true });
await sharp(SRC)
  .resize({ width: 700, withoutEnlargement: true })
  .webp({ quality: 92 })
  .toFile(DEST);
console.log(`✔ cercle magique.png -> ${DEST}`);
