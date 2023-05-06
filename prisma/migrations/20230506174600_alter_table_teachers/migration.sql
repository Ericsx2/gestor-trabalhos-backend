/*
  Warnings:

  - You are about to drop the column `email` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `teachers` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `teachers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "role";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE TEXT;
