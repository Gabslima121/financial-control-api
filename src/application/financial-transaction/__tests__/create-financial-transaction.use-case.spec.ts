import { AccountPort } from 'src/core/port/account.port';
import { FinancialTransactionPort } from 'src/core/port/financial-transaction.port';
import { AccountDomain } from 'src/core/domain/account/account.domain';
import {
  PaymentMethod,
  RecurrenceFrequency,
  TransactionStatus,
  TransactionType,
} from 'src/core/domain/financial-transaction/dto';
import { CreateFinancialTransactionUseCase } from '../create-financial-transaction.use-case';
import { CreateFinancialTransactionDTO } from 'src/infrastructure/nestjs/financial-transaction/dto/create-financial-transaction.dto';

const ACCOUNT_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';

const makeAccountPort = (): jest.Mocked<AccountPort> => ({
  findById: jest.fn(),
  createAccount: jest.fn(),
  listAccountsByUserId: jest.fn(),
  updateAccount: jest.fn(),
  deleteAccount: jest.fn(),
});

const makeFinancialTransactionPort = (): jest.Mocked<FinancialTransactionPort> => ({
  create: jest.fn(),
  findById: jest.fn(),
  listByAccountId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findMatchingTransaction: jest.fn(),
  getPendingTransactionsByAccountId: jest.fn(),
  syncRecurringTransactions: jest.fn(),
});

const makeAccount = () =>
  AccountDomain.create({
    id: ACCOUNT_UUID,
    name: 'Conta',
    bankName: null,
    initialBalance: 0,
  });

const makeSimpleDTO = (): CreateFinancialTransactionDTO => ({
  type: TransactionType.EXPENSE,
  status: TransactionStatus.PENDING,
  amount: 3000,
  description: 'Aluguel',
  paymentMethod: PaymentMethod.PIX,
  dueDate: new Date('2024-03-10'),
  paidAt: null,
  isRecurring: false,
});

describe('CreateFinancialTransactionUseCase', () => {
  let accountPort: jest.Mocked<AccountPort>;
  let financialTransactionPort: jest.Mocked<FinancialTransactionPort>;
  let useCase: CreateFinancialTransactionUseCase;

  beforeEach(() => {
    accountPort = makeAccountPort();
    financialTransactionPort = makeFinancialTransactionPort();
    useCase = new CreateFinancialTransactionUseCase(
      financialTransactionPort,
      accountPort,
    );
  });

  describe('transação simples', () => {
    it('deve criar transação quando conta existe', async () => {
      accountPort.findById.mockResolvedValue(makeAccount());
      financialTransactionPort.create.mockResolvedValue(undefined);

      await useCase.execute(makeSimpleDTO(), ACCOUNT_UUID);

      expect(accountPort.findById).toHaveBeenCalledWith(ACCOUNT_UUID);
      expect(financialTransactionPort.create).toHaveBeenCalledTimes(1);
    });

    it('deve lançar erro quando conta não existe', async () => {
      accountPort.findById.mockResolvedValue(null);

      await expect(useCase.execute(makeSimpleDTO(), ACCOUNT_UUID)).rejects.toThrow(
        'Account not found',
      );

      expect(financialTransactionPort.create).not.toHaveBeenCalled();
    });
  });

  describe('transação recorrente', () => {
    const makeRecurringDTO = (): CreateFinancialTransactionDTO => ({
      type: TransactionType.EXPENSE,
      status: TransactionStatus.PENDING,
      amount: 3000,
      description: 'Aluguel Recorrente',
      paymentMethod: PaymentMethod.PIX,
      dueDate: new Date('2024-01-10'),
      paidAt: null,
      isRecurring: true,
      recurrenceFrequency: RecurrenceFrequency.MONTHLY,
      recurrenceInterval: 1,
      recurrenceDayOfMonth: 10,
      recurrenceGenerateMonths: 3,
    });

    it('deve criar múltiplas transações para recorrência mensal', async () => {
      accountPort.findById.mockResolvedValue(makeAccount());
      financialTransactionPort.create.mockResolvedValue(undefined);

      await useCase.execute(makeRecurringDTO(), ACCOUNT_UUID);

      expect(financialTransactionPort.create).toHaveBeenCalledTimes(3);
    });

    it('deve lançar erro quando dueDate é ausente em recorrência', async () => {
      accountPort.findById.mockResolvedValue(makeAccount());
      const dto = makeRecurringDTO();
      dto.dueDate = null;

      await expect(useCase.execute(dto, ACCOUNT_UUID)).rejects.toThrow(
        'dueDate é obrigatório para criar recorrência',
      );
    });

    it('deve lançar erro quando frequência não é mensal', async () => {
      accountPort.findById.mockResolvedValue(makeAccount());
      const dto = makeRecurringDTO();
      dto.recurrenceFrequency = 'weekly' as RecurrenceFrequency;

      await expect(useCase.execute(dto, ACCOUNT_UUID)).rejects.toThrow(
        'Apenas recorrência mensal está suportada no momento',
      );
    });
  });
});
