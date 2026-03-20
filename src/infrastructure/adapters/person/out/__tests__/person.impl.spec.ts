import { PrismaClient } from '@prisma/client';
import { PersonDomain } from 'src/core/domain/person/person.domain';
import { PersonImpl } from '../person.impl';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';

const prismaPerson = {
  id: VALID_UUID,
  name: 'Gabriel',
  email: 'gabriel@email.com',
};

const makePrisma = () =>
  ({
    person: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  }) as unknown as PrismaClient;

describe('PersonImpl', () => {
  let prisma: ReturnType<typeof makePrisma>;
  let repo: PersonImpl;

  beforeEach(() => {
    prisma = makePrisma();
    repo = new PersonImpl(prisma);
  });

  describe('findPersonById()', () => {
    it('deve retornar PersonDomain quando encontrado', async () => {
      (prisma.person.findUnique as jest.Mock).mockResolvedValue(prismaPerson);

      const result = await repo.findPersonById(VALID_UUID);

      expect(result).toBeInstanceOf(PersonDomain);
      expect(result.getId()).toBe(VALID_UUID);
      expect(result.getName()).toBe('Gabriel');
      expect(prisma.person.findUnique).toHaveBeenCalledWith({
        where: { id: VALID_UUID },
      });
    });

    it('deve lançar erro quando não encontrado', async () => {
      (prisma.person.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(repo.findPersonById(VALID_UUID)).rejects.toThrow(
        'Person not found',
      );
    });
  });

  describe('createPerson()', () => {
    it('deve chamar prisma.person.create com os dados corretos', async () => {
      (prisma.person.create as jest.Mock).mockResolvedValue(undefined);
      const person = PersonDomain.create({
        id: VALID_UUID,
        name: 'Gabriel',
        email: 'gabriel@email.com',
      });

      await repo.createPerson(person);

      expect(prisma.person.create).toHaveBeenCalledWith({
        data: { id: VALID_UUID, name: 'Gabriel', email: 'gabriel@email.com' },
      });
    });
  });

  describe('listPeople()', () => {
    it('deve retornar lista de PersonDomain', async () => {
      (prisma.person.findMany as jest.Mock).mockResolvedValue([prismaPerson]);

      const result = await repo.listPeople();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(PersonDomain);
      expect(result[0].getName()).toBe('Gabriel');
    });

    it('deve retornar lista vazia', async () => {
      (prisma.person.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repo.listPeople();

      expect(result).toHaveLength(0);
    });
  });
});
