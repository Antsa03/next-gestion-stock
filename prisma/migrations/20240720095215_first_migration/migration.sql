-- CreateTable
CREATE TABLE "Produit" (
    "id_produit" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "designation" TEXT NOT NULL,
    "pu" REAL NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Entree" (
    "id_entree" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_produit" INTEGER NOT NULL,
    "id_bon_entree" INTEGER NOT NULL,
    "qte_entree" INTEGER NOT NULL,
    "id_lot" INTEGER NOT NULL,
    CONSTRAINT "Entree_id_lot_fkey" FOREIGN KEY ("id_lot") REFERENCES "Lot" ("id_lot") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Entree_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "Produit" ("id_produit") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Entree_id_bon_entree_fkey" FOREIGN KEY ("id_bon_entree") REFERENCES "BonEntree" ("id_bon_entree") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BonEntree" (
    "id_bon_entree" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date_entree" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Sortie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_produit" INTEGER NOT NULL,
    "id_bon_sortie" INTEGER NOT NULL,
    "quantite_sortie" INTEGER NOT NULL,
    "id_lot" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "Sortie_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "Produit" ("id_produit") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Sortie_id_bon_sortie_fkey" FOREIGN KEY ("id_bon_sortie") REFERENCES "BonSortie" ("id_bon_sortie") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Sortie_id_lot_fkey" FOREIGN KEY ("id_lot") REFERENCES "Lot" ("id_lot") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BonSortie" (
    "id_bon_sortie" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date_sortie" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Lot" (
    "id_lot" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero_lot" TEXT NOT NULL,
    "id_produit" INTEGER NOT NULL,
    "date_production" DATETIME NOT NULL,
    "date_peremption" DATETIME NOT NULL,
    "quantite_lot" INTEGER NOT NULL,
    CONSTRAINT "Lot_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "Produit" ("id_produit") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Lot_numero_lot_key" ON "Lot"("numero_lot");
