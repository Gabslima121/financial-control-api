import { ExpenseSplitType } from '../dto';
import { ExpenseSplitRuleDomain } from '../expense-split-rule.domain';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const ACCOUNT_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';
const PERSON_UUID = 'c3d4e5f6-a7b8-4901-acde-f12345678901';
const RECURRENCE_UUID = 'd4e5f6a7-b8c9-4012-bdef-012345678902';
const TRANSACTION_UUID = 'e5f6a7b8-c9d0-4123-8ef0-123456789012';

const baseProps = {
  accountId: ACCOUNT_UUID,
  name: 'Divisão do Aluguel',
  type: ExpenseSplitType.PROPORTIONAL_INCOME,
};

describe('ExpenseSplitRuleDomain', () => {
  describe('create()', () => {
    it('deve criar uma regra com id fornecido', () => {
      const rule = ExpenseSplitRuleDomain.create({ ...baseProps, id: VALID_UUID });
      expect(rule.getId()).toBe(VALID_UUID);
    });

    it('deve gerar UUID quando id não é fornecido', () => {
      const rule = ExpenseSplitRuleDomain.create(baseProps);
      expect(rule.getId()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('deve ter isActive true por padrão', () => {
      const rule = ExpenseSplitRuleDomain.create(baseProps);
      expect(rule.getIsActive()).toBe(true);
    });

    it('deve aceitar isActive false', () => {
      const rule = ExpenseSplitRuleDomain.create({ ...baseProps, isActive: false });
      expect(rule.getIsActive()).toBe(false);
    });

    it('deve retornar lista vazia de participantes quando não fornecidos', () => {
      const rule = ExpenseSplitRuleDomain.create(baseProps);
      expect(rule.getParticipants()).toHaveLength(0);
    });

    it('deve criar participantes quando fornecidos', () => {
      const rule = ExpenseSplitRuleDomain.create({
        ...baseProps,
        id: VALID_UUID,
        participants: [
          { personId: PERSON_UUID, fixedPercent: 0.6 },
          { personId: ACCOUNT_UUID, fixedPercent: 0.4 },
        ],
      });
      expect(rule.getParticipants()).toHaveLength(2);
    });

    it('deve aceitar recurrenceGroupId', () => {
      const rule = ExpenseSplitRuleDomain.create({
        ...baseProps,
        recurrenceGroupId: RECURRENCE_UUID,
      });
      expect(rule.getRecurrenceGroupId()).toBe(RECURRENCE_UUID);
    });

    it('deve retornar null para recurrenceGroupId quando não fornecido', () => {
      const rule = ExpenseSplitRuleDomain.create(baseProps);
      expect(rule.getRecurrenceGroupId()).toBeNull();
    });

    it('deve aceitar transactionId', () => {
      const rule = ExpenseSplitRuleDomain.create({
        ...baseProps,
        transactionId: TRANSACTION_UUID,
      });
      expect(rule.getTransactionId()).toBe(TRANSACTION_UUID);
    });

    it('deve retornar null para transactionId quando não fornecido', () => {
      const rule = ExpenseSplitRuleDomain.create(baseProps);
      expect(rule.getTransactionId()).toBeNull();
    });
  });

  describe('tipos de split', () => {
    it('deve criar regra do tipo proportional_income', () => {
      const rule = ExpenseSplitRuleDomain.create({
        ...baseProps,
        type: ExpenseSplitType.PROPORTIONAL_INCOME,
      });
      expect(rule.getType()).toBe(ExpenseSplitType.PROPORTIONAL_INCOME);
    });

    it('deve criar regra do tipo fixed_percent', () => {
      const rule = ExpenseSplitRuleDomain.create({
        ...baseProps,
        type: ExpenseSplitType.FIXED_PERCENT,
      });
      expect(rule.getType()).toBe(ExpenseSplitType.FIXED_PERCENT);
    });

    it('deve criar regra do tipo fixed_amount', () => {
      const rule = ExpenseSplitRuleDomain.create({
        ...baseProps,
        type: ExpenseSplitType.FIXED_AMOUNT,
      });
      expect(rule.getType()).toBe(ExpenseSplitType.FIXED_AMOUNT);
    });
  });

  describe('getters', () => {
    let rule: ExpenseSplitRuleDomain;

    beforeEach(() => {
      rule = ExpenseSplitRuleDomain.create({
        ...baseProps,
        id: VALID_UUID,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      });
    });

    it('deve retornar o accountId', () => {
      expect(rule.getAccountId()).toBe(ACCOUNT_UUID);
    });

    it('deve retornar o nome', () => {
      expect(rule.getName()).toBe('Divisão do Aluguel');
    });

    it('deve retornar createdAt', () => {
      expect(rule.getCreatedAt()).toEqual(new Date('2024-01-01'));
    });

    it('deve retornar updatedAt', () => {
      expect(rule.getUpdatedAt()).toEqual(new Date('2024-01-02'));
    });
  });
});
