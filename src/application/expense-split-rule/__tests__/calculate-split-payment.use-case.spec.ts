import { ExpenseSplitRulePort } from 'src/core/port/expense-split-rule.port';
import { FinancialTransactionPort } from 'src/core/port/financial-transaction.port';
import { PersonIncomePort } from 'src/core/port/person-income.port';
import { PersonPort } from 'src/core/port/person.port';
import { FinancialTransactionDomain } from 'src/core/domain/financial-transaction/financial-transaction.domain';
import { ExpenseSplitRuleDomain } from 'src/core/domain/expense-split-rule/expense-split-rule.domain';
import { PersonIncomeDomain } from 'src/core/domain/person-income/person-income.domain';
import { PersonDomain } from 'src/core/domain/person/person.domain';
import { AccountDomain } from 'src/core/domain/account/account.domain';
import { ExpenseSplitType } from 'src/core/domain/expense-split-rule/dto';
import {
  PaymentMethod,
  RecurrenceFrequency,
  TransactionStatus,
  TransactionType,
} from 'src/core/domain/financial-transaction/dto';
import { CalculateSplitPaymentUseCase } from '../calculate-split-payment.use-case';
import { FindPersonById } from 'src/application/person/find-person-by-id.use-case';
import { GetPersonIncomeByPersonIdUseCase } from 'src/application/person-income/get-person-income-by-person-id.use-case';

const TX_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const RULE_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';
const ACCOUNT_UUID = 'c3d4e5f6-a7b8-4901-acde-f12345678901';
const PERSON_UUID_1 = 'd4e5f6a7-b8c9-4012-bdef-012345678902';
const PERSON_UUID_2 = 'e5f6a7b8-c9d0-4123-8ef0-123456789012';

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

const makeExpenseSplitRulePort = (): jest.Mocked<ExpenseSplitRulePort> => ({
  create: jest.fn(),
  findById: jest.fn(),
  listByAccountId: jest.fn(),
  findActiveByRecurrenceGroupId: jest.fn(),
  findActiveByTransactionId: jest.fn(),
});

const makePersonIncomePort = (): jest.Mocked<PersonIncomePort> => ({
  createPersonIncome: jest.fn(),
  getIncomeByPersonId: jest.fn(),
  getIncomeById: jest.fn(),
});

const makePersonPort = (): jest.Mocked<PersonPort> => ({
  createPerson: jest.fn(),
  listPeople: jest.fn(),
  findPersonById: jest.fn(),
});

const makeTransaction = (amount = 3000) =>
  FinancialTransactionDomain.create({
    id: TX_UUID,
    account: AccountDomain.create({ id: ACCOUNT_UUID, name: 'Conta', bankName: null, initialBalance: 0 }),
    type: TransactionType.EXPENSE,
    status: TransactionStatus.PENDING,
    amount,
    description: 'Aluguel',
    paymentMethod: PaymentMethod.PIX,
    dueDate: new Date('2024-03-10'),
    paidAt: null,
    installments: 1,
    installment: 1,
    bankStatement: null,
  });

const makeProportionalRule = () =>
  ExpenseSplitRuleDomain.create({
    id: RULE_UUID,
    accountId: ACCOUNT_UUID,
    name: 'Regra Aluguel',
    type: ExpenseSplitType.PROPORTIONAL_INCOME,
    participants: [
      {
        personId: PERSON_UUID_1,
        person: PersonDomain.create({ id: PERSON_UUID_1, name: 'Gabriel', email: 'g@email.com' }),
      },
      {
        personId: PERSON_UUID_2,
        person: PersonDomain.create({ id: PERSON_UUID_2, name: 'Ana', email: 'a@email.com' }),
      },
    ],
    recurrenceGroupId: null,
    transactionId: null,
    isActive: true,
  });

const makeFixedPercentRule = () =>
  ExpenseSplitRuleDomain.create({
    id: RULE_UUID,
    accountId: ACCOUNT_UUID,
    name: 'Regra %',
    type: ExpenseSplitType.FIXED_PERCENT,
    participants: [
      {
        personId: PERSON_UUID_1,
        person: PersonDomain.create({ id: PERSON_UUID_1, name: 'Gabriel', email: 'g@email.com' }),
        fixedPercent: 0.6,
      },
      {
        personId: PERSON_UUID_2,
        person: PersonDomain.create({ id: PERSON_UUID_2, name: 'Ana', email: 'a@email.com' }),
        fixedPercent: 0.4,
      },
    ],
    recurrenceGroupId: null,
    transactionId: null,
    isActive: true,
  });

const makeFixedAmountRule = () =>
  ExpenseSplitRuleDomain.create({
    id: RULE_UUID,
    accountId: ACCOUNT_UUID,
    name: 'Regra Valor',
    type: ExpenseSplitType.FIXED_AMOUNT,
    participants: [
      {
        personId: PERSON_UUID_1,
        person: PersonDomain.create({ id: PERSON_UUID_1, name: 'Gabriel', email: 'g@email.com' }),
        fixedAmount: 2000,
      },
      {
        personId: PERSON_UUID_2,
        person: PersonDomain.create({ id: PERSON_UUID_2, name: 'Ana', email: 'a@email.com' }),
        fixedAmount: 1000,
      },
    ],
    recurrenceGroupId: null,
    transactionId: null,
    isActive: true,
  });

const makePersonIncome = (personId: string, amount: number) =>
  PersonIncomeDomain.create({
    person: PersonDomain.create({ id: personId, name: 'P', email: 'p@p.com' }),
    amount,
    frequency: RecurrenceFrequency.MONTHLY,
    createdAt: null,
  });

describe('CalculateSplitPaymentUseCase', () => {
  let financialTransactionPort: jest.Mocked<FinancialTransactionPort>;
  let expenseSplitRulePort: jest.Mocked<ExpenseSplitRulePort>;
  let personIncomePort: jest.Mocked<PersonIncomePort>;
  let personPort: jest.Mocked<PersonPort>;
  let getPersonIncomeByPersonId: GetPersonIncomeByPersonIdUseCase;
  let useCase: CalculateSplitPaymentUseCase;

  beforeEach(() => {
    financialTransactionPort = makeFinancialTransactionPort();
    expenseSplitRulePort = makeExpenseSplitRulePort();
    personIncomePort = makePersonIncomePort();
    personPort = makePersonPort();

    const findPersonById = new FindPersonById(personPort);
    getPersonIncomeByPersonId = new GetPersonIncomeByPersonIdUseCase(
      personIncomePort,
      findPersonById,
    );

    useCase = new CalculateSplitPaymentUseCase(
      financialTransactionPort,
      expenseSplitRulePort,
      getPersonIncomeByPersonId,
    );
  });

  it('deve lançar erro quando transação não existe', async () => {
    financialTransactionPort.findById.mockResolvedValue(null);
    expenseSplitRulePort.findById.mockResolvedValue(makeProportionalRule());

    await expect(useCase.execute(RULE_UUID, TX_UUID)).rejects.toThrow(
      'Transação não encontrada.',
    );
  });

  it('deve lançar erro quando regra não existe', async () => {
    financialTransactionPort.findById.mockResolvedValue(makeTransaction());
    expenseSplitRulePort.findById.mockResolvedValue(null);

    await expect(useCase.execute(RULE_UUID, TX_UUID)).rejects.toThrow(
      'Regra de divisão não encontrada.',
    );
  });

  describe('PROPORTIONAL_INCOME', () => {
    it('deve calcular split proporcional pelo salário', async () => {
      financialTransactionPort.findById.mockResolvedValue(makeTransaction(3000));
      expenseSplitRulePort.findById.mockResolvedValue(makeProportionalRule());

      personPort.findPersonById
        .mockResolvedValueOnce(
          PersonDomain.create({ id: PERSON_UUID_1, name: 'Gabriel', email: 'g@email.com' }),
        )
        .mockResolvedValueOnce(
          PersonDomain.create({ id: PERSON_UUID_2, name: 'Ana', email: 'a@email.com' }),
        );

      personIncomePort.getIncomeByPersonId
        .mockResolvedValueOnce(makePersonIncome(PERSON_UUID_1, 4000))
        .mockResolvedValueOnce(makePersonIncome(PERSON_UUID_2, 2000));

      const result = await useCase.execute(RULE_UUID, TX_UUID);

      expect(result.totalAmount).toBe(3000);
      expect(result.splits).toHaveLength(2);
      expect(result.splits[0].amount).toBe(2000);
      expect(result.splits[1].amount).toBe(1000);
      expect(result.ruleType).toBe(ExpenseSplitType.PROPORTIONAL_INCOME);
    });
  });

  describe('FIXED_PERCENT', () => {
    it('deve calcular split por percentual fixo', async () => {
      financialTransactionPort.findById.mockResolvedValue(makeTransaction(3000));
      expenseSplitRulePort.findById.mockResolvedValue(makeFixedPercentRule());

      const result = await useCase.execute(RULE_UUID, TX_UUID);

      expect(result.splits[0].amount).toBe(1800);
      expect(result.splits[1].amount).toBe(1200);
      expect(result.ruleType).toBe(ExpenseSplitType.FIXED_PERCENT);
    });
  });

  describe('FIXED_AMOUNT', () => {
    it('deve calcular split por valor fixo', async () => {
      financialTransactionPort.findById.mockResolvedValue(makeTransaction(3000));
      expenseSplitRulePort.findById.mockResolvedValue(makeFixedAmountRule());

      const result = await useCase.execute(RULE_UUID, TX_UUID);

      expect(result.splits[0].amount).toBe(2000);
      expect(result.splits[1].amount).toBe(1000);
      expect(result.ruleType).toBe(ExpenseSplitType.FIXED_AMOUNT);
    });
  });

  it('deve retornar metadados da transação e da regra', async () => {
    financialTransactionPort.findById.mockResolvedValue(makeTransaction(3000));
    expenseSplitRulePort.findById.mockResolvedValue(makeFixedAmountRule());

    const result = await useCase.execute(RULE_UUID, TX_UUID);

    expect(result.transactionId).toBe(TX_UUID);
    expect(result.transactionDescription).toBe('Aluguel');
    expect(result.ruleName).toBe('Regra Valor');
  });
});
