import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { AccountBalanceDomain } from "src/core/domain/account-balance/account-balance.domain";
import { AccountBalancePort } from "src/core/port/account-balance.port";

@Injectable()
export class AccountBalanceRepository implements AccountBalancePort {

    constructor(
        private readonly prismaService: PrismaClient,
    ) {}

    async createAccountBalance(params: AccountBalanceDomain): Promise<void> {
        await this.prismaService.accountBalance.create({
            data: {
                balanceId: params.getBalanceId(),
                userId: params.getUser()?.getUserId()!,
                balance: params.getBalance(),
                balanceDate: params.getBalanceDate(),
                notes: params.getNotes(),
            },
        });
    }
}