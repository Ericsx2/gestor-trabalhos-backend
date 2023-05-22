-- CreateTable
CREATE TABLE "project_files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "project_files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "project_files" ADD CONSTRAINT "project_files_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
