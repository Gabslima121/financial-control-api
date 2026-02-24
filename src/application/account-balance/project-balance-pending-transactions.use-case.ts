import { AccountBalancePort } from "src/core/port/account-balance.port";
import { GetTransactionsWithParamsUseCase } from "../transactions/get-transactions-with-params.use-case";
import { TransactionStatus } from "@prisma/client";

export class ProjectBalancePendingTransactionsUseCase {
    constructor(
        private readonly accountBalancePort: AccountBalancePort,
        private readonly getTransactionsWithParamsUseCase: GetTransactionsWithParamsUseCase,
    ) {}

    async execute(userId: string) {
        const latestAccountBalance = await this.accountBalancePort.getLatestAccountBalance(userId);

        const pendingTransactions = await this.getTransactionsWithParamsUseCase.execute(userId, {
            transactionStatus: TransactionStatus.pending,
        });

        return;
    }
}
