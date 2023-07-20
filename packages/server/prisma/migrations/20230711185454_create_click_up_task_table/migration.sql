-- CreateTable
CREATE TABLE "ClickUpTask" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,

    CONSTRAINT "ClickUpTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClickUpTask_invoiceId_key" ON "ClickUpTask"("invoiceId");

-- AddForeignKey
ALTER TABLE "ClickUpTask" ADD CONSTRAINT "ClickUpTask_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("invoiceId") ON DELETE RESTRICT ON UPDATE CASCADE;
