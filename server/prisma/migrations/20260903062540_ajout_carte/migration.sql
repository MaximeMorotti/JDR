-- CreateTable
CREATE TABLE "cartes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "zoneLiee" TEXT NOT NULL,
    "largeur" INTEGER NOT NULL,
    "hauteur" INTEGER NOT NULL,
    "jsonLayout" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
