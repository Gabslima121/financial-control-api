import { PersonIncomePort } from 'src/core/port/person-income.port';
import { PersonIncomeDomain } from 'src/core/domain/person-income/person-income.domain';
import { PersonDomain } from 'src/core/domain/person/person.domain';
import { RecurrenceFrequency } from 'src/core/domain/financial-transaction/dto';
import { GetPersonIncomeByIdUseCase } from '../get-person-income-by-id.use-case';

const INCOME_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const PERSON_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';

const makePersonIncomePort = (): jest.Mocked<PersonIncomePort> => ({
  createPersonIncome: jest.fn(),
  getIncomeByPersonId: jest.fn(),
  getIncomeById: jest.fn(),
});

const makePersonIncome = () =>
  PersonIncomeDomain.create({
    id: INCOME_UUID,
    person: PersonDomain.create({
      id: PERSON_UUID,
      name: 'Gabriel',
      email: 'g@email.com',
    }),
    amount: 5000,
    frequency: RecurrenceFrequency.MONTHLY,
    createdAt: new Date('2024-01-01'),
  });

describe('GetPersonIncomeByIdUseCase', () => {
  let personIncomePort: jest.Mocked<PersonIncomePort>;
  let useCase: GetPersonIncomeByIdUseCase;

  beforeEach(() => {
    personIncomePort = makePersonIncomePort();
    useCase = new GetPersonIncomeByIdUseCase(personIncomePort);
  });

  it('deve retornar PersonIncomeDomain quando encontrado', async () => {
    personIncomePort.getIncomeById.mockResolvedValue(makePersonIncome());

    const result = await useCase.execute(INCOME_UUID);

    expect(result).toBeInstanceOf(PersonIncomeDomain);
    expect(result.getAmount()).toBe(5000);
    expect(personIncomePort.getIncomeById).toHaveBeenCalledWith(INCOME_UUID);
  });

  it('deve lançar NotFoundException quando não encontrado', async () => {
    personIncomePort.getIncomeById.mockResolvedValue(null);

    await expect(useCase.execute(INCOME_UUID)).rejects.toThrow(
      'No income found',
    );
  });
});
