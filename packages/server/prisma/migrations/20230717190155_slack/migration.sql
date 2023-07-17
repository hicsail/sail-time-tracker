-- CreateTable
CREATE TABLE "Slack" (
    "slackId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "Slack_pkey" PRIMARY KEY ("slackId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Slack_employeeId_key" ON "Slack"("employeeId");

-- AddForeignKey
ALTER TABLE "Slack" ADD CONSTRAINT "Slack_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
