import { TransactionDomain } from "../domain/transaction/transaction.domain";

export interface TransactionsPort {
    createTransaction(transaction: TransactionDomain, userId: string): Promise<void>;
}
