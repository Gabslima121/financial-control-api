import { Module } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CreateAccountBalanceUseCase } from "../../../application/account-balance/create-account-balance.usecase";
import { AccountBalancePort } from "../../../core/port/account-balance.port";
import { TransactionPort } from "../../../core/port/transaction.port";
import { AccountBalanceRepositoryAdapter } from "../../adapters/account-balance/out/account-balance.repository.adapter";
import { AccountBalanceController } from "../controllers/account-balance.controller";
import { PrismaProvider } from "../providers/prisma.provider";
import { TransactionModule } from "./transaction.module";

@Module({
  imports: [TransactionModule],
  providers: [
    PrismaProvider,
    {
      provide: 'AccountBalancePort',
      useFactory: (
        prisma: PrismaClient
      ) => new AccountBalanceRepositoryAdapter(prisma),
      inject: [PrismaClient],
    },
    {
      provide: CreateAccountBalanceUseCase,
      useFactory: (
        accountBalancePort: AccountBalancePort,
        transactionPort: TransactionPort,
      ) => new CreateAccountBalanceUseCase(
        accountBalancePort,
        transactionPort,
      ),
      inject: ['AccountBalancePort', 'TransactionPort'],
    }
  ],
  controllers: [AccountBalanceController]
})
export class AccountBalanceModule {}