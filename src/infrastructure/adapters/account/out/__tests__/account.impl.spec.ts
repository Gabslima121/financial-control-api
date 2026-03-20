import { PrismaClient } from '@prisma/client';
import { AccountDomain } from 'src/core/domain/account/account.domain';
import { UserDomain } from 'src/core/domain/user/user.domain';
import { AccountRepository } from '../account.impl';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const USER_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';
const VALID_CPF = '11144477735';

const prismaUser = {
  id: USER_UUID,
  name: 'Gabriel',
  document: VALID_CPF,
  email: 'gabriel@email.com',
  password: 'hashed',
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
};

const prismaAccount = {
  id: VALID_UUID,
  name: 'Conta Principal',
  bankName: 'Nubank',
  initialBalance: 1000,
  createdAt: new Date('2024-01-01'),
  userId: USER_UUID,
  user: prismaUser,
};

const makePrisma = () =>
  ({
    account: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }) as unknown as PrismaClient;

const makeUser = () =>
  UserDomain.create({
    id: USER_UUID,
    name: 'Gabriel',
    document: VALID_CPF,
    email: 'gabriel@email.com',
    password: 'hashed',
    isActive: true,
  });

describe('AccountRepository', () => {
  let prisma: ReturnType<typeof makePrisma>;
  let repo: AccountRepository;

  beforeEach(() => {
    prisma = makePrisma();
    repo = new AccountRepository(prisma);
  });

  describe('createAccount()', () => {
    it('deve chamar prisma.account.create com os dados corretos', async () => {
      (prisma.account.create as jest.Mock).mockResolvedValue(undefined);
      const account = AccountDomain.create({
        id: VALID_UUID,
        name: 'Conta Principal',
        bankName: 'Nubank',
        initialBalance: 1000,
        user: makeUser(),
      });

      await repo.createAccount(account);

      expect(prisma.account.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            id: VALID_UUID,
            userId: USER_UUID,
            name: 'Conta Principal',
          }),
        }),
      );
    });

    it('deve lançar erro quando user é nulo', async () => {
      const account = AccountDomain.create({
        id: VALID_UUID,
        name: 'Conta',
        bankName: null,
        initialBalance: 0,
        user: null,
      });

      await expect(repo.createAccount(account)).rejects.toThrow(
        'User is required to create an account',
      );
    });
  });

  describe('findById()', () => {
    it('deve retornar AccountDomain quando encontrado', async () => {
      (prisma.account.findUnique as jest.Mock).mockResolvedValue(prismaAccount);

      const result = await repo.findById(VALID_UUID);

      expect(result).toBeInstanceOf(AccountDomain);
      expect(result!.getId()).toBe(VALID_UUID);
      expect(result!.getName()).toBe('Conta Principal');
      expect(result!.getBankName()).toBe('Nubank');
      expect(result!.getInitialBalance()).toBe(1000);
      expect(prisma.account.findUnique).toHaveBeenCalledWith({
        where: { id: VALID_UUID },
        include: { user: true },
      });
    });

    it('deve retornar null quando não encontrado', async () => {
      (prisma.account.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repo.findById(VALID_UUID);

      expect(result).toBeNull();
    });

    it('deve mapear user corretamente', async () => {
      (prisma.account.findUnique as jest.Mock).mockResolvedValue(prismaAccount);

      const result = await repo.findById(VALID_UUID);

      expect(result!.getUser()).toBeInstanceOf(UserDomain);
      expect(result!.getUser()!.getId()).toBe(USER_UUID);
    });
  });

  describe('listAccountsByUserId()', () => {
    it('deve retornar lista de AccountDomain', async () => {
      (prisma.account.findMany as jest.Mock).mockResolvedValue([prismaAccount]);

      const result = await repo.listAccountsByUserId(USER_UUID);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(AccountDomain);
    });

    it('deve retornar lista vazia', async () => {
      (prisma.account.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repo.listAccountsByUserId(USER_UUID);

      expect(result).toHaveLength(0);
    });
  });

  describe('updateAccount()', () => {
    it('deve chamar prisma.account.update com os dados corretos', async () => {
      (prisma.account.update as jest.Mock).mockResolvedValue(undefined);
      const account = AccountDomain.create({
        id: VALID_UUID,
        name: 'Conta Atualizada',
        bankName: 'Inter',
        initialBalance: 2000,
        user: makeUser(),
      });

      await repo.updateAccount(account);

      expect(prisma.account.update).toHaveBeenCalledWith({
        where: { id: VALID_UUID },
        data: {
          name: 'Conta Atualizada',
          bankName: 'Inter',
          initialBalance: 2000,
        },
      });
    });
  });

  describe('deleteAccount()', () => {
    it('deve chamar prisma.account.delete com o id correto', async () => {
      (prisma.account.delete as jest.Mock).mockResolvedValue(undefined);

      await repo.deleteAccount(VALID_UUID);

      expect(prisma.account.delete).toHaveBeenCalledWith({
        where: { id: VALID_UUID },
      });
    });
  });
});
