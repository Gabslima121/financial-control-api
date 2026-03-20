import { AccountPort } from 'src/core/port/account.port';
import { ExpenseSplitRulePort } from 'src/core/port/expense-split-rule.port';
import { PersonPort } from 'src/core/port/person.port';
import { AccountDomain } from 'src/core/domain/account/account.domain';
import { PersonDomain } from 'src/core/domain/person/person.domain';
import { ExpenseSplitType } from 'src/core/domain/expense-split-rule/dto';
import { CreateExpenseSplitRuleUseCase } from '../create-expense-split-rule.use-case';
import { CreateExpenseSplitRuleDTO } from 'src/infrastructure/nestjs/expense-split-rule/dto/create-expense-split-rule.dto';

const ACCOUNT_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';
const PERSON_UUID_1 = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const PERSON_UUID_2 = 'c3d4e5f6-a7b8-4901-acde-f12345678901';

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

const makePersonPort = (): jest.Mocked<PersonPort> => ({
  createPerson: jest.fn(),
  listPeople: jest.fn(),
  findPersonById: jest.fn(),
});

const makeAccount = () =>
  AccountDomain.create({
    id: ACCOUNT_UUID,
    name: 'Conta',
    bankName: null,
    initialBalance: 0,
  });

const makePerson = (id: string, name: string) =>
  PersonDomain.create({ id, name, email: `${name.toLowerCase()}@email.com` });

const makeProportionalDTO = (): CreateExpenseSplitRuleDTO => ({
  name: 'Regra Aluguel',
  type: ExpenseSplitType.PROPORTIONAL_INCOME,
  participants: [{ personId: PERSON_UUID_1 }, { personId: PERSON_UUID_2 }],
});

describe('CreateExpenseSplitRuleUseCase', () => {
  let accountPort: jest.Mocked<AccountPort>;
  let expenseSplitRulePort: jest.Mocked<ExpenseSplitRulePort>;
  let personPort: jest.Mocked<PersonPort>;
  let useCase: CreateExpenseSplitRuleUseCase;

  beforeEach(() => {
    accountPort = makeAccountPort();
    expenseSplitRulePort = makeExpenseSplitRulePort();
    personPort = makePersonPort();
    useCase = new CreateExpenseSplitRuleUseCase(
      expenseSplitRulePort,
      accountPort,
      personPort,
    );
  });

  it('deve criar regra proporcional com 2 participantes', async () => {
    accountPort.findById.mockResolvedValue(makeAccount());
    personPort.findPersonById
      .mockResolvedValueOnce(makePerson(PERSON_UUID_1, 'Gabriel'))
      .mockResolvedValueOnce(makePerson(PERSON_UUID_2, 'Ana'));
    expenseSplitRulePort.create.mockResolvedValue(undefined);

    await useCase.execute(makeProportionalDTO(), ACCOUNT_UUID);

    expect(expenseSplitRulePort.create).toHaveBeenCalledTimes(1);
  });

  it('deve lançar NotFoundException quando conta não existe', async () => {
    accountPort.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(makeProportionalDTO(), ACCOUNT_UUID),
    ).rejects.toThrow('Conta não encontrada.');

    expect(expenseSplitRulePort.create).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando há menos de 2 participantes', async () => {
    accountPort.findById.mockResolvedValue(makeAccount());
    personPort.findPersonById.mockResolvedValue(
      makePerson(PERSON_UUID_1, 'Gabriel'),
    );

    const dto: CreateExpenseSplitRuleDTO = {
      name: 'Regra',
      type: ExpenseSplitType.PROPORTIONAL_INCOME,
      participants: [{ personId: PERSON_UUID_1 }],
    };

    await expect(useCase.execute(dto, ACCOUNT_UUID)).rejects.toThrow(
      'A regra precisa ter pelo menos 2 participantes',
    );
  });

  it('deve lançar erro quando percentuais fixed_percent não somam 1', async () => {
    accountPort.findById.mockResolvedValue(makeAccount());
    personPort.findPersonById
      .mockResolvedValueOnce(makePerson(PERSON_UUID_1, 'Gabriel'))
      .mockResolvedValueOnce(makePerson(PERSON_UUID_2, 'Ana'));

    const dto: CreateExpenseSplitRuleDTO = {
      name: 'Regra %',
      type: ExpenseSplitType.FIXED_PERCENT,
      participants: [
        { personId: PERSON_UUID_1, fixedPercent: 0.4 },
        { personId: PERSON_UUID_2, fixedPercent: 0.4 },
      ],
    };

    await expect(useCase.execute(dto, ACCOUNT_UUID)).rejects.toThrow(
      'Somatório de fixedPercent deve ser 1.0',
    );
  });

  it('deve lançar erro quando fixed_amount não tem valor definido', async () => {
    accountPort.findById.mockResolvedValue(makeAccount());
    personPort.findPersonById
      .mockResolvedValueOnce(makePerson(PERSON_UUID_1, 'Gabriel'))
      .mockResolvedValueOnce(makePerson(PERSON_UUID_2, 'Ana'));

    const dto: CreateExpenseSplitRuleDTO = {
      name: 'Regra Valor',
      type: ExpenseSplitType.FIXED_AMOUNT,
      participants: [{ personId: PERSON_UUID_1 }, { personId: PERSON_UUID_2 }],
    };

    await expect(useCase.execute(dto, ACCOUNT_UUID)).rejects.toThrow(
      'fixedAmount é obrigatório para split do tipo fixed_amount',
    );
  });

  it('deve criar regra fixed_percent quando percentuais somam 1', async () => {
    accountPort.findById.mockResolvedValue(makeAccount());
    personPort.findPersonById
      .mockResolvedValueOnce(makePerson(PERSON_UUID_1, 'Gabriel'))
      .mockResolvedValueOnce(makePerson(PERSON_UUID_2, 'Ana'));
    expenseSplitRulePort.create.mockResolvedValue(undefined);

    const dto: CreateExpenseSplitRuleDTO = {
      name: 'Regra %',
      type: ExpenseSplitType.FIXED_PERCENT,
      participants: [
        { personId: PERSON_UUID_1, fixedPercent: 0.6 },
        { personId: PERSON_UUID_2, fixedPercent: 0.4 },
      ],
    };

    await useCase.execute(dto, ACCOUNT_UUID);

    expect(expenseSplitRulePort.create).toHaveBeenCalledTimes(1);
  });
});
