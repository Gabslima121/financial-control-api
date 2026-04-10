import { Injectable } from '@nestjs/common';
import { AccountPort } from 'src/core/port/account.port';
import {
  FinancialTransactionPort,
  TransactionFilters,
} from 'src/core/port/financial-transaction.port';
import { PaginationParams } from 'src/shared/dto/pagination.dto';
import { NotFoundException } from 'src/shared/errors/custom.exception';

@Injectable()
export class ListFinancialTransactionsUseCase {
  constructor(
    private readonly financialTransactionPort: FinancialTransactionPort,
    private readonly accountPort: AccountPort,
  ) {}

  async execute(
    accountId: string,
    filters?: TransactionFilters,
    pagination?: PaginationParams,
  ) {
    const account = await this.accountPort.findById(accountId);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const transactions = await this.financialTransactionPort.listByAccountId(
      accountId,
      filters,
      pagination,
    );

    const mappedTransactions = transactions.data.map((transaction) => ({
      id: transaction.getId(),
      type: transaction.getType(),
      amount: transaction.getAmount(),
      description: transaction.getDescription(),
      method: transaction.getPaymentMethod(),
      status: transaction.getStatus(),
      createdAt: transaction.getCreatedAt(),
      dueDate: transaction.getDueDate(),
      paidAt: transaction.getPaidAt(),
      installments: transaction.getInstallments(),
    }));

    return mappedTransactions;
  }
}
