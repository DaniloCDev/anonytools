/*
  Warnings:

  - The `mpPaymentId` column on the `Purchase` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "mpPaymentId",
ADD COLUMN     "mpPaymentId" INTEGER;
