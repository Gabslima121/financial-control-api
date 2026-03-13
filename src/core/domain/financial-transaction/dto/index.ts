import { BankStatementTransactionDomainDTO } from 'src/core/domain/bank-statement-transaction/dto';
import { AccountDomain } from '../../account/account.domain';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TransactionStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  OTHER = 'other',
}

export enum RecurrenceFrequency {
  MONTHLY = 'monthly',
}

export interface FinancialTransactionDomainDTO {
  id?: string;
  account?: AccountDomain | null;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  description: string | null;
  paymentMethod: PaymentMethod | null;
  dueDate: Date | null;
  paidAt: Date | null;
  installments: number;
  installment: number;
  bankStatement?: BankStatementTransactionDomainDTO | null;
  recurrenceGroupId?: string | null;
  recurrenceFrequency?: RecurrenceFrequency | null;
  recurrenceInterval?: number | null;
  recurrenceDayOfMonth?: number | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
