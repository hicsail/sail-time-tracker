-- CreateTable
CREATE TABLE "BillableHours" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "precalculatedHours" DOUBLE PRECISION NOT NULL,
    "billableHours" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BillableHours_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BillableHours" ADD CONSTRAINT "BillableHours_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillableHours" ADD CONSTRAINT "BillableHours_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
