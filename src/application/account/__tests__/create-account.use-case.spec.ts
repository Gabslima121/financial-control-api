import { AccountPort } from 'src/core/port/account.port';
import { UserPort } from 'src/core/port/user.port';
import { AccountDomain } from 'src/core/domain/account/account.domain';
import { UserDomain } from 'src/core/domain/user/user.domain';
import { CreateAccountUseCase } from '../create-account.use-case';
import { CreateAccountDTO } from 'src/infrastructure/nestjs/account/dto/create-account.dto';

const USER_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const VALID_CPF = '11144477735';

const makeAccountPort = (): jest.Mocked<AccountPort> => ({
  findById: jest.fn(),
  createAccount: jest.fn(),
  listAccountsByUserId: jest.fn(),
  updateAccount: jest.fn(),
  deleteAccount: jest.fn(),
});

const makeUserPort = (): jest.Mocked<UserPort> => ({
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  listAllUsers: jest.fn(),
  encryptPassword: jest.fn(),
  decryptPassword: jest.fn(),
  findById: jest.fn(),
});

const makeUser = () =>
  UserDomain.create({
    id: USER_UUID,
    name: 'Gabriel',
    document: VALID_CPF,
    email: 'gabriel@email.com',
    password: 'hashed',
    isActive: true,
  });

const makeCreateAccountDTO = (): CreateAccountDTO => ({
  name: 'Conta Principal',
  bankName: 'Nubank',
  initialBalance: 1000,
});

describe('CreateAccountUseCase', () => {
  let accountPort: jest.Mocked<AccountPort>;
  let userPort: jest.Mocked<UserPort>;
  let useCase: CreateAccountUseCase;

  beforeEach(() => {
    accountPort = makeAccountPort();
    userPort = makeUserPort();
    useCase = new CreateAccountUseCase(accountPort, userPort);
  });

  it('deve criar conta quando usuário existe', async () => {
    userPort.findById.mockResolvedValue(makeUser());
    accountPort.createAccount.mockResolvedValue(undefined);

    await useCase.execute(makeCreateAccountDTO(), USER_UUID);

    expect(userPort.findById).toHaveBeenCalledWith(USER_UUID);
    expect(accountPort.createAccount).toHaveBeenCalledWith(
      expect.any(AccountDomain),
    );
  });

  it('deve lançar erro quando usuário não é encontrado', async () => {
    userPort.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(makeCreateAccountDTO(), USER_UUID),
    ).rejects.toThrow('User not found');
  });
});
