import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountPort } from 'src/core/port/account.port';
import { ExpenseSplitRulePort } from 'src/core/port/expense-split-rule.port';

@Injectable()
export class ListExpenseSplitRulesByAccountIdUseCase {
  constructor(
    private readonly expenseSplitRulePort: ExpenseSplitRulePort,
    private readonly accountPort: AccountPort,
  ) {}

  async execute(accountId: string) {
    const account = await this.accountPort.findById(accountId);
    if (!account) {
      throw new NotFoundException('Conta não encontrada.');
    }

    return this.expenseSplitRulePort.listByAccountId(accountId);
  }
}
