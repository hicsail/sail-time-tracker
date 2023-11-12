/*
  Warnings:

  - The primary key for the `InvoiceItem` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "InvoiceItem" DROP CONSTRAINT "InvoiceItem_pkey",
ADD CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("invoiceId", "employeeId");
