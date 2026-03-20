import { Injectable } from '@nestjs/common';
import { ExpenseSplitParticipantDomain } from 'src/core/domain/expense-split-participant/expense-split-participant.domain';
import { ExpenseSplitType } from 'src/core/domain/expense-split-rule/dto';
import { ExpenseSplitRulePort } from 'src/core/port/expense-split-rule.port';
import { FinancialTransactionPort } from 'src/core/port/financial-transaction.port';
import { NotFoundException } from 'src/shared/errors/custom.exception';
import { GetPersonIncomeByPersonIdUseCase } from '../person-income/get-person-income-by-person-id.use-case';

export interface SplitEntry {
  personId: string;
  personName: string;
  amount: number;
  percentage: number;
}

export interface SplitCalculationResult {
  transactionId: string;
  transactionDescription: string | null;
  totalAmount: number;
  ruleName: string;
  ruleType: ExpenseSplitType;
  splits: SplitEntry[];
}

@Injectable()
export class CalculateSplitPaymentUseCase {
  constructor(
    private readonly financialTransactionPort: FinancialTransactionPort,
    private readonly expenseSplitRulePort: ExpenseSplitRulePort,
    private readonly getPersonIncomeByPersonId: GetPersonIncomeByPersonIdUseCase,
  ) {}

  async execute(
    splitRuleId: string,
    financialTransactionId: string,
  ): Promise<SplitCalculationResult> {
    const [transaction, rule] = await Promise.all([
      this.financialTransactionPort.findById(financialTransactionId),
      this.expenseSplitRulePort.findById(splitRuleId),
    ]);

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada.');
    }

    if (!rule) {
      throw new NotFoundException('Regra de divisão não encontrada.');
    }

    const totalAmount = transaction.getAmount();
    const participants = rule.getParticipants();
    const ruleType = rule.getType();

    const splits = await this.calculateSplits(
      ruleType,
      participants,
      totalAmount,
    );

    return {
      transactionId: financialTransactionId,
      transactionDescription: transaction.getDescription(),
      totalAmount,
      ruleName: rule.getName(),
      ruleType,
      splits,
    };
  }

  private async calculateSplits(
    ruleType: ExpenseSplitType,
    participants: ExpenseSplitParticipantDomain[],
    totalAmount: number,
  ): Promise<SplitEntry[]> {
    if (ruleType === ExpenseSplitType.PROPORTIONAL_INCOME) {
      return this.calculateProportionalIncome(participants, totalAmount);
    }

    if (ruleType === ExpenseSplitType.FIXED_PERCENT) {
      return this.calculateFixedPercent(participants, totalAmount);
    }

    return this.calculateFixedAmount(participants, totalAmount);
  }

  private async calculateProportionalIncome(
    participants: ExpenseSplitParticipantDomain[],
    totalAmount: number,
  ): Promise<SplitEntry[]> {
    const participantsWithIncome = await Promise.all(
      participants.map(async (p) => {
        const income = await this.getPersonIncomeByPersonId.execute(
          p.getPersonId(),
        );
        return { participant: p, incomeAmount: income.getAmount() };
      }),
    );

    const totalIncome = participantsWithIncome.reduce(
      (sum, { incomeAmount }) => sum + incomeAmount,
      0,
    );

    return participantsWithIncome.map(({ participant, incomeAmount }) => {
      const percentage = incomeAmount / totalIncome;
      const amount = Math.round(totalAmount * percentage * 100) / 100;

      return {
        personId: participant.getPersonId(),
        personName:
          participant.getPerson()?.getName() ?? participant.getPersonId(),
        amount,
        percentage,
      };
    });
  }

  private calculateFixedPercent(
    participants: ExpenseSplitParticipantDomain[],
    totalAmount: number,
  ): SplitEntry[] {
    return participants.map((p) => {
      const percentage = p.getFixedPercent()!;
      const amount = Math.round(totalAmount * percentage * 100) / 100;

      return {
        personId: p.getPersonId(),
        personName: p.getPerson()?.getName() ?? p.getPersonId(),
        amount,
        percentage,
      };
    });
  }

  private calculateFixedAmount(
    participants: ExpenseSplitParticipantDomain[],
    totalAmount: number,
  ): SplitEntry[] {
    return participants.map((p) => {
      const amount = p.getFixedAmount()!;

      return {
        personId: p.getPersonId(),
        personName: p.getPerson()?.getName() ?? p.getPersonId(),
        amount,
        percentage: amount / totalAmount,
      };
    });
  }
}
