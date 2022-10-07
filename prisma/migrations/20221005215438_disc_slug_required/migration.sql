/*
  Warnings:

  - Made the column `slug` on table `Disc` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Disc" ALTER COLUMN "slug" SET NOT NULL;
