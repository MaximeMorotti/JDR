-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_equipes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "orRestant" INTEGER NOT NULL DEFAULT 100,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "aventureCommencee" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_equipes" ("createdAt", "id", "nom", "orRestant", "updatedAt") SELECT "createdAt", "id", "nom", "orRestant", "updatedAt" FROM "equipes";
DROP TABLE "equipes";
ALTER TABLE "new_equipes" RENAME TO "equipes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
