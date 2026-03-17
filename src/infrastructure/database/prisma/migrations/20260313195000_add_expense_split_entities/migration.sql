-- CreateEnum
CREATE TYPE "ExpenseSplitType" AS ENUM ('proportional_income', 'fixed_percent', 'fixed_amount');

-- AlterTable
ALTER TABLE "FinancialTransaction" ADD COLUMN "splitRuleId" UUID;

-- CreateTable
CREATE TABLE "ExpenseSplitRule" (
    "id" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "ExpenseSplitType" NOT NULL,
    "recurrenceGroupId" UUID,
    "transactionId" UUID,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpenseSplitRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseSplitParticipant" (
    "id" UUID NOT NULL,
    "ruleId" UUID NOT NULL,
    "personId" UUID NOT NULL,
    "fixedPercent" DECIMAL(7,6),
    "fixedAmount" DECIMAL(15,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExpenseSplitParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseSplitAllocation" (
    "id" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "personId" UUID NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExpenseSplitAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExpenseSplitRule_accountId_idx" ON "ExpenseSplitRule"("accountId");

-- CreateIndex
CREATE INDEX "ExpenseSplitRule_recurrenceGroupId_idx" ON "ExpenseSplitRule"("recurrenceGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseSplitRule_transactionId_key" ON "ExpenseSplitRule"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseSplitParticipant_ruleId_personId_key" ON "ExpenseSplitParticipant"("ruleId", "personId");

-- CreateIndex
CREATE INDEX "ExpenseSplitParticipant_personId_idx" ON "ExpenseSplitParticipant"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseSplitAllocation_transactionId_personId_key" ON "ExpenseSplitAllocation"("transactionId", "personId");

-- CreateIndex
CREATE INDEX "ExpenseSplitAllocation_personId_idx" ON "ExpenseSplitAllocation"("personId");

-- AddForeignKey
ALTER TABLE "FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_splitRuleId_fkey" FOREIGN KEY ("splitRuleId") REFERENCES "ExpenseSplitRule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseSplitRule" ADD CONSTRAINT "ExpenseSplitRule_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseSplitParticipant" ADD CONSTRAINT "ExpenseSplitParticipant_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "ExpenseSplitRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseSplitParticipant" ADD CONSTRAINT "ExpenseSplitParticipant_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseSplitAllocation" ADD CONSTRAINT "ExpenseSplitAllocation_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "FinancialTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseSplitAllocation" ADD CONSTRAINT "ExpenseSplitAllocation_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
