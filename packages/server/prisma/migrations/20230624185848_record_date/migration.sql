/*
  Warnings:

  - The primary key for the `Record` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Record" DROP CONSTRAINT "Record_pkey",
ALTER COLUMN "date" DROP DEFAULT,
ALTER COLUMN "date" SET DATA TYPE DATE,
ADD CONSTRAINT "Record_pkey" PRIMARY KEY ("date", "employeeId", "projectId");
