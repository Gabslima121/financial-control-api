import { UuidValueObject } from "src/shared/value-object/uuid-value-object.vo";
import { FinancialTransactionDomainDTO, PaymentMethod, TransactionStatus, TransactionType } from "./dto";
import { AccountDomain } from "../account/account.domain";
import { BankStatementTransactionDomain } from "../bank-statement-transaction/bank-statement-transaction.domain";
import { AccountDomainAdapter } from "src/infrastructure/adapters/account/in/account.adapter";
import { BankStatementTransactionAdapter } from "src/infrastructure/adapters/bank-statement-transaction/in/bank-statement-transaction.adapter";

export class FinancialTransactionDomain {
    private readonly id: UuidValueObject;
    private readonly accountId: UuidValueObject;
    private readonly account: AccountDomain | null;
    private readonly type: TransactionType;
    private readonly status: TransactionStatus;
    private readonly amount: number;
    private readonly description: string | null;
    private readonly paymentMethod: PaymentMethod | null;
    private readonly dueDate: Date | null;
    private readonly paidAt: Date | null;
    private readonly installments: number;
    private readonly installment: number;
    private readonly bankStatementId: UuidValueObject | null;
    private readonly bankStatement: BankStatementTransactionDomain | null;
    private readonly createdAt: Date | null;
    private readonly updatedAt: Date | null;

    private constructor(props: FinancialTransactionDomainDTO) {
        this.id = props.id ? new UuidValueObject(props.id) : new UuidValueObject();
        this.accountId = new UuidValueObject(props.accountId);
        this.account = props.account ? AccountDomainAdapter.toDomain(props.account) : null;
        this.type = props.type;
        this.status = props.status;
        this.amount = props.amount;
        this.description = props.description;
        this.paymentMethod = props.paymentMethod;
        this.dueDate = props.dueDate;
        this.paidAt = props.paidAt;
        this.installments = props.installments;
        this.installment = props.installment;
        this.bankStatementId = props.bankStatementId ? new UuidValueObject(props.bankStatementId) : null;
        this.bankStatement = props.bankStatement ? BankStatementTransactionAdapter.toDomain(props.bankStatement) : null;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    public static create(props: FinancialTransactionDomainDTO): FinancialTransactionDomain {
        return new FinancialTransactionDomain(props);
    }

    public getId(): string {
        return this.id.getValue();
    }

    public getAccountId(): string {
        return this.accountId.getValue();
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

    public getBankStatementId(): string | null {
        return this.bankStatementId ? this.bankStatementId.getValue() : null;
    }

    public getBankStatement(): BankStatementTransactionDomain | null {
        return this.bankStatement;
    }

    public getCreatedAt(): Date | null {
        return this.createdAt;
    }

    public getUpdatedAt(): Date | null {
        return this.updatedAt;
    }
}
