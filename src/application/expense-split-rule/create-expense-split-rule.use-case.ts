import { Injectable } from '@nestjs/common';
import { NotFoundException } from 'src/shared/errors/custom.exception';
import { ExpenseSplitType } from 'src/core/domain/expense-split-rule/dto';
import { AccountPort } from 'src/core/port/account.port';
import { ExpenseSplitRulePort } from 'src/core/port/expense-split-rule.port';
import { PersonPort } from 'src/core/port/person.port';
import { ExpenseSplitRuleAdapter } from 'src/infrastructure/adapters/expense-split-rule/in/expense-split-rule.adapter';
import { CreateExpenseSplitRuleDTO } from 'src/infrastructure/nestjs/expense-split-rule/dto/create-expense-split-rule.dto';

@Injectable()
export class CreateExpenseSplitRuleUseCase {
  constructor(
    private readonly expenseSplitRulePort: ExpenseSplitRulePort,
    private readonly accountPort: AccountPort,
    private readonly personPort: PersonPort,
  ) {}

  async execute(dto: CreateExpenseSplitRuleDTO, accountId: string) {
    const account = await this.accountPort.findById(accountId);

    if (!account) {
      throw new NotFoundException('Conta não encontrada.');
    }

    const participants = await Promise.all(
      dto.participants.map(async (p) => {
        const person = await this.personPort.findPersonById(p.personId);

        return {
          person,
          fixedPercent: p.fixedPercent ?? null,
          fixedAmount: p.fixedAmount ?? null,
        };
      }),
    );

    this.validateRule(dto.type, participants);

    const domain = ExpenseSplitRuleAdapter.toDomain({
      accountId,
      name: dto.name,
      type: dto.type,
      recurrenceGroupId: dto.recurrenceGroupId ?? null,
      transactionId: dto.transactionId ?? null,
      isActive: dto.isActive ?? true,
      participants,
    });

    await this.expenseSplitRulePort.create(domain);
  }

  private validateRule(
    type: ExpenseSplitType,
    participants: Array<{
      fixedPercent: number | null;
      fixedAmount: number | null;
    }>,
  ) {
    if (participants.length < 2) {
      throw new Error('A regra precisa ter pelo menos 2 participantes');
    }

    if (type === ExpenseSplitType.FIXED_PERCENT) {
      const sum = participants.reduce(
        (acc, p) => acc + (p.fixedPercent ?? 0),
        0,
      );

      if (Math.abs(1 - sum) > 0.000001) {
        throw new Error('Somatório de fixedPercent deve ser 1.0');
      }
    }

    if (type === ExpenseSplitType.FIXED_AMOUNT) {
      const hasAny = participants.some((p) => p.fixedAmount !== null);
      if (!hasAny) {
        throw new Error(
          'fixedAmount é obrigatório para split do tipo fixed_amount',
        );
      }
    }
  }
}
