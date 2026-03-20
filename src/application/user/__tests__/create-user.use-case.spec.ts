import { UserPort } from 'src/core/port/user.port';
import { UserDomain } from 'src/core/domain/user/user.domain';
import { CreateUserUseCase } from '../create-user.use-case';
import { CreateUserDTO } from 'src/infrastructure/nestjs/user/dto/create-user.dto';

const VALID_CPF = '11144477735';

const makeUserPort = (): jest.Mocked<UserPort> => ({
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  listAllUsers: jest.fn(),
  encryptPassword: jest.fn(),
  decryptPassword: jest.fn(),
  findById: jest.fn(),
});

const makeCreateUserDTO = (): CreateUserDTO => ({
  name: 'Gabriel',
  email: 'gabriel@email.com',
  document: VALID_CPF,
  password: 'senha123',
});

describe('CreateUserUseCase', () => {
  let userPort: jest.Mocked<UserPort>;
  let useCase: CreateUserUseCase;

  beforeEach(() => {
    userPort = makeUserPort();
    useCase = new CreateUserUseCase(userPort);
  });

  it('deve criar usuário quando email não existe', async () => {
    userPort.findUserByEmail.mockResolvedValue(null);
    userPort.encryptPassword.mockResolvedValue('hashed_password');
    userPort.createUser.mockResolvedValue(undefined);

    await useCase.execute(makeCreateUserDTO());

    expect(userPort.findUserByEmail).toHaveBeenCalledWith('gabriel@email.com');
    expect(userPort.encryptPassword).toHaveBeenCalledWith('senha123');
    expect(userPort.createUser).toHaveBeenCalledWith(expect.any(UserDomain));
  });

  it('deve lançar erro quando usuário já existe', async () => {
    const existingUser = UserDomain.create({
      name: 'Gabriel',
      email: 'gabriel@email.com',
      document: VALID_CPF,
      password: 'hashed',
      isActive: true,
    });
    userPort.findUserByEmail.mockResolvedValue(existingUser);

    await expect(useCase.execute(makeCreateUserDTO())).rejects.toThrow(
      'User already exists',
    );

    expect(userPort.createUser).not.toHaveBeenCalled();
  });

  it('deve usar senha criptografada ao criar usuário', async () => {
    userPort.findUserByEmail.mockResolvedValue(null);
    userPort.encryptPassword.mockResolvedValue('super_hashed');
    userPort.createUser.mockResolvedValue(undefined);

    await useCase.execute(makeCreateUserDTO());

    const createdUser = userPort.createUser.mock.calls[0][0];
    expect(createdUser.getPassword()).toBe('super_hashed');
  });
});
