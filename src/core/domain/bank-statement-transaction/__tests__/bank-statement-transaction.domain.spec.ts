import { BankStatementTransactionDomain } from '../bank-statement-transaction.domain';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const ACCOUNT_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';

const baseProps = {
  accountId: ACCOUNT_UUID,
  fitId: 'FIT123456',
  amount: -1500.5,
  postedAt: new Date('2024-03-01'),
  description: 'PAGTO BOLETO',
  rawType: 'DEBIT',
};

describe('BankStatementTransactionDomain', () => {
  describe('create()', () => {
    it('deve criar com id fornecido', () => {
      const tx = BankStatementTransactionDomain.create({
        ...baseProps,
        id: VALID_UUID,
      });
      expect(tx.getId()).toBe(VALID_UUID);
    });

    it('deve gerar UUID quando id não é fornecido', () => {
      const tx = BankStatementTransactionDomain.create(baseProps);
      expect(tx.getId()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('deve aceitar account nulo', () => {
      const tx = BankStatementTransactionDomain.create({
        ...baseProps,
        account: null,
      });
      expect(tx.getAccount()).toBeNull();
    });

    it('deve aceitar description nula', () => {
      const tx = BankStatementTransactionDomain.create({
        ...baseProps,
        description: null,
      });
      expect(tx.getDescription()).toBeNull();
    });

    it('deve aceitar rawType nulo', () => {
      const tx = BankStatementTransactionDomain.create({
        ...baseProps,
        rawType: null,
      });
      expect(tx.getRawType()).toBeNull();
    });
  });

  describe('getters', () => {
    let tx: BankStatementTransactionDomain;

    beforeEach(() => {
      tx = BankStatementTransactionDomain.create({
        ...baseProps,
        id: VALID_UUID,
        createdAt: new Date('2024-01-01'),
      });
    });

    it('deve retornar o accountId', () => {
      expect(tx.getAccountId()).toBe(ACCOUNT_UUID);
    });

    it('deve retornar o fitId', () => {
      expect(tx.getFitId()).toBe('FIT123456');
    });

    it('deve retornar o amount', () => {
      expect(tx.getAmount()).toBe(-1500.5);
    });

    it('deve retornar postedAt', () => {
      expect(tx.getPostedAt()).toEqual(new Date('2024-03-01'));
    });

    it('deve retornar a description', () => {
      expect(tx.getDescription()).toBe('PAGTO BOLETO');
    });

    it('deve retornar o rawType', () => {
      expect(tx.getRawType()).toBe('DEBIT');
    });

    it('deve retornar createdAt', () => {
      expect(tx.getCreatedAt()).toEqual(new Date('2024-01-01'));
    });
  });
});
