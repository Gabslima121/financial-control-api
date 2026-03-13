-- CreateEnum
CREATE TYPE "RecurrenceFrequency" AS ENUM ('monthly');

-- AlterTable
ALTER TABLE "FinancialTransaction"
ADD COLUMN     "recurrenceGroupId" UUID,
ADD COLUMN     "recurrenceFrequency" "RecurrenceFrequency",
ADD COLUMN     "recurrenceInterval" INTEGER,
ADD COLUMN     "recurrenceDayOfMonth" INTEGER;

-- CreateIndex
CREATE INDEX "FinancialTransaction_recurrenceGroupId_idx" ON "FinancialTransaction"("recurrenceGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialTransaction_recurrenceGroupId_dueDate_key" ON "FinancialTransaction"("recurrenceGroupId", "dueDate");
