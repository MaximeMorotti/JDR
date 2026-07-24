// Script ponctuel : convertit en WebP les 3 illustrations de feuilles déjà détourées à la main par
// l'utilisateur (docs/img/transition/elf/{feuille_orange,feuille_verte,feuille_elfique}.png —
// fond déjà transparent). Simple conversion, pas de seuillage alpha ici. Sharp retiré après usage.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const RACINE = path.resolve(import.meta.dirname, "..", "..");
const SRC = path.join(RACINE, "docs/img/transition/elf");
const DEST_DIR = path.join(RACINE, "client/public/img/transition/feuilles");

const fichiers = [
  ["feuille_orange.png", "orange.webp"],
  ["feuille_verte.png", "verte.webp"],
  ["feuille_elfique.png", "elfique.webp"],
];

await mkdir(DEST_DIR, { recursive: true });
for (const [srcNom, destNom] of fichiers) {
  await sharp(path.join(SRC, srcNom))
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(path.join(DEST_DIR, destNom));
  console.log(`✔ ${srcNom} -> ${destNom}`);
}
console.log("Terminé.");
