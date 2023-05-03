/*
  Warnings:

  - You are about to alter the column `code` on the `subjects` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE "subjects" ALTER COLUMN "code" SET DATA TYPE VARCHAR(10);
