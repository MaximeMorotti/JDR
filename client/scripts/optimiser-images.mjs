// Script ponctuel : convertit les illustrations sources (docs/img) en WebP optimisés
// pour l'app (client/public/img). Pas une dépendance runtime — sharp est retiré après usage.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const RACINE = path.resolve(import.meta.dirname, "..", "..");
const SRC_RACES = path.join(RACINE, "docs/img/img_bestiaire");
const SRC_COMPAGNONS = path.join(RACINE, "docs/img/img_compagnon/final");
const DEST_RACES = path.join(RACINE, "client/public/img/races");
const DEST_COMPAGNONS = path.join(RACINE, "client/public/img/compagnons");

const races = [
  ["1_HUMAIN.png", "humain.webp"],
  ["2_ELFE.png", "elfe.webp"],
  ["3_NAIN.png", "nain.webp"],
  ["4_DEMI-ORC.png", "demi-orc.webp"],
  ["5_MAGE.png", "mage.webp"],
];

// Correspondance déduite visuellement (aucune source textuelle ne relie les noms de fichiers
// aux espèces du Codex des Compagnons — à confirmer si besoin) :
const compagnons = [
  ["Nono.png", "chihuahua.webp"],
  ["Jack du dommaine de la reine.png", "cocker.webp"],
  ["douggybag.png", "labrador.webp"],
  ["Ulysse.png", "border-collie.webp"],
  ["Oneyl.png", "berger-australien.webp"],
  ["petitonère.png", "mule.webp"],
  ["Buck.png", "elan.webp"],
  ["papito.png", "gnome.webp"],
  ["Perseval.png", "sanglier-dresse.webp"],
  ["Hyubert.png", "fee.webp"],
];

async function convertir(srcDir, destDir, paires, largeur) {
  await mkdir(destDir, { recursive: true });
  for (const [src, dest] of paires) {
    await sharp(path.join(srcDir, src))
      .resize({ width: largeur, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(destDir, dest));
    console.log(`✔ ${src} -> ${dest}`);
  }
}

await convertir(SRC_RACES, DEST_RACES, races, 480);
await convertir(SRC_COMPAGNONS, DEST_COMPAGNONS, compagnons, 480);
console.log("Terminé.");
