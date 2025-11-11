import { UuidValueObject } from '../../../shared/value-object/uuid-value-object.vo';
import { CategoriesDomain } from '../categories/categories.domain';
import { CategoryTypeEnum } from '../categories/dto';
import { PaymentDestinationsDomain } from '../payment-destinations/payment-destinations.domain';
import { UserDomain } from '../users/users.domain';
import {
  PaymentMethodEnum,
  TransactionDomainDTO,
  TransactionStatusEnum,
} from './dto';

export class TransactionsDomain {
  private readonly transactionId: UuidValueObject;
  private readonly user?: UserDomain | null;
  private readonly category?: CategoriesDomain | null;
  private readonly destination?: PaymentDestinationsDomain | null;
  private readonly transactionType: CategoryTypeEnum;
  private readonly amount: number;
  private readonly paymentMethod: PaymentMethodEnum;
  private readonly installments: number;
  private readonly currentInstallment: number;
  private readonly parentTransactionId?: string | null;
  private description?: string | null;
  private transactionStatus: TransactionStatusEnum;
  private readonly transactionDate: Date;
  private readonly dueDate?: Date | null;
  private paymentDate?: Date | null;
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(params: TransactionDomainDTO) {
    this.transactionId = params.transactionId
      ? new UuidValueObject(params.transactionId)
      : new UuidValueObject();
    this.user = params.user ?? null;
    this.category = params.category ?? null;
    this.destination = params.destination ?? null;
    this.transactionType = params.transactionType;
    this.amount = params.amount;
    this.paymentMethod = params.paymentMethod;
    this.installments = params.installments ?? 1;
    this.currentInstallment = params.currentInstallment ?? 1;
    this.parentTransactionId = params.parentTransactionId ?? null;
    this.description = params.description ?? null;
    this.transactionStatus =
      params.transactionStatus ?? TransactionStatusEnum.PENDING;
    this.transactionDate = params.transactionDate;
    this.dueDate = params.dueDate ?? null;
    this.paymentDate = params.paymentDate ?? null;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  static create(params: TransactionDomainDTO): TransactionsDomain {
    return new TransactionsDomain(params);
  }

  getTransactionId(): UuidValueObject {
    return this.transactionId;
  }
  getUser(): UserDomain | null {
    return this.user ?? null;
  }
  getCategory(): CategoriesDomain | null {
    return this.category ?? null;
  }
  getDestination(): PaymentDestinationsDomain | null {
    return this.destination ?? null;
  }

  getTransactionType(): CategoryTypeEnum {
    return this.transactionType;
  }
  getAmount(): number {
    return this.amount;
  }
  getPaymentMethod(): PaymentMethodEnum {
    return this.paymentMethod;
  }

  getInstallments(): number {
    return this.installments;
  }
  getCurrentInstallment(): number {
    return this.currentInstallment;
  }
  getParentTransactionId(): string | null {
    return this.parentTransactionId ?? null;
  }

  getDescription(): string | null {
    return this.description ?? null;
  }
  getTransactionStatus(): TransactionStatusEnum {
    return this.transactionStatus;
  }

  getTransactionDate(): Date {
    return this.transactionDate;
  }
  getDueDate(): Date | null {
    return this.dueDate ?? null;
  }
  getPaymentDate(): Date | null {
    return this.paymentDate ?? null;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setPaymentDate(date: Date | null): void {
    this.paymentDate = date ?? null;
    this.updatedAt = new Date();
  }

  updateDescription(description: string | null): void {
    this.description = description ?? null;
    this.updatedAt = new Date();
  }

  setStatus(status: TransactionStatusEnum): void {
    this.transactionStatus = status;
    this.updatedAt = new Date();
  }
}
