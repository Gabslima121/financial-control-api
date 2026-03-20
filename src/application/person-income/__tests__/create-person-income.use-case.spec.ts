import { PersonIncomePort } from 'src/core/port/person-income.port';
import { PersonPort } from 'src/core/port/person.port';
import { PersonDomain } from 'src/core/domain/person/person.domain';
import { RecurrenceFrequency } from 'src/core/domain/financial-transaction/dto';
import { CreatePersonIncomeUseCase } from '../create-person-income.use-case';
import { FindPersonById } from 'src/application/person/find-person-by-id.use-case';
import { CreatePersonIncomeDTO } from 'src/infrastructure/nestjs/person-income/dto/create-person-income.dto';

const PERSON_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';

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
  PersonDomain.create({
    id: PERSON_UUID,
    name: 'Gabriel',
    email: 'gabriel@email.com',
  });

const makeCreatePersonIncomeDTO = (): CreatePersonIncomeDTO => ({
  personId: PERSON_UUID,
  amount: 5000,
  frequency: RecurrenceFrequency.MONTHLY,
});

describe('CreatePersonIncomeUseCase', () => {
  let personIncomePort: jest.Mocked<PersonIncomePort>;
  let personPort: jest.Mocked<PersonPort>;
  let findPersonById: FindPersonById;
  let useCase: CreatePersonIncomeUseCase;

  beforeEach(() => {
    personIncomePort = makePersonIncomePort();
    personPort = makePersonPort();
    findPersonById = new FindPersonById(personPort);
    useCase = new CreatePersonIncomeUseCase(personIncomePort, findPersonById);
  });

  it('deve criar renda quando pessoa existe', async () => {
    personPort.findPersonById.mockResolvedValue(makePerson());
    personIncomePort.createPersonIncome.mockResolvedValue(undefined);

    await useCase.execute(makeCreatePersonIncomeDTO());

    expect(personPort.findPersonById).toHaveBeenCalledWith(PERSON_UUID);
    expect(personIncomePort.createPersonIncome).toHaveBeenCalledTimes(1);
    const created = personIncomePort.createPersonIncome.mock.calls[0][0];
    expect(created.getAmount()).toBe(5000);
  });

  it('deve lançar erro quando pessoa não existe', async () => {
    personPort.findPersonById.mockResolvedValue(null);

    await expect(useCase.execute(makeCreatePersonIncomeDTO())).rejects.toThrow(
      'Person not found',
    );

    expect(personIncomePort.createPersonIncome).not.toHaveBeenCalled();
  });
});
