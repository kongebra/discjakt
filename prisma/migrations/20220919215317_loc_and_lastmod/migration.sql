/*
  Warnings:

  - You are about to drop the column `url` on the `Product` table. All the data in the column will be lost.
  - Added the required column `lastmod` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loc` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "loc" TEXT NOT NULL,
    "lastmod" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "storeId" INTEGER NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" DATETIME NOT NULL,
    CONSTRAINT "Product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("created", "description", "id", "imageUrl", "storeId", "title", "updated") SELECT "created", "description", "id", "imageUrl", "storeId", "title", "updated" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_loc_key" ON "Product"("loc");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
