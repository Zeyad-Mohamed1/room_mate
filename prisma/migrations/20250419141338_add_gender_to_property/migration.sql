/*
  Warnings:

  - You are about to drop the column `houseId` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "houseId",
ADD COLUMN     "country" TEXT,
ADD COLUMN     "genderRequired" TEXT;
