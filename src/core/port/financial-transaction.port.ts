import { FinancialTransactionDomain } from '../domain/financial-transaction/financial-transaction.domain';
import {
  TransactionStatus,
  TransactionType,
} from '../domain/financial-transaction/dto';
import {
  PaginatedResult,
  PaginationParams,
} from 'src/shared/dto/pagination.dto';

export interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface FinancialTransactionPort {
  create(transaction: FinancialTransactionDomain): Promise<void>;
  findById(id: string): Promise<FinancialTransactionDomain | null>;
  listByAccountId(
    accountId: string,
    filters?: TransactionFilters,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<FinancialTransactionDomain>>;
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
