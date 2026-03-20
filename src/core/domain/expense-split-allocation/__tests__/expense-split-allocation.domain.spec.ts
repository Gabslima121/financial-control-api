import { PersonDomain } from '../../person/person.domain';
import { ExpenseSplitAllocationDomain } from '../expense-split-allocation.domain';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const TRANSACTION_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';

const person = PersonDomain.create({
  id: VALID_UUID,
  name: 'Gabriel',
  email: 'gabriel@email.com',
});

describe('ExpenseSplitAllocationDomain', () => {
  describe('create()', () => {
    it('deve criar com personId explícito', () => {
      const allocation = ExpenseSplitAllocationDomain.create({
        transactionId: TRANSACTION_UUID,
        personId: VALID_UUID,
        amount: 1500,
      });
      expect(allocation.getPersonId()).toBe(VALID_UUID);
    });

    it('deve criar resolvendo personId a partir do objeto person', () => {
      const allocation = ExpenseSplitAllocationDomain.create({
        transactionId: TRANSACTION_UUID,
        person,
        amount: 1500,
      });
      expect(allocation.getPersonId()).toBe(VALID_UUID);
    });

    it('deve lançar erro quando nem personId nem person são fornecidos', () => {
      expect(() =>
        ExpenseSplitAllocationDomain.create({
          transactionId: TRANSACTION_UUID,
          amount: 1500,
        }),
      ).toThrow('personId is required');
    });

    it('deve gerar UUID quando id não é fornecido', () => {
      const allocation = ExpenseSplitAllocationDomain.create({
        transactionId: TRANSACTION_UUID,
        personId: VALID_UUID,
        amount: 1500,
      });
      expect(allocation.getId()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe('getters', () => {
    let allocation: ExpenseSplitAllocationDomain;

    beforeEach(() => {
      allocation = ExpenseSplitAllocationDomain.create({
        transactionId: TRANSACTION_UUID,
        personId: VALID_UUID,
        amount: 1500,
        createdAt: new Date('2024-01-01'),
      });
    });

    it('deve retornar o transactionId', () => {
      expect(allocation.getTransactionId()).toBe(TRANSACTION_UUID);
    });

    it('deve retornar o amount', () => {
      expect(allocation.getAmount()).toBe(1500);
    });

    it('deve retornar createdAt', () => {
      expect(allocation.getCreatedAt()).toEqual(new Date('2024-01-01'));
    });

    it('deve retornar a pessoa quando fornecida', () => {
      const alloc = ExpenseSplitAllocationDomain.create({
        transactionId: TRANSACTION_UUID,
        person,
        amount: 500,
      });
      expect(alloc.getPerson()).toBe(person);
    });

    it('deve retornar pessoa nula quando não fornecida', () => {
      expect(allocation.getPerson()).toBeNull();
    });
  });
});
