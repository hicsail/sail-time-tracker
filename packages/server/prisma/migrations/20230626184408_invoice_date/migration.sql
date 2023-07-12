/*
  Warnings:

  - The primary key for the `Invoice` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "createDate" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_pkey",
ALTER COLUMN "startDate" SET DATA TYPE DATE,
ALTER COLUMN "endDate" SET DATA TYPE DATE,
ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY ("projectId", "startDate", "endDate");
