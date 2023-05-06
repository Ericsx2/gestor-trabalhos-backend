-- AlterTable
ALTER TABLE "coordenation" ALTER COLUMN "role" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "students" ALTER COLUMN "role" SET DEFAULT 2;

-- AlterTable
ALTER TABLE "teachers" ALTER COLUMN "role" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "role" INTEGER NOT NULL,
    "password" VARCHAR(50) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
