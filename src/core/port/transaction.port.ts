import { TransactionsDomain } from "../domain/transactions/transactions.domain";

export interface TransactionPort {
  createTransaction(transaction: TransactionsDomain, userId: string): Promise<TransactionsDomain>;
}