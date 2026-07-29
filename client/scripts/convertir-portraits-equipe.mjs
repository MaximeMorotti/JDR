// Script ponctuel : convertit en WebP les 5 nouvelles illustrations larges (~2:1) composées
// spécifiquement pour la bannière personnage de la page équipe (docs/img/équipe/) — remplacent le
// portrait carré (docs/img/races/) recadré en 1:1 pour cet usage précis. Images déjà pleines
// (opaques, pas de transparence à traiter). Sharp retiré après usage.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const RACINE = path.resolve(import.meta.dirname, "..", "..");
const SRC = path.join(RACINE, "docs/img/équipe");
const DEST_DIR = path.join(RACINE, "client/public/img/equipe-portraits");

const fichiers = [
  ["homme_ratio_2!1.png", "humain.webp"],
  ["nain_ratio_2!1.png", "nain.webp"],
  ["elf_ratio_2!1.png", "elfe.webp"],
  ["demi-orc_ratio_2!1.png", "demi-orc.webp"],
  ["mage_ratio_2!1.png", "mage.webp"],
];

await mkdir(DEST_DIR, { recursive: true });
for (const [srcNom, destNom] of fichiers) {
  await sharp(path.join(SRC, srcNom))
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(path.join(DEST_DIR, destNom));
  console.log(`✔ ${srcNom} -> ${destNom}`);
}
console.log("Terminé.");
