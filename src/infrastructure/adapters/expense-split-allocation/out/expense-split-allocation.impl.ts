import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ExpenseSplitAllocationDomain } from 'src/core/domain/expense-split-allocation/expense-split-allocation.domain';
import { ExpenseSplitAllocationPort } from 'src/core/port/expense-split-allocation.port';
import { ExpenseSplitAllocationAdapter } from '../in/expense-split-allocation.adapter';
import { PersonAdapter } from 'src/infrastructure/adapters/person/in/person.adapter';

@Injectable()
export class ExpenseSplitAllocationRepository
  implements ExpenseSplitAllocationPort
{
  constructor(private readonly prisma: PrismaClient) {}

  async createMany(allocations: ExpenseSplitAllocationDomain[]): Promise<void> {
    if (allocations.length === 0) return;

    await this.prisma.expenseSplitAllocation.createMany({
      data: allocations.map((a) => ({
        id: a.getId(),
        transactionId: a.getTransactionId(),
        personId: a.getPersonId(),
        amount: a.getAmount(),
        createdAt: a.getCreatedAt() ?? new Date(),
      })),
      skipDuplicates: true,
    });
  }

  async listByTransactionId(
    transactionId: string,
  ): Promise<ExpenseSplitAllocationDomain[]> {
    const rows = await this.prisma.expenseSplitAllocation.findMany({
      where: { transactionId },
      orderBy: { createdAt: 'asc' },
      include: { person: true },
    });

    return rows.map((row) =>
      ExpenseSplitAllocationAdapter.toDomain({
        id: row.id,
        transactionId: row.transactionId,
        personId: row.personId,
        person: row.person
          ? PersonAdapter.toDomain({
              id: row.person.id,
              name: row.person.name,
              email: row.person.email,
            })
          : undefined,
        amount: Number(row.amount),
        createdAt: row.createdAt,
      }),
    );
  }
}
