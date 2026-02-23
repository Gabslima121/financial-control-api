import { UserDomain } from "../../user/user.domain";

export interface TransactionDomainDTO {
    transactionId: string;
    user: UserDomain | null;
    type: string;
    amount: number;
    paymentMethod: string;
    installments: number | null;
    currentInstallment: number | null;
    description: string | null;
    transactionStatus: string;
    transactionDate: Date;
    dueDate: Date | null;
    paymentDate: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}