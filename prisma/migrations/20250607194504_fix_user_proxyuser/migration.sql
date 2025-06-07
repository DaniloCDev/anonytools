/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ProxyUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProxyUser_userId_key" ON "ProxyUser"("userId");
