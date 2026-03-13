import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AccountDomain } from 'src/core/domain/account/account.domain';
import { AccountPort } from 'src/core/port/account.port';
import { AccountDomainAdapter } from '../in/account.adapter';

import { UserDomainAdapter } from 'src/infrastructure/adapters/user/in/user.adapter';

@Injectable()
export class AccountRepository implements AccountPort {
  constructor(private readonly prisma: PrismaClient) {}

  async createAccount(account: AccountDomain): Promise<void> {
    const user = account.getUser();
    if (!user) {
      throw new Error('User is required to create an account');
    }

    await this.prisma.account.create({
      data: {
        id: account.getId(),
        userId: user.getId(),
        name: account.getName(),
        bankName: account.getBankName(),
        initialBalance: account.getInitialBalance(),
        createdAt: account.getCreatedAt() ?? new Date(),
      },
    });
  }

  async findById(id: string): Promise<AccountDomain | null> {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!account) {
      return null;
    }

    return AccountDomainAdapter.toDomain({
      id: account.id,
      user: account.user
        ? UserDomainAdapter.toDomain({
            id: account.user.id,
            name: account.user.name,
            document: account.user.document,
            email: account.user.email,
            password: account.user.password,
            createdAt: account.user.createdAt,
            updatedAt: account.user.updatedAt,
            isActive: account.user.isActive,
          })
        : null,
      name: account.name,
      bankName: account.bankName,
      initialBalance: Number(account.initialBalance),
      createdAt: account.createdAt,
    });
  }

  async listAccountsByUserId(userId: string): Promise<AccountDomain[]> {
    const accounts = await this.prisma.account.findMany({
      where: { userId },
      include: { user: true },
    });

    return accounts.map((account) =>
      AccountDomainAdapter.toDomain({
        id: account.id,
        user: account.user
          ? UserDomainAdapter.toDomain({
              id: account.user.id,
              name: account.user.name,
              document: account.user.document,
              email: account.user.email,
              password: account.user.password,
              createdAt: account.user.createdAt,
              updatedAt: account.user.updatedAt,
              isActive: account.user.isActive,
            })
          : null,
        name: account.name,
        bankName: account.bankName,
        initialBalance: Number(account.initialBalance),
        createdAt: account.createdAt,
      }),
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
