import { AccountPort } from 'src/core/port/account.port';
import { BankStatementTransactionPort } from 'src/core/port/bank-statement-transaction.port';
import { AccountDomain } from 'src/core/domain/account/account.domain';
import { GetCurrentBalanceUseCase } from '../get-current-balance.use-case';

const ACCOUNT_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';

const makeAccountPort = (): jest.Mocked<AccountPort> => ({
  findById: jest.fn(),
  createAccount: jest.fn(),
  listAccountsByUserId: jest.fn(),
  updateAccount: jest.fn(),
  deleteAccount: jest.fn(),
});

const makeBankStatementPort = (): jest.Mocked<BankStatementTransactionPort> => ({
  create: jest.fn(),
  findByFitId: jest.fn(),
  listByAccountId: jest.fn(),
  sumAmountByAccountId: jest.fn(),
});

const makeAccount = (initialBalance = 1000) =>
  AccountDomain.create({ name: 'Conta', bankName: null, initialBalance });

describe('GetCurrentBalanceUseCase', () => {
  let accountPort: jest.Mocked<AccountPort>;
  let bankStatementPort: jest.Mocked<BankStatementTransactionPort>;
  let useCase: GetCurrentBalanceUseCase;

  beforeEach(() => {
    accountPort = makeAccountPort();
    bankStatementPort = makeBankStatementPort();
    useCase = new GetCurrentBalanceUseCase(accountPort, bankStatementPort);
  });

  it('deve retornar initialBalance + soma do extrato', async () => {
    accountPort.findById.mockResolvedValue(makeAccount(1000));
    bankStatementPort.sumAmountByAccountId.mockResolvedValue(500);

    const result = await useCase.execute(ACCOUNT_UUID);

    expect(result).toBe(1500);
  });

  it('deve retornar apenas o initialBalance quando extrato é zero', async () => {
    accountPort.findById.mockResolvedValue(makeAccount(2000));
    bankStatementPort.sumAmountByAccountId.mockResolvedValue(0);

    const result = await useCase.execute(ACCOUNT_UUID);

    expect(result).toBe(2000);
  });

  it('deve lançar erro quando conta não é encontrada', async () => {
    accountPort.findById.mockResolvedValue(null);

    await expect(useCase.execute(ACCOUNT_UUID)).rejects.toThrow('Account not found');
  });
});
