-- DropIndex
DROP INDEX "FavoriteProject_employeeId_key";

-- DropIndex
DROP INDEX "FavoriteProject_projectId_key";

-- AlterTable
ALTER TABLE "FavoriteProject"
    ADD CONSTRAINT "FavoriteProject_pkey" PRIMARY KEY ("employeeId", "projectId");

-- AlterTable
ALTER TABLE "Record"
    ADD CONSTRAINT "Record_pkey" PRIMARY KEY ("date", "employeeId", "projectId");
