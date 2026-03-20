import { PersonIncomePort } from 'src/core/port/person-income.port';
import { PersonPort } from 'src/core/port/person.port';
import { PersonIncomeDomain } from 'src/core/domain/person-income/person-income.domain';
import { PersonDomain } from 'src/core/domain/person/person.domain';
import { RecurrenceFrequency } from 'src/core/domain/financial-transaction/dto';
import { GetPersonIncomeByPersonIdUseCase } from '../get-person-income-by-person-id.use-case';
import { FindPersonById } from 'src/application/person/find-person-by-id.use-case';

const PERSON_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const INCOME_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';

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

const makePerson = () =>
  PersonDomain.create({ id: PERSON_UUID, name: 'Gabriel', email: 'g@email.com' });

const makePersonIncome = () =>
  PersonIncomeDomain.create({
    id: INCOME_UUID,
    person: makePerson(),
    amount: 5000,
    frequency: RecurrenceFrequency.MONTHLY,
    createdAt: new Date('2024-01-01'),
  });

describe('GetPersonIncomeByPersonIdUseCase', () => {
  let personIncomePort: jest.Mocked<PersonIncomePort>;
  let personPort: jest.Mocked<PersonPort>;
  let findPersonById: FindPersonById;
  let useCase: GetPersonIncomeByPersonIdUseCase;

  beforeEach(() => {
    personIncomePort = makePersonIncomePort();
    personPort = makePersonPort();
    findPersonById = new FindPersonById(personPort);
    useCase = new GetPersonIncomeByPersonIdUseCase(personIncomePort, findPersonById);
  });

  it('deve retornar PersonIncomeDomain quando encontrado', async () => {
    personPort.findPersonById.mockResolvedValue(makePerson());
    personIncomePort.getIncomeByPersonId.mockResolvedValue(makePersonIncome());

    const result = await useCase.execute(PERSON_UUID);

    expect(result).toBeInstanceOf(PersonIncomeDomain);
    expect(result.getAmount()).toBe(5000);
    expect(personIncomePort.getIncomeByPersonId).toHaveBeenCalledWith(PERSON_UUID);
  });

  it('deve lançar erro quando pessoa não existe', async () => {
    personPort.findPersonById.mockResolvedValue(null);

    await expect(useCase.execute(PERSON_UUID)).rejects.toThrow('Person not found');
  });

  it('deve lançar erro quando renda não existe para pessoa', async () => {
    personPort.findPersonById.mockResolvedValue(makePerson());
    personIncomePort.getIncomeByPersonId.mockResolvedValue(null);

    await expect(useCase.execute(PERSON_UUID)).rejects.toThrow(
      'No income found for this person',
    );
  });
});
