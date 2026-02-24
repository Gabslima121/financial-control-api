import { TransactionDomain } from "../domain/transaction/transaction.domain";

export interface TransactionParams {
    transactionStatus?: any;
    transactionDate?: any;
    dueDate?: any;
}

export interface TransactionsPort {
    createTransaction(transaction: TransactionDomain, userId: string): Promise<void>;
    getTransactionsByPeriod(userId: string, startDate: string, endDate: string): Promise<TransactionDomain[]>;
    getTransactionsWithParams(userId: string, params: TransactionParams): Promise<TransactionDomain[]>;
}
