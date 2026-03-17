import { Injectable } from '@nestjs/common';
import { ExpenseSplitAllocationPort } from 'src/core/port/expense-split-allocation.port';

@Injectable()
export class ListExpenseSplitAllocationsByTransactionIdUseCase {
  constructor(
    private readonly expenseSplitAllocationPort: ExpenseSplitAllocationPort,
  ) {}

  async execute(transactionId: string) {
    return this.expenseSplitAllocationPort.listByTransactionId(transactionId);
  }
}

