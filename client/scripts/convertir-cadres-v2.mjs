// Script ponctuel : convertit en WebP les nouveaux cadres déjà détourés par l'utilisateur —
// docs/img/cadre/personnage/ (cadres circulaires pour l'étoile de sélection de race, incluant
// désormais un cadre Humain réel remplaçant l'anneau bronze CSS) et docs/img/cadre/equipe/
// (cadres bannière larges pour les cartes personnage de la page équipe). Fond déjà transparent,
// aucun seuillage. Sharp retiré après usage.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const RACINE = path.resolve(import.meta.dirname, "..", "..");

const cadresPersonnage = [
  ["cadre_homme.png", "humain.webp"],
  ["cadre_nain.png", "nain.webp"],
  ["cadre_elf.png", "elfe.webp"],
  ["cadre_demi-orc.png", "demi-orc.webp"],
  ["cadre mage.png", "mage.webp"],
];
const cadresEquipe = [
  ["cadre_equipe_homme.png", "humain.webp"],
  ["cadre_equipe _nain.png", "nain.webp"],
  ["cadre_equie_elf.png", "elfe.webp"],
  ["cadre_equipe_demi-orc.png", "demi-orc.webp"],
  ["cadre_equipe_mage.png", "mage.webp"],
];

async function convertirLot(srcDir, destDir, largeur, fichiers) {
  await mkdir(destDir, { recursive: true });
  for (const [srcNom, destNom] of fichiers) {
    await sharp(path.join(srcDir, srcNom))
      .resize({ width: largeur, withoutEnlargement: true })
      .webp({ quality: 92 })
      .toFile(path.join(destDir, destNom));
    console.log(`✔ ${srcNom} -> ${destNom}`);
  }
}

await convertirLot(
  path.join(RACINE, "docs/img/cadre/personnage"),
  path.join(RACINE, "client/public/img/cadres"),
  700,
  cadresPersonnage
);
await convertirLot(
  path.join(RACINE, "docs/img/cadre/equipe"),
  path.join(RACINE, "client/public/img/cadres/equipe"),
  1400,
  cadresEquipe
);
console.log("Terminé.");
