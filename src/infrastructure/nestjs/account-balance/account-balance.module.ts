import { Module } from "@nestjs/common";
import { PrismaProvider } from "../utils/providers/prisma.provider";
import { AccountBalanceRepository } from "src/infrastructure/adapters/account-balance/out/account-balance.impl";
import { CreateAccountBalanceUseCase } from "src/application/account-balance/create-account-balance.use-case";
import { AccountBalancePort } from "src/core/port/account-balance.port";
import { AccountBalanceController } from "./account-balance.controller";
import { SumPeriodAccountBalanceUseCase } from "src/application/account-balance/sum-period-account-balance.use-case";
import { GetTransactionsByPeriodUseCase } from "src/application/transactions/get-transactions-by-period.use-case";
import { TransactionModule } from "../transactions/transaction.module";
import { UserModule } from "../user/user.module";
import { UserPort } from "src/core/port/user.port";
import { ProjectBalancePendingTransactionsUseCase } from "src/application/account-balance/project-balance-pending-transactions.use-case";
import { GetTransactionsWithParamsUseCase } from "src/application/transactions/get-transactions-with-params.use-case";

@Module({
    imports: [TransactionModule, UserModule],
    providers: [
        PrismaProvider,
        {
            provide: 'AccountBalancePort',
            useClass: AccountBalanceRepository,
        },
        {
            provide: CreateAccountBalanceUseCase,
            useFactory: (accountBalancePort: AccountBalancePort, userPort: UserPort) => new CreateAccountBalanceUseCase(accountBalancePort, userPort),
            inject: ['AccountBalancePort', 'UserPort'],
        },
        {
            provide: SumPeriodAccountBalanceUseCase,
            useFactory: (
                getTransactionsByPeriodUseCase: GetTransactionsByPeriodUseCase,
                createAccountBalanceUseCase: CreateAccountBalanceUseCase
            ) => new SumPeriodAccountBalanceUseCase(
                getTransactionsByPeriodUseCase,
                createAccountBalanceUseCase
            ),
            inject: [
                GetTransactionsByPeriodUseCase,
                CreateAccountBalanceUseCase
            ],
        },
        {
            provide: ProjectBalancePendingTransactionsUseCase,
            useFactory: (
                accountBalancePort: AccountBalancePort,
                getTransactionsWithParamsUseCase: GetTransactionsWithParamsUseCase
            ) => new ProjectBalancePendingTransactionsUseCase(
                accountBalancePort,
                getTransactionsWithParamsUseCase
            ),
            inject: [
                'AccountBalancePort',
                GetTransactionsWithParamsUseCase
            ],
        }
    ],
    controllers: [AccountBalanceController],
})
export class AccountBalanceModule {}