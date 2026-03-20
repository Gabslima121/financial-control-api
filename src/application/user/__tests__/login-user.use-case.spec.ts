import { AccountPort } from 'src/core/port/account.port';
import { UserPort } from 'src/core/port/user.port';
import { TokenValidatorPort } from 'src/core/port/token-validator.port';
import { UserDomain } from 'src/core/domain/user/user.domain';
import { AccountDomain } from 'src/core/domain/account/account.domain';
import { LoginUserUseCase } from '../login-user.use-case';

const USER_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const ACCOUNT_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';
const VALID_CPF = '11144477735';

const makeUserPort = (): jest.Mocked<UserPort> => ({
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  listAllUsers: jest.fn(),
  encryptPassword: jest.fn(),
  decryptPassword: jest.fn(),
  findById: jest.fn(),
});

const makeAccountPort = (): jest.Mocked<AccountPort> => ({
  findById: jest.fn(),
  createAccount: jest.fn(),
  listAccountsByUserId: jest.fn(),
  updateAccount: jest.fn(),
  deleteAccount: jest.fn(),
});

const makeTokenPort = (): jest.Mocked<TokenValidatorPort> => ({
  validateToken: jest.fn(),
  createToken: jest.fn(),
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

const makeAccount = () =>
  AccountDomain.create({
    id: ACCOUNT_UUID,
    name: 'Conta',
    bankName: null,
    initialBalance: 0,
  });

describe('LoginUserUseCase', () => {
  let userPort: jest.Mocked<UserPort>;
  let accountPort: jest.Mocked<AccountPort>;
  let tokenPort: jest.Mocked<TokenValidatorPort>;
  let useCase: LoginUserUseCase;

  beforeEach(() => {
    userPort = makeUserPort();
    accountPort = makeAccountPort();
    tokenPort = makeTokenPort();
    useCase = new LoginUserUseCase(userPort, tokenPort, accountPort);
  });

  it('deve retornar token quando credenciais são válidas', async () => {
    userPort.findUserByEmail.mockResolvedValue(makeUser());
    userPort.decryptPassword.mockResolvedValue(true);
    accountPort.listAccountsByUserId.mockResolvedValue([makeAccount()]);
    tokenPort.createToken.mockResolvedValue('jwt_token');

    const result = await useCase.execute('gabriel@email.com', 'senha123');

    expect(result).toEqual({ token: 'jwt_token' });
    expect(tokenPort.createToken).toHaveBeenCalledWith({
      id: USER_UUID,
      accountId: ACCOUNT_UUID,
    });
  });

  it('deve lançar erro quando usuário não é encontrado', async () => {
    userPort.findUserByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute('naoexiste@email.com', 'senha123'),
    ).rejects.toThrow('User not found');
  });

  it('deve lançar erro quando senha é inválida', async () => {
    userPort.findUserByEmail.mockResolvedValue(makeUser());
    userPort.decryptPassword.mockResolvedValue(false);

    await expect(
      useCase.execute('gabriel@email.com', 'senhaerrada'),
    ).rejects.toThrow('Invalid password');
  });

  it('deve lançar erro quando lista de contas é null', async () => {
    userPort.findUserByEmail.mockResolvedValue(makeUser());
    userPort.decryptPassword.mockResolvedValue(true);
    accountPort.listAccountsByUserId.mockResolvedValue(null);

    await expect(
      useCase.execute('gabriel@email.com', 'senha123'),
    ).rejects.toThrow('Account not found');
  });

  it('deve lançar erro quando lista de contas está vazia', async () => {
    userPort.findUserByEmail.mockResolvedValue(makeUser());
    userPort.decryptPassword.mockResolvedValue(true);
    accountPort.listAccountsByUserId.mockResolvedValue([]);

    await expect(
      useCase.execute('gabriel@email.com', 'senha123'),
    ).rejects.toThrow('Account not found');
  });
});
