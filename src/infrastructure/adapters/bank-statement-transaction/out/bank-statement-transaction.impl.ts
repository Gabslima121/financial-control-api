import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { BankStatementTransactionDomain } from "src/core/domain/bank-statement-transaction/bank-statement-transaction.domain";
import { BankStatementTransactionPort } from "src/core/port/bank-statement-transaction.port";
import { BankStatementTransactionAdapter } from "../in/bank-statement-transaction.adapter";

import { AccountDomainAdapter } from "src/infrastructure/adapters/account/in/account.adapter";
import { UserDomainAdapter } from "src/infrastructure/adapters/user/in/user.adapter";

@Injectable()
export class BankStatementTransactionRepository implements BankStatementTransactionPort {
    constructor(private readonly prisma: PrismaClient) {}

    async sumAmountByAccountId(accountId: string): Promise<number> {
        const sum = await this.prisma.bankStatementTransaction.aggregate({
            where: { accountId },
            _sum: { amount: true },
        });

        return Number(sum._sum.amount || 0);
    }

    async create(transaction: BankStatementTransactionDomain): Promise<void> {
        await this.prisma.bankStatementTransaction.create({
            data: {
                id: transaction.getId(),
                accountId: transaction.getAccountId(),
                fitId: transaction.getFitId(),
                amount: transaction.getAmount(),
                postedAt: transaction.getPostedAt(),
                description: transaction.getDescription(),
                rawType: transaction.getRawType(),
                createdAt: transaction.getCreatedAt()!,
            },
        });
    }

    async findByFitId(accountId: string, fitId: string): Promise<BankStatementTransactionDomain | null> {
        const transaction = await this.prisma.bankStatementTransaction.findUnique({
            where: {
                accountId_fitId: {
                    accountId,
                    fitId,
                },
            },
            include: { account: { include: { user: true } } },
        });

        if (!transaction) {
            return null;
        }

        return BankStatementTransactionAdapter.toDomain({
            id: transaction.id,
            accountId: transaction.accountId,
            account: transaction.account ? AccountDomainAdapter.toDTO(AccountDomainAdapter.toDomain({
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
            })) : null,
            fitId: transaction.fitId,
            amount: Number(transaction.amount),
            postedAt: transaction.postedAt,
            description: transaction.description,
            rawType: transaction.rawType,
            createdAt: transaction.createdAt,
        });
    }

    async listByAccountId(accountId: string): Promise<BankStatementTransactionDomain[]> {
        const transactions = await this.prisma.bankStatementTransaction.findMany({
            where: { accountId },
            orderBy: { postedAt: "desc" },
            include: { account: { include: { user: true } } },
        });

        return transactions.map((transaction) =>
            BankStatementTransactionAdapter.toDomain({
                id: transaction.id,
                accountId: transaction.accountId,
                account: transaction.account ? AccountDomainAdapter.toDTO(AccountDomainAdapter.toDomain({
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
                })) : null,
                fitId: transaction.fitId,
                amount: Number(transaction.amount),
                postedAt: transaction.postedAt,
                description: transaction.description,
                rawType: transaction.rawType,
                createdAt: transaction.createdAt,
            })
        );
    }
}
