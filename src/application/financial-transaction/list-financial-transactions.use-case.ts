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

    return this.financialTransactionPort.listByAccountId(
      accountId,
      filters,
      pagination,
    );
  }
}
