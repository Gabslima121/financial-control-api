import { Module } from "@nestjs/common";
import { PrismaProvider } from "../utils/providers/prisma.provider";
import { AccountBalanceRepository } from "src/infrastructure/adapters/account-balance/out/account-balance.impl";
import { CreateAccountBalanceUseCase } from "src/application/account-balance/create-account-balance.use-case";
import { AccountBalancePort } from "src/core/port/account-balance.port";

@Module({
    providers: [
        PrismaProvider,
        {
            provide: 'AccountBalancePort',
            useClass: AccountBalanceRepository,
        },
        {
            provide: CreateAccountBalanceUseCase,
            useFactory: (accountBalancePort: AccountBalancePort) => new CreateAccountBalanceUseCase(accountBalancePort),
            inject: ['AccountBalancePort'],
        }
    ]
})
export class AccountBalanceModule {}