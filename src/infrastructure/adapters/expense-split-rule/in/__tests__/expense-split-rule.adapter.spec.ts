import { ExpenseSplitType } from 'src/core/domain/expense-split-rule/dto';
import { ExpenseSplitRuleDomain } from 'src/core/domain/expense-split-rule/expense-split-rule.domain';
import { ExpenseSplitRuleAdapter } from '../expense-split-rule.adapter';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const ACCOUNT_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';
const PERSON_UUID = 'c3d4e5f6-a7b8-4901-acde-f12345678901';
const PERSON2_UUID = 'd4e5f6a7-b8c9-4012-bdef-012345678902';

const baseDTO = {
  id: VALID_UUID,
  accountId: ACCOUNT_UUID,
  name: 'Divisão do Aluguel',
  type: ExpenseSplitType.PROPORTIONAL_INCOME,
  isActive: true,
  recurrenceGroupId: null,
  transactionId: null,
  participants: [] as any[],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
};

describe('ExpenseSplitRuleAdapter', () => {
  describe('toDomain()', () => {
    it('deve converter DTO para domínio sem participantes', () => {
      const domain = ExpenseSplitRuleAdapter.toDomain(baseDTO);

      expect(domain).toBeInstanceOf(ExpenseSplitRuleDomain);
      expect(domain.getId()).toBe(VALID_UUID);
      expect(domain.getAccountId()).toBe(ACCOUNT_UUID);
      expect(domain.getName()).toBe('Divisão do Aluguel');
      expect(domain.getType()).toBe(ExpenseSplitType.PROPORTIONAL_INCOME);
      expect(domain.getIsActive()).toBe(true);
      expect(domain.getParticipants()).toHaveLength(0);
    });

    it('deve converter DTO com participantes para domínio', () => {
      const domain = ExpenseSplitRuleAdapter.toDomain({
        ...baseDTO,
        type: ExpenseSplitType.FIXED_PERCENT,
        participants: [
          { personId: PERSON_UUID, fixedPercent: 0.6, fixedAmount: null },
          { personId: PERSON2_UUID, fixedPercent: 0.4, fixedAmount: null },
        ],
      });

      expect(domain.getParticipants()).toHaveLength(2);
      expect(domain.getParticipants()[0].getFixedPercent()).toBe(0.6);
      expect(domain.getParticipants()[1].getFixedPercent()).toBe(0.4);
    });
  });

  describe('toDTO()', () => {
    it('deve converter domínio para DTO', () => {
      const domain = ExpenseSplitRuleDomain.create(baseDTO);
      const dto = ExpenseSplitRuleAdapter.toDTO(domain);

      expect(dto.id).toBe(VALID_UUID);
      expect(dto.accountId).toBe(ACCOUNT_UUID);
      expect(dto.name).toBe('Divisão do Aluguel');
      expect(dto.type).toBe(ExpenseSplitType.PROPORTIONAL_INCOME);
      expect(dto.isActive).toBe(true);
      expect(dto.recurrenceGroupId).toBeNull();
      expect(dto.transactionId).toBeNull();
      expect(dto.participants).toHaveLength(0);
      expect(dto.createdAt).toEqual(new Date('2024-01-01'));
      expect(dto.updatedAt).toEqual(new Date('2024-01-02'));
    });
  });

  describe('round-trip', () => {
    it('deve preservar os valores em toDomain → toDTO', () => {
      const dto = ExpenseSplitRuleAdapter.toDTO(
        ExpenseSplitRuleAdapter.toDomain(baseDTO),
      );

      expect(dto.id).toBe(baseDTO.id);
      expect(dto.accountId).toBe(baseDTO.accountId);
      expect(dto.name).toBe(baseDTO.name);
      expect(dto.type).toBe(baseDTO.type);
      expect(dto.isActive).toBe(baseDTO.isActive);
    });
  });
});
