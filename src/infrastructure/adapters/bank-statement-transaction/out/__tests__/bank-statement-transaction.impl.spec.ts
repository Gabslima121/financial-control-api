import { PrismaClient } from '@prisma/client';
import { BankStatementTransactionDomain } from 'src/core/domain/bank-statement-transaction/bank-statement-transaction.domain';
import { BankStatementTransactionRepository } from '../bank-statement-transaction.impl';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const ACCOUNT_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';
const VALID_CPF = '11144477735';

const prismaAccount = {
  id: ACCOUNT_UUID,
  name: 'Conta Principal',
  bankName: 'Nubank',
  initialBalance: 1000,
  createdAt: new Date('2024-01-01'),
  user: {
    id: 'c3d4e5f6-a7b8-4901-acde-f12345678901',
    name: 'Gabriel',
    document: VALID_CPF,
    email: 'gabriel@email.com',
    password: 'hashed',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  },
};

const prismaTransaction = {
  id: VALID_UUID,
  accountId: ACCOUNT_UUID,
  fitId: 'FIT123456',
  amount: -1500,
  postedAt: new Date('2024-03-01'),
  description: 'PAGTO BOLETO',
  rawType: 'DEBIT',
  createdAt: new Date('2024-01-01'),
  account: prismaAccount,
};

const makePrisma = () =>
  ({
    bankStatementTransaction: {
      aggregate: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  }) as unknown as PrismaClient;

describe('BankStatementTransactionRepository', () => {
  let prisma: ReturnType<typeof makePrisma>;
  let repo: BankStatementTransactionRepository;

  beforeEach(() => {
    prisma = makePrisma();
    repo = new BankStatementTransactionRepository(prisma);
  });

  describe('sumAmountByAccountId()', () => {
    it('deve retornar a soma dos valores', async () => {
      (
        prisma.bankStatementTransaction.aggregate as jest.Mock
      ).mockResolvedValue({
        _sum: { amount: 3000 },
      });

      const result = await repo.sumAmountByAccountId(ACCOUNT_UUID);

      expect(result).toBe(3000);
      expect(prisma.bankStatementTransaction.aggregate).toHaveBeenCalledWith({
        where: { accountId: ACCOUNT_UUID },
        _sum: { amount: true },
      });
    });

    it('deve retornar 0 quando não há registros', async () => {
      (
        prisma.bankStatementTransaction.aggregate as jest.Mock
      ).mockResolvedValue({
        _sum: { amount: null },
      });

      const result = await repo.sumAmountByAccountId(ACCOUNT_UUID);

      expect(result).toBe(0);
    });
  });

  describe('create()', () => {
    it('deve chamar prisma.bankStatementTransaction.create com os dados corretos', async () => {
      (prisma.bankStatementTransaction.create as jest.Mock).mockResolvedValue(
        undefined,
      );
      const domain = BankStatementTransactionDomain.create({
        id: VALID_UUID,
        accountId: ACCOUNT_UUID,
        fitId: 'FIT123456',
        amount: -1500,
        postedAt: new Date('2024-03-01'),
        description: 'PAGTO BOLETO',
        rawType: 'DEBIT',
        createdAt: new Date('2024-01-01'),
      });

      await repo.create(domain);

      expect(prisma.bankStatementTransaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            id: VALID_UUID,
            accountId: ACCOUNT_UUID,
            fitId: 'FIT123456',
            amount: -1500,
          }),
        }),
      );
    });
  });

  describe('findByFitId()', () => {
    it('deve retornar BankStatementTransactionDomain quando encontrado', async () => {
      (
        prisma.bankStatementTransaction.findUnique as jest.Mock
      ).mockResolvedValue(prismaTransaction);

      const result = await repo.findByFitId(ACCOUNT_UUID, 'FIT123456');

      expect(result).toBeInstanceOf(BankStatementTransactionDomain);
      expect(result!.getId()).toBe(VALID_UUID);
      expect(result!.getFitId()).toBe('FIT123456');
      expect(result!.getAmount()).toBe(-1500);
      expect(prisma.bankStatementTransaction.findUnique).toHaveBeenCalledWith({
        where: {
          accountId_fitId: { accountId: ACCOUNT_UUID, fitId: 'FIT123456' },
        },
        include: { account: { include: { user: true } } },
      });
    });

    it('deve retornar null quando não encontrado', async () => {
      (
        prisma.bankStatementTransaction.findUnique as jest.Mock
      ).mockResolvedValue(null);

      const result = await repo.findByFitId(ACCOUNT_UUID, 'FIT999');

      expect(result).toBeNull();
    });
  });

  describe('listByAccountId()', () => {
    it('deve retornar lista de BankStatementTransactionDomain', async () => {
      (prisma.bankStatementTransaction.findMany as jest.Mock).mockResolvedValue(
        [prismaTransaction],
      );

      const result = await repo.listByAccountId(ACCOUNT_UUID);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(BankStatementTransactionDomain);
      expect(result[0].getAccountId()).toBe(ACCOUNT_UUID);
      expect(prisma.bankStatementTransaction.findMany).toHaveBeenCalledWith({
        where: { accountId: ACCOUNT_UUID },
        orderBy: { postedAt: 'desc' },
        include: { account: { include: { user: true } } },
      });
    });

    it('deve retornar lista vazia', async () => {
      (prisma.bankStatementTransaction.findMany as jest.Mock).mockResolvedValue(
        [],
      );

      const result = await repo.listByAccountId(ACCOUNT_UUID);

      expect(result).toHaveLength(0);
    });
  });
});
