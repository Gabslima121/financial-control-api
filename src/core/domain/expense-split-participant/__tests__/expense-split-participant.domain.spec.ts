import { PersonDomain } from '../../person/person.domain';
import { ExpenseSplitParticipantDomain } from '../expense-split-participant.domain';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const RULE_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';

const person = PersonDomain.create({
  id: VALID_UUID,
  name: 'Gabriel',
  email: 'gabriel@email.com',
});

describe('ExpenseSplitParticipantDomain', () => {
  describe('create()', () => {
    it('deve criar com personId explícito', () => {
      const p = ExpenseSplitParticipantDomain.create({ personId: VALID_UUID });
      expect(p.getPersonId()).toBe(VALID_UUID);
    });

    it('deve criar resolvendo personId a partir do objeto person', () => {
      const p = ExpenseSplitParticipantDomain.create({ person });
      expect(p.getPersonId()).toBe(VALID_UUID);
    });

    it('deve lançar erro quando nem personId nem person são fornecidos', () => {
      expect(() => ExpenseSplitParticipantDomain.create({})).toThrow(
        'personId is required',
      );
    });

    it('deve gerar UUID quando id não é fornecido', () => {
      const p = ExpenseSplitParticipantDomain.create({ personId: VALID_UUID });
      expect(p.getId()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('deve aceitar ruleId', () => {
      const p = ExpenseSplitParticipantDomain.create({
        personId: VALID_UUID,
        ruleId: RULE_UUID,
      });
      expect(p.getRuleId()).toBe(RULE_UUID);
    });

    it('deve retornar ruleId nulo quando não fornecido', () => {
      const p = ExpenseSplitParticipantDomain.create({ personId: VALID_UUID });
      expect(p.getRuleId()).toBeNull();
    });
  });

  describe('getters', () => {
    it('deve retornar fixedPercent', () => {
      const p = ExpenseSplitParticipantDomain.create({
        personId: VALID_UUID,
        fixedPercent: 0.6,
      });
      expect(p.getFixedPercent()).toBe(0.6);
    });

    it('deve retornar fixedPercent nulo quando não fornecido', () => {
      const p = ExpenseSplitParticipantDomain.create({ personId: VALID_UUID });
      expect(p.getFixedPercent()).toBeNull();
    });

    it('deve retornar fixedAmount', () => {
      const p = ExpenseSplitParticipantDomain.create({
        personId: VALID_UUID,
        fixedAmount: 500,
      });
      expect(p.getFixedAmount()).toBe(500);
    });

    it('deve retornar fixedAmount nulo quando não fornecido', () => {
      const p = ExpenseSplitParticipantDomain.create({ personId: VALID_UUID });
      expect(p.getFixedAmount()).toBeNull();
    });

    it('deve retornar a pessoa', () => {
      const p = ExpenseSplitParticipantDomain.create({ person });
      expect(p.getPerson()).toBe(person);
    });

    it('deve retornar pessoa nula quando não fornecida', () => {
      const p = ExpenseSplitParticipantDomain.create({ personId: VALID_UUID });
      expect(p.getPerson()).toBeNull();
    });
  });
});
