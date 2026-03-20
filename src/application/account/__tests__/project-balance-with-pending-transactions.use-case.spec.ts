import { FinancialTransactionPort } from 'src/core/port/financial-transaction.port';
import { FinancialTransactionDomain } from 'src/core/domain/financial-transaction/financial-transaction.domain';
import { AccountDomain } from 'src/core/domain/account/account.domain';
import {
  TransactionStatus,
  TransactionType,
  PaymentMethod,
} from 'src/core/domain/financial-transaction/dto';
import { GetCurrentBalanceUseCase } from '../get-current-balance.use-case';
import { ProjectBalanceWithPendingTransactionsUseCase } from '../project-balance-with-pending-transactions.use-case';
import { AccountPort } from 'src/core/port/account.port';
import { BankStatementTransactionPort } from 'src/core/port/bank-statement-transaction.port';

const ACCOUNT_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';

const makeFinancialTransactionPort =
  (): jest.Mocked<FinancialTransactionPort> => ({
    create: jest.fn(),
    findById: jest.fn(),
    listByAccountId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMatchingTransaction: jest.fn(),
    getPendingTransactionsByAccountId: jest.fn(),
    syncRecurringTransactions: jest.fn(),
  });

const makeAccountPort = (): jest.Mocked<AccountPort> => ({
  findById: jest.fn(),
  createAccount: jest.fn(),
  listAccountsByUserId: jest.fn(),
  updateAccount: jest.fn(),
  deleteAccount: jest.fn(),
});

const makeBankStatementPort =
  (): jest.Mocked<BankStatementTransactionPort> => ({
    create: jest.fn(),
    findByFitId: jest.fn(),
    listByAccountId: jest.fn(),
    sumAmountByAccountId: jest.fn(),
  });

const makePendingTransaction = (amount: number, dueDate: Date) => {
  const account = AccountDomain.create({
    name: 'Conta',
    bankName: null,
    initialBalance: 0,
  });
  const tx = FinancialTransactionDomain.create({
    account,
    type: TransactionType.EXPENSE,
    status: TransactionStatus.PENDING,
    amount,
    description: null,
    paymentMethod: PaymentMethod.PIX,
    dueDate,
    paidAt: null,
    installments: 1,
    installment: 1,
    bankStatement: null,
  });
  return tx;
};

describe('ProjectBalanceWithPendingTransactionsUseCase', () => {
  let financialTransactionPort: jest.Mocked<FinancialTransactionPort>;
  let accountPort: jest.Mocked<AccountPort>;
  let bankStatementPort: jest.Mocked<BankStatementTransactionPort>;
  let getCurrentBalanceUseCase: GetCurrentBalanceUseCase;
  let useCase: ProjectBalanceWithPendingTransactionsUseCase;

  beforeEach(() => {
    financialTransactionPort = makeFinancialTransactionPort();
    accountPort = makeAccountPort();
    bankStatementPort = makeBankStatementPort();
    getCurrentBalanceUseCase = new GetCurrentBalanceUseCase(
      accountPort,
      bankStatementPort,
    );
    useCase = new ProjectBalanceWithPendingTransactionsUseCase(
      getCurrentBalanceUseCase,
      financialTransactionPort,
    );
  });

  it('deve retornar saldo projetado subtraindo transações pendentes do mês', async () => {
    const account = AccountDomain.create({
      name: 'Conta',
      bankName: null,
      initialBalance: 5000,
    });
    accountPort.findById.mockResolvedValue(account);
    bankStatementPort.sumAmountByAccountId.mockResolvedValue(0);
    financialTransactionPort.syncRecurringTransactions.mockResolvedValue(
      undefined,
    );

    const now = new Date();
    const dueDateThisMonth = new Date(now.getFullYear(), now.getMonth(), 15);
    const pendingTx = makePendingTransaction(1000, dueDateThisMonth);
    financialTransactionPort.getPendingTransactionsByAccountId.mockResolvedValue(
      [pendingTx],
    );

    const result = await useCase.execute(ACCOUNT_UUID);

    expect(result).toBe(4000);
  });

  it('deve ignorar transações pendentes com dueDate fora do mês corrente', async () => {
    const account = AccountDomain.create({
      name: 'Conta',
      bankName: null,
      initialBalance: 5000,
    });
    accountPort.findById.mockResolvedValue(account);
    bankStatementPort.sumAmountByAccountId.mockResolvedValue(0);
    financialTransactionPort.syncRecurringTransactions.mockResolvedValue(
      undefined,
    );

    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 1);
    const pendingTx = makePendingTransaction(1000, nextMonth);
    financialTransactionPort.getPendingTransactionsByAccountId.mockResolvedValue(
      [pendingTx],
    );

    const result = await useCase.execute(ACCOUNT_UUID);

    expect(result).toBe(5000);
  });

  it('deve ignorar transações pendentes sem dueDate', async () => {
    const account = AccountDomain.create({
      name: 'Conta',
      bankName: null,
      initialBalance: 3000,
    });
    accountPort.findById.mockResolvedValue(account);
    bankStatementPort.sumAmountByAccountId.mockResolvedValue(0);
    financialTransactionPort.syncRecurringTransactions.mockResolvedValue(
      undefined,
    );

    const txNoDueDate = FinancialTransactionDomain.create({
      account,
      type: TransactionType.EXPENSE,
      status: TransactionStatus.PENDING,
      amount: 500,
      description: null,
      paymentMethod: PaymentMethod.PIX,
      dueDate: null,
      paidAt: null,
      installments: 1,
      installment: 1,
      bankStatement: null,
    });
    financialTransactionPort.getPendingTransactionsByAccountId.mockResolvedValue(
      [txNoDueDate],
    );

    const result = await useCase.execute(ACCOUNT_UUID);

    expect(result).toBe(3000);
  });

  it('deve chamar syncRecurringTransactions antes de calcular', async () => {
    const account = AccountDomain.create({
      name: 'Conta',
      bankName: null,
      initialBalance: 1000,
    });
    accountPort.findById.mockResolvedValue(account);
    bankStatementPort.sumAmountByAccountId.mockResolvedValue(0);
    financialTransactionPort.syncRecurringTransactions.mockResolvedValue(
      undefined,
    );
    financialTransactionPort.getPendingTransactionsByAccountId.mockResolvedValue(
      [],
    );

    await useCase.execute(ACCOUNT_UUID);

    expect(
      financialTransactionPort.syncRecurringTransactions,
    ).toHaveBeenCalledWith(ACCOUNT_UUID, expect.any(Date));
  });
});
