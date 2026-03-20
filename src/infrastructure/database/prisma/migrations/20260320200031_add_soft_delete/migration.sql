-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "FinancialTransaction" ADD COLUMN     "deletedAt" TIMESTAMP(3);
