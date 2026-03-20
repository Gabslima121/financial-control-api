import { PrismaClient } from '@prisma/client';
import { ExpenseSplitAllocationDomain } from 'src/core/domain/expense-split-allocation/expense-split-allocation.domain';
import { ExpenseSplitAllocationRepository } from '../expense-split-allocation.impl';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const TX_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';
const PERSON_UUID = 'c3d4e5f6-a7b8-4901-acde-f12345678901';

const prismaRow = {
  id: VALID_UUID,
  transactionId: TX_UUID,
  personId: PERSON_UUID,
  amount: 1500,
  createdAt: new Date('2024-01-01'),
  person: { id: PERSON_UUID, name: 'Gabriel', email: 'gabriel@email.com' },
};

const makePrisma = () =>
  ({
    expenseSplitAllocation: {
      createMany: jest.fn(),
      findMany: jest.fn(),
    },
  }) as unknown as PrismaClient;

describe('ExpenseSplitAllocationRepository', () => {
  let prisma: ReturnType<typeof makePrisma>;
  let repo: ExpenseSplitAllocationRepository;

  beforeEach(() => {
    prisma = makePrisma();
    repo = new ExpenseSplitAllocationRepository(prisma);
  });

  describe('createMany()', () => {
    it('deve chamar prisma.expenseSplitAllocation.createMany com os dados corretos', async () => {
      (prisma.expenseSplitAllocation.createMany as jest.Mock).mockResolvedValue(
        undefined,
      );
      const allocations = [
        ExpenseSplitAllocationDomain.create({
          id: VALID_UUID,
          transactionId: TX_UUID,
          personId: PERSON_UUID,
          amount: 1500,
          createdAt: new Date('2024-01-01'),
        }),
      ];

      await repo.createMany(allocations);

      expect(prisma.expenseSplitAllocation.createMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({
            id: VALID_UUID,
            transactionId: TX_UUID,
            personId: PERSON_UUID,
            amount: 1500,
          }),
        ],
        skipDuplicates: true,
      });
    });

    it('não deve chamar prisma quando a lista está vazia', async () => {
      await repo.createMany([]);

      expect(prisma.expenseSplitAllocation.createMany).not.toHaveBeenCalled();
    });
  });

  describe('listByTransactionId()', () => {
    it('deve retornar lista de ExpenseSplitAllocationDomain', async () => {
      (prisma.expenseSplitAllocation.findMany as jest.Mock).mockResolvedValue([
        prismaRow,
      ]);

      const result = await repo.listByTransactionId(TX_UUID);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ExpenseSplitAllocationDomain);
      expect(result[0].getTransactionId()).toBe(TX_UUID);
      expect(result[0].getPersonId()).toBe(PERSON_UUID);
      expect(result[0].getAmount()).toBe(1500);
      expect(prisma.expenseSplitAllocation.findMany).toHaveBeenCalledWith({
        where: { transactionId: TX_UUID },
        orderBy: { createdAt: 'asc' },
        include: { person: true },
      });
    });

    it('deve mapear o person corretamente', async () => {
      (prisma.expenseSplitAllocation.findMany as jest.Mock).mockResolvedValue([
        prismaRow,
      ]);

      const result = await repo.listByTransactionId(TX_UUID);

      expect(result[0].getPerson()!.getName()).toBe('Gabriel');
    });

    it('deve retornar lista vazia', async () => {
      (prisma.expenseSplitAllocation.findMany as jest.Mock).mockResolvedValue(
        [],
      );

      const result = await repo.listByTransactionId(TX_UUID);

      expect(result).toHaveLength(0);
    });
  });
});
