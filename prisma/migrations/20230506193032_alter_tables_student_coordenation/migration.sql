/*
  Warnings:

  - You are about to drop the column `email` on the `coordenation` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `coordenation` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `students` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `coordenation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "coordenation" DROP COLUMN "email",
DROP COLUMN "password",
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "role",
ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "coordenation_userId_key" ON "coordenation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coordenation" ADD CONSTRAINT "coordenation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
