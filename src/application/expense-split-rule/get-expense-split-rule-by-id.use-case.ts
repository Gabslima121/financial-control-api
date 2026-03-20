import { Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseSplitRulePort } from 'src/core/port/expense-split-rule.port';

@Injectable()
export class GetExpenseSplitRuleByIdUseCase {
  constructor(private readonly expenseSplitRulePort: ExpenseSplitRulePort) {}

  async execute(id: string) {
    const rule = await this.expenseSplitRulePort.findById(id);
    if (!rule) {
      throw new NotFoundException('Regra de rateio não encontrada.');
    }

    return rule;
  }
}
