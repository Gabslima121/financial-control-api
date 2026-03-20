import { PrismaClient } from '@prisma/client';
import { RecurrenceFrequency } from 'src/core/domain/financial-transaction/dto';
import { PersonIncomeDomain } from 'src/core/domain/person-income/person-income.domain';
import { PersonDomain } from 'src/core/domain/person/person.domain';
import { PersonIncomeImpl } from '../person-income.impl';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const PERSON_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';

const prismaIncome = {
  id: VALID_UUID,
  personId: PERSON_UUID,
  amount: 5000,
  frequency: 'monthly',
  createdAt: new Date('2024-01-01'),
};

const person = PersonDomain.create({
  id: PERSON_UUID,
  name: 'Gabriel',
  email: 'gabriel@email.com',
});

const makePrisma = () =>
  ({
    personIncome: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  }) as unknown as PrismaClient;

describe('PersonIncomeImpl', () => {
  let prisma: ReturnType<typeof makePrisma>;
  let repo: PersonIncomeImpl;

  beforeEach(() => {
    prisma = makePrisma();
    repo = new PersonIncomeImpl(prisma);
  });

  describe('createPersonIncome()', () => {
    it('deve chamar prisma.personIncome.create com os dados corretos', async () => {
      (prisma.personIncome.create as jest.Mock).mockResolvedValue(undefined);
      const income = PersonIncomeDomain.create({
        person,
        amount: 5000,
        frequency: RecurrenceFrequency.MONTHLY,
      });

      await repo.createPersonIncome(income);

      expect(prisma.personIncome.create).toHaveBeenCalledWith({
        data: {
          personId: PERSON_UUID,
          amount: 5000,
          frequency: RecurrenceFrequency.MONTHLY,
        },
      });
    });
  });

  describe('getIncomeByPersonId()', () => {
    it('deve retornar PersonIncomeDomain quando encontrado', async () => {
      (prisma.personIncome.findUnique as jest.Mock).mockResolvedValue(
        prismaIncome,
      );

      const result = await repo.getIncomeByPersonId(PERSON_UUID);

      expect(result).toBeInstanceOf(PersonIncomeDomain);
      expect(result!.getId()).toBe(VALID_UUID);
      expect(result!.getAmount()).toBe(5000);
      expect(result!.getFrequency()).toBe(RecurrenceFrequency.MONTHLY);
      expect(prisma.personIncome.findUnique).toHaveBeenCalledWith({
        where: { personId: PERSON_UUID },
      });
    });

    it('deve retornar null quando não encontrado', async () => {
      (prisma.personIncome.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repo.getIncomeByPersonId(PERSON_UUID);

      expect(result).toBeNull();
    });
  });

  describe('getIncomeById()', () => {
    it('deve retornar PersonIncomeDomain quando encontrado', async () => {
      (prisma.personIncome.findUnique as jest.Mock).mockResolvedValue(
        prismaIncome,
      );

      const result = await repo.getIncomeById(VALID_UUID);

      expect(result).toBeInstanceOf(PersonIncomeDomain);
      expect(result!.getAmount()).toBe(5000);
      expect(prisma.personIncome.findUnique).toHaveBeenCalledWith({
        where: { id: VALID_UUID },
      });
    });

    it('deve retornar null quando não encontrado', async () => {
      (prisma.personIncome.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repo.getIncomeById(VALID_UUID);

      expect(result).toBeNull();
    });
  });
});
