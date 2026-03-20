import { PersonPort } from 'src/core/port/person.port';
import { PersonDomain } from 'src/core/domain/person/person.domain';
import { FindPersonById } from '../find-person-by-id.use-case';

const PERSON_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';

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

describe('FindPersonById', () => {
  let personPort: jest.Mocked<PersonPort>;
  let useCase: FindPersonById;

  beforeEach(() => {
    personPort = makePersonPort();
    useCase = new FindPersonById(personPort);
  });

  it('deve retornar PersonDomain quando encontrado', async () => {
    personPort.findPersonById.mockResolvedValue(makePerson());

    const result = await useCase.execute(PERSON_UUID);

    expect(result).toBeInstanceOf(PersonDomain);
    expect(result.getId()).toBe(PERSON_UUID);
    expect(personPort.findPersonById).toHaveBeenCalledWith(PERSON_UUID);
  });

  it('deve lançar NotFoundException quando não encontrado', async () => {
    personPort.findPersonById.mockResolvedValue(null);

    await expect(useCase.execute(PERSON_UUID)).rejects.toThrow('Person not found');
  });
});
