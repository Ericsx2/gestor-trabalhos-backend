/*
  Warnings:

  - You are about to drop the column `teatcherId` on the `projects` table. All the data in the column will be lost.
  - Added the required column `teacherId` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_teatcherId_fkey";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "teatcherId",
ADD COLUMN     "teacherId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
