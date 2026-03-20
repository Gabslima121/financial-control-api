import { BankStatementTransactionDomain } from 'src/core/domain/bank-statement-transaction/bank-statement-transaction.domain';
import { BankStatementTransactionAdapter } from '../bank-statement-transaction.adapter';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const ACCOUNT_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';

const baseDTO = {
  id: VALID_UUID,
  accountId: ACCOUNT_UUID,
  fitId: 'FIT123456',
  amount: -1500.5,
  postedAt: new Date('2024-03-01'),
  description: 'PAGTO BOLETO',
  rawType: 'DEBIT',
  account: null,
  createdAt: new Date('2024-01-01'),
};

describe('BankStatementTransactionAdapter', () => {
  describe('toDomain()', () => {
    it('deve converter DTO para domínio', () => {
      const domain = BankStatementTransactionAdapter.toDomain(baseDTO);

      expect(domain).toBeInstanceOf(BankStatementTransactionDomain);
      expect(domain.getId()).toBe(VALID_UUID);
      expect(domain.getAccountId()).toBe(ACCOUNT_UUID);
      expect(domain.getFitId()).toBe('FIT123456');
      expect(domain.getAmount()).toBe(-1500.5);
      expect(domain.getPostedAt()).toEqual(new Date('2024-03-01'));
      expect(domain.getDescription()).toBe('PAGTO BOLETO');
      expect(domain.getRawType()).toBe('DEBIT');
      expect(domain.getAccount()).toBeNull();
    });
  });

  describe('toDTO()', () => {
    it('deve converter domínio para DTO', () => {
      const domain = BankStatementTransactionDomain.create(baseDTO);
      const dto = BankStatementTransactionAdapter.toDTO(domain);

      expect(dto.id).toBe(VALID_UUID);
      expect(dto.accountId).toBe(ACCOUNT_UUID);
      expect(dto.fitId).toBe('FIT123456');
      expect(dto.amount).toBe(-1500.5);
      expect(dto.postedAt).toEqual(new Date('2024-03-01'));
      expect(dto.description).toBe('PAGTO BOLETO');
      expect(dto.rawType).toBe('DEBIT');
      expect(dto.account).toBeNull();
    });
  });

  describe('round-trip', () => {
    it('deve preservar os valores em toDomain → toDTO', () => {
      const dto = BankStatementTransactionAdapter.toDTO(
        BankStatementTransactionAdapter.toDomain(baseDTO),
      );

      expect(dto.id).toBe(baseDTO.id);
      expect(dto.accountId).toBe(baseDTO.accountId);
      expect(dto.fitId).toBe(baseDTO.fitId);
      expect(dto.amount).toBe(baseDTO.amount);
      expect(dto.description).toBe(baseDTO.description);
    });
  });
});
