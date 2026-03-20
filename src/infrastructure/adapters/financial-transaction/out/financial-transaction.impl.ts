import { Injectable } from '@nestjs/common';
import {
  PrismaClient,
  RecurrenceFrequency as PrismaRecurrenceFrequency,
  TransactionType as PrismaTransactionType,
  TransactionStatus as PrismaTransactionStatus,
  PaymentMethod as PrismaPaymentMethod,
  FinancialTransaction as PrismaFinancialTransaction,
  Account as PrismaAccount,
  BankStatementTransaction as PrismaBankStatement,
  User as PrismaUser,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { FinancialTransactionDomain } from 'src/core/domain/financial-transaction/financial-transaction.domain';
import {
  FinancialTransactionPort,
  TransactionFilters,
} from 'src/core/port/financial-transaction.port';
import { FinancialTransactionAdapter } from '../in/financial-transaction.adapter';
import {
  PaymentMethod,
  RecurrenceFrequency,
  TransactionStatus,
  TransactionType,
} from 'src/core/domain/financial-transaction/dto';
import { AccountDomainAdapter } from 'src/infrastructure/adapters/account/in/account.adapter';
import { BankStatementTransactionAdapter } from 'src/infrastructure/adapters/bank-statement-transaction/in/bank-statement-transaction.adapter';
import { UserDomainAdapter } from 'src/infrastructure/adapters/user/in/user.adapter';
import {
  PaginatedResult,
  PaginationParams,
} from 'src/shared/dto/pagination.dto';

type PrismaTransactionWithRelations = PrismaFinancialTransaction & {
  account: (PrismaAccount & { user: PrismaUser | null }) | null;
  bankStatement:
    | (PrismaBankStatement & {
        account: (PrismaAccount & { user: PrismaUser | null }) | null;
      })
    | null;
};

const TRANSACTION_INCLUDE = {
  account: { include: { user: true } },
  bankStatement: { include: { account: { include: { user: true } } } },
} as const;

@Injectable()
export class FinancialTransactionRepository
  implements FinancialTransactionPort
{
  constructor(private readonly prisma: PrismaClient) {}

  private mapToDomain(
    transaction: PrismaTransactionWithRelations,
  ): FinancialTransactionDomain {
    return FinancialTransactionAdapter.toDomain({
      id: transaction.id,
      account: transaction.account
        ? AccountDomainAdapter.toDomain({
            id: transaction.account.id,
            name: transaction.account.name,
            bankName: transaction.account.bankName,
            initialBalance: Number(transaction.account.initialBalance),
            createdAt: transaction.account.createdAt,
            user: transaction.account.user
              ? UserDomainAdapter.toDomain({
                  id: transaction.account.user.id,
                  name: transaction.account.user.name,
                  document: transaction.account.user.document,
                  email: transaction.account.user.email,
                  password: transaction.account.user.password,
                  createdAt: transaction.account.user.createdAt,
                  updatedAt: transaction.account.user.updatedAt,
                  isActive: transaction.account.user.isActive,
                })
              : null,
          })
        : null,
      type: transaction.type as TransactionType,
      status: transaction.status as TransactionStatus,
      amount: Number(transaction.amount),
      description: transaction.description,
      paymentMethod: transaction.paymentMethod as PaymentMethod,
      dueDate: transaction.dueDate,
      paidAt: transaction.paidAt,
      installments: transaction.installments,
      installment: transaction.installment,
      recurrenceGroupId: transaction.recurrenceGroupId,
      recurrenceFrequency:
        transaction.recurrenceFrequency as unknown as RecurrenceFrequency,
      recurrenceInterval: transaction.recurrenceInterval,
      recurrenceDayOfMonth: transaction.recurrenceDayOfMonth,
      bankStatement: transaction.bankStatement
        ? BankStatementTransactionAdapter.toDTO(
            BankStatementTransactionAdapter.toDomain({
              id: transaction.bankStatement.id,
              accountId: transaction.bankStatement.accountId,
              account: transaction.bankStatement.account
                ? AccountDomainAdapter.toDTO(
                    AccountDomainAdapter.toDomain({
                      id: transaction.bankStatement.account.id,
                      name: transaction.bankStatement.account.name,
                      bankName: transaction.bankStatement.account.bankName,
                      initialBalance: Number(
                        transaction.bankStatement.account.initialBalance,
                      ),
                      createdAt: transaction.bankStatement.account.createdAt,
                      user: transaction.bankStatement.account.user
                        ? UserDomainAdapter.toDomain({
                            id: transaction.bankStatement.account.user.id,
                            name: transaction.bankStatement.account.user.name,
                            document:
                              transaction.bankStatement.account.user.document,
                            email:
                              transaction.bankStatement.account.user.email,
                            password:
                              transaction.bankStatement.account.user.password,
                            createdAt:
                              transaction.bankStatement.account.user.createdAt,
                            updatedAt:
                              transaction.bankStatement.account.user.updatedAt,
                            isActive:
                              transaction.bankStatement.account.user.isActive,
                          })
                        : null,
                    }),
                  )
                : null,
              fitId: transaction.bankStatement.fitId,
              amount: Number(transaction.bankStatement.amount),
              postedAt: transaction.bankStatement.postedAt,
              description: transaction.bankStatement.description,
              rawType: transaction.bankStatement.rawType,
              createdAt: transaction.bankStatement.createdAt,
            }),
          )
        : null,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
  }

  async create(transaction: FinancialTransactionDomain): Promise<void> {
    const account = transaction.getAccount();
    if (!account) {
      throw new Error('Account is required to create a transaction');
    }

    await this.prisma.financialTransaction.create({
      data: {
        id: transaction.getId(),
        type: transaction.getType() as PrismaTransactionType,
        status: transaction.getStatus() as PrismaTransactionStatus,
        amount: transaction.getAmount(),
        description: transaction.getDescription(),
        paymentMethod: transaction.getPaymentMethod() as PrismaPaymentMethod,
        dueDate: transaction.getDueDate(),
        paidAt: transaction.getPaidAt(),
        installments: transaction.getInstallments(),
        installment: transaction.getInstallment(),
        recurrenceGroupId: transaction.getRecurrenceGroupId(),
        recurrenceFrequency:
          (transaction.getRecurrenceFrequency() as unknown as PrismaRecurrenceFrequency) ??
          null,
        recurrenceInterval: transaction.getRecurrenceInterval(),
        recurrenceDayOfMonth: transaction.getRecurrenceDayOfMonth(),
        accountId: account.getId(),
        bankStatementId: transaction.getBankStatement()?.getId() ?? null,
        createdAt: transaction.getCreatedAt() ?? new Date(),
        updatedAt: transaction.getUpdatedAt() ?? new Date(),
      },
    });
  }

  async findById(id: string): Promise<FinancialTransactionDomain | null> {
    const transaction = await this.prisma.financialTransaction.findUnique({
      where: { id, deletedAt: null },
      include: TRANSACTION_INCLUDE,
    });

    if (!transaction) return null;

    return this.mapToDomain(transaction as PrismaTransactionWithRelations);
  }

  async listByAccountId(
    accountId: string,
    filters?: TransactionFilters,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<FinancialTransactionDomain>> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      accountId,
      deletedAt: null,
      ...(filters?.type && { type: filters.type as PrismaTransactionType }),
      ...(filters?.status && {
        status: filters.status as PrismaTransactionStatus,
      }),
      ...((filters?.startDate || filters?.endDate) && {
        dueDate: {
          ...(filters.startDate && { gte: filters.startDate }),
          ...(filters.endDate && { lte: filters.endDate }),
        },
      }),
    };

    const [transactions, total] = await Promise.all([
      this.prisma.financialTransaction.findMany({
        where,
        include: TRANSACTION_INCLUDE,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.financialTransaction.count({ where }),
    ]);

    return {
      data: transactions.map((t) =>
        this.mapToDomain(t as PrismaTransactionWithRelations),
      ),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(transaction: FinancialTransactionDomain): Promise<void> {
    await this.prisma.financialTransaction.update({
      where: { id: transaction.getId() },
      data: {
        status: transaction.getStatus() as PrismaTransactionStatus,
        paidAt: transaction.getPaidAt(),
        bankStatementId: transaction.getBankStatement()?.getId(),
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.financialTransaction.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findMatchingTransaction(
    accountId: string,
    amount: number,
    dateRange: { start: Date; end: Date },
  ): Promise<FinancialTransactionDomain | null> {
    const transaction = await this.prisma.financialTransaction.findFirst({
      where: {
        accountId,
        deletedAt: null,
        type:
          amount > 0
            ? PrismaTransactionType.income
            : PrismaTransactionType.expense,
        amount: Math.abs(amount),
        status: PrismaTransactionStatus.pending,
        paidAt: null,
        bankStatementId: null,
        dueDate: { gte: dateRange.start, lte: dateRange.end },
      },
      include: TRANSACTION_INCLUDE,
    });

    if (!transaction) return null;

    return this.mapToDomain(transaction as PrismaTransactionWithRelations);
  }

  async getPendingTransactionsByAccountId(
    accountId: string,
  ): Promise<FinancialTransactionDomain[]> {
    const transactions = await this.prisma.financialTransaction.findMany({
      where: {
        accountId,
        deletedAt: null,
        status: TransactionStatus.PENDING,
        type: TransactionType.EXPENSE,
      },
      include: TRANSACTION_INCLUDE,
    });

    return transactions.map((t) =>
      this.mapToDomain(t as PrismaTransactionWithRelations),
    );
  }

  async syncRecurringTransactions(
    accountId: string,
    until: Date,
  ): Promise<void> {
    const latestPerGroup = await this.prisma.financialTransaction.findMany({
      where: {
        accountId,
        deletedAt: null,
        recurrenceGroupId: { not: null },
        recurrenceFrequency: PrismaRecurrenceFrequency.monthly,
        dueDate: { not: null },
      },
      orderBy: { dueDate: 'desc' },
      distinct: ['recurrenceGroupId'],
    });

    const rowsToCreate: any[] = [];

    for (const seed of latestPerGroup) {
      if (!seed.dueDate || !seed.recurrenceGroupId) continue;

      const interval = seed.recurrenceInterval ?? 1;
      const dayOfMonth = seed.recurrenceDayOfMonth ?? seed.dueDate.getDate();

      let nextDueDate = this.buildNextMonthlyDueDate(
        seed.dueDate,
        interval,
        dayOfMonth,
      );

      while (nextDueDate <= until) {
        rowsToCreate.push({
          id: randomUUID(),
          accountId,
          type: seed.type,
          status: PrismaTransactionStatus.pending,
          amount: seed.amount,
          description: seed.description,
          paymentMethod: seed.paymentMethod,
          dueDate: nextDueDate,
          paidAt: null,
          installments: seed.installments,
          installment: seed.installment,
          bankStatementId: null,
          recurrenceGroupId: seed.recurrenceGroupId,
          recurrenceFrequency: seed.recurrenceFrequency,
          recurrenceInterval: seed.recurrenceInterval,
          recurrenceDayOfMonth: seed.recurrenceDayOfMonth,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        nextDueDate = this.buildNextMonthlyDueDate(
          nextDueDate,
          interval,
          dayOfMonth,
        );
      }
    }

    if (rowsToCreate.length === 0) return;

    await this.prisma.financialTransaction.createMany({
      data: rowsToCreate,
      skipDuplicates: true,
    });
  }

  private buildNextMonthlyDueDate(
    previousDueDate: Date,
    intervalMonths: number,
    dayOfMonth: number,
  ): Date {
    const year = previousDueDate.getFullYear();
    const month = previousDueDate.getMonth() + intervalMonths;

    const monthStart = new Date(
      year,
      month,
      1,
      previousDueDate.getHours(),
      previousDueDate.getMinutes(),
      previousDueDate.getSeconds(),
      previousDueDate.getMilliseconds(),
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
