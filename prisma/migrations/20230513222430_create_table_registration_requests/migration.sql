-- CreateTable
CREATE TABLE "registration_requests" (
    "id" TEXT NOT NULL,
    "registration" VARCHAR(10) NOT NULL,
    "was_created" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registration_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "registration_requests_registration_key" ON "registration_requests"("registration");
