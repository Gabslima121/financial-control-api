import { ExpenseSplitRulePort } from 'src/core/port/expense-split-rule.port';
import { ExpenseSplitRuleDomain } from 'src/core/domain/expense-split-rule/expense-split-rule.domain';
import { ExpenseSplitType } from 'src/core/domain/expense-split-rule/dto';
import { GetExpenseSplitRuleByIdUseCase } from '../get-expense-split-rule-by-id.use-case';

const RULE_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const ACCOUNT_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';

const makeExpenseSplitRulePort = (): jest.Mocked<ExpenseSplitRulePort> => ({
  create: jest.fn(),
  findById: jest.fn(),
  listByAccountId: jest.fn(),
  findActiveByRecurrenceGroupId: jest.fn(),
  findActiveByTransactionId: jest.fn(),
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

describe('GetExpenseSplitRuleByIdUseCase', () => {
  let expenseSplitRulePort: jest.Mocked<ExpenseSplitRulePort>;
  let useCase: GetExpenseSplitRuleByIdUseCase;

  beforeEach(() => {
    expenseSplitRulePort = makeExpenseSplitRulePort();
    useCase = new GetExpenseSplitRuleByIdUseCase(expenseSplitRulePort);
  });

  it('deve retornar ExpenseSplitRuleDomain quando encontrado', async () => {
    expenseSplitRulePort.findById.mockResolvedValue(makeRule());

    const result = await useCase.execute(RULE_UUID);

    expect(result).toBeInstanceOf(ExpenseSplitRuleDomain);
    expect(result.getName()).toBe('Regra Aluguel');
    expect(expenseSplitRulePort.findById).toHaveBeenCalledWith(RULE_UUID);
  });

  it('deve lançar NotFoundException quando não encontrado', async () => {
    expenseSplitRulePort.findById.mockResolvedValue(null);

    await expect(useCase.execute(RULE_UUID)).rejects.toThrow(
      'Regra de rateio não encontrada.',
    );
  });
});
