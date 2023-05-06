-- CreateTable
CREATE TABLE "permission" (
    "id" TEXT NOT NULL,
    "role" INTEGER NOT NULL,
    "type" VARCHAR(50) NOT NULL,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permission_type_key" ON "permission"("type");
