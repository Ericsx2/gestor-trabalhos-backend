/*
  Warnings:

  - You are about to drop the column `teacherId` on the `projects` table. All the data in the column will be lost.
  - Added the required column `teatcherId` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_teacherId_fkey";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "teacherId",
ADD COLUMN     "teatcherId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_teatcherId_fkey" FOREIGN KEY ("teatcherId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
