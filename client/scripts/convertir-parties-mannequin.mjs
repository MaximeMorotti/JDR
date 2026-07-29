// Script ponctuel : convertit les illustrations d'équipement du mannequin (docs/img/boutique/,
// une image par emplacement, toutes calées sur le même canevas 1024x1024 que manequin.png) en
// WebP, noms de fichiers ASCII (l'accent de "tête" posait problème en URL). Sharp retiré après
// usage.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const RACINE = path.resolve(import.meta.dirname, "..", "..");
const SRC = path.join(RACINE, "docs/img/boutique");
const DEST_DIR = path.join(RACINE, "client/public/img/boutique");

const fichiers = [
  ["manequin_tête.png", "tete.webp"],
  ["manequin_collier.png", "collier.webp"],
  ["manequin_cape_back.png", "cape-back.webp"],
  ["manequin_cape_front.png", "cape-front.webp"],
  ["manequin_torse.png", "torse.webp"],
  ["manequin_bras.png", "bras.webp"],
  ["manequin_bas.png", "bas.webp"],
  ["manequin_ceinture.png", "ceinture.webp"],
  ["manequin_pied.png", "pied.webp"],
  ["manequin_bracelet_1.png", "bracelet-1.webp"],
  ["manequin_bracelet_2.png", "bracelet-2.webp"],
  ["manequin_anneau_1.png", "anneau-1.webp"],
  ["manequin_anneau_2.png", "anneau-2.webp"],
  ["manequin_arme_1.png", "arme-1.webp"],
  ["manequin_arme_2.png", "arme-2.webp"],
  ["manequin_carquoi.png", "carquois.webp"],
];

await mkdir(DEST_DIR, { recursive: true });
for (const [srcNom, destNom] of fichiers) {
  await sharp(path.join(SRC, srcNom)).resize({ width: 1000 }).webp({ quality: 92 }).toFile(path.join(DEST_DIR, destNom));
  console.log(`✔ ${srcNom} -> ${destNom}`);
}
console.log("Terminé.");
