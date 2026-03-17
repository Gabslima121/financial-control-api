import { ExpenseSplitAllocationDomain } from '../domain/expense-split-allocation/expense-split-allocation.domain';

export interface ExpenseSplitAllocationPort {
  createMany(allocations: ExpenseSplitAllocationDomain[]): Promise<void>;
  listByTransactionId(
    transactionId: string,
  ): Promise<ExpenseSplitAllocationDomain[]>;
}
