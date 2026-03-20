import { PrismaClient } from '@prisma/client';
import { UserDomain } from 'src/core/domain/user/user.domain';
import { UserRepository } from '../user.impl';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const VALID_CPF = '11144477735';

const prismaUser = {
  id: VALID_UUID,
  name: 'Gabriel',
  document: VALID_CPF,
  email: 'gabriel@email.com',
  password: 'hashed',
  isActive: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
};

const makePrisma = () =>
  ({
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
  }) as unknown as PrismaClient;

describe('UserRepository', () => {
  let prisma: ReturnType<typeof makePrisma>;
  let repo: UserRepository;

  beforeEach(() => {
    prisma = makePrisma();
    repo = new UserRepository(prisma);
  });

  describe('findById()', () => {
    it('deve retornar UserDomain quando encontrado', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(prismaUser);

      const result = await repo.findById(VALID_UUID);

      expect(result).toBeInstanceOf(UserDomain);
      expect(result!.getId()).toBe(VALID_UUID);
      expect(result!.getName()).toBe('Gabriel');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: VALID_UUID },
      });
    });

    it('deve retornar null quando não encontrado', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repo.findById(VALID_UUID);

      expect(result).toBeNull();
    });
  });

  describe('findUserByEmail()', () => {
    it('deve retornar UserDomain quando encontrado', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(prismaUser);

      const result = await repo.findUserByEmail('gabriel@email.com');

      expect(result).toBeInstanceOf(UserDomain);
      expect(result!.getEmail()).toBe('gabriel@email.com');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'gabriel@email.com' },
      });
    });

    it('deve retornar null quando não encontrado', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repo.findUserByEmail('naoexiste@email.com');

      expect(result).toBeNull();
    });
  });

  describe('listAllUsers()', () => {
    it('deve retornar lista de UserDomain', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([prismaUser]);

      const result = await repo.listAllUsers();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(UserDomain);
    });

    it('deve retornar lista vazia', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repo.listAllUsers();

      expect(result).toHaveLength(0);
    });
  });

  describe('createUser()', () => {
    it('deve chamar prisma.user.create com os dados corretos', async () => {
      (prisma.user.create as jest.Mock).mockResolvedValue(undefined);
      const user = UserDomain.create({
        id: VALID_UUID,
        name: 'Gabriel',
        document: VALID_CPF,
        email: 'gabriel@email.com',
        password: 'hashed',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      });

      await repo.createUser(user);

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            id: VALID_UUID,
            email: 'gabriel@email.com',
            document: VALID_CPF,
          }),
        }),
      );
    });
  });

  describe('encryptPassword()', () => {
    it('deve retornar um hash diferente da senha original', async () => {
      const hash = await repo.encryptPassword('minha_senha');

      expect(hash).not.toBe('minha_senha');
      expect(typeof hash).toBe('string');
    });
  });

  describe('decryptPassword()', () => {
    it('deve retornar true para senha correta', async () => {
      const hash = await repo.encryptPassword('minha_senha');
      const result = await repo.decryptPassword('minha_senha', hash);

      expect(result).toBe(true);
    });

    it('deve retornar false para senha incorreta', async () => {
      const hash = await repo.encryptPassword('minha_senha');
      const result = await repo.decryptPassword('senha_errada', hash);

      expect(result).toBe(false);
    });
  });
});
