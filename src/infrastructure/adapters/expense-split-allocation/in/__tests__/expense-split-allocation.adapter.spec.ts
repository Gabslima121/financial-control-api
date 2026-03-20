import { ExpenseSplitAllocationDomain } from 'src/core/domain/expense-split-allocation/expense-split-allocation.domain';
import { PersonDomain } from 'src/core/domain/person/person.domain';
import { ExpenseSplitAllocationAdapter } from '../expense-split-allocation.adapter';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const TRANSACTION_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';

const person = PersonDomain.create({
  id: VALID_UUID,
  name: 'Gabriel',
  email: 'gabriel@email.com',
});

describe('ExpenseSplitAllocationAdapter', () => {
  describe('toDomain()', () => {
    it('deve converter DTO com personId para domínio', () => {
      const domain = ExpenseSplitAllocationAdapter.toDomain({
        id: VALID_UUID,
        transactionId: TRANSACTION_UUID,
        personId: VALID_UUID,
        amount: 1500,
        createdAt: new Date('2024-01-01'),
      });

      expect(domain).toBeInstanceOf(ExpenseSplitAllocationDomain);
      expect(domain.getId()).toBe(VALID_UUID);
      expect(domain.getTransactionId()).toBe(TRANSACTION_UUID);
      expect(domain.getPersonId()).toBe(VALID_UUID);
      expect(domain.getAmount()).toBe(1500);
    });

    it('deve converter DTO com person para domínio', () => {
      const domain = ExpenseSplitAllocationAdapter.toDomain({
        transactionId: TRANSACTION_UUID,
        person,
        amount: 1000,
      });

      expect(domain.getPersonId()).toBe(VALID_UUID);
      expect(domain.getPerson()).toBe(person);
    });
  });

  describe('toDTO()', () => {
    it('deve converter domínio para DTO', () => {
      const domain = ExpenseSplitAllocationDomain.create({
        id: VALID_UUID,
        transactionId: TRANSACTION_UUID,
        personId: VALID_UUID,
        person,
        amount: 1500,
        createdAt: new Date('2024-01-01'),
      });

      const dto = ExpenseSplitAllocationAdapter.toDTO(domain);

      expect(dto.id).toBe(VALID_UUID);
      expect(dto.transactionId).toBe(TRANSACTION_UUID);
      expect(dto.personId).toBe(VALID_UUID);
      expect(dto.person).toBe(person);
      expect(dto.amount).toBe(1500);
      expect(dto.createdAt).toEqual(new Date('2024-01-01'));
    });
  });

  describe('round-trip', () => {
    it('deve preservar os valores em toDomain → toDTO', () => {
      const original = {
        id: VALID_UUID,
        transactionId: TRANSACTION_UUID,
        personId: VALID_UUID,
        amount: 2000,
      };

      const dto = ExpenseSplitAllocationAdapter.toDTO(
        ExpenseSplitAllocationAdapter.toDomain(original),
      );

      expect(dto.id).toBe(original.id);
      expect(dto.transactionId).toBe(original.transactionId);
      expect(dto.personId).toBe(original.personId);
      expect(dto.amount).toBe(original.amount);
    });
  });
});
