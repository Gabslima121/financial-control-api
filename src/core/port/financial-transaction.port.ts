import { FinancialTransactionDomain } from '../domain/financial-transaction/financial-transaction.domain';

export interface FinancialTransactionPort {
  create(transaction: FinancialTransactionDomain): Promise<void>;
  findById(id: string): Promise<FinancialTransactionDomain | null>;
  listByAccountId(accountId: string): Promise<FinancialTransactionDomain[]>;
  update(transaction: FinancialTransactionDomain): Promise<void>;
  delete(id: string): Promise<void>;
  findMatchingTransaction(
    accountId: string,
    amount: number,
    dateRange: { start: Date; end: Date },
  ): Promise<FinancialTransactionDomain | null>;
  getPendingTransactionsByAccountId(
    accountId: string,
  ): Promise<FinancialTransactionDomain[]>;
  syncRecurringTransactions(accountId: string, until: Date): Promise<void>;
}
