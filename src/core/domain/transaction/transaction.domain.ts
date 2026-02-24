import { UuidValueObject } from "src/shared/value-object/uuid-value-object.vo";
import { UserDomain } from "../user/user.domain";
import { PaymentMethod, TransactionStatus, TransactionType } from "@prisma/client";
import { TransactionDomainDTO } from "./dto";

export class TransactionDomain {
    private readonly transactionId: UuidValueObject;
    private readonly user: UserDomain | null;
    private readonly type: TransactionType;
    private readonly amount: number;
    private readonly paymentMethod: PaymentMethod;
    private readonly installments: number | null;
    private readonly currentInstallment: number | null;
    private readonly description: string | null;
    private transactionStatus: TransactionStatus;
    private readonly transactionDate: Date;
    private readonly dueDate: Date | null;
    private readonly paymentDate: Date | null;
    private readonly createdAt: Date | null;
    private readonly updatedAt: Date | null;

    private constructor(props: TransactionDomainDTO) {
        this.transactionId = props.transactionId ? new UuidValueObject(props.transactionId) : new UuidValueObject();
        this.user = props.user!;
        this.type = props.type as TransactionType;
        this.amount = props.amount;
        this.paymentMethod = props.paymentMethod as PaymentMethod;
        this.installments = props.installments;
        this.currentInstallment = props.currentInstallment;
        this.description = props.description;
        this.transactionStatus = props.transactionStatus as TransactionStatus;
        this.transactionDate = props.transactionDate;
        this.dueDate = props.dueDate;
        this.paymentDate = props.paymentDate;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
    }

    public static create(props: TransactionDomainDTO): TransactionDomain {
        return new TransactionDomain(props);
    }

    public getTransactionId(): string {
        return this.transactionId.getValue();
    }

    public getUser(): UserDomain | null {
        return this.user;
    }

    public getType(): TransactionType {
        return this.type;
    }

    public getAmount(): number {
        return this.amount;
    }

    public getPaymentMethod(): PaymentMethod {
        return this.paymentMethod;
    }

    public getInstallments(): number | null {
        return this.installments;
    }

    public getCurrentInstallment(): number | null {
        return this.currentInstallment;
    }

    public getDescription(): string | null {
        return this.description;
    }

    public getTransactionStatus(): TransactionStatus {
        return this.transactionStatus;
    }

    public getTransactionDate(): Date {
        return this.transactionDate;
    }

    public getDueDate(): Date | null {
        return this.dueDate;
    }

    public getPaymentDate(): Date | null {
        return this.paymentDate;
    }

    public getCreatedAt(): Date | null {
        return this.createdAt;
    }

    public getUpdatedAt(): Date | null {
        return this.updatedAt;
    }

    public setTransactionStatus(status: TransactionStatus): void {
        this.transactionStatus = status;
    }
}