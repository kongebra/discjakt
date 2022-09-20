/*
  Warnings:

  - The primary key for the `ProductPrice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `int` on the `ProductPrice` table. All the data in the column will be lost.
  - Added the required column `id` to the `ProductPrice` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductPrice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "ProductPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductPrice" ("amount", "created", "currency", "productId") SELECT "amount", "created", "currency", "productId" FROM "ProductPrice";
DROP TABLE "ProductPrice";
ALTER TABLE "new_ProductPrice" RENAME TO "ProductPrice";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
