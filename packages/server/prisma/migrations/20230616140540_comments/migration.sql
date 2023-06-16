/*
  Warnings:

  - A unique constraint covering the columns `[invoiceId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - The required column `invoiceId` was added to the `Invoice` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "invoiceId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Comment" (
    "commentId" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifyDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("commentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceId_key" ON "Invoice"("invoiceId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("invoiceId") ON DELETE RESTRICT ON UPDATE CASCADE;
