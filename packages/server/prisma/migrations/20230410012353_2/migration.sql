/*
  Warnings:

  - Made the column `hours` on table `Record` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Record_employeeId_key";

-- DropIndex
DROP INDEX "Record_projectId_key";

-- AlterTable
ALTER TABLE "Record" ALTER COLUMN "hours" SET NOT NULL,
ALTER COLUMN "hours" SET DEFAULT 0;
