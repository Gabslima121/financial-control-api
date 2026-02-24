import { Module } from "@nestjs/common";
import { CreateTransactionUseCase } from "src/application/transactions/create-transaction.use-case";
import { OfxParserPort } from "src/core/port/ofx-parser.port";
import { TransactionsPort } from "src/core/port/transactions.port";
import { OfxJsParserAdapter } from "src/infrastructure/adapters/ofx/out/ofx-js.parser.adapter";
import { TransactionRepository } from "src/infrastructure/adapters/transactions/out/transactions.impl";
import { TransactionController } from "./transaction.controller";
import { PrismaProvider } from "../utils/providers/prisma.provider";
import { GetTransactionsByPeriodUseCase } from "src/application/transactions/get-transactions-by-period.use-case";
import { CreateFutureTransactionUseCase } from "src/application/transactions/create-future-transactions.use-case";
import { GetTransactionsWithParamsUseCase } from "src/application/transactions/get-transactions-with-params.use-case";

@Module({
    providers: [
        PrismaProvider,
        {
            provide: 'TransactionsPort',
            useClass: TransactionRepository,
        },
        {
            provide: CreateTransactionUseCase,
            useFactory: (transactionsPort: TransactionsPort, ofxParserPort: OfxParserPort) => new CreateTransactionUseCase(
                transactionsPort,
                ofxParserPort,
            ),
            inject: ['TransactionsPort', 'OfxParserPort'],
        },
        {
            provide: GetTransactionsByPeriodUseCase,
            useFactory: (transactionsPort: TransactionsPort) => new GetTransactionsByPeriodUseCase(
                transactionsPort,
            ),
            inject: ['TransactionsPort'],
        },
        {
            provide: CreateFutureTransactionUseCase,
            useFactory: (futureTransactionsPort: TransactionsPort) => new CreateFutureTransactionUseCase(
                futureTransactionsPort,
            ),
            inject: ['TransactionsPort'],
        },
        {
            provide: GetTransactionsWithParamsUseCase,
            useFactory: (transactionsPort: TransactionsPort) => new GetTransactionsWithParamsUseCase(
                transactionsPort,
            ),
            inject: ['TransactionsPort'],
        },
        {
            provide: 'OfxParserPort',
            useClass: OfxJsParserAdapter,
        },
    ],
    controllers: [TransactionController],
    exports: [GetTransactionsByPeriodUseCase, GetTransactionsWithParamsUseCase],
})
export class TransactionModule {}
