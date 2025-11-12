import { Module } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CreateTransactionUseCase } from "../../../application/transaction/create-transaction.usecase";
import { CategoryPort } from "../../../core/port/category.port";
import { TransactionPort } from "../../../core/port/transaction.port";
import { PrismaTransactionRepository } from "../../adapters/transaction/out/transaction.repository.adapter";
import { TransactionController } from "../controllers/transaction.controller";
import { PrismaProvider } from "../providers/prisma.provider";
import { CategoryModule } from "./category.module";

@Module({
  imports: [CategoryModule],
  providers: [
    PrismaProvider,
    {
      provide: 'TransactionPort',
      useFactory: (prisma: PrismaClient) => new PrismaTransactionRepository(prisma),
      inject: [PrismaClient],
    },
    {
      provide: CreateTransactionUseCase,
      useFactory: (
        transactionPort: TransactionPort,
        categoryPort: CategoryPort
      ) => new CreateTransactionUseCase(
        transactionPort,
        categoryPort
      ),
      inject: ['TransactionPort', 'CategoryPort'],
    }
  ],
  controllers: [TransactionController],
})
export class TransactionModule {}