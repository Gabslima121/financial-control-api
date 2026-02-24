import { TransactionParams, TransactionsPort } from "src/core/port/transactions.port";

export class GetTransactionsWithParamsUseCase {
    constructor(private readonly transactionsPort: TransactionsPort) {}

    async execute(userId: string, params: TransactionParams) {
        const transactions = await this.transactionsPort.getTransactionsWithParams(userId, params);

        if (!transactions || !Array.isArray(transactions)) {
            return [];
        }

        return transactions;
    }
}