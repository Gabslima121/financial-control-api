import {
  PaymentMethod,
  TransactionStatus,
  TransactionType,
} from 'src/core/domain/financial-transaction/dto';
import { FinancialTransactionDomain } from 'src/core/domain/financial-transaction/financial-transaction.domain';
import { FinancialTransactionAdapter } from '../financial-transaction.adapter';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';

const baseDTO = {
  id: VALID_UUID,
  type: TransactionType.EXPENSE,
  status: TransactionStatus.PENDING,
  amount: 3000,
  description: 'Aluguel',
  paymentMethod: PaymentMethod.PIX,
  dueDate: new Date('2024-03-10'),
  paidAt: null,
  installments: 1,
  installment: 1,
  bankStatement: null,
  account: null,
  recurrenceGroupId: null,
  recurrenceFrequency: null,
  recurrenceInterval: null,
  recurrenceDayOfMonth: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
};

describe('FinancialTransactionAdapter', () => {
  describe('toDomain()', () => {
    it('deve converter DTO para domínio', () => {
      const domain = FinancialTransactionAdapter.toDomain(baseDTO);

      expect(domain).toBeInstanceOf(FinancialTransactionDomain);
      expect(domain.getId()).toBe(VALID_UUID);
      expect(domain.getType()).toBe(TransactionType.EXPENSE);
      expect(domain.getStatus()).toBe(TransactionStatus.PENDING);
      expect(domain.getAmount()).toBe(3000);
      expect(domain.getDescription()).toBe('Aluguel');
      expect(domain.getPaymentMethod()).toBe(PaymentMethod.PIX);
      expect(domain.getInstallments()).toBe(1);
      expect(domain.getInstallment()).toBe(1);
      expect(domain.getBankStatement()).toBeNull();
    });
  });

  describe('toDTO()', () => {
    it('deve converter domínio para DTO', () => {
      const domain = FinancialTransactionDomain.create(baseDTO);
      const dto = FinancialTransactionAdapter.toDTO(domain);

      expect(dto.id).toBe(VALID_UUID);
      expect(dto.type).toBe(TransactionType.EXPENSE);
      expect(dto.status).toBe(TransactionStatus.PENDING);
      expect(dto.amount).toBe(3000);
      expect(dto.description).toBe('Aluguel');
      expect(dto.paymentMethod).toBe(PaymentMethod.PIX);
      expect(dto.dueDate).toEqual(new Date('2024-03-10'));
      expect(dto.paidAt).toBeNull();
      expect(dto.installments).toBe(1);
      expect(dto.installment).toBe(1);
      expect(dto.bankStatement).toBeNull();
      expect(dto.createdAt).toEqual(new Date('2024-01-01'));
      expect(dto.updatedAt).toEqual(new Date('2024-01-02'));
    });
  });

  describe('round-trip', () => {
    it('deve preservar os valores em toDomain → toDTO', () => {
      const dto = FinancialTransactionAdapter.toDTO(
        FinancialTransactionAdapter.toDomain(baseDTO),
      );

      expect(dto.id).toBe(baseDTO.id);
      expect(dto.type).toBe(baseDTO.type);
      expect(dto.status).toBe(baseDTO.status);
      expect(dto.amount).toBe(baseDTO.amount);
      expect(dto.description).toBe(baseDTO.description);
      expect(dto.installments).toBe(baseDTO.installments);
    });
  });
});
