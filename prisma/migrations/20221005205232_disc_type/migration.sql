-- CreateEnum
CREATE TYPE "DiscType" AS ENUM ('PUTTER', 'MIDRAGE', 'FAIRWAY', 'DISTANCE');

-- AlterTable
ALTER TABLE "Disc" ADD COLUMN     "type" "DiscType";
