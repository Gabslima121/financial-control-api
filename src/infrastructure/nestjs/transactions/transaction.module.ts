import { Module } from "@nestjs/common";
import { CreateTransactionUseCase } from "src/application/transactions/create-transaction.use-case";
import { OfxParserPort } from "src/core/port/ofx-parser.port";
import { TransactionsPort } from "src/core/port/transactions.port";
import { OfxJsParserAdapter } from "src/infrastructure/adapters/ofx/out/ofx-js.parser.adapter";
import { TransactionRepository } from "src/infrastructure/adapters/transactions/out/transactions.impl";
import { TransactionController } from "./transaction.controller";
import { PrismaProvider } from "../utils/providers/prisma.provider";

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
            provide: 'OfxParserPort',
            useClass: OfxJsParserAdapter,
        },
    ],
    controllers: [TransactionController]
})
export class TransactionModule {}
