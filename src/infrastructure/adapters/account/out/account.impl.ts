import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { AccountDomain } from "src/core/domain/account/account.domain";
import { AccountPort } from "src/core/port/account.port";
import { AccountDomainAdapter } from "../in/account.adapter";

@Injectable()
export class AccountRepository implements AccountPort {
    constructor(private readonly prisma: PrismaClient) {}

    async createAccount(account: AccountDomain): Promise<void> {
        await this.prisma.account.create({
            data: {
                id: account.getId(),
                userId: account.getUserId(),
                name: account.getName(),
                bankName: account.getBankName(),
                initialBalance: account.getInitialBalance(),
                createdAt: account.getCreatedAt()!,
            },
        });
    }

    async findById(id: string): Promise<AccountDomain | null> {
        const account = await this.prisma.account.findUnique({
            where: { id },
        });

        if (!account) {
            return null;
        }

        return AccountDomainAdapter.toDomain({
            id: account.id,
            userId: account.userId,
            name: account.name,
            bankName: account.bankName,
            initialBalance: account.initialBalance.toNumber(),
            createdAt: account.createdAt,
        });
    }

    async listAccountsByUserId(userId: string): Promise<AccountDomain[]> {
        const accounts = await this.prisma.account.findMany({
            where: { userId },
        });

        return accounts.map((account) =>
            AccountDomainAdapter.toDomain({
                id: account.id,
                userId: account.userId,
                name: account.name,
                bankName: account.bankName,
                initialBalance: account.initialBalance.toNumber(),
                createdAt: account.createdAt,
            })
        );
    }

    async updateAccount(account: AccountDomain): Promise<void> {
        await this.prisma.account.update({
            where: { id: account.getId() },
            data: {
                name: account.getName(),
                bankName: account.getBankName(),
                initialBalance: account.getInitialBalance(),
            },
        });
    }

    async deleteAccount(id: string): Promise<void> {
        await this.prisma.account.delete({
            where: { id },
        });
    }
}
