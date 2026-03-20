import { AccountPort } from 'src/core/port/account.port';
import { ExpenseSplitRulePort } from 'src/core/port/expense-split-rule.port';
import { AccountDomain } from 'src/core/domain/account/account.domain';
import { ExpenseSplitRuleDomain } from 'src/core/domain/expense-split-rule/expense-split-rule.domain';
import { ExpenseSplitType } from 'src/core/domain/expense-split-rule/dto';
import { ListExpenseSplitRulesByAccountIdUseCase } from '../list-expense-split-rules-by-account-id.use-case';

const ACCOUNT_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';
const RULE_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';

const makeAccountPort = (): jest.Mocked<AccountPort> => ({
  findById: jest.fn(),
  createAccount: jest.fn(),
  listAccountsByUserId: jest.fn(),
  updateAccount: jest.fn(),
  deleteAccount: jest.fn(),
});

const makeExpenseSplitRulePort = (): jest.Mocked<ExpenseSplitRulePort> => ({
  create: jest.fn(),
  findById: jest.fn(),
  listByAccountId: jest.fn(),
  findActiveByRecurrenceGroupId: jest.fn(),
  findActiveByTransactionId: jest.fn(),
});

const makeAccount = () =>
  AccountDomain.create({
    id: ACCOUNT_UUID,
    name: 'Conta',
    bankName: null,
    initialBalance: 0,
  });

const makeRule = () =>
  ExpenseSplitRuleDomain.create({
    id: RULE_UUID,
    accountId: ACCOUNT_UUID,
    name: 'Regra Aluguel',
    type: ExpenseSplitType.PROPORTIONAL_INCOME,
    participants: [],
    recurrenceGroupId: null,
    transactionId: null,
    isActive: true,
  });

describe('ListExpenseSplitRulesByAccountIdUseCase', () => {
  let accountPort: jest.Mocked<AccountPort>;
  let expenseSplitRulePort: jest.Mocked<ExpenseSplitRulePort>;
  let useCase: ListExpenseSplitRulesByAccountIdUseCase;

  beforeEach(() => {
    accountPort = makeAccountPort();
    expenseSplitRulePort = makeExpenseSplitRulePort();
    useCase = new ListExpenseSplitRulesByAccountIdUseCase(
      expenseSplitRulePort,
      accountPort,
    );
  });

  it('deve retornar lista de regras quando conta existe', async () => {
    accountPort.findById.mockResolvedValue(makeAccount());
    expenseSplitRulePort.listByAccountId.mockResolvedValue([makeRule()]);

    const result = await useCase.execute(ACCOUNT_UUID);

    expect(result).toHaveLength(1);
    expect(expenseSplitRulePort.listByAccountId).toHaveBeenCalledWith(
      ACCOUNT_UUID,
    );
  });

  it('deve lançar NotFoundException quando conta não existe', async () => {
    accountPort.findById.mockResolvedValue(null);

    await expect(useCase.execute(ACCOUNT_UUID)).rejects.toThrow(
      'Conta não encontrada.',
    );

    expect(expenseSplitRulePort.listByAccountId).not.toHaveBeenCalled();
  });

  it('deve retornar lista vazia quando não há regras', async () => {
    accountPort.findById.mockResolvedValue(makeAccount());
    expenseSplitRulePort.listByAccountId.mockResolvedValue([]);

    const result = await useCase.execute(ACCOUNT_UUID);

    expect(result).toHaveLength(0);
  });
});
