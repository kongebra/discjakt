/*
  Warnings:

  - Made the column `type` on table `Disc` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Disc" ALTER COLUMN "type" SET NOT NULL;
