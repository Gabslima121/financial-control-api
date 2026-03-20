import { RecurrenceFrequency } from '../../financial-transaction/dto';
import { PersonDomain } from '../../person/person.domain';
import { PersonIncomeDomain } from '../person-income.domain';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';

const person = PersonDomain.create({
  id: VALID_UUID,
  name: 'Gabriel',
  email: 'gabriel@email.com',
});

const baseProps = {
  person,
  amount: 5000,
  frequency: RecurrenceFrequency.MONTHLY,
};

describe('PersonIncomeDomain', () => {
  describe('create()', () => {
    it('deve criar uma renda com id fornecido', () => {
      const income = PersonIncomeDomain.create({
        ...baseProps,
        id: VALID_UUID,
      });
      expect(income.getId()).toBe(VALID_UUID);
    });

    it('deve gerar UUID quando id não é fornecido', () => {
      const income = PersonIncomeDomain.create(baseProps);
      expect(income.getId()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('deve aceitar createdAt nulo quando não fornecido', () => {
      const income = PersonIncomeDomain.create(baseProps);
      expect(income.getCreatedAt()).toBeNull();
    });

    it('deve armazenar createdAt quando fornecido', () => {
      const date = new Date('2024-01-01');
      const income = PersonIncomeDomain.create({
        ...baseProps,
        createdAt: date,
      });
      expect(income.getCreatedAt()).toEqual(date);
    });
  });

  describe('getters', () => {
    let income: PersonIncomeDomain;

    beforeEach(() => {
      income = PersonIncomeDomain.create({ ...baseProps, id: VALID_UUID });
    });

    it('deve retornar a pessoa', () => {
      expect(income.getPerson()).toBe(person);
    });

    it('deve retornar o valor', () => {
      expect(income.getAmount()).toBe(5000);
    });

    it('deve retornar a frequência', () => {
      expect(income.getFrequency()).toBe(RecurrenceFrequency.MONTHLY);
    });
  });
});
