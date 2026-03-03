import { Module } from "@nestjs/common";
import { PrismaProvider } from "../utils/providers/prisma.provider";
import { FinancialTransactionRepository } from "src/infrastructure/adapters/financial-transaction/out/financial-transaction.impl";

@Module({
    providers: [
        PrismaProvider,
        {
            provide: 'FinancialTransactionPort',
            useClass: FinancialTransactionRepository,
        },
    ],
    exports: ['FinancialTransactionPort'],
})
export class FinancialTransactionModule {}
