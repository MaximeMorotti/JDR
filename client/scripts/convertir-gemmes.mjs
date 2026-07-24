// Script ponctuel : convertit en WebP les 5 illustrations de gemmes/pierre déjà détourées à la
// main par l'utilisateur (docs/img/transition/{ruby,saphire,emeraude,ambre,kayou}.png — fond déjà
// transparent, contrairement à la première passe où le fond était blanc uni). Simple conversion,
// pas de seuillage alpha ici. Sharp retiré après usage.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const RACINE = path.resolve(import.meta.dirname, "..", "..");
const SRC = path.join(RACINE, "docs/img/transition");
const DEST_DIR = path.join(RACINE, "client/public/img/transition/gemmes");

const fichiers = [
  ["ruby.png", "ruby.webp"],
  ["saphire.png", "saphir.webp"],
  ["emeraude.png", "emeraude.webp"],
  ["ambre.png", "ambre.webp"],
  ["kayou.png", "pierre.webp"],
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
