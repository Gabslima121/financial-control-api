import { PrismaClient } from "@prisma/client";
import { AccountBalanceDomain } from "../../../../core/domain/account-balance/account-balance.domain";
import { AccountBalancePort } from "../../../../core/port/account-balance.port";
import { AccountBalanceDomainAdapter } from "../in/account-balance.domain.adapter";

export class AccountBalanceRepositoryAdapter implements AccountBalancePort {
  constructor(
    private readonly prisma: PrismaClient,
  ) {}

  async findLatestAccountBalance(userId: string): Promise<AccountBalanceDomain | null> {
    const accountBalance = await this.prisma.accountBalance.findFirst({
      where: { userId },
      orderBy: { balanceDate: 'desc' },
    });

    if (!accountBalance) {
      return null;
    }

    return AccountBalanceDomainAdapter.toDomain({
      balanceId: accountBalance.balanceId,
      balance: accountBalance.balance.toNumber(),
      balanceDate: accountBalance.balanceDate,
      description: accountBalance.notes || '',
    });
  }

  async createAccountBalance(amount: number, userId: string): Promise<AccountBalanceDomain> {
    const accountBalance = await this.prisma.accountBalance.create({
      data: {
        balance: amount,
        userId,
        balanceDate: new Date(),
      }
    })

    return AccountBalanceDomainAdapter.toDomain({
      balanceId: accountBalance.balanceId,
      balance: accountBalance.balance.toNumber(),
      balanceDate: accountBalance.balanceDate,
      description: accountBalance.notes || '',
    });
  }
}