-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_compagnons_ref" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "lore" TEXT NOT NULL,
    "pv" INTEGER NOT NULL,
    "force" INTEGER NOT NULL,
    "dexterite" INTEGER NOT NULL,
    "vitalite" INTEGER NOT NULL,
    "intelligence" INTEGER,
    "capaciteTransport" TEXT NOT NULL,
    "attaques" TEXT NOT NULL,
    "raceRequiseId" TEXT,
    CONSTRAINT "compagnons_ref_raceRequiseId_fkey" FOREIGN KEY ("raceRequiseId") REFERENCES "races_ref" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_compagnons_ref" ("attaques", "capaciteTransport", "dexterite", "force", "id", "intelligence", "lore", "nom", "pv", "role", "vitalite") SELECT "attaques", "capaciteTransport", "dexterite", "force", "id", "intelligence", "lore", "nom", "pv", "role", "vitalite" FROM "compagnons_ref";
DROP TABLE "compagnons_ref";
ALTER TABLE "new_compagnons_ref" RENAME TO "compagnons_ref";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
