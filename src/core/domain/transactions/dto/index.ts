import { CategoriesDomain } from "../../categories/categories.domain";
import { CategoryTypeEnum } from "../../categories/dto";
import { PaymentDestinationsDomain } from "../../payment-destinations/payment-destinations.domain";
import { UserDomain } from "../../users/users.domain";

export enum PaymentMethodEnum {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
  NUPAY = 'nupay',
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
}

export enum TransactionStatusEnum {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export interface TransactionDomainDTO {
  transactionId?: string;
  user?: UserDomain | null;
  category?: CategoriesDomain | null;
  destination?: PaymentDestinationsDomain | null;
  transactionType: CategoryTypeEnum;
  amount: number;
  paymentMethod: PaymentMethodEnum;
  installments?: number;
  currentInstallment?: number;
  parentTransactionId?: string | null;
  description?: string | null;
  transactionStatus?: TransactionStatusEnum;
  transactionDate: Date;
  dueDate?: Date | null;
  paymentDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}