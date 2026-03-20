import { PersonPort } from 'src/core/port/person.port';
import { CreatePersonUseCase } from '../create-person.use-case';
import { CreatePersonDTO } from 'src/infrastructure/nestjs/person/dto/create-person.dto';

const makePersonPort = (): jest.Mocked<PersonPort> => ({
  createPerson: jest.fn(),
  listPeople: jest.fn(),
  findPersonById: jest.fn(),
});

const makeCreatePersonDTO = (): CreatePersonDTO => ({
  name: 'Gabriel',
  email: 'gabriel@email.com',
});

describe('CreatePersonUseCase', () => {
  let personPort: jest.Mocked<PersonPort>;
  let useCase: CreatePersonUseCase;

  beforeEach(() => {
    personPort = makePersonPort();
    useCase = new CreatePersonUseCase(personPort);
  });

  it('deve chamar personPort.createPerson com domínio correto', async () => {
    personPort.createPerson.mockResolvedValue(undefined);

    await useCase.execute(makeCreatePersonDTO());

    expect(personPort.createPerson).toHaveBeenCalledTimes(1);
    const calledWith = personPort.createPerson.mock.calls[0][0];
    expect(calledWith.getName()).toBe('Gabriel');
    expect(calledWith.getEmail()).toBe('gabriel@email.com');
  });

  it('deve chamar createPerson uma única vez', async () => {
    personPort.createPerson.mockResolvedValue(undefined);

    await useCase.execute(makeCreatePersonDTO());

    expect(personPort.createPerson).toHaveBeenCalledTimes(1);
  });
});
