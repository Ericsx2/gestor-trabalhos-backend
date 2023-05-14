/*
  Warnings:

  - You are about to drop the `UsersOnProjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `registration_requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersOnProjects" DROP CONSTRAINT "UsersOnProjects_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnProjects" DROP CONSTRAINT "UsersOnProjects_userId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_subjectId_fkey";

-- DropTable
DROP TABLE "UsersOnProjects";

-- DropTable
DROP TABLE "projects";

-- DropTable
DROP TABLE "registration_requests";
