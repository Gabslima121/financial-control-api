import { Injectable } from '@nestjs/common';
import { ExpenseSplitAllocationPort } from 'src/core/port/expense-split-allocation.port';
import { ExpenseSplitAllocationAdapter } from 'src/infrastructure/adapters/expense-split-allocation/in/expense-split-allocation.adapter';

@Injectable()
export class CreateExpenseSplitAllocationsUseCase {
  constructor(
    private readonly expenseSplitAllocationPort: ExpenseSplitAllocationPort,
  ) {}

  async execute(params: {
    transactionId: string;
    allocations: Array<{ personId: string; amount: number }>;
  }) {
    const domains = params.allocations.map((a) =>
      ExpenseSplitAllocationAdapter.toDomain({
        transactionId: params.transactionId,
        personId: a.personId,
        amount: a.amount,
      }),
    );

    await this.expenseSplitAllocationPort.createMany(domains);
  }
}

