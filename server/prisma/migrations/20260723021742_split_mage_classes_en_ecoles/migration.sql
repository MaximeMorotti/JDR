/*
  Warnings:

  - You are about to drop the column `aBesoinEcole` on the `classes_ref` table. All the data in the column will be lost.
  - You are about to drop the column `ecole` on the `specialisations_ref` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_classes_ref" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "roleCombat" TEXT NOT NULL,
    "armureMax" TEXT NOT NULL,
    "armesInterdites" TEXT NOT NULL
);
INSERT INTO "new_classes_ref" ("armesInterdites", "armureMax", "id", "nom", "roleCombat", "type") SELECT "armesInterdites", "armureMax", "id", "nom", "roleCombat", "type" FROM "classes_ref";
DROP TABLE "classes_ref";
ALTER TABLE "new_classes_ref" RENAME TO "classes_ref";
CREATE TABLE "new_specialisations_ref" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classeId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attaqueSignature" TEXT NOT NULL,
    CONSTRAINT "specialisations_ref_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "classes_ref" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_specialisations_ref" ("attaqueSignature", "classeId", "description", "id", "nom") SELECT "attaqueSignature", "classeId", "description", "id", "nom" FROM "specialisations_ref";
DROP TABLE "specialisations_ref";
ALTER TABLE "new_specialisations_ref" RENAME TO "specialisations_ref";
CREATE UNIQUE INDEX "specialisations_ref_classeId_nom_key" ON "specialisations_ref"("classeId", "nom");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
