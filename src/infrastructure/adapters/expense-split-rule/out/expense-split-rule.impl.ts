import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ExpenseSplitRuleDomain } from 'src/core/domain/expense-split-rule/expense-split-rule.domain';
import { ExpenseSplitType } from 'src/core/domain/expense-split-rule/dto';
import { ExpenseSplitRulePort } from 'src/core/port/expense-split-rule.port';
import { ExpenseSplitRuleAdapter } from '../in/expense-split-rule.adapter';
import { PersonAdapter } from 'src/infrastructure/adapters/person/in/person.adapter';

@Injectable()
export class ExpenseSplitRuleRepository implements ExpenseSplitRulePort {
  constructor(private readonly prisma: PrismaClient) {}

  async create(rule: ExpenseSplitRuleDomain): Promise<void> {
    await this.prisma.expenseSplitRule.create({
      data: {
        id: rule.getId(),
        accountId: rule.getAccountId(),
        name: rule.getName(),
        type: rule.getType(),
        recurrenceGroupId: rule.getRecurrenceGroupId(),
        transactionId: rule.getTransactionId(),
        isActive: rule.getIsActive(),
        createdAt: rule.getCreatedAt() ?? new Date(),
        updatedAt: rule.getUpdatedAt() ?? new Date(),
        participants: {
          create: rule.getParticipants().map((p) => ({
            id: p.getId(),
            personId: p.getPersonId(),
            fixedPercent: p.getFixedPercent(),
            fixedAmount: p.getFixedAmount(),
            createdAt: p.getCreatedAt() ?? new Date(),
          })),
        },
      },
    });
  }

  async findById(id: string): Promise<ExpenseSplitRuleDomain | null> {
    const rule = await this.prisma.expenseSplitRule.findUnique({
      where: { id },
      include: { participants: { include: { person: true } } },
    });

    if (!rule) return null;

    return ExpenseSplitRuleAdapter.toDomain({
      id: rule.id,
      accountId: rule.accountId,
      name: rule.name,
      type: rule.type as unknown as ExpenseSplitType,
      recurrenceGroupId: rule.recurrenceGroupId,
      transactionId: rule.transactionId,
      isActive: rule.isActive,
      participants: rule.participants.map((p) => ({
        id: p.id,
        ruleId: p.ruleId,
        personId: p.personId,
        person: p.person
          ? PersonAdapter.toDomain({
              id: p.person.id,
              name: p.person.name,
              email: p.person.email,
            })
          : undefined,
        fixedPercent: p.fixedPercent === null ? null : Number(p.fixedPercent),
        fixedAmount: p.fixedAmount === null ? null : Number(p.fixedAmount),
        createdAt: p.createdAt,
      })),
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
    });
  }

  async listByAccountId(accountId: string): Promise<ExpenseSplitRuleDomain[]> {
    const rules = await this.prisma.expenseSplitRule.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
      include: { participants: { include: { person: true } } },
    });

    return rules.map((rule) =>
      ExpenseSplitRuleAdapter.toDomain({
        id: rule.id,
        accountId: rule.accountId,
        name: rule.name,
        type: rule.type as unknown as ExpenseSplitType,
        recurrenceGroupId: rule.recurrenceGroupId,
        transactionId: rule.transactionId,
        isActive: rule.isActive,
        participants: rule.participants.map((p) => ({
          id: p.id,
          ruleId: p.ruleId,
          personId: p.personId,
          person: p.person
            ? PersonAdapter.toDomain({
                id: p.person.id,
                name: p.person.name,
                email: p.person.email,
              })
            : undefined,
          fixedPercent: p.fixedPercent === null ? null : Number(p.fixedPercent),
          fixedAmount: p.fixedAmount === null ? null : Number(p.fixedAmount),
          createdAt: p.createdAt,
        })),
        createdAt: rule.createdAt,
        updatedAt: rule.updatedAt,
      }),
    );
  }

  async findActiveByRecurrenceGroupId(
    accountId: string,
    recurrenceGroupId: string,
  ): Promise<ExpenseSplitRuleDomain | null> {
    const rule = await this.prisma.expenseSplitRule.findFirst({
      where: { accountId, recurrenceGroupId, isActive: true },
      orderBy: { createdAt: 'desc' },
      include: { participants: { include: { person: true } } },
    });

    if (!rule) return null;

    return ExpenseSplitRuleAdapter.toDomain({
      id: rule.id,
      accountId: rule.accountId,
      name: rule.name,
      type: rule.type as unknown as ExpenseSplitType,
      recurrenceGroupId: rule.recurrenceGroupId,
      transactionId: rule.transactionId,
      isActive: rule.isActive,
      participants: rule.participants.map((p) => ({
        id: p.id,
        ruleId: p.ruleId,
        personId: p.personId,
        person: p.person
          ? PersonAdapter.toDomain({
              id: p.person.id,
              name: p.person.name,
              email: p.person.email,
            })
          : undefined,
        fixedPercent: p.fixedPercent === null ? null : Number(p.fixedPercent),
        fixedAmount: p.fixedAmount === null ? null : Number(p.fixedAmount),
        createdAt: p.createdAt,
      })),
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
    });
  }

  async findActiveByTransactionId(
    accountId: string,
    transactionId: string,
  ): Promise<ExpenseSplitRuleDomain | null> {
    const rule = await this.prisma.expenseSplitRule.findFirst({
      where: { accountId, transactionId, isActive: true },
      orderBy: { createdAt: 'desc' },
      include: { participants: { include: { person: true } } },
    });

    if (!rule) return null;

    return ExpenseSplitRuleAdapter.toDomain({
      id: rule.id,
      accountId: rule.accountId,
      name: rule.name,
      type: rule.type as unknown as ExpenseSplitType,
      recurrenceGroupId: rule.recurrenceGroupId,
      transactionId: rule.transactionId,
      isActive: rule.isActive,
      participants: rule.participants.map((p) => ({
        id: p.id,
        ruleId: p.ruleId,
        personId: p.personId,
        person: p.person
          ? PersonAdapter.toDomain({
              id: p.person.id,
              name: p.person.name,
              email: p.person.email,
            })
          : undefined,
        fixedPercent: p.fixedPercent === null ? null : Number(p.fixedPercent),
        fixedAmount: p.fixedAmount === null ? null : Number(p.fixedAmount),
        createdAt: p.createdAt,
      })),
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
    });
  }
}
