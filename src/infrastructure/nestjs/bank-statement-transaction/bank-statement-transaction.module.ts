import { Module } from "@nestjs/common";
import { BankStatementTransactionController } from "./bank-statement-transaction.controller";
import { BankStatementTransactionRepository } from "src/infrastructure/adapters/bank-statement-transaction/out/bank-statement-transaction.impl";
import { CreateBankStatementTransactionUseCase } from "src/application/bank-statement-transaction/create-bank-statement-transaction.use-case";
import { PrismaProvider } from "../utils/providers/prisma.provider";
import { AccountModule } from "../account/account.module";
import { AccountRepository } from "src/infrastructure/adapters/account/out/account.impl";

@Module({
    imports: [AccountModule],
    providers: [
        PrismaProvider,
        {
            provide: 'BankStatementTransactionPort',
            useClass: BankStatementTransactionRepository,
        },
        {
            provide: CreateBankStatementTransactionUseCase,
            useFactory: (bankStatementTransactionRepository: BankStatementTransactionRepository, accountRepository: AccountRepository) => {
                return new CreateBankStatementTransactionUseCase(bankStatementTransactionRepository, accountRepository);
            },
            inject: ['BankStatementTransactionPort', 'AccountPort'],
        }
    ],
    controllers: [BankStatementTransactionController],
})
export class BankStatementTransactionModule {}
