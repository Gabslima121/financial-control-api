import { ExpenseSplitParticipantDomain } from 'src/core/domain/expense-split-participant/expense-split-participant.domain';
import { PersonDomain } from 'src/core/domain/person/person.domain';
import { ExpenseSplitParticipantAdapter } from '../expense-split-participant.adapter';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const RULE_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';

const person = PersonDomain.create({
  id: VALID_UUID,
  name: 'Gabriel',
  email: 'gabriel@email.com',
});

describe('ExpenseSplitParticipantAdapter', () => {
  describe('toDomain()', () => {
    it('deve converter DTO com personId para domínio', () => {
      const domain = ExpenseSplitParticipantAdapter.toDomain({
        id: VALID_UUID,
        ruleId: RULE_UUID,
        personId: VALID_UUID,
        fixedPercent: 0.6,
        fixedAmount: null,
      });

      expect(domain).toBeInstanceOf(ExpenseSplitParticipantDomain);
      expect(domain.getId()).toBe(VALID_UUID);
      expect(domain.getRuleId()).toBe(RULE_UUID);
      expect(domain.getPersonId()).toBe(VALID_UUID);
      expect(domain.getFixedPercent()).toBe(0.6);
      expect(domain.getFixedAmount()).toBeNull();
    });

    it('deve converter DTO com person para domínio', () => {
      const domain = ExpenseSplitParticipantAdapter.toDomain({
        id: VALID_UUID,
        person,
        fixedAmount: 500,
      });

      expect(domain.getPersonId()).toBe(VALID_UUID);
      expect(domain.getFixedAmount()).toBe(500);
    });
  });

  describe('toDTO()', () => {
    it('deve converter domínio para DTO', () => {
      const domain = ExpenseSplitParticipantDomain.create({
        id: VALID_UUID,
        ruleId: RULE_UUID,
        personId: VALID_UUID,
        person,
        fixedPercent: 0.6,
        fixedAmount: null,
        createdAt: new Date('2024-01-01'),
      });

      const dto = ExpenseSplitParticipantAdapter.toDTO(domain);

      expect(dto.id).toBe(VALID_UUID);
      expect(dto.ruleId).toBe(RULE_UUID);
      expect(dto.personId).toBe(VALID_UUID);
      expect(dto.person).toBe(person);
      expect(dto.fixedPercent).toBe(0.6);
      expect(dto.fixedAmount).toBeNull();
    });
  });

  describe('round-trip', () => {
    it('deve preservar os valores em toDomain → toDTO', () => {
      const original = {
        id: VALID_UUID,
        ruleId: RULE_UUID,
        personId: VALID_UUID,
        fixedPercent: 0.4,
        fixedAmount: null,
      };

      const dto = ExpenseSplitParticipantAdapter.toDTO(
        ExpenseSplitParticipantAdapter.toDomain(original),
      );

      expect(dto.id).toBe(original.id);
      expect(dto.personId).toBe(original.personId);
      expect(dto.fixedPercent).toBe(original.fixedPercent);
    });
  });
});
