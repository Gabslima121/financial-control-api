import { Injectable } from '@nestjs/common';
import {
  PaymentMethod,
  RecurrenceFrequency,
  TransactionStatus,
} from 'src/core/domain/financial-transaction/dto';
import { AccountPort } from 'src/core/port/account.port';
import { FinancialTransactionPort } from 'src/core/port/financial-transaction.port';
import { FinancialTransactionAdapter } from 'src/infrastructure/adapters/financial-transaction/in/financial-transaction.adapter';
import { CreateFinancialTransactionDTO } from 'src/infrastructure/nestjs/financial-transaction/dto/create-financial-transaction.dto';
import { NotFoundException } from 'src/shared/errors/custom.exception';
import { UuidValueObject } from 'src/shared/value-object/uuid-value-object.vo';

@Injectable()
export class CreateFinancialTransactionUseCase {
  constructor(
    private readonly financialTransactionPort: FinancialTransactionPort,
    private readonly accountPort: AccountPort,
  ) {}

  async execute(params: CreateFinancialTransactionDTO, accountId: string) {
    const account = await this.accountPort.findById(accountId);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const paymentMethod = params.paymentMethod as PaymentMethod;

    if (params.isRecurring === true) {
      if (!params.dueDate) {
        throw new Error('dueDate é obrigatório para criar recorrência');
      }

      const recurrenceFrequency =
        params.recurrenceFrequency ?? RecurrenceFrequency.MONTHLY;
      if (recurrenceFrequency !== RecurrenceFrequency.MONTHLY) {
        throw new Error('Apenas recorrência mensal está suportada no momento');
      }

      const recurrenceInterval = params.recurrenceInterval ?? 1;
      const recurrenceDayOfMonth =
        params.recurrenceDayOfMonth ?? params.dueDate.getDate();
      const monthsToGenerate = params.recurrenceGenerateMonths ?? 12;
      const recurrenceGroupId = new UuidValueObject().getValue();

      for (
        let monthOffset = 0;
        monthOffset < monthsToGenerate;
        monthOffset += 1
      ) {
        const dueDate = this.buildMonthlyDueDate(
          params.dueDate,
          monthOffset * recurrenceInterval,
          recurrenceDayOfMonth,
        );

        const financialTransactionDomain = FinancialTransactionAdapter.toDomain(
          {
            amount: Math.abs(params.amount),
            type: params.type,
            status: TransactionStatus.PENDING,
            description: params.description,
            paymentMethod,
            installments: 1,
            installment: 1,
            dueDate,
            paidAt: null,
            account,
            bankStatement: null,
            recurrenceGroupId,
            recurrenceFrequency,
            recurrenceInterval,
            recurrenceDayOfMonth,
          },
        );

        await this.financialTransactionPort.create(financialTransactionDomain);
      }

      return;
    }

    const financialTransactionDomain = FinancialTransactionAdapter.toDomain({
      amount: Math.abs(params.amount),
      type: params.type,
      status: params.status,
      description: params.description,
      paymentMethod,
      installments: 1,
      installment: 1,
      dueDate: params.dueDate,
      paidAt: params.paidAt,
      account,
    });

    await this.financialTransactionPort.create(financialTransactionDomain);
  }

  private buildMonthlyDueDate(
    baseDueDate: Date,
    monthOffset: number,
    dayOfMonth: number,
  ): Date {
    const year = baseDueDate.getFullYear();
    const month = baseDueDate.getMonth() + monthOffset;

    const monthStart = new Date(
      year,
      month,
      1,
      baseDueDate.getHours(),
      baseDueDate.getMinutes(),
      baseDueDate.getSeconds(),
      baseDueDate.getMilliseconds(),
    );
    const lastDay = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth() + 1,
      0,
    ).getDate();
    const day = Math.min(Math.max(dayOfMonth, 1), lastDay);

    return new Date(
      monthStart.getFullYear(),
      monthStart.getMonth(),
      day,
      monthStart.getHours(),
      monthStart.getMinutes(),
      monthStart.getSeconds(),
      monthStart.getMilliseconds(),
    );
  }
}
