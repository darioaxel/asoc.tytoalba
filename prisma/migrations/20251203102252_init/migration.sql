/*
  Warnings:

  - You are about to drop the column `emailCenter` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_emailCenter_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailCenter";
