/*
  Warnings:

  - You are about to drop the column `deleted` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `projects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[matterId]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matterId` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "deleted",
DROP COLUMN "name",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "matterId" TEXT NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL,
ADD COLUMN     "title" VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE "matters" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_matterId_key" ON "projects"("matterId");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "matters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
