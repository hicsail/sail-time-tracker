/*
  Warnings:

  - Made the column `invoiceId` on table `Invoice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "invoiceId" SET NOT NULL;
