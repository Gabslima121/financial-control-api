import { PrismaClient } from '@prisma/client';
import {
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from 'src/core/domain/financial-transaction/dto';
import { FinancialTransactionDomain } from 'src/core/domain/financial-transaction/financial-transaction.domain';
import { AccountDomain } from 'src/core/domain/account/account.domain';
import { FinancialTransactionRepository } from '../financial-transaction.impl';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const ACCOUNT_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';
const VALID_CPF = '11144477735';

const prismaUser = {
  id: 'c3d4e5f6-a7b8-4901-acde-f12345678901',
  name: 'Gabriel',
  document: VALID_CPF,
  email: 'gabriel@email.com',
  password: 'hashed',
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
};

const prismaAccount = {
  id: ACCOUNT_UUID,
  name: 'Conta Principal',
  bankName: 'Nubank',
  initialBalance: 1000,
  createdAt: new Date('2024-01-01'),
  user: prismaUser,
};

const prismaTransaction = {
  id: VALID_UUID,
  accountId: ACCOUNT_UUID,
  type: 'expense',
  status: 'pending',
  amount: 3000,
  description: 'Aluguel',
  paymentMethod: 'pix',
  dueDate: new Date('2024-03-10'),
  paidAt: null,
  installments: 1,
  installment: 1,
  recurrenceGroupId: null,
  recurrenceFrequency: null,
  recurrenceInterval: null,
  recurrenceDayOfMonth: null,
  bankStatement: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
  account: prismaAccount,
};

const makePrisma = () =>
  ({
    financialTransaction: {
      create: jest.fn(),
      createMany: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
    },
  }) as unknown as PrismaClient;

const makeAccount = () =>
  AccountDomain.create({
    id: ACCOUNT_UUID,
    name: 'Conta Principal',
    bankName: 'Nubank',
    initialBalance: 1000,
  });

describe('FinancialTransactionRepository', () => {
  let prisma: ReturnType<typeof makePrisma>;
  let repo: FinancialTransactionRepository;

  beforeEach(() => {
    prisma = makePrisma();
    repo = new FinancialTransactionRepository(prisma);
  });

  describe('create()', () => {
    it('deve chamar prisma.financialTransaction.create com os dados corretos', async () => {
      (prisma.financialTransaction.create as jest.Mock).mockResolvedValue(
        undefined,
      );
      const transaction = FinancialTransactionDomain.create({
        id: VALID_UUID,
        account: makeAccount(),
        type: TransactionType.EXPENSE,
        status: TransactionStatus.PENDING,
        amount: 3000,
        description: 'Aluguel',
        paymentMethod: PaymentMethod.PIX,
        dueDate: new Date('2024-03-10'),
        paidAt: null,
        installments: 1,
        installment: 1,
        bankStatement: null,
      });

      await repo.create(transaction);

      expect(prisma.financialTransaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            id: VALID_UUID,
            accountId: ACCOUNT_UUID,
            type: TransactionType.EXPENSE,
            amount: 3000,
          }),
        }),
      );
    });

    it('deve lançar erro quando account é nulo', async () => {
      const transaction = FinancialTransactionDomain.create({
        id: VALID_UUID,
        account: null,
        type: TransactionType.EXPENSE,
        status: TransactionStatus.PENDING,
        amount: 3000,
        description: null,
        paymentMethod: null,
        dueDate: null,
        paidAt: null,
        installments: 1,
        installment: 1,
        bankStatement: null,
      });

      await expect(repo.create(transaction)).rejects.toThrow(
        'Account is required to create a transaction',
      );
    });
  });

  describe('findById()', () => {
    it('deve retornar FinancialTransactionDomain quando encontrado', async () => {
      (prisma.financialTransaction.findUnique as jest.Mock).mockResolvedValue(
        prismaTransaction,
      );

      const result = await repo.findById(VALID_UUID);

      expect(result).toBeInstanceOf(FinancialTransactionDomain);
      expect(result!.getId()).toBe(VALID_UUID);
      expect(result!.getAmount()).toBe(3000);
      expect(result!.getType()).toBe(TransactionType.EXPENSE);
      expect(result!.getStatus()).toBe(TransactionStatus.PENDING);
    });

    it('deve retornar null quando não encontrado', async () => {
      (prisma.financialTransaction.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      const result = await repo.findById(VALID_UUID);

      expect(result).toBeNull();
    });
  });

  describe('listByAccountId()', () => {
    it('deve retornar lista paginada de FinancialTransactionDomain', async () => {
      (prisma.financialTransaction.findMany as jest.Mock).mockResolvedValue([
        prismaTransaction,
      ]);
      (prisma.financialTransaction.count as jest.Mock).mockResolvedValue(1);

      const result = await repo.listByAccountId(ACCOUNT_UUID);

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toBeInstanceOf(FinancialTransactionDomain);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });

    it('deve retornar lista vazia', async () => {
      (prisma.financialTransaction.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.financialTransaction.count as jest.Mock).mockResolvedValue(0);

      const result = await repo.listByAccountId(ACCOUNT_UUID);

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });

    it('deve aplicar filtros e paginação', async () => {
      (prisma.financialTransaction.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.financialTransaction.count as jest.Mock).mockResolvedValue(0);

      await repo.listByAccountId(
        ACCOUNT_UUID,
        { type: TransactionType.EXPENSE, status: TransactionStatus.PENDING },
        { page: 2, limit: 10 },
      );

      expect(prisma.financialTransaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
          where: expect.objectContaining({
            accountId: ACCOUNT_UUID,
            type: TransactionType.EXPENSE,
            status: TransactionStatus.PENDING,
          }),
        }),
      );
    });
  });

  describe('update()', () => {
    it('deve chamar prisma.financialTransaction.update com os dados corretos', async () => {
      (prisma.financialTransaction.update as jest.Mock).mockResolvedValue(
        undefined,
      );
      const transaction = FinancialTransactionDomain.create({
        id: VALID_UUID,
        account: makeAccount(),
        type: TransactionType.EXPENSE,
        status: TransactionStatus.PENDING,
        amount: 3000,
        description: null,
        paymentMethod: null,
        dueDate: null,
        paidAt: null,
        installments: 1,
        installment: 1,
        bankStatement: null,
      });
      transaction.confirmPayment(new Date('2024-03-10'));

      await repo.update(transaction);

      expect(prisma.financialTransaction.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: VALID_UUID },
          data: expect.objectContaining({ status: TransactionStatus.PAID }),
        }),
      );
    });
  });

  describe('delete()', () => {
    it('deve fazer soft delete definindo deletedAt', async () => {
      (prisma.financialTransaction.update as jest.Mock).mockResolvedValue(
        undefined,
      );

      await repo.delete(VALID_UUID);

      expect(prisma.financialTransaction.update).toHaveBeenCalledWith({
        where: { id: VALID_UUID },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });

  describe('findMatchingTransaction()', () => {
    it('deve retornar FinancialTransactionDomain quando encontrado', async () => {
      (prisma.financialTransaction.findFirst as jest.Mock).mockResolvedValue(
        prismaTransaction,
      );
      const dateRange = {
        start: new Date('2024-03-01'),
        end: new Date('2024-03-31'),
      };

      const result = await repo.findMatchingTransaction(
        ACCOUNT_UUID,
        -3000,
        dateRange,
      );

      expect(result).toBeInstanceOf(FinancialTransactionDomain);
      expect(prisma.financialTransaction.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ accountId: ACCOUNT_UUID }),
        }),
      );
    });

    it('deve retornar null quando não encontrado', async () => {
      (prisma.financialTransaction.findFirst as jest.Mock).mockResolvedValue(
        null,
      );

      const result = await repo.findMatchingTransaction(ACCOUNT_UUID, -3000, {
        start: new Date(),
        end: new Date(),
      });

      expect(result).toBeNull();
    });
  });

  describe('getPendingTransactionsByAccountId()', () => {
    it('deve retornar transações pendentes', async () => {
      (prisma.financialTransaction.findMany as jest.Mock).mockResolvedValue([
        prismaTransaction,
      ]);

      const result = await repo.getPendingTransactionsByAccountId(ACCOUNT_UUID);

      expect(result).toHaveLength(1);
      expect(result[0].getStatus()).toBe(TransactionStatus.PENDING);
    });
  });

  describe('syncRecurringTransactions()', () => {
    it('deve criar novas transações recorrentes até a data limite', async () => {
      const seedTransaction = {
        ...prismaTransaction,
        recurrenceGroupId: 'd4e5f6a7-b8c9-4012-bdef-012345678902',
        recurrenceFrequency: 'monthly',
        recurrenceInterval: 1,
        recurrenceDayOfMonth: 10,
        dueDate: new Date('2024-01-10'),
      };

      (prisma.financialTransaction.findMany as jest.Mock).mockResolvedValue([
        seedTransaction,
      ]);
      (prisma.financialTransaction.createMany as jest.Mock).mockResolvedValue(
        undefined,
      );

      const until = new Date('2024-03-10');
      await repo.syncRecurringTransactions(ACCOUNT_UUID, until);

      expect(prisma.financialTransaction.createMany).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              recurrenceGroupId: seedTransaction.recurrenceGroupId,
            }),
          ]),
          skipDuplicates: true,
        }),
      );
    });

    it('não deve chamar createMany quando não há transações a criar', async () => {
      (prisma.financialTransaction.findMany as jest.Mock).mockResolvedValue([]);

      await repo.syncRecurringTransactions(ACCOUNT_UUID, new Date());

      expect(prisma.financialTransaction.createMany).not.toHaveBeenCalled();
    });
  });
});
