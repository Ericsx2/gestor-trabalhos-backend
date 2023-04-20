-- CreateTable
CREATE TABLE "coordenation" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(9) NOT NULL,
    "ddd" VARCHAR(2) NOT NULL,
    "password" TEXT NOT NULL,
    "registration" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "role" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "coordenation_pkey" PRIMARY KEY ("id")
);
