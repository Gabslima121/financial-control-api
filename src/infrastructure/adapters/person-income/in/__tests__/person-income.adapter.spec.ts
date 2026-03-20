import { RecurrenceFrequency } from 'src/core/domain/financial-transaction/dto';
import { PersonIncomeDomain } from 'src/core/domain/person-income/person-income.domain';
import { PersonDomain } from 'src/core/domain/person/person.domain';
import { PersonIncomeAdapter } from '../person-income.adapter';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';

const person = PersonDomain.create({
  id: VALID_UUID,
  name: 'Gabriel',
  email: 'gabriel@email.com',
});

const baseDTO = {
  id: VALID_UUID,
  person,
  amount: 5000,
  frequency: RecurrenceFrequency.MONTHLY,
  createdAt: new Date('2024-01-01'),
};

describe('PersonIncomeAdapter', () => {
  describe('toDomain()', () => {
    it('deve converter DTO para domínio', () => {
      const domain = PersonIncomeAdapter.toDomain(baseDTO);

      expect(domain).toBeInstanceOf(PersonIncomeDomain);
      expect(domain.getId()).toBe(VALID_UUID);
      expect(domain.getAmount()).toBe(5000);
      expect(domain.getFrequency()).toBe(RecurrenceFrequency.MONTHLY);
      expect(domain.getPerson()).toBe(person);
    });
  });

  describe('toDto()', () => {
    it('deve converter domínio para DTO', () => {
      const domain = PersonIncomeDomain.create(baseDTO);
      const dto = PersonIncomeAdapter.toDto(domain);

      expect(dto.id).toBe(VALID_UUID);
      expect(dto.amount).toBe(5000);
      expect(dto.frequency).toBe(RecurrenceFrequency.MONTHLY);
      expect(dto.person).toBe(person);
      expect(dto.createdAt).toEqual(new Date('2024-01-01'));
    });
  });

  describe('round-trip', () => {
    it('deve preservar os valores em toDomain → toDto', () => {
      const dto = PersonIncomeAdapter.toDto(PersonIncomeAdapter.toDomain(baseDTO));

      expect(dto.id).toBe(baseDTO.id);
      expect(dto.amount).toBe(baseDTO.amount);
      expect(dto.frequency).toBe(baseDTO.frequency);
    });
  });
});
