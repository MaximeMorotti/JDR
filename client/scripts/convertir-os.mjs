// Script ponctuel : convertit en WebP les 6 illustrations d'ossements déjà détourées à la main par
// l'utilisateur (docs/img/transition/os/{crâne,fémure,main,tas_os,tibia,torax}.png — fond déjà
// transparent). Noms de destination volontairement en ASCII (évite tout souci d'URL/encodage
// avec les accents des noms sources). Simple conversion, pas de seuillage alpha. Sharp retiré
// après usage.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const RACINE = path.resolve(import.meta.dirname, "..", "..");
const SRC = path.join(RACINE, "docs/img/transition/os");
const DEST_DIR = path.join(RACINE, "client/public/img/transition/os");

const fichiers = [
  ["crâne.png", "crane.webp"],
  ["fémure.png", "femur.webp"],
  ["main.png", "main.webp"],
  ["tibia.png", "tibia.webp"],
  ["torax.png", "torax.webp"],
  ["tas_os.png", "tas.webp"],
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
