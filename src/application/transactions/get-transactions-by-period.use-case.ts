import { TransactionsPort } from "src/core/port/transactions.port";

export class GetTransactionsByPeriodUseCase {
    constructor(private readonly transactionsPort: TransactionsPort) {}

    async execute(userId: string, startDate: string, endDate: string) {
        const transactions = await this.transactionsPort.getTransactionsByPeriod(userId, startDate, endDate);

        if (!transactions || !Array.isArray(transactions)) {
            return [];
        }

        return transactions;
    }
}