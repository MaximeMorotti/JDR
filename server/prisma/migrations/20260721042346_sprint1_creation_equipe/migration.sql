-- CreateTable
CREATE TABLE "equipes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "orRestant" INTEGER NOT NULL DEFAULT 100,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "personnages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pseudo" TEXT NOT NULL,
    "equipeId" TEXT NOT NULL,
    "raceId" TEXT NOT NULL,
    "classeId" TEXT NOT NULL,
    "specialisationId" TEXT,
    "genre" TEXT,
    "age" INTEGER,
    "alignement" TEXT,
    "origineNarrative" TEXT,
    "taille" REAL,
    "poids" REAL,
    "force" INTEGER NOT NULL,
    "dexterite" INTEGER NOT NULL,
    "vitalite" INTEGER NOT NULL,
    "charisme" INTEGER NOT NULL,
    "intelligence" INTEGER NOT NULL,
    "sagesse" INTEGER NOT NULL,
    "chance" INTEGER NOT NULL,
    "perception" INTEGER NOT NULL,
    "niveau" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "pointsCompetenceNonAlloues" INTEGER NOT NULL DEFAULT 0,
    "titre" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "personnages_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "equipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "personnages_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "races_ref" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "personnages_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "classes_ref" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "personnages_specialisationId_fkey" FOREIGN KEY ("specialisationId") REFERENCES "specialisations_ref" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "races_ref" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "tailleMin" REAL,
    "tailleMax" REAL,
    "poidsMin" REAL,
    "poidsMax" REAL,
    "traitRacial" TEXT NOT NULL,
    "lore" TEXT NOT NULL,
    "force" INTEGER NOT NULL,
    "dexterite" INTEGER NOT NULL,
    "vitalite" INTEGER NOT NULL,
    "charisme" INTEGER NOT NULL,
    "intelligence" INTEGER NOT NULL,
    "sagesse" INTEGER NOT NULL,
    "chance" INTEGER NOT NULL,
    "perception" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "classes_ref" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "roleCombat" TEXT NOT NULL,
    "armureMax" TEXT NOT NULL,
    "aBesoinEcole" BOOLEAN NOT NULL DEFAULT false,
    "armesInterdites" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "classes_autorisees_par_race" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "raceId" TEXT NOT NULL,
    "classeId" TEXT NOT NULL,
    "deconseille" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "classes_autorisees_par_race_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "races_ref" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "classes_autorisees_par_race_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "classes_ref" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "categories_armes_autorisees" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classeId" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    CONSTRAINT "categories_armes_autorisees_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "classes_ref" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "specialisations_ref" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classeId" TEXT NOT NULL,
    "ecole" TEXT,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attaqueSignature" TEXT NOT NULL,
    CONSTRAINT "specialisations_ref_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "classes_ref" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "objets_ref" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "emplacement" TEXT,
    "palier" TEXT NOT NULL,
    "origine" TEXT NOT NULL,
    "poidsArmure" TEXT,
    "prix" INTEGER,
    "degats" TEXT,
    "defense" TEXT,
    "effet" TEXT,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "inventaire_personnages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personnageId" TEXT NOT NULL,
    "objetId" TEXT NOT NULL,
    "emplacement" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL DEFAULT 1,
    "prixPaye" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "inventaire_personnages_personnageId_fkey" FOREIGN KEY ("personnageId") REFERENCES "personnages" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "inventaire_personnages_objetId_fkey" FOREIGN KEY ("objetId") REFERENCES "objets_ref" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "compagnons_ref" (
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
    "attaques" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "compagnon_classes_liees" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "compagnonId" TEXT NOT NULL,
    "classeId" TEXT NOT NULL,
    CONSTRAINT "compagnon_classes_liees_compagnonId_fkey" FOREIGN KEY ("compagnonId") REFERENCES "compagnons_ref" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "compagnon_classes_liees_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "classes_ref" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "compagnon_equipes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "equipeId" TEXT NOT NULL,
    "compagnonId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "compagnon_equipes_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "equipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "compagnon_equipes_compagnonId_fkey" FOREIGN KEY ("compagnonId") REFERENCES "compagnons_ref" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "personnages_equipeId_pseudo_key" ON "personnages"("equipeId", "pseudo");

-- CreateIndex
CREATE UNIQUE INDEX "classes_autorisees_par_race_raceId_classeId_key" ON "classes_autorisees_par_race"("raceId", "classeId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_armes_autorisees_classeId_categorie_key" ON "categories_armes_autorisees"("classeId", "categorie");

-- CreateIndex
CREATE UNIQUE INDEX "specialisations_ref_classeId_ecole_nom_key" ON "specialisations_ref"("classeId", "ecole", "nom");

-- CreateIndex
CREATE UNIQUE INDEX "inventaire_personnages_personnageId_emplacement_key" ON "inventaire_personnages"("personnageId", "emplacement");

-- CreateIndex
CREATE UNIQUE INDEX "compagnon_classes_liees_compagnonId_classeId_key" ON "compagnon_classes_liees"("compagnonId", "classeId");

-- CreateIndex
CREATE UNIQUE INDEX "compagnon_equipes_equipeId_key" ON "compagnon_equipes"("equipeId");
