import { FinancialTransactionPort } from "src/core/port/financial-transaction.port";
import { GetCurrentBalanceUseCase } from "./get-current-balance.use-case";

export class ProjectBalanceWithPendingTransactionsUseCase {
    constructor(
        private readonly getCurrentBalanceUseCase: GetCurrentBalanceUseCase,
        private readonly financialTransactionPort: FinancialTransactionPort,
    ) {}

    async execute(accountId: string) {
        const currentBalance = await this.getCurrentBalanceUseCase.execute(accountId);

        const pendingTransactions = await this.financialTransactionPort.getPendingTransactionsByAccountId(accountId);

        const pendingTransactionsSum = pendingTransactions.reduce((acc, transaction) => acc + transaction.getAmount(), 0);

        const projectedBalance = currentBalance - pendingTransactionsSum;

        return Math.round(projectedBalance * 100) / 100;
    }
}