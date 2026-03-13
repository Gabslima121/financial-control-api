import { UuidValueObject } from 'src/shared/value-object/uuid-value-object.vo';
import {
  FinancialTransactionDomainDTO,
  PaymentMethod,
  RecurrenceFrequency,
  TransactionStatus,
  TransactionType,
} from './dto';
import { AccountDomain } from '../account/account.domain';
import { BankStatementTransactionDomain } from '../bank-statement-transaction/bank-statement-transaction.domain';
import { BankStatementTransactionAdapter } from 'src/infrastructure/adapters/bank-statement-transaction/in/bank-statement-transaction.adapter';

export class FinancialTransactionDomain {
  private readonly id: UuidValueObject;
  private readonly account: AccountDomain | null;
  private readonly type: TransactionType;
  private status: TransactionStatus;
  private readonly amount: number;
  private readonly description: string | null;
  private readonly paymentMethod: PaymentMethod | null;
  private readonly dueDate: Date | null;
  private paidAt: Date | null;
  private readonly installments: number;
  private readonly installment: number;
  private bankStatement: BankStatementTransactionDomain | null;
  private readonly recurrenceGroupId: UuidValueObject | null;
  private readonly recurrenceFrequency: RecurrenceFrequency | null;
  private readonly recurrenceInterval: number | null;
  private readonly recurrenceDayOfMonth: number | null;
  private readonly createdAt: Date | null;
  private updatedAt: Date | null;

  private constructor(props: FinancialTransactionDomainDTO) {
    this.id = props.id ? new UuidValueObject(props.id) : new UuidValueObject();
    this.account = props.account ? props.account : null;
    this.type = props.type;
    this.status = props.status;
    this.amount = props.amount;
    this.description = props.description;
    this.paymentMethod = props.paymentMethod;
    this.dueDate = props.dueDate;
    this.paidAt = props.paidAt;
    this.installments = props.installments;
    this.installment = props.installment;
    this.bankStatement = props.bankStatement
      ? BankStatementTransactionAdapter.toDomain(props.bankStatement)
      : null;
    this.recurrenceGroupId = props.recurrenceGroupId
      ? new UuidValueObject(props.recurrenceGroupId)
      : null;
    this.recurrenceFrequency = props.recurrenceFrequency ?? null;
    this.recurrenceInterval = props.recurrenceInterval ?? null;
    this.recurrenceDayOfMonth = props.recurrenceDayOfMonth ?? null;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public static create(
    props: FinancialTransactionDomainDTO,
  ): FinancialTransactionDomain {
    return new FinancialTransactionDomain(props);
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getAccount(): AccountDomain | null {
    return this.account;
  }

  public getType(): TransactionType {
    return this.type;
  }

  public getStatus(): TransactionStatus {
    return this.status;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getDescription(): string | null {
    return this.description;
  }

  public getPaymentMethod(): PaymentMethod | null {
    return this.paymentMethod;
  }

  public getDueDate(): Date | null {
    return this.dueDate;
  }

  public getPaidAt(): Date | null {
    return this.paidAt;
  }

  public getInstallments(): number {
    return this.installments;
  }

  public getInstallment(): number {
    return this.installment;
  }

  public getBankStatement(): BankStatementTransactionDomain | null {
    return this.bankStatement;
  }

  public getRecurrenceGroupId(): string | null {
    return this.recurrenceGroupId?.getValue() ?? null;
  }

  public getRecurrenceFrequency(): RecurrenceFrequency | null {
    return this.recurrenceFrequency;
  }

  public getRecurrenceInterval(): number | null {
    return this.recurrenceInterval;
  }

  public getRecurrenceDayOfMonth(): number | null {
    return this.recurrenceDayOfMonth;
  }

  public getCreatedAt(): Date | null {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | null {
    return this.updatedAt;
  }

  public linkBankStatement(
    bankStatement: BankStatementTransactionDomain,
  ): void {
    this.bankStatement = bankStatement;
    this.updatedAt = new Date();
  }

  public confirmPayment(paidAt: Date): void {
    this.status = TransactionStatus.PAID;
    this.paidAt = paidAt;
    this.updatedAt = new Date();
  }
}
