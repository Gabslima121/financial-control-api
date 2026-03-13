import { Injectable } from "@nestjs/common";
import { PrismaClient, TransactionType as PrismaTransactionType, TransactionStatus as PrismaTransactionStatus, PaymentMethod as PrismaPaymentMethod } from "@prisma/client";
import { FinancialTransactionDomain } from "src/core/domain/financial-transaction/financial-transaction.domain";
import { FinancialTransactionPort } from "src/core/port/financial-transaction.port";
import { FinancialTransactionAdapter } from "../in/financial-transaction.adapter";
import { PaymentMethod, TransactionStatus, TransactionType } from "src/core/domain/financial-transaction/dto";

import { AccountDomainAdapter } from "src/infrastructure/adapters/account/in/account.adapter";
import { BankStatementTransactionAdapter } from "src/infrastructure/adapters/bank-statement-transaction/in/bank-statement-transaction.adapter";
import { UserDomainAdapter } from "src/infrastructure/adapters/user/in/user.adapter";

@Injectable()
export class FinancialTransactionRepository implements FinancialTransactionPort {
    constructor(private readonly prisma: PrismaClient) {}

    async getPendingTransactionsByAccountId(accountId: string): Promise<FinancialTransactionDomain[]> {
        const transactions = await this.prisma.financialTransaction.findMany({
            where: {
                accountId,
                status: TransactionStatus.PENDING,
                type: TransactionType.EXPENSE,
            },
            include: {
                account: { include: { user: true } },
                bankStatement: { include: { account: { include: { user: true } } } },
            },
        });

        return transactions.map((transaction) =>
            FinancialTransactionAdapter.toDomain({
                id: transaction.id,
                account: transaction.account ? AccountDomainAdapter.toDomain({
                    id: transaction.account.id,
                    name: transaction.account.name,
                    bankName: transaction.account.bankName,
                    initialBalance: Number(transaction.account.initialBalance),
                    createdAt: transaction.account.createdAt,
                    user: transaction.account.user ? UserDomainAdapter.toDomain({
                        id: transaction.account.user.id,
                        name: transaction.account.user.name,
                        document: transaction.account.user.document,
                        email: transaction.account.user.email,
                        password: transaction.account.user.password,
                        createdAt: transaction.account.user.createdAt,
                        updatedAt: transaction.account.user.updatedAt,
                        isActive: transaction.account.user.isActive,
                    }) : null,
                }) : null,
                type: transaction.type as TransactionType,
                status: transaction.status as TransactionStatus,
                amount: Number(transaction.amount),
                description: transaction.description,
                paymentMethod: transaction.paymentMethod as PaymentMethod,
                dueDate: transaction.dueDate,
                paidAt: transaction.paidAt,
                installments: transaction.installments,
                installment: transaction.installment,
                bankStatement: transaction.bankStatement ? BankStatementTransactionAdapter.toDTO(BankStatementTransactionAdapter.toDomain({
                    id: transaction.bankStatement.id,
                    accountId: transaction.bankStatement.accountId,
                    account: transaction.bankStatement.account ? AccountDomainAdapter.toDTO(AccountDomainAdapter.toDomain({
                        id: transaction.bankStatement.account.id,
                        name: transaction.bankStatement.account.name,
                        bankName: transaction.bankStatement.account.bankName,
                        initialBalance: Number(transaction.bankStatement.account.initialBalance),
                        createdAt: transaction.bankStatement.account.createdAt,
                        user: transaction.bankStatement.account.user ? UserDomainAdapter.toDomain({
                            id: transaction.bankStatement.account.user.id,
                            name: transaction.bankStatement.account.user.name,
                            document: transaction.bankStatement.account.user.document,
                            email: transaction.bankStatement.account.user.email,
                            password: transaction.bankStatement.account.user.password,
                            createdAt: transaction.bankStatement.account.user.createdAt,
                            updatedAt: transaction.bankStatement.account.user.updatedAt,
                            isActive: transaction.bankStatement.account.user.isActive,
                        }) : null,
                    })) : null,
                    fitId: transaction.bankStatement.fitId,
                    amount: Number(transaction.bankStatement.amount),
                    postedAt: transaction.bankStatement.postedAt,
                    description: transaction.bankStatement.description,
                    rawType: transaction.bankStatement.rawType,
                    createdAt: transaction.bankStatement.createdAt,
                })) : null,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,
            })
        );
    }

    async create(transaction: FinancialTransactionDomain): Promise<void> {
        await this.prisma.financialTransaction.create({
            data: {
                id: transaction.getId(),
                type: transaction.getType() as PrismaTransactionType,
                status: transaction.getStatus() as PrismaTransactionStatus,
                amount: transaction.getAmount(),
                description: transaction.getDescription(),
                paymentMethod: transaction.getPaymentMethod() as PrismaPaymentMethod,
                dueDate: transaction.getDueDate(),
                paidAt: transaction.getPaidAt(),
                installments: transaction.getInstallments(),
                installment: transaction.getInstallment(),
                accountId: transaction.getAccount()?.getId()!,
                bankStatementId: transaction.getBankStatement()?.getId()!,
                createdAt: transaction.getCreatedAt()!,
                updatedAt: transaction.getUpdatedAt()!,
            },
        });
    }

    async findById(id: string): Promise<FinancialTransactionDomain | null> {
        const transaction = await this.prisma.financialTransaction.findUnique({
            where: { id },
            include: {
                account: { include: { user: true } },
                bankStatement: { include: { account: { include: { user: true } } } },
            },
        });

        if (!transaction) {
            return null;
        }

        return FinancialTransactionAdapter.toDomain({
            id: transaction.id,
            account: transaction.account ? AccountDomainAdapter.toDomain({
                id: transaction.account.id,
                name: transaction.account.name,
                bankName: transaction.account.bankName,
                initialBalance: Number(transaction.account.initialBalance),
                createdAt: transaction.account.createdAt,
                user: transaction.account.user ? UserDomainAdapter.toDomain({
                    id: transaction.account.user.id,
                    name: transaction.account.user.name,
                    document: transaction.account.user.document,
                    email: transaction.account.user.email,
                    password: transaction.account.user.password,
                    createdAt: transaction.account.user.createdAt,
                    updatedAt: transaction.account.user.updatedAt,
                    isActive: transaction.account.user.isActive,
                }) : null,
            }) : null,
            type: transaction.type as TransactionType,
            status: transaction.status as TransactionStatus,
            amount: Number(transaction.amount),
            description: transaction.description,
            paymentMethod: transaction.paymentMethod as PaymentMethod,
            dueDate: transaction.dueDate,
            paidAt: transaction.paidAt,
            installments: transaction.installments,
            installment: transaction.installment,
            bankStatement: transaction.bankStatement ? BankStatementTransactionAdapter.toDTO(BankStatementTransactionAdapter.toDomain({
                id: transaction.bankStatement.id,
                accountId: transaction.bankStatement.accountId,
                account: transaction.bankStatement.account ? AccountDomainAdapter.toDTO(AccountDomainAdapter.toDomain({
                    id: transaction.bankStatement.account.id,
                    name: transaction.bankStatement.account.name,
                    bankName: transaction.bankStatement.account.bankName,
                    initialBalance: Number(transaction.bankStatement.account.initialBalance),
                    createdAt: transaction.bankStatement.account.createdAt,
                    user: transaction.bankStatement.account.user ? UserDomainAdapter.toDomain({
                        id: transaction.bankStatement.account.user.id,
                        name: transaction.bankStatement.account.user.name,
                        document: transaction.bankStatement.account.user.document,
                        email: transaction.bankStatement.account.user.email,
                        password: transaction.bankStatement.account.user.password,
                        createdAt: transaction.bankStatement.account.user.createdAt,
                        updatedAt: transaction.bankStatement.account.user.updatedAt,
                        isActive: transaction.bankStatement.account.user.isActive,
                    }) : null,
                })) : null,
                fitId: transaction.bankStatement.fitId,
                amount: Number(transaction.bankStatement.amount),
                postedAt: transaction.bankStatement.postedAt,
                description: transaction.bankStatement.description,
                rawType: transaction.bankStatement.rawType,
                createdAt: transaction.bankStatement.createdAt,
            })) : null,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        });
    }

    async listByAccountId(accountId: string): Promise<FinancialTransactionDomain[]> {
        const transactions = await this.prisma.financialTransaction.findMany({
            where: { accountId },
            include: {
                account: { include: { user: true } },
                bankStatement: { include: { account: { include: { user: true } } } },
            },
        });

        return transactions.map((transaction) =>
            FinancialTransactionAdapter.toDomain({
                id: transaction.id,
                account: transaction.account ? AccountDomainAdapter.toDomain({
                    id: transaction.account.id,
                    name: transaction.account.name,
                    bankName: transaction.account.bankName,
                    initialBalance: Number(transaction.account.initialBalance),
                    createdAt: transaction.account.createdAt,
                    user: transaction.account.user ? UserDomainAdapter.toDomain({
                        id: transaction.account.user.id,
                        name: transaction.account.user.name,
                        document: transaction.account.user.document,
                        email: transaction.account.user.email,
                        password: transaction.account.user.password,
                        createdAt: transaction.account.user.createdAt,
                        updatedAt: transaction.account.user.updatedAt,
                        isActive: transaction.account.user.isActive,
                    }) : null,
                }) : null,
                type: transaction.type as TransactionType,
                status: transaction.status as TransactionStatus,
                amount: Number(transaction.amount),
                description: transaction.description,
                paymentMethod: transaction.paymentMethod as PaymentMethod,
                dueDate: transaction.dueDate,
                paidAt: transaction.paidAt,
                installments: transaction.installments,
                installment: transaction.installment,
                bankStatement: transaction.bankStatement ? BankStatementTransactionAdapter.toDTO(BankStatementTransactionAdapter.toDomain({
                    id: transaction.bankStatement.id,
                    accountId: transaction.bankStatement.accountId,
                    account: transaction.bankStatement.account ? AccountDomainAdapter.toDTO(AccountDomainAdapter.toDomain({
                        id: transaction.bankStatement.account.id,
                        name: transaction.bankStatement.account.name,
                        bankName: transaction.bankStatement.account.bankName,
                        initialBalance: Number(transaction.bankStatement.account.initialBalance),
                        createdAt: transaction.bankStatement.account.createdAt,
                        user: transaction.bankStatement.account.user ? UserDomainAdapter.toDomain({
                            id: transaction.bankStatement.account.user.id,
                            name: transaction.bankStatement.account.user.name,
                            document: transaction.bankStatement.account.user.document,
                            email: transaction.bankStatement.account.user.email,
                            password: transaction.bankStatement.account.user.password,
                            createdAt: transaction.bankStatement.account.user.createdAt,
                            updatedAt: transaction.bankStatement.account.user.updatedAt,
                            isActive: transaction.bankStatement.account.user.isActive,
                        }) : null,
                    })) : null,
                    fitId: transaction.bankStatement.fitId,
                    amount: Number(transaction.bankStatement.amount),
                    postedAt: transaction.bankStatement.postedAt,
                    description: transaction.bankStatement.description,
                    rawType: transaction.bankStatement.rawType,
                    createdAt: transaction.bankStatement.createdAt,
                })) : null,
                createdAt: transaction.createdAt,
                updatedAt: transaction.updatedAt,
            })
        );
    }

    async update(transaction: FinancialTransactionDomain): Promise<void> {
        await this.prisma.financialTransaction.update({
            where: { id: transaction.getId() },
            data: {
                status: transaction.getStatus() as PrismaTransactionStatus,
                paidAt: transaction.getPaidAt(),
                bankStatementId: transaction.getBankStatement()?.getId(),
                updatedAt: new Date(),
            },
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.financialTransaction.delete({
            where: { id },
        });
    }

    async findMatchingTransaction(
        accountId: string,
        amount: number,
        dateRange: { start: Date; end: Date },
    ): Promise<FinancialTransactionDomain | null> {
        const transaction = await this.prisma.financialTransaction.findFirst({
            where: {
                accountId,
                amount: Math.abs(amount), // Assuming financial transaction amount is positive for comparison
                status: PrismaTransactionStatus.pending,
                paidAt: null,
                bankStatementId: null,
                dueDate: {
                    gte: dateRange.start,
                    lte: dateRange.end,
                },
            },
            include: {
                account: { include: { user: true } },
                bankStatement: { include: { account: { include: { user: true } } } },
            },
        });

        if (!transaction) {
            return null;
        }

        return FinancialTransactionAdapter.toDomain({
            id: transaction.id,
            account: transaction.account ? AccountDomainAdapter.toDomain({
                id: transaction.account.id,
                name: transaction.account.name,
                bankName: transaction.account.bankName,
                initialBalance: Number(transaction.account.initialBalance),
                createdAt: transaction.account.createdAt,
                user: transaction.account.user ? UserDomainAdapter.toDomain({
                    id: transaction.account.user.id,
                    name: transaction.account.user.name,
                    document: transaction.account.user.document,
                    email: transaction.account.user.email,
                    password: transaction.account.user.password,
                    createdAt: transaction.account.user.createdAt,
                    updatedAt: transaction.account.user.updatedAt,
                    isActive: transaction.account.user.isActive,
                }) : null,
            }) : null,
            type: transaction.type as TransactionType,
            status: transaction.status as TransactionStatus,
            amount: Number(transaction.amount),
            description: transaction.description,
            paymentMethod: transaction.paymentMethod as PaymentMethod,
            dueDate: transaction.dueDate,
            paidAt: transaction.paidAt,
            installments: transaction.installments,
            installment: transaction.installment,
            bankStatement: transaction.bankStatement ? BankStatementTransactionAdapter.toDTO(BankStatementTransactionAdapter.toDomain({
                id: transaction.bankStatement.id,
                accountId: transaction.bankStatement.accountId,
                account: transaction.bankStatement.account ? AccountDomainAdapter.toDTO(AccountDomainAdapter.toDomain({
                    id: transaction.bankStatement.account.id,
                    name: transaction.bankStatement.account.name,
                    bankName: transaction.bankStatement.account.bankName,
                    initialBalance: Number(transaction.bankStatement.account.initialBalance),
                    createdAt: transaction.bankStatement.account.createdAt,
                    user: transaction.bankStatement.account.user ? UserDomainAdapter.toDomain({
                        id: transaction.bankStatement.account.user.id,
                        name: transaction.bankStatement.account.user.name,
                        document: transaction.bankStatement.account.user.document,
                        email: transaction.bankStatement.account.user.email,
                        password: transaction.bankStatement.account.user.password,
                        createdAt: transaction.bankStatement.account.user.createdAt,
                        updatedAt: transaction.bankStatement.account.user.updatedAt,
                        isActive: transaction.bankStatement.account.user.isActive,
                    }) : null,
                })) : null,
                fitId: transaction.bankStatement.fitId,
                amount: Number(transaction.bankStatement.amount),
                postedAt: transaction.bankStatement.postedAt,
                description: transaction.bankStatement.description,
                rawType: transaction.bankStatement.rawType,
                createdAt: transaction.bankStatement.createdAt,
            })) : null,
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        });
    }
}
