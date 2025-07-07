/*
  Warnings:

  - You are about to drop the column `planId` on the `Purchase` table. All the data in the column will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_planId_fkey";

-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "planId";

-- DropTable
DROP TABLE "Plan";
