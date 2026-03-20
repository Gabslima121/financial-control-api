import { PrismaClient } from '@prisma/client';
import { ExpenseSplitType } from 'src/core/domain/expense-split-rule/dto';
import { ExpenseSplitRuleDomain } from 'src/core/domain/expense-split-rule/expense-split-rule.domain';
import { ExpenseSplitRuleRepository } from '../expense-split-rule.impl';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const ACCOUNT_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';
const PERSON_UUID = 'c3d4e5f6-a7b8-4901-acde-f12345678901';
const RECURRENCE_UUID = 'd4e5f6a7-b8c9-4012-bdef-012345678902';
const TX_UUID = 'e5f6a7b8-c9d0-4123-8ef0-123456789012';

const prismaParticipant = {
  id: PERSON_UUID,
  ruleId: VALID_UUID,
  personId: PERSON_UUID,
  fixedPercent: 0.6,
  fixedAmount: null,
  createdAt: new Date('2024-01-01'),
  person: { id: PERSON_UUID, name: 'Gabriel', email: 'gabriel@email.com' },
};

const prismaRule = {
  id: VALID_UUID,
  accountId: ACCOUNT_UUID,
  name: 'Divisão do Aluguel',
  type: 'proportional_income',
  recurrenceGroupId: null,
  transactionId: null,
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
  participants: [prismaParticipant],
};

const makePrisma = () =>
  ({
    expenseSplitRule: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  }) as unknown as PrismaClient;

describe('ExpenseSplitRuleRepository', () => {
  let prisma: ReturnType<typeof makePrisma>;
  let repo: ExpenseSplitRuleRepository;

  beforeEach(() => {
    prisma = makePrisma();
    repo = new ExpenseSplitRuleRepository(prisma);
  });

  describe('create()', () => {
    it('deve chamar prisma.expenseSplitRule.create com os dados corretos', async () => {
      (prisma.expenseSplitRule.create as jest.Mock).mockResolvedValue(
        undefined,
      );
      const rule = ExpenseSplitRuleDomain.create({
        id: VALID_UUID,
        accountId: ACCOUNT_UUID,
        name: 'Divisão do Aluguel',
        type: ExpenseSplitType.PROPORTIONAL_INCOME,
        isActive: true,
        participants: [{ personId: PERSON_UUID, fixedPercent: 0.6 }],
      });

      await repo.create(rule);

      expect(prisma.expenseSplitRule.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            id: VALID_UUID,
            accountId: ACCOUNT_UUID,
            name: 'Divisão do Aluguel',
            type: ExpenseSplitType.PROPORTIONAL_INCOME,
          }),
        }),
      );
    });
  });

  describe('findById()', () => {
    it('deve retornar ExpenseSplitRuleDomain quando encontrado', async () => {
      (prisma.expenseSplitRule.findUnique as jest.Mock).mockResolvedValue(
        prismaRule,
      );

      const result = await repo.findById(VALID_UUID);

      expect(result).toBeInstanceOf(ExpenseSplitRuleDomain);
      expect(result!.getId()).toBe(VALID_UUID);
      expect(result!.getName()).toBe('Divisão do Aluguel');
      expect(result!.getType()).toBe(ExpenseSplitType.PROPORTIONAL_INCOME);
      expect(result!.getParticipants()).toHaveLength(1);
      expect(prisma.expenseSplitRule.findUnique).toHaveBeenCalledWith({
        where: { id: VALID_UUID },
        include: { participants: { include: { person: true } } },
      });
    });

    it('deve retornar null quando não encontrado', async () => {
      (prisma.expenseSplitRule.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repo.findById(VALID_UUID);

      expect(result).toBeNull();
    });
  });

  describe('listByAccountId()', () => {
    it('deve retornar lista de ExpenseSplitRuleDomain', async () => {
      (prisma.expenseSplitRule.findMany as jest.Mock).mockResolvedValue([
        prismaRule,
      ]);

      const result = await repo.listByAccountId(ACCOUNT_UUID);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ExpenseSplitRuleDomain);
      expect(prisma.expenseSplitRule.findMany).toHaveBeenCalledWith({
        where: { accountId: ACCOUNT_UUID },
        orderBy: { createdAt: 'desc' },
        include: { participants: { include: { person: true } } },
      });
    });

    it('deve retornar lista vazia', async () => {
      (prisma.expenseSplitRule.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repo.listByAccountId(ACCOUNT_UUID);

      expect(result).toHaveLength(0);
    });
  });

  describe('findActiveByRecurrenceGroupId()', () => {
    it('deve retornar a regra quando encontrada', async () => {
      (prisma.expenseSplitRule.findFirst as jest.Mock).mockResolvedValue(
        prismaRule,
      );

      const result = await repo.findActiveByRecurrenceGroupId(
        ACCOUNT_UUID,
        RECURRENCE_UUID,
      );

      expect(result).toBeInstanceOf(ExpenseSplitRuleDomain);
      expect(prisma.expenseSplitRule.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            accountId: ACCOUNT_UUID,
            recurrenceGroupId: RECURRENCE_UUID,
            isActive: true,
          },
        }),
      );
    });

    it('deve retornar null quando não encontrada', async () => {
      (prisma.expenseSplitRule.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await repo.findActiveByRecurrenceGroupId(
        ACCOUNT_UUID,
        RECURRENCE_UUID,
      );

      expect(result).toBeNull();
    });
  });

  describe('findActiveByTransactionId()', () => {
    it('deve retornar a regra quando encontrada', async () => {
      (prisma.expenseSplitRule.findFirst as jest.Mock).mockResolvedValue(
        prismaRule,
      );

      const result = await repo.findActiveByTransactionId(
        ACCOUNT_UUID,
        TX_UUID,
      );

      expect(result).toBeInstanceOf(ExpenseSplitRuleDomain);
      expect(prisma.expenseSplitRule.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            accountId: ACCOUNT_UUID,
            transactionId: TX_UUID,
            isActive: true,
          },
        }),
      );
    });

    it('deve retornar null quando não encontrada', async () => {
      (prisma.expenseSplitRule.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await repo.findActiveByTransactionId(
        ACCOUNT_UUID,
        TX_UUID,
      );

      expect(result).toBeNull();
    });
  });
});
