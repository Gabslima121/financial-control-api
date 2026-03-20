import {
  PaymentMethod,
  RecurrenceFrequency,
  TransactionStatus,
  TransactionType,
} from '../dto';
import { FinancialTransactionDomain } from '../financial-transaction.domain';

const VALID_UUID = 'a1b2c3d4-e5f6-4789-8abc-def012345678';
const RECURRENCE_UUID = 'b2c3d4e5-f6a7-4890-9bcd-ef1234567890';

const baseProps = {
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
};

describe('FinancialTransactionDomain', () => {
  describe('create()', () => {
    it('deve criar uma transação com id fornecido', () => {
      const tx = FinancialTransactionDomain.create({
        ...baseProps,
        id: VALID_UUID,
      });
      expect(tx.getId()).toBe(VALID_UUID);
    });

    it('deve gerar UUID quando id não é fornecido', () => {
      const tx = FinancialTransactionDomain.create(baseProps);
      expect(tx.getId()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('deve aceitar account nulo', () => {
      const tx = FinancialTransactionDomain.create({
        ...baseProps,
        account: null,
      });
      expect(tx.getAccount()).toBeNull();
    });

    it('deve aceitar description nula', () => {
      const tx = FinancialTransactionDomain.create({
        ...baseProps,
        description: null,
      });
      expect(tx.getDescription()).toBeNull();
    });

    it('deve aceitar recurrenceGroupId', () => {
      const tx = FinancialTransactionDomain.create({
        ...baseProps,
        recurrenceGroupId: RECURRENCE_UUID,
        recurrenceFrequency: RecurrenceFrequency.MONTHLY,
        recurrenceInterval: 1,
        recurrenceDayOfMonth: 10,
      });
      expect(tx.getRecurrenceGroupId()).toBe(RECURRENCE_UUID);
      expect(tx.getRecurrenceFrequency()).toBe(RecurrenceFrequency.MONTHLY);
      expect(tx.getRecurrenceInterval()).toBe(1);
      expect(tx.getRecurrenceDayOfMonth()).toBe(10);
    });

    it('deve retornar null para campos de recorrência quando não fornecidos', () => {
      const tx = FinancialTransactionDomain.create(baseProps);
      expect(tx.getRecurrenceGroupId()).toBeNull();
      expect(tx.getRecurrenceFrequency()).toBeNull();
      expect(tx.getRecurrenceInterval()).toBeNull();
      expect(tx.getRecurrenceDayOfMonth()).toBeNull();
    });
  });

  describe('getters', () => {
    let tx: FinancialTransactionDomain;

    beforeEach(() => {
      tx = FinancialTransactionDomain.create({
        ...baseProps,
        id: VALID_UUID,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      });
    });

    it('deve retornar o tipo', () => {
      expect(tx.getType()).toBe(TransactionType.EXPENSE);
    });

    it('deve retornar o status', () => {
      expect(tx.getStatus()).toBe(TransactionStatus.PENDING);
    });

    it('deve retornar o amount', () => {
      expect(tx.getAmount()).toBe(3000);
    });

    it('deve retornar o paymentMethod', () => {
      expect(tx.getPaymentMethod()).toBe(PaymentMethod.PIX);
    });

    it('deve retornar dueDate', () => {
      expect(tx.getDueDate()).toEqual(new Date('2024-03-10'));
    });

    it('deve retornar installments e installment', () => {
      expect(tx.getInstallments()).toBe(1);
      expect(tx.getInstallment()).toBe(1);
    });

    it('deve retornar createdAt e updatedAt', () => {
      expect(tx.getCreatedAt()).toEqual(new Date('2024-01-01'));
      expect(tx.getUpdatedAt()).toEqual(new Date('2024-01-02'));
    });
  });

  describe('confirmPayment()', () => {
    it('deve alterar o status para PAID e definir paidAt', () => {
      const tx = FinancialTransactionDomain.create(baseProps);
      const paidDate = new Date('2024-03-10');

      tx.confirmPayment(paidDate);

      expect(tx.getStatus()).toBe(TransactionStatus.PAID);
      expect(tx.getPaidAt()).toEqual(paidDate);
    });
  });

  describe('linkBankStatement()', () => {
    it('deve vincular um extrato bancário', () => {
      const tx = FinancialTransactionDomain.create(baseProps);

      const bankStatementDomain = {
        getId: () => VALID_UUID,
      } as any;

      tx.linkBankStatement(bankStatementDomain);

      expect(tx.getBankStatement()).toBe(bankStatementDomain);
    });
  });
});
